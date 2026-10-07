import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  FileText,
  Download,
  AlertTriangle,
  Smartphone,
  CheckCircle2,
  Lock,
  ChevronRight
} from 'lucide-react';
import { useMermiStore } from '../../context/MermiStoreContext';

interface MermiPrivacyTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MermiPrivacyTermsModal: React.FC<MermiPrivacyTermsModalProps> = ({ isOpen, onClose }) => {
  const {
    legalPolicies,
    userPrivacyConsent,
    updatePrivacyConsentSettings,
    authSessions,
    revokeAuthSession,
    revokeAllOtherSessions,
    exportLgpdUserData,
    requestLgpdAccountAnonymization,
    user,
    showToast
  } = useMermiStore();

  const [activeTab, setActiveTab] = useState<'termos' | 'consentimentos' | 'portabilidade' | 'sessoes'>('termos');
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>(legalPolicies[0]?.policy_id || '');
  const [deletionSuccess, setDeletionSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    const jsonStr = exportLgpdUserData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meus_dados_mermi_lgpd_${user.id || 'cliente'}.json`;
    a.click();
    showToast('Download do arquivo de dados LGPD iniciado.');
  };

  const handleAnonymize = () => {
    requestLgpdAccountAnonymization();
    setDeletionSuccess(true);
    showToast('Dados anonimizados com sucesso. Retenção legal de pedidos preservada.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-['Outfit']">
      <div className="bg-[#121727] border border-stone-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-[#171E31]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[#0EB24A]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Privacidade, Termos & LGPD</h2>
              <p className="text-xs text-stone-400">Transparência, controle de consentimento e direitos do titular</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* NAVEGAÇÃO DE ABAS */}
        <div className="flex border-b border-stone-800 bg-[#0E1322] px-4 overflow-x-auto text-xs font-bold scrollbar-none">
          {[
            { id: 'termos', label: 'Termos & Políticas', icon: FileText },
            { id: 'consentimentos', label: 'Consentimentos Granulares', icon: Lock },
            { id: 'portabilidade', label: 'Exportar / Excluir Dados', icon: Download },
            { id: 'sessoes', label: 'Dispositivos Conectados', icon: Smartphone }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  isActive
                    ? 'border-[#0EB24A] text-[#0EB24A]'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* CONTEÚDO SCROLLÁVEL */}
        <div className="p-5 overflow-y-auto flex-1 text-xs text-stone-300 space-y-4">
          {/* ABA 1: TERMOS & POLÍTICAS */}
          {activeTab === 'termos' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {legalPolicies.map((pol) => (
                  <button
                    key={pol.policy_id}
                    onClick={() => setSelectedPolicyId(pol.policy_id)}
                    className={`text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                      selectedPolicyId === pol.policy_id
                        ? 'bg-[#171E31] border-[#0EB24A]'
                        : 'bg-[#101526] border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-emerald-400 font-mono font-bold mb-1">
                      <span>v{pol.version}</span>
                      <span className="text-stone-400 uppercase">{pol.status}</span>
                    </div>
                    <div className="font-bold text-white text-xs line-clamp-1">{pol.title}</div>
                  </button>
                ))}
              </div>

              {selectedPolicyId && (
                <div className="bg-[#101526] border border-stone-800 rounded-2xl p-4">
                  {(() => {
                    const pol = legalPolicies.find((p) => p.policy_id === selectedPolicyId);
                    if (!pol) return null;
                    return (
                      <div>
                        <div className="font-bold text-white text-sm mb-1">{pol.title}</div>
                        <div className="text-[11px] text-stone-500 font-mono mb-3">
                          Versão {pol.version} • Vigente
                        </div>
                        <pre className="text-xs text-stone-300 font-sans whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto pr-1">
                          {pol.content}
                        </pre>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* ABA 2: CONSENTIMENTOS GRANULARES */}
          {activeTab === 'consentimentos' && (
            <div className="space-y-3">
              <p className="text-xs text-stone-400">
                Conforme a LGPD (Lei 13.709/2018), você possui controle sobre quais dados opcionais deseja compartilhar conosco.
              </p>

              {[
                {
                  id: 'health_data_consent',
                  label: 'Dados de Saúde & Hábitos de Bem-Estar',
                  desc: 'Permite registrar ingestão de água, sono e metas físicas para personalização da experiência.'
                },
                {
                  id: 'activity_sync_consent',
                  label: 'Sincronização de Passos & Wearables',
                  desc: 'Permite integrar dados de passos do Apple Health, Google Fit ou Garmin.'
                },
                {
                  id: 'geolocation_consent',
                  label: 'Localização Aproximada para Entrega',
                  desc: 'Utilizado unicamente no momento do checkout e acompanhamento em rota.'
                },
                {
                  id: 'marketing_consent',
                  label: 'Notificações de Campanhas & Promoções',
                  desc: 'Avisos sobre novos pratos do cardápio, descontos de pontos e novidades.'
                }
              ].map((c) => {
                const isChecked = (userPrivacyConsent as any)[c.id];

                return (
                  <div
                    key={c.id}
                    className="bg-[#101526] border border-stone-800 rounded-2xl p-4 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="font-bold text-white text-xs">{c.label}</div>
                      <div className="text-[11px] text-stone-400 mt-0.5">{c.desc}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          updatePrivacyConsentSettings({ [c.id]: e.target.checked });
                          showToast('Preferência de privacidade atualizada.');
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0EB24A]"></div>
                    </label>
                  </div>
                );
              })}
            </div>
          )}

          {/* ABA 3: PORTABILIDADE & EXCLUSÃO */}
          {activeTab === 'portabilidade' && (
            <div className="space-y-4">
              <div className="bg-[#101526] border border-stone-800 rounded-2xl p-4">
                <div className="font-bold text-white text-xs mb-1 flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-400" />
                  Portabilidade de Dados (Art. 18, V)
                </div>
                <p className="text-[11px] text-stone-400 mb-3">
                  Baixe cópia completa e estruturada dos seus dados cadastrais, pedidos, saldo de pontos e histórico em formato interoperável JSON.
                </p>
                <button
                  onClick={handleExport}
                  className="px-4 py-2 rounded-xl bg-[#0EB24A] hover:bg-emerald-600 text-stone-950 font-black text-xs transition-all cursor-pointer shadow-md shadow-emerald-500/20"
                >
                  Baixar Meus Dados (JSON)
                </button>
              </div>

              <div className="bg-[#101526] border border-stone-800 rounded-2xl p-4">
                <div className="font-bold text-white text-xs mb-1 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  Solicitar Anonimização / Exclusão de Conta
                </div>
                <p className="text-[11px] text-stone-400 mb-3">
                  Ao solicitar a exclusão, todos os seus dados cadastrais, senhas e registros de saúde são permanentemente expurgados. Por força do Art. 16 da LGPD e legislação tributária brasileira, registros contábeis de pedidos já emitidos são mantidos de forma estritamente anônima.
                </p>

                {deletionSuccess ? (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold">
                    ✓ Solicitação atendida: Sua conta foi desvinculada e dados sensíveis anonimizados.
                  </div>
                ) : (
                  <button
                    onClick={handleAnonymize}
                    className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition-all cursor-pointer"
                  >
                    Confirmar Anonimização da Conta
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ABA 4: SESSÕES CONECTADAS */}
          {activeTab === 'sessoes' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-stone-400">Dispositivos onde sua conta está logada:</span>
                <button
                  onClick={() => {
                    revokeAllOtherSessions();
                    showToast('Outros dispositivos desconectados.');
                  }}
                  className="text-[11px] text-red-400 hover:underline cursor-pointer font-bold"
                >
                  Desconectar Outros Dispositivos
                </button>
              </div>

              {authSessions.map((s) => (
                <div
                  key={s.session_id}
                  className="bg-[#101526] border border-stone-800 rounded-2xl p-3.5 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{s.device_info}</span>
                      {s.session_id === 'sess-current-01' && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">
                          Este dispositivo
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-stone-400 mt-0.5">
                      {s.location_approx} • IP: {s.ip_masked}
                    </div>
                  </div>

                  {s.session_id !== 'sess-current-01' && s.status === 'active' && (
                    <button
                      onClick={() => {
                        revokeAuthSession(s.session_id);
                        showToast('Dispositivo desconectado.');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] font-bold cursor-pointer"
                    >
                      Desconectar
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-stone-800 bg-[#0E1322] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
