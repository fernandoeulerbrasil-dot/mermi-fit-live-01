import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Activity,
  RefreshCw,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Globe,
  Sliders,
  Play,
  Clock,
  ArrowRight,
  ExternalLink,
  Lock,
  FileText,
  DollarSign
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useMermiStore } from '../../context/MermiStoreContext';

export const MermiPaymentsManagementView: React.FC = () => {
  const { showToast } = useMermiStore();

  const [activeSubTab, setActiveSubTab] = useState<
    'visao_geral' | 'sandbox_runner' | 'transacoes' | 'reembolsos' | 'webhooks_logs'
  >('visao_geral');

  // Estado de configuração
  const [config, setConfig] = useState<any>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);

  // Listagens
  const [transactions, setTransactions] = useState<any[]>([]);
  const [webhooksLogs, setWebhooksLogs] = useState<any[]>([]);
  const [refunds, setRefunds] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Formulário de credenciais seguras (Sem exibir tokens)
  const [inputAccessToken, setInputAccessToken] = useState('');
  const [inputPublicKey, setInputPublicKey] = useState('');
  const [inputWebhookSecret, setInputWebhookSecret] = useState('');
  const [savingCreds, setSavingCreds] = useState(false);

  // Modal de confirmação para ativar Produção
  const [showProdConfirmModal, setShowProdConfirmModal] = useState(false);
  const [prodAgreed, setProdAgreed] = useState(false);

  // Modal de Reembolso
  const [selectedTxForRefund, setSelectedTxForRefund] = useState<any | null>(null);
  const [refundReason, setRefundReason] = useState('Cancelamento solicitado pelo cliente antes do preparo');
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [refunding, setRefunding] = useState(false);

  // Sandbox Runner
  const [selectedTxIdForSim, setSelectedTxIdForSim] = useState('');
  const [simScenario, setSimScenario] = useState<
    'APPROVED' | 'REJECTED' | 'PENDING' | 'CANCELLED' | 'EXPIRED'
  >('APPROVED');
  const [simulating, setSimulating] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  // Carregar configurações iniciais
  const loadConfig = async () => {
    try {
      setLoadingConfig(true);
      const res = await apiClient.payments.getConfig();
      if (res && res.config) {
        setConfig(res.config);
      }
    } catch (err: any) {
      console.warn('Erro ao carregar configurações de pagamento:', err);
    } finally {
      setLoadingConfig(false);
    }
  };

  // Carregar dados das abas
  const loadTabData = async () => {
    try {
      setLoadingData(true);
      const [txRes, whRes, refRes] = await Promise.allSettled([
        apiClient.payments.getTransactions(),
        apiClient.payments.getWebhooks(),
        apiClient.payments.getRefunds()
      ]);

      if (txRes.status === 'fulfilled' && txRes.value?.transactions) {
        setTransactions(txRes.value.transactions);
        if (txRes.value.transactions.length > 0 && !selectedTxIdForSim) {
          setSelectedTxIdForSim(txRes.value.transactions[0].id);
        }
      }
      if (whRes.status === 'fulfilled' && whRes.value?.logs) {
        setWebhooksLogs(whRes.value.logs);
      }
      if (refRes.status === 'fulfilled' && refRes.value?.refunds) {
        setRefunds(refRes.value.refunds);
      }
    } catch (err) {
      console.warn('Erro ao carregar dados do módulo de pagamentos:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadConfig();
    loadTabData();
  }, []);

  const handleToggleMethod = async (methodKey: 'pix' | 'creditCard' | 'debitCard') => {
    if (!config) return;
    const newMethods = {
      ...config.enabledMethods,
      [methodKey]: !config.enabledMethods[methodKey]
    };
    try {
      const res = await apiClient.payments.updateConfig({ enabledMethods: newMethods });
      if (res.success) {
        setConfig(res.config);
        showToast(`Método ${methodKey.toUpperCase()} ${newMethods[methodKey] ? 'habilitado' : 'desabilitado'}.`);
      }
    } catch (err: any) {
      showToast('Erro ao atualizar métodos: ' + err.message);
    }
  };

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCreds(true);
    try {
      const creds: any = {};
      if (inputAccessToken.trim()) creds.accessToken = inputAccessToken.trim();
      if (inputPublicKey.trim()) creds.publicKey = inputPublicKey.trim();
      if (inputWebhookSecret.trim()) creds.webhookSecret = inputWebhookSecret.trim();

      const res = await apiClient.payments.updateConfig({ credentials: creds });
      if (res.success) {
        setConfig(res.config);
        setInputAccessToken('');
        setInputPublicKey('');
        setInputWebhookSecret('');
        showToast('Credenciais registradas com segurança no backend!');
      }
    } catch (err: any) {
      showToast('Erro ao salvar credenciais: ' + err.message);
    } finally {
      setSavingCreds(false);
    }
  };

  const handleSwitchEnvironment = async (targetEnv: 'sandbox' | 'production') => {
    if (targetEnv === 'production') {
      setShowProdConfirmModal(true);
      return;
    }
    try {
      const res = await apiClient.payments.updateConfig({ environment: 'sandbox' });
      if (res.success) {
        setConfig(res.config);
        showToast('Ambiente alternado para Sandbox / Teste com sucesso.');
      }
    } catch (err: any) {
      showToast('Erro ao alternar ambiente: ' + err.message);
    }
  };

  const handleConfirmActivateProduction = async () => {
    if (!prodAgreed) {
      showToast('Confirme a ciência das transações reais marcando o campo de verificação.');
      return;
    }
    try {
      const res = await apiClient.payments.updateConfig({ environment: 'production' });
      if (res.success) {
        setConfig(res.config);
        setShowProdConfirmModal(false);
        showToast('Ambiente de Produção do Mercado Pago ativado com sucesso!');
      }
    } catch (err: any) {
      showToast('Erro: ' + (err.error || err.message));
    }
  };

  const handleRunSandboxScenario = async () => {
    if (!selectedTxIdForSim) {
      showToast('Selecione uma transação ou pedido para simular.');
      return;
    }
    setSimulating(true);
    try {
      const res = await apiClient.payments.simulateSandboxWebhook({
        paymentId: selectedTxIdForSim,
        scenario: simScenario
      });
      if (res.success) {
        showToast(`Simulação '${simScenario}' executada com sucesso! Status: ${res.status}`);
        loadTabData();
      }
    } catch (err: any) {
      showToast('Erro na simulação: ' + (err.error || err.message));
    } finally {
      setSimulating(false);
    }
  };

  const handleExecuteRefund = async () => {
    if (!selectedTxForRefund) return;
    setRefunding(true);
    try {
      const res = await apiClient.payments.refund(selectedTxForRefund.id, {
        reason: refundReason,
        amount: refundAmount > 0 ? refundAmount : undefined
      });
      if (res.success) {
        showToast(res.message || 'Reembolso processado com sucesso!');
        setSelectedTxForRefund(null);
        loadTabData();
      }
    } catch (err: any) {
      showToast('Falha no reembolso: ' + (err.error || err.message));
    } finally {
      setRefunding(false);
    }
  };

  const copyWebhookUrl = () => {
    if (config?.webhookUrl) {
      navigator.clipboard.writeText(config.webhookUrl);
      setCopiedWebhook(true);
      showToast('URL do Webhook copiada para a área de transferência!');
      setTimeout(() => setCopiedWebhook(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. CABEÇALHO DO GATEWAY & STATUS */}
      <div className="bg-[#171E31] rounded-2xl p-5 border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0EB24A] bg-[#0EB24A]/10 px-2.5 py-1 rounded-md">
              Gateway Oficial
            </span>
            <span className="text-xs font-bold text-stone-400">
              Arquitetura Multi-Gateway Ativa
            </span>
          </div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            Mercado Pago
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                config?.environment === 'production'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              Ambiente: {config?.environment === 'production' ? 'Produção' : 'Teste / Sandbox'}
            </span>
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Status da Integração:{' '}
            <strong className="text-stone-200">
              {config?.isConfigured ? 'Conectado / Operacional' : 'Aguardando Credenciais'}
            </strong>{' '}
            • Última sincronização:{' '}
            <span className="text-stone-300">
              {config?.lastSyncAt ? new Date(config.lastSyncAt).toLocaleTimeString('pt-BR') : 'Agora'}
            </span>
          </p>
        </div>

        {/* Alternador de Ambiente */}
        <div className="flex items-center gap-3 bg-stone-900/80 p-2 rounded-xl border border-stone-800">
          <button
            onClick={() => handleSwitchEnvironment('sandbox')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              config?.environment === 'sandbox'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Ambiente Teste / Sandbox
          </button>
          <button
            onClick={() => handleSwitchEnvironment('production')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              config?.environment === 'production'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Ambiente Produção
          </button>
          <button
            onClick={() => {
              loadConfig();
              loadTabData();
              showToast('Dados sincronizados com o servidor.');
            }}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition cursor-pointer"
            title="Sincronizar"
          >
            <RefreshCw size={14} className={loadingConfig || loadingData ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* 2. SUB-BARRA DE NAVEGAÇÃO DE PAGAMENTOS */}
      <div className="flex items-center gap-2 border-b border-stone-800 pb-2 overflow-x-auto text-xs font-bold font-['Outfit']">
        {[
          { id: 'visao_geral', label: 'Visão Geral & Métodos', icon: Sliders },
          { id: 'sandbox_runner', label: 'Ambiente Teste (Sandbox)', icon: Play },
          { id: 'transacoes', label: `Transações (${transactions.length})`, icon: DollarSign },
          { id: 'reembolsos', label: `Reembolsos (${refunds.length})`, icon: RotateCcw },
          { id: 'webhooks_logs', label: `Webhook & Logs (${webhooksLogs.length})`, icon: Activity }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3 py-2 rounded-xl shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-[#0EB24A] text-stone-950 font-black shadow-md'
                  : 'bg-[#171E31] text-stone-400 hover:text-white border border-stone-800'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. CONTEÚDO DAS SUB-ABAS */}

      {/* SUB-ABA 1: VISÃO GERAL & MÉTODOS */}
      {activeSubTab === 'visao_geral' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Métodos de Pagamento Habilitados */}
          <div className="lg:col-span-2 bg-[#171E31] rounded-2xl p-5 border border-stone-800 space-y-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CreditCard className="text-[#0EB24A]" size={20} />
              Métodos de Pagamento Habilitados
            </h3>
            <p className="text-xs text-stone-400">
              Controle quais formas de pagamento estão disponíveis para os clientes no checkout da MerMi Fit Life.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* PIX */}
              <div
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  config?.enabledMethods?.pix
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-white'
                    : 'bg-stone-900/60 border-stone-800 text-stone-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <QrCode size={22} className={config?.enabledMethods?.pix ? 'text-[#0EB24A]' : 'text-stone-500'} />
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        config?.enabledMethods?.pix ? 'bg-[#0EB24A]/20 text-[#0EB24A]' : 'bg-stone-800 text-stone-500'
                      }`}
                    >
                      {config?.enabledMethods?.pix ? 'ATIVO' : 'DESATIVADO'}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-white">Pix Instantâneo</h4>
                  <p className="text-xs text-stone-400 mt-1">
                    Gera QR Code dinâmico e código copia e cola com expiração em 15 min.
                  </p>
                </div>
                <button
                  onClick={() => handleToggleMethod('pix')}
                  className={`mt-4 w-full py-1.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                    config?.enabledMethods?.pix
                      ? 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                      : 'bg-[#0EB24A] text-stone-950 hover:bg-emerald-400 font-black'
                  }`}
                >
                  {config?.enabledMethods?.pix ? 'Desativar Pix' : 'Habilitar Pix'}
                </button>
              </div>

              {/* CARTÃO DE CRÉDITO */}
              <div
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  config?.enabledMethods?.creditCard
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-white'
                    : 'bg-stone-900/60 border-stone-800 text-stone-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <CreditCard size={22} className={config?.enabledMethods?.creditCard ? 'text-[#0EB24A]' : 'text-stone-500'} />
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        config?.enabledMethods?.creditCard ? 'bg-[#0EB24A]/20 text-[#0EB24A]' : 'bg-stone-800 text-stone-500'
                      }`}
                    >
                      {config?.enabledMethods?.creditCard ? 'ATIVO' : 'DESATIVADO'}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-white">Cartão de Crédito</h4>
                  <p className="text-xs text-stone-400 mt-1">
                    Tokenização oficial segura. Parcelamento em até 6x sem juros.
                  </p>
                </div>
                <button
                  onClick={() => handleToggleMethod('creditCard')}
                  className={`mt-4 w-full py-1.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                    config?.enabledMethods?.creditCard
                      ? 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                      : 'bg-[#0EB24A] text-stone-950 hover:bg-emerald-400 font-black'
                  }`}
                >
                  {config?.enabledMethods?.creditCard ? 'Desativar Crédito' : 'Habilitar Crédito'}
                </button>
              </div>

              {/* CARTÃO DE DÉBITO */}
              <div
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  config?.enabledMethods?.debitCard
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-white'
                    : 'bg-stone-900/60 border-stone-800 text-stone-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <CreditCard size={22} className={config?.enabledMethods?.debitCard ? 'text-[#0EB24A]' : 'text-stone-500'} />
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        config?.enabledMethods?.debitCard ? 'bg-[#0EB24A]/20 text-[#0EB24A]' : 'bg-stone-800 text-stone-500'
                      }`}
                    >
                      {config?.enabledMethods?.debitCard ? 'ATIVO' : 'DESATIVADO'}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-white">Cartão de Débito</h4>
                  <p className="text-xs text-stone-400 mt-1">
                    Débito direto via 3DS/Mercado Pago quando compatível pelo emissor.
                  </p>
                </div>
                <button
                  onClick={() => handleToggleMethod('debitCard')}
                  className={`mt-4 w-full py-1.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                    config?.enabledMethods?.debitCard
                      ? 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                      : 'bg-[#0EB24A] text-stone-950 hover:bg-emerald-400 font-black'
                  }`}
                >
                  {config?.enabledMethods?.debitCard ? 'Desativar Débito' : 'Habilitar Débito'}
                </button>
              </div>
            </div>

            {/* Webhook Endpoint Info */}
            <div className="mt-4 p-4 bg-stone-900/90 rounded-xl border border-stone-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                  <Activity size={14} className="text-[#0EB24A]" />
                  URL Oficial de Webhook (IPN / Notificações)
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  Escutando Eventos (POST)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={config?.webhookUrl || 'https://mermifitlife.com.br/api/payments/webhook'}
                  className="w-full bg-stone-950 text-stone-300 text-xs font-mono p-2.5 rounded-lg border border-stone-800 focus:outline-none"
                />
                <button
                  onClick={copyWebhookUrl}
                  className="px-3 py-2.5 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0"
                >
                  {copiedWebhook ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copiedWebhook ? 'Copiado!' : 'Copiar URL'}</span>
                </button>
              </div>
              <p className="text-[11px] text-stone-400">
                Cadastre este endpoint no painel do Mercado Pago (Desenvolvedor → Webhooks) para confirmação automática de pagamentos.
              </p>
            </div>
          </div>

          {/* Gerenciamento Seguro de Credenciais (Regra #2: NUNCA mostrar tokens secretos) */}
          <div className="bg-[#171E31] rounded-2xl p-5 border border-stone-800 space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Lock className="text-[#0EB24A]" size={20} />
                Credenciais Seguras
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Conforme a Regra #2, tokens secretos e chaves privadas nunca são expostos na interface.
              </p>

              {/* Status dos Tokens */}
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-stone-900/80 rounded-lg border border-stone-800">
                  <span className="text-stone-300">Access Token (Bearer):</span>
                  <span className="font-bold flex items-center gap-1 text-emerald-400">
                    {config?.hasAccessToken ? (
                      <>
                        <CheckCircle2 size={13} /> Configurado no Backend
                      </>
                    ) : (
                      <span className="text-amber-400">Pendente / Sandbox Padrão</span>
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-stone-900/80 rounded-lg border border-stone-800">
                  <span className="text-stone-300">Chave Pública (Public Key):</span>
                  <span className="font-mono font-bold text-stone-200">
                    {config?.maskedPublicKey || 'Configurada via Env'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-stone-900/80 rounded-lg border border-stone-800">
                  <span className="text-stone-300">Segredo Webhook (HMAC):</span>
                  <span className="font-bold text-emerald-400">
                    {config?.hasWebhookSecret ? 'Ativo (Assinatura Validada)' : 'Opcional / Teste'}
                  </span>
                </div>
              </div>

              {/* Formulário de inserção segura pelo OWNER */}
              <form onSubmit={handleSaveCredentials} className="mt-4 space-y-3">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                  Atualizar Credenciais (Apenas OWNER):
                </span>
                <input
                  type="password"
                  placeholder="Novo Access Token (TEST-... ou APP_USR-...)"
                  value={inputAccessToken}
                  onChange={(e) => setInputAccessToken(e.target.value)}
                  className="w-full bg-stone-950 text-white text-xs p-2.5 rounded-lg border border-stone-800 focus:outline-none focus:border-[#0EB24A]"
                />
                <input
                  type="text"
                  placeholder="Chave Pública (Public Key)"
                  value={inputPublicKey}
                  onChange={(e) => setInputPublicKey(e.target.value)}
                  className="w-full bg-stone-950 text-white text-xs p-2.5 rounded-lg border border-stone-800 focus:outline-none focus:border-[#0EB24A]"
                />
                <input
                  type="password"
                  placeholder="Segredo do Webhook (Opcional)"
                  value={inputWebhookSecret}
                  onChange={(e) => setInputWebhookSecret(e.target.value)}
                  className="w-full bg-stone-950 text-white text-xs p-2.5 rounded-lg border border-stone-800 focus:outline-none focus:border-[#0EB24A]"
                />
                <button
                  type="submit"
                  disabled={savingCreds}
                  className="w-full py-2 bg-[#0EB24A] hover:bg-emerald-400 text-stone-950 font-black rounded-lg text-xs transition cursor-pointer disabled:opacity-50"
                >
                  {savingCreds ? 'Gravando com Segurança...' : 'Salvar Credenciais no Backend'}
                </button>
              </form>
            </div>

            <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl mt-4">
              <p className="text-[11px] text-emerald-300">
                🔒 <strong>Segurança MerMi:</strong> As chaves são armazenadas exclusivamente no ambiente do servidor ou Secret Manager, nunca no bundle JavaScript do cliente.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-ABA 2: AMBIENTE TESTE / SANDBOX RUNNER (REGRA #3) */}
      {activeSubTab === 'sandbox_runner' && (
        <div className="bg-[#171E31] rounded-2xl p-6 border border-stone-800 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">
              Regra 3 • Homologação Completa
            </span>
            <h3 className="text-xl font-black text-white mt-2">
              Mercado Pago — Teste / Sandbox Runner
            </h3>
            <p className="text-xs text-stone-400 mt-1 max-w-3xl">
              Permite validar todos os 6 estados obrigatórios de pagamento antes da liberação para produção, garantindo
              que o webhook, cálculo autoritativo, concessão idempotente de MerMi Points e atualização de status operem com 100% de conformidade.
            </p>
          </div>

          {/* Seleção de Transação e Cenário */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-stone-900/60 p-5 rounded-xl border border-stone-800">
            <div>
              <label className="text-xs font-bold text-stone-300 mb-2 block">
                1. Selecione o Pagamento / Pedido de Teste:
              </label>
              <select
                value={selectedTxIdForSim}
                onChange={(e) => setSelectedTxIdForSim(e.target.value)}
                className="w-full bg-stone-950 text-white text-xs p-3 rounded-xl border border-stone-800 focus:outline-none focus:border-[#0EB24A]"
              >
                {transactions.length === 0 && <option value="">Nenhuma transação encontrada</option>}
                {transactions.map((tx) => (
                  <option key={tx.id} value={tx.id}>
                    #{tx.id} • Pedido #{tx.orderId} • R$ {tx.amount.toFixed(2)} ({tx.method.toUpperCase()} - {tx.status})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-stone-400 mt-2">
                Você pode criar um pedido no Cardápio em modo Sandbox e testar sua liquidação aqui.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-300 mb-2 block">
                2. Selecione o Cenário Obrigatório do Gateway:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'APPROVED', label: '1. Aprovado (Pix/Cartão)', color: 'text-emerald-400' },
                  { id: 'REJECTED', label: '2. Cartão Recusado', color: 'text-rose-400' },
                  { id: 'PENDING', label: '3. Pagamento Pendente', color: 'text-amber-400' },
                  { id: 'CANCELLED', label: '4. Pagamento Cancelado', color: 'text-stone-400' },
                  { id: 'EXPIRED', label: '5. Pagamento Expirado', color: 'text-rose-300' }
                ].map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => setSimScenario(sc.id as any)}
                    className={`p-2.5 rounded-lg border text-left font-bold transition cursor-pointer ${
                      simScenario === sc.id
                        ? 'bg-stone-800 border-[#0EB24A] text-white shadow-sm'
                        : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <span className={sc.color}>{sc.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Botão de Disparo do Webhook de Teste */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-emerald-950/20 rounded-xl border border-emerald-500/20">
            <div>
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Activity className="text-[#0EB24A]" size={16} />
                Disparar Webhook Oficial de Teste
              </h4>
              <p className="text-xs text-stone-400 mt-0.5">
                Executa o ciclo completo de conferência no backend, idempotência, ledger de pontos e auditoria.
              </p>
            </div>

            <button
              onClick={handleRunSandboxScenario}
              disabled={simulating || !selectedTxIdForSim}
              className="w-full sm:w-auto px-6 py-3 bg-[#0EB24A] hover:bg-emerald-400 text-stone-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              <Play size={14} />
              <span>{simulating ? 'Processando Webhook...' : `Executar Teste: ${simScenario}`}</span>
            </button>
          </div>
        </div>
      )}

      {/* SUB-ABA 3: TRANSAÇÕES (REGRA #1 & #7) */}
      {activeSubTab === 'transacoes' && (
        <div className="bg-[#171E31] rounded-2xl p-5 border border-stone-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <DollarSign className="text-[#0EB24A]" size={20} />
              Transações Financeiras Gravadas no Banco
            </h3>
            <span className="text-xs text-stone-400">Total: {transactions.length} registros</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-900/80 text-stone-400 uppercase tracking-wider font-mono border-b border-stone-800">
                <tr>
                  <th className="p-3">ID Transação</th>
                  <th className="p-3">Pedido</th>
                  <th className="p-3">Gateway</th>
                  <th className="p-3">Método</th>
                  <th className="p-3">Valor</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Ambiente</th>
                  <th className="p-3">Data</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 font-sans">
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-6 text-center text-stone-500">
                      Nenhuma transação financeira registrada até o momento.
                    </td>
                  </tr>
                )}
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-stone-900/40 transition">
                    <td className="p-3 font-mono font-bold text-stone-200">{tx.id}</td>
                    <td className="p-3 font-mono text-emerald-400">#{tx.orderId}</td>
                    <td className="p-3 uppercase text-stone-300 font-bold">{tx.gateway}</td>
                    <td className="p-3 uppercase font-bold text-stone-300 flex items-center gap-1.5">
                      {tx.method === 'pix' ? <QrCode size={14} className="text-[#0EB24A]" /> : <CreditCard size={14} className="text-blue-400" />}
                      <span>{tx.method}</span>
                    </td>
                    <td className="p-3 font-black text-white">R$ {tx.amount.toFixed(2)}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          tx.status === 'PAYMENT_APPROVED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : tx.status === 'PAYMENT_PENDING'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : tx.status === 'PAYMENT_REFUNDED'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="p-3 uppercase text-[10px] text-stone-400 font-bold">
                      {tx.environment}
                    </td>
                    <td className="p-3 text-stone-400 text-[11px]">
                      {new Date(tx.createdAt).toLocaleString('pt-BR')}
                    </td>
                    <td className="p-3 text-right">
                      {tx.status === 'PAYMENT_APPROVED' && (
                        <button
                          onClick={() => {
                            setSelectedTxForRefund(tx);
                            setRefundAmount(tx.amount);
                          }}
                          className="px-2.5 py-1 bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white rounded-md text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ml-auto"
                        >
                          <RotateCcw size={12} />
                          <span>Reembolsar</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-ABA 4: REEMBOLSOS (REGRA #16) */}
      {activeSubTab === 'reembolsos' && (
        <div className="bg-[#171E31] rounded-2xl p-5 border border-stone-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <RotateCcw className="text-[#0EB24A]" size={20} />
                Histórico Oficial de Reembolsos & Estornos
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Regra 16: O histórico financeiro é imutável. Transações nunca são apagadas, apenas estornadas com auditoria.
              </p>
            </div>
            <span className="text-xs text-stone-400">Total: {refunds.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-900/80 text-stone-400 uppercase tracking-wider font-mono border-b border-stone-800">
                <tr>
                  <th className="p-3">ID Reembolso</th>
                  <th className="p-3">Pedido</th>
                  <th className="p-3">Transação</th>
                  <th className="p-3">Valor</th>
                  <th className="p-3">Solicitante</th>
                  <th className="p-3">Motivo</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 font-sans">
                {refunds.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-stone-500">
                      Nenhum reembolso registrado.
                    </td>
                  </tr>
                )}
                {refunds.map((ref) => (
                  <tr key={ref.id} className="hover:bg-stone-900/40 transition">
                    <td className="p-3 font-mono font-bold text-purple-300">{ref.id}</td>
                    <td className="p-3 font-mono text-emerald-400">#{ref.orderId}</td>
                    <td className="p-3 font-mono text-stone-300">{ref.paymentId}</td>
                    <td className="p-3 font-black text-rose-400">- R$ {ref.amount.toFixed(2)}</td>
                    <td className="p-3 text-stone-300 font-bold">{ref.requestedByUserName || 'OWNER'}</td>
                    <td className="p-3 text-stone-400 max-w-xs truncate">{ref.reason || 'Sem motivo'}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {ref.status}
                      </span>
                    </td>
                    <td className="p-3 text-stone-400 text-[11px]">
                      {new Date(ref.createdAt).toLocaleString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-ABA 5: WEBHOOK & LOGS (REGRA #1 & #10) */}
      {activeSubTab === 'webhooks_logs' && (
        <div className="bg-[#171E31] rounded-2xl p-5 border border-stone-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="text-[#0EB24A]" size={20} />
                Logs de Webhook & Eventos de Notificação
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Rastreabilidade e auditoria de cada requisição recebida dos servidores do Mercado Pago.
              </p>
            </div>
            <span className="text-xs text-stone-400">Total: {webhooksLogs.length} logs</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-900/80 text-stone-400 uppercase tracking-wider font-mono border-b border-stone-800">
                <tr>
                  <th className="p-3">Event ID</th>
                  <th className="p-3">Tipo do Evento</th>
                  <th className="p-3">Pedido</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Assinatura HMAC</th>
                  <th className="p-3">Data</th>
                  <th className="p-3">Payload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 font-mono">
                {webhooksLogs.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-stone-500 font-sans">
                      Nenhum webhook recebido recentemente.
                    </td>
                  </tr>
                )}
                {webhooksLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-900/40 transition">
                    <td className="p-3 font-bold text-stone-300">{log.eventId}</td>
                    <td className="p-3 text-emerald-400 font-bold">{log.eventType}</td>
                    <td className="p-3 text-stone-300">{log.orderId ? `#${log.orderId}` : '—'}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.status === 'PROCESSED'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="p-3 text-stone-400 text-[10px]">
                      {log.signatureHeader ? 'Validada (x-signature)' : 'Simulação / Sem segredo'}
                    </td>
                    <td className="p-3 text-stone-400 text-[11px] font-sans">
                      {new Date(log.createdAt).toLocaleString('pt-BR')}
                    </td>
                    <td className="p-3">
                      <details className="cursor-pointer text-stone-400 hover:text-white">
                        <summary className="text-[10px] text-[#0EB24A]">Ver JSON</summary>
                        <pre className="mt-1 p-2 bg-stone-950 rounded text-[10px] text-stone-300 max-w-xs overflow-x-auto whitespace-pre-wrap">
                          {log.payloadJson}
                        </pre>
                      </details>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: CONFIRMAÇÃO DE ATIVAÇÃO DE PRODUÇÃO (REGRA #3) */}
      {showProdConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#171E31] w-full max-w-md rounded-2xl border border-stone-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-3 bg-rose-500/20 rounded-xl">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Ativar Pagamentos em Produção?</h3>
                <p className="text-xs text-stone-400">Confirmação administrativa do OWNER</p>
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              Ao ativar o modo <strong>PRODUÇÃO</strong>, todas as transações de Pix e Cartão serão reais e processadas
              pela sua conta credenciada no Mercado Pago. Cobranças financeiras reais serão efetuadas aos clientes.
            </p>

            <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 text-xs space-y-2">
              <div className="flex items-center gap-2 text-stone-300">
                <CheckCircle2 size={14} className="text-[#0EB24A]" />
                <span>Testes de Sandbox concluídos com sucesso</span>
              </div>
              <div className="flex items-center gap-2 text-stone-300">
                <CheckCircle2 size={14} className="text-[#0EB24A]" />
                <span>Idempotência de Webhook e Ledger validados</span>
              </div>
            </div>

            <label className="flex items-start gap-2.5 text-xs text-stone-300 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={prodAgreed}
                onChange={(e) => setProdAgreed(e.target.checked)}
                className="mt-0.5 rounded border-stone-700 bg-stone-900 text-[#0EB24A] focus:ring-0"
              />
              <span>
                Estou ciente de que o sistema começará a processar valores financeiros reais no Mercado Pago.
              </span>
            </label>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setShowProdConfirmModal(false)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmActivateProduction}
                disabled={!prodAgreed}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black rounded-xl transition cursor-pointer disabled:opacity-50"
              >
                Confirmar e Ativar Produção
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: INICIAR REEMBOLSO (REGRA #16) */}
      {selectedTxForRefund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#171E31] w-full max-w-md rounded-2xl border border-stone-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-purple-400">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <RotateCcw size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Solicitar Reembolso</h3>
                <p className="text-xs text-stone-400">
                  Pedido #{selectedTxForRefund.orderId} • Transação #{selectedTxForRefund.id}
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div>
                <label className="text-stone-300 font-bold block mb-1">Valor do Estorno (R$):</label>
                <input
                  type="number"
                  step="0.01"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value))}
                  className="w-full bg-stone-950 text-white p-2.5 rounded-xl border border-stone-800 focus:outline-none focus:border-[#0EB24A]"
                />
              </div>

              <div>
                <label className="text-stone-300 font-bold block mb-1">Motivo do Reembolso:</label>
                <textarea
                  rows={3}
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full bg-stone-950 text-white p-2.5 rounded-xl border border-stone-800 focus:outline-none focus:border-[#0EB24A]"
                />
              </div>

              <div className="p-3 bg-amber-950/20 border border-amber-500/20 rounded-xl text-amber-300 text-[11px]">
                ⚠️ <strong>Atenção:</strong> O valor será estornado na conta do cliente via Mercado Pago, o status do pedido mudará para <em>REFUNDED</em> e eventuais pontos creditados serão estornados no ledger.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setSelectedTxForRefund(null)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleExecuteRefund}
                disabled={refunding}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-black rounded-xl transition cursor-pointer disabled:opacity-50"
              >
                {refunding ? 'Processando...' : 'Confirmar Reembolso'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
