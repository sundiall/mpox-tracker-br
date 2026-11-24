import { useState, useMemo, useEffect } from 'react';
import type { FC } from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid, 
  Area, 
  ReferenceLine,
  Cell
} from 'recharts';
import { getEpidemicCurve, getApplicableMilestones, getWeeklyByYear, epidemicTimeSeries } from '../data/time_series';
import { syncMetadata } from '../data/sync_status';
import { statesData } from '../data/epidemiology';
import { formatWeekToCommonDate, getEpidemiologicalWeekDateRange } from '../utils/date_converters';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Calendar, 
  Filter, 
  Sparkles, 
  Syringe, 
  Info, 
  ChevronDown, 
  ChevronUp,
  Activity,
  AlertCircle,
  ExternalLink,
  Clock
} from 'lucide-react';

interface EpidemicCurveChartProps {
  selectedUF: string | null;
  onSelectUF: (uf: string | null) => void;
  startWeek?: string;
  endWeek?: string;
  periodLabel?: string;
  selectedPeriod?: string;
  onSelectPeriod?: (period: any) => void;
  customStartWeek?: string;
  onSelectCustomStartWeek?: (w: string) => void;
  customEndWeek?: string;
  onSelectCustomEndWeek?: (w: string) => void;
}

const parseWeekNumber = (w?: string) => {
  if (!w) return null;
  const match = w.match(/^(\d{4})-SE(\d{1,2})$/);
  if (!match) return null;
  return { year: parseInt(match[1], 10), week: parseInt(match[2], 10) };
};

interface TrendAnalysis {
  status: 'alta' | 'queda' | 'estavel';
  deltaPercent: number;
  slope: number;
  casosInicial: number;
  casosFinal: number;
  deltaCasos: number;
  semanas: string[];
  casosSerie: number[];
}

