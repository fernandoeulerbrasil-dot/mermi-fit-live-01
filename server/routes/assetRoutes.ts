import { Router, Response } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { cloudDb } from '../cloudDb';
import { adminStorage } from '../../src/lib/firebase-admin';
import { requireAuth, requireRole, AuthenticatedRequest } from '../auth';

export const assetRouter = Router();

const UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'assets', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

let gcsChecked = false;
let gcsAvailable = false;

async function checkGcsAvailability(): Promise<boolean> {
  if (gcsChecked) return gcsAvailable;
  try {
    const bucket = adminStorage.bucket();
    const [exists] = await bucket.exists();
    gcsAvailable = exists;
    gcsChecked = true;
  } catch {
    gcsAvailable = false;
    gcsChecked = true;
  }
  return gcsAvailable;
}

/**
 * Listagem pública / autenticada de assets ativos e mappings a partir do Cloud SQL
 */
assetRouter.get('/', async (_req, res) => {
  try {
    const data = await cloudDb.getAssets();
    res.json(data);
  } catch (err: any) {
    console.error('Error fetching assets from Cloud SQL:', err);
    res.status(500).json({ error: 'Erro ao listar assets de produção.' });
  }
});

/**
 * Obter histórico de versões de um asset para Rollback
 */
assetRouter.get('/:id/history', async (req, res) => {
  try {
    const assetId = req.params.id;
    const history = await cloudDb.getAssetHistory(assetId);
    res.json({ history });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao buscar histórico de versões.' });
  }
});

/**
 * Obter mapa de uso ("Onde este asset é usado?")
 */
