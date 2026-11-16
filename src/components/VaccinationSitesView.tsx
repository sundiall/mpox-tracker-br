import { useState } from 'react';
import type { FC } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  Search, 
  Filter, 
  CalendarCheck
} from 'lucide-react';
import { vaccinationSites } from '../data/vaccination_sites';

interface VaccinationSitesViewProps {
  selectedUF: string | null;
  onSelectUF: (uf: string | null) => void;
}

export const VaccinationSitesView: FC<VaccinationSitesViewProps> = ({
  selectedUF,
  onSelectUF
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tipoFilter, setTipoFilter] = useState('todos');

  const filteredSites = vaccinationSites.filter((site) => {
    const matchesUF = !selectedUF || site.uf === selectedUF;
    const matchesTipo = tipoFilter === 'todos' || site.tipo === tipoFilter;
    const matchesSearch =
      site.nomeUnidade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.municipio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.bairro.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.endereco.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesUF && matchesTipo && matchesSearch;
  });

  const uniqueUFs = Array.from(new Set(vaccinationSites.map((s) => s.uf))).sort();

  return (
    <div className="space-y-6">
      {/* Banner de Orientação */}
      <div className="bg-gradient-to-r from-teal-950/40 via-slate-900 to-emerald-950/40 border border-teal-800/30 rounded-2xl p-5 backdrop-blur-md">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              Rede de Atenção Especializada no SUS
            </span>
            <span className="text-xs text-slate-400">Guia de Postos & Centros de Referência</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Onde se Vacinar e Testar para Mpox no Brasil
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Consulte os Centros de Testagem e Aconselhamento (CTA), Serviços de Atenção Especializada (SAE)
            e hospitais de referência com imunizantes disponíveis para os grupos prioritários do Programa Nacional de Imunizações (PNI).
          </p>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-md space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Busca por texto */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar por unidade, cidade, bairro ou endereço..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          {/* Filtro por UF */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 shrink-0">Filtrar Estado:</span>
            <select
              value={selectedUF || 'todos'}
              onChange={(e) => onSelectUF(e.target.value === 'todos' ? null : e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            >
              <option value="todos">Todos os Estados</option>
              {uniqueUFs.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filtro por Tipo de Unidade */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs pt-2 border-t border-slate-800/60">
          <span className="text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Tipo:
          </span>
          {[
            { id: 'todos', label: 'Todos os Serviços' },
            { id: 'CTA', label: 'Centros de Testagem (CTA)' },
            { id: 'SAE', label: 'Atenção Especializada (SAE)' },
            { id: 'Centro de Referencia', label: 'Centros de Referência' },
            { id: 'Hospital Universitario', label: 'Hospitais / Polos Universitários' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTipoFilter(t.id)}
              className={`px-2.5 py-1 rounded-lg border transition-colors ${
                tipoFilter === t.id
                  ? 'bg-teal-600 text-white border-teal-500 font-semibold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Unidades */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSites.map((site) => (
          <div
            key={site.id}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4.5 flex flex-col justify-between backdrop-blur-md hover:border-slate-700 transition-all text-xs space-y-3"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded font-mono font-bold bg-slate-800 text-teal-300 border border-slate-700 text-[11px]">
                  {site.uf} • {site.municipio}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-teal-500/15 text-teal-300 border border-teal-500/30">
                  {site.tipo}
                </span>
              </div>

              <h3 className="font-bold text-white text-sm leading-snug">
                {site.nomeUnidade}
              </h3>

              <div className="mt-3 space-y-2 text-slate-300">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                  <span>
                    {site.endereco} — <strong className="text-slate-200">{site.bairro}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <a href={`tel:${site.telefone.split('/')[0].replace(/\D/g, '')}`} className="text-cyan-400 hover:underline">
                    {site.telefone}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>{site.horarioFuncionamento}</span>
                </div>

                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span className="font-medium text-slate-200">Acesso: {site.agendamento}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80">
              <p className="text-[11px] text-slate-400 leading-relaxed italic">
                {site.observacoes}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredSites.length === 0 && (
        <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-2xl text-slate-400 text-xs">
          Nenhum posto encontrado com os filtros selecionados. Tente limpar os filtros ou selecionar outro estado.
        </div>
      )}
    </div>
  );
};
