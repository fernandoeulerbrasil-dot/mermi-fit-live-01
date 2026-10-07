import React, { useState } from 'react';
import { OFFICIAL_ASSET_REGISTRY } from '../../data/assetRegistry';
import { OfficialLogo } from '../brand/OfficialLogo';
import { OfficialPointsBadge } from '../brand/OfficialPointsBadge';
import { OfficialMascot } from '../brand/OfficialMascot';
import { MermiHeader } from '../brand/MermiHeader';
import {
  ShieldCheck,
  Lock,
  ArrowUpRight,
  Search,
  CheckCircle2,
  Image as ImageIcon,
  FolderOpen,
  Copy,
  Check,
  Folder
} from 'lucide-react';

interface AssetRegistryViewProps {
  onNavigateToComponent: (tab: string) => void;
}

export const AssetRegistryView: React.FC<AssetRegistryViewProps> = ({ onNavigateToComponent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const copyPath = (path: string, id: string) => {
    navigator.clipboard.writeText(path);
    setCopiedFile(id);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const categories = ['todos', 'bloco 03', 'brand', 'gamification', 'ia', 'campanhas', 'conteudo'];

  const filteredAssets = OFFICIAL_ASSET_REGISTRY.filter((asset) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      asset.nome.toLowerCase().includes(term) ||
      asset.asset_id.toLowerCase().includes(term) ||
      asset.arquivo_original.toLowerCase().includes(term) ||
      asset.categoria.toLowerCase().includes(term) ||
      (asset.subcategoria && asset.subcategoria.toLowerCase().includes(term));

    let matchesCat = true;
    if (selectedCategory === 'bloco 03') {
      matchesCat = asset.asset_id.startsWith('ASSET_B03');
    } else if (selectedCategory !== 'todos') {
      matchesCat = asset.categoria.toLowerCase().includes(selectedCategory);
    }

    return matchesSearch && matchesCat;
  });

  const getTargetTab = (assetId: string) => {
    switch (assetId) {
      case 'ASSET_B03_01':
      case 'ASSET_B03_09':
      case 'ASSET_01':
      case 'ASSET_02':
      case 'ASSET_04':
      case 'ASSET_05':
      case 'ASSET_07':
        return 'home';
      case 'ASSET_B03_02':
      case 'ASSET_03':
        return 'ia';
      case 'ASSET_B03_03':
      case 'ASSET_10':
        return 'membro';
      case 'ASSET_B03_04':
        return 'corridas';
      case 'ASSET_B03_05':
      case 'ASSET_B03_08':
        return 'cardapio';
      case 'ASSET_B03_06':
      case 'ASSET_09':
        return 'resgate';
      case 'ASSET_B03_07':
      case 'ASSET_06':
      case 'ASSET_08':
      case 'ASSET_08B':
        return 'points';
      case 'ASSET_B03_10':
        return 'home';
      default:
        return 'home';
    }
  };

  const renderVisualPreview = (assetId: string) => {
    switch (assetId) {
      // --- BLOCO 03 PREVIEWS ---
      case 'ASSET_B03_01':
        return (
          <div className="w-full h-36 bg-[#FBF7EE] rounded-2xl border border-stone-200 flex flex-col items-center justify-center p-3 text-center">
            <span className="text-2xl">🍱</span>
            <span className="text-[10px] font-black text-emerald-800 uppercase mt-1 font-['Outfit']">
              Escolhas Melhores, Dias Incríveis
            </span>
            <span className="text-[9px] text-stone-500">
              14 Serviços & Experiência Inicial Lifestyle
            </span>
          </div>
        );

      case 'ASSET_B03_02':
        return (
          <div className="w-full h-36 bg-gradient-to-br from-stone-900 via-stone-950 to-[#0A1A10] rounded-2xl border border-emerald-500/30 flex items-center justify-center p-2">
            <OfficialMascot size="sm" mode="full" showSpeechBubble={false} />
          </div>
        );

      case 'ASSET_B03_02_FACE':
        return (
          <div className="w-full h-36 bg-gradient-to-br from-stone-900 via-stone-950 to-[#0A1A10] rounded-2xl border border-emerald-500/30 flex items-center justify-center p-2">
            <OfficialMascot size="sm" mode="face" showSpeechBubble={false} />
          </div>
        );

      case 'ASSET_B03_03':
        return (
          <div className="w-full h-36 bg-gradient-to-r from-stone-900 to-black rounded-2xl border border-purple-500/30 flex items-center justify-center p-3 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-[#0EB24A] bg-stone-800 flex items-center justify-center text-xl">
                📱
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-emerald-400">MerMi Member</span>
                <p className="text-xs font-bold font-['Outfit']">Quem escolhe evoluir, faz parte.</p>
                <span className="text-[10px] text-stone-400">1.250 pts · Nível 12</span>
              </div>
            </div>
          </div>
        );

      case 'ASSET_B03_04':
        return (
          <div className="w-full h-36 bg-gradient-to-r from-stone-950 via-[#1C0A0D] to-black rounded-2xl border border-rose-900/40 flex items-center justify-center p-3 text-white">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏃</span>
              <div>
                <span className="text-[9px] font-black uppercase text-rose-400">Lançamento</span>
                <p className="text-xs font-bold font-['Outfit']">Mais que marmitas, um estilo de vida.</p>
                <span className="text-[10px] text-stone-400">Circuito MerMi Run 5K & 10K</span>
              </div>
            </div>
          </div>
        );

      case 'ASSET_B03_05':
        return (
          <div className="w-full h-36 bg-[#F8FAFC] rounded-2xl border border-stone-200 flex items-center justify-around p-2 text-stone-900">
            <div className="text-center">
              <span className="text-xs font-black text-emerald-700 block">Econômico</span>
              <span className="text-[9px] text-stone-500">Marmitas 350g/500g</span>
            </div>
            <div className="w-px h-10 bg-stone-200" />
            <div className="text-center">
              <span className="text-xs font-black text-amber-700 block">Premium</span>
              <span className="text-[9px] text-stone-500">Proteínas nobres</span>
            </div>
            <div className="w-px h-10 bg-stone-200" />
            <div className="text-center">
              <span className="text-xs font-black text-purple-700 block">+ Nutricionista</span>
              <span className="text-[9px] text-stone-500">Acompanhamento</span>
            </div>
          </div>
        );

      case 'ASSET_B03_06':
        return (
          <div className="w-full h-36 bg-gradient-to-r from-[#211703] to-[#120D02] rounded-2xl border border-yellow-500/40 flex items-center justify-center p-3 text-white">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎁</span>
              <div>
                <span className="text-[9px] font-black uppercase text-amber-400">Recompensas</span>
                <p className="text-xs font-bold font-['Outfit']">Seu esforço tem recompensa!</p>
                <span className="text-[10px] text-stone-300">Bolsa Térmica (400p) · Copo (300p)</span>
              </div>
            </div>
          </div>
        );

      case 'ASSET_B03_07':
        return (
          <div className="w-full h-36 bg-[#0E1013] rounded-2xl border border-amber-500/40 flex items-center justify-center p-3 text-white">
            <div className="text-center">
              <span className="text-xs font-black text-amber-400 font-['Outfit'] block uppercase">
                MerMi Points: Você Pede, Você Ganha
              </span>
              <div className="flex items-center justify-center gap-3 mt-1.5 text-[11px] font-bold text-stone-300">
                <span>+10 Pedido</span>
                <span>•</span>
                <span>+25 Indicação</span>
                <span>•</span>
                <span>+50 Desafio</span>
              </div>
            </div>
          </div>
        );

      case 'ASSET_B03_08':
        return (
          <div className="w-full h-36 bg-[#FAF7F2] rounded-2xl border border-stone-200 flex flex-col items-center justify-center p-3 text-center">
            <span className="text-2xl">🥗</span>
            <span className="text-xs font-black text-stone-900 font-['Outfit'] mt-1">
              Alimente Sua Evolução
            </span>
            <span className="text-[10px] text-emerald-700 font-bold">
              Cardápio Fit · Fit Premium · Monte sua Marmita
            </span>
          </div>
        );

      case 'ASSET_B03_09':
        return (
          <div className="w-full h-36 bg-gradient-to-r from-orange-950 via-stone-900 to-stone-950 rounded-2xl border border-orange-900/40 flex items-center justify-center p-3 text-white text-center">
            <div>
              <span className="text-[9px] font-black text-orange-400 uppercase tracking-wider block">
                Manifesto MerMi Fit Life
              </span>
              <p className="text-xs font-black font-['Outfit'] mt-0.5">
                Mais que um app, um estilo de vida.
              </p>
              <span className="text-[9px] text-stone-400">
                Pequenas escolhas. Grandes resultados.
              </span>
            </div>
          </div>
        );

      case 'ASSET_B03_10':
        return (
          <div className="w-full h-36 bg-[#161B18] rounded-2xl border border-emerald-900/50 flex items-center justify-center p-3 text-white">
            <div className="text-center">
              <span className="text-[9px] font-black text-rose-400 uppercase tracking-wider block">
                O Problema & A Solução
              </span>
              <p className="text-xs font-bold text-stone-200 mt-0.5">
                "Você sabe que precisa se cuidar, mas nem sempre sabe por onde começar."
              </p>
              <span className="text-[10px] text-emerald-400 font-bold block mt-1">
                E se tudo estivesse em um só lugar?
              </span>
            </div>
          </div>
        );

      // --- ASSETS BLOCO 01 & 02 ---
      case 'ASSET_01':
        return (
          <div className="w-full h-36 bg-[#FAF6EC] rounded-2xl border border-stone-200 flex items-center justify-center p-2 relative overflow-hidden">
            <div className="flex flex-col items-center">
              <OfficialLogo size={64} showSubtitle={false} />
              <span className="text-[8px] font-bold text-stone-600 uppercase mt-1 tracking-wider">
                Splash Hero (1:1 locked)
              </span>
            </div>
          </div>
        );
      case 'ASSET_04':
        return (
          <div className="w-full h-36 bg-[#FAF6EC] rounded-2xl border border-stone-200 flex items-center justify-center p-2">
            <OfficialLogo size={90} showSubtitle={false} />
          </div>
        );
      case 'ASSET_05':
        return (
          <div className="w-full h-36 bg-[#FAF6EC] rounded-2xl border border-stone-200 flex items-center justify-center p-2">
            <OfficialLogo size={60} showSubtitle={false} />
          </div>
        );
      case 'ASSET_07':
        return (
          <div className="w-full h-36 bg-stone-950 rounded-2xl border border-stone-800 flex items-center justify-center p-3">
            <div className="w-full max-w-xs">
              <MermiHeader showSubtitle={false} />
            </div>
          </div>
        );
      case 'ASSET_08':
        return (
          <div className="w-full h-40 bg-[#0F1115] rounded-2xl border border-amber-500/30 flex items-center justify-center p-3 relative group">
            <OfficialPointsBadge size={110} variant="square" />
            <span className="absolute bottom-2 right-2 text-[9px] font-mono text-amber-400 bg-black/70 px-2 py-0.5 rounded border border-amber-500/20">
              1:1 Square (Oficial)
            </span>
          </div>
        );
      case 'ASSET_08B':
        return (
          <div className="w-full h-40 bg-[#0F1115] rounded-2xl border border-orange-500/30 flex items-center justify-center p-3 relative group">
            <OfficialPointsBadge size={86} variant="horizontal" />
            <span className="absolute bottom-2 right-2 text-[9px] font-mono text-orange-400 bg-black/70 px-2 py-0.5 rounded border border-orange-500/20">
              3:2 Horizontal (Oficial)
            </span>
          </div>
        );
      case 'ASSET_09':
        return (
          <div className="w-full h-36 bg-[#FCD34D] rounded-2xl border border-amber-400 flex flex-col items-center justify-center p-2 text-stone-950">
            <span className="text-xs font-black uppercase tracking-wider font-['Outfit']">Prêmios da Semana</span>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-base font-bold">🍱 100p</span>
              <span className="text-base font-bold">🥤 200p</span>
              <span className="text-base font-bold">🎒 400p</span>
            </div>
          </div>
        );
      case 'ASSET_10':
        return (
          <div className="w-full h-36 bg-[#1F080B] rounded-2xl border border-rose-900/60 flex items-center justify-center p-2 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-amber-400 p-0.5 bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center text-xl">
                👑
              </div>
              <div>
                <span className="text-[9px] font-bold text-amber-400 uppercase">Membro da Semana</span>
                <p className="text-xs font-black font-['Outfit']">@joaosilva.fit</p>
                <span className="text-[10px] text-stone-400">86 Points · 7 Pedidos</span>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full h-36 bg-stone-100 rounded-2xl flex items-center justify-center text-xs text-stone-400">
            Preview do Asset
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF7EE] text-stone-900 pb-28 pt-4 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1 font-['Outfit']">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  SISTEMA CENTRAL DE ASSETS OFICIAIS
                </span>
                <span className="text-[10px] font-bold text-stone-500 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-stone-400" />
                  Bloco 01, 02 & 03
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-stone-900 font-['Outfit'] mt-1.5">
                Asset Registry Oficial ({OFFICIAL_ASSET_REGISTRY.length} Assets Mapeados)
              </h1>
              <p className="text-xs text-stone-600 mt-1 max-w-xl">
                Catálogo técnico imutável de todas as referências visuais oficiais dos Blocos 01, 02 e 03 do MERMI FIT LIFE com proporção estrita preservada.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 font-['Outfit']">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                100% Homologado
              </span>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="mt-5 pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome, ID ou arquivo original..."
                className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0EB24A]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase transition-all shrink-0 font-['Outfit'] ${
                    selectedCategory === cat
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION: PASTA DE ASSETS OFICIAIS DO PROPRIETÁRIO (/public/assets) */}
        <div className="rounded-3xl bg-gradient-to-b from-stone-900 via-stone-950 to-black border-2 border-[#0EB24A]/40 p-5 sm:p-6 shadow-2xl text-white space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0EB24A]/20 border border-[#0EB24A]/40 text-[#0EB24A] flex items-center justify-center shrink-0">
                <FolderOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-white font-['Outfit']">
                    Pasta Oficial de Assets (/public/assets)
                  </h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Oficial & Imutável
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  Arquivos autênticos do proprietário preservados em alta resolução 4K. Zero distorção, zero corte e sem criações artificiais.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3 py-1 rounded-xl bg-stone-800 border border-stone-700 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Arquivos Homologados
              </span>
            </div>
          </div>

          {/* Grid de Arquivos Principais da Pasta de Assets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Asset File 1: Logo 3D 1:1 Quadrado */}
            <div className="bg-stone-950/90 rounded-2xl border border-stone-800 p-4 flex flex-col justify-between hover:border-amber-500/40 transition-colors">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono text-[10px] font-bold text-amber-400 px-2 py-0.5 rounded bg-stone-900 border border-amber-500/20">
                    ASSET_08 (1:1)
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Proporção 1:1
                  </span>
                </div>

                <div className="my-2 w-full h-32 bg-[#0c0d10] rounded-xl border border-stone-800/80 flex items-center justify-center p-3 relative">
                  <img
                    src="/assets/mermi-points/mermi-points-square.png"
                    alt="Logo Oficial MERMI POINTS Quadrado"
                    className="max-h-full max-w-full object-contain object-center drop-shadow-md"
                    style={{ aspectRatio: '1 / 1', objectFit: 'contain' }}
                  />
                  <span className="absolute bottom-1.5 right-2 text-[9px] font-mono text-stone-400 bg-black/70 px-1.5 py-0.5 rounded border border-stone-800">
                    object-fit: contain
                  </span>
                </div>

                <h4 className="font-extrabold text-xs text-white">
                  Logo Oficial 3D — Formato Quadrado
                </h4>
                <p className="text-[10px] text-stone-400 mt-0.5">
                  Letras 3D "MERMI" em bloco branco com profundidade vermelho escuro e "POINTS" em pincelada amarela/laranja.
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-stone-800/80 flex items-center justify-between text-[10px]">
                <code className="text-stone-400 font-mono truncate max-w-[150px]" title="/public/assets/mermi-points/mermi-points-square.png">
                  /public/assets/mermi-points/mermi-points-square.png
                </code>
                <button
                  onClick={() => copyPath('/public/assets/mermi-points/mermi-points-square.png', 'sq')}
                  className="flex items-center gap-1 font-bold text-amber-400 hover:text-amber-300 cursor-pointer bg-stone-900 px-2 py-1 rounded border border-stone-800"
                >
                  {copiedFile === 'sq' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Asset File 2: Logo 3D 3:2 Horizontal */}
            <div className="bg-stone-950/90 rounded-2xl border border-stone-800 p-4 flex flex-col justify-between hover:border-orange-500/40 transition-colors">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono text-[10px] font-bold text-orange-400 px-2 py-0.5 rounded bg-stone-900 border border-orange-500/20">
                    ASSET_08B (3:2)
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Proporção 3:2
                  </span>
                </div>

                <div className="my-2 w-full h-32 bg-[#0c0d10] rounded-xl border border-stone-800/80 flex items-center justify-center p-3 relative">
                  <img
                    src="/assets/mermi-points/mermi-points-horizontal.png"
                    alt="Logo Oficial MERMI POINTS Horizontal"
                    className="max-h-full max-w-full object-contain object-center drop-shadow-md"
                    style={{ aspectRatio: '3 / 2', objectFit: 'contain' }}
                  />
                  <span className="absolute bottom-1.5 right-2 text-[9px] font-mono text-stone-400 bg-black/70 px-1.5 py-0.5 rounded border border-stone-800">
                    object-fit: contain
                  </span>
                </div>

                <h4 className="font-extrabold text-xs text-white">
                  Logo Oficial 3D — Formato Horizontal
                </h4>
                <p className="text-[10px] text-stone-400 mt-0.5">
                  Versão panorâmica 3D para cabeçalhos, banners de campanhas e telas de recompensas.
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-stone-800/80 flex items-center justify-between text-[10px]">
                <code className="text-stone-400 font-mono truncate max-w-[150px]" title="/public/assets/mermi-points/mermi-points-horizontal.png">
                  /public/assets/mermi-points/mermi-points-horizontal.png
                </code>
                <button
                  onClick={() => copyPath('/public/assets/mermi-points/mermi-points-horizontal.png', 'hz')}
                  className="flex items-center gap-1 font-bold text-orange-400 hover:text-orange-300 cursor-pointer bg-stone-900 px-2 py-1 rounded border border-stone-800"
                >
                  {copiedFile === 'hz' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Asset File 3: Logo Marca Oficial 4K MerMi Fit Life */}
            <div className="bg-stone-950/90 rounded-2xl border border-stone-800 p-4 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-stone-900 border border-emerald-500/20">
                    ASSET_05 (1:1)
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Proporção 1:1
                  </span>
                </div>

                <div className="my-2 w-full h-32 bg-[#FAF6EC] rounded-xl border border-stone-300 flex items-center justify-center p-3 relative">
                  <img
                    src="/assets/brand/mermi-logo.png"
                    alt="Logo Oficial MerMi Fit Life 4K"
                    className="max-h-full max-w-full object-contain object-center drop-shadow-md"
                    style={{ aspectRatio: '1 / 1', objectFit: 'contain' }}
                  />
                  <span className="absolute bottom-1.5 right-2 text-[9px] font-mono text-stone-700 bg-white/80 px-1.5 py-0.5 rounded border border-stone-300">
                    1024 × 1024 px
                  </span>
                </div>

                <h4 className="font-extrabold text-xs text-white">
                  Logo Oficial Marca & IA MerMi (4K)
                </h4>
                <p className="text-[10px] text-stone-400 mt-0.5">
                  Identidade visual autêntica sem distorção para topo, carrossel de destaques e MerMi IA.
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-stone-800/80 flex items-center justify-between text-[10px]">
                <code className="text-stone-400 font-mono truncate max-w-[150px]" title="/public/assets/brand/mermi-logo.png">
                  /public/assets/brand/mermi-logo.png
                </code>
                <button
                  onClick={() => copyPath('/public/assets/brand/mermi-logo.png', 'brand')}
                  className="flex items-center gap-1 font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer bg-stone-900 px-2 py-1 rounded border border-stone-800"
                >
                  {copiedFile === 'brand' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Asset File 4: Logo Horizontal com Transparência */}
            <div className="bg-stone-950/90 rounded-2xl border border-stone-800 p-4 flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono text-[10px] font-bold text-cyan-400 px-2 py-0.5 rounded bg-stone-900 border border-cyan-500/20">
                    TRANSPARENTE
                  </span>
                  <span className="text-[10px] font-semibold text-cyan-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    PNG Alfa
                  </span>
                </div>

                <div className="my-2 w-full h-32 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:8px_8px] bg-stone-900 rounded-xl border border-stone-800/80 flex items-center justify-center p-3 relative">
                  <img
                    src="/assets/mermi-points/mermi-points-horizontal-trans.png"
                    alt="Logo Oficial MERMI POINTS Transparente"
                    className="max-h-full max-w-full object-contain object-center drop-shadow-md"
                    style={{ objectFit: 'contain' }}
                  />
                  <span className="absolute bottom-1.5 right-2 text-[9px] font-mono text-cyan-400 bg-black/70 px-1.5 py-0.5 rounded border border-cyan-500/30">
                    Fundo Transparente
                  </span>
                </div>

                <h4 className="font-extrabold text-xs text-white">
                  MerMi Points 3D — Transparência Alfa
                </h4>
                <p className="text-[10px] text-stone-400 mt-0.5">
                  Versão transparente para sobreposição perfeita em cards coloridos e fotos reais.
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-stone-800/80 flex items-center justify-between text-[10px]">
                <code className="text-stone-400 font-mono truncate max-w-[150px]" title="/public/assets/mermi-points/mermi-points-horizontal-trans.png">
                  /public/assets/mermi-points/mermi-points-horizontal-trans.png
                </code>
                <button
                  onClick={() => copyPath('/public/assets/mermi-points/mermi-points-horizontal-trans.png', 'trans')}
                  className="flex items-center gap-1 font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer bg-stone-900 px-2 py-1 rounded border border-stone-800"
                >
                  {copiedFile === 'trans' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Asset File 5: Mascote Oficial MerMi IA 4K (Sem fundo) */}
            <div className="bg-stone-950/90 rounded-2xl border border-stone-800 p-4 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-stone-900 border border-emerald-500/20">
                    ASSET_B03_02 (3:4)
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Transparente 4K
                  </span>
                </div>

                <div className="my-2 w-full h-36 bg-gradient-to-br from-stone-900 to-black rounded-xl border border-stone-800/80 flex items-center justify-center p-2 relative overflow-hidden">
                  <img
                    src="/assets/brand/mermi-ai-official.png"
                    alt="Mascote Oficial MerMi IA 4K"
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain object-center drop-shadow-lg"
                    style={{ aspectRatio: '3 / 4', objectFit: 'contain' }}
                  />
                  <span className="absolute bottom-1.5 right-2 text-[9px] font-mono text-emerald-400 bg-black/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    Sem Fundo
                  </span>
                </div>

                <h4 className="font-extrabold text-xs text-white">
                  Mascote Oficial MerMi IA (Corpo Inteiro)
                </h4>
                <p className="text-[10px] text-stone-400 mt-0.5">
                  Robô 3D estilizado com fundo transparente recortado, visor preto, olhos/sorriso neon verde e logo MerMi.
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-stone-800/80 flex items-center justify-between text-[10px]">
                <code className="text-stone-400 font-mono truncate max-w-[150px]" title="/public/assets/brand/mermi-ai-official.png">
                  /public/assets/brand/mermi-ai-official.png
                </code>
                <button
                  onClick={() => copyPath('/public/assets/brand/mermi-ai-official.png', 'ia')}
                  className="flex items-center gap-1 font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer bg-stone-900 px-2 py-1 rounded border border-stone-800"
                >
                  {copiedFile === 'ia' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Asset File 6: Rosto Oficial MerMi IA 1:1 (Página Principal) */}
            <div className="bg-stone-950/90 rounded-2xl border border-stone-800 p-4 flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-stone-900 border border-emerald-500/20">
                    ASSET_B03_02_FACE (1:1)
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Home & Chat
                  </span>
                </div>

                <div className="my-2 w-full h-36 bg-gradient-to-br from-stone-900 to-black rounded-xl border border-stone-800/80 flex items-center justify-center p-2 relative overflow-hidden">
                  <img
                    src="/assets/brand/mermi-ai-face.png"
                    alt="Rosto Oficial MerMi IA 1:1"
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain object-center drop-shadow-lg"
                    style={{ aspectRatio: '1 / 1', objectFit: 'contain' }}
                  />
                  <span className="absolute bottom-1.5 right-2 text-[9px] font-mono text-emerald-400 bg-black/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    Rosto 1:1
                  </span>
                </div>

                <h4 className="font-extrabold text-xs text-white">
                  Rosto Oficial MerMi IA (Home & Chat)
                </h4>
                <p className="text-[10px] text-stone-400 mt-0.5">
                  Rosto em close-up 1:1 do mesmo robô oficial com fundo transparente para o bloco da IA na Página Principal.
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-stone-800/80 flex items-center justify-between text-[10px]">
                <code className="text-stone-400 font-mono truncate max-w-[150px]" title="/public/assets/brand/mermi-ai-face.png">
                  /public/assets/brand/mermi-ai-face.png
                </code>
                <button
                  onClick={() => copyPath('/public/assets/brand/mermi-ai-face.png', 'ia_face')}
                  className="flex items-center gap-1 font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer bg-stone-900 px-2 py-1 rounded border border-stone-800"
                >
                  {copiedFile === 'ia_face' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Asset Explorer Guide: Diretórios do Projeto */}
            <div className="bg-stone-950/90 rounded-2xl border border-stone-800 p-4 flex flex-col justify-between hover:border-stone-700 transition-colors">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-stone-300 font-bold mb-2">
                  <Folder className="w-4 h-4 text-amber-400" />
                  <span>Estrutura no Disco (/public/assets)</span>
                </div>
                <div className="bg-stone-900 rounded-xl p-2.5 border border-stone-800 font-mono text-[11px] space-y-1.5 text-stone-300">
                  <div className="text-amber-400 font-bold">📁 /public/assets/</div>
                  <div className="pl-3 text-emerald-400">├── 📁 brand/</div>
                  <div className="pl-6 text-stone-400">├── mermi-logo.png</div>
                  <div className="pl-6 text-stone-400">├── mermi-ai-official.png</div>
                  <div className="pl-6 text-stone-400">└── mermi-ai-face.png</div>
                  <div className="pl-3 text-amber-400">└── 📁 mermi-points/</div>
                  <div className="pl-6 text-stone-400">├── mermi-points-square.png</div>
                  <div className="pl-6 text-stone-400">├── mermi-points-horizontal.png</div>
                  <div className="pl-6 text-stone-400">└── *-trans.png</div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-stone-800/80 flex items-center justify-between text-[10px] text-stone-400">
                <span>Total: 8 Arquivos Oficiais</span>
                <span className="text-[#0EB24A] font-bold">Servidos em /assets/*</span>
              </div>
            </div>

          </div>
        </div>

        {/* Asset Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAssets.map((asset) => {
            const targetTab = getTargetTab(asset.asset_id);
            return (
              <div
                key={asset.asset_id}
                className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: ID and Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase bg-stone-100 text-stone-800 border border-stone-200">
                      {asset.asset_id}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      {asset.status} v{asset.versao}
                    </span>
                  </div>

                  {/* Visual Preview */}
                  <div className="mb-4">
                    {renderVisualPreview(asset.asset_id)}
                  </div>

                  {/* Asset Metadata */}
                  <h3 className="text-sm sm:text-base font-extrabold text-stone-900 font-['Outfit'] leading-snug">
                    {asset.nome}
                  </h3>

                  <div className="mt-2 space-y-1.5 text-xs text-stone-600">
                    <p className="flex items-start gap-1.5">
                      <span className="font-bold text-stone-400 shrink-0">Arquivo:</span>
                      <span className="font-mono text-[11px] text-stone-700 break-all select-all">
                        {asset.arquivo_original}
                      </span>
                    </p>
                    <p className="flex items-start gap-1.5">
                      <span className="font-bold text-stone-400 shrink-0">Categoria:</span>
                      <span className="font-semibold text-stone-800">
                        {asset.categoria}
                      </span>
                    </p>
                    {asset.subcategoria && (
                      <p className="flex items-start gap-1.5">
                        <span className="font-bold text-stone-400 shrink-0">Subcategoria:</span>
                        <span className="text-stone-700">{asset.subcategoria}</span>
                      </p>
                    )}
                    <p className="flex items-start gap-1.5">
                      <span className="font-bold text-stone-400 shrink-0">Página:</span>
                      <span className="text-stone-700">{asset.pagina}</span>
                    </p>
                    <p className="flex items-start gap-1.5">
                      <span className="font-bold text-stone-400 shrink-0">Finalidade:</span>
                      <span className="text-stone-700">{asset.finalidade}</span>
                    </p>
                    {asset.caminho_real && (
                      <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-stone-100">
                        <span className="font-bold text-stone-400 shrink-0">Caminho:</span>
                        <div className="flex items-center gap-1 min-w-0">
                          <code className="font-mono text-[10px] text-stone-500 truncate max-w-[150px]" title={asset.caminho_real}>
                            {asset.caminho_real}
                          </code>
                          <button
                            onClick={() => copyPath(asset.caminho_real!, asset.asset_id)}
                            className="p-1 rounded hover:bg-stone-100 text-stone-400 hover:text-stone-700 cursor-pointer"
                            title="Copiar caminho"
                          >
                            {copiedFile === asset.asset_id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[10px] text-stone-400 font-medium">
                    Componente: {asset.componente}
                  </span>
                  <button
                    onClick={() => onNavigateToComponent(targetTab)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-[#0EB24A] text-white text-xs font-bold transition-all shadow-xs cursor-pointer font-['Outfit']"
                  >
                    <span>Abrir Módulo</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAssets.length === 0 && (
          <div className="p-12 text-center bg-white rounded-3xl border border-stone-200">
            <ImageIcon className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-stone-700">Nenhum asset encontrado para os filtros selecionados.</p>
            <p className="text-xs text-stone-400 mt-1">Tente buscar por outro termo ou selecione a categoria 'todos'.</p>
          </div>
        )}

      </div>
    </div>
  );
};
