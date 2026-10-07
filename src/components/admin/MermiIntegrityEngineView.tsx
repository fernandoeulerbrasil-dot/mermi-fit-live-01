import React, { useState } from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import {
  RoleType,
  GranularPermission,
  ROLE_PERMISSIONS_MATRIX,
  CanonicalOrderStatus,
  IntegrityReportResult,
  ORDER_VALID_TRANSITIONS
} from '../../types/mermiCoreEngine';
import {
  runFullSystemIntegrityCheck,
  validateOrderStateTransition,
  exportSystemDataSnapshot,
  hasGranularPermission
} from '../../services/mermiCoreEngine';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Database,
  Lock,
  Layers,
  FileText,
  Download,
  Copy,
  RotateCcw,
  Sparkles,
  Award,
  Cpu,
  RefreshCw,
  Search,
  Key,
  DollarSign,
  TrendingUp,
  Sliders,
  Check,
  X
} from 'lucide-react';

export const MermiIntegrityEngineView: React.FC = () => {
  const {
    products,
    user,
    orders,
    inventory,
    pointsLedger,
    priceHistory,
    currentAdminUser,
    systemSettings,
    crmCustomers,
    insumos,
    stockMovements,
    auditLogs,
    automations,
    showToast
  } = useMermiStore();

  const [activeTab, setActiveTab] = useState<'integridade' | 'ledger' | 'precos_historico' | 'rbac' | 'maquina_estados' | 'backup'>('integridade');

  // Integridade
  const [isRunningCheck, setIsRunningCheck] = useState(false);
  const [integrityReport, setIntegrityReport] = useState<IntegrityReportResult>(() =>
    runFullSystemIntegrityCheck({
      products,
      userPoints: user.mermiPoints,
      pointsLedger: pointsLedger || [],
      orders,
      inventory
    })
  );

  // RBAC Simulator
  const [simulatedRole, setSimulatedRole] = useState<RoleType>('OWNER');

  // State Machine Simulator
  const [smFromStatus, setSmFromStatus] = useState<CanonicalOrderStatus>('PENDING');
  const [smToStatus, setSmToStatus] = useState<CanonicalOrderStatus>('CONFIRMED');
  const [smResult, setSmResult] = useState<{ allowed: boolean; reason?: string } | null>(null);

  // Backup Export
  const [snapshotJson, setSnapshotJson] = useState<string>('');

  const handleRunIntegrityTest = () => {
    setIsRunningCheck(true);
    setTimeout(() => {
      const report = runFullSystemIntegrityCheck({
        products,
        userPoints: user.mermiPoints,
        pointsLedger: pointsLedger || [],
        orders,
        inventory
      });
      setIntegrityReport(report);
      setIsRunningCheck(false);
      showToast('Diagnóstico de integridade e segurança executado com sucesso!');
    }, 400);
  };

  const handleTestTransition = () => {
    const res = validateOrderStateTransition(smFromStatus, smToStatus, simulatedRole === 'OWNER');
    setSmResult(res);
  };

  const handleGenerateBackup = () => {
    const json = exportSystemDataSnapshot({
      crmCustomers,
      orders,
      products,
      insumos,
      pointsLedger,
      stockMovements,
      auditLogs,
      automations,
      systemSettings
    });
    setSnapshotJson(json);
    showToast('Snapshot oficial gerado com sucesso!');
  };

  const handleCopyBackup = () => {
    if (!snapshotJson) return;
    navigator.clipboard.writeText(snapshotJson);
    showToast('Snapshot copiado para a área de transferência!');
  };

  return (
    <div className="space-y-6 text-stone-100 animate-fade-in font-sans">
      
      {/* HEADER DO MÓDULO (BLOCO 13) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 font-['Outfit']">
              BLOCO 13 — NÚCLEO ARQUITETURAL
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-black text-emerald-400">
              SINGLE SOURCE OF TRUTH
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit'] mt-1">
            Núcleo de Dados, Regras, Permissões & Integridade
          </h2>
          <p className="text-xs text-stone-400">
            Fonte única da verdade, reconciliação de ledger, máquina de estados finita e matriz RBAC
          </p>
        </div>

        <button
          onClick={handleRunIntegrityTest}
          disabled={isRunningCheck}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#0EB24A] to-emerald-600 hover:opacity-95 text-stone-950 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRunningCheck ? 'animate-spin' : ''}`} />
          <span>{isRunningCheck ? 'Verificando...' : 'Executar Testes de Integridade'}</span>
        </button>
      </div>

      {/* NAVEGAÇÃO DE SUB-ABAS DO BLOCO 13 */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-bold font-['Outfit']">
        {[
          { id: 'integridade', label: 'Diagnóstico & Testes', icon: ShieldCheck, badge: `${integrityReport.passed_checks}/${integrityReport.total_checks}` },
          { id: 'ledger', label: 'Points Ledger Oficial', icon: Award, badge: `${pointsLedger?.length || 0}` },
          { id: 'precos_historico', label: 'Tabela & Histórico de Preços', icon: DollarSign, badge: `${priceHistory?.length || 4}` },
          { id: 'rbac', label: 'Matriz Granular RBAC', icon: Lock, badge: '12 Roles' },
          { id: 'maquina_estados', label: 'Máquina de Estados (Pedidos)', icon: Layers, badge: '7 Estados' },
          { id: 'backup', label: 'Backup & Snapshot JSON', icon: Database, badge: 'v13' }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-2xl shrink-0 transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-[#0EB24A] text-stone-950 font-black shadow-md shadow-emerald-500/20'
                  : 'bg-[#171E31] text-stone-400 hover:text-white border border-stone-800'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                  isActive ? 'bg-stone-950/20 text-stone-950' : 'bg-stone-800 text-stone-300'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ===================================================================== */}
      {/* ABA 1: DIAGNÓSTICO & TESTES DE INTEGRIDADE (SEÇÕES 57, 58 E 59) */}
      {/* ===================================================================== */}
      {activeTab === 'integridade' && (
        <div className="space-y-6">
          
          {/* Status Geral */}
          <div className={`p-5 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            integrityReport.overall_status === 'INTEGRITY_100_PERCENT'
              ? 'bg-emerald-950/20 border-emerald-500/40'
              : 'bg-amber-950/20 border-amber-500/40'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                integrityReport.overall_status === 'INTEGRITY_100_PERCENT'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/20 text-amber-400'
              }`}>
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-white font-['Outfit']">
                  {integrityReport.overall_status === 'INTEGRITY_100_PERCENT'
                    ? '100% de Integridade & Segurança Validada'
                    : 'Avisos ou Pendências Detectadas'}
                </h3>
                <p className="text-xs text-stone-400">
                  {integrityReport.passed_checks} de {integrityReport.total_checks} verificações em conformidade estrita com o Bloco 13.
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-stone-400 block">Última auditoria</span>
              <strong className="text-xs font-mono text-emerald-400">
                {new Date(integrityReport.executed_at).toLocaleTimeString('pt-BR')}
              </strong>
            </div>
          </div>

          {/* Cards das Verificações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {integrityReport.checks.map((chk) => (
              <div
                key={chk.id}
                className="p-4 rounded-2xl bg-[#171E31] border border-stone-800 space-y-2 hover:border-stone-700 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#0E131F] text-stone-400 text-[10px] font-mono font-bold uppercase">
                      {chk.category}
                    </span>
                    <h4 className="text-xs font-bold text-white">
                      {chk.title}
                    </h4>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 ${
                    chk.status === 'PASSED'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : chk.status === 'WARNING'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {chk.status === 'PASSED' && <Check className="w-3 h-3" />}
                    {chk.status === 'WARNING' && <AlertTriangle className="w-3 h-3" />}
                    {chk.status === 'FAILED' && <X className="w-3 h-3" />}
                    <span>{chk.status}</span>
                  </span>
                </div>

                <p className="text-[11px] text-stone-400 leading-relaxed">
                  {chk.description}
                </p>

                <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-[10px] font-mono text-stone-400">
                  <span className="truncate max-w-[280px] text-stone-300">{chk.details}</span>
                  <span className="shrink-0 text-emerald-400">{chk.execution_ms}ms</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ===================================================================== */}
      {/* ABA 2: POINTS LEDGER OFICIAL (SEÇÃO 10) */}
      {/* ===================================================================== */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          
          <div className="p-4 rounded-3xl bg-[#171E31] border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-black text-white font-['Outfit']">
                Livro Razão de MerMi Points (Points Ledger)
              </h3>
              <p className="text-xs text-stone-400">
                O saldo do cliente é a soma exata dos registros válidos. Nenhuma alteração manual sem auditoria.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#0E131F] border border-stone-800 text-center">
                <span className="text-[10px] text-stone-400 block font-mono">Saldo Oficial Derivado</span>
                <strong className="text-base font-black text-amber-400 font-['Outfit']">
                  {user.mermiPoints} pts
                </strong>
              </div>
            </div>
          </div>

          {/* Tabela do Ledger */}
          <div className="bg-[#171E31] border border-stone-800 rounded-3xl overflow-hidden shadow-xl text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#101526] text-stone-400 font-['Outfit'] uppercase text-[10px] tracking-wider border-b border-stone-800">
                  <tr>
                    <th className="py-3 px-4">Entry ID</th>
                    <th className="py-3 px-4">Tipo</th>
                    <th className="py-3 px-4">Descrição</th>
                    <th className="py-3 px-4">Referência</th>
                    <th className="py-3 px-4">Antes</th>
                    <th className="py-3 px-4">Movimentação</th>
                    <th className="py-3 px-4">Depois</th>
                    <th className="py-3 px-4">Data/Hora</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800 text-stone-300">
                  {(pointsLedger && pointsLedger.length > 0) ? (
                    pointsLedger.map((entry) => {
                      const isCredit = entry.amount > 0;
                      return (
                        <tr key={entry.entry_id} className="hover:bg-[#1a2238] transition-colors">
                          <td className="py-3 px-4 font-mono text-[11px] text-stone-400">
                            {entry.entry_id}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-md font-bold text-[9px] ${
                              isCredit ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                            }`}>
                              {entry.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-stone-200">
                            {entry.description}
                          </td>
                          <td className="py-3 px-4 font-mono text-[10px] text-stone-400">
                            {entry.reference_id}
                          </td>
                          <td className="py-3 px-4 font-mono">
                            {entry.balance_before} pts
                          </td>
                          <td className={`py-3 px-4 font-mono font-bold ${isCredit ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isCredit ? `+${entry.amount}` : entry.amount} pts
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-white">
                            {entry.balance_after} pts
                          </td>
                          <td className="py-3 px-4 font-mono text-[10px] text-stone-400">
                            {new Date(entry.created_at).toLocaleString('pt-BR')}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-stone-500">
                        Nenhum registro de ledger arquivado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ===================================================================== */}
      {/* ABA 3: TABELA & HISTÓRICO DE PREÇOS (SEÇÃO 6) */}
      {/* ===================================================================== */}
      {activeTab === 'precos_historico' && (
        <div className="space-y-4">
          
          <div className="p-4 rounded-3xl bg-[#171E31] border border-stone-800 space-y-1">
            <h3 className="text-sm font-black text-white font-['Outfit']">
              Tabela de Preços Oficiais & Histórico de Vigência
            </h3>
            <p className="text-xs text-stone-400">
              Preços vigentes protegidos. Modificações geram novo registro sem sobrescrever o histórico contábil anterior.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {[
              { size: '350g', category: 'FIT', price: 19.90, desc: 'Marmitas Fit Padrão 350g' },
              { size: '500g', category: 'FIT', price: 24.90, desc: 'Marmitas Fit Grande 500g' },
              { size: '350g', category: 'FIT PREMIUM', price: 32.90, desc: 'Salmão, Camarão e Bacalhau 350g' },
              { size: '500g', category: 'FIT PREMIUM', price: 39.90, desc: 'Salmão, Camarão e Bacalhau 500g' },
            ].map((p, idx) => (
              <div key={idx} className="p-4 rounded-3xl bg-[#171E31] border border-stone-800 space-y-3">
                <div className="flex justify-between items-start">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                    p.category === 'FIT' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {p.category}
                  </span>
                  <span className="font-mono text-stone-400 text-xs font-bold">{p.size}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Preço de Tabela</span>
                  <div className="text-2xl font-black text-white font-['Outfit']">
                    R$ {p.price.toFixed(2).replace('.', ',')}
                  </div>
                </div>
                <p className="text-[11px] text-stone-400 leading-snug">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Histórico Registrado */}
          <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-5 space-y-3">
            <h4 className="text-xs font-black text-white font-['Outfit'] uppercase tracking-wider">
              Registros no Histórico de Preços
            </h4>
            <div className="space-y-2 text-xs">
              {(priceHistory || []).map((ph) => (
                <div key={ph.price_id} className="p-3 rounded-2xl bg-[#0E131F] border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <strong className="text-white font-bold">{ph.product_id} ({ph.size})</strong>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 text-[10px] font-bold">
                        R$ {ph.price.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-400">{ph.notes || 'Preço configurado pelo administrador'}</span>
                  </div>

                  <div className="text-right text-[10px] font-mono text-stone-400">
                    <span>Responsável: {ph.created_by}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ===================================================================== */}
      {/* ABA 4: MATRIZ GRANULAR RBAC (SEÇÕES 23 E 24) */}
      {/* ===================================================================== */}
      {activeTab === 'rbac' && (
        <div className="space-y-4">
          
          <div className="p-4 rounded-3xl bg-[#171E31] border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-black text-white font-['Outfit']">
                Role-Based Access Control (RBAC)
              </h3>
              <p className="text-xs text-stone-400">
                12 perfis conceituais e 26 permissões granulares com bloqueio no backend e API.
              </p>
            </div>

            {/* Seletor de Simulação de Perfil */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-400">Simular Role:</span>
              <select
                value={simulatedRole}
                onChange={(e) => setSimulatedRole(e.target.value as RoleType)}
                className="px-3 py-1.5 rounded-xl bg-[#0E131F] border border-stone-700 text-emerald-400 font-bold text-xs"
              >
                {(Object.keys(ROLE_PERMISSIONS_MATRIX) as RoleType[]).map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Resumo do Perfil Simulado */}
          <div className="p-4 rounded-2xl bg-[#101526] border border-stone-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-stone-400">Perfil ativo no teste:</span>
              <strong className="text-emerald-400 font-bold ml-1.5">{simulatedRole}</strong>
            </div>
            <div className="text-stone-400">
              Permissões concedidas: <strong>{simulatedRole === 'OWNER' ? 'TODAS (26/26)' : ROLE_PERMISSIONS_MATRIX[simulatedRole].length}</strong>
            </div>
          </div>

          {/* Grid de Permissões para a Role Selecionada */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {[
              'users.view', 'users.edit', 'users.delete',
              'orders.view', 'orders.create', 'orders.edit', 'orders.cancel', 'orders.transition_state',
              'products.view', 'products.edit',
              'prices.view', 'prices.edit',
              'inventory.view', 'inventory.edit', 'inventory.move',
              'finance.view', 'finance.edit',
              'points.view', 'points.manage', 'points.adjust',
              'runs.view', 'runs.manage',
              'campaigns.view', 'campaigns.manage', 'campaigns.publish',
              'assets.view', 'assets.manage',
              'community.view', 'community.moderate',
              'reports.view',
              'settings.manage', 'audit.view', 'system.integrity_test', 'system.backup'
            ].map((perm) => {
              const allowed = hasGranularPermission(simulatedRole, perm as GranularPermission);
              return (
                <div
                  key={perm}
                  className={`p-3 rounded-2xl border text-xs flex items-center justify-between ${
                    allowed
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-stone-200'
                      : 'bg-[#0E131F]/50 border-stone-800 text-stone-500'
                  }`}
                >
                  <span className="font-mono text-[11px] font-bold">{perm}</span>
                  <span className={`text-[10px] font-black ${allowed ? 'text-emerald-400' : 'text-stone-600'}`}>
                    {allowed ? 'PERMITIDO' : 'NEGADO'}
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ===================================================================== */}
      {/* ABA 5: MÁQUINA DE ESTADOS DO PEDIDO (SEÇÕES 27 E 28) */}
      {/* ===================================================================== */}
      {activeTab === 'maquina_estados' && (
        <div className="space-y-5">
          
          <div className="p-4 rounded-3xl bg-[#171E31] border border-stone-800 space-y-1">
            <h3 className="text-sm font-black text-white font-['Outfit']">
              Máquina de Estados de Ciclo de Vida do Pedido
            </h3>
            <p className="text-xs text-stone-400">
              Transições lineares auditadas. Estados finais DELIVERED e CANCELLED não podem ser revertidos.
            </p>
          </div>

          {/* Diagrama de Transição */}
          <div className="p-4 rounded-2xl bg-[#0E131F] border border-stone-800 overflow-x-auto">
            <div className="flex items-center gap-2 text-xs font-mono min-w-[700px]">
              <span className="px-3 py-1.5 rounded-xl bg-amber-950 text-amber-300 font-bold border border-amber-500/30">PENDING</span>
              <span>→</span>
              <span className="px-3 py-1.5 rounded-xl bg-blue-950 text-blue-300 font-bold border border-blue-500/30">CONFIRMED</span>
              <span>→</span>
              <span className="px-3 py-1.5 rounded-xl bg-purple-950 text-purple-300 font-bold border border-purple-500/30">PREPARING</span>
              <span>→</span>
              <span className="px-3 py-1.5 rounded-xl bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/30">READY</span>
              <span>→</span>
              <span className="px-3 py-1.5 rounded-xl bg-indigo-950 text-indigo-300 font-bold border border-indigo-500/30">SHIPPED</span>
              <span>→</span>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/30">DELIVERED (Final)</span>
            </div>
          </div>

          {/* Simulador de Transição */}
          <div className="p-5 rounded-3xl bg-[#171E31] border border-stone-800 space-y-4">
            <h4 className="text-xs font-black text-white font-['Outfit'] uppercase">
              Simulador de Transição de Estado
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-stone-400 block mb-1 font-bold">Estado Atual:</label>
                <select
                  value={smFromStatus}
                  onChange={(e) => setSmFromStatus(e.target.value as CanonicalOrderStatus)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                >
                  {['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-stone-400 block mb-1 font-bold">Estado Desejado:</label>
                <select
                  value={smToStatus}
                  onChange={(e) => setSmToStatus(e.target.value as CanonicalOrderStatus)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                >
                  {['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleTestTransition}
              className="px-4 py-2 rounded-xl bg-[#0EB24A] text-stone-950 font-bold text-xs cursor-pointer hover:bg-emerald-400 transition-colors"
            >
              Testar Validação de Transição
            </button>

            {smResult && (
              <div className={`p-3.5 rounded-2xl border text-xs ${
                smResult.allowed
                  ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                  : 'bg-rose-950/30 border-rose-500/50 text-rose-300'
              }`}>
                <strong>{smResult.allowed ? '✓ Transição Válida:' : '✗ Transição Rejeitada:'}</strong>
                <p className="mt-1 text-[11px] opacity-90">{smResult.reason || 'Operação segue o fluxo canônico de transição de estados.'}</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ===================================================================== */}
      {/* ABA 6: BACKUP & SNAPSHOT JSON (SEÇÃO 50) */}
      {/* ===================================================================== */}
      {activeTab === 'backup' && (
        <div className="space-y-4">
          
          <div className="p-4 rounded-3xl bg-[#171E31] border border-stone-800 space-y-1">
            <h3 className="text-sm font-black text-white font-['Outfit']">
              Backup, Snapshot & Exportação de Dados do Sistema
            </h3>
            <p className="text-xs text-stone-400">
              Gera snapshot JSON estruturado de todas as coleções oficiais para auditoria, migração e segurança.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleGenerateBackup}
              className="px-4 py-2.5 rounded-2xl bg-[#0EB24A] text-stone-950 font-bold text-xs uppercase cursor-pointer hover:bg-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Gerar Snapshot Oficial</span>
            </button>

            {snapshotJson && (
              <button
                onClick={handleCopyBackup}
                className="px-4 py-2.5 rounded-2xl bg-stone-800 text-stone-200 font-bold text-xs cursor-pointer hover:bg-stone-700 transition-colors flex items-center gap-1.5"
              >
                <Copy className="w-4 h-4" />
                <span>Copiar JSON</span>
              </button>
            )}
          </div>

          {snapshotJson && (
            <div className="bg-[#0E131F] border border-stone-800 rounded-3xl p-4 font-mono text-[11px] text-stone-300 max-h-96 overflow-y-auto">
              <pre>{snapshotJson}</pre>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
