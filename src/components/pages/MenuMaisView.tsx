import React from 'react';
import {
  TrendingUp,
  Droplet,
  Moon,
  Activity,
  Dumbbell,
  Target,
  Bot,
  Award,
  Flame,
  Trophy,
  Zap,
  Users,
  UtensilsCrossed,
  ShoppingBag,
  CalendarCheck,
  Heart,
  BookOpen,
  Gift,
  Tag,
  Ticket,
  Briefcase,
  User,
  Settings,
  Bell,
  ShieldCheck,
  HelpCircle,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { CardBase } from '../../design-system/components/Cards';
import { SectionTitle, Subtitle } from '../../design-system/components/Typography';

interface MenuMaisViewProps {
  onNavigate: (tab: string) => void;
}

export const MenuMaisView: React.FC<MenuMaisViewProps> = ({ onNavigate }) => {
  const sections = [
    {
      category: 'MINHA VIDA',
      color: 'text-[#0EB24A]',
      items: [
        { id: 'evolucao', label: 'Evolução Pessoal', desc: 'Métricas gerais e histórico', icon: TrendingUp },
        { id: 'agua', label: 'Hidratação & Água', desc: 'Registro de ingestão hídrica', icon: Droplet },
        { id: 'sono', label: 'Sono & Recuperação', desc: 'Qualidade do descanso noturno', icon: Moon },
        { id: 'atividade', label: 'Atividades & Passos', desc: 'Passômetro e calorias diárias', icon: Activity },
        { id: 'treinos', label: 'Treinos da Semana', desc: 'Registro de musculação e cárdio', icon: Dumbbell },
        { id: 'metas', label: 'Metas do Mês', desc: 'Alvos de constância e disciplina', icon: Target },
      ]
    },
    {
      category: 'MERMI ECOSYSTEM',
      color: 'text-amber-500',
      items: [
        { id: 'ia', label: 'MerMi IA', desc: 'Assistente inteligente 24h por voz e chat', icon: Bot, isHighlighted: true },
        { id: 'drop_surpresa', label: 'MerMi Drop Surpresa', desc: 'Prêmios secretos e lotes relâmpago', icon: Gift, isHighlighted: true },
        { id: 'points', label: 'MerMi Points', desc: 'Painel completo de saldo e regras', icon: Award },
        { id: 'desafios', label: 'Desafios Ativos', desc: 'Missões semanais com premiação', icon: Flame },
        { id: 'conquistas', label: 'Conquistas & Selos', desc: 'Badges desbloqueados na jornada', icon: Trophy },
        { id: 'corridas', label: 'Corridas & Eventos', desc: 'Circuitos de rua e encontros MerMi', icon: Zap },
        { id: 'comunidade', label: 'Comunidade Mermi', desc: 'Feed social de membros e pratos', icon: Users },
      ]
    },
    {
      category: 'ALIMENTAÇÃO & REFEIÇÕES',
      color: 'text-orange-500',
      items: [
        { id: 'cardapio', label: 'Cardápio Completo', desc: 'Linhas Fit e Fit Premium', icon: UtensilsCrossed },
        { id: 'pedidos', label: 'Meus Pedidos', desc: 'Histórico, status e rastreio', icon: ShoppingBag },
        { id: 'planos', label: 'Planos Semanais & Mensais', desc: 'Assinaturas de refeições planejadas', icon: CalendarCheck },
        { id: 'favoritos', label: 'Pratos Favoritos', desc: 'Combinações salvas para reordem rápida', icon: Heart },
        { id: 'receitas', label: 'Receitas & Dicas dos Chefs', desc: 'Preparações saudáveis exclusivas', icon: BookOpen },
      ]
    },
    {
      category: 'BENEFÍCIOS & PARCERIAS',
      color: 'text-rose-500',
      items: [
        { id: 'resgate', label: 'Resgate da Semana', desc: 'Troca oficial de Points por marmitas e prêmios', icon: Gift },
        { id: 'membro', label: 'Membro da Semana', desc: 'Destaque de constância e inspiração', icon: Trophy },
        { id: 'promocoes', label: 'Promoções & Combos', desc: 'Ofertas com pontuação turbinada', icon: Tag },
        { id: 'cupons', label: 'Meus Cupons', desc: 'Códigos promocionais ativos', icon: Ticket },
        { id: 'parceiros', label: 'Rede de Parceiros', desc: 'Descontos em academias e suplementos', icon: Briefcase },
      ]
    },
    {
      category: 'CONTA & SUPORTE',
      color: 'text-stone-600',
      items: [
        { id: 'perfil', label: 'Meu Perfil', desc: 'Dados cadastrais e endereço de entrega', icon: User },
        { id: 'configuracoes', label: 'Configurações', desc: 'Preferências de dieta e notificações', icon: Settings },
        { id: 'notificacoes', label: 'Central de Notificações', desc: 'Avisos de pedidos e desafios', icon: Bell },
        { id: 'privacidade', label: 'Privacidade & Termos', desc: 'Políticas do app e segurança', icon: ShieldCheck },
        { id: 'suporte', label: 'Suporte & Ajuda', desc: 'Fale com o time MerMi pelo WhatsApp', icon: HelpCircle },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#FBF7EE] text-stone-900 pb-28 pt-4 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="border-b border-stone-200 pb-3">
          <SectionTitle className="text-stone-900">
            Mais Funcionalidades
          </SectionTitle>
          <p className="text-xs text-stone-500 mt-0.5">
            Navegue por todos os módulos do ecossistema MerMi Fit Life
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-6">
          {sections.map((sec) => (
            <div key={sec.category} className="space-y-2.5">
              <h3 className={`text-xs font-black uppercase tracking-wider font-['Outfit'] ${sec.color}`}>
                {sec.category}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between group ${
                        item.isHighlighted
                          ? 'bg-gradient-to-r from-emerald-500/10 to-amber-500/10 border-emerald-500/40 hover:border-emerald-500'
                          : 'bg-white border-stone-200 hover:border-[#0EB24A] hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            item.isHighlighted
                              ? 'bg-[#0EB24A] text-white shadow-sm'
                              : 'bg-stone-100 text-stone-700 group-hover:bg-[#0EB24A] group-hover:text-white transition-colors'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-black text-xs text-stone-900 font-['Outfit'] uppercase truncate">
                            {item.label}
                          </h4>
                          <p className="text-[10px] text-stone-500 truncate mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#0EB24A] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Admin and Assets Direct Shortcut Footer */}
        <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <button
            onClick={() => onNavigate('assets')}
            className="flex items-center gap-1.5 font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
          >
            <span>📁 Catálogo Oficial de Assets</span>
          </button>
          <button
            onClick={() => onNavigate('mermi_control')}
            className="flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#0EB24A]" />
            <span>MERMI CONTROL (Central do Proprietário)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
