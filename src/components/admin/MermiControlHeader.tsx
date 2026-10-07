import React, { useState } from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import { AdminRole, AdminUser } from '../../types/mermiControl';
import {
  ShieldCheck,
  RotateCcw,
  Eye,
  LogOut,
  Bell,
  Users,
  ChevronDown,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Search
} from 'lucide-react';

interface MermiControlHeaderProps {
  onNavigateHome: () => void;
  onOpenAlerts?: () => void;
  onOpenSearch?: () => void;
}

export const MermiControlHeader: React.FC<MermiControlHeaderProps> = ({
  onNavigateHome,
  onOpenAlerts,
  onOpenSearch
}) => {
  const {
    currentAdminUser,
    adminUsers,
    switchAdminUser,
    logoutAdmin,
    resetToOfficialDefaults,
    adminAlerts
  } = useMermiStore();

  const [isSwitchOpen, setIsSwitchOpen] = useState(false);

  const unresolvedAlerts = adminAlerts.filter((a) => !a.resolved);

  const roleColors: Record<AdminRole, string> = {
    OWNER: 'bg-amber-400 text-stone-950 border-amber-300 font-black',
    ADMIN: 'bg-blue-500 text-white border-blue-400 font-bold',
    GERENTE: 'bg-emerald-500 text-stone-950 border-emerald-400 font-bold',
    FINANCEIRO: 'bg-purple-500 text-white border-purple-400 font-bold',
    OPERACIONAL: 'bg-cyan-500 text-stone-950 border-cyan-400 font-bold',
    MARKETING: 'bg-rose-500 text-white border-rose-400 font-bold',
    PRODUÇÃO: 'bg-orange-500 text-stone-950 border-orange-400 font-bold',
    ATENDIMENTO: 'bg-teal-500 text-stone-950 border-teal-400 font-bold'
  };

  return (
    <header className="bg-[#13192B] border-b border-stone-800 sticky top-0 z-40 px-3 sm:px-6 py-3 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* BRAND & ENVIRONMENT TITLE */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0EB24A] via-emerald-500 to-amber-400 p-0.5 shadow-md shrink-0">
            <div className="w-full h-full bg-[#0E131F] rounded-[14px] flex items-center justify-center font-black text-lg text-[#0EB24A] font-['Outfit']">
              MC
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#0EB24A] font-['Outfit']">
                MERMI CONTROL
              </span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                CENTRAL ÚNICA
              </span>
              <span className="text-[9px] font-mono text-stone-400 hidden sm:inline">
                v10.0
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-black text-white font-['Outfit'] leading-tight">
              Central Administrativa do Proprietário
            </h1>
          </div>
        </div>

        {/* RIGHT ACTIONS & PROFILE SWITCHER */}
        <div className="flex flex-wrap items-center gap-2 justify-end">
          
          {/* GLOBAL SEARCH BUTTON (SEÇÃO 45) */}
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              title="Pesquisa Global Administrativa (Ctrl+K)"
              className="p-2.5 rounded-xl bg-[#0E131F] border border-stone-700 text-stone-300 hover:text-white hover:border-[#0EB24A] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Search className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold hidden md:inline text-stone-300">Busca Global</span>
            </button>
          )}

          {/* ALERTS BADGE */}
          <button
            onClick={onOpenAlerts}
            title={`${unresolvedAlerts.length} alertas administrativos`}
            className="relative p-2.5 rounded-xl bg-[#0E131F] border border-stone-700 text-stone-300 hover:text-white hover:border-stone-600 transition-all cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unresolvedAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white ring-2 ring-[#13192B]">
                {unresolvedAlerts.length}
              </span>
            )}
          </button>

          {/* ACTIVE USER ROLE POPUP */}
          <div className="relative">
            <button
              onClick={() => setIsSwitchOpen(!isSwitchOpen)}
              className="px-3 py-1.5 rounded-xl bg-[#0E131F] border border-stone-700 text-left hover:border-stone-500 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-xs font-black text-emerald-400 shrink-0">
                {currentAdminUser.name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-white block leading-tight truncate max-w-[120px]">
                  {currentAdminUser.name.split(' ')[0]}
                </span>
                <span className={`text-[8px] font-black uppercase px-1.5 py-0.2 rounded border ${roleColors[currentAdminUser.role]}`}>
                  {currentAdminUser.role}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            </button>

            {isSwitchOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#171E31] border border-stone-700 p-2 shadow-2xl z-50 space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-2 py-1 block">
                  Alternar Papel Administrativo (RBAC)
                </span>
                <div className="max-h-56 overflow-y-auto pr-0.5 space-y-1">
                  {adminUsers.map((admin) => (
                    <button
                      key={admin.id}
                      onClick={() => {
                        switchAdminUser(admin.id);
                        setIsSwitchOpen(false);
                      }}
                      className={`w-full px-2.5 py-2 rounded-xl text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                        currentAdminUser.id === admin.id
                          ? 'bg-emerald-950/60 border border-emerald-500/50 text-white font-bold'
                          : 'hover:bg-stone-800 text-stone-300'
                      }`}
                    >
                      <div className="truncate">
                        <span className="block font-semibold truncate">{admin.name}</span>
                        <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded border inline-block mt-0.5 ${roleColors[admin.role]}`}>
                          {admin.role}
                        </span>
                      </div>
                      {currentAdminUser.id === admin.id && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* VIEW CLIENT APP BUTTON */}
          <button
            onClick={onNavigateHome}
            className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-600 text-xs font-bold text-stone-200 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Abrir a interface do cliente"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Ver App do Cliente</span>
          </button>

          {/* RESTORE DATA BUTTON */}
          <button
            onClick={resetToOfficialDefaults}
            className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-xs font-bold text-rose-300 transition-all flex items-center gap-1 cursor-pointer"
            title="Restaurar dados oficiais do ecossistema"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* LOGOUT BUTTON */}
          <button
            onClick={logoutAdmin}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-400 hover:text-stone-200 transition-all cursor-pointer"
            title="Encerrar sessão no Mermi Control"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>
    </header>
  );
};