const analyzeTrendWindow = (series: any[], windowSize: number): TrendAnalysis => {
  if (!series || series.length < 2) {
    return {
      status: 'estavel',
      deltaPercent: 0,
      slope: 0,
      casosInicial: 0,
      casosFinal: 0,
      deltaCasos: 0,
      semanas: [],
      casosSerie: []
    };
  }
  const slice = series.slice(-windowSize);
  const n = slice.length;
  const x = slice.map((_, i) => i);
  const y = slice.map((p) => p.casosNovos);
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = slice.reduce((acc, p, i) => acc + i * p.casosNovos, 0);
  const sumXX = x.reduce((a, b) => a + b * b, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const first = y[0];
  const last = y[y.length - 1];
  const deltaCasos = last - first;
  const deltaPercent = first === 0 ? (last > 0 ? 100 : 0) : ((last - first) / first) * 100;

  // Classificação estrita para o semáforo de tendência
  let status: 'alta' | 'queda' | 'estavel' = 'estavel';
  if (deltaPercent > 10 || slope > 1.5) {
    status = 'alta';
  } else if (deltaPercent < -10 || slope < -1.5) {
    status = 'queda';
  }

  return {
    status,
    deltaPercent,
    slope,
    casosInicial: first,
    casosFinal: last,
    deltaCasos,
    semanas: slice.map((s) => s.semana),
    casosSerie: y
  };
};

export const EpidemicCurveChart: FC<EpidemicCurveChartProps> = ({ 
  selectedUF, 
  onSelectUF,
  startWeek,
  endWeek,
  periodLabel,
  selectedPeriod,
  onSelectPeriod,
  customStartWeek,
  onSelectCustomStartWeek,
  customEndWeek,
  onSelectCustomEndWeek
}) => {
  // Responsividade Móvel
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const allWeeks = useMemo(() => epidemicTimeSeries.map((d) => d.semana), []);

  // Série contínua exibida por padrão conforme solicitado
  const [displayMode, setDisplayMode] = useState<'oficial_ano' | 'continua'>('continua');
  const [metricView, setMetricView] = useState<'novos' | 'acumulados'>('novos');
  const [showMilestones, setShowMilestones] = useState(true);
  const [showVaccines, setShowVaccines] = useState(true);
  const [isMilestonesExpanded, setIsMilestonesExpanded] = useState(false);
  const [compareAllYears, setCompareAllYears] = useState(false);

  // Estados em ordem alfabética estrita pelo nome
  const sortedStates = useMemo(() => {
    return [...statesData].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  }, []);

  // Recalcula dinamicamente a curva contínua com base no estado e período selecionados
  const chartData = useMemo(() => {
    return getEpidemicCurve(selectedUF, startWeek, endWeek);
  }, [selectedUF, startWeek, endWeek]);

  // Filtro temporal para o gráfico Oficial (semanas 1 a 52 por ano)
  const parsedStart = useMemo(() => parseWeekNumber(startWeek), [startWeek]);
  const parsedEnd = useMemo(() => parseWeekNumber(endWeek), [endWeek]);

  const { minWeekFilter, maxWeekFilter, activeYears } = useMemo(() => {
    if (!parsedStart || !parsedEnd) {
      return { minWeekFilter: undefined, maxWeekFilter: undefined, activeYears: [2022, 2023, 2024, 2025, 2026] };
    }
    if (parsedStart.year === parsedEnd.year) {
      return {
        minWeekFilter: Math.min(parsedStart.week, parsedEnd.week),
        maxWeekFilter: Math.max(parsedStart.week, parsedEnd.week),
        activeYears: [parsedStart.year]
      };
    }
    const minYear = Math.min(parsedStart.year, parsedEnd.year);
    const maxYear = Math.max(parsedStart.year, parsedEnd.year);
    return {
      minWeekFilter: undefined,
      maxWeekFilter: undefined,
      activeYears: [2022, 2023, 2024, 2025, 2026].filter((y) => y >= minYear && y <= maxYear)
    };
  }, [parsedStart, parsedEnd]);

  const displayedYears = useMemo(() => {
    if (compareAllYears) return [2022, 2023, 2024, 2025, 2026];
    return activeYears;
  }, [compareAllYears, activeYears]);

  // Recalcula dados semanais por ano (1 a 52) filtrados pelo período
  const weeklyByYearChartData = useMemo(() => {
    return getWeeklyByYear(selectedUF, minWeekFilter, maxWeekFilter);
  }, [selectedUF, minWeekFilter, maxWeekFilter]);

  // Verificação de fechamento da semana atual para o semáforo
  const lastPoint = chartData.length > 0 ? chartData[chartData.length - 1] : null;
  const lastParsed = lastPoint ? parseWeekNumber(lastPoint.semana) : null;
  const isLastWeekComplete = useMemo(() => {
    if (!lastParsed) return true;
    // Se explicitamente marcado como preliminar em curso, nunca é consolidada
    if (lastPoint?.statusConsolidacao === 'preliminar_em_curso') {
      return false;
    }
    // A consolidação oficial do Sinan/MS ocorre na terça-feira seguinte (após o encerramento no sábado)
    const range = getEpidemiologicalWeekDateRange(lastParsed.year, lastParsed.week);
    const now = new Date();
    // Considerar concluída e consolidada apenas após a terça-feira de consolidação (range.endDate + ~60h)
    const consolidationDate = new Date(range.endDate.getTime() + 60 * 3600000);
    return now.getTime() > consolidationDate.getTime();
  }, [lastParsed, lastPoint]);

  // Se a semana mais recente for preliminar ou não consolidada, exclui do cálculo do semáforo de tendência
  const seriesForTrend = useMemo(() => {
    if (!chartData || chartData.length < 3) return chartData;
    // Filtrar qualquer semana marcada com status preliminar
    const filtered = chartData.filter((d) => d.statusConsolidacao !== 'preliminar_em_curso');
    if (!isLastWeekComplete && filtered.length > 0 && filtered[filtered.length - 1].semana === lastPoint?.semana) {
      return filtered.slice(0, -1);
    }
    return filtered;
  }, [chartData, isLastWeekComplete, lastPoint]);

  // Semáforo epidemiológico de tendência calculando derivadas e deltas das últimas 3 e 5 semanas consolidadas
  const trend3s = useMemo(() => analyzeTrendWindow(seriesForTrend, 3), [seriesForTrend]);
  const trend5s = useMemo(() => analyzeTrendWindow(seriesForTrend, 5), [seriesForTrend]);

  // Intervalo do eixo X dinâmico calibrado para desktop e mobile
  const xAxisInterval = useMemo(() => {
    if (isMobile) {
      if (chartData.length > 150) return 26; // ~6 meses em telas mobile
      if (chartData.length > 60) return 14;  // ~3 meses
      if (chartData.length > 25) return 8;   // ~2 meses
      if (chartData.length > 8) return 3;
      return 0;
    }
    if (chartData.length > 150) return 18; // ~4 meses
    if (chartData.length > 60) return 8;   // ~2 meses
    if (chartData.length > 25) return 4;   // ~1 mês
    if (chartData.length > 8) return 2;    // ~quinzenal
    return 0;                              // semanal
  }, [chartData.length, isMobile]);

  // Marcos aplicáveis ao território atual
  const applicableMilestones = useMemo(() => {
    return getApplicableMilestones(selectedUF);
  }, [selectedUF]);

  // Marcos visíveis no intervalo ativo de chartData
  const visibleMilestones = useMemo(() => {
    return applicableMilestones
      .map((m) => {
        const index = chartData.findIndex((d) => d.semana === m.semana);
        return { ...m, index };
      })
      .filter((m) => m.index !== -1)
      .sort((a, b) => a.index - b.index);
  }, [applicableMilestones, chartData]);

  const currentState = selectedUF ? statesData.find((s) => s.uf === selectedUF) : null;
  const stateLabel = currentState ? `${currentState.nome} (${currentState.uf})` : 'Brasil (Consolidado Nacional)';

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      if (displayMode === 'oficial_ano') {
        const pt = payload[0]?.payload;
        return (
          <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-xs space-y-1.5 min-w-[200px]">
            <div className="font-semibold text-slate-200 border-b border-slate-800 pb-1 flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                Semana Epidemiológica {label}
              </span>
            </div>
            <div className="space-y-1 pt-0.5 text-[11px]">
              <p className="text-emerald-400 flex justify-between">
                <span>2022:</span> <strong>{(pt?.[2022] || 0).toLocaleString('pt-BR')} casos</strong>
              </p>
              <p className="text-orange-400 flex justify-between">
                <span>2023:</span> <strong>{(pt?.[2023] || 0).toLocaleString('pt-BR')} casos</strong>
              </p>
              <p className="text-slate-300 flex justify-between">
                <span>2024:</span> <strong>{(pt?.[2024] || 0).toLocaleString('pt-BR')} casos</strong>
              </p>
              <p className="text-yellow-400 flex justify-between">
                <span>2025:</span> <strong>{(pt?.[2025] || 0).toLocaleString('pt-BR')} casos</strong>
              </p>
              <p className="text-cyan-400 flex justify-between">
                <span>2026:</span> <strong>{(pt?.[2026] || 0).toLocaleString('pt-BR')} casos</strong>
              </p>
            </div>
          </div>
        );
      }
      const dataPoint = payload[0]?.payload;
      const dataFormatada = formatWeekToCommonDate(label, 'intervalo_completo');
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-xs space-y-1.5 min-w-[240px]">
          <div className="font-semibold text-slate-200 border-b border-slate-800 pb-1 flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-cyan-300">
              <Calendar className="w-3.5 h-3.5" />
              {dataFormatada}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">{dataPoint?.ano}</span>
          </div>

          {metricView === 'novos' ? (
            <>
              <p className="text-cyan-400 font-semibold">
                <span className="text-slate-400 font-normal">Casos na Semana: </span>
                {dataPoint?.casosNovos?.toLocaleString('pt-BR')}
              </p>
              <p className="text-amber-400">
                <span className="text-slate-400">Média Móvel (3 Semanas / 21 Dias): </span>
                {dataPoint?.mediaMovel7d} casos
              </p>
            </>
          ) : (
            <p className="text-indigo-300 font-semibold">
              <span className="text-slate-400 font-normal">Total Acumulado de Casos: </span>
              {dataPoint?.casosAcumulados?.toLocaleString('pt-BR')}
            </p>
          )}

          {dataPoint?.dosesAcumuladas > 0 && (
            <p className="text-emerald-400 font-semibold border-t border-slate-800/80 pt-1">
              <span className="text-slate-400 font-normal">Doses SUS Acumuladas: </span>
              {dataPoint?.dosesAcumuladas?.toLocaleString('pt-BR')}
            </p>
          )}

          {/* Alerta de Semana em Curso / Dados Preliminares */}
          {dataPoint?.statusConsolidacao === 'preliminar_em_curso' && (
            <div className="mt-2 p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 text-[11px] space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-cyan-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>Semana em Curso • Dados Preliminares</span>
              </div>
              <p className="text-[10px] text-slate-300 leading-snug">
                {dataPoint?.dadosTempoReal?.notaVigilancia || 'Dados parciais sujeitos à consolidação pelo Ministério da Saúde.'}
              </p>
              {dataPoint?.dadosTempoReal?.statusEstoqueVacinas === 'esgotado' && (
                <div className="text-[10px] font-semibold text-rose-300 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-800/60 mt-1">
                  ⚠️ Doses esgotadas temporariamente em polos do RJ
                </div>
              )}
            </div>
          )}

          {/* Detalhes do Marco Histórico / Intervenção com data e título */}
          {(() => {
            const milestoneForWeek = applicableMilestones.find((m) => m.semana === dataPoint?.semana);
            if (!milestoneForWeek) return null;
            const mColor = milestoneForWeek.cor || '#38bdf8';
            return (
              <div 
                className="mt-2 p-1.5 rounded-lg border text-xs space-y-0.5 shadow-lg"
                style={{ 
                  backgroundColor: `${mColor}18`, 
                  borderColor: `${mColor}60` 
                }}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] border border-current font-bold shrink-0" style={{ color: mColor }}>
                    {milestoneForWeek.simbolo}
                  </span>
                  <span className="leading-tight" style={{ color: mColor }}>{milestoneForWeek.titulo}</span>
                </div>
                <div className="text-[10px] font-mono text-cyan-300/90 pl-5.5">
                  {formatWeekToCommonDate(milestoneForWeek.semana, 'intervalo_completo')} • {milestoneForWeek.semana}
                </div>
              </div>
            );
          })()}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-5 space-y-4">
      {/* Controles Imediatos & Filtro Territorial Contextual ao Gráfico */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              {displayMode === 'oficial_ano'
                ? 'Casos confirmados e prováveis de mpox por ano e semana epidemiológica'
                : 'Curva Epidêmica Contínua & Vigilância Temporal'}
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-cyan-300 border border-slate-700">
              {currentState ? currentState.uf : 'BR'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>
              Exibindo dados para: <strong className="text-slate-200">{stateLabel}</strong> • {displayMode === 'oficial_ano' ? `Padrão Oficial MS (Semanas ${minWeekFilter || 1} a ${maxWeekFilter || 52} • Anos: ${displayedYears.join(', ')})` : `Série contínua (${periodLabel || 'SE 22/2022 a SE 46/2026'})`}
            </span>
            {displayMode === 'continua' && (
              <span className="inline-flex items-center gap-1 text-[10px] text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                Barra Hachurada: Semana em curso (dados preliminares em tempo real)
              </span>
            )}
          </p>
        </div>

        {/* Barra de Filtro de Estado Ordenada Alfabeticamente, Período e Modos */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Seletor Rápido de Período Temporal Integrado Diretamente ao Gráfico */}
          {onSelectPeriod && (
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs overflow-x-auto max-w-full">
              {[
                { id: 'historico', label: 'Histórico' },
                { id: 'ano2026', label: '2026' },
                { id: 'ultimas12s', label: '12 sem' },
                { id: 'ultimas5s', label: '5 sem' },
                { id: 'personalizado', label: 'Custom' }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelectPeriod(p.id)}
                  className={`px-2 py-1 rounded text-xs transition-colors whitespace-nowrap cursor-pointer ${
                    selectedPeriod === p.id
                      ? 'bg-cyan-600 text-white font-medium shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}

          {/* Seletores Personalizados se ativo */}
          {selectedPeriod === 'personalizado' && onSelectCustomStartWeek && onSelectCustomEndWeek && (
            <div className="flex items-center gap-1 bg-slate-950/80 px-2 py-1 rounded-lg border border-cyan-800/60 text-slate-300 text-xs">
              <span className="text-[10px] text-slate-400">De:</span>
              <select
                value={customStartWeek}
                onChange={(e) => onSelectCustomStartWeek(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-xs text-cyan-300 rounded px-1 py-0.5 font-mono"
              >
                {allWeeks.map((w: string) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
              <span className="text-[10px] text-slate-400">Até:</span>
              <select
                value={customEndWeek}
                onChange={(e) => onSelectCustomEndWeek(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-xs text-cyan-300 rounded px-1 py-0.5 font-mono"
              >
                {allWeeks.map((w: string) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
          )}

          {/* Seletor de Modo: Oficial PowerBI (1 a 52) vs Contínua */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setDisplayMode('oficial_ano')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                displayMode === 'oficial_ano'
                  ? 'bg-emerald-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Oficial MS
            </button>
            <button
              onClick={() => setDisplayMode('continua')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                displayMode === 'continua'
                  ? 'bg-cyan-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Contínua
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-xs">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={selectedUF || 'todos'}
              onChange={(e) => onSelectUF(e.target.value === 'todos' ? null : e.target.value)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer font-medium"
            >
              <option value="todos">🇧🇷 Brasil (Consolidado)</option>
              {sortedStates.map((s) => (
                <option key={s.uf} value={s.uf} className="bg-slate-900 text-slate-200">
                  {s.nome} ({s.uf})
                </option>
              ))}
            </select>
          </div>

          {displayMode === 'oficial_ano' && (
            <button
              onClick={() => setCompareAllYears(!compareAllYears)}
              className={`px-2.5 py-1 rounded-md text-xs border transition-colors ${
                compareAllYears
                  ? 'bg-slate-800 border-slate-700 text-slate-300'
                  : 'bg-emerald-950/80 border-emerald-700 text-emerald-300 font-medium'
              }`}
            >
              {compareAllYears ? 'Exibir apenas anos do recorte' : 'Comparar todos os anos (mesmas semanas)'}
            </button>
          )}

          {displayMode === 'continua' && (
            <>
              {/* Toggle Novos vs Acumulados */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setMetricView('novos')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    metricView === 'novos'
                      ? 'bg-cyan-600 text-white font-medium'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Novos Casos
                </button>
                <button
                  onClick={() => setMetricView('acumulados')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    metricView === 'acumulados'
                      ? 'bg-indigo-600 text-white font-medium'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Acumulados
                </button>
              </div>

              {/* Toggles de Hitos, Doses e Tendências */}
              <div className="flex items-center gap-1 text-[11px]">
                <button
                  onClick={() => setShowVaccines(!showVaccines)}
                  title="Superpor curva de doses de vacina aplicadas no SUS"
                  className={`px-2 py-1 rounded border transition-colors flex items-center gap-1 ${
                    showVaccines 
                      ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300' 
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  <Syringe className="w-3 h-3" />
                  Doses Vacina
                </button>
                <button
                  onClick={() => setShowMilestones(!showMilestones)}
                  className={`px-2 py-1 rounded border transition-colors ${
                    showMilestones 
                      ? 'bg-purple-950/80 border-purple-700 text-purple-300' 
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  Hitos Locais
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Semáforo Epidemiológico de Tendência Recente (Últimas 3 e 5 Semanas) */}
      <div className="bg-slate-950/90 border border-slate-800/90 rounded-xl p-3.5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/70 pb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Semáforo Epidemiológico de Tendência Recente
            </h4>
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              (Derivada Linear & Variação • Distinto da Média Móvel)
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Território: <strong className="text-cyan-300">{stateLabel}</strong>
          </span>
        </div>

        {!isLastWeekComplete && lastPoint && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/60 text-xs text-amber-300">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Semana atual ({formatWeekToCommonDate(lastPoint.semana, 'intervalo_completo')}) em curso / não concluída:</strong> O último dado foi desconsiderado no cálculo do semáforo para evitar falso viés de queda por atraso de notificação no Sinan. A tendência reflete as semanas consolidadas fechadas.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Card Semáforo 1: Últimas 3 Semanas */}
          <div className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
            trend3s.status === 'alta' 
              ? 'bg-rose-950/20 border-rose-800/60 shadow-[0_0_15px_rgba(244,63,94,0.08)]' 
              : trend3s.status === 'queda'
              ? 'bg-emerald-950/20 border-emerald-800/60 shadow-[0_0_15px_rgba(16,185,129,0.08)]'
              : 'bg-amber-950/20 border-amber-800/60 shadow-[0_0_15px_rgba(245,158,11,0.08)]'
          }`}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-300">
                Tendência de Curto Prazo (3 Semanas)
              </span>

              {/* Mini-Semáforo Visual 3 Luzes */}
              <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
                <span 
                  title="Sinal Vermelho: Casos Subindo / Alta"
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    trend3s.status === 'alta' 
                      ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,1)] ring-2 ring-rose-400/40 animate-pulse' 
                      : 'bg-rose-950/60 opacity-25'
                  }`}
                />
                <span 
                  title="Sinal Amarelo: Casos Mantendo-se / Estável"
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    trend3s.status === 'estavel' 
                      ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,1)] ring-2 ring-amber-300/40' 
                      : 'bg-amber-950/60 opacity-25'
                  }`}
                />
                <span 
                  title="Sinal Verde: Casos Descendo / Queda"
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    trend3s.status === 'queda' 
                      ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,1)] ring-2 ring-emerald-300/40 animate-pulse' 
                      : 'bg-emerald-950/60 opacity-25'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-baseline gap-2 pt-2">
              {trend3s.status === 'alta' ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Alta (+{trend3s.deltaPercent.toFixed(1)}%)
                </div>
              ) : trend3s.status === 'queda' ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <TrendingDown className="w-3.5 h-3.5" />
                  Queda ({trend3s.deltaPercent.toFixed(1)}%)
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  <Minus className="w-3.5 h-3.5" />
                  Estável ({trend3s.deltaPercent > 0 ? '+' : ''}{trend3s.deltaPercent.toFixed(1)}%)
                </div>
              )}

              <span className="text-xs text-slate-300 font-mono">
                {trend3s.slope > 0 ? `+${trend3s.slope.toFixed(1)}` : trend3s.slope.toFixed(1)} casos/semana
              </span>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 space-y-0.5">
              <p>
                Série recente: <strong className="text-slate-200 font-mono">{trend3s.casosSerie.join(' → ')}</strong> casos ({trend3s.semanas[0] || ''} a {trend3s.semanas[trend3s.semanas.length - 1] || ''})
              </p>
              <p className="text-[10px] text-slate-500">
                {trend3s.status === 'alta'
                  ? 'Casos subindo no curto prazo. Sinal de aceleração recente.'
                  : trend3s.status === 'queda'
                  ? 'Casos descendo no curto prazo. Sinal favorável de desaceleração.'
                  : 'Casos mantendo-se em patamar estável sem salto expressivo.'}
              </p>
            </div>
          </div>

          {/* Card Semáforo 2: Últimas 5 Semanas */}
          <div className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
            trend5s.status === 'alta' 
              ? 'bg-rose-950/20 border-rose-800/60 shadow-[0_0_15px_rgba(244,63,94,0.08)]' 
              : trend5s.status === 'queda'
              ? 'bg-emerald-950/20 border-emerald-800/60 shadow-[0_0_15px_rgba(16,185,129,0.08)]'
              : 'bg-amber-950/20 border-amber-800/60 shadow-[0_0_15px_rgba(245,158,11,0.08)]'
          }`}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-300">
                Tendência de Médio Prazo (5 Semanas)
              </span>

              {/* Mini-Semáforo Visual 3 Luzes */}
              <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
                <span 
                  title="Sinal Vermelho: Casos Subindo / Alta"
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    trend5s.status === 'alta' 
                      ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,1)] ring-2 ring-rose-400/40 animate-pulse' 
                      : 'bg-rose-950/60 opacity-25'
                  }`}
                />
                <span 
                  title="Sinal Amarelo: Casos Mantendo-se / Estável"
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    trend5s.status === 'estavel' 
                      ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,1)] ring-2 ring-amber-300/40' 
                      : 'bg-amber-950/60 opacity-25'
                  }`}
                />
                <span 
                  title="Sinal Verde: Casos Descendo / Queda"
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    trend5s.status === 'queda' 
                      ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,1)] ring-2 ring-emerald-300/40 animate-pulse' 
                      : 'bg-emerald-950/60 opacity-25'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-baseline gap-2 pt-2">
              {trend5s.status === 'alta' ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Alta (+{trend5s.deltaPercent.toFixed(1)}%)
                </div>
              ) : trend5s.status === 'queda' ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <TrendingDown className="w-3.5 h-3.5" />
                  Queda ({trend5s.deltaPercent.toFixed(1)}%)
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  <Minus className="w-3.5 h-3.5" />
                  Estável ({trend5s.deltaPercent > 0 ? '+' : ''}{trend5s.deltaPercent.toFixed(1)}%)
                </div>
              )}

              <span className="text-xs text-slate-300 font-mono">
                {trend5s.slope > 0 ? `+${trend5s.slope.toFixed(1)}` : trend5s.slope.toFixed(1)} casos/semana
              </span>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 space-y-0.5">
              <p>
                Série recente: <strong className="text-slate-200 font-mono">{trend5s.casosSerie.join(' → ')}</strong> casos ({trend5s.semanas[0] || ''} a {trend5s.semanas[trend5s.semanas.length - 1] || ''})
              </p>
              <p className="text-[10px] text-slate-500">
                Suaviza variações espúrias e atrasos de digitação de fichas no Sinan.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Visualizador Recharts com Alternância entre Curva Oficial MS e Série Contínua */}
      <div className="bg-slate-950/90 border border-slate-800/90 rounded-xl p-2 sm:p-3.5 space-y-2">
        {visibleMilestones.length > 0 && showMilestones && displayMode === 'continua' && (
          <div className="flex items-center justify-between px-1 text-[10px] text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-300">
              <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
              <span>Veja detalhes nas notas abaixo.</span>
            </span>
          </div>
        )}
        <div className="h-72 sm:h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {displayMode === 'oficial_ano' ? (
              <ComposedChart data={weeklyByYearChartData} margin={{ top: 20, right: isMobile ? 4 : 20, left: isMobile ? 0 : 5, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="semana" 
                  stroke="#64748b" 
                  tickLine={false}
                  interval={isMobile ? 3 : (weeklyByYearChartData.length > 20 ? 1 : 0)}
                  height={isMobile ? 38 : 48}
                  tick={{ angle: -30, textAnchor: 'end', fontSize: isMobile ? 8 : 10, fill: '#64748b', dy: 4, dx: -3 }}
                  label={isMobile ? undefined : { 
                    value: minWeekFilter && maxWeekFilter ? `Semana epidemiológica (${minWeekFilter} a ${maxWeekFilter})` : 'Semana epidemiológica (1 a 52)', 
                    position: 'insideBottom', 
                    offset: -12, 
                    fill: '#64748b', 
                    fontSize: 10 
                  }}
                />
                <YAxis 
                  stroke="#0891b2" 
                  fontSize={isMobile ? 8 : 10} 
                  width={isMobile ? 32 : 40}
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip content={customTooltip} />
                <Legend 
                  verticalAlign="bottom"
                  wrapperStyle={{ fontSize: '11px', paddingTop: '14px', color: '#cbd5e1' }} 
                  formatter={(value) => <span style={{ color: '#cbd5e1', fontWeight: 500 }}>{value}</span>}
                />
                {displayedYears.includes(2022) && <Bar dataKey="2022" name="2022" fill="#22c55e" radius={[2, 2, 0, 0]} />}
                {displayedYears.includes(2023) && <Bar dataKey="2023" name="2023" fill="#f97316" radius={[2, 2, 0, 0]} />}
                {displayedYears.includes(2024) && <Bar dataKey="2024" name="2024" fill="#94a3b8" radius={[2, 2, 0, 0]} />}
                {displayedYears.includes(2025) && <Bar dataKey="2025" name="2025" fill="#eab308" radius={[2, 2, 0, 0]} />}
                {displayedYears.includes(2026) && <Bar dataKey="2026" name="2026" fill="#06b6d4" radius={[2, 2, 0, 0]} />}
              </ComposedChart>
            ) : (
              <ComposedChart data={chartData} margin={{ top: 32, right: showVaccines ? (isMobile ? 0 : 20) : (isMobile ? 0 : 10), left: isMobile ? 0 : 5, bottom: 25 }}>
                <defs>
                  <pattern id="stripe-preliminar" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="6" stroke="#38bdf8" strokeWidth="2" />
                    <line x1="0" y1="0" x2="6" y2="0" stroke="#0e7490" strokeWidth="0.8" />
                  </pattern>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="semana" 
                  stroke="#64748b" 
                  tickLine={false}
                  interval={xAxisInterval}
                  height={isMobile ? 38 : 48}
                  tick={{ angle: -30, textAnchor: 'end', fontSize: isMobile ? 8 : 10, fill: '#64748b', dy: 4, dx: -3 }}
                  tickFormatter={(semana: string) => formatWeekToCommonDate(semana, chartData.length <= 15 ? 'dia_mes' : 'mes_ano')}
                />
                {/* Eixo Esquerdo: Casos Notificados */}
                <YAxis 
                  yAxisId="casos"
                  stroke="#0891b2" 
                  fontSize={isMobile ? 8 : 10} 
                  width={isMobile ? 32 : 40}
                  tickLine={false} 
                  axisLine={false}
                />
                {/* Eixo Direito: Doses de Vacina Aplicadas */}
                {showVaccines && (
                  <YAxis 
                    yAxisId="doses"
                    orientation="right"
                    stroke="#10b981" 
                    fontSize={isMobile ? 8 : 10} 
                    width={isMobile ? 34 : 45}
                    tickLine={false} 
                    axisLine={false}
                  />
                )}
                <Tooltip content={customTooltip} />
                <Legend 
                  wrapperStyle={{ fontSize: '11px', paddingTop: '16px', color: '#cbd5e1' }}
                  formatter={(value) => <span style={{ color: '#cbd5e1', fontWeight: 500 }}>{value}</span>}
                />

                {/* Doses de Vacina Aplicadas Superpostas no Mesmo Gráfico em Degraus (Stepwise) */}
                {showVaccines && (
                  <Area 
                    yAxisId="doses"
                    type="stepAfter" 
                    dataKey="dosesAcumuladas" 
                    name="Doses Aplicadas no SUS (Eixo Direito)" 
                    stroke="#10b981" 
                    fill="#064e3b" 
                    fillOpacity={0.2} 
                    strokeWidth={2}
                  />
                )}

                {/* Casos Notificados Semanais ou Acumulados */}
                {metricView === 'novos' ? (
                  <>
                    <Bar 
                      yAxisId="casos"
                      dataKey="casosNovos" 
                      name="Casos Notificados (Semana)" 
                      fill="#0891b2" 
                      radius={[3, 3, 0, 0]} 
                    >
                      {chartData.map((entry, index) => {
                        const isPreliminar = entry.statusConsolidacao === 'preliminar_em_curso';
                        return (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={isPreliminar ? "url(#stripe-preliminar)" : "#0891b2"}
                            stroke={isPreliminar ? "#38bdf8" : undefined}
                            strokeWidth={isPreliminar ? 1.5 : 0}
                          />
                        );
                      })}
                    </Bar>
                    <Line 
                      yAxisId="casos"
                      type="monotone" 
                      dataKey="mediaMovel7d" 
                      name="Média Móvel (3 Semanas / 21 Dias)" 
                      stroke="#f59e0b" 
                      strokeWidth={2} 
                      dot={false} 
                    />
                  </>
                ) : (
                  <Area 
                    yAxisId="casos"
                    type="monotone" 
                    dataKey="casosAcumulados" 
                    name="Casos Acumulados" 
                    stroke="#6366f1" 
                    fill="#312e81" 
                    fillOpacity={0.35} 
                  />
                )}

                {/* Hitos Vacinais Filtrados com Base na Aplicabilidade Territorial e Símbolos Temáticos */}
                {showMilestones && applicableMilestones.map((m, idx) => {
                  const color = m.cor || '#94a3b8';
                  const symbol = m.simbolo || '•';
                  const dy = idx % 2 === 0 ? -8 : -20;

                  return (
                    <ReferenceLine 
                      key={m.id}
                      yAxisId="casos"
                      x={m.semana} 
                      stroke={color} 
                      strokeDasharray="3 3" 
                      label={{ 
                        value: symbol, 
                        position: 'top', 
                        dy: dy,
                        fill: color, 
                        fontSize: isMobile ? 12 : 13,
                        fontWeight: 700,
                        textAnchor: 'middle'
                      }} 
                    />
                  );
                })}
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rodapé Informativo das Tendências (Posicionado Acima dos Hitos) */}
      {displayMode === 'continua' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <TrendingUp className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              <strong>Tendência 3 semanas:</strong> Trajetória linear recente calculada por regressão de mínimos quadrados.
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
            <span>
              <strong>Tendência 5 semanas:</strong> Suavização ampliada para absorver atrasos de notificação no Sinan.
            </span>
          </div>

          <div className="flex items-center justify-start md:justify-end text-slate-400 font-mono text-[11px]">
            Filtro ativo: {currentState ? `${currentState.nome} (${currentState.uf})` : 'Brasil Total (27 UFs)'}
          </div>
        </div>
      )}

      {/* Menu Colapsível com a Explicação dos Hitos (Abaixo das Tendências) */}
      {displayMode === 'continua' ? (
        <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden text-xs transition-all">
          <button
            onClick={() => setIsMilestonesExpanded(!isMilestonesExpanded)}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-900/60 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>
                Notas Explicativas dos Hitos & Intervenções em Saúde ({applicableMilestones.length} ativos para {currentState ? currentState.nome : 'Brasil'})
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-cyan-400 font-medium">
              <span>{isMilestonesExpanded ? 'Ocultar detalhes' : 'Ver detalhes dos marcos'}</span>
              {isMilestonesExpanded ? (
                <ChevronUp className="w-4 h-4 text-cyan-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-cyan-400" />
              )}
            </div>
          </button>

          {isMilestonesExpanded && (
            <div className="p-3.5 pt-0 border-t border-slate-900">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-3">
                {applicableMilestones.map((m, idx) => {
                  const color = m.cor || '#94a3b8';
                  const symbol = m.simbolo || '•';
                  const isLatest = idx === applicableMilestones.length - 1;
                  return (
                    <div key={m.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-1 text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <span 
                              className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-sm"
                              style={{
                                backgroundColor: `${color}25`,
                                color: color,
                                border: `1.5px solid ${color}`
                              }}
                              title={`Símbolo no gráfico: ${symbol}`}
                            >
                              {symbol}
                            </span>
                            <strong className="text-cyan-300 font-mono">{m.semana}</strong>
                          </div>
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                            m.categoria === 'vacina' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                            m.categoria === 'clinica' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                            'bg-sky-950 text-sky-400 border border-sky-800'
                          }`}>
                            {m.categoria}
                          </span>
                        </div>
                        {m.linkFonte ? (
                          <a
                            href={m.linkFonte}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/title inline-flex items-center gap-1.5 font-bold text-white text-[11px] leading-tight hover:text-cyan-300 transition-colors"
                            title={`Acessar estudo / fonte oficial: ${m.rotuloFonte || m.titulo}`}
                          >
                            <span className="group-hover/title:underline">{m.titulo}</span>
                            <ExternalLink className="w-3 h-3 text-cyan-400 shrink-0 group-hover/title:translate-x-0.5 transition-transform" />
                          </a>
                        ) : (
                          <h5 className="font-bold text-white text-[11px] leading-tight">{m.titulo}</h5>
                        )}
                        <p className="text-[11px] text-slate-400 leading-snug">{m.descricao}</p>
                      </div>
                      <div className="space-y-1.5 pt-1.5 border-t border-slate-800/80 mt-1">
                        {m.linkFonte && (
                          <div>
                            <a
                              href={m.linkFonte}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 hover:underline font-medium"
                            >
                              <ExternalLink className="w-3 h-3 shrink-0" />
                              <span className="truncate">Fonte: {m.rotuloFonte || 'Ver fonte oficial'}</span>
                            </a>
                          </div>
                        )}
                        {isLatest && (
                          <div className="pt-1 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-1 text-[9.5px]">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                              Campanha Ativa
                            </span>
                            <span className="text-slate-400 font-mono flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                              <span>Próxima: <strong className="text-cyan-300">{syncMetadata.proximaAtualizacaoPrevista}</strong></span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Rodapé da Última Atualização da Campanha */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/50">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Campanha Ativa
                  </span>
                  <span className="text-slate-300 text-[11px]">
                    Última atualização: <strong className="text-slate-100 font-mono">{syncMetadata.ultimaAtualizacaoFormatada}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                  <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Próxima atualização correspondente: <strong className="text-cyan-300">{syncMetadata.proximaAtualizacaoPrevista}</strong></span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Padrão Oficial do Ministério da Saúde:</strong> Comparação sobreposta das semanas 1 a 52 por ano (2022 a 2026). Dados idênticos extraídos diretamente da query DAX do modelo semântico do PowerBI oficial.
            </span>
          </div>
          <a
            href="https://www.gov.br/saude/pt-br/composicao/svsa/cnie/painel-mpox"
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 hover:underline shrink-0 font-medium"
          >
            Ver no Portal Gov.br →
          </a>
        </div>
      )}
    </div>
  );
};
