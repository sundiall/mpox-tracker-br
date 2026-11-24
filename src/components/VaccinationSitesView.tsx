import { useState, useEffect } from 'react';
import type { FC } from 'react';
import {
  Building2,
  MapPin,
  Phone,
  Clock,
  Search,
  CalendarCheck,
  CheckCircle2,
  FileCheck2,
  Sparkles,
  AlertCircle,
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import { vaccinationSites } from '../data/vaccination_sites';
import type { VaccinationSite } from '../data/vaccination_sites';

const ALL_BRAZILIAN_UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const STATE_NAMES: Record<string, string> = {
  MG: 'Belo Horizonte / MG',
  RJ: 'Rio de Janeiro / RJ',
  SP: 'São Paulo / SP',
  CE: 'Ceará / CE',
  DF: 'Distrito Federal / DF',
  SC: 'Santa Catarina / SC',
  PR: 'Paraná / PR',
  RS: 'Rio Grande do Sul / RS',
  PE: 'Pernambuco / PE',
  RO: 'Rondônia / RO'
};

interface VaccinationSitesViewProps {
  selectedUF: string | null;
  onSelectUF: (uf: string | null) => void;
}

export const VaccinationSitesView: FC<VaccinationSitesViewProps> = ({
  selectedUF,
  onSelectUF
}) => {
  const [sites, setSites] = useState<VaccinationSite[]>(vaccinationSites);
  const [isLiveSynced, setIsLiveSynced] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegiao, setSelectedRegiao] = useState<string>('todas');
  const [selectedTipo, setSelectedTipo] = useState<string>('todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 36;

  useEffect(() => {
    fetch(`/data/vaccination_sites.json?t=${Date.now()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          setSites(data);
          setIsLiveSynced(true);
        }
      })
      .catch(() => {});
  }, []);

  const filteredSites = sites.filter((site) => {
    const matchesUF = !selectedUF || site.uf === selectedUF;
    const matchesRegiao = selectedRegiao === 'todas' || site.regiao === selectedRegiao;
    const matchesTipo = selectedTipo === 'todos' || site.tipo === selectedTipo;
    const matchesStatus =
      selectedStatus === 'todos' ||
      (selectedStatus === 'disponivel' && site.statusEstoque === 'disponivel') ||
      (selectedStatus === 'esgotado' && site.statusEstoque === 'esgotado');
    const matchesSearch =
      site.nomeUnidade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.municipio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.endereco.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.uf.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesUF && matchesRegiao && matchesTipo && matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredSites.length / pageSize);
  const paginatedSites = filteredSites.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      {/* Header Institucional */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            Rede de Referência SUS
          </span>
          <span className="text-xs text-slate-400">Total de {sites.length} Polos Cadastrados nas 27 UFs</span>
          {isLiveSynced && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              Sincronizado em Tempo Real
            </span>
          )}
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Diretório de Centros de Testagem, Atenção Especializada & Vacinação
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
          Consulte os Centros de Testagem e Aconselhamento (CTA), Serviços de Atenção Especializada (SAE),
          e Centros de Referência para Imunobiológicos Especiais (CRIE) em todo o território nacional.
        </p>
      </div>

      {/* Critérios de Acesso e Vacinação (Regras PNI) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Pessoas Vivendo com HIV
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Elegíveis com contagem de Linfócitos T-CD4 &lt; 200 céls/mm³ (dose padrão de 0,5 mL via subcutânea, 2 doses).
          </p>
        </div>

        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Usuários de PrEP
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Elegíveis para aplicação da dose fracionada de 0,1 mL via intradérmica (esquema com 2 doses com intervalo de 28 dias).
          </p>
        </div>

        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Contatos de Casos e Laboratório
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Profilaxia pós-exposição em até 4 a 14 dias após contato de risco ou profissionais de laboratórios NB-3.
          </p>
        </div>
      </div>

      {/* Controles de Filtros e Busca */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3.5">
        {/* Atalhos Rápidos de Estados Confirmados */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[11px] font-medium text-slate-400 mr-1 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            Polos por UF:
          </span>
          <button
            onClick={() => { onSelectUF(null); setCurrentPage(1); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              !selectedUF
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/70 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
            }`}
          >
            Todos ({sites.length})
          </button>
          {Array.from(new Set(sites.map((s) => s.uf)))
            .sort((a, b) => {
              const priority = ['SP', 'RJ', 'MG', 'CE', 'DF', 'SC', 'PR', 'RS', 'PE', 'RO'];
              const idxA = priority.indexOf(a);
              const idxB = priority.indexOf(b);
              if (idxA !== -1 && idxB !== -1) return idxA - idxB;
              if (idxA !== -1) return -1;
              if (idxB !== -1) return 1;
              return a.localeCompare(b);
            })
            .map((uf) => {
              const count = sites.filter((s) => s.uf === uf).length;
              const isSelected = selectedUF === uf;
              const label = STATE_NAMES[uf] || uf;
              return (
                <button
                  key={uf}
                  onClick={() => { onSelectUF(isSelected ? null : uf); setCurrentPage(1); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/70 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
                      : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                  }`}
                  title={label}
                >
                  {label} ({count})
                </button>
              );
            })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Busca por texto */}
          <div>
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar unidade, município ou endereço..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Filtro por Região */}
          <div>
            <select
              value={selectedRegiao}
              onChange={(e) => { setSelectedRegiao(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="todas">Todas as Regiões</option>
              <option value="Sudeste">Sudeste</option>
              <option value="Nordeste">Nordeste</option>
              <option value="Sul">Sul</option>
              <option value="Centro-Oeste">Centro-Oeste</option>
              <option value="Norte">Norte</option>
            </select>
          </div>

          {/* Filtro por UF */}
          <div>
            <select
              value={selectedUF || 'todas'}
              onChange={(e) => { onSelectUF(e.target.value === 'todas' ? null : e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="todas">Todos os Estados (27 UFs)</option>
              {ALL_BRAZILIAN_UFS.map((uf) => {
                const count = sites.filter((s) => s.uf === uf).length;
                return (
                  <option key={uf} value={uf}>
                    {uf} {count > 0 ? `(${count} polo${count > 1 ? 's' : ''})` : '(Sem informação)'}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Filtro por Tipo */}
          <div>
            <select
              value={selectedTipo}
              onChange={(e) => { setSelectedTipo(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="todos">Todos os Serviços</option>
              <option value="CTA">Centros de Testagem (CTA)</option>
              <option value="SAE">Atenção Especializada (SAE)</option>
              <option value="CRIE">CRIE (Especiais)</option>
              <option value="Policlinica">Policlínicas & Super Centros</option>
              <option value="Hospital Universitario">Hospitais Especializados</option>
            </select>
          </div>

          {/* Filtro por Disponibilidade de Vacina */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-cyan-300 font-medium focus:outline-none focus:border-cyan-500"
            >
              <option value="todos">Estoque: Todos</option>
              <option value="disponivel">🟢 Disponível</option>
              <option value="esgotado">🔴 Esgotado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de Cards de Unidades (Navegável e Sem Tabelas Longas) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedSites.map((site) => (
          <div
            key={site.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4.5 flex flex-col justify-between text-xs space-y-3 hover:border-slate-700 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded font-mono font-bold bg-slate-800 text-cyan-300 border border-slate-700 text-[11px]">
                  {site.uf} • {site.municipio}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  {site.tipo}
                </span>
              </div>

              <h3 className="font-bold text-white text-sm leading-snug">
                {site.nomeUnidade}
              </h3>

              {/* Status de Estoque de Vacina no Local */}
              {site.statusEstoque && (
                <div className={`mt-2.5 p-2 rounded-lg border text-[11px] space-y-1 ${site.statusEstoque === 'esgotado'
                  ? 'bg-rose-950/40 border-rose-800/70 text-rose-300'
                  : site.statusEstoque === 'disponivel'
                    ? 'bg-emerald-950/40 border-emerald-800/70 text-emerald-300'
                    : 'bg-amber-950/40 border-amber-800/70 text-amber-300'
                  }`}>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${site.statusEstoque === 'esgotado' ? 'bg-rose-500 animate-pulse' :
                        site.statusEstoque === 'disponivel' ? 'bg-emerald-400' : 'bg-amber-400'
                        }`} />
                      {site.statusEstoque === 'esgotado' ? 'Doses Esgotadas no Local' :
                        site.statusEstoque === 'disponivel' ? 'Vacina Disponível' : 'Em Reabastecimento'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {site.dataAtualizacaoStatus && (
                        <span className="text-[10px] font-normal opacity-80">
                          {site.dataAtualizacaoStatus.split('-').reverse().join('/')}
                        </span>
                      )}
                      {site.fonteStatus && (
                        <a
                          href={site.fonteStatus}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Abrir comunicado oficial em nova janela"
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/40 hover:bg-black/70 border border-white/20 text-[10px] text-slate-200 hover:text-white transition-all shadow-sm"
                        >
                          <span>Fonte</span>
                          <ExternalLink className="w-3 h-3 text-cyan-300" />
                        </a>
                      )}
                    </div>
                  </div>
                  {site.notaStatus && (
                    <p className="text-[10px] text-slate-300 leading-tight">
                      {site.notaStatus}
                    </p>
                  )}
                </div>
              )}

              {/* Previsão Futura e Próximas Etapas */}
              {site.previsaoFutura && (
                <div className="mt-2.5 p-2 rounded-lg bg-indigo-950/40 border border-indigo-800/70 text-indigo-200 text-[11px] space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-indigo-300">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>Previsão & Próximas Etapas</span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-tight">
                    {site.previsaoFutura}
                  </p>
                </div>
              )}

              <div className="mt-3 space-y-1.5 text-slate-300">
                <p className="flex items-start gap-2 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <span>{site.endereco} — CEP {site.cep}</span>
                </p>

                <p className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <a href={`tel:${site.telefone.replace(/\D/g, '')}`} className="text-cyan-400 hover:underline font-mono">
                    {site.telefone}
                  </a>
                </p>

                <p className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{site.horarioFuncionamento}</span>
                </p>

                <p className="flex items-center gap-2 text-slate-300">
                  <CalendarCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-medium">Regime: {site.agendamento}</span>
                </p>
              </div>
            </div>

            <div className="pt-2.5 border-t border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-400 flex items-start gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                <span>{site.requisitos}</span>
              </div>
              <p className="text-[11px] text-cyan-300 bg-cyan-950/20 p-2 rounded border border-cyan-800/30">
                {site.observacoes}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredSites.length === 0 && (
        <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-full bg-amber-950/50 border border-amber-800/60 text-amber-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">
            Sem informação por enquanto
          </h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            {selectedUF
              ? `Não há polos com vacinação confirmada ou doses ativas cadastradas para o estado ${selectedUF} no momento.`
              : 'Não há polos de atendimento encontrados para os filtros selecionados no momento.'}
            {' '}O agente de monitoramento oficial atualiza periodicamente a rede de imunização conforme novas remessas do Ministério da Saúde e Secretarias forem confirmadas.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                onSelectUF(null);
                setSelectedRegiao('todas');
                setSelectedTipo('todos');
                setSelectedStatus('todos');
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 hover:bg-cyan-900/50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Ver Polos Confirmados ({sites.length})
            </button>
          </div>
        </div>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
          <span>
            Página {currentPage} de {totalPages} ({filteredSites.length} postos encontrados)
          </span>

          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded border border-slate-800 disabled:opacity-40 hover:bg-slate-800 text-slate-200"
            >
              Anterior
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded border border-slate-800 disabled:opacity-40 hover:bg-slate-800 text-slate-200"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