assetRouter.get('/:id/usage', async (req, res) => {
  try {
    const assetId = req.params.id;
    const all = await cloudDb.getAssets();
    const target = all.assets.find((a) => a.asset_id === assetId);
    const mappings = all.mappings.filter((m) => m.asset_id === assetId);

    res.json({
      assetId,
      assetName: target?.name,
      usageCount: mappings.length,
      mappings,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao consultar mapeamento de uso.' });
  }
});

/**
 * Upload Real de Imagem (Apenas OWNER ou ADMIN)
 * Grava tanto localmente para cache rápido quanto no Cloud Storage
 */
assetRouter.post('/upload', requireAuth, requireRole('OWNER', 'ADMIN', 'CONTENT'), async (req: AuthenticatedRequest, res: Response) => {
  const { fileName, fileBase64, mimeType } = req.body;

  if (!fileName || !fileBase64) {
    return res.status(400).json({ error: 'Arquivo e nome são obrigatórios.' });
  }

  const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
  const ext = path.extname(fileName).toLowerCase();
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];

  if (!allowedExtensions.includes(ext)) {
    return res.status(400).json({ error: `Extensão não permitida (${ext}). Permitidas: PNG, JPG, WEBP, SVG.` });
  }

  if (mimeType && !allowedMimeTypes.includes(mimeType)) {
    return res.status(400).json({ error: `Tipo MIME não permitido (${mimeType}).` });
  }

  const base64Clean = fileBase64.replace(/^data:image\/\w+;base64,/, '');
  const fileBuffer = Buffer.from(base64Clean, 'base64');

  if (fileBuffer.length > 15 * 1024 * 1024) {
    return res.status(400).json({ error: 'Arquivo muito grande. O limite é 15MB.' });
  }

  const safeName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const storedFileName = `asset_${Date.now()}_${safeName}`;
  const localTargetPath = path.join(UPLOADS_DIR, storedFileName);

  // 1. Gravar localmente para disponibilidade imediata
  fs.writeFileSync(localTargetPath, fileBuffer);
  let fileUrl = `/assets/uploads/${storedFileName}`;

  // 2. Persistência em nuvem se o Cloud Storage / Firebase Storage estiver disponível
  try {
    const canUseGcs = await checkGcsAvailability();
    if (canUseGcs) {
      const bucket = adminStorage.bucket();
      const gcsFile = bucket.file(`assets/${storedFileName}`);
      await gcsFile.save(fileBuffer, {
        contentType: mimeType || 'image/png',
        metadata: {
          uploadedBy: req.user!.name,
          uploadedAt: new Date().toISOString(),
        },
      });
    }
  } catch (_err) {
    gcsAvailable = false;
    // Armazenamento local já garantiu a persistência física do arquivo
  }

  res.status(201).json({
    success: true,
    fileUrl,
    storagePath: localTargetPath,
    fileSize: fileBuffer.length,
    mimeType: mimeType || 'image/png',
  });
});

/**
 * Substituir Asset com Versionamento e Histórico no Cloud SQL
 */
assetRouter.put('/:id/replace', requireAuth, requireRole('OWNER', 'ADMIN', 'CONTENT'), async (req: AuthenticatedRequest, res: Response) => {
  const assetId = req.params.id;
  const { newFileUrl, newStoragePath, reason } = req.body;

  if (!newFileUrl) {
    return res.status(400).json({ error: 'Nova URL do arquivo é obrigatória.' });
  }

  try {
    const result = await cloudDb.replaceAsset({
      assetId,
      newFileUrl,
      newStoragePath,
      reason,
      adminName: req.user!.name,
      adminRole: req.user!.role,
    });

    res.json({
      success: true,
      message: `Asset substituído com sucesso para a versão v${result.version} no Cloud SQL.`,
      asset_id: assetId,
      version: result.version,
      file_url: result.fileUrl,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao substituir asset: ' + err.message });
  }
});

/**
 * Rollback de Versão de Asset no Cloud SQL
 */
assetRouter.post('/:id/rollback', requireAuth, requireRole('OWNER', 'ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  const assetId = req.params.id;
  const { targetVersion } = req.body;

  if (!targetVersion) {
    return res.status(400).json({ error: 'Versão de destino é obrigatória.' });
  }

  try {
    const result = await cloudDb.rollbackAsset({
      assetId,
      targetVersion: Number(targetVersion),
      adminName: req.user!.name,
      adminRole: req.user!.role,
    });

    res.json({
      success: true,
      message: `Rollback realizado com sucesso para a versão v${targetVersion}. Versão ativa atual: v${result.version}.`,
      asset_id: assetId,
      version: result.version,
      file_url: result.fileUrl,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro no rollback: ' + err.message });
  }
});

/**
 * Cadastrar Novo Asset no Cloud SQL
 */
assetRouter.post('/', requireAuth, requireRole('OWNER', 'ADMIN', 'CONTENT'), async (req: AuthenticatedRequest, res: Response) => {
  const {
    name,
    description,
    file_url,
    storage_path,
    category,
    page,
    component,
    slot,
    order_num,
    status,
    is_official,
    mime_type,
    file_size,
  } = req.body;

  if (!name || !file_url || !category || !page || !component) {
    return res.status(400).json({
      error: 'Nome, URL do arquivo, Categoria, Página e Componente são obrigatórios.',
    });
  }

  try {
    const result = await cloudDb.createAsset({
      name,
      description,
      fileUrl: file_url,
      storagePath: storage_path,
      category,
      page,
      component,
      slot: slot || 'DEFAULT',
      orderNum: Number(order_num || 1),
      status: status || 'ACTIVE',
      isOfficial: Boolean(is_official),
      mimeType: mime_type,
      fileSize: Number(file_size || 0),
      adminName: req.user!.name,
      adminRole: req.user!.role,
    });

    res.status(201).json({
      success: true,
      message: `Asset "${name}" cadastrado com sucesso no banco de dados central!`,
      assetId: result.assetId,
      asset_id: result.assetId,
      fileUrl: result.fileUrl,
      file_url: result.fileUrl,
      name,
      category,
      version: result.version,
    });
  } catch (err: any) {
    console.error('Error creating asset:', err);
    res.status(500).json({ error: 'Erro ao cadastrar asset: ' + err.message });
  }
});

/**
 * Atualizar Metadados de um Asset
 */
assetRouter.put('/:id', requireAuth, requireRole('OWNER', 'ADMIN', 'CONTENT'), async (req: AuthenticatedRequest, res: Response) => {
  const assetId = req.params.id;
  const { name, description, category, page, component, status, is_official } = req.body;

  try {
    await cloudDb.updateAsset({
      assetId,
      name,
      description,
      category,
      page,
      component,
      status,
      isOfficial: is_official !== undefined ? Boolean(is_official) : undefined,
      adminName: req.user!.name,
      adminRole: req.user!.role,
    });

    res.json({
      success: true,
      message: 'Asset atualizado com sucesso.',
      asset_id: assetId,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao atualizar asset: ' + err.message });
  }
});

/**
 * Alternar Status (ACTIVE / INACTIVE)
 */
assetRouter.patch('/:id/status', requireAuth, requireRole('OWNER', 'ADMIN', 'CONTENT'), async (req: AuthenticatedRequest, res: Response) => {
  const assetId = req.params.id;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status é obrigatório.' });
  }

  try {
    await cloudDb.toggleAssetStatus({
      assetId,
      status,
      adminName: req.user!.name,
      adminRole: req.user!.role,
    });

    res.json({
      success: true,
      message: `Status do asset alterado para ${status}.`,
      status,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao alterar status: ' + err.message });
  }
});

/**
 * Excluir Asset do Cloud SQL (Apenas Não-Oficiais)
 */
assetRouter.delete('/:id', requireAuth, requireRole('OWNER', 'ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  const assetId = req.params.id;

  try {
    await cloudDb.deleteAsset({
      assetId,
      adminName: req.user!.name,
      adminRole: req.user!.role,
    });

    res.json({
      success: true,
      message: 'Asset e seus vínculos excluídos com sucesso.',
      asset_id: assetId,
    });
  } catch (err: any) {
    res.status(err.message.includes('oficiais') ? 403 : 500).json({
      error: err.message,
    });
  }
});

/**
 * Adicionar Mapeamento de Uso (Vincular a outro local)
 */
assetRouter.post('/:id/mapping', requireAuth, requireRole('OWNER', 'ADMIN', 'CONTENT'), async (req: AuthenticatedRequest, res: Response) => {
  const assetId = req.params.id;
  const { page, component, slot, order_num, status } = req.body;

  if (!page || !component) {
    return res.status(400).json({ error: 'Página e Componente são obrigatórios.' });
  }

  try {
    const result = await cloudDb.addAssetMapping({
      assetId,
      page,
      component,
      slot: slot || 'DEFAULT',
      orderNum: Number(order_num || 1),
      status: status || 'ACTIVE',
      adminName: req.user!.name,
      adminRole: req.user!.role,
    });

    res.status(201).json({
      success: true,
      message: 'Novo mapeamento visual vinculado com sucesso!',
      mapping_id: result.mappingId,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao vincular mapeamento: ' + err.message });
  }
});

/**
 * Remover Mapeamento de Uso
 */
assetRouter.delete('/:id/mapping/:mappingId', requireAuth, requireRole('OWNER', 'ADMIN', 'CONTENT'), async (req: AuthenticatedRequest, res: Response) => {
  const { mappingId } = req.params;

  try {
    await cloudDb.deleteAssetMapping({
      mappingId,
      adminName: req.user!.name,
      adminRole: req.user!.role,
    });

    res.json({
      success: true,
      message: 'Mapeamento visual desvinculado com sucesso.',
      mapping_id: mappingId,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao remover mapeamento: ' + err.message });
  }
});

