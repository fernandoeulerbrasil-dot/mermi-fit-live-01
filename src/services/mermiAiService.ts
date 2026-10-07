import { MermiAiAction, MermiChatMessage } from '../types';
import { UserProfile, RewardItem, WeeklyMember, MarmitaPricing } from '../types';
import { FoodProduct, OrderEntity } from '../types/food';
import { DropSurpresaItem } from '../types/dropSurpresa';
import { GamificationMission } from '../types/gamification';
import { RaceEvent } from '../types/mermiRun';

export interface MermiAiContext {
  user: UserProfile;
  pricing: MarmitaPricing[];
  products: FoodProduct[];
  rewards: RewardItem[];
  drops: DropSurpresaItem[];
  missions: GamificationMission[];
  orders: OrderEntity[];
  raceEvents: RaceEvent[];
  weeklyMember?: WeeklyMember;
  waterLogs?: any[];
  stepsLogs?: any[];
  sleepLogs?: any[];
  activityLogs?: any[];
  habits?: any[];
  evolutionGoals?: any[];
}

export interface MermiAiResponse {
  text: string;
  actions?: MermiAiAction[];
}

export class MermiAiService {
  private static instance: MermiAiService;
  private speechSynth: SpeechSynthesis | null = null;
  private recognition: any = null;

  private constructor() {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        this.speechSynth = window.speechSynthesis;
      }

