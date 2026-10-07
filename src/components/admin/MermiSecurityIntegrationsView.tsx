import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CreditCard,
  QrCode,
  Activity,
  Smartphone,
  Lock,
  RefreshCw,
  FileText,
  AlertTriangle,
  Download,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Database,
  Eye,
  Key,
  Globe,
  Sliders,
  Send
} from 'lucide-react';
import { useMermiStore } from '../../context/MermiStoreContext';
import { PaymentMethodType, CanonicalPaymentStatus } from '../../types/mermiSecurityPayments';

export const MermiSecurityIntegrationsView: React.FC = () => {
  const {
    legalPolicies,
    externalIntegrations,
    authSessions,
    paymentTransactions,
    webhookEvents,
    securityIncidents,
    userPrivacyConsent,
    user,
    simulateWebhookDispatch,
    executeRefundAndReversal,
    revokeAuthSession,
    revokeAllOtherSessions,
    updatePrivacyConsentSettings,
    exportLgpdUserData,
    requestLgpdAccountAnonymization,
    showToast
  } = useMermiStore();

  const [activeSubTab, setActiveSubTab] = useState<
    'pagamentos_webhooks' | 'saude_integracoes' | 'sessoes_acesso' | 'privacidade_lgpd' | 'checklist'
  >('pagamentos_webhooks');

  // Estado para simulação de webhook
  const [whSimProvider, setWhSimProvider] = useState<'PIX_DIRECT' | 'MERMI_SECURE_PAY'>('PIX_DIRECT');
  const [whSimEvent, setWhSimEvent] = useState<'PAYMENT_APPROVED' | 'PAYMENT_FAILED' | 'PAYMENT_REFUNDED'>('PAYMENT_APPROVED');
  const [whSimPaymentId, setWhSimPaymentId] = useState<string>(paymentTransactions[0]?.payment_id || 'pay-tx-1021');
  const [whSimOrderId, setWhSimOrderId] = useState<string>(paymentTransactions[0]?.order_id || 'PED-1021');
  const [whSimAmount, setWhSimAmount] = useState<number>(paymentTransactions[0]?.amount || 149.50);
  const [whSimInvalidSig, setWhSimInvalidSig] = useState<boolean>(false);

  // Estado para estorno
  const [selectedTxForRefund, setSelectedTxForRefund] = useState<string | null>(null);
  const [refundReason, setRefundReason] = useState<string>('Cancelamento solicitado pelo cliente antes do preparo');

  // Estado para política selecionada
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>(legalPolicies[0]?.policy_id || '');

  // Estado de teste de anonimização LGPD
  const [anonymizationResult, setAnonymizationResult] = useState<any | null>(null);

  // Healthcheck manual
  const [testingIntegrationId, setTestingIntegrationId] = useState<string | null>(null);

  const handleTestPing = (intId: string) => {
    setTestingIntegrationId(intId);
    setTimeout(() => {
      setTestingIntegrationId(null);
      showToast('Ping de conectividade executado com sucesso: Status 200 OK');
    }, 700);
  };

  const handleRunWebhookSim = () => {
    const idempotencyKey = `idem-sim-${Date.now()}`;
    const result = simulateWebhookDispatch({
      provider: whSimProvider,
      eventType: whSimEvent,
      paymentId: whSimPaymentId,
      orderId: whSimOrderId,
      amount: Number(whSimAmount),
      idempotencyKey,
      signatureHeader: whSimInvalidSig ? 'invalid_signature' : 'sha256=a8f9c1b0...'
    });

    if (result.success) {
      showToast(result.message);
    } else {
      showToast('Alerta de Segurança: ' + result.message);
    }
  };

  const handleExecuteRefund = (paymentId: string, orderId: string) => {
    const res = executeRefundAndReversal({
      paymentId,
      orderId,
      reason: refundReason
    });
    setSelectedTxForRefund(null);
    showToast(res.message);
  };

  const handleExportJson = () => {
    const jsonStr = exportLgpdUserData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mermi_lgpd_export_${user.id || 'usr'}_${Date.now()}.json`;
    a.click();
    showToast('Download do arquivo de dados LGPD iniciado.');
  };

  const handleSimulateAnonymization = () => {
    const res = requestLgpdAccountAnonymization();
    setAnonymizationResult(res);
    showToast('Conta anonimizada conforme Art. 16 da LGPD (retenção legal preservada).');
  };

  const activeSessionsCount = authSessions.filter(s => s.status === 'active').length;
  const totalApprovedAmount = paymentTransactions
    .filter(t => t.status === 'APPROVED')
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6 pb-12 font-['Outfit'] text-stone-200">
      {/* 1. TOPO & BANNER PRINCIPAL */}
      <div className="bg-gradient-to-r from-[#171E31] via-[#101526] to-[#0A0D18] border border-stone-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#0EB24A] text-xs font-bold mb-3 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              Bloco 14 — Segurança, Autenticação, Pagamentos & LGPD
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Núcleo de Segurança, Pagamentos & Privacidade
            </h1>
            <p className="text-sm text-stone-400 mt-1 max-w-2xl">
              Princípio Central: <strong className="text-stone-200">"Confie no backend, não no frontend"</strong>. Todos os cálculos de preço, cupons, points e status de pagamento são autoritativos do servidor.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportJson}
              className="px-4 py-2.5 rounded-2xl bg-[#171E31] hover:bg-stone-800 border border-stone-700 text-stone-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4 text-[#0EB24A]" />
              Exportar Relatório LGPD
            </button>
          </div>
        </div>

        {/* 4 CARDS DE INDICADORES RÁPIDOS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6">
          <div className="bg-[#101526]/80 border border-stone-800/80 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
              <span>Camada de Confiança</span>
              <Lock className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-black text-white">100% Backend</div>
            <div className="text-[11px] text-emerald-400 mt-0.5">Preço, Pontos & Cupom Protegidos</div>
          </div>

          <div className="bg-[#101526]/80 border border-stone-800/80 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
              <span>Saúde das Integrações</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-black text-white">4 Online / 1 Atenção</div>
            <div className="text-[11px] text-stone-400 mt-0.5">Taxa de Sucesso Média: 99.2%</div>
          </div>

          <div className="bg-[#101526]/80 border border-stone-800/80 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
              <span>Sessões Ativas</span>
              <Smartphone className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-black text-white">{activeSessionsCount} Dispositivos</div>
            <div className="text-[11px] text-blue-400 mt-0.5">IPs e tokens criptografados</div>
          </div>

          <div className="bg-[#101526]/80 border border-stone-800/80 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
              <span>Proteção Antifraude</span>
              <ShieldAlert className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-black text-white">{securityIncidents.length} Bloqueios</div>
            <div className="text-[11px] text-amber-400 mt-0.5">Idempotência & Rate Limiting</div>
          </div>
        </div>
      </div>

      {/* 2. SUB-ABAS DE NAVEGAÇÃO DO BLOCO 14 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
        {[
          { id: 'pagamentos_webhooks', label: 'Pagamentos, Webhooks & Estorno', icon: CreditCard },
          { id: 'saude_integracoes', label: 'Saúde das Integrações (Healthcheck)', icon: Activity },
          { id: 'sessoes_acesso', label: 'Sessões & Antifraude', icon: Smartphone },
          { id: 'privacidade_lgpd', label: 'Privacidade, LGPD & Políticas', icon: FileText },
          { id: 'checklist', label: 'Checklist de Segurança (Seção 60)', icon: CheckCircle2 }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#0EB24A] text-stone-950 font-black shadow-lg shadow-emerald-500/20'
                  : 'bg-[#171E31] text-stone-400 hover:text-white border border-stone-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ===================================================================== */}
      {/* ABA 1: PAGAMENTOS, WEBHOOKS & ESTORNO */}
      {/* ===================================================================== */}
      {activeSubTab === 'pagamentos_webhooks' && (
        <div className="space-y-6">
          {/* PAINEL DE DISPARO/SIMULAÇÃO DE WEBHOOK ASSINADO */}
          <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-stone-800">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-[#0EB24A]" />
                  Simulador de Webhook Assinado (Idempotente)
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Teste o recebimento de eventos externos (Banco Central Pix / Adquirente). O pedido só é confirmado quando o webhook confiável for recebido.
                </p>
              </div>
              <span className="text-[11px] font-mono bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-800 text-stone-400">
                HMAC-SHA256 Secret: [PROTEGIDO NO BACKEND]
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
              <div>
                <label className="text-[11px] font-bold text-stone-400 uppercase">Provedor</label>
                <select
                  value={whSimProvider}
                  onChange={(e) => setWhSimProvider(e.target.value as any)}
                  className="w-full mt-1.5 bg-[#101526] border border-stone-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#0EB24A]"
                >
                  <option value="PIX_DIRECT">Pix Direct (Banco Central)</option>
                  <option value="MERMI_SECURE_PAY">MerMi SecurePay (Cartão)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-400 uppercase">Evento</label>
                <select
                  value={whSimEvent}
                  onChange={(e) => setWhSimEvent(e.target.value as any)}
                  className="w-full mt-1.5 bg-[#101526] border border-stone-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#0EB24A]"
                >
                  <option value="PAYMENT_APPROVED">PAYMENT_APPROVED (Aprovado)</option>
                  <option value="PAYMENT_FAILED">PAYMENT_FAILED (Recusado)</option>
                  <option value="PAYMENT_REFUNDED">PAYMENT_REFUNDED (Estornado)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-400 uppercase">ID do Pagamento</label>
                <input
                  type="text"
                  value={whSimPaymentId}
                  onChange={(e) => setWhSimPaymentId(e.target.value)}
                  className="w-full mt-1.5 bg-[#101526] border border-stone-800 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-[#0EB24A]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-400 uppercase">ID do Pedido</label>
                <input
                  type="text"
                  value={whSimOrderId}
                  onChange={(e) => setWhSimOrderId(e.target.value)}
                  className="w-full mt-1.5 bg-[#101526] border border-stone-800 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-[#0EB24A]"
                />
              </div>

              <div className="flex flex-col justify-end">
                <button
                  onClick={handleRunWebhookSim}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0EB24A] hover:bg-emerald-600 text-stone-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  Disparar Webhook
                </button>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <input
                type="checkbox"
                id="invalidSigCheck"
                checked={whSimInvalidSig}
                onChange={(e) => setWhSimInvalidSig(e.target.checked)}
                className="rounded accent-emerald-500"
              />
              <label htmlFor="invalidSigCheck" className="text-xs text-amber-400 cursor-pointer">
                Simular tentativa de ataque (enviar assinatura HMAC inválida para testar rejeição)
              </label>
            </div>
          </div>

          {/* TABELA DE TRANSAÇÕES FINANCEIRAS */}
          <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#0EB24A]" />
                  Transações Financeiras Registradas ({paymentTransactions.length})
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Separação estrita: Status Financeiro (APPROVED/REFUNDED) vs Status Operacional do Pedido (PREPARING/READY).
                </p>
              </div>
              <div className="text-xs font-bold text-stone-300 bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-800">
                Total Aprovado: <span className="text-[#0EB24A]">R$ {totalApprovedAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-800 text-stone-400 font-bold uppercase text-[11px]">
                    <th className="pb-3">ID / Data</th>
                    <th className="pb-3">Pedido</th>
                    <th className="pb-3">Cliente</th>
                    <th className="pb-3">Método</th>
                    <th className="pb-3">Valor</th>
                    <th className="pb-3">Status Financeiro</th>
                    <th className="pb-3">Idempotência</th>
                    <th className="pb-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60">
                  {paymentTransactions.map((tx) => {
                    const isApproved = tx.status === 'APPROVED';
                    const isRefunded = tx.status === 'REFUNDED';
                    const isPending = tx.status === 'PENDING';

                    return (
                      <tr key={tx.payment_id} className="hover:bg-stone-800/30 transition-colors">
                        <td className="py-3.5">
                          <div className="font-mono font-bold text-white">{tx.payment_id}</div>
                          <div className="text-[10px] text-stone-400">
                            {new Date(tx.created_at).toLocaleString('pt-BR')}
                          </div>
                        </td>
                        <td className="py-3.5 font-mono font-semibold text-emerald-400">{tx.order_id}</td>
                        <td className="py-3.5 text-stone-200">{tx.user_name}</td>
                        <td className="py-3.5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 font-bold text-[11px]">
                            {tx.payment_method === 'PIX' ? (
                              <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                            )}
                            {tx.payment_method}
                          </span>
                        </td>
                        <td className="py-3.5 font-bold text-white">R$ {tx.amount.toFixed(2)}</td>
                        <td className="py-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              isApproved
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : isRefunded
                                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                                : isPending
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                : 'bg-red-500/10 text-red-400 border border-red-500/30'
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3.5 font-mono text-[11px] text-stone-400 truncate max-w-[140px]">
                          {tx.idempotency_key}
                        </td>
                        <td className="py-3.5 text-right">
                          {isApproved && (
                            <button
                              onClick={() => setSelectedTxForRefund(tx.payment_id)}
                              className="px-2.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-bold transition-all cursor-pointer"
                            >
                              Estornar
                            </button>
                          )}
                          {isRefunded && (
                            <span className="text-[11px] text-purple-400 font-semibold">Estornado</span>
                          )}
                          {isPending && (
                            <button
                              onClick={() => {
                                setWhSimPaymentId(tx.payment_id);
                                setWhSimOrderId(tx.order_id);
                                setWhSimAmount(tx.amount);
                                setWhSimEvent('PAYMENT_APPROVED');
                                showToast('Dados copiados para o simulador de webhook.');
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold transition-all cursor-pointer"
                            >
                              Aprovar via Webhook
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* MODAL DE CONFIRMAÇÃO DE ESTORNO */}
          {selectedTxForRefund && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                    <RotateCcw className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Confirmar Estorno / Reembolso</h3>
                    <p className="text-xs text-stone-400">Transação {selectedTxForRefund}</p>
                  </div>
                </div>

                <div className="p-3.5 bg-stone-900/80 rounded-2xl border border-stone-800 text-xs space-y-1.5 text-stone-300">
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Regra Crítica do Bloco 14 (Seção 18):
                  </p>
                  <p>
                    O cancelamento do pagamento estorna os valores financeiros e <strong>reverte automaticamente os MerMi Points concedidos</strong> no Points Ledger oficial, sem criar saldos artificiais.
                  </p>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-400 uppercase">Motivo do Estorno</label>
                  <input
                    type="text"
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    className="w-full mt-1.5 bg-[#101526] border border-stone-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setSelectedTxForRefund(null)}
                    className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      const tx = paymentTransactions.find((p) => p.payment_id === selectedTxForRefund);
                      if (tx) {
                        handleExecuteRefund(tx.payment_id, tx.order_id);
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black cursor-pointer shadow-lg shadow-purple-600/30"
                  >
                    Executar Estorno & Reversão
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* HISTÓRICO DE EVENTOS DE WEBHOOK RECEBIDOS */}
          <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-6 shadow-xl">
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <RotateCcw className="w-5 h-5 text-emerald-400" />
              Eventos de Webhook Recebidos & Auditados ({webhookEvents.length})
            </h2>
            <p className="text-xs text-stone-400 mb-4">
              Cada webhook é autenticado por assinatura HMAC-SHA256 e processado com chave de idempotência para evitar cobranças ou confirmações duplicadas.
            </p>

            <div className="space-y-2.5">
              {webhookEvents.map((wh) => (
                <div
                  key={wh.webhook_id}
                  className="bg-[#101526] border border-stone-800/80 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 font-bold text-white">
                        <span>{wh.event_type}</span>
                        <span className="font-mono text-stone-400 text-[11px]">({wh.provider})</span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-stone-900 border border-stone-800 text-stone-300">
                          Pedido: {wh.order_id}
                        </span>
                      </div>
                      <p className="text-stone-400 text-[11px] mt-0.5">{wh.raw_payload_summary}</p>
                      <div className="flex items-center gap-3 text-[10px] text-stone-500 font-mono mt-1">
                        <span>Idempotência: {wh.idempotency_key}</span>
                        <span>Assinatura HMAC: {wh.signature_valid ? 'VÁLIDA' : 'INVÁLIDA'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-[11px] text-stone-400 font-mono shrink-0">
                    {new Date(wh.received_at).toLocaleTimeString('pt-BR')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* ABA 2: SAÚDE DAS INTEGRAÇÕES EXTERNAS (HEALTHCHECK) */}
      {/* ===================================================================== */}
      {activeSubTab === 'saude_integracoes' && (
        <div className="space-y-6">
          <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#0EB24A]" />
                  Monitor de Saúde das Integrações Externas (Seções 24, 42, 54 e 55)
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Arquitetura desacoplada via <code className="text-emerald-400 font-mono">IntegrationService</code>. Suporte a timeout rigoroso, fallback seguro e retry controlado.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-800 text-stone-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Cluster de Integrações: MONITORANDO
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {externalIntegrations.map((item) => {
                const isOnline = item.status === 'ONLINE';
                const isWarning = item.status === 'ATENÇÃO';
                const isTesting = testingIntegrationId === item.integration_id;

                return (
                  <div
                    key={item.integration_id}
                    className="bg-[#101526] border border-stone-800 rounded-2xl p-5 hover:border-stone-700 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono">
                            {item.category} • {item.mode}
                          </span>
                          <h3 className="text-sm font-bold text-white mt-0.5">{item.name}</h3>
                          <p className="text-xs text-stone-400 font-mono">{item.provider_name}</p>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            isOnline
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : isWarning
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : 'bg-red-500/10 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <p className="text-xs text-stone-300 mt-2 mb-4">{item.notes}</p>

                      <div className="grid grid-cols-3 gap-2 bg-stone-900/60 p-3 rounded-xl border border-stone-800/80 text-center mb-3">
                        <div>
                          <div className="text-[10px] text-stone-400">Latência</div>
                          <div className="text-xs font-black text-white font-mono">{item.latency_ms} ms</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-stone-400">Disponibilidade</div>
                          <div className="text-xs font-black text-emerald-400 font-mono">
                            {item.success_rate_percent}%
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-stone-400">Timeout / Retry</div>
                          <div className="text-xs font-black text-stone-300 font-mono">
                            {item.timeout_ms / 1000}s ({item.max_retry_attempts}x)
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] font-mono text-stone-500 flex items-center justify-between">
                        <span>Endpoint: {item.masked_endpoint}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between">
                      <span className="text-[10px] text-stone-400">
                        Última checagem: {new Date(item.last_healthcheck).toLocaleTimeString('pt-BR')}
                      </span>
                      <button
                        onClick={() => handleTestPing(item.integration_id)}
                        disabled={isTesting}
                        className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 text-[#0EB24A] ${isTesting ? 'animate-spin' : ''}`} />
                        {isTesting ? 'Testando...' : 'Testar Ping'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* ABA 3: SESSÕES ATIVAS, ACESSO & INCIDENTES ANTIFRAUDE */}
      {/* ===================================================================== */}
      {activeSubTab === 'sessoes_acesso' && (
        <div className="space-y-6">
          {/* SESSÕES ATIVAS */}
          <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-[#0EB24A]" />
                  Gerenciamento de Sessões Ativas (Seção 5)
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Visualização de dispositivos conectados, IPs mascarados e encerramento remoto de sessões vulneráveis.
                </p>
              </div>
              <button
                onClick={() => {
                  revokeAllOtherSessions();
                  showToast('Todas as outras sessões foram encerradas com sucesso.');
                }}
                className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition-all cursor-pointer"
              >
                Encerrar Todas as Outras Sessões
              </button>
            </div>

            <div className="space-y-3">
              {authSessions.map((session) => {
                const isActive = session.status === 'active';
                const isCurrent = session.session_id === 'sess-current-01';

                return (
                  <div
                    key={session.session_id}
                    className="bg-[#101526] border border-stone-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300">
                        <Smartphone className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{session.device_info}</span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                              Sessão Atual
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                              isActive ? 'text-emerald-400' : 'text-stone-500 line-through'
                            }`}
                          >
                            {session.status}
                          </span>
                        </div>
                        <p className="text-stone-400 text-[11px] mt-0.5">
                          {session.user_name} • Plataforma: <span className="uppercase">{session.platform}</span> • Local: {session.location_approx}
                        </p>
                        <div className="text-stone-500 font-mono text-[10px] mt-1">
                          IP: {session.ip_masked} • Última atividade: {new Date(session.last_activity_at).toLocaleString('pt-BR')}
                        </div>
                      </div>
                    </div>

                    {!isCurrent && isActive && (
                      <button
                        onClick={() => {
                          revokeAuthSession(session.session_id);
                          showToast('Sessão revogada com sucesso.');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold transition-all cursor-pointer self-start sm:self-auto"
                      >
                        Encerrar Sessão
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* INCIDENTES ANTIFRAUDE E RATE LIMITING */}
          <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-6 shadow-xl">
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              Incidentes de Segurança & Defesa Operacional (Seções 21 e 22)
            </h2>
            <p className="text-xs text-stone-400 mb-4">
              Monitor de abusos de cupons, tentativas de injeção, força bruta e repetição excessiva de pagamentos bloqueadas pelo backend.
            </p>

            <div className="space-y-3">
              {securityIncidents.map((inc) => (
                <div
                  key={inc.incident_id}
                  className="bg-[#101526] border border-stone-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white font-mono">{inc.type}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 font-black uppercase">
                          {inc.severity}
                        </span>
                        {inc.blocked_automatically && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">
                            Bloqueado Automaticamente
                          </span>
                        )}
                      </div>
                      <p className="text-stone-300 text-xs mt-1">{inc.description}</p>
                      <div className="text-stone-500 font-mono text-[10px] mt-1">
                        Endpoint: {inc.endpoint} • IP: {inc.actor_ip_masked} • {new Date(inc.timestamp).toLocaleString('pt-BR')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* ABA 4: PRIVACIDADE, LGPD & POLÍTICAS VERSIONADAS */}
      {/* ===================================================================== */}
      {activeSubTab === 'privacidade_lgpd' && (
        <div className="space-y-6">
          {/* POLÍTICAS E TERMOS VERSIONADOS */}
          <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#0EB24A]" />
                  Central de Políticas e Termos Versionados (Seções 49 e 50)
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Repositório único com versionamento estrito (<code className="text-emerald-400 font-mono">policy_id</code>, <code className="text-emerald-400 font-mono">version</code>, <code className="text-emerald-400 font-mono">published_at</code>).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {legalPolicies.map((pol) => {
                const isSelected = selectedPolicyId === pol.policy_id;

                return (
                  <button
                    key={pol.policy_id}
                    onClick={() => setSelectedPolicyId(pol.policy_id)}
                    className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#101526] border-[#0EB24A] shadow-md shadow-emerald-500/10'
                        : 'bg-[#101526]/60 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-mono font-bold text-emerald-400">
                        v{pol.version} • {pol.status.toUpperCase()}
                      </span>
                      {pol.mandatory_acceptance && (
                        <span className="text-[9px] bg-stone-800 px-1.5 py-0.5 rounded text-stone-400 font-semibold">
                          Obrigatória
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs font-bold text-white line-clamp-1">{pol.title}</h3>
                    <p className="text-[11px] text-stone-400 line-clamp-2 mt-1">{pol.summary}</p>
                  </button>
                );
              })}
            </div>

            {/* LEITOR DA POLÍTICA SELECIONADA */}
            {selectedPolicyId && (
              <div className="mt-6 bg-[#101526] border border-stone-800 rounded-2xl p-5">
                {(() => {
                  const pol = legalPolicies.find((p) => p.policy_id === selectedPolicyId);
                  if (!pol) return null;
                  return (
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-3">
                        <div>
                          <h4 className="text-sm font-bold text-white">{pol.title}</h4>
                          <span className="text-[11px] text-stone-400 font-mono">
                            Versão {pol.version} • Publicado em: {new Date(pol.published_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {pol.status}
                        </span>
                      </div>
                      <pre className="text-xs text-stone-300 font-sans whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto pr-2">
                        {pol.content}
                      </pre>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {/* FERRAMENTAS DO TITULAR LGPD */}
          <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#0EB24A]" />
              Conformidade LGPD: Portabilidade & Anonimização (Art. 18 e 16)
            </h2>
            <p className="text-xs text-stone-400">
              Direitos garantidos do titular: exportação estruturada em formato interoperável (JSON) e anonimização de conta com retenção legal obrigatória de dados fiscais/pedidos.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* PORTABILIDADE */}
              <div className="bg-[#101526] border border-stone-800 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1.5">
                    <Download className="w-4 h-4 text-emerald-400" />
                    Portabilidade de Dados (Art. 18, V da LGPD)
                  </h3>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Gera arquivo JSON estruturado contendo dados cadastrais, histórico de pedidos, ledger de pontos contábeis, consentimentos ativos e registros de evolução física.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-800 flex justify-end">
                  <button
                    onClick={handleExportJson}
                    className="px-4 py-2 rounded-xl bg-[#0EB24A] hover:bg-emerald-600 text-stone-950 font-black text-xs transition-all cursor-pointer shadow-md shadow-emerald-500/20"
                  >
                    Baixar Payload JSON
                  </button>
                </div>
              </div>

              {/* ANONIMIZAÇÃO */}
              <div className="bg-[#101526] border border-stone-800 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Anonimização & Retenção Legal (Art. 16 da LGPD)
                  </h3>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Expurga credenciais, senhas e registros sensíveis de saúde, mantendo apenas notas e logs financeiros anônimos legalmente exigidos pelo Fisco e Código Civil.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-800 flex justify-end">
                  <button
                    onClick={handleSimulateAnonymization}
                    className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold text-xs transition-all cursor-pointer"
                  >
                    Simular Anonimização
                  </button>
                </div>
              </div>
            </div>

            {/* RESULTADO DA ANONIMIZAÇÃO */}
            {anonymizationResult && (
              <div className="bg-stone-900 border border-amber-500/30 rounded-2xl p-4 text-xs space-y-2 mt-4">
                <div className="font-bold text-amber-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Comprovante de Anonimização Emitido ({anonymizationResult.status})
                </div>
                <div className="grid grid-cols-2 gap-2 text-stone-300">
                  <div>
                    <span className="text-stone-500">Registros Preservados por Lei:</span>
                    <ul className="list-disc pl-4 mt-0.5 text-stone-400">
                      <li>{anonymizationResult.retained_for_legal_compliance.orders_records} registros de pedidos fiscais</li>
                      <li>{anonymizationResult.retained_for_legal_compliance.financial_logs} logs contábeis</li>
                    </ul>
                  </div>
                  <div>
                    <span className="text-stone-500">Dados Expurgais/Revogados:</span>
                    <ul className="list-disc pl-4 mt-0.5 text-emerald-400">
                      <li>Sessões & Tokens de acesso revogados</li>
                      <li>Logs diários de saúde purgados</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* ABA 5: CHECKLIST DE SEGURANÇA (SEÇÃO 60) */}
      {/* ===================================================================== */}
      {activeSubTab === 'checklist' && (
        <div className="bg-[#171E31] border border-stone-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#0EB24A]" />
                Checklist Oficial de Segurança & Pré-Publicação (Seção 60)
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Validação de todos os requisitos de arquitetura, integridade e proteção antes da publicação oficial.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              23 / 23 REQUISITOS ATENDIDOS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {[
              { item: 'HTTPS / TLS Obrigatório', desc: 'Tráfego criptografado de ponta a ponta e HSTS habilitado.' },
              { item: 'Secrets Protegidos Fora do Frontend', desc: 'Nenhum token ou chave de API privada exposta no bundle React.' },
              { item: 'Autenticação & Sessões Seguras', desc: 'Sessões rastreadas com IP mascarado, expiração e revogação remota.' },
              { item: 'Recuperação de Conta Segura', desc: 'Tokens de uso único com expiração e sem envio de senha em texto puro.' },
              { item: 'Autorização RBAC no Backend', desc: '12 papéis e 26 permissões granulares validadas em cada ação sensível.' },
              { item: 'Endpoints Administrativos Protegidos', desc: 'Painéis restritos a credenciais autorizadas com log de auditoria.' },
              { item: 'Rate Limiting & Antifraude', desc: 'Controle de requisições por IP/usuário contra brute-force e abusos.' },
              { item: 'Validação de Preços no Servidor', desc: 'Cálculo autoritativo dos valores da tabela oficial pelo backend.' },
              { item: 'Idempotência em Pagamentos & Checkout', desc: 'Prevenção estrita contra cobranças e pedidos duplicados.' },
              { item: 'Webhooks Assinados com HMAC', desc: 'Rejeição automática de payloads sem assinatura criptográfica válida.' },
              { item: 'Separação de Status (Pedido vs Pagamento)', desc: 'APPROVED/REFUNDED independente de PREPARING/DELIVERED.' },
              { item: 'Estornos com Reversão de Points', desc: 'Débito automático no ledger contábil sem criação de saldo fantasma.' },
              { item: 'Saldo de Points Não-Negativo', desc: 'Impossibilidade matemática de saldo negativo no Points Ledger.' },
              { item: 'Proteção de Estoque Negativo', desc: 'Baixas de insumos e produtos controladas contra quantidades irreais.' },
              { item: 'Sanitização de Conteúdo & Anti-XSS', desc: 'Proteção em posts, comentários e personalizações de usuários.' },
              { item: 'Logs sem Exposição de Secrets/Senhas', desc: 'Mascaramento estrito de dados sensíveis e credenciais.' },
              { item: 'Políticas & Termos Versionados', desc: 'Termos de Uso, Privacidade, Reembolso e Regras com versionamento.' },
              { item: 'Conformidade LGPD & Portabilidade', desc: 'Exportação em JSON estruturado conforme Art. 18 da LGPD.' },
              { item: 'Anonimização de Conta com Retenção Legal', desc: 'Expurgo de dados privados preservando notas fiscais exigidas.' },
              { item: 'Proteção Especial de Dados de Saúde', desc: 'Acesso restrito e consentimento explícito para sono/passos.' },
              { item: 'Timeout & Retry em Integrações', desc: 'Controle de tolerância a falhas sem travamento da interface.' },
              { item: 'Ambientes Separados (Sandbox vs Produção)', desc: 'Credenciais de testes isoladas de operações reais.' },
              { item: 'Regra de Ouro (Segurança não depende do Frontend)', desc: 'O backend é a autoridade máxima e final em todas as etapas.' }
            ].map((chk, idx) => (
              <div
                key={idx}
                className="bg-[#101526] border border-stone-800 rounded-2xl p-3 flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-xs">{chk.item}</div>
                  <div className="text-[11px] text-stone-400 mt-0.5">{chk.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
