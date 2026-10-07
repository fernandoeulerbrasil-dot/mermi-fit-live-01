import React, { useState } from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import {
  HeartPulse,
  Droplets,
  Footprints,
  Moon,
  Dumbbell,
  Target,
  Watch,
  ShieldCheck,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Save,
  Users,
  Activity,
  Smartphone
} from 'lucide-react';
import { DevicePlatformKey } from '../../types/evolution';

export const EvolutionAdmin: React.FC = () => {
  const {
    evolutionAdminConfig,
    updateEvolutionAdminConfig,
    connectedDevices,
    toggleDeviceConnection,
    waterLogs,
    stepsLogs,
    sleepLogs,
    activityLogs,
    habits,
    evolutionGoals,
    showToast
  } = useMermiStore();

  const [activeSubTab, setActiveSubTab] = useState<'metas_padrao' | 'regras_points' | 'wearables' | 'metricas_comunidade'>('metas_padrao');

  // Form states for Default Goals
  const [defaultWaterGoal, setDefaultWaterGoal] = useState(evolutionAdminConfig.defaultWaterGoalMl.toString());
  const [defaultStepsGoal, setDefaultStepsGoal] = useState(evolutionAdminConfig.defaultStepsGoal.toString());
  const [defaultSleepHours, setDefaultSleepHours] = useState(evolutionAdminConfig.defaultSleepHours.toString());

  // Form states for Points Rewards
  const [ptsWater, setPtsWater] = useState(evolutionAdminConfig.pointsPerWaterGoalMet.toString());
  const [ptsSteps, setPtsSteps] = useState(evolutionAdminConfig.pointsPerStepsGoalMet.toString());
  const [ptsWorkout, setPtsWorkout] = useState(evolutionAdminConfig.pointsPerWorkoutLogged.toString());
  const [ptsWeeklyConsistency, setPtsWeeklyConsistency] = useState(evolutionAdminConfig.pointsPerWeeklyConsistency.toString());

  const handleSaveDefaultGoals = (e: React.FormEvent) => {
    e.preventDefault();
    updateEvolutionAdminConfig({
      defaultWaterGoalMl: Number(defaultWaterGoal) || 2500,
      defaultStepsGoal: Number(defaultStepsGoal) || 8500,
      defaultSleepHours: Number(defaultSleepHours) || 8
    });
    showToast('Parâmetros padrão de saúde atualizados.');
  };

  const handleSavePointsRules = (e: React.FormEvent) => {
    e.preventDefault();
    updateEvolutionAdminConfig({
      pointsPerWaterGoalMet: Number(ptsWater) || 15,
      pointsPerStepsGoalMet: Number(ptsSteps) || 20,
      pointsPerWorkoutLogged: Number(ptsWorkout) || 25,
      pointsPerWeeklyConsistency: Number(ptsWeeklyConsistency) || 100
    });
    showToast('Regras de pontos por hábitos salvas com sucesso.');
  };

  const handleToggleSupportedDevice = (platformKey: DevicePlatformKey) => {
    const isSupported = evolutionAdminConfig.supportedDevices.includes(platformKey);
    const updated = isSupported
      ? evolutionAdminConfig.supportedDevices.filter(k => k !== platformKey)
      : [...evolutionAdminConfig.supportedDevices, platformKey];

    updateEvolutionAdminConfig({ supportedDevices: updated });
    showToast(`Dispositivo ${platformKey} ${isSupported ? 'desabilitado' : 'habilitado'} no ecossistema.`);
  };

  // Community aggregated statistics
  const totalWaterLoggedMl = waterLogs.reduce((acc, l) => acc + l.amountMl, 0);
  const totalWaterLiters = (totalWaterLoggedMl / 1000).toFixed(1);
  const totalStepsLogged = stepsLogs.reduce((acc, l) => acc + l.stepsCount, 0);
  const averageSteps = stepsLogs.length > 0 ? Math.round(totalStepsLogged / stepsLogs.length) : 0;
  const activeHabitsCount = habits.filter(h => h.active).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300 flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5" /> GESTÃO DE SAÚDE, TRACKER & METAS
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] mt-1">
              MERMI CONTROL · EVOLUÇÃO PESSOAL
            </h2>
            <p className="text-xs text-emerald-100/90 max-w-xl mt-1">
              Configure metas de referência, regras de bonificação em MerMi Points e plataformas de wearables conectadas ao ecossistema.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/30 px-3.5 py-2 rounded-2xl text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-200 font-medium">Diretriz Educativa Ativa (Sem Alegações Médicas)</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveSubTab('metas_padrao')}
          className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'metas_padrao'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Target className="w-3.5 h-3.5" /> Metas Padrão Recomendadas
        </button>

        <button
          onClick={() => setActiveSubTab('regras_points')}
          className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'regras_points'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Award className="w-3.5 h-3.5" /> Regras de Pontos por Hábitos
        </button>

        <button
          onClick={() => setActiveSubTab('wearables')}
          className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'wearables'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Watch className="w-3.5 h-3.5" /> Dispositivos & Wearables
        </button>

        <button
          onClick={() => setActiveSubTab('metricas_comunidade')}
          className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'metricas_comunidade'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" /> Métricas Agregadas
        </button>
      </div>

      {/* TAB 1: METAS PADRÃO */}
      {activeSubTab === 'metas_padrao' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black font-['Outfit'] text-stone-900">
                Parâmetros Sugeridos para Novos Usuários
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Valores iniciais sugeridos no app. O usuário pode personalizar suas metas a qualquer momento.
              </p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-stone-100 text-stone-600 px-3 py-1 rounded-full border border-stone-200">
              Personalizável pelo Membro
            </span>
          </div>

          <form onSubmit={handleSaveDefaultGoals} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 text-blue-600">
                <Droplets className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-wider">Meta de Água Padrão</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="50"
                  value={defaultWaterGoal}
                  onChange={(e) => setDefaultWaterGoal(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-sm font-bold text-stone-900 focus:outline-none focus:border-blue-500"
                />
                <span className="text-xs font-bold text-stone-500">ml</span>
              </div>
              <p className="text-[10px] text-stone-500">
                Ex: 2.500 ml/dia (~10 copos).
              </p>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600">
                <Footprints className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-wider">Meta de Passos Padrão</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="500"
                  value={defaultStepsGoal}
                  onChange={(e) => setDefaultStepsGoal(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-sm font-bold text-stone-900 focus:outline-none focus:border-emerald-500"
                />
                <span className="text-xs font-bold text-stone-500">passos</span>
              </div>
              <p className="text-[10px] text-stone-500">
                Meta recomendada flexível (ex: 8.500 passos).
              </p>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 text-indigo-600">
                <Moon className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-wider">Horas de Sono Sugeridas</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  min="5"
                  max="12"
                  value={defaultSleepHours}
                  onChange={(e) => setDefaultSleepHours(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-sm font-bold text-stone-900 focus:outline-none focus:border-indigo-500"
                />
                <span className="text-xs font-bold text-stone-500">horas</span>
              </div>
              <p className="text-[10px] text-stone-500">
                Alvo de descanso reparador diário (ex: 8h).
              </p>
            </div>

            <div className="sm:col-span-3 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Save className="w-3.5 h-3.5" /> Salvar Metas Padrão
              </button>
            </div>
          </form>

          {/* Legal / Ethical Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-black uppercase tracking-wider text-[11px] block">
                Diretriz de Conformidade & Saúde
              </span>
              <p className="mt-0.5 text-stone-700">
                O aplicativo MERMI FIT LIFE não deve afirmar que 10.000 passos ou 2.500ml são obrigatórios universalmente. As metas são parâmetros educativos para estímulo da consistência do usuário, respeitando sua individualidade e orientações de profissionais de saúde.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REGRAS DE PONTOS */}
      {activeSubTab === 'regras_points' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-black font-['Outfit'] text-stone-900">
              Bonificação em MerMi Points por Hábitos Saudáveis
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Estes valores alimentam o Livro-Razão (ledger) oficial do Bloco 05 quando o usuário cumpre suas metas no dia a dia.
            </p>
          </div>

          <form onSubmit={handleSavePointsRules} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <label className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-blue-500" /> Points ao Bater Meta de Água (Diária)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={ptsWater}
                  onChange={(e) => setPtsWater(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-sm font-bold text-stone-900 focus:outline-none focus:border-blue-500"
                />
                <span className="text-xs font-bold text-stone-500">Points</span>
              </div>
              <p className="text-[10px] text-stone-500">Creditado automaticamente na primeira vez que atinge a meta no dia.</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <label className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                <Footprints className="w-3.5 h-3.5 text-emerald-500" /> Points ao Bater Meta de Passos (Diária)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={ptsSteps}
                  onChange={(e) => setPtsSteps(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-sm font-bold text-stone-900 focus:outline-none focus:border-emerald-500"
                />
                <span className="text-xs font-bold text-stone-500">Points</span>
              </div>
              <p className="text-[10px] text-stone-500">Creditado ao completar os passos diários configurados.</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <label className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5 text-amber-500" /> Points por Treino Registrado
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={ptsWorkout}
                  onChange={(e) => setPtsWorkout(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-sm font-bold text-stone-900 focus:outline-none focus:border-amber-500"
                />
                <span className="text-xs font-bold text-stone-500">Points</span>
              </div>
              <p className="text-[10px] text-stone-500">Incentivo ao registro de treinos de academia, funcional ou corrida.</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <label className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-purple-500" /> Points por Bônus de Constância Semanal (7 Dias)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={ptsWeeklyConsistency}
                  onChange={(e) => setPtsWeeklyConsistency(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-sm font-bold text-stone-900 focus:outline-none focus:border-purple-500"
                />
                <span className="text-xs font-bold text-stone-500">Points</span>
              </div>
              <p className="text-[10px] text-stone-500">Super recompensa para membros que mantêm hábitos 100% ativos.</p>
            </div>

            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Save className="w-3.5 h-3.5" /> Atualizar Regras de Pontos
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: WEARABLES */}
      {activeSubTab === 'wearables' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black font-['Outfit'] text-stone-900">
                Plataformas & Dispositivos Suportados
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Habilite ou desabilite as integrações que os usuários podem visualizar e conectar no app.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {connectedDevices.map(device => {
              const isSupported = evolutionAdminConfig.supportedDevices.includes(device.platformKey);
              return (
                <div
                  key={device.platformKey}
                  className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-800 shadow-xs">
                      {device.platformKey === 'apple_health' && <HeartPulse className="w-5 h-5 text-rose-500" />}
                      {device.platformKey === 'strava' && <Activity className="w-5 h-5 text-orange-500" />}
                      {device.platformKey === 'google_fit' && <Smartphone className="w-5 h-5 text-blue-500" />}
                      {device.platformKey === 'garmin' && <Watch className="w-5 h-5 text-cyan-600" />}
                      {device.platformKey === 'polar' && <HeartPulse className="w-5 h-5 text-red-600" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-stone-900">{device.name}</h4>
                      <p className="text-xs text-stone-500">
                        {isSupported ? 'Disponível para pareamento dos usuários' : 'Desabilitado no applet'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        device.connected
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {device.connected ? 'Conectado no App' : 'Desconectado'}
                    </span>

                    <button
                      onClick={() => handleToggleSupportedDevice(device.platformKey)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        isSupported
                          ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                          : 'bg-emerald-600 text-white hover:bg-emerald-500'
                      }`}
                    >
                      {isSupported ? 'Desativar Suporte' : 'Habilitar'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: MÉTRICAS AGREGADAS */}
      {activeSubTab === 'metricas_comunidade' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5" /> Hidratação Total
              </span>
              <h4 className="text-xl sm:text-2xl font-black text-stone-900 font-['Outfit']">
                {totalWaterLiters} <span className="text-xs font-normal text-stone-500">Litros</span>
              </h4>
              <p className="text-[10px] text-stone-500">Registrados pelos membros</p>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1">
                <Footprints className="w-3.5 h-3.5" /> Média de Passos
              </span>
              <h4 className="text-xl sm:text-2xl font-black text-stone-900 font-['Outfit']">
                {averageSteps.toLocaleString('pt-BR')}
              </h4>
              <p className="text-[10px] text-stone-500">Passos/dia por usuário</p>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 flex items-center gap-1">
                <Dumbbell className="w-3.5 h-3.5" /> Treinos Registrados
              </span>
              <h4 className="text-xl sm:text-2xl font-black text-stone-900 font-['Outfit']">
                {activityLogs.length}
              </h4>
              <p className="text-[10px] text-stone-500">Sessões ativas no histórico</p>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 flex items-center gap-1">
                <Target className="w-3.5 h-3.5" /> Metas Concluídas
              </span>
              <h4 className="text-xl sm:text-2xl font-black text-stone-900 font-['Outfit']">
                {evolutionGoals.filter(g => g.status === 'concluida').length} / {evolutionGoals.length}
              </h4>
              <p className="text-[10px] text-stone-500">Taxa de sucesso consistente</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm">
            <h4 className="text-sm font-black font-['Outfit'] text-stone-900 mb-3">
              Últimas Atividades Sincronizadas
            </h4>
            <div className="divide-y divide-stone-100">
              {activityLogs.slice(0, 5).map(act => (
                <div key={act.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-stone-900">{act.title}</span>
                    <span className="text-stone-500 ml-2">({act.durationMinutes} min)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-stone-500">{act.date}</span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
                      {act.origin}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
