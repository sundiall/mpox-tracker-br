import { useState } from 'react';
import type { FC } from 'react';
import type { StateEpidemiology } from '../data/epidemiology';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Search, 
  Eye, 
  Layers
} from 'lucide-react';

interface SortableStateTableProps {
  states: StateEpidemiology[];
  onOpenStateInspector: (state: StateEpidemiology) => void;
}

type SortKey = 'nome' | 'casosConfirmados' | 'casosProvaveis' | 'obitos' | 'taxaLetalidade' | 'dosesAplicadas';

export const SortableStateTable: FC<SortableStateTableProps> = ({
  states,
  onOpenStateInspector
}) => {
  const [sortKey, setSortKey] = useState<SortKey>('casosConfirmados');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('todas');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8; // Max 8 items per page to keep page compact and navigable

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const filteredStates = states
    .filter((s) => {
      const matchesSearch = 
        s.nome.toLowerCase().includes(search.toLowerCase()) || 
        s.uf.toLowerCase().includes(search.toLowerCase());
      const matchesRegion = selectedRegion === 'todas' || s.regiao === selectedRegion;
      return matchesSearch && matchesRegion;
    })
    .sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];
      if (typeof valA === 'string') {
        return sortOrder === 'asc' 
          ? (valA as string).localeCompare(valB as string) 
          : (valB as string).localeCompare(valA as string);
      }
      return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });

  const totalPages = Math.ceil(filteredStates.length / pageSize);
  const paginatedStates = filteredStates.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) return <ArrowUpDown className="w-3 h-3 text-slate-500" aria-hidden="true" />;
    return sortOrder === 'asc' 
      ? <ArrowUp className="w-3 h-3 text-cyan-400" aria-hidden="true" />
      : <ArrowDown className="w-3 h-3 text-cyan-400" aria-hidden="true" />;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
      {/* Controles de Navegação da Tabela */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <h3 id="table-caption" className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Dados Epidemiológicos por Estado (Tabela Navegável)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Clique nas colunas para ordenar. Clique em "Ver Detalhes" para abrir o painel individual da UF.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          {/* Busca Rápida */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Buscar UF ou estado..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-full sm:w-44"
            />
          </div>

          {/* Filtro de Região */}
          <select
            value={selectedRegion}
            onChange={(e) => { setSelectedRegion(e.target.value); setCurrentPage(1); }}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="todas">Todas as Regiões</option>
            <option value="Sudeste">Sudeste</option>
            <option value="Nordeste">Nordeste</option>
            <option value="Sul">Sul</option>
            <option value="Centro-Oeste">Centro-Oeste</option>
            <option value="Norte">Norte</option>
          </select>
        </div>
      </div>

      {/* Tabela com Padrões Semânticos do Google Modern Web Guidance */}
      <div 
        tabIndex={0} 
        role="region" 
        aria-labelledby="table-caption"
        className="overflow-x-auto border border-slate-800 rounded-lg bg-slate-950/40"
      >
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-950 text-slate-300 font-semibold border-b border-slate-800 select-none">
            <tr>
              <th scope="col" aria-sort={sortKey === 'nome' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : undefined} className="py-2.5 px-3">
                <button
                  type="button"
                  onClick={() => handleSort('nome')}
                  className="flex items-center gap-1.5 w-full text-left hover:text-white focus:outline-none focus-visible:underline"
                >
                  <span>Estado (UF)</span>
                  {getSortIcon('nome')}
                </button>
              </th>

              <th scope="col" className="py-2.5 px-3">
                <span>Região</span>
              </th>

              <th scope="col" aria-sort={sortKey === 'casosConfirmados' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : undefined} className="py-2.5 px-3 text-right">
                <button
                  type="button"
                  onClick={() => handleSort('casosConfirmados')}
                  className="flex items-center justify-end gap-1.5 w-full hover:text-white focus:outline-none focus-visible:underline"
                >
                  <span>Confirmados</span>
                  {getSortIcon('casosConfirmados')}
                </button>
              </th>

              <th scope="col" aria-sort={sortKey === 'casosProvaveis' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : undefined} className="py-2.5 px-3 text-right hidden sm:table-cell">
                <button
                  type="button"
                  onClick={() => handleSort('casosProvaveis')}
                  className="flex items-center justify-end gap-1.5 w-full hover:text-white focus:outline-none focus-visible:underline"
                >
                  <span>Prováveis</span>
                  {getSortIcon('casosProvaveis')}
                </button>
              </th>

              <th scope="col" aria-sort={sortKey === 'obitos' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : undefined} className="py-2.5 px-3 text-right">
                <button
                  type="button"
                  onClick={() => handleSort('obitos')}
                  className="flex items-center justify-end gap-1.5 w-full hover:text-white focus:outline-none focus-visible:underline"
                >
                  <span>Óbitos</span>
                  {getSortIcon('obitos')}
                </button>
              </th>

              <th scope="col" aria-sort={sortKey === 'taxaLetalidade' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : undefined} className="py-2.5 px-3 text-right hidden md:table-cell">
                <button
                  type="button"
                  onClick={() => handleSort('taxaLetalidade')}
                  className="flex items-center justify-end gap-1.5 w-full hover:text-white focus:outline-none focus-visible:underline"
                >
                  <span>Letalidade</span>
                  {getSortIcon('taxaLetalidade')}
                </button>
              </th>

              <th scope="col" aria-sort={sortKey === 'dosesAplicadas' ? (sortOrder === 'asc' ? 'ascending' : 'descending') : undefined} className="py-2.5 px-3 text-right hidden sm:table-cell">
                <button
                  type="button"
                  onClick={() => handleSort('dosesAplicadas')}
                  className="flex items-center justify-end gap-1.5 w-full hover:text-white focus:outline-none focus-visible:underline"
                >
                  <span>Doses Aplicadas</span>
                  {getSortIcon('dosesAplicadas')}
                </button>
              </th>

              <th scope="col" className="py-2.5 px-3 text-center">
                <span>Inspeção</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60">
            {paginatedStates.map((state) => (
              <tr key={state.uf} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-2.5 px-3 font-medium text-white flex items-center gap-2">
                  <span className="w-6 text-center py-0.5 rounded bg-slate-800 text-[10px] text-cyan-300 font-mono font-bold">
                    {state.uf}
                  </span>
                  <span>{state.nome}</span>
                </td>

                <td className="py-2.5 px-3 text-slate-400">
                  {state.regiao}
                </td>

                <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-100">
                  {state.casosConfirmados.toLocaleString('pt-BR')}
                </td>

                <td className="py-2.5 px-3 text-right font-mono text-slate-400 hidden sm:table-cell">
                  {state.casosProvaveis.toLocaleString('pt-BR')}
                </td>

                <td className="py-2.5 px-3 text-right font-mono text-rose-300 font-medium">
                  {state.obitos}
                </td>

                <td className="py-2.5 px-3 text-right font-mono text-slate-400 hidden md:table-cell">
                  {state.taxaLetalidade.toFixed(2)}%
                </td>

                <td className="py-2.5 px-3 text-right font-mono text-emerald-400 font-medium hidden sm:table-cell">
                  {state.dosesAplicadas.toLocaleString('pt-BR')}
                </td>

                <td className="py-2.5 px-3 text-center">
                  <button
                    onClick={() => onOpenStateInspector(state)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-medium transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    <span className="hidden sm:inline">Detalhes</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação Compacta */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
        <span>
          Mostrando {((currentPage - 1) * pageSize) + 1} a {Math.min(currentPage * pageSize, filteredStates.length)} de {filteredStates.length} estados
        </span>

        <div className="flex items-center gap-1">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-2.5 py-1 rounded border border-slate-800 disabled:opacity-40 hover:bg-slate-800 text-slate-200 transition-colors"
          >
            Anterior
          </button>
          <span className="px-2 font-mono text-slate-300">
            {currentPage} / {totalPages || 1}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-2.5 py-1 rounded border border-slate-800 disabled:opacity-40 hover:bg-slate-800 text-slate-200 transition-colors"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
};
