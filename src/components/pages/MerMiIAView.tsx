import React, { useState, useEffect, useRef } from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import { MerMiIA } from '../brand/MerMiIA';
import { OFFICIAL_ASSET } from '../../services/officialAssets';
import { mermiAi, MermiAiContext } from '../../services/mermiAiService';
import { MermiChatMessage, MermiAiAction } from '../../types';
import {
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  RotateCcw,
  Mic,
  MicOff,
  ChevronRight,
  ShieldCheck,
  Flame,
  Droplets,
  Footprints,
  UtensilsCrossed,
  Award,
  Calendar,
  CheckCircle2,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

interface MerMiIAViewProps {
  onNavigate?: (tab: string) => void;
}

export const MerMiIAView: React.FC<MerMiIAViewProps> = ({ onNavigate }) => {
  const {
    user,
    pricing,
    products,
    rewards,
    drops,
    missions,
    orders,
    raceEvents,
    weeklyMember,
    waterLogs,
    stepsLogs,
    sleepLogs,
    activityLogs,
    habits,
    evolutionGoals,
    addWaterLog,
    repeatOrder,
    showToast
  } = useMermiStore();

  const [messages, setMessages] = useState<MermiChatMessage[]>(() => {
    const firstName = user.name.split(' ')[0] || 'Atleta';
    return [
      {
        id: 'msg_welcome',
        sender: 'mermi_ia',
        text: `Olá, ${firstName}! Eu sou a **MerMi IA**, a inteligência oficial do ecossistema **MERMI FIT LIFE**! 🤖🍃\n\nEstou conectada em tempo real com seu perfil:\n• Saldo: **${user.mermiPoints} Points** (Nível ${user.level})\n• Sequência: **${user.activeStreakDays} dias ativos** 🔥\n• Hidratação hoje: **${(user.waterIntakeMl / 1000).toFixed(1).replace('.', ',')} L** / ${(user.waterGoalMl / 1000).toFixed(1).replace('.', ',')} L\n\nComo posso apoiar sua alimentação e seu estilo de vida hoje?`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        actions: [
          { id: 'act_cardapio', label: 'Ver Cardápio Fit', type: 'navigate', tabTarget: 'cardapio' },
          { id: 'act_points', label: 'Extrato de Points', type: 'navigate', tabTarget: 'points' },
          { id: 'act_evolucao', label: 'Minha Evolução', type: 'navigate', tabTarget: 'evolucao' }
        ]
      }
    ];
  });

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isCurrentlySpeaking, setIsCurrentlySpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'todos' | 'cardapio' | 'points' | 'saude' | 'corridas'>('todos');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    { text: 'Quais são os preços oficiais das marmitas?', category: 'cardapio' },
    { text: 'Personalizar ingredientes altera o preço?', category: 'cardapio' },
    { text: 'Como funciona o Resgate da Semana?', category: 'points' },
    { text: 'Quantos MerMi Points eu tenho acumulados?', category: 'points' },
    { text: 'Como está minha hidratação e passos hoje?', category: 'saude' },
    { text: 'Quando é a próxima corrida do MerMi Run?', category: 'corridas' },
    { text: 'Qual o status do meu último pedido?', category: 'cardapio' },
    { text: 'Quem é o Membro da Semana?', category: 'todos' }
  ];

  const filteredQuestions = activeCategory === 'todos'
    ? suggestedQuestions
    : suggestedQuestions.filter(q => q.category === activeCategory);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const buildCurrentContext = (): MermiAiContext => ({
    user,
    pricing,
    products,
    rewards,
    drops,
    missions,
    orders,
    raceEvents,
    weeklyMember,
    waterLogs,
    stepsLogs,
    sleepLogs,
    activityLogs,
    habits,
    evolutionGoals
  });

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMessage: MermiChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await mermiAi.askQuestion(
        query,
        buildCurrentContext(),
        messages
      );

      const iaMessage: MermiChatMessage = {
        id: `ia_${Date.now()}`,
        sender: 'mermi_ia',
        text: response.text,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        actions: response.actions
      };

      setMessages((prev) => [...prev, iaMessage]);

      if (isVoiceEnabled) {
        setIsCurrentlySpeaking(true);
        mermiAi.speak(response.text, () => setIsCurrentlySpeaking(false));
      }
    } catch (e) {
      console.warn('Erro ao responder:', e);
      const fallbackMessage: MermiChatMessage = {
        id: `ia_${Date.now()}`,
        sender: 'mermi_ia',
        text: 'Desculpe, ocorreu uma instabilidade momentânea na conexão. Você pode consultar nosso cardápio ou seus dados de evolução diretamente nas abas do aplicativo.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVoice = () => {
    if (isVoiceEnabled) {
      mermiAi.stopSpeaking();
      setIsCurrentlySpeaking(false);
    }
    setIsVoiceEnabled(!isVoiceEnabled);
  };

  const handlePlayAudio = (text: string) => {
    setIsCurrentlySpeaking(true);
    mermiAi.speak(text, () => setIsCurrentlySpeaking(false));
  };

  const handleToggleListening = () => {
    if (isListening) {
      mermiAi.stopListening();
      setIsListening(false);
    } else {
      const started = mermiAi.startListening(
        (transcript) => {
          setInputText(transcript);
          setIsListening(false);
          handleSendMessage(transcript);
        },
        (err) => {
          console.warn('Reconhecimento de fala indisponível:', err);
          setIsListening(false);
          showToast('Microfone indisponível ou permissão não concedida.');
        }
      );
      if (started) {
        setIsListening(true);
      } else {
        showToast('Reconhecimento por voz não suportado neste navegador.');
      }
    }
  };

  const handleActionClick = (action: MermiAiAction) => {
    if (action.type === 'navigate' && action.tabTarget) {
      if (onNavigate) {
        onNavigate(action.tabTarget);
      }
      return;
    }

    if (action.type === 'open_customize') {
      if (onNavigate) {
        onNavigate('cardapio');
      }
      showToast('Abra a personalização no cardápio fit!');
      return;
    }

    if (action.type === 'quick_water') {
      addWaterLog(250, 'manual');
      showToast('+250 ml de água registrados com sucesso! 💧');
      return;
    }

    if (action.type === 'repeat_order' && action.payload?.orderId) {
      const result = repeatOrder(action.payload.orderId);
      if (result.success) {
        showToast('Itens adicionados ao seu carrinho!');
        if (onNavigate) onNavigate('pedidos');
      } else {
        showToast(result.message);
      }
      return;
    }

    if (action.type === 'open_cart') {
      if (onNavigate) onNavigate('pedidos');
      return;
    }
  };

  const handleClearHistory = () => {
    mermiAi.stopSpeaking();
    setIsCurrentlySpeaking(false);
    const firstName = user.name.split(' ')[0] || 'Atleta';
    setMessages([
      {
        id: 'msg_welcome',
        sender: 'mermi_ia',
        text: `Histórico reiniciado! Olá novamente, ${firstName}! O que deseja consultar ou planejar no MerMi Fit Life hoje?`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        actions: [
          { id: 'act_cardapio', label: 'Ver Cardápio Fit', type: 'navigate', tabTarget: 'cardapio' },
          { id: 'act_points', label: 'Meus Points', type: 'navigate', tabTarget: 'points' }
        ]
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-[#FBF7EE] text-stone-900 pb-28 pt-3 px-3 sm:px-4 flex flex-col">
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col space-y-3 sm:space-y-4">
        
        {/* CABEÇALHO OFICIAL: MERMI IA (REQUISITOS BLOCO 09: ASSET REGISTRY + COMPONENTE OFICIAL) */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Componente Reutilizável Oficial Imutável */}
            <div className="relative">
              <MerMiIA
                officialAssetId="mermi-ia-official"
                size="sm"
                isSpeaking={isCurrentlySpeaking}
                className="shrink-0 drop-shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0EB24A]" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">
                  ASSET OFICIAL
                </span>
                <span className="text-[10px] font-bold text-stone-500 flex items-center gap-1">
                  {isListening ? (
                    <span className="text-red-500 font-bold animate-pulse flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-500" /> Ouvindo...
                    </span>
                  ) : isCurrentlySpeaking ? (
                    <span className="text-emerald-600 font-bold animate-pulse flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> Falando...
                    </span>
                  ) : (
                    <span>Online · Pronta</span>
                  )}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-black text-stone-900 font-['Outfit'] mt-1 flex items-center gap-1.5">
                MerMi IA
                <span className="text-xs font-normal text-stone-500">v2.0</span>
              </h2>
              <p className="text-xs text-stone-600">
                Assistente inteligente integrada aos seus dados em tempo real
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleToggleVoice}
              title={isVoiceEnabled ? 'Desativar voz automática' : 'Ativar voz automática'}
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                isVoiceEnabled
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs'
                  : 'bg-stone-100 text-stone-500 border-stone-200'
              }`}
            >
              {isVoiceEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 animate-pulse" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            <button
              onClick={handleClearHistory}
              title="Reiniciar conversa"
              className="p-2.5 rounded-2xl border border-stone-200 bg-stone-50 text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* NOTA DE RESPONSABILIDADE & SAÚDE (DIRETRIZ BLOCO 07 & BLOCO 09) */}
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-[11px] text-emerald-950 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-emerald-900 leading-tight">
              A MerMi IA fornece orientações educativas sobre nosso ecossistema e hábitos diários.
            </p>
            <p className="text-[10px] text-stone-600">
              Não realiza diagnósticos clínicos, prescrições de remédios ou promessas de cura. Consulte sempre profissionais de saúde e nutrição credenciados.
            </p>
          </div>
        </div>

        {/* ABAS DE CATEGORIAS DE PERGUNTAS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'todos', label: 'Todas as Sugestões' },
            { id: 'cardapio', label: 'Cardápio & Preços' },
            { id: 'points', label: 'Points & Prêmios' },
            { id: 'saude', label: 'Hábitos & Saúde' },
            { id: 'corridas', label: 'MerMi Run' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`shrink-0 text-[11px] font-bold px-3 py-1 rounded-full transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* CHIPS DE PERGUNTAS RÁPIDAS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {filteredQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q.text)}
              className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-stone-700 border border-stone-200 shadow-xs transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <MessageSquare className="w-3 h-3 text-emerald-600" />
              {q.text}
            </button>
          ))}
        </div>

        {/* FEED DE MENSAGENS / CONVERSA */}
        <div className="flex-1 bg-white/70 backdrop-blur-xs rounded-3xl p-3 sm:p-4 border border-stone-200 shadow-inner overflow-y-auto space-y-3 min-h-[360px] max-h-[520px]">
          {messages.map((msg) => {
            const isMe = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isMe && (
                  <div className="w-8 h-8 rounded-full bg-stone-950 border border-emerald-400 p-0.5 flex items-center justify-center shrink-0 overflow-hidden shadow-xs mt-1">
                    <img
                      src={OFFICIAL_ASSET.mermi_ai_face_png}
                      alt="MerMi IA"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm text-xs leading-relaxed ${
                    isMe
                      ? 'bg-stone-900 text-white rounded-tr-xs'
                      : 'bg-white text-stone-800 border border-stone-200 rounded-tl-xs'
                  }`}
                >
                  <div className="whitespace-pre-line font-normal space-y-1.5">
                    {msg.text.split('\n\n').map((paragraph, pIdx) => (
                      <p key={pIdx}>
                        {paragraph.split('**').map((part, bIdx) =>
                          bIdx % 2 === 1 ? <strong key={bIdx} className={isMe ? 'text-emerald-300 font-bold' : 'text-stone-950 font-bold'}>{part}</strong> : part
                        )}
                      </p>
                    ))}
                  </div>

                  {/* AÇÕES CONTEXTUAIS DA MENSAGEM */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-stone-100 flex flex-wrap gap-1.5">
                      {msg.actions.map((act) => (
                        <button
                          key={act.id}
                          onClick={() => handleActionClick(act)}
                          className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95"
                        >
                          <span>{act.label}</span>
                          <ExternalLink className="w-3 h-3 text-emerald-600" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* RODAPÉ DA MENSAGEM */}
                  <div className={`flex items-center justify-between mt-2 pt-1 border-t text-[9px] ${
                    isMe ? 'border-white/10 text-stone-400' : 'border-stone-100 text-stone-400'
                  }`}>
                    <span>{msg.timestamp}</span>

                    {!isMe && (
                      <button
                        onClick={() => handlePlayAudio(msg.text)}
                        title="Ouvir resposta com voz natural"
                        className="flex items-center gap-1 hover:text-emerald-600 transition-colors cursor-pointer font-medium"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Ouvir</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2.5 text-xs text-stone-500 p-2.5 bg-white/80 rounded-2xl border border-stone-200/80 shadow-xs max-w-fit">
              <div className="w-6 h-6 rounded-full overflow-hidden bg-stone-950 border border-emerald-400 p-0.5 shrink-0">
                <img
                  src={OFFICIAL_ASSET.mermi_ai_face_png}
                  alt="MerMi IA Formulando"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain animate-spin"
                />
              </div>
              <span className="font-medium animate-pulse text-stone-700">
                MerMi IA consultando dados oficiais do ecossistema...
              </span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* BARRA DE ENTRADA DE MENSAGENS COM MICROFONE */}
        <div className="bg-white rounded-2xl p-2 border border-stone-200 shadow-md flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={handleToggleListening}
            title={isListening ? 'Parar de gravar' : 'Falar pelo microfone'}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              isListening
                ? 'bg-red-500 text-white border-red-600 animate-pulse shadow-md'
                : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={isListening ? 'Ouvindo sua pergunta...' : 'Pergunte sobre cardápio, marmitas, pontos, corridas...'}
            className="flex-1 px-2.5 py-2 text-xs sm:text-sm bg-transparent border-none outline-none text-stone-900 placeholder-stone-400"
          />

          <button
            disabled={!inputText.trim() || isLoading}
            onClick={() => handleSendMessage()}
            className={`p-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center ${
              inputText.trim() && !isLoading
                ? 'bg-[#0EB24A] hover:bg-[#0ca042] text-white shadow-md active:scale-95'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
