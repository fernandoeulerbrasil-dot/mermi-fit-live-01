import React, { useState } from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import {
  Award,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Flame,
  Target,
  History,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  UserCheck,
  Zap,
  Gift,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import {
  EarningRuleCalculationType,
  EarningRuleConfig,
  GamificationMission,
  MissionFrequency,
  UserLevelConfig,
  BadgeAchievement
} from '../../types/gamification';

export const GamificationAdmin: React.FC = () => {
  const {
    user,
    setUserPoints,
    weeklyMember,
    updateWeeklyMember,
    transactions,
    earningRules,
    userLevels,
    badges,
    missions,
    streak,
    pointsSummary,
    adjustPointsAdmin,
    createEarningRule,
    updateEarningRule,
    deleteEarningRule,
    toggleEarningRuleActive,
    createUserLevel,
    updateUserLevel,
    deleteUserLevel,
    createBadge,
    updateBadge,
    deleteBadge,
    unlockBadge,
    createMission,
    updateMission,
    deleteMission,
    updateStreakDays,
    showToast
  } = useMermiStore();

  const [activeSubTab, setActiveSubTab] = useState<
    'regras' | 'niveis' | 'badges' | 'missoes' | 'streak' | 'ajuste_historico' | 'membro_semana'
  >('regras');

  // Estado para Ajuste Manual de Points
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustReason, setAdjustReason] = useState('');
  const [adminName, setAdminName] = useState('Administrador MerMi');

  // Estado para Nova Regra de Pontos
  const [isCreatingRule, setIsCreatingRule] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleKey, setNewRuleKey] = useState('');
  const [newRuleDesc, setNewRuleDesc] = useState('');
  const [newRulePts, setNewRulePts] = useState('20');
  const [newRuleCalc, setNewRuleCalc] = useState<EarningRuleCalculationType>('fixo');
  const [newRuleCat, setNewRuleCat] = useState<'compras' | 'habitos' | 'esportes' | 'comunidade' | 'especiais'>('compras');

  // Estado para Nova Missão
  const [isCreatingMission, setIsCreatingMission] = useState(false);
  const [newMissionTitle, setNewMissionTitle] = useState('');
  const [newMissionDesc, setNewMissionDesc] = useState('');
  const [newMissionType, setNewMissionType] = useState<MissionFrequency>('semanal');
  const [newMissionGoal, setNewMissionGoal] = useState('10');
  const [newMissionUnit, setNewMissionUnit] = useState('marmitas');
  const [newMissionPts, setNewMissionPts] = useState('50');
  const [newMissionExtra, setNewMissionExtra] = useState('');
  const [newMissionRules, setNewMissionRules] = useState('');

  // Estado para Novo Nível
  const [isCreatingLevel, setIsCreatingLevel] = useState(false);
  const [newLevelNum, setNewLevelNum] = useState('6');
  const [newLevelName, setNewLevelName] = useState('');
  const [newLevelMinPts, setNewLevelMinPts] = useState('3000');
  const [newLevelIcon, setNewLevelIcon] = useState('💎');
  const [newLevelDesc, setNewLevelDesc] = useState('');
  const [newLevelBenefits, setNewLevelBenefits] = useState('');

  // Estado para Novo Badge
  const [isCreatingBadge, setIsCreatingBadge] = useState(false);
  const [newBadgeName, setNewBadgeName] = useState('');
  const [newBadgeDesc, setNewBadgeDesc] = useState('');
  const [newBadgeIcon, setNewBadgeIcon] = useState('🏆');
  const [newBadgeCond, setNewBadgeCond] = useState('');
  const [newBadgePts, setNewBadgePts] = useState('30');
  const [newBadgeCat, setNewBadgeCat] = useState<'primeiros_passos' | 'nutricao' | 'esportes' | 'constancia' | 'comunidade' | 'fidelidade'>('fidelidade');

  // Estado para Membro da Semana
  const [memberName, setMemberName] = useState(weeklyMember.name);
  const [memberHandle, setMemberHandle] = useState(weeklyMember.handle);
  const [memberPeriod, setMemberPeriod] = useState(weeklyMember.weekPeriod);
  const [memberPhotoUrl, setMemberPhotoUrl] = useState(weeklyMember.photoUrl);
  const [memberMotivation, setMemberMotivation] = useState(weeklyMember.motivationMessage);
  const [memberBenefits, setMemberBenefits] = useState(weeklyMember.benefits || '');
  const [memberPoints, setMemberPoints] = useState(String(weeklyMember.points));
  const [memberOrders, setMemberOrders] = useState(String(weeklyMember.ordersCount));
  const [memberActive, setMemberActive] = useState(weeklyMember.active ?? true);
  const [memberPublished, setMemberPublished] = useState(weeklyMember.published ?? true);
  const [memberFeaturedOnHome, setMemberFeaturedOnHome] = useState(weeklyMember.featuredOnHome ?? false);

  const handleSaveMember = () => {
    updateWeeklyMember({
      name: memberName,
      handle: memberHandle,
      weekPeriod: memberPeriod,
      photoUrl: memberPhotoUrl,
      motivationMessage: memberMotivation,
      benefits: memberBenefits,
      points: Number(memberPoints) || 0,
      ordersCount: Number(memberOrders) || 0,
      active: memberActive,
      published: memberPublished,
      featuredOnHome: memberFeaturedOnHome
    });
    showToast('Membro da Semana atualizado com sucesso no sistema!');
  };

  const handleManualAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(adjustAmount);
    if (isNaN(amountNum) || amountNum === 0) {
      showToast('Informe uma quantidade válida de pontos (positiva para crédito, negativa para débito).');
      return;
    }
    if (!adjustReason.trim()) {
      showToast('Informe o motivo do ajuste para auditoria.');
      return;
    }

    adjustPointsAdmin(amountNum, adjustReason.trim(), adminName.trim());
    setAdjustAmount('');
    setAdjustReason('');
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim() || !newRuleKey.trim()) {
      showToast('Preencha o nome e a chave de ação da regra.');
      return;
    }

    createEarningRule({
      name: newRuleName.trim(),
      actionKey: newRuleKey.trim().toLowerCase().replace(/\s+/g, '_'),
      description: newRuleDesc.trim(),
      pointsAmount: Number(newRulePts) || 10,
      calculationType: newRuleCalc,
      category: newRuleCat,
      active: true
    });

    setIsCreatingRule(false);
    setNewRuleName('');
    setNewRuleKey('');
    setNewRuleDesc('');
  };

  const handleCreateMission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMissionTitle.trim()) {
      showToast('Informe o título da missão.');
      return;
    }

    createMission({
      title: newMissionTitle.trim(),
      description: newMissionDesc.trim(),
      type: newMissionType,
      objective: newMissionTitle.trim(),
      progress: 0,
      goal: Number(newMissionGoal) || 10,
      unit: newMissionUnit.trim() || 'un',
      pointsReward: Number(newMissionPts) || 50,
      extraRewardLabel: newMissionExtra.trim() || undefined,
      rules: newMissionRules.trim() || 'Válido durante o período ativo',
      status: 'em_andamento',
      active: true
    });

    setIsCreatingMission(false);
    setNewMissionTitle('');
    setNewMissionDesc('');
  };

  const handleCreateLevel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLevelName.trim()) {
      showToast('Informe o nome do nível.');
      return;
    }

    createUserLevel({
      levelNumber: Number(newLevelNum) || userLevels.length + 1,
      name: newLevelName.trim(),
      minPoints: Number(newLevelMinPts) || 1000,
      badgeIcon: newLevelIcon || '⭐',
      badgeColor: '#EAB308',
      description: newLevelDesc.trim(),
      benefits: newLevelBenefits.split(',').map((b) => b.trim()).filter(Boolean),
      active: true
    });

    setIsCreatingLevel(false);
    setNewLevelName('');
    setNewLevelDesc('');
  };

  const handleCreateBadge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBadgeName.trim()) {
      showToast('Informe o nome do badge.');
      return;
    }

    createBadge({
      name: newBadgeName.trim(),
      description: newBadgeDesc.trim(),
      icon: newBadgeIcon || '🏆',
      condition: newBadgeCond.trim(),
      pointsReward: Number(newBadgePts) || 20,
      category: newBadgeCat,
      unlocked: false,
      status: 'ativo'
    });

    setIsCreatingBadge(false);
    setNewBadgeName('');
    setNewBadgeDesc('');
    setNewBadgeCond('');
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER DE AUDITORIA & VISÃO GERAL */}
      <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
          <div>
            <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider font-['Outfit']">
              BLOCO 05 OFICIAL • SISTEMA CENTRAL
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
              Gestão de MerMi Points, Gamificação & Recompensas
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Controle centralizado de regras de pontuação, níveis de fidelidade, badges, missões e livro-razão auditado.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black font-['Outfit'] flex items-center gap-1.5">
              <ShieldCheck size={14} />
              Motor Ativo & Auditado
            </span>
          </div>
        </div>

        {/* MÉTRICAS DE PONTOS EM TEMPO REAL */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-stone-900/80 border border-stone-800">
            <span className="text-[10px] font-bold text-stone-400 uppercase block">Saldo Circulante</span>
            <span className="text-xl font-black text-amber-400 font-['Outfit']">
              {pointsSummary.currentBalance.toLocaleString('pt-BR')} <span className="text-xs text-stone-400">pts</span>
            </span>
            <span className="text-[10px] text-stone-500 block mt-0.5">Nível {pointsSummary.currentLevel.levelNumber} ({pointsSummary.currentLevel.name})</span>
          </div>

          <div className="p-3 rounded-2xl bg-stone-900/80 border border-stone-800">
            <span className="text-[10px] font-bold text-stone-400 uppercase block">Total Emitido</span>
            <span className="text-xl font-black text-emerald-400 font-['Outfit']">
              +{pointsSummary.totalEarned.toLocaleString('pt-BR')} <span className="text-xs text-stone-400">pts</span>
            </span>
            <span className="text-[10px] text-emerald-600 block mt-0.5">Créditos de compras e hábitos</span>
          </div>

          <div className="p-3 rounded-2xl bg-stone-900/80 border border-stone-800">
            <span className="text-[10px] font-bold text-stone-400 uppercase block">Total Resgatado</span>
            <span className="text-xl font-black text-rose-400 font-['Outfit']">
              -{pointsSummary.totalUsed.toLocaleString('pt-BR')} <span className="text-xs text-stone-400">pts</span>
            </span>
            <span className="text-[10px] text-rose-500 block mt-0.5">Marmitas e brindes trocados</span>
          </div>

          <div className="p-3 rounded-2xl bg-stone-900/80 border border-stone-800">
            <span className="text-[10px] font-bold text-stone-400 uppercase block">Livro-Razão</span>
            <span className="text-xl font-black text-blue-400 font-['Outfit']">
              {transactions.length} <span className="text-xs text-stone-400">lançamentos</span>
            </span>
            <span className="text-[10px] text-blue-400/80 block mt-0.5">100% à prova de duplicidade</span>
          </div>
        </div>
      </div>

      {/* SUB-TABS INTERNAS DO MERMI CONTROL */}
      <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none border-b border-stone-800 text-xs font-bold font-['Outfit'] uppercase">
        {[
          { id: 'regras', label: '1. Regras de Ganho', icon: Zap, count: earningRules.length },
          { id: 'niveis', label: '2. Níveis do Usuário', icon: Award, count: userLevels.length },
          { id: 'badges', label: '3. Badges & Conquistas', icon: Sparkles, count: badges.length },
          { id: 'missoes', label: '4. Missões', icon: Target, count: missions.length },
          { id: 'streak', label: '5. Constância & Streak', icon: Flame },
          { id: 'ajuste_historico', label: '6. Histórico & Ajuste Manual', icon: History, count: transactions.length },
          { id: 'membro_semana', label: '7. Membro da Semana', icon: UserCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3.5 py-2.5 rounded-2xl shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-stone-950 font-black shadow-md'
                  : 'bg-stone-900/90 text-stone-400 hover:text-white border border-stone-800'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                  isActive ? 'bg-stone-950 text-amber-300' : 'bg-stone-800 text-stone-300'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. REGRAS DE GANHO DE POINTS (REQUISITO 3) */}
      {/* ========================================================================= */}
      {activeSubTab === 'regras' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-white font-['Outfit']">
                Regras Configuráveis de Ganho de MerMi Points
              </h3>
              <p className="text-xs text-stone-400">
                Altere quanto cada ação do ecossistema vale sem precisar alterar código no frontend.
              </p>
            </div>

            <button
              onClick={() => setIsCreatingRule(!isCreatingRule)}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs font-['Outfit'] uppercase flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shadow-sm"
            >
              <Plus size={14} />
              <span>{isCreatingRule ? 'Cancelar' : 'Nova Regra'}</span>
            </button>
          </div>

          {/* Form Nova Regra */}
          {isCreatingRule && (
            <form onSubmit={handleCreateRule} className="p-4 rounded-3xl bg-stone-900 border border-amber-500/40 space-y-3">
              <h4 className="text-xs font-black uppercase text-amber-400 font-['Outfit']">
                Cadastrar Nova Regra de Pontuação
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Nome da Ação</label>
                  <input
                    type="text"
                    required
                    value={newRuleName}
                    onChange={(e) => setNewRuleName(e.target.value)}
                    placeholder="Ex: Treino no Fim de Semana"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Identificador Chave (key)</label>
                  <input
                    type="text"
                    required
                    value={newRuleKey}
                    onChange={(e) => setNewRuleKey(e.target.value)}
                    placeholder="Ex: treino_fim_de_semana"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Quantidade de Points</label>
                  <input
                    type="number"
                    required
                    value={newRulePts}
                    onChange={(e) => setNewRulePts(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Tipo de Cálculo</label>
                  <select
                    value={newRuleCalc}
                    onChange={(e) => setNewRuleCalc(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white font-bold"
                  >
                    <option value="fixo">Fixo por Ação</option>
                    <option value="por_marmita">Multiplicado por Marmita</option>
                    <option value="por_real">Multiplicado por R$ gasto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Categoria</label>
                  <select
                    value={newRuleCat}
                    onChange={(e) => setNewRuleCat(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white font-bold"
                  >
                    <option value="compras">Compras & Pedidos</option>
                    <option value="habitos">Hábitos & Saúde</option>
                    <option value="esportes">Esportes & Corridas</option>
                    <option value="comunidade">Comunidade & Indicação</option>
                    <option value="especiais">Especiais & Campanhas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Descrição</label>
                  <input
                    type="text"
                    value={newRuleDesc}
                    onChange={(e) => setNewRuleDesc(e.target.value)}
                    placeholder="Explicação da regra para o usuário"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0EB24A] hover:bg-emerald-400 text-stone-950 font-black text-xs font-['Outfit'] uppercase cursor-pointer"
                >
                  Salvar Regra
                </button>
              </div>
            </form>
          )}

          {/* Lista de Regras Existentes */}
          <div className="space-y-2">
            {earningRules.map((rule) => (
              <div
                key={rule.id}
                className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-stone-700 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 text-[10px] font-bold font-mono">
                      {rule.actionKey}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 text-[10px] font-bold uppercase">
                      {rule.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                      rule.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {rule.active ? 'Ativa' : 'Pausada'}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-white font-['Outfit']">
                    {rule.name}
                  </h4>
                  <p className="text-xs text-stone-400">
                    {rule.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={rule.pointsAmount}
                      onChange={(e) => updateEarningRule(rule.id, { pointsAmount: Number(e.target.value) || 0 })}
                      className="w-20 px-2 py-1 rounded-lg bg-stone-950 border border-stone-700 text-amber-400 font-black text-center text-xs"
                    />
                    <span className="text-xs text-stone-400 font-bold">pts</span>
                  </div>

                  <button
                    onClick={() => toggleEarningRuleActive(rule.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-['Outfit'] uppercase transition-all cursor-pointer ${
                      rule.active
                        ? 'bg-amber-900/30 text-amber-300 border border-amber-700/50'
                        : 'bg-emerald-900/30 text-emerald-300 border border-emerald-700/50'
                    }`}
                  >
                    {rule.active ? 'Pausar' : 'Ativar'}
                  </button>

                  <button
                    onClick={() => deleteEarningRule(rule.id)}
                    className="p-1.5 rounded-xl bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 border border-rose-800/40 transition-all cursor-pointer"
                    title="Excluir regra"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. NÍVEIS DO USUÁRIO (REQUISITO 5) */}
      {/* ========================================================================= */}
      {activeSubTab === 'niveis' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-white font-['Outfit']">
                Configuração dos Níveis de Fidelidade
              </h3>
              <p className="text-xs text-stone-400">
                Altere nome dos níveis (Cliente Foco, Cliente Constante, etc.), pontuação mínima exigida e vantagens.
              </p>
            </div>

            <button
              onClick={() => setIsCreatingLevel(!isCreatingLevel)}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs font-['Outfit'] uppercase flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shadow-sm"
            >
              <Plus size={14} />
              <span>{isCreatingLevel ? 'Cancelar' : 'Novo Nível'}</span>
            </button>
          </div>

          {isCreatingLevel && (
            <form onSubmit={handleCreateLevel} className="p-4 rounded-3xl bg-stone-900 border border-amber-500/40 space-y-3">
              <h4 className="text-xs font-black uppercase text-amber-400 font-['Outfit']">
                Cadastrar Novo Nível
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Número do Nível</label>
                  <input
                    type="number"
                    required
                    value={newLevelNum}
                    onChange={(e) => setNewLevelNum(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Nome do Nível</label>
                  <input
                    type="text"
                    required
                    value={newLevelName}
                    onChange={(e) => setNewLevelName(e.target.value)}
                    placeholder="Ex: Cliente Supremo"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Pontos Mínimos Exigidos</label>
                  <input
                    type="number"
                    required
                    value={newLevelMinPts}
                    onChange={(e) => setNewLevelMinPts(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Ícone / Badge</label>
                  <input
                    type="text"
                    value={newLevelIcon}
                    onChange={(e) => setNewLevelIcon(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white text-center text-lg"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-stone-300 font-bold mb-1">Vantagens (separadas por vírgula)</label>
                  <input
                    type="text"
                    value={newLevelBenefits}
                    onChange={(e) => setNewLevelBenefits(e.target.value)}
                    placeholder="Ex: 10% OFF em marmitas, Frete Grátis 1x no mês, Atendimento VIP"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0EB24A] hover:bg-emerald-400 text-stone-950 font-black text-xs font-['Outfit'] uppercase cursor-pointer"
                >
                  Salvar Nível
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {userLevels.map((lvl) => (
              <div
                key={lvl.levelNumber}
                className="p-4 rounded-3xl bg-stone-900 border border-stone-800 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-xl bg-stone-950 border border-stone-800">
                      {lvl.badgeIcon}
                    </span>
                    <div>
                      <span className="text-[10px] font-black uppercase text-amber-400 font-['Outfit']">
                        NÍVEL {lvl.levelNumber}
                      </span>
                      <h4 className="text-base font-black text-white font-['Outfit']">
                        {lvl.name}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span className="text-xs text-stone-400 font-bold">Mínimo:</span>
                    <input
                      type="number"
                      value={lvl.minPoints}
                      onChange={(e) => updateUserLevel(lvl.levelNumber, { minPoints: Number(e.target.value) || 0 })}
                      className="w-24 px-2.5 py-1 rounded-lg bg-stone-950 border border-stone-700 text-amber-400 font-black text-center text-xs"
                    />
                    <span className="text-xs text-stone-400 font-bold">pts</span>
                    {userLevels.length > 1 && (
                      <button
                        onClick={() => deleteUserLevel(lvl.levelNumber)}
                        className="p-1.5 rounded-xl bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 border border-rose-800/40 transition-all cursor-pointer ml-2"
                        title="Excluir nível"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-stone-400 font-bold mb-1">Nome do Nível</label>
                    <input
                      type="text"
                      value={lvl.name}
                      onChange={(e) => updateUserLevel(lvl.levelNumber, { name: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 font-bold mb-1">Descrição</label>
                    <input
                      type="text"
                      value={lvl.description}
                      onChange={(e) => updateUserLevel(lvl.levelNumber, { description: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs"
                    />
                  </div>
                </div>

                {/* Vantagens */}
                <div className="pt-1">
                  <span className="text-[10px] font-bold text-stone-400 uppercase block mb-1">Vantagens Concedidas:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {lvl.benefits.map((b, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-stone-950 border border-stone-800 text-amber-300 text-xs font-bold"
                      >
                        ✓ {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. BADGES E CONQUISTAS (REQUISITO 6) */}
      {/* ========================================================================= */}
      {activeSubTab === 'badges' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-white font-['Outfit']">
                Badges & Conquistas da Gamificação
              </h3>
              <p className="text-xs text-stone-400">
                Gerencie troféus, condições de desbloqueio automático e recompensas em MerMi Points.
              </p>
            </div>

            <button
              onClick={() => setIsCreatingBadge(!isCreatingBadge)}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs font-['Outfit'] uppercase flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shadow-sm"
            >
              <Plus size={14} />
              <span>{isCreatingBadge ? 'Cancelar' : 'Nova Conquista'}</span>
            </button>
          </div>

          {isCreatingBadge && (
            <form onSubmit={handleCreateBadge} className="p-4 rounded-3xl bg-stone-900 border border-amber-500/40 space-y-3">
              <h4 className="text-xs font-black uppercase text-amber-400 font-['Outfit']">
                Cadastrar Nova Conquista
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Nome do Badge</label>
                  <input
                    type="text"
                    required
                    value={newBadgeName}
                    onChange={(e) => setNewBadgeName(e.target.value)}
                    placeholder="Ex: Corredor de Elite"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Ícone</label>
                  <input
                    type="text"
                    value={newBadgeIcon}
                    onChange={(e) => setNewBadgeIcon(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white text-center text-lg"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Recompensa (Points)</label>
                  <input
                    type="number"
                    value={newBadgePts}
                    onChange={(e) => setNewBadgePts(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-stone-300 font-bold mb-1">Condição de Desbloqueio</label>
                  <input
                    type="text"
                    required
                    value={newBadgeCond}
                    onChange={(e) => setNewBadgeCond(e.target.value)}
                    placeholder="Ex: Completar 5 provas no MerMi Run"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Descrição</label>
                  <input
                    type="text"
                    value={newBadgeDesc}
                    onChange={(e) => setNewBadgeDesc(e.target.value)}
                    placeholder="Mensagem inspiradora do badge"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0EB24A] hover:bg-emerald-400 text-stone-950 font-black text-xs font-['Outfit'] uppercase cursor-pointer"
                >
                  Salvar Badge
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {badges.map((b) => (
              <div
                key={b.id}
                className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 flex items-start justify-between gap-3 hover:border-stone-700 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-center text-xl shrink-0">
                    {b.icon}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-white font-['Outfit']">{b.name}</h4>
                      {b.unlocked && (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                          ✓ Desbloqueado
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-400 line-clamp-1">{b.description}</p>
                    <span className="text-[10px] text-amber-400 font-medium block">
                      Critério: {b.condition} • Bônus: +{b.pointsReward || 0} pts
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => unlockBadge(b.id)}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 text-[10px] font-bold cursor-pointer"
                  >
                    Testar
                  </button>
                  <button
                    onClick={() => deleteBadge(b.id)}
                    className="p-1 rounded-lg bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 border border-rose-800/40 cursor-pointer"
                    title="Excluir badge"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. GESTÃO DE MISSÕES (REQUISITO 7) */}
      {/* ========================================================================= */}
      {activeSubTab === 'missoes' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-white font-['Outfit']">
                Missões Diárias, Semanais & Especiais
              </h3>
              <p className="text-xs text-stone-400">
                Crie e configure missões com metas e entrega garantida de Points ou brindes.
              </p>
            </div>

            <button
              onClick={() => setIsCreatingMission(!isCreatingMission)}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs font-['Outfit'] uppercase flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shadow-sm"
            >
              <Plus size={14} />
              <span>{isCreatingMission ? 'Cancelar' : 'Nova Missão'}</span>
            </button>
          </div>

          {isCreatingMission && (
            <form onSubmit={handleCreateMission} className="p-4 rounded-3xl bg-stone-900 border border-amber-500/40 space-y-3">
              <h4 className="text-xs font-black uppercase text-amber-400 font-['Outfit']">
                Cadastrar Nova Missão
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Título da Missão</label>
                  <input
                    type="text"
                    required
                    value={newMissionTitle}
                    onChange={(e) => setNewMissionTitle(e.target.value)}
                    placeholder="Ex: Complete 10.000 passos"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Periodicidade</label>
                  <select
                    value={newMissionType}
                    onChange={(e) => setNewMissionType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white font-bold"
                  >
                    <option value="diaria">Diária</option>
                    <option value="semanal">Semanal</option>
                    <option value="mensal">Mensal</option>
                    <option value="especial">Especial / Campanha</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Meta Numérica</label>
                  <input
                    type="number"
                    required
                    value={newMissionGoal}
                    onChange={(e) => setNewMissionGoal(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Unidade da Meta</label>
                  <input
                    type="text"
                    value={newMissionUnit}
                    onChange={(e) => setNewMissionUnit(e.target.value)}
                    placeholder="Ex: passos, marmitas, km, ml"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Recompensa em Points</label>
                  <input
                    type="number"
                    required
                    value={newMissionPts}
                    onChange={(e) => setNewMissionPts(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Brinde Extra (Opcional)</label>
                  <input
                    type="text"
                    value={newMissionExtra}
                    onChange={(e) => setNewMissionExtra(e.target.value)}
                    placeholder="Ex: Cupom 10% OFF"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0EB24A] hover:bg-emerald-400 text-stone-950 font-black text-xs font-['Outfit'] uppercase cursor-pointer"
                >
                  Salvar Missão
                </button>
              </div>
            </form>
          )}

          <div className="space-y-2.5">
            {missions.map((m) => (
              <div
                key={m.id}
                className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-stone-700 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase">
                      {m.type}
                    </span>
                    <span className="text-xs font-black text-amber-400 font-['Outfit']">
                      +{m.pointsReward} Points
                    </span>
                    {m.extraRewardLabel && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                        {m.extraRewardLabel}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-black text-white font-['Outfit']">{m.title}</h4>
                  <p className="text-xs text-stone-400">{m.description}</p>
                  <span className="text-[10px] text-stone-500 block">
                    Meta: {m.goal} {m.unit} • Progresso atual do usuário de teste: {m.progress} {m.unit}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => updateMission(m.id, { active: !m.active })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-['Outfit'] uppercase cursor-pointer ${
                      m.active
                        ? 'bg-amber-900/30 text-amber-300 border border-amber-700/50'
                        : 'bg-emerald-900/30 text-emerald-300 border border-emerald-700/50'
                    }`}
                  >
                    {m.active ? 'Pausar' : 'Ativar'}
                  </button>

                  <button
                    onClick={() => deleteMission(m.id)}
                    className="p-1.5 rounded-xl bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 border border-rose-800/40 cursor-pointer"
                    title="Excluir missão"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. CONSTÂNCIA & STREAK (REQUISITO 8) */}
      {/* ========================================================================= */}
      {activeSubTab === 'streak' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-black text-white font-['Outfit']">
              Regras de Constância & Sequência de Dias (Streak)
            </h3>
            <p className="text-xs text-stone-400">
              Configure se e quando a sequência de dias gera bônus de pontos ou recompensas.
            </p>
          </div>

          {/* Simulador de Sequência de Teste */}
          <div className="p-4 rounded-3xl bg-stone-900 border border-stone-800 space-y-3">
            <h4 className="text-xs font-black uppercase text-orange-400 font-['Outfit'] flex items-center gap-1.5">
              <Flame size={14} />
              Ajustar Sequência Atual do Usuário
            </h4>
            <div className="flex flex-wrap items-center gap-2">
              {[0, 3, 7, 14, 21, 30].map((days) => (
                <button
                  key={days}
                  onClick={() => updateStreakDays(days)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black font-['Outfit'] cursor-pointer transition-all ${
                    streak.currentStreakDays === days
                      ? 'bg-orange-500 text-stone-950 shadow-md'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  🔥 {days} Dias
                </button>
              ))}
            </div>
          </div>

          {/* Marcos Configuráveis de Streak */}
          <div className="space-y-2.5">
            {streak.milestones.map((milestone) => (
              <div
                key={milestone.days}
                className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-lg">
                    🔥
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-white font-['Outfit']">
                      {milestone.label}
                    </h5>
                    <span className="text-xs text-stone-400">
                      Exige {milestone.days} dias consecutivos sem interrupção
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-black text-amber-400 font-['Outfit'] block">
                    +{milestone.points} pts
                  </span>
                  <span className="text-[10px] text-stone-500">
                    {milestone.achieved ? '✓ Resgatado no perfil' : 'Pendente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. HISTÓRICO GERAL & AJUSTE MANUAL DO ADMINISTRADOR (REQUISITO 1 & 2) */}
      {/* ========================================================================= */}
      {activeSubTab === 'ajuste_historico' && (
        <div className="space-y-5">
          {/* FORMULÁRIO DE AJUSTE MANUAL DO ADMINISTRADOR */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-950/40 via-stone-900 to-stone-900 border border-blue-500/40 shadow-xl space-y-4">
            <div>
              <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider font-['Outfit']">
                CONTROLE DE AUDITORIA (REQUISITO 2)
              </span>
              <h3 className="text-base font-black text-white font-['Outfit']">
                Ajuste Manual de Points pelo Administrador
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Qualquer crédito ou débito gera um registro oficial no livro-razão com identificação do responsável e motivo.
              </p>
            </div>

            <form onSubmit={handleManualAdjustment} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-stone-300 font-bold mb-1">
                  Quantidade (+ para crédito, - para débito)
                </label>
                <input
                  type="number"
                  required
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  placeholder="Ex: +50 ou -30"
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-amber-400 font-black text-sm"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">Administrador Responsável</label>
                <input
                  type="text"
                  required
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">Motivo do Ajuste (Obrigatório)</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="Ex: Bônus por engajamento na prova"
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white"
                />
              </div>

              <div className="sm:col-span-3 flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs font-['Outfit'] uppercase tracking-wider cursor-pointer shadow-md transition-all active:scale-95"
                >
                  Registrar Ajuste no Livro-Razão
                </button>
              </div>
            </form>
          </div>

          {/* TABELA DE AUDITORIA DAS TRANSAÇÕES */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h4 className="text-sm font-black text-white font-['Outfit'] uppercase">
                Livro-Razão Central ({transactions.length} Transações Registradas)
              </h4>
              <span className="text-[10px] text-stone-400 font-mono">
                Ordenado cronologicamente
              </span>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 rounded-2xl bg-stone-950/70 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase font-mono ${
                        tx.type === 'ganho'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : tx.type === 'utilizado'
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {tx.type}
                      </span>
                      <span className="font-bold text-white">{tx.description}</span>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] text-stone-500">
                      <span>{tx.date}</span>
                      {tx.referenceId && <span>Ref: {tx.referenceId}</span>}
                      {tx.adminResponsible && <span className="text-blue-300">Admin: {tx.adminResponsible}</span>}
                      <span className="font-mono text-[9px] text-stone-600">ID: {tx.id}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`font-black font-['Outfit'] text-sm ${
                      tx.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {tx.amount >= 0 ? `+${tx.amount}` : tx.amount} pts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MEMBRO DA SEMANA (REQUISITO 3 DA PROMPT ANTERIOR) */}
      {/* ========================================================================= */}
      {activeSubTab === 'membro_semana' && (
        <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
            <div>
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider font-['Outfit']">
                RECONHECIMENTO DA COMUNIDADE
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white font-['Outfit']">
                Gestão Completa: Membro da Semana
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Controle publicação, período, foto, mensagem, benefícios e visibilidade na Home sem editar código.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase font-['Outfit'] ${
                memberActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-stone-800 text-stone-400'
              }`}>
                {memberActive ? '● ATIVO' : '○ DESATIVADO'}
              </span>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase font-['Outfit'] ${
                memberPublished ? 'bg-blue-500/20 text-blue-300 border border-blue-400/40' : 'bg-stone-800 text-stone-400'
              }`}>
                {memberPublished ? 'PUBLICADO' : 'RETIRADO'}
              </span>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase font-['Outfit'] ${
                memberFeaturedOnHome ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40' : 'bg-stone-800 text-stone-400'
              }`}>
                {memberFeaturedOnHome ? 'DESTAQUE TOPO HOME' : 'SOMENTE POSTS & CAMPANHAS'}
              </span>
            </div>
          </div>

          {/* Botões rápidos de controle do administrador */}
          <div className="flex flex-wrap items-center gap-2 p-3 bg-stone-900/80 rounded-2xl border border-stone-800">
            <button
              type="button"
              onClick={() => setMemberActive(!memberActive)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-['Outfit'] uppercase transition-all cursor-pointer ${
                memberActive ? 'bg-emerald-600 text-white' : 'bg-stone-800 text-stone-400'
              }`}
            >
              {memberActive ? '✓ Ativo no Sistema' : 'Desativado'}
            </button>
            <button
              type="button"
              onClick={() => setMemberPublished(!memberPublished)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-['Outfit'] uppercase transition-all cursor-pointer ${
                memberPublished ? 'bg-blue-600 text-white' : 'bg-stone-800 text-stone-400'
              }`}
            >
              {memberPublished ? '✓ Publicado' : 'Retirado'}
            </button>
            <button
              type="button"
              onClick={() => setMemberFeaturedOnHome(!memberFeaturedOnHome)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-['Outfit'] uppercase transition-all cursor-pointer ${
                memberFeaturedOnHome ? 'bg-amber-500 text-stone-950 font-black' : 'bg-stone-800 text-stone-400'
              }`}
            >
              {memberFeaturedOnHome ? '★ Destaque no Topo da Home' : 'Dentro de Posts & Campanhas'}
            </button>
          </div>

          {/* Formulário com todos os campos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-stone-300 font-bold mb-1">Nome do Membro</label>
              <input
                type="text"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-stone-300 font-bold mb-1">Handle (@username)</label>
              <input
                type="text"
                value={memberHandle}
                onChange={(e) => setMemberHandle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-stone-300 font-bold mb-1">Período de Destaque</label>
              <input
                type="text"
                value={memberPeriod}
                onChange={(e) => setMemberPeriod(e.target.value)}
                placeholder="Ex: Semana 38 / 2026"
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-white font-bold"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-stone-300 font-bold mb-1">URL da Imagem / Foto Oficial</label>
              <input
                type="text"
                value={memberPhotoUrl}
                onChange={(e) => setMemberPhotoUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-white font-mono text-[11px]"
              />
            </div>
            <div className="flex items-center gap-3">
              <div>
                <label className="block text-stone-300 font-bold mb-1">Points</label>
                <input
                  type="number"
                  value={memberPoints}
                  onChange={(e) => setMemberPoints(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-stone-300 font-bold mb-1">Pedidos</label>
                <input
                  type="number"
                  value={memberOrders}
                  onChange={(e) => setMemberOrders(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-white font-bold"
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <label className="block text-stone-300 font-bold mb-1">Mensagem Motivacional</label>
              <textarea
                rows={2}
                value={memberMotivation}
                onChange={(e) => setMemberMotivation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-white text-xs"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-stone-300 font-bold mb-1">Benefícios Concedidos</label>
              <input
                type="text"
                value={memberBenefits}
                onChange={(e) => setMemberBenefits(e.target.value)}
                placeholder="Ex: 1x Marmita Fit cortesia + Bolsa Térmica MerMi + Destaque na Comunidade"
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-white font-bold"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveMember}
              className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs font-['Outfit'] uppercase tracking-wider transition-all cursor-pointer shadow-md"
            >
              Salvar Configurações do Membro da Semana
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
