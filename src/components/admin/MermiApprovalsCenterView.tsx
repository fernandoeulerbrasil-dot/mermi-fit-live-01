import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  Sparkles,
  DollarSign,
  Award,
  Megaphone,
  TrendingDown,
  ShieldCheck,
  Clock,
  Send,
  Sliders,
  Filter
} from 'lucide-react';
import { useMermiStore } from '../../context/MermiStoreContext';

export interface ApprovalItem {
  id: string;
  type: 'PRECO' | 'CAMPANHA' | 'POINTS' | 'FINANCEIRO' | 'RECOMPENSA' | 'INTELLIGENCE';
  title: string;
  description: string;
  proposer: string;
  requestedAt: string;
  impactEstimated: string;
  status: 'PENDENTE' | 'APROVADO' | 'REJEITADO' | 'ALTERACAO_SOLICITADA';
  feedback?: string;
}

const INITIAL_APPROVALS: ApprovalItem[] = [
  {
    id: 'appr-01',
    type: 'INTELLIGENCE',
    title: 'Disparo de Automação de Reativação para 14 Clientes Inativos',
    description: 'A MerMi Intelligence detectou 14 clientes com alto valor histórico que não pedem há mais de 25 dias. Sugere envio de cupom VOLTAFIT com frete grátis.',
    proposer: 'MerMi Intelligence AI (Sugestão)',
    requestedAt: 'Hoje às 08:30',
    impactEstimated: 'Recuperação estimada de R$ 1.850,00 em faturamento semanal',
    status: 'PENDENTE'
  },
  {
    id: 'appr-02',
    type: 'PRECO',
    title: 'Ajuste Programado na Linha Fit 500g para R$ 26,90',
    description: 'Proposta de atualização de preço de R$ 24,90 para R$ 26,90 em virtude do aumento de 12% no custo do filé de frango e azeite extravirgem.',
    proposer: 'Gerência Operacional',
    requestedAt: 'Ontem às 17:40',
    impactEstimated: 'Elevação da margem de contribuição de 41.2% para 46.5%',
    status: 'PENDENTE'
  },
  {
    id: 'appr-03',
    type: 'POINTS',
    title: 'Campanha de Bônus em Dobro para Assinantes Semanais',
    description: 'Concessão de 2x MerMi Points em todos os pedidos realizados entre terça e quinta-feira para fidelização da base recorrente.',
    proposer: 'Marketing & Conteúdo',
    requestedAt: 'Há 2 dias',
    impactEstimated: 'Aumento previsto de 28% no volume de pedidos em dias de menor movimento',
    status: 'PENDENTE'
  }
];

export const MermiApprovalsCenterView: React.FC = () => {
  const { currentAdminUser, addAuditLog, showToast } = useMermiStore();
  const [approvals, setApprovals] = useState<ApprovalItem[]>(INITIAL_APPROVALS);
  const [filterType, setFilterType] = useState<string>('todos');

  const handleDecision = (id: string, decision: 'APROVADO' | 'REJEITADO' | 'ALTERACAO_SOLICITADA') => {
    setApprovals(prev =>
      prev.map(item => (item.id === id ? { ...item, status: decision } : item))
    );

    const target = approvals.find(a => a.id === id);
    const actionLabel =
      decision === 'APROVADO'
        ? 'Aprovou'
        : decision === 'REJEITADO'
        ? 'Rejeitou'
        : 'Solicitou alteração em';

    addAuditLog(
      `${actionLabel} solicitação: ${target?.title}`,
      'campanha',
      id,
      'PENDENTE',
      decision,
      `Decisão [${decision}] aplicada pelo operador.`
    );

    showToast(`Solicitação atualizada para ${decision}. Ação auditada com sucesso.`);
  };

  const filtered = approvals.filter(
    a => filterType === 'todos' || a.type === filterType || a.status === filterType
  );

  return (
    <div className="space-y-6 font-['Outfit'] text-stone-200">
      {/* 1. TOPO */}
      <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 font-mono">
            SEÇÃO 37 — GOVERNANÇA, APROVAÇÕES & PRINCÍPIO IA → SUGESTÃO → APROVAÇÃO
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
            Central de Aprovações Administrativas
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Nenhuma ação crítica (preços, campanhas, pontos, DRE ou sugestões da MerMi Intelligence) é executada sem aprovação e registro de auditoria.
          </p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl px-4 py-2 text-right">
          <span className="text-[10px] text-stone-400 font-bold block">Pendentes de Decisão</span>
          <span className="text-lg font-black text-amber-400">
            {approvals.filter(a => a.status === 'PENDENTE').length}
          </span>
        </div>
      </div>

      {/* 2. FILTRO */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {['todos', 'PENDENTE', 'INTELLIGENCE', 'PRECO', 'POINTS', 'APROVADO', 'REJEITADO'].map((f) => (
          <button
            key={f}
            onClick={() => setFilterType(f)}
            className={`px-3.5 py-2 rounded-xl transition-all uppercase font-bold cursor-pointer ${
              filterType === f
                ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-400/20'
                : 'bg-[#171E31] text-stone-400 hover:text-white border border-stone-800'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* 3. LISTA DE APROVAÇÕES */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const isPending = item.status === 'PENDENTE';
          const isApproved = item.status === 'APROVADO';
          const isRejected = item.status === 'REJEITADO';

          return (
            <div
              key={item.id}
              className="bg-[#171E31] border border-stone-800 rounded-3xl p-5 shadow-lg space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      item.type === 'INTELLIGENCE'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : item.type === 'PRECO'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {item.type}
                  </span>
                  <span className="text-xs text-stone-400">Solicitado por: <strong className="text-stone-300">{item.proposer}</strong></span>
                  <span className="text-[10px] text-stone-500 font-mono">({item.requestedAt})</span>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                    isPending
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : isApproved
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/10 text-red-400 border border-red-500/30'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-white text-sm">{item.title}</h3>
                <p className="text-xs text-stone-300 mt-1 leading-relaxed">{item.description}</p>
                <div className="p-3 bg-[#101526] border border-stone-800/80 rounded-2xl text-[11px] text-emerald-400 mt-2 font-mono">
                  Impacto Estimado: <strong className="text-white">{item.impactEstimated}</strong>
                </div>
              </div>

              {isPending && (
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
                  <button
                    onClick={() => handleDecision(item.id, 'ALTERACAO_SOLICITADA')}
                    className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    Solicitar Alteração
                  </button>
                  <button
                    onClick={() => handleDecision(item.id, 'REJEITADO')}
                    className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition-all cursor-pointer"
                  >
                    Rejeitar
                  </button>
                  <button
                    onClick={() => handleDecision(item.id, 'APROVADO')}
                    className="px-4 py-1.5 rounded-xl bg-[#0EB24A] hover:bg-emerald-600 text-stone-950 text-xs font-black transition-all cursor-pointer shadow-md shadow-emerald-500/20"
                  >
                    Aprovar & Executar
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
