import React, { useState } from 'react';
import { useMermiStore } from '../../context/MermiStoreContext';
import { AdminRole, AdminUser } from '../../types/mermiControl';
import {
  FileText,
  Settings,
  Users,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Trash2,
  Edit3,
  Plus,
  Clock,
  Key,
  Building,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

export const MermiAuditSettingsView: React.FC = () => {
  const {
    auditLogs,
    adminUsers,
    addAdminUser,
    updateAdminUser,
    deleteAdminUser,
    currentAdminUser,
    systemSettings,
    updateSystemSettings,
    showToast
  } = useMermiStore();

  const [activeTab, setActiveTab] = useState<'auditoria' | 'usuarios' | 'configuracoes'>('auditoria');
  const [auditEntityFilter, setAuditEntityFilter] = useState<string>('todos');

  // Form for new Admin User
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<AdminRole>('OPERACIONAL');

  // Form for system settings
  const [companyName, setCompanyName] = useState(systemSettings.companyName);
  const [cnpj, setCnpj] = useState(systemSettings.cnpj);
  const [contactEmail, setContactEmail] = useState(systemSettings.contactEmail);
  const [contactWhatsApp, setContactWhatsApp] = useState(systemSettings.contactWhatsApp);
  const [kitchenAddress, setKitchenAddress] = useState(systemSettings.kitchenAddress);
  const [deliveryRadius, setDeliveryRadius] = useState(systemSettings.deliveryRadiusKm.toString());
  const [minOrder, setMinOrder] = useState(systemSettings.minOrderValue.toString());

  const filteredLogs = auditEntityFilter === 'todos'
    ? auditLogs
    : auditLogs.filter((l) => l.entity === auditEntityFilter);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) {
      showToast('Preencha o nome e o e-mail do usuário.');
      return;
    }

    addAdminUser({
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      permissions: [newUserRole.toLowerCase()],
      active: true,
      lastLogin: 'Nunca'
    });

    setNewUserName('');
    setNewUserEmail('');
    setIsAddingUser(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemSettings({
      companyName,
      cnpj,
      contactEmail,
      contactWhatsApp,
      kitchenAddress,
      deliveryRadiusKm: parseFloat(deliveryRadius) || 25,
      minOrderValue: parseFloat(minOrder) || 30
    });
  };

  return (
    <div className="space-y-6">

      {/* HEADER & SUBTABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 font-['Outfit']">
            GOVERNANÇA & SEGURANÇA
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
            Auditoria, Usuários Administrativos & Configurações
          </h2>
          <p className="text-xs text-stone-400">
            Histórico imutável de alterações, controle RBAC de equipe e parâmetros da empresa
          </p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'auditoria', label: 'Histórico & Logs', icon: FileText },
            { id: 'usuarios', label: 'Equipe & RBAC', icon: Users },
            { id: 'configuracoes', label: 'Configurações Gerais', icon: Settings }
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

      {/* SUBTAB 1: AUDITORIA & LOGS */}
      {activeTab === 'auditoria' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider font-['Outfit'] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0EB24A]" />
                Trilha de Auditoria Administrativa ({auditLogs.length} registros)
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Registra quem alterou, o que alterou, valor anterior e novo valor
              </p>
            </div>

            {/* ENTITY FILTER */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'preco', label: 'Preços' },
                { id: 'estoque', label: 'Estoque' },
                { id: 'campanha', label: 'Campanhas' },
                { id: 'asset', label: 'Assets' },
                { id: 'usuario', label: 'Usuários' }
              ].map((ent) => (
                <button
                  key={ent.id}
                  onClick={() => setAuditEntityFilter(ent.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    auditEntityFilter === ent.id
                      ? 'bg-stone-200 text-stone-950'
                      : 'bg-[#171E31] text-stone-400 hover:text-white border border-stone-800'
                  }`}
                >
                  {ent.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#171E31] border border-stone-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-[#101524] text-[10px] font-black uppercase text-stone-400 tracking-wider border-b border-stone-800">
                  <tr>
                    <th className="py-3 px-4">Data & Horário</th>
                    <th className="py-3 px-3">Administrador</th>
                    <th className="py-3 px-3">Ação Executada</th>
                    <th className="py-3 px-3">Entidade</th>
                    <th className="py-3 px-3">Valor Anterior</th>
                    <th className="py-3 px-3">Novo Valor</th>
                    <th className="py-3 px-4">Motivo / Detalhes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 font-medium">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-stone-800/40 transition-colors">
                      <td className="py-3 px-4 text-stone-400 font-mono text-[11px] whitespace-nowrap">
                        {log.timestamp}
                      </td>

                      <td className="py-3 px-3">
                        <div>
                          <span className="font-bold text-white block">{log.adminName}</span>
                          <span className="text-[9px] font-bold uppercase text-amber-300 font-mono">
                            {log.adminRole}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3 font-mono font-bold text-emerald-400 text-[11px]">
                        {log.action}
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-[10px] uppercase font-bold text-stone-400 bg-stone-800 px-2 py-0.5 rounded-full">
                          {log.entity}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-stone-400 text-[11px] max-w-[150px] truncate">
                        {log.previousValue}
                      </td>

                      <td className="py-3 px-3 font-semibold text-white text-[11px] max-w-[150px] truncate">
                        {log.newValue}
                      </td>

                      <td className="py-3 px-4 text-stone-400 text-[11px] max-w-[180px] truncate">
                        {log.reason || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: USUÁRIOS ADMINISTRATIVOS & RBAC */}
      {activeTab === 'usuarios' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider font-['Outfit'] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#0EB24A]" />
                Equipe Administrativa & Papéis de Acesso ({adminUsers.length} usuários)
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Perfis configuráveis com controle de permissão por função
              </p>
            </div>

            <button
              onClick={() => setIsAddingUser(true)}
              className="px-3 py-1.5 rounded-xl bg-[#0EB24A] hover:bg-[#0ca042] text-stone-950 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Administrador</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {adminUsers.map((admin) => (
              <div
                key={admin.id}
                className="bg-[#171E31] border border-stone-800 rounded-3xl p-5 shadow-lg flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-white font-['Outfit']">{admin.name}</span>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        admin.role === 'OWNER'
                          ? 'bg-amber-400 text-stone-950 border-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {admin.role}
                    </span>
                  </div>

                  <span className="text-stone-400 block">{admin.email}</span>
                  <span className="text-stone-500 block text-[10px]">
                    Último acesso: {admin.lastLogin || 'Recentemente'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {admin.role !== 'OWNER' && (
                    <button
                      onClick={() => deleteAdminUser(admin.id)}
                      className="text-stone-500 hover:text-rose-400 p-1.5 rounded-lg bg-stone-800 cursor-pointer"
                      title="Remover acesso"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ADD USER MODAL */}
          {isAddingUser && (
            <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
              <form onSubmit={handleCreateUser} className="bg-[#171E31] border border-stone-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
                <h3 className="text-base font-black text-white font-['Outfit']">Novo Usuário Administrativo</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-stone-300 font-bold block mb-1">Nome Completo</label>
                    <input
                      type="text"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="Ex: Matheus Oliveira"
                      className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-stone-300 font-bold block mb-1">E-mail Corporativo</label>
                    <input
                      type="email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="Ex: matheus@mermifitlife.com.br"
                      className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-stone-300 font-bold block mb-1">Papel / Função (RBAC)</label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as AdminRole)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
                    >
                      <option value="ADMIN">ADMIN (Administrador Geral)</option>
                      <option value="GERENTE">GERENTE (Operações & Cardápio)</option>
                      <option value="FINANCEIRO">FINANCEIRO (Preços & DRE)</option>
                      <option value="OPERACIONAL">OPERACIONAL (Expedição & Entregas)</option>
                      <option value="MARKETING">MARKETING (Campanhas & Posts)</option>
                      <option value="PRODUÇÃO">PRODUÇÃO (Chef & Cozinha)</option>
                      <option value="ATENDIMENTO">ATENDIMENTO (CRM & Suporte)</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingUser(false)}
                    className="flex-1 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-[#0EB24A] text-stone-950 text-xs font-black"
                  >
                    Conceder Acesso
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: CONFIGURAÇÕES GERAIS */}
      {activeTab === 'configuracoes' && (
        <form onSubmit={handleSaveSettings} className="bg-[#171E31] border border-stone-800 rounded-3xl p-6 shadow-xl space-y-4 max-w-xl">
          <div className="border-b border-stone-800 pb-3">
            <h3 className="text-base font-black text-white font-['Outfit'] flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#0EB24A]" />
              Dados Cadastrais do Negócio
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Parâmetros fiscais, endereço da cozinha central e regras operacionais
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-stone-300 font-bold block mb-1">Razão Social</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-stone-300 font-bold block mb-1">CNPJ</label>
                <input
                  type="text"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-stone-300 font-bold block mb-1">WhatsApp de Suporte</label>
                <input
                  type="text"
                  value={contactWhatsApp}
                  onChange={(e) => setContactWhatsApp(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-stone-300 font-bold block mb-1">E-mail de Contato Oficial</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
              />
            </div>

            <div>
              <label className="text-stone-300 font-bold block mb-1">Endereço da Cozinha Central</label>
              <input
                type="text"
                value={kitchenAddress}
                onChange={(e) => setKitchenAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-stone-300 font-bold block mb-1">Raio Máximo de Entrega (km)</label>
                <input
                  type="number"
                  value={deliveryRadius}
                  onChange={(e) => setDeliveryRadius(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-stone-300 font-bold block mb-1">Pedido Mínimo (R$)</label>
                <input
                  type="number"
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0E131F] border border-stone-700 text-white font-mono"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[#0EB24A] hover:bg-[#0ca042] text-stone-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
          >
            Salvar Configurações
          </button>
        </form>
      )}

    </div>
  );
};
