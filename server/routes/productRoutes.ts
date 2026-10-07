import { Router, Response } from 'express';
import { cloudDb } from '../cloudDb';
import { requireAuth, requireRole, AuthenticatedRequest } from '../auth';

export const productRouter = Router();

/**
 * Listagem Pública de Produtos e Marmitas a partir do Cloud SQL PostgreSQL
 */
productRouter.get('/', async (_req, res) => {
  try {
    const rawProducts = await cloudDb.getProducts();
    const basePrices = await cloudDb.getBasePrices();

    const formattedProducts = rawProducts.map((p: any) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      line: p.category,
      description: p.description,
      price_350g: Number(p.price350g),
      price_500g: Number(p.price500g),
      image: p.imageUrl || p.image || '',
      imageUrl: p.imageUrl || p.image || '',
      primaryImageAssetId: p.primaryImageAssetId || null,
      assetName: p.assetName || undefined,
      calories: p.calories,
      protein: p.protein,
      carbs: p.carbs,
      fat: p.fat,
      availability: p.availability ? 1 : 0,
      active: p.active ? 1 : 0,
      created_at: p.createdAt?.toISOString(),
      updated_at: p.updatedAt?.toISOString(),
    }));

    res.json({
      products: formattedProducts,
      basePrices,
    });
  } catch (err: any) {
    console.error('Error fetching products from Cloud SQL:', err);
    res.status(500).json({ error: 'Erro ao carregar cardápio de produção.' });
  }
});

/**
 * Vincular / Desvincular Imagem Principal (Asset) ao Produto no Cardápio
 */
productRouter.put('/:id/asset', requireAuth, requireRole('OWNER', 'ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  const productId = req.params.id;
  const { assetId } = req.body;

  try {
    const result = await cloudDb.updateProductImageAsset({
      productId,
      assetId: assetId ? String(assetId).trim() : null,
      adminName: req.user!.name,
      adminRole: req.user!.role,
    });

    res.json({
      success: true,
      message: result.primaryImageAssetId
        ? `Asset vinculado com sucesso ao produto!`
        : `Vínculo de imagem removido do produto.`,
      product: result,
    });
  } catch (err: any) {
    console.error('Error updating product image asset:', err);
    res.status(500).json({ error: 'Erro ao atualizar imagem do produto: ' + err.message });
  }
});

/**
 * Consulta de Preços Base Oficiais
 */
productRouter.get('/pricing', async (_req, res) => {
  try {
    const basePrices = await cloudDb.getBasePrices();
    res.json({
      basePrices,
      delivery: { fee: 9.90, free_threshold: 99.00 },
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao buscar tabela de preços.' });
  }
});

/**
 * Atualização da Tabela de Preços Oficiais (Apenas OWNER ou ADMIN)
 */
productRouter.put('/pricing', requireAuth, requireRole('OWNER', 'ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { fit_350, fit_500, premium_350, premium_500 } = req.body;

    const newPrices = {
      fit_350: Number(fit_350) || 19.90,
      fit_500: Number(fit_500) || 24.90,
      premium_350: Number(premium_350) || 32.90,
      premium_500: Number(premium_500) || 39.90,
    };

    await cloudDb.updateBasePrices(newPrices, req.user!.name);

    res.json({
      success: true,
      message: 'Tabela de preços oficiais atualizada com sucesso no banco de dados central!',
      basePrices: newPrices,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao atualizar preços: ' + err.message });
  }
});