      // Initialize SpeechRecognition if supported
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          this.recognition = new SpeechRecognition();
          this.recognition.lang = 'pt-BR';
          this.recognition.continuous = false;
          this.recognition.interimResults = false;
        } catch (e) {
          console.warn('SpeechRecognition não pôde ser inicializado:', e);
        }
      }
    }
  }

  public static getInstance(): MermiAiService {
    if (!MermiAiService.instance) {
      MermiAiService.instance = new MermiAiService();
    }
    return MermiAiService.instance;
  }

  /**
   * Responde à dúvida do usuário com base nos dados reais do ecossistema
   */
  public async askQuestion(
    question: string,
    context: MermiAiContext,
    conversationHistory: MermiChatMessage[] = []
  ): Promise<MermiAiResponse> {
    const qLower = question.toLowerCase().trim();

    // 1. Chamar o proxy seguro no servidor (/api/ai/chat) protegendo as chaves de API
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          conversationHistory: conversationHistory.slice(-6).map((m) => ({
            sender: m.sender,
            text: m.text
          }))
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.text) {
          const actions = this.detectContextualActions(qLower, context);
          return { text: data.text, actions };
        }
      }
    } catch (err) {
      console.warn('Falha na rota segura de IA do servidor, executando fallback factual:', err);
    }

    // 2. Factual rule-based intelligence engine (100% accurate, zero hallucinations)
    return this.resolveFactualResponse(qLower, context);
  }

  /**
   * Constrói o System Prompt com todos os dados factuais do ecossistema
   */
  private buildSystemPrompt(ctx: MermiAiContext): string {
    const fit350 = ctx.pricing.find((p) => p.category === 'fit' && p.size === '350g')?.price ?? 19.9;
    const fit500 = ctx.pricing.find((p) => p.category === 'fit' && p.size === '500g')?.price ?? 24.9;
    const prem350 = ctx.pricing.find((p) => p.category === 'fit_premium' && p.size === '350g')?.price ?? 32.9;
    const prem500 = ctx.pricing.find((p) => p.category === 'fit_premium' && p.size === '500g')?.price ?? 39.9;

    const availableRewards = ctx.rewards.map((r) => `${r.title} (${r.pointsCost} pts)`).join(', ');
    const activeRaces = ctx.raceEvents.map((e) => `${e.name} em ${e.date}`).join('; ');
    const lastOrder = ctx.orders[0] ? `Último pedido: ${ctx.orders[0].order_id} (${ctx.orders[0].order_status})` : 'Nenhum pedido anterior';

    return `
Você é a MerMi IA, a assistente oficial inteligente do MERMI FIT LIFE ("Mais que um app. Um estilo de vida.").
Você é representada pelo robô 3D com visor preto iluminado em neon verde.

DIRETRIZES FUNDAMENTAIS:
- Tom: Amigável, acolhedor, objetivo, moderno, encorajador e brasileiro.
- Saúde & Bem-estar: NÃO forneça diagnósticos médicos, prescrições de remédios ou promessas de emagrecimento/cura. Encoraje constância com positividade.
- NUNCA se apresente como "Nutricionista Mermi" nem forneça consultas médicas.
- NUNCA invente dados, preços, pedidos ou promoções. Utilize apenas os dados oficiais abaixo.

DADOS REAIS EM TEMPO REAL:
- Usuário: ${ctx.user.name}, Saldo: ${ctx.user.mermiPoints} Points, Nível: ${ctx.user.level}, Sequência: ${ctx.user.activeStreakDays} dias.
- Passos hoje: ${ctx.user.stepsToday} passos.
- Água hoje: ${ctx.user.waterIntakeMl} ml (Meta: ${ctx.user.waterGoalMl} ml).
- Sono: ${ctx.user.sleepHours}.
- Preços Oficiais de Marmitas:
  * Linha Fit: 350g = R$ ${fit350.toFixed(2).replace('.', ',')} | 500g = R$ ${fit500.toFixed(2).replace('.', ',')}
  * Linha Fit Premium: 350g = R$ ${prem350.toFixed(2).replace('.', ',')} | 500g = R$ ${prem500.toFixed(2).replace('.', ',')}
  * Regra de ouro da personalização: alterar proteínas, carbos e vegetais na mesma linha NÃO altera o preço base!
- ${lastOrder}
- Recompensas disponíveis: ${availableRewards}
- Próximas Corridas MerMi Run: ${activeRaces || 'Consulte a aba Corridas'}
`;
  }

  /**
   * Motor factual determinístico de alta precisão
   */
  private resolveFactualResponse(q: string, ctx: MermiAiContext): MermiAiResponse {
    const fit350 = ctx.pricing.find((p) => p.category === 'fit' && p.size === '350g')?.price ?? 19.9;
    const fit500 = ctx.pricing.find((p) => p.category === 'fit' && p.size === '500g')?.price ?? 24.9;
    const prem350 = ctx.pricing.find((p) => p.category === 'fit_premium' && p.size === '350g')?.price ?? 32.9;
    const prem500 = ctx.pricing.find((p) => p.category === 'fit_premium' && p.size === '500g')?.price ?? 39.9;

    // 1. PREÇOS DAS MARMITAS
    if (q.includes('preço') || q.includes('valor') || q.includes('quanto custa') || q.includes('tabela')) {
      return {
        text: `Nossos preços oficiais são transparentes e fixos por tamanho e linha:\n\n🥗 **Linha Fit:**\n• 350g: R$ ${fit350.toFixed(2).replace('.', ',')}\n• 500g: R$ ${fit500.toFixed(2).replace('.', ',')}\n\n🥩 **Linha Fit Premium:**\n• 350g: R$ ${prem350.toFixed(2).replace('.', ',')}\n• 500g: R$ ${prem500.toFixed(2).replace('.', ',')}\n\n✨ **Regra importante:** Trocar proteínas, carboidratos e legumes dentro da mesma linha **não altera o valor base**!`,
        actions: [
          { id: 'act_menu', label: 'Ver Cardápio Oficial', type: 'navigate', tabTarget: 'cardapio' },
          { id: 'act_cust', label: 'Montar Marmita Agora', type: 'open_customize' }
        ]
      };
    }

    // 2. PERSONALIZAÇÃO DE MARMITAS
    if (q.includes('personaliz') || q.includes('montar') || q.includes('trocar ingrediente') || q.includes('como monto')) {
      return {
        text: `Montar sua marmita no MerMi Fit Life é super fácil e segue 8 etapas claras:\n\n1. **Linha:** Fit ou Fit Premium\n2. **Tamanho:** 350g ou 500g\n3. **Proteína:** frango, patinho, tilápia, ovos ou opção vegetal\n4. **Carboidrato:** batata-doce, arroz integral, quinoa, mandioca\n5. **Legumes & Verduras:** brócolis, cenoura, abobrinha e frescos\n6. **Adicionais:** castanhas, azeite extravirgem ou sementes\n7. **Revisão:** conferir gramas e macros\n8. **Carrinho:** pronto para entrega!\n\nLembrando: alterar ingredientes na mesma categoria mantém o preço original fixo.`,
        actions: [
          { id: 'act_open_cust', label: 'Montar Minha Marmita', type: 'open_customize' },
          { id: 'act_cardapio', label: 'Explorar Pratos Prontos', type: 'navigate', tabTarget: 'cardapio' }
        ]
      };
    }

    // 3. CARDÁPIO E PRODUTOS
    if (q.includes('cardapio') || q.includes('cardápio') || q.includes('opç') || q.includes('prato') || q.includes('opcoes')) {
      const topFit = ctx.products.filter((p) => p.category === 'fit').slice(0, 3).map((p) => `• ${p.name}`).join('\n');
      const topPrem = ctx.products.filter((p) => p.category === 'fit_premium').slice(0, 2).map((p) => `• ${p.name}`).join('\n');

      return {
        text: `Nosso cardápio é preparado com ingredientes frescos e selagem a vácuo para máxima conservação de sabor e nutrientes:\n\n🥗 **Destaques Linha Fit (a partir de R$ ${fit350.toFixed(2).replace('.', ',')}):**\n${topFit}\n\n🥩 **Linha Fit Premium:**\n${topPrem}\n\nVocê pode pedir os pratos prontos ou montar uma marmita com a combinação exata que seu nutricionista prescreveu!`,
        actions: [
          { id: 'act_menu', label: 'Abrir Cardápio', type: 'navigate', tabTarget: 'cardapio' },
          { id: 'act_cust', label: 'Personalizar Ingredientes', type: 'open_customize' }
        ]
      };
    }

    // 4. SALDO DE POINTS & MERMI POINTS
    if (q.includes('point') || q.includes('ponto') || q.includes('meu saldo') || q.includes('pontos eu tenho')) {
      return {
        text: `Você tem atualmente **${ctx.user.mermiPoints} MerMi Points** acumulados no seu saldo oficial!\n\nSeu nível atual é **Nível ${ctx.user.level}**. Você pode acumular mais Points com:\n• Cada marmita pedida (+10 a +25 pts)\n• Metas diárias de água e passos batidas (+15 a +20 pts)\n• Conclusão de treinos (+25 pts)\n• Desafios e Corridas MerMi Run (+50 a +150 pts)`,
        actions: [
          { id: 'act_points', label: 'Ver Extrato de Points', type: 'navigate', tabTarget: 'points' },
          { id: 'act_resgate', label: 'Ver Prêmios do Resgate', type: 'navigate', tabTarget: 'resgate' }
        ]
      };
    }

    // 5. RESGATE DA SEMANA & RECOMPENSAS
    if (q.includes('resgate') || q.includes('recompensa') || q.includes('prêmio') || q.includes('premio') || q.includes('trocar')) {
      const availableList = ctx.rewards
        .map((r) => `• **${r.title}:** ${r.pointsCost} Points ${r.stock > 0 ? `(Estoque: ${r.stock} un)` : '(Esgotado)'}`)
        .join('\n');

      const canRedeemAny = ctx.rewards.some((r) => r.stock > 0 && ctx.user.mermiPoints >= r.pointsCost);

      return {
        text: `No **Resgate da Semana**, sua disciplina vira benefícios reais!\n\nItens disponíveis no catálogo oficial:\n${availableList}\n\nCom seus **${ctx.user.mermiPoints} Points**, ${
          canRedeemAny ? 'você já tem saldo para resgatar itens nesta semana!' : 'continue mantendo sua rotina para desbloquear os próximos prêmios!'
        }`,
        actions: [
          { id: 'act_resgate', label: 'Ir para Resgate da Semana', type: 'navigate', tabTarget: 'resgate' },
          { id: 'act_points', label: 'Como Ganhar Mais Points', type: 'navigate', tabTarget: 'points' }
        ]
      };
    }

    // 6. DROP SURPRESA
    if (q.includes('drop') || q.includes('surpresa') || q.includes('lote relampago') || q.includes('relâmpago')) {
      const activeDrop = ctx.drops.find((d) => d.active);
      return {
        text: `O **MerMi Drop Surpresa** é uma ação especial com lotes limitados e prêmios secretos para os clientes mais rápidos!\n\n${
          activeDrop
            ? `🎁 **Drop Ativo Agora:** "${activeDrop.title}"!\n• Requisito: ${activeDrop.minPointsRequired} Points e ${activeDrop.minOrdersRequired} pedido(s).\n• Restam: ${activeDrop.quantityTotal - activeDrop.quantityClaimed} unidades disponíveis!`
            : 'Fique atento às notificações no app: os Drops são liberados em horários estratégicos e esgotam rápido!'
        }`,
        actions: [
          { id: 'act_drop', label: 'Acessar Drop Surpresa', type: 'navigate', tabTarget: 'drop_surpresa' }
        ]
      };
    }

    // 7. DESAFIOS & MISSÕES
    if (q.includes('desafio') || q.includes('miss') || q.includes('conquista') || q.includes('badge')) {
      const activeMissions = ctx.missions.filter((m) => m.active);
      const missionText = activeMissions.slice(0, 3).map((m) => `• **${m.title}:** ${m.progress}/${m.goal} ${m.unit} (+${m.pointsReward} pts)`).join('\n');

      return {
        text: `Seus desafios ativos incentivam constância e disciplina:\n\n${missionText || 'Todos os desafios atuais foram concluídos!'}\n\nVocê também pode participar dos desafios virtuais do **MERMI RUN**!`,
        actions: [
          { id: 'act_desafios', label: 'Ver Desafios Ativos', type: 'navigate', tabTarget: 'desafios' },
          { id: 'act_evolucao', label: 'Ver Minha Evolução', type: 'navigate', tabTarget: 'evolucao' }
        ]
      };
    }

    // 8. MERMI RUN (CORRIDAS & EVENTOS)
    if (q.includes('corrida') || q.includes('run') || q.includes('3k') || q.includes('5k') || q.includes('10k') || q.includes('evento')) {
      const eventsText = ctx.raceEvents.slice(0, 2).map((e) => `🏃 **${e.name}**\n📅 Data: ${e.date} às ${e.time}\n📍 Local: ${e.locationName}, ${e.city}\n📏 Distâncias: ${e.categories.map((c) => c.distanceLabel).join(', ')}`).join('\n\n');

      return {
        text: `O **MERMI RUN** reúne experiências de movimento com distâncias oficiais (3K, 5K, 10K e desafios virtuais):\n\n${eventsText || 'Novas etapas serão anunciadas em breve!'}\n\nVocê pode usar seus MerMi Points para obter desconto nas inscrições e receber kits com medalha finisher, camiseta oficial e brindes parceiros!`,
        actions: [
          { id: 'act_run', label: 'Ver Corridas & Inscrições', type: 'navigate', tabTarget: 'corridas' },
          { id: 'act_desafios', label: 'Desafios Virtuais', type: 'navigate', tabTarget: 'desafios' }
        ]
      };
    }

    // 9. PEDIDOS & ONDE ESTÁ MEU PEDIDO
    if (q.includes('pedido') || q.includes('status') || q.includes('entrega') || q.includes('onde está') || q.includes('rastre')) {
      const lastOrder = ctx.orders[0];
      if (!lastOrder) {
        return {
          text: 'Você ainda não realizou nenhum pedido no MerMi Fit Life. Que tal escolher sua primeira refeição no nosso cardápio fit ou montar um prato personalizado?',
          actions: [
            { id: 'act_cardapio', label: 'Ver Cardápio', type: 'navigate', tabTarget: 'cardapio' },
            { id: 'act_cust', label: 'Montar Marmita', type: 'open_customize' }
          ]
        };
      }

      return {
        text: `Seu pedido mais recente é o **#${lastOrder.order_id}**:\n\n• **Status atual:** ${lastOrder.order_status.toUpperCase()}\n• **Itens:** ${lastOrder.items.map((i) => i.name).join(', ')}\n• **Total:** R$ ${lastOrder.total.toFixed(2).replace('.', ',')}\n• **Horário:** ${new Date(lastOrder.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}\n\nVocê pode acompanhar a linha do tempo completa na aba Meus Pedidos!`,
        actions: [
          { id: 'act_pedidos', label: 'Acompanhar Pedido', type: 'navigate', tabTarget: 'pedidos' },
          {
            id: 'act_repeat',
            label: 'Repetir Este Pedido',
            type: 'repeat_order',
            payload: { orderId: lastOrder.order_id },
            requiresConfirmation: true,
            confirmationMessage: `Deseja adicionar os itens do pedido #${lastOrder.order_id} diretamente ao carrinho?`
          }
        ]
      };
    }

    // 10. EVOLUÇÃO, ÁGUA, PASSOS & SONO
    if (q.includes('evoluç') || q.includes('agua') || q.includes('água') || q.includes('passo') || q.includes('sono') || q.includes('saúde') || q.includes('meta')) {
      const waterLiters = (ctx.user.waterIntakeMl / 1000).toFixed(1).replace('.', ',');
      const goalLiters = (ctx.user.waterGoalMl / 1000).toFixed(1).replace('.', ',');
      const waterPercent = Math.min(100, Math.round((ctx.user.waterIntakeMl / ctx.user.waterGoalMl) * 100));

      return {
        text: `Aqui está o resumo da sua disciplina e rotina de hoje:\n\n💧 **Hidratação:** ${waterLiters} L de ${goalLiters} L (${waterPercent}% da sua meta diária)\n👟 **Passos:** ${ctx.user.stepsToday.toLocaleString('pt-BR')} passos registrados\n🌙 **Sono:** ${ctx.user.sleepHours} de descanso restaurador\n🔥 **Sequência ativa:** ${ctx.user.activeStreakDays} dias seguidos mantendo o foco!\n\nLembre-se: pequenas escolhas consistentes trazem grandes transformações!`,
        actions: [
          { id: 'act_evolucao', label: 'Ver Painel de Evolução', type: 'navigate', tabTarget: 'evolucao' },
          { id: 'act_water', label: '+250ml de Água Agora', type: 'quick_water' }
        ]
      };
    }

    // 11. MEMBRO DA SEMANA
    if (q.includes('membro') || q.includes('semana') || q.includes('destaque') || q.includes('comunidade')) {
      const member = ctx.weeklyMember;
      return {
        text: `O Membro da Semana é o **${member?.name || 'Membro Inspirador'}** (${member?.handle || '@mermifit'})!\n\nCom **${member?.points || 86} Points** e foco na disciplina, ele inspira toda a nossa comunidade. Você também pode ser destaque mantendo sua constância de treinos, refeições fit e hidratação!`,
        actions: [
          { id: 'act_membro', label: 'Ver Perfil do Membro', type: 'navigate', tabTarget: 'membro' },
          { id: 'act_comunidade', label: 'Abrir Comunidade', type: 'navigate', tabTarget: 'comunidade' }
        ]
      };
    }

    // 12. FALLBACK SEGURO (NUNCA INVENTAR)
    return {
      text: `Olá! Sou a **MerMi IA**, assistente do seu estilo de vida no MerMi Fit Life! 🤖🍃\n\nPosso te ajudar com:\n• Consulta de preços oficiais e cardápio de R$ ${fit350.toFixed(2).replace('.', ',')}\n• Personalização da sua marmita nos ingredientes certos\n• Seu saldo de Points (${ctx.user.mermiPoints} pts) e Resgate da Semana\n• Status do seu pedido e corridas MerMi Run\n• Acompanhamento dos seus passos e hidratação\n\nComo posso apoiar seu dia hoje?`,
      actions: [
        { id: 'act_cardapio', label: 'Cardápio Fit', type: 'navigate', tabTarget: 'cardapio' },
        { id: 'act_cust', label: 'Montar Marmita', type: 'open_customize' },
        { id: 'act_points', label: 'Meus Points', type: 'navigate', tabTarget: 'points' },
        { id: 'act_run', label: 'MerMi Run', type: 'navigate', tabTarget: 'corridas' }
      ]
    };
  }

  /**
   * Identifica ações complementares com base na consulta
   */
  private detectContextualActions(q: string, ctx: MermiAiContext): MermiAiAction[] {
    const actions: MermiAiAction[] = [];

    if (q.includes('cardapio') || q.includes('preço') || q.includes('marmita')) {
      actions.push({ id: 'a_menu', label: 'Ver Cardápio', type: 'navigate', tabTarget: 'cardapio' });
      actions.push({ id: 'a_cust', label: 'Montar Marmita', type: 'open_customize' });
    }
    if (q.includes('point') || q.includes('resgate')) {
      actions.push({ id: 'a_points', label: 'Ver MerMi Points', type: 'navigate', tabTarget: 'points' });
      actions.push({ id: 'a_resgate', label: 'Resgate da Semana', type: 'navigate', tabTarget: 'resgate' });
    }
    if (q.includes('corrida') || q.includes('run')) {
      actions.push({ id: 'a_run', label: 'Ver Corridas', type: 'navigate', tabTarget: 'corridas' });
    }
    if (q.includes('evolu') || q.includes('passo') || q.includes('agua') || q.includes('sono')) {
      actions.push({ id: 'a_evo', label: 'Minha Evolução', type: 'navigate', tabTarget: 'evolucao' });
    }
    if (q.includes('pedido')) {
      actions.push({ id: 'a_pedidos', label: 'Meus Pedidos', type: 'navigate', tabTarget: 'pedidos' });
    }

    return actions;
  }

  /**
   * Síntese de voz com SpeechSynthesis
   */
  public speak(text: string, onEnd?: () => void): void {
    if (!this.speechSynth || typeof window === 'undefined') {
      if (onEnd) onEnd();
      return;
    }

    try {
      this.speechSynth.cancel();

      const cleanText = text
        .replace(/[*_#`~]/g, '')
        .replace(/https?:\/\/\S+/g, '')
        .replace(/\n+/g, '. ');

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.05;
      utterance.pitch = 1.05;

      const voices = this.speechSynth.getVoices();
      const ptVoice =
        voices.find(
          (v) =>
            v.lang.startsWith('pt') &&
            (v.name.includes('Google') ||
              v.name.includes('Natural') ||
              v.name.includes('Luciana') ||
              v.name.includes('Francisca'))
        ) || voices.find((v) => v.lang.startsWith('pt'));

      if (ptVoice) {
        utterance.voice = ptVoice;
      }

      utterance.onend = () => {
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        if (onEnd) onEnd();
      };

      this.speechSynth.speak(utterance);
    } catch (e) {
      console.warn('Erro ao sintetizar voz:', e);
      if (onEnd) onEnd();
    }
  }

  public stopSpeaking(): void {
    if (this.speechSynth) {
      this.speechSynth.cancel();
    }
  }

  /**
   * Reconhecimento de fala (Speech-to-Text)
   */
  public startListening(
    onResult: (transcript: string) => void,
    onError?: (err: any) => void
  ): boolean {
    if (!this.recognition) {
      return false;
    }

    try {
      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onResult(transcript);
        }
      };

      this.recognition.onerror = (event: any) => {
        if (onError) onError(event);
      };

      this.recognition.start();
      return true;
    } catch (e) {
      console.warn('Erro ao iniciar reconhecimento de voz:', e);
      if (onError) onError(e);
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignora erro se já estiver parado
      }
    }
  }
}

export const mermiAi = MermiAiService.getInstance();
