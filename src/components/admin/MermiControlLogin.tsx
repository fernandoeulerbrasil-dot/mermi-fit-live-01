import React, { useState, useEffect } from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import { apiClient } from '../../services/apiClient';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  ShieldAlert,
  Key,
  UserCheck,
  Sparkles,
  ArrowLeft,
  Mail,
  User,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface MermiControlLoginProps {
  onReturnToClientApp: () => void;
}

export const MermiControlLogin: React.FC<MermiControlLoginProps> = ({
  onReturnToClientApp
}) => {
  const { setAdminUser, setAdminAuthenticated, showToast } = useMermiStore();

  const [hasOwner, setHasOwner] = useState<boolean | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Form states - Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states - First Owner Setup
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [ownerConfirmPassword, setOwnerConfirmPassword] = useState('');

  // Check if system already has an OWNER
  const checkOwnerStatus = async () => {
    try {
      setCheckingStatus(true);
      setErrorMsg(null);
      const res = await apiClient.auth.getOwnerStatus();
      setHasOwner(res.hasOwner);
    } catch {
      // Se a API ainda estiver inicializando, assume true por segurança
      setHasOwner(true);
    } finally {
      setCheckingStatus(false);
    }
  };

  useEffect(() => {
    checkOwnerStatus();
  }, []);

  // Handler: Setup First Owner (Mecanismo Seguro do Backend)
  const handleSetupFirstOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!ownerName.trim() || !ownerEmail.trim() || !ownerPassword) {
      setErrorMsg('Todos os campos são obrigatórios.');
      return;
    }

    if (ownerPassword.length < 8) {
      setErrorMsg('A senha mestra do OWNER deve possuir no mínimo 8 caracteres.');
      return;
    }

    if (ownerPassword !== ownerConfirmPassword) {
      setErrorMsg('As senhas digitadas não coincidem.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await apiClient.auth.setupFirstOwner({
        name: ownerName.trim(),
        email: ownerEmail.trim(),
        password: ownerPassword
      });

      apiClient.setToken(res.token);

      const adminPayload = {
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        role: 'OWNER' as const,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        permissions: ['ALL'],
        active: true,
        lastLogin: new Date().toISOString()
      };

      setAdminUser(adminPayload);
      setAdminAuthenticated(true);
      showToast(`Proprietário (OWNER) provisionado com sucesso! Bem-vindo, ${res.user.name}.`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao registrar o primeiro OWNER.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler: Real Administrative Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!loginEmail.trim() || !loginPassword) {
      setErrorMsg('E-mail e senha são obrigatórios.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await apiClient.auth.login({
        email: loginEmail.trim(),
        password: loginPassword
      });

      // Validação autoritativa do papel retornado pelo servidor
      const role = (res.user.role || '').toUpperCase();
      if (role === 'CUSTOMER') {
        throw new Error('Acesso negado. Esta conta é de cliente e não possui permissões administrativas para o MERMI CONTROL.');
      }

      apiClient.setToken(res.token);

      const adminPayload = {
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        role: role as any,
        avatar: res.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        permissions: role === 'OWNER' ? ['ALL'] : ['READ', 'OPERATE'],
        active: true,
        lastLogin: new Date().toISOString()
      };

      setAdminUser(adminPayload);
      setAdminAuthenticated(true);
      showToast(`Bem-vindo ao MERMI CONTROL, ${res.user.name} (${role})!`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Credenciais inválidas. Verifique seu e-mail e senha.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-stone-100 flex flex-col justify-center items-center px-4 py-8 font-sans selection:bg-[#0EB24A] selection:text-white">
      <div className="w-full max-w-lg space-y-6">

        {/* LOGO & BRANDING */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#0EB24A] via-emerald-500 to-amber-400 p-0.5 shadow-2xl shadow-emerald-500/20">
            <div className="w-full h-full bg-[#0E131F] rounded-[22px] flex items-center justify-center font-black text-2xl text-[#0EB24A] font-['Outfit']">
              MC
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#0EB24A] bg-[#0EB24A]/10 px-3 py-1 rounded-full border border-[#0EB24A]/30">
              CENTRAL ADMINISTRATIVA ÚNICA
            </span>
            <span className="text-[10px] font-bold text-stone-400">
              MERMI CONTROL
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] tracking-tight">
            MERMI CONTROL
          </h1>
          <p className="text-xs text-stone-400 max-w-md mx-auto">
            Ambiente exclusivo para gestão de produtos, preços, pedidos, estoque, campanhas, Assets e inteligência do MERMI FIT LIFE.
          </p>
        </div>

        {/* LOADING STATE */}
        {checkingStatus ? (
          <div className="bg-[#13192B] border border-stone-800 rounded-3xl p-8 shadow-2xl text-center space-y-3">
            <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin mx-auto" />
            <p className="text-xs text-stone-400 font-bold">Verificando status de segurança do ecossistema...</p>
          </div>
        ) : hasOwner === false ? (
          /* ========================================================================= */
          /* FLUXO 1: PROVISIONAMENTO DO PRIMEIRO OWNER (SEÇÃO 6 E 7) */
          /* ========================================================================= */
          <div className="bg-[#13192B] border border-amber-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="border-b border-stone-800 pb-4 space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                CONFIGURAÇÃO INICIAL DO SISTEMA
              </div>
              <h2 className="text-base font-black text-white font-['Outfit'] mt-1">
                Provisionamento do Primeiro OWNER (Proprietário)
              </h2>
              <p className="text-xs text-stone-300 leading-relaxed">
                O banco de dados central foi inicializado e ainda não possui um OWNER configurado. Defina agora o usuário mestre do ecossistema.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSetupFirstOwner} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-300 block">Nome Completo do Proprietário</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Ex: Fernando Euler"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0E131F] border border-stone-700 text-white text-xs outline-none focus:border-amber-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-300 block">E-mail Oficial do OWNER</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    type="email"
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    placeholder="proprietario@mermifit.com.br"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0E131F] border border-stone-700 text-white text-xs outline-none focus:border-amber-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-300 block">Senha Mestra (Mín. 8 caracteres)</label>
                  <div className="relative">
                    <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                    <input
                      type="password"
                      value={ownerPassword}
                      onChange={(e) => setOwnerPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0E131F] border border-stone-700 text-white text-xs outline-none focus:border-amber-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-300 block">Confirmar Senha</label>
                  <div className="relative">
                    <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                    <input
                      type="password"
                      value={ownerConfirmPassword}
                      onChange={(e) => setOwnerConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0E131F] border border-stone-700 text-white text-xs outline-none focus:border-amber-500 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 active:scale-98 disabled:opacity-50 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Provisionando Conta Mestra...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Criar Conta de OWNER & Entrar</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* ========================================================================= */
          /* FLUXO 2: LOGIN ADMINISTRATIVO REAL (SEM PIN HARDCODED, SEM SELECTOR) */
          /* ========================================================================= */
          <div className="bg-[#13192B] border border-stone-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="border-b border-stone-800 pb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                Autenticação de Acesso Administrativo
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Informe suas credenciais autorizadas pelo backend central
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-300 block uppercase tracking-wider">
                  E-mail Administrativo
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@mermifit.com.br"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0E131F] border border-stone-700 text-white text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-300 block uppercase tracking-wider flex items-center justify-between">
                  <span>Senha de Acesso</span>
                  <span className="text-[10px] text-stone-500">Hash PBKDF2 Seguro</span>
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Digite sua senha administrativa"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0E131F] border border-stone-700 text-white text-xs outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-[#0EB24A] hover:bg-[#0ca042] text-stone-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-98 disabled:opacity-50 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Autenticando com o servidor...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar no MERMI CONTROL</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* BOTTOM SHORTCUT TO CLIENT APP */}
        <div className="text-center pt-2">
          <button
            onClick={onReturnToClientApp}
            className="text-xs font-bold text-stone-400 hover:text-stone-200 transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Aplicativo do Cliente (Cardápio / Treinos)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
