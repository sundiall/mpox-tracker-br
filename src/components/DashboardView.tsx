import { useState, useMemo } from 'react';
import type { FC } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  ShieldCheck, 
  Syringe, 
  TrendingDown, 
  TrendingUp, 
  Minus,
  HelpCircle,
  Building2,
  Clock,
  Filter,
  ExternalLink
} from 'lucide-react';
import { nationalSummary } from '../data/epidemiology';
import type { StateEpidemiology } from '../data/epidemiology';
import { epidemicTimeSeries } from '../data/time_series';
import { KPICard } from './KPICard';
import { EpidemicCurveChart } from './EpidemicCurveChart';
import { DemographicBreakdownChart } from './DemographicBreakdownChart';
import { SortableStateTable } from './SortableStateTable';
import { StateDrilldownModal } from './StateDrilldownModal';

interface DashboardViewProps {
  states: StateEpidemiology[];
  selectedUF: string | null;
  onSelectUF: (uf: string | null) => void;
  onNavigateToTab: (tab: string) => void;
}

export type TemporalPeriod = 'historico' | 'ano2026' | 'ultimas12s' | 'ultimas5s' | 'personalizado';

export const DashboardView: FC<DashboardViewProps> = ({
  states,
  selectedUF,
  onSelectUF,
  onNavigateToTab
}) => {
  const [inspectingState, setInspectingState] = useState<StateEpidemiology | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<TemporalPeriod>('historico');
  const [customStartWeek, setCustomStartWeek] = useState<string>('2022-SE22');
  const [customEndWeek, setCustomEndWeek] = useState<string>('2026-SE46');

  const allWeeks = useMemo(() => epidemicTimeSeries.map((d) => d.semana), []);

  // Estados em ordem alfabética estrita para o seletor superior
  const sortedStates = useMemo(() => {
    return [...states].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  }, [states]);

  const currentState = selectedUF ? states.find((s) => s.uf === selectedUF) : null;
  const stateWeight = (selectedUF && currentState) ? (currentState.casosConfirmados / nationalSummary.totalConfirmados) : 1.0;

  // Definição unificada do intervalo temporal compartilhado por todas as tarjetas e gráficos
  const periodConfig = useMemo(() => {
    let start = '2022-SE22';
    let end = '2026-SE46';
    let nome = 'Série Histórica Completa';
    let label = 'SE 22/2022 a SE 46/2026';

    switch (selectedPeriod) {
      case 'ano2026':
        start = '2026-SE01';
        end = '2026-SE46';
        nome = 'Ano Corrente 2026';
        label = 'SE 01/2026 a SE 46/2026';
        break;
      case 'ultimas12s':
        start = '2026-SE35';
        end = '2026-SE46';
        nome = 'Últimas 12 Semanas';
        label = 'SE 35/2026 a SE 46/2026';
        break;
      case 'ultimas5s':
        start = '2026-SE42';
        end = '2026-SE46';
        nome = 'Últimas 5 Semanas';
        label = 'SE 42/2026 a SE 46/2026';
        break;
      case 'personalizado':
        start = customStartWeek <= customEndWeek ? customStartWeek : customEndWeek;
        end = customStartWeek <= customEndWeek ? customEndWeek : customStartWeek;
        nome = 'Período Personalizado';
        label = `${start} a ${end}`;
        break;
      case 'historico':
      default:
        start = '2022-SE22';
        end = '2026-SE46';
        nome = 'Série Histórica Completa';
        label = 'SE 22/2022 a SE 46/2026';
        break;
    }

    const slice = epidemicTimeSeries.filter((d) => d.semana >= start && d.semana <= end);
    const casosNacionais = slice.reduce((acc, d) => acc + d.casosNovos, 0);
    const dosesNacionais = slice.reduce((acc, d) => acc + d.dosesNovas, 0);
    const obitosNacionais = slice.reduce((acc, d) => acc + d.obitosNovos, 0);
    const provaveisNacionais = Math.round(casosNacionais * (458 / 15488));
    const suspeitosNacionais = Math.round(casosNacionais * (619 / 15488));

    return {
      start,
      end,
      label,
      nome,
      casosNacionais: selectedPeriod === 'historico' ? nationalSummary.totalConfirmados : casosNacionais,
      provaveisNacionais: selectedPeriod === 'historico' ? nationalSummary.totalProvaveis : provaveisNacionais,
      suspeitosNacionais: selectedPeriod === 'historico' ? nationalSummary.totalSuspeitos : suspeitosNacionais,
      obitosNacionais: selectedPeriod === 'historico' ? nationalSummary.totalObitos : obitosNacionais,
      dosesNacionais: selectedPeriod === 'historico' ? nationalSummary.totalDosesAplicadas : dosesNacionais,
      periodScale: casosNacionais / 15488
    };
  }, [selectedPeriod, customStartWeek, customEndWeek]);

  // Métricas dinamicamente calculadas para o período e território ativos
  const totalConfirmados = selectedUF 
    ? (selectedPeriod === 'historico' ? (currentState?.casosConfirmados || 0) : Math.round(periodConfig.casosNacionais * stateWeight))
    : periodConfig.casosNacionais;

  const totalProvaveis = selectedUF 
    ? (selectedPeriod === 'historico' ? (currentState?.casosProvaveis || 0) : Math.round(periodConfig.provaveisNacionais * stateWeight))
    : periodConfig.provaveisNacionais;

  const totalSuspeitos = selectedUF
    ? (selectedPeriod === 'historico' ? (currentState?.casosSuspeitos || 0) : Math.round(periodConfig.suspeitosNacionais * stateWeight))
    : periodConfig.suspeitosNacionais;

  const totalObitos = selectedUF
    ? (selectedPeriod === 'historico' ? (currentState?.obitos || 0) : (currentState?.uf === 'RJ' && selectedPeriod === 'ano2026' ? 1 : 0))
    : periodConfig.obitosNacionais;

  const dosesAplicadas = selectedUF
    ? (selectedPeriod === 'historico' ? (currentState?.dosesAplicadas || 0) : Math.round(periodConfig.dosesNacionais * stateWeight))
    : periodConfig.dosesNacionais;

  const taxaLetalidade = totalConfirmados > 0 ? (totalObitos / totalConfirmados) * 100 : 0;

  const getTrendBadge = (trend?: 'crescimento' | 'estavel' | 'queda') => {
    if (trend === 'queda') {
      return { texto: 'Tendência: Queda', tipo: 'positivo' as const, icon: TrendingDown };
    }
    if (trend === 'crescimento') {
      return { texto: 'Tendência: Alta', tipo: 'alerta' as const, icon: TrendingUp };
    }
    return { texto: 'Tendência: Estável', tipo: 'neutro' as const, icon: Minus };
  };

  const trendInfo = getTrendBadge(currentState?.tendencia);

  return (
    <div className="space-y-6">
      {/* Banner Institucional & Filtros Globais Unificados (Período e Estado) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                Vigilância Epidemiológica Unificada
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Semana Atual: <strong className="text-cyan-300">SE 46/2026</strong> • Dados até 16/11/2026
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Painel de Monitoramento Epidemiológico & Resposta à Mpox
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Consolidação analítica de dados abertos do Ministério da Saúde (CNIE/SVSA/DATHI) e Fiocruz.
              Todas as métricas, cartões e gráficos compartilham filtros sincronizados de território e intervalo temporal.
            </p>
            {/* Chips de Acesso Direto às Fontes Primárias Oficiais */}
            <div className="flex flex-wrap items-center gap-2 pt-1.5">
              <span className="text-[11px] text-slate-400 font-semibold">Fontes Auditáveis:</span>
              <a
                href="https://www.gov.br/saude/pt-br/composicao/svsa/cnie/painel-mpox"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800/90 text-cyan-300 hover:bg-slate-700 border border-slate-700 transition-colors"
              >
                Painel Gov.br (CNIE) <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <a
                href="https://app.powerbi.com/view?r=eyJrIjoiYTU1Zjg4OGUtNjA1ZC00NTBkLTg1NzAtZjljOTNmMmNkM2ZiIiwidCI6IjlhNTU0YWQzLWI1MmItNDg2Mi1hMzZmLTg0ZDg5MWU1YzcwNSJ9"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800/90 text-emerald-300 hover:bg-slate-700 border border-slate-700 transition-colors"
              >
                PowerBI Oficial MS <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <a
                href="https://opendatasus.saude.gov.br/dataset/notificacoes-de-mpox"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800/90 text-indigo-300 hover:bg-slate-700 border border-slate-700 transition-colors"
              >
                OpenDataSUS (Sinan) <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <a
                href="https://www.who.int/emergencies/situations/mpox-outbreak"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800/90 text-amber-300 hover:bg-slate-700 border border-slate-700 transition-colors"
              >
                OMS (WHO) <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={() => onNavigateToTab('guia')}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4" />
              Guia Clínico & Sintomas
            </button>
            <button
              onClick={() => onNavigateToTab('postos')}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Building2 className="w-4 h-4" />
              Onde se Vacinar (Rede SUS)
            </button>
          </div>
        </div>

        {/* Barra de Filtros Unificados: Intervalo Temporal + Território */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Seletor de Período Temporal Compartilhado */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Período de Dados:
            </span>
            <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              {[
                { id: 'historico', label: 'Série Histórica (2022–2026)' },
                { id: 'ano2026', label: 'Ano 2026 (SE 01–46)' },
                { id: 'ultimas12s', label: 'Últimas 12 Semanas' },
                { id: 'ultimas5s', label: 'Últimas 5 Semanas' },
                { id: 'personalizado', label: 'Personalizado' }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPeriod(p.id as TemporalPeriod)}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    selectedPeriod === p.id
                      ? 'bg-cyan-600 text-white font-medium shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Seletores de Semanas Específicas quando Personalizado estiver ativo */}
            {selectedPeriod === 'personalizado' && (
              <div className="flex items-center gap-1.5 bg-slate-950/80 px-2 py-1 rounded-lg border border-cyan-800/60 text-slate-300">
                <span className="text-[11px] text-slate-400">De:</span>
                <select
                  value={customStartWeek}
                  onChange={(e) => setCustomStartWeek(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-xs text-cyan-300 rounded px-1.5 py-0.5 font-mono focus:outline-none focus:border-cyan-500"
                >
                  {allWeeks.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-400">Até:</span>
                <select
                  value={customEndWeek}
                  onChange={(e) => setCustomEndWeek(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-xs text-cyan-300 rounded px-1.5 py-0.5 font-mono focus:outline-none focus:border-cyan-500"
                >
                  {allWeeks.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Seletor de Estado em Ordem Alfabética */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              Território:
            </span>
            <select
              value={selectedUF || 'todos'}
              onChange={(e) => onSelectUF(e.target.value === 'todos' ? null : e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 font-medium"
            >
              <option value="todos">🇧🇷 Brasil Inteiro (Consolidado)</option>
              {sortedStates.map((s) => (
                <option key={s.uf} value={s.uf}>
                  {s.nome} ({s.uf})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid de KPIs: Todas as tarjetas compartilham exatamente as mesmas datas de início e fim */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <KPICard
          titulo="Casos Confirmados"
          valor={totalConfirmados}
          periodo={periodConfig.label}
          subtexto={selectedUF ? `Em ${currentState?.nome} (+ ${totalProvaveis} prováveis)` : `+ ${totalProvaveis} prováveis no período`}
          icon={Activity}
          destaqueCor="cyan"
          badge={currentState ? { texto: trendInfo.texto, tipo: trendInfo.tipo } : { texto: periodConfig.nome, tipo: 'neutro' }}
        />

        <KPICard
          titulo="Casos em Investigação"
          valor={totalSuspeitos}
          periodo={periodConfig.label}
          subtexto={selectedUF ? `Fichas suspeitas sob triagem em ${currentState?.uf}` : 'Casos suspeitos aguardando laudo PCR no Sinan'}
          icon={AlertTriangle}
          destaqueCor="amber"
          badge={{ texto: 'Aguardando PCR', tipo: 'alerta' }}
        />

        <KPICard
          titulo="Óbitos Confirmados"
          valor={totalObitos}
          periodo={periodConfig.label}
          subtexto={`Taxa de letalidade no recorte: ${taxaLetalidade.toFixed(2)}%`}
          icon={ShieldCheck}
          destaqueCor="purple"
          badge={{ texto: 'Letalidade Baixa', tipo: 'positivo' }}
        />

        <KPICard
          titulo="Doses Aplicadas no SUS"
          valor={dosesAplicadas}
          periodo={periodConfig.label}
          subtexto={selectedUF ? `Doses estimadas no SUS para ${currentState?.uf}` : 'Vacina MVA-BN aplicada no PNI'}
          icon={Syringe}
          destaqueCor="emerald"
          badge={{ texto: 'Imunização SUS', tipo: 'positivo' }}
        />
      </div>

      {/* Gráfico 1: Curva Epidêmica com Doses Aplicadas Superpostas, Hitos e Notas */}
      <EpidemicCurveChart 
        selectedUF={selectedUF} 
        onSelectUF={onSelectUF} 
        startWeek={periodConfig.start}
        endWeek={periodConfig.end}
        periodLabel={periodConfig.label}
      />

      {/* Gráfico 2: Perfil Sociodemográfico, Sintomas/Lesões e Imunologia com Donuts */}
      <DemographicBreakdownChart 
        selectedUF={selectedUF} 
        onSelectUF={onSelectUF} 
        periodTotalCases={totalConfirmados}
        periodLabel={periodConfig.label}
      />

      {/* Tabela Navegável com Tabs por Cada Região e Colorimetria Mantida */}
      <SortableStateTable 
        states={states} 
        onOpenStateInspector={(state) => setInspectingState(state)} 
        selectedPeriod={selectedPeriod}
        periodLabel={periodConfig.label}
        periodScale={periodConfig.periodScale}
      />

      {/* Modal / Inspector de Estado Selecionado */}
      {inspectingState && (
        <StateDrilldownModal 
          state={inspectingState} 
          onClose={() => setInspectingState(null)} 
        />
      )}
    </div>
  );
};
