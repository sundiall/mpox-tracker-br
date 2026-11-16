import type { FC } from 'react';
import { 
  Activity, 
  Syringe, 
  HelpCircle, 
  Building2, 
  Rss, 
  ShieldCheck, 
  Globe 
} from 'lucide-react';
import type { StateEpidemiology } from '../data/epidemiology';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  states: StateEpidemiology[];
  selectedUF: string | null;
  onSelectUF: (uf: string | null) => void;
}

export const Navbar: FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  states,
  selectedUF,
  onSelectUF
}) => {
  const tabs = [
    { id: 'painel', label: 'Painel Geral & Séries', icon: Activity },
    { id: 'vacinas', label: 'Marcos & Vacinas', icon: Syringe },
    { id: 'postos', label: 'Onde se Vacinar (Rede SUS)', icon: Building2 },
    { id: 'guia', label: 'Guia Clínico & FAQ', icon: HelpCircle },
    { id: 'alertas', label: 'Alertas & Notícias', icon: Rss }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Logo e Título */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-900/60 border border-cyan-700/80 flex items-center justify-center text-cyan-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-white tracking-tight leading-none">
                    MPOX BRASIL
                  </h1>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-cyan-300 border border-slate-700">
                    Open Science
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Vigilância Epidemiológica, Séries Temporais & Acesso no SUS
                </p>
              </div>
            </div>

            {/* Quick UF Filter no mobile */}
            <div className="md:hidden">
              <select
                value={selectedUF || 'todos'}
                onChange={(e) => onSelectUF(e.target.value === 'todos' ? null : e.target.value)}
                className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-md px-2 py-1 focus:outline-none"
              >
                <option value="todos">Brasil (Todos)</option>
                {states.map((s) => (
                  <option key={s.uf} value={s.uf}>
                    {s.uf}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filtro UF Desktop e Status */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="font-mono text-[11px]">Sinan / DATASUS Ativo</span>
            </div>

            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-400" />
              <select
                value={selectedUF || 'todos'}
                onChange={(e) => onSelectUF(e.target.value === 'todos' ? null : e.target.value)}
                className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 font-medium"
              >
                <option value="todos">🇧🇷 Brasil Inteiro (Nacional)</option>
                {states.map((s) => (
                  <option key={s.uf} value={s.uf}>
                    {s.nome} ({s.uf})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Abas com Padrões Semânticos de Acessibilidade (Modern Web Guidance) */}
        <nav 
          role="tablist" 
          aria-label="Navegação das Seções do Portal"
          className="flex items-center gap-1 overflow-x-auto pt-3 border-t border-slate-800/80 mt-2 text-xs scroll-smooth no-scrollbar"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
