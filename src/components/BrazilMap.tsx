import type { FC } from 'react';
import type { StateEpidemiology } from '../data/epidemiology';

interface BrazilMapProps {
  states: StateEpidemiology[];
  selectedUF: string | null;
  onSelectUF: (uf: string | null) => void;
}

export const BrazilMap: FC<BrazilMapProps> = ({ states, selectedUF, onSelectUF }) => {
  const regions = [
    { nome: 'Sudeste', ufs: ['SP', 'RJ', 'MG', 'ES'] },
    { nome: 'Sul', ufs: ['PR', 'RS', 'SC'] },
    { nome: 'Nordeste', ufs: ['BA', 'CE', 'PE', 'RN', 'PB', 'MA', 'AL', 'SE', 'PI'] },
    { nome: 'Centro-Oeste', ufs: ['DF', 'GO', 'MT', 'MS'] },
    { nome: 'Norte', ufs: ['PA', 'AM', 'TO', 'RO', 'AP', 'AC', 'RR'] }
  ];

  const getStateColor = (casos: number, isSelected: boolean) => {
    if (isSelected) return 'bg-cyan-500 text-white ring-2 ring-cyan-300 ring-offset-2 ring-offset-slate-950 font-bold';
    if (casos > 2000) return 'bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30';
    if (casos > 400) return 'bg-amber-500/20 border-amber-500/50 text-amber-300 hover:bg-amber-500/30';
    if (casos > 100) return 'bg-blue-500/20 border-blue-500/50 text-blue-300 hover:bg-blue-500/30';
    return 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25';
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            Distribuição Territorial por Unidade Federativa (UF)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Clique em qualquer estado para filtrar casos, marcos de vacinação e postos de referência.
          </p>
        </div>

        {selectedUF && (
          <button
            onClick={() => onSelectUF(null)}
            className="text-xs px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            Limpar filtro (Ver Brasil)
          </button>
        )}
      </div>

      {/* Legenda de Casos */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mb-5 p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/80">
        <span className="font-medium text-slate-300">Incidência Acumulada:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-red-500/30 border border-red-500/60"></span>
          <span>&gt; 2.000 casos (Alta)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-500/30 border border-amber-500/60"></span>
          <span>400 - 2.000 casos (Moderada)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-blue-500/30 border border-blue-500/60"></span>
          <span>100 - 400 casos</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/60"></span>
          <span>&lt; 100 casos (Baixa)</span>
        </div>
      </div>

      {/* Seletor Visual por Regiões */}
      <div className="space-y-4">
        {regions.map((reg) => (
          <div key={reg.nome} className="bg-slate-950/40 rounded-xl p-3 border border-slate-800/60">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Região {reg.nome}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2">
              {reg.ufs.map((ufCode) => {
                const state = states.find((s) => s.uf === ufCode);
                if (!state) return null;
                const isSelected = selectedUF === state.uf;

                return (
                  <button
                    key={state.uf}
                    onClick={() => onSelectUF(isSelected ? null : state.uf)}
                    className={`flex flex-col text-left p-2.5 rounded-lg border transition-all text-xs ${getStateColor(
                      state.casosConfirmados,
                      isSelected
                    )}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold text-sm">{state.uf}</span>
                      <span className="text-[10px] opacity-80">{state.casosConfirmados} casos</span>
                    </div>
                    <span className="truncate text-[11px] opacity-90 mt-0.5">{state.nome}</span>
                    <div className="mt-1 flex items-center justify-between text-[10px] opacity-75">
                      <span>{state.obitos} óbito{state.obitos !== 1 ? 's' : ''}</span>
                      <span>{state.dosesAplicadas} vac.</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
