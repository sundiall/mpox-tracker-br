import type { FC } from 'react';
import { 
  Activity, 
  Syringe, 
  HelpCircle, 
  Building2, 
  Rss, 
  Shield, 
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
    { id: 'painel', label: 'Painel Geral', icon: Activity },
    { id: 'vacinas', label: 'Marcos & Vacinas', icon: Syringe },
    { id: 'guia', label: 'Guia Clínico & FAQ', icon: HelpCircle },
    { id: 'postos', label: 'Onde se Vacinar', icon: Building2 },
    { id: 'alertas', label: 'Alertas & Notícias', icon: Rss }
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Logo e Título */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-950/50">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-none">
                    MPOX BRASIL
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                    Dados Abertos
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Painel Independente de Ciência de Dados & Saúde Pública
                </p>
              </div>
            </div>

            {/* Quick UF Filter no mobile */}
            <div className="md:hidden">
              <select
                value={selectedUF || 'todos'}
                onChange={(e) => onSelectUF(e.target.value === 'todos' ? null : e.target.value)}
                className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
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
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Monitoramento Ativo</span>
            </div>

            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-400" />
              <select
                value={selectedUF || 'todos'}
                onChange={(e) => onSelectUF(e.target.value === 'todos' ? null : e.target.value)}
                className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500 font-medium"
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

        {/* Abas de Navegação */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto pt-3 border-t border-slate-800/80 mt-2 text-xs no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-1.5 py-2 px-3 sm:px-4 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
