import React, { useState } from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import { RaceEvent } from '../../types/mermiRun';
import { DropRewardType } from '../../types/dropSurpresa';
import {
  Trophy,
  Zap,
  Gift,
  Award,
  Plus,
  Trash2,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Layers,
  Sparkles
} from 'lucide-react';

export const MermiGamificationEventsAdminView: React.FC = () => {
  const {
    raceEvents,
    createRaceEvent,
    deleteRaceEvent,
    missions,
    createMission,
    deleteMission,
    rewards,
    drops,
    createDrop,
    deleteDrop,
    toggleDropStatus,
    earningRules,
    updateEarningRule,
    systemSettings,
    updateSystemSettings,
    showToast
  } = useMermiStore();

  const [activeTab, setActiveTab] = useState<'run' | 'desafios' | 'drops' | 'recompensas' | 'regras'>('run');

  // Race event form
  const [isCreatingRace, setIsCreatingRace] = useState(false);
  const [raceName, setRaceName] = useState('');
  const [raceDistances, setRaceDistances] = useState('3K, 5K, 10K');
  const [raceDate, setRaceDate] = useState('2026-10-18');
  const [raceTime, setRaceTime] = useState('07:30');
  const [raceLocation, setRaceLocation] = useState('Lagoa dos Ingleses - Nova Lima / BH');
  const [racePrice, setRacePrice] = useState('89.00');
  const [raceSlots, setRaceSlots] = useState('300');
  const [racePointsReward, setRacePointsReward] = useState('150');
  const [raceKitDesc, setRaceKitDesc] = useState('Camiseta oficial dry-fit, viseira, chip cronometragem e marmita pós-prova 500g inclusa');

  // Mission form
  const [isCreatingMission, setIsCreatingMission] = useState(false);
  const [missionTitle, setMissionTitle] = useState('');
  const [missionDesc, setMissionDesc] = useState('');
  const [missionPoints, setMissionPoints] = useState('50');
  const [missionTarget, setMissionTarget] = useState('3');

  // Drop form
  const [isCreatingDrop, setIsCreatingDrop] = useState(false);
  const [dropTitle, setDropTitle] = useState('');
  const [dropRewardType, setDropRewardType] = useState<DropRewardType>('marmita');
  const [dropRewardLabel, setDropRewardLabel] = useState('');
  const [dropQuantity, setDropQuantity] = useState('50');
  const [dropMinPoints, setDropMinPoints] = useState('200');

  const handleCreateRaceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!raceName) {
      showToast('Informe o nome da corrida.');
      return;
    }

    const distList = raceDistances.split(',').map((d) => d.trim());
    const regPrice = parseFloat(racePrice) || 89;
    const ptsReward = parseInt(racePointsReward) || 150;
    const totalCapacity = parseInt(raceSlots) || 300;

    createRaceEvent({
      name: raceName,
      description: 'Circuito Oficial MerMi Run de Rua & Saúde balanceado para todos os níveis.',
      shortDescription: 'Circuito Oficial MerMi Run de Rua & Saúde',
      eventType: 'corrida_paga',
      status: 'inscricoes_abertas',
      date: raceDate,
      time: raceTime,
      locationName: raceLocation,
      address: raceLocation,
      city: 'São Paulo',
      state: 'SP',
      totalSpots: totalCapacity,
      filledSpots: 0,
      registrationStartDate: new Date().toISOString(),
      registrationEndDate: raceDate,
      minAge: 16,
      categories: distList.map((dist, idx) => ({
        id: `cat_${idx + 1}_${dist.toLowerCase()}`,
        name: `Categoria ${dist}`,
        distanceKm: parseFloat(dist) || 5,
        distanceLabel: dist,
        maxParticipants: Math.round(totalCapacity / distList.length),
        currentParticipants: 0,
        batches: [
          {
            batchNumber: 1,
            name: '1º Lote Oficial',
            price: regPrice,
            availableSpots: totalCapacity,
            soldSpots: 0
          }
        ],
        allowedKits: ['kit_oficial'],
        pointsOnRegistration: 50,
        pointsOnCheckIn: 25,
        pointsOnCompletion: ptsReward,
        active: true
      })),
      kits: [
        {
          id: 'kit_oficial',
          name: 'Kit Oficial MerMi Run',
          type: 'kit_oficial',
          title: 'Kit Oficial',
          description: raceKitDesc || 'Camiseta Dry-Fit, Medalha Finisher, Chip',
          itemsIncluded: raceKitDesc.split(',').map((k) => k.trim()),
          extraPrice: 0,
          includesShirt: true,
          active: true
        }
      ],
      pointsConfig: {
        pointsRewardRegistration: 50,
        pointsRewardCheckIn: 25,
        pointsRewardCompletion: ptsReward,
        allowPointsDiscount: true,
        pointsToReaisRatio: 0.1,
        minPointsToRedeem: 50,
        maxDiscountPercentage: 30
      },
      communication: {
        schedule: [{ time: raceTime, title: 'Largada Oficial' }],
        kitPickupLocation: raceLocation,
        kitPickupDates: 'Na véspera da prova',
        kitPickupInstructions: 'Apresentar comprovante e documento oficial com foto.',
        startLocation: raceLocation,
        startInstructions: 'Chegar com 45 minutos de antecedência.',
        finishLocation: raceLocation,
        finishInstructions: 'Retirada de medalhas e kit pós-prova na tenda de recuperação.',
        courseDescription: 'Percurso 100% asfaltado e plano com hidratação a cada 2,5km.',
        rulesSummary: 'Regulamento oficial MerMi Run. Classificação por chip eletrônico.',
        contactEmail: 'mermirun@mermifitlife.com.br'
      },
      isVirtual: false,
      featured: true,
      active: true,
      certificateEnabled: true
    });

    setRaceName('');
    setIsCreatingRace(false);
  };

  const handleCreateMissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!missionTitle) return;

    createMission({
      title: missionTitle,
      description: missionDesc || 'Complete os hábitos saudáveis para ganhar pontos.',
      pointsReward: parseInt(missionPoints) || 50,
      goal: parseInt(missionTarget) || 3,
      progress: 0,
      unit: 'dias',
      type: 'semanal',
      objective: missionDesc || 'Manter constância nos hábitos',
      status: 'em_andamento',
      rules: 'Completar nos dias estipulados no app',
      active: true
    });

    setMissionTitle('');
    setMissionDesc('');
    setIsCreatingMission(false);
  };

  const handleCreateDropSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dropTitle || !dropRewardLabel) return;

    createDrop({
      title: dropTitle,
      subtitle: 'Drop Surpresa Exclusivo (Identidade Oficial Azul)',
      description: 'Lote relâmpago de recompensas secretas liberadas para atletas dedicados.',
      rewardType: dropRewardType,
      rewardValue: dropRewardLabel,
      rewardLabel: dropRewardLabel,
      quantityTotal: parseInt(dropQuantity) || 50,
      startDate: '2026-09-01',
      endDate: '2026-12-31',
      minPointsRequired: parseInt(dropMinPoints) || 200,
      minOrdersRequired: 2,
      frequency: 'semanal',
      active: true,
      badge: 'DROP EXCLUSIVO'
    });

    setDropTitle('');
    setDropRewardLabel('');
    setIsCreatingDrop(false);
  };

  return (
    <div className="space-y-6">

      {/* HEADER & SUBTABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 font-['Outfit']">
            GAMIFICAÇÃO, EVENTOS & LEALDADE
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
            MerMi Run, Desafios, Drops & Regras de Points
          </h2>
          <p className="text-xs text-stone-400">
            Crie provas, missões semanais, lotes secretos e gerencie a economia de pontos
          </p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'run', label: 'MerMi Run', icon: Zap },
            { id: 'desafios', label: 'Desafios', icon: Flame },
            { id: 'drops', label: 'Drop Surpresa', icon: Gift },
            { id: 'recompensas', label: 'Recompensas', icon: Award },
            { id: 'regras', label: 'Regras Points', icon: Trophy }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-[#0EB24A] text-stone-950 font-black shadow-md'
                    : 'bg-[#171E31] text-stone-400 hover:text-white border border-stone-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: MERMI RUN */}
      {activeTab === 'run' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-wider font-['Outfit'] flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#0EB24A]" />
              Eventos de Corrida Oficiais ({raceEvents.length} circuitos)
            </h3>

            <button
              onClick={() => setIsCreatingRace(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#0EB24A] hover:bg-[#0ca042] text-stone-950 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Criar Corrida</span>
            </button>
          </div>

          <div className="space-y-3">
            {raceEvents.map((race) => {
              const regPrice = race.categories?.[0]?.batches?.[0]?.price || 0;
              const pointsCompletion = race.pointsConfig?.pointsRewardCompletion || 150;
              const distances = race.categories?.map((c) => c.distanceLabel).join(', ') || '5K';
              const kitsList = race.kits?.map((k) => k.name).join(' · ') || 'Kit Oficial';

              return (
                <div
                  key={race.id}
                  className="bg-[#171E31] border border-stone-800 rounded-3xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black text-base text-white font-['Outfit']">
                        {race.name}
                      </span>
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {race.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-[10px] text-amber-300 font-bold">
                        +{pointsCompletion} Points
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-500" />
                        {race.date} às {race.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-500" />
                        {race.locationName || race.address || 'São Paulo - SP'}
                      </span>
                      <span>
                        Distâncias: <strong className="text-white">{distances}</strong>
                      </span>
                      <span>
                        Vagas: <strong className="text-white">{race.filledSpots} / {race.totalSpots}</strong>
                      </span>
                      <span className="text-emerald-400 font-bold font-mono">
                        Inscrição: R$ {regPrice.toFixed(2)}
                      </span>
                    </div>

                    <div className="text-[11px] text-stone-400 pt-1 border-t border-stone-800/80">
                      <strong>Kit:</strong> {kitsList}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 shrink-0 border-t md:border-t-0 md:border-l border-stone-800 pt-3 md:pt-0 md:pl-4">
                    <button
                      onClick={() => deleteRaceEvent(race.id)}
                      className="p-2 rounded-xl bg-stone-800 hover:bg-rose-900/60 text-stone-400 hover:text-rose-300 transition-colors cursor-pointer"
                      title="Excluir corrida"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: DESAFIOS */}
      {activeTab === 'desafios' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-wider font-['Outfit'] flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#0EB24A]" />
              Desafios & Missões Ativas ({missions.length} desafios)
            </h3>

            <button
              onClick={() => setIsCreatingMission(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#0EB24A] hover:bg-[#0ca042] text-stone-950 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Desafio</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {missions.map((m) => (
              <div
                key={m.id}
                className="bg-[#171E31] border border-stone-800 rounded-3xl p-4 shadow-lg flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{m.title}</span>
                    <span className="px-2 py-0.2 rounded-full bg-amber-400/20 text-amber-300 font-bold text-[10px]">
                      +{m.pointsReward} pts
                    </span>
                  </div>
                  <p className="text-stone-400 text-[11px] leading-relaxed">{m.description}</p>
                  <span className="text-stone-500 block text-[10px]">Meta: {m.goal} {m.unit || 'vezes'} por ciclo</span>
                </div>

                <button
                  onClick={() => deleteMission(m.id)}
                  className="text-stone-500 hover:text-rose-400 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DROP SURPRESA */}
      {activeTab === 'drops' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-blue-950/40 border border-blue-500/40 flex items-center justify-between text-xs text-blue-200">
            <div>
              <strong className="block text-white">IDENTIDADE VISUAL OFICIAL: MERMI DROP SURPRESA</strong>
              <p className="text-[11px] text-blue-300 mt-0.5">
                O Drop Surpresa opera com a paleta oficial azul e dourada dos Assets oficiais. Não gerar arte alternativa por IA.
              </p>
            </div>
            <button
              onClick={() => setIsCreatingDrop(true)}
              className="px-3.5 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-stone-950 font-black text-xs uppercase tracking-wider shrink-0 cursor-pointer shadow-md"
            >
              Criar Drop
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {drops.map((drop) => (
              <div
                key={drop.id}
                className="bg-[#171E31] border border-stone-800 rounded-3xl p-5 shadow-lg space-y-3 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                      drop.active ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-stone-800 text-stone-500'
                    }`}>
                      {drop.active ? 'LOTE ATIVO' : 'ENCERRADO'}
                    </span>
                    <h4 className="text-base font-black text-white font-['Outfit'] mt-1">{drop.title}</h4>
                    <p className="text-amber-300 font-bold mt-0.5">Prêmio: {drop.rewardLabel}</p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleDropStatus(drop.id)}
                      className="px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-[10px] text-stone-300 cursor-pointer"
                    >
                      {drop.active ? 'Pausar' : 'Ativar'}
                    </button>
                    <button
                      onClick={() => deleteDrop(drop.id)}
                      className="text-stone-500 hover:text-rose-400 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-[#0E131F] border border-stone-800 text-[11px]">
                  <div>
                    <span className="text-[9px] text-stone-500 block">Resgates</span>
                    <strong className="text-white">{drop.quantityClaimed} / {drop.quantityTotal}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-stone-500 block">Exigência</span>
                    <strong className="text-amber-300">{drop.minPointsRequired} pts</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-stone-500 block">Pedidos Mín.</span>
                    <strong className="text-emerald-400">{drop.minOrdersRequired} pedidos</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: RECOMPENSAS */}
      {activeTab === 'recompensas' && (
        <div className="space-y-4">
          <div className="border-b border-stone-800 pb-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider font-['Outfit'] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#0EB24A]" />
              Catálogo Oficial do Resgate da Semana ({rewards.length} recompensas)
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Itens que os clientes podem resgatar com seu saldo de MerMi Points
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className="bg-[#171E31] border border-stone-800 rounded-3xl p-4 shadow-lg space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
                    {reward.pointsCost} POINTS
                  </span>
                  <span className="text-stone-400 text-[10px]">Estoque: {reward.stock} un</span>
                </div>

                <h5 className="font-bold text-white text-xs mt-1">{reward.title}</h5>
                <p className="text-stone-400 text-[11px] leading-relaxed line-clamp-2">{reward.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: REGRAS DE POINTS */}
      {activeTab === 'regras' && (
        <div className="space-y-4">
          <div className="border-b border-stone-800 pb-3">
            <h3 className="text-sm font-black text-white uppercase tracking-wider font-['Outfit'] flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#0EB24A]" />
              Configuração das Regras de Ganho de MerMi Points
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Defina a quantidade de points atribuídos por ação no aplicativo
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {earningRules.map((rule) => (
              <div
                key={rule.id}
                className="bg-[#171E31] border border-stone-800 rounded-3xl p-4 shadow-md flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-bold text-white block">{rule.name}</span>
                  <span className="text-stone-400 text-[11px] block">{rule.description}</span>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-black text-amber-400 text-sm font-mono block">
                    +{rule.pointsAmount} pts
                  </span>
                  <span className={`text-[9px] uppercase font-bold ${rule.active ? 'text-emerald-400' : 'text-stone-500'}`}>
                    {rule.active ? 'Ativa' : 'Inativa'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE RACE MODAL */}
      {isCreatingRace && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateRaceSubmit} className="bg-[#171E31] border border-stone-700 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-white font-['Outfit']">Criar Evento MerMi Run</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-300 font-bold block mb-1">Nome da Prova</label>
                <input
                  type="text"
                  value={raceName}
                  onChange={(e) => setRaceName(e.target.value)}
                  placeholder="Ex: MerMi Run 2026 · Etapa Primavera"
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">Distâncias</label>
                  <input
                    type="text"
                    value={raceDistances}
                    onChange={(e) => setRaceDistances(e.target.value)}
                    placeholder="Ex: 3K, 5K, 10K"
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-stone-300 font-bold block mb-1">Points ao Concluir</label>
                  <input
                    type="number"
                    value={racePointsReward}
                    onChange={(e) => setRacePointsReward(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">Data</label>
                  <input
                    type="date"
                    value={raceDate}
                    onChange={(e) => setRaceDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-stone-300 font-bold block mb-1">Horário</label>
                  <input
                    type="time"
                    value={raceTime}
                    onChange={(e) => setRaceTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-stone-300 font-bold block mb-1">Local da Largada</label>
                <input
                  type="text"
                  value={raceLocation}
                  onChange={(e) => setRaceLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">Valor Inscrição (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={racePrice}
                    onChange={(e) => setRacePrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-stone-300 font-bold block mb-1">Total de Vagas</label>
                  <input
                    type="number"
                    value={raceSlots}
                    onChange={(e) => setRaceSlots(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="text-stone-300 font-bold block mb-1">Kit Incluso</label>
                <input
                  type="text"
                  value={raceKitDesc}
                  onChange={(e) => setRaceKitDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingRace(false)}
                className="flex-1 py-2.5 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#0EB24A] text-stone-950 text-xs font-black"
              >
                Publicar Corrida
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CREATE MISSION MODAL */}
      {isCreatingMission && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateMissionSubmit} className="bg-[#171E31] border border-stone-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-white font-['Outfit']">Criar Desafio / Missão</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-300 font-bold block mb-1">Título</label>
                <input
                  type="text"
                  value={missionTitle}
                  onChange={(e) => setMissionTitle(e.target.value)}
                  placeholder="Ex: Treinar 3 dias nesta semana"
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-stone-300 font-bold block mb-1">Descrição</label>
                <textarea
                  rows={2}
                  value={missionDesc}
                  onChange={(e) => setMissionDesc(e.target.value)}
                  placeholder="Registre 3 treinos no tracker..."
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">Recompensa (Points)</label>
                  <input
                    type="number"
                    value={missionPoints}
                    onChange={(e) => setMissionPoints(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-stone-300 font-bold block mb-1">Meta de Repetições</label>
                  <input
                    type="number"
                    value={missionTarget}
                    onChange={(e) => setMissionTarget(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingMission(false)}
                className="flex-1 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-[#0EB24A] text-stone-950 text-xs font-black"
              >
                Salvar Desafio
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CREATE DROP MODAL */}
      {isCreatingDrop && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateDropSubmit} className="bg-[#171E31] border border-stone-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-white font-['Outfit']">Criar Drop Surpresa</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-300 font-bold block mb-1">Título do Lote</label>
                <input
                  type="text"
                  value={dropTitle}
                  onChange={(e) => setDropTitle(e.target.value)}
                  placeholder="Ex: Drop Relâmpago Marmita Premium"
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">Tipo de Recompensa</label>
                  <select
                    value={dropRewardType}
                    onChange={(e) => setDropRewardType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                  >
                    <option value="marmita">Marmita Grátis</option>
                    <option value="points">Points Bônus</option>
                    <option value="cupom">Cupom Especial</option>
                    <option value="acessorio">Acessório</option>
                  </select>
                </div>
                <div>
                  <label className="text-stone-300 font-bold block mb-1">Nome do Prêmio</label>
                  <input
                    type="text"
                    value={dropRewardLabel}
                    onChange={(e) => setDropRewardLabel(e.target.value)}
                    placeholder="Ex: Marmita 500g Salmão Nobre"
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">Quantidade do Lote</label>
                  <input
                    type="number"
                    value={dropQuantity}
                    onChange={(e) => setDropQuantity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-stone-300 font-bold block mb-1">Pontos Mínimos</label>
                  <input
                    type="number"
                    value={dropMinPoints}
                    onChange={(e) => setDropMinPoints(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingDrop(false)}
                className="flex-1 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-blue-500 text-stone-950 text-xs font-black"
              >
                Liberar Drop
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
