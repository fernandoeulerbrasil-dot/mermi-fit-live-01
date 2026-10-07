import { Router, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { cloudDb } from '../cloudDb';
import { db } from '../../src/db/index';
import { orders, users, pointsLedger } from '../../src/db/schema';
import { sql } from 'drizzle-orm';
import { requireAuth, requireRole, AuthenticatedRequest } from '../auth';

export const aiRouter = Router();

// Inicialização segura no servidor (usando process.env sem expor no client)
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Não foi possível inicializar o cliente Gemini no servidor:', err);
  }
}

/**
 * Chat da MerMi IA (Cliente) via Proxy Seguro no Servidor
 */
aiRouter.post('/chat', async (req: AuthenticatedRequest, res: Response) => {
  const { question, conversationHistory } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Pergunta é obrigatória.' });
  }

  // 1. Coletar contexto factual real do banco de dados Cloud SQL PostgreSQL
  const basePrices = await cloudDb.getBasePrices();
  const rawProducts = await cloudDb.getProducts();

  let userCtx = 'Usuário: Visitante do Ecossistema';
  if (req.user) {
    const ledger = await cloudDb.getUserLedger(req.user.id);
    const userLevel = ledger.balance >= 1000 ? 5 : ledger.balance >= 500 ? 3 : ledger.balance >= 250 ? 2 : 1;
    userCtx = `Usuário Autenticado: ${req.user.name}, Saldo Real: ${ledger.balance} MerMi Points, Nível: ${userLevel}.`;
  }

  // Se o servidor tiver a chave do Gemini configurada, executa com IA Generativa
  if (aiClient) {
    try {
      const systemInstruction = `
Você é a MerMi IA, a assistente oficial inteligente do MERMI FIT LIFE ("Mais que um app. Um estilo de vida.").
Você é representada pelo mascote robô 3D com visor de neon verde.

DIRETRIZES:
- Tom: Amigável, acolhedor, objetivo, moderno, encorajador e brasileiro.
- Saúde: NÃO forneça diagnósticos médicos, prescrições de remédios ou promessas de emagrecimento milagroso.
- NUNCA invente preços, promoções ou pontos. Utilize estritamente os dados oficiais abaixo:

DADOS REAIS DO BANCO DE DADOS:
- ${userCtx}
- Tabela Oficial de Marmitas:
  * Linha Fit: 350g = R$ ${basePrices.fit_350.toFixed(2).replace('.', ',')} | 500g = R$ ${basePrices.fit_500.toFixed(2).replace('.', ',')}
  * Linha Fit Premium: 350g = R$ ${basePrices.premium_350.toFixed(2).replace('.', ',')} | 500g = R$ ${basePrices.premium_500.toFixed(2).replace('.', ',')}
- Regra de Ouro da Personalização: Trocar proteínas, carboidratos ou legumes dentro da mesma linha NÃO altera o preço base!
- Principais Pratos: ${rawProducts.map((p: any) => p.name).join(', ')}
`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: `${systemInstruction}\n\nPergunta do usuário: "${question}"\n\nResponda em português brasileiro de forma empática e sucinta:` }
            ]
          }
        ]
      });

      if (response.text) {
        return res.json({
          text: response.text.trim(),
          source: 'GEMINI_SERVER_SECURE'
        });
      }
    } catch (err: any) {
      console.warn('Falha na chamada Gemini server-side, utilizando motor factual estrito:', err.message);
    }
  }

  // Fallback determinístico factual (sempre preciso, 0 alucinações)
  const q = question.toLowerCase();
  if (q.includes('preço') || q.includes('quanto custa') || q.includes('valor')) {
    return res.json({
      text: `Nossos preços oficiais são transparentes e fixados no banco de dados central:\n\n🥗 **Linha Fit:**\n• 350g: R$ ${basePrices.fit_350.toFixed(2).replace('.', ',')}\n• 500g: R$ ${basePrices.fit_500.toFixed(2).replace('.', ',')}\n\n🥩 **Linha Fit Premium:**\n• 350g: R$ ${basePrices.premium_350.toFixed(2).replace('.', ',')}\n• 500g: R$ ${basePrices.premium_500.toFixed(2).replace('.', ',')}\n\n✨ **Regra importante:** Trocar proteínas, carbos e vegetais padrão não altera o valor base!`,
      source: 'CORE_DETERMINISTIC_RULES'
    });
  }

  if (q.includes('pontos') || q.includes('points') || q.includes('saldo')) {
    return res.json({
      text: req.user
        ? `Você está conectado como **${req.user.name}**. Seus dados e extrato de pontos estão registrados de forma segura no Points Ledger contábil!`
        : `Para consultar seu saldo oficial de MerMi Points, faça login com sua conta! Cada R$ 1 gasto no app gera 1 MerMi Point.`,
      source: 'CORE_DETERMINISTIC_RULES'
    });
  }

  return res.json({
    text: `Olá! Sou a **MerMi IA**, conectada ao ecossistema **MERMI FIT LIFE**! 🍃🤖 Posso te ajudar com dúvidas sobre o cardápio, tabela de preços oficiais, marmitas fit, regras do MerMi Points ou dicas para sua constância saudável! Como posso te apoiar hoje?`,
    source: 'CORE_DETERMINISTIC_RULES'
  });
});

/**
 * MerMi Intelligence (Painel Analítico do Administrador / Owner)
 * Exige perfil administrativo (OWNER, ADMIN, MANAGER, FINANCE)!
 */
aiRouter.get('/admin/insights', requireAuth, requireRole('OWNER', 'ADMIN', 'MANAGER', 'FINANCE'), async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const ordersCountRow = await db.select({
      count: sql<number>`count(*)`,
      revenue: sql<number>`COALESCE(SUM(total), 0)`
    }).from(orders);

    const customersCountRow = await db.select({
      count: sql<number>`count(*)`
    }).from(users);

    const pointsIssuedRow = await db.select({
      issued: sql<number>`COALESCE(SUM(amount), 0)`
    }).from(pointsLedger).where(sql`amount > 0`);

    const pointsUsedRow = await db.select({
      used: sql<number>`COALESCE(ABS(SUM(amount)), 0)`
    }).from(pointsLedger).where(sql`amount < 0`);

    const revenue = Number(ordersCountRow[0]?.revenue || 0);
    const orderCount = Number(ordersCountRow[0]?.count || 0);
    const customerCount = Number(customersCountRow[0]?.count || 0);
    const issued = Number(pointsIssuedRow[0]?.issued || 0);
    const used = Number(pointsUsedRow[0]?.used || 0);

    res.json({
      insights: [
        {
          id: 'ins_01',
          title: 'Volume Total Faturado',
          description: `Receita total acumulada de R$ ${revenue.toFixed(2).replace('.', ',')} em ${orderCount} pedidos processados.`,
          category: 'FINANCEIRO',
          priority: 'ALTA'
        },
        {
          id: 'ins_02',
          title: 'Passivo Contábil de MerMi Points',
          description: `Foram emitidos ${issued} Points e resgatados ${used} Points. Saldo circulante em posse de clientes: ${issued - used} pts.`,
          category: 'GAMIFICACAO',
          priority: 'MEDIA'
        },
        {
          id: 'ins_03',
          title: 'Base de Clientes Ativos',
          description: `Total de ${customerCount} clientes cadastrados na base do sistema.`,
          category: 'CRM',
          priority: 'NORMAL'
        }
      ]
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao gerar insights administrativos.' });
  }
});
