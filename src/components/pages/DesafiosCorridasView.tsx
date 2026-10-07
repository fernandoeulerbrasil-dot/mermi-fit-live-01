import React, { useState } from 'react';
import {
  Flame,
  Award,
  Zap,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  MapPin
} from 'lucide-react';
import { CardChallenge, CardRace, CardAchievement, CardBase } from '../../design-system/components/Cards';
import { SectionTitle } from '../../design-system/components/Typography';
import { useMermiStore } from '../../context/MermiStoreContext';

interface DesafiosCorridasViewProps {
  onNavigate: (tab: string) => void;
  initialTab?: 'desafios' | 'corridas' | 'conquistas';
}

export const DesafiosCorridasView: React.FC<DesafiosCorridasViewProps> = ({
  onNavigate,
  initialTab = 'desafios'
}) => {
  const [activeTab, setActiveTab] = useState<'desafios' | 'corridas' | 'conquistas'>(initialTab);
  const {
    addPoints,
    showToast,
    publications,
    missions,
    completeMission,
    badges,
    awardPointsByAction
  } = useMermiStore();

  const runNews = publications.filter((p) => p.ativo && (p.tipo === 'mermi_run' || p.tipo === 'evento'));

  // Desafios sincronizados com as missões oficiais ativas
  const activeMissions = missions.filter((m) => m.active);

  const races = [
    {
      id: 'r1',
      name: 'Circuito MerMi Life 5K & 10K',
      date: '28 de Outubro · 07:00',
      location: 'Parque Ibirapuera, SP',
      distance: '5K e 10K',
      pointsReward: 100,
      status: 'Inscrições Abertas'
    },
    {
      id: 'r2',
      name: 'Night Run Sunset MerMi',
      date: '15 de Novembro · 18:30',
      location: 'Orla da Praia, Santos',
      distance: '6K Noturno',
      pointsReward: 120,
      status: 'Lote 1 com Kit Marmita'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FBF7EE] text-stone-900 pb-28 pt-4 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
          <div>
            <SectionTitle className="text-stone-900">
              Desafios, Conquistas & Corridas
            </SectionTitle>
            <p className="text-xs text-stone-500 mt-0.5">
              Acumule Points extras e teste seus limites com a comunidade
            </p>
          </div>

          <button
            onClick={() => onNavigate('points')}
            className="text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-full border border-amber-300 self-start sm:self-auto cursor-pointer"
          >
            Ver Saldo de Points →
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
          <button
            onClick={() => setActiveTab('desafios')}
            className={`px-3 py-1.5 rounded-full text-xs font-black uppercase font-['Outfit'] transition-all cursor-pointer ${
              activeTab === 'desafios'
                ? 'bg-[#0EB24A] text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 bg-stone-100'
            }`}
          >
            Desafios Ativos ({activeMissions.length})
          </button>

          <button
            onClick={() => setActiveTab('corridas')}
            className={`px-3 py-1.5 rounded-full text-xs font-black uppercase font-['Outfit'] transition-all cursor-pointer ${
              activeTab === 'corridas'
                ? 'bg-[#0EB24A] text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900 bg-stone-100'
            }`}
          >
            Corridas & Eventos ({races.length})
          </button>

          <button
            onClick={() => setActiveTab('conquistas')}
            className={`px-3 py-1.5 rounded-full text-xs font-black uppercase font-['Outfit'] transition-all cursor-pointer ${
              activeTab === 'conquistas'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-stone-600 hover:text-stone-900 bg-stone-100'
            }`}
          >
            Conquistas ({badges.length})
          </button>
        </div>

        {/* Content Tabs */}
        {activeTab === 'desafios' && (
          <div className="space-y-4">
            {activeMissions.map((c) => {
              const percent = Math.min(100, Math.round((c.progress / c.goal) * 100));
              const isClaimed = c.status === 'resgatada';

              return (
                <CardChallenge
                  key={c.id}
                  id={c.id}
                  title={c.title}
                  category={c.type.toUpperCase()}
                  rewardPoints={c.pointsReward}
                  deadline={c.endDate || 'Ativo no período'}
                  progressText={`${c.progress.toLocaleString('pt-BR')} de ${c.goal.toLocaleString('pt-BR')} ${c.unit}`}
                  progressPercent={percent}
                  onParticipate={() => {
                    if (isClaimed) {
                      showToast('Recompensa deste desafio já foi resgatada!');
                      return;
                    }
                    completeMission(c.id);
                  }}
                />
              );
            })}
          </div>
        )}

        {activeTab === 'corridas' && (
          <div className="space-y-5">
            {/* CORRIDAS DISPONÍVEIS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-black uppercase tracking-wider text-stone-800 font-['Outfit']">
                  Calendário Oficial de Circuitos
                </h3>
                <span className="text-[10px] text-stone-500 font-bold">Temporada 2025</span>
              </div>

              {races.map((r) => (
                <CardRace
                  key={r.id}
                  name={r.name}
                  date={r.date}
                  location={r.location}
                  distance={r.distance}
                  pointsReward={r.pointsReward}
                  status={r.status}
                  onEnroll={() => {
                    showToast(`Inscrição iniciada para ${r.name}! Detalhes enviados para seu e-mail.`);
                  }}
                />
              ))}
            </div>

            {/* NOTÍCIAS & RESULTADOS DO MERMI RUN (REQUISITO 4) */}
            {runNews.length > 0 && (
              <div className="bg-gradient-to-br from-stone-900 via-stone-950 to-black text-white rounded-3xl p-5 border border-stone-800 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 font-['Outfit'] flex items-center gap-1">
                    <span>📰</span> NOTÍCIAS & COMUNICADOS DO MERMI RUN
                  </span>
                  <span className="text-[9px] text-stone-400">Via Posts & Campanhas</span>
                </div>
                <div className="space-y-2">
                  {runNews.map((news) => (
                    <div
                      key={news.id}
                      className="p-3.5 rounded-2xl bg-stone-900/90 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <h4 className="text-xs font-black text-white font-['Outfit']">{news.titulo}</h4>
                        <p className="text-[11px] text-stone-400 line-clamp-2 mt-0.5">{news.descricao}</p>
                      </div>
                      <button
                        onClick={() => showToast(`Notícia: ${news.titulo}`)}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:brightness-110 text-white font-bold text-[10px] uppercase font-['Outfit'] shrink-0 self-start sm:self-center cursor-pointer transition-all active:scale-95"
                      >
                        {news.botao || 'Ver Detalhes'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MERMI RUN HUB — CONTEÚDOS & GUIA DOS CORREDORES (REQUISITO 8) */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm">
                  🏃
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-rose-600 font-['Outfit']">
                    MERMI RUN • GUIA & COMUNIDADE
                  </span>
                  <h3 className="text-base font-black text-stone-900 font-['Outfit']">
                    Tudo sobre a sua preparação
                  </h3>
                </div>
              </div>

              {/* Informações dos Kits */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1.5 text-xs text-stone-700">
                <div className="flex items-center gap-1.5 font-bold text-stone-900">
                  <span>🎽</span>
                  <span>Kit Atleta Oficial MerMi Run:</span>
                </div>
                <p className="leading-relaxed">
                  Camiseta tecnológica dry-fit preta com detalhes verde neon, sacochila térmica MerMi, número de peito com chip de cronometragem descartável e squeeze oficial de 600ml.
                </p>
                <span className="text-[10px] text-emerald-600 font-bold block pt-1">
                  Retirada: 48h antes da largada na unidade parceira indicada no comprovante.
                </span>
              </div>

              {/* Dicas para corrida */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-1">
                  <span className="font-bold text-amber-900 block flex items-center gap-1">
                    <span>🍌</span> Nutrição Pré e Pós-Prova
                  </span>
                  <p className="text-stone-600 leading-relaxed text-[11px]">
                    Consuma uma refeição rica em carboidratos complexos 2h antes da prova. Após a linha de chegada, nossa marmita de Frango com Batata Doce garante a reposição glicêmica ideal.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-200/70 space-y-1">
                  <span className="font-bold text-blue-900 block flex items-center gap-1">
                    <span>⏱️</span> Estratégia de Ritmo (Pace)
                  </span>
                  <p className="text-stone-600 leading-relaxed text-[11px]">
                    Comece o primeiro quilômetro 15 segundos mais lento que o seu pace médio planejado. A constância no km 3 ao km 4 é onde a prova é realmente vencida.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'conquistas' && (
          <div className="space-y-3">
            {badges.map((b) => (
              <CardAchievement
                key={b.id}
                title={b.name}
                description={b.description}
                points={b.pointsReward || 0}
                unlockedAt={b.unlocked ? (b.unlockedAt || 'Desbloqueado') : `Bloqueado: ${b.condition}`}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
