import { useState, useMemo } from 'react';
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
  ReferenceLine
} from 'recharts';
import { getEpidemicCurve, getApplicableMilestones, getWeeklyByYear } from '../data/time_series';
import { statesData } from '../data/epidemiology';
import { BarChart3, TrendingUp, Calendar, Filter, Sparkles, Syringe, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface EpidemicCurveChartProps {
  selectedUF: string | null;
  onSelectUF: (uf: string | null) => void;
  startWeek?: string;
  endWeek?: string;
  periodLabel?: string;
}

export const EpidemicCurveChart: FC<EpidemicCurveChartProps> = ({ 
  selectedUF, 
  onSelectUF,
  startWeek,
  endWeek,
  periodLabel
}) => {
  const [displayMode, setDisplayMode] = useState<'oficial_ano' | 'continua'>('oficial_ano');
  const [metricView, setMetricView] = useState<'novos' | 'acumulados'>('novos');
  const [showMilestones, setShowMilestones] = useState(true);
  const [showTrends, setShowTrends] = useState(true);
  const [showVaccines, setShowVaccines] = useState(true);
  const [isMilestonesExpanded, setIsMilestonesExpanded] = useState(false);

  // Estados em ordem alfabética estrita pelo nome
  const sortedStates = useMemo(() => {
    return [...statesData].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  }, []);

  // Recalcula dinamicamente a curva contínua com base no estado e período selecionados
  const chartData = useMemo(() => {
    return getEpidemicCurve(selectedUF, startWeek, endWeek);
  }, [selectedUF, startWeek, endWeek]);

  // Recalcula dados semanais por ano (1 a 52) idênticos ao painel oficial PowerBI do MS
  const weeklyByYearChartData = useMemo(() => {
    return getWeeklyByYear(selectedUF);
  }, [selectedUF]);

  // Marcos aplicáveis ao território atual
  const applicableMilestones = useMemo(() => {
    return getApplicableMilestones(selectedUF);
  }, [selectedUF]);

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
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-xs space-y-1.5 max-w-xs">
          <div className="font-semibold text-slate-200 border-b border-slate-800 pb-1 flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              {label}
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
                <span className="text-slate-400">Média Móvel (7d): </span>
                {dataPoint?.mediaMovel7d}
              </p>
              {dataPoint?.tendencia3s !== null && dataPoint?.tendencia3s !== undefined && (
                <p className="text-rose-400 font-mono text-[11px]">
                  <span>Regressão Linear (3 sem): </span>
                  {dataPoint?.tendencia3s} casos/sem
                </p>
              )}
              {dataPoint?.tendencia5s !== null && dataPoint?.tendencia5s !== undefined && (
                <p className="text-sky-300 font-mono text-[11px]">
                  <span>Regressão Linear (5 sem): </span>
                  {dataPoint?.tendencia5s} casos/sem
                </p>
              )}
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

          {dataPoint?.marco && (
            <div className="mt-2 p-1.5 rounded bg-emerald-950/80 border border-emerald-800/80 text-[10px] text-emerald-300 flex items-start gap-1">
              <Syringe className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
              <span>{dataPoint.marco}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
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
          <p className="text-xs text-slate-400 mt-0.5">
            Exibindo dados para: <strong className="text-slate-200">{stateLabel}</strong> • {displayMode === 'oficial_ano' ? 'Comparação anual padronizada (SE 1 a 52)' : `Série contínua (${periodLabel || 'SE 22/2022 a SE 46/2026'})`}
          </p>
        </div>

        {/* Barra de Filtro de Estado Ordenada Alfabeticamente e Modos */}
        <div className="flex flex-wrap items-center gap-2">
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
              Oficial MS (1-52 por Ano)
            </button>
            <button
              onClick={() => setDisplayMode('continua')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                displayMode === 'continua'
                  ? 'bg-cyan-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Série Contínua (2022-2026)
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
                {metricView === 'novos' && (
                  <button
                    onClick={() => setShowTrends(!showTrends)}
                    className={`px-2 py-1 rounded border transition-colors ${
                      showTrends 
                        ? 'bg-cyan-950/80 border-cyan-700 text-cyan-300' 
                        : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}
                  >
                    Tendências (3s/5s)
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Visualizador Recharts com Alternância entre Curva Oficial MS e Série Contínua */}
      <div className="h-80 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          {displayMode === 'oficial_ano' ? (
            <ComposedChart data={weeklyByYearChartData} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="semana" 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false}
                interval={1}
                label={{ value: 'Semana epidemiológica', position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 10 }}
              />
              <YAxis 
                stroke="#0891b2" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
              />
              <Tooltip content={customTooltip} />
              <Legend 
                verticalAlign="bottom"
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} 
              />
              <Bar dataKey="2022" name="2022" fill="#22c55e" radius={[2, 2, 0, 0]} />
              <Bar dataKey="2023" name="2023" fill="#f97316" radius={[2, 2, 0, 0]} />
              <Bar dataKey="2024" name="2024" fill="#94a3b8" radius={[2, 2, 0, 0]} />
              <Bar dataKey="2025" name="2025" fill="#eab308" radius={[2, 2, 0, 0]} />
              <Bar dataKey="2026" name="2026" fill="#06b6d4" radius={[2, 2, 0, 0]} />
            </ComposedChart>
          ) : (
            <ComposedChart data={chartData} margin={{ top: 15, right: showVaccines ? 40 : 15, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="semana" 
                stroke="#64748b" 
                fontSize={10} 
                tickLine={false}
                interval={3}
              />
              {/* Eixo Esquerdo: Casos Notificados */}
              <YAxis 
                yAxisId="casos"
                stroke="#0891b2" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
              />
              {/* Eixo Direito: Doses de Vacina Aplicadas */}
              {showVaccines && (
                <YAxis 
                  yAxisId="doses"
                  orientation="right"
                  stroke="#10b981" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                />
              )}
              <Tooltip content={customTooltip} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

              {/* Doses de Vacina Aplicadas Superpostas no Mesmo Gráfico */}
              {showVaccines && (
                <Area 
                  yAxisId="doses"
                  type="monotone" 
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
                  />
                  <Line 
                    yAxisId="casos"
                    type="monotone" 
                    dataKey="mediaMovel7d" 
                    name="Média Móvel de Casos" 
                    stroke="#f59e0b" 
                    strokeWidth={2} 
                    dot={false} 
                  />
                  {showTrends && (
                    <Line 
                      yAxisId="casos"
                      type="linear"
                      dataKey="tendencia3s" 
                      name="Tendência Linear (Últimas 3 Semanas)" 
                      stroke="#f43f5e" 
                      strokeDasharray="4 4" 
                      strokeWidth={2.5} 
                      dot={false} 
                    />
                  )}
                  {showTrends && (
                    <Line 
                      yAxisId="casos"
                      type="linear"
                      dataKey="tendencia5s" 
                      name="Tendência Linear (Últimas 5 Semanas)" 
                      stroke="#38bdf8" 
                      strokeDasharray="6 6" 
                      strokeWidth={2} 
                      dot={false} 
                    />
                  )}
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

              {/* Hitos Vacinais Filtrados com Base na Aplicabilidade Territorial e Alturas Escalonadas */}
              {showMilestones && applicableMilestones.map((m, idx) => {
                const colors: Record<string, string> = {
                  m1: '#38bdf8',
                  m2: '#34d399',
                  m3: '#60a5fa',
                  m4: '#c084fc',
                  m5: '#fb923c',
                  m6: '#f43f5e'
                };
                const color = colors[m.id] || '#94a3b8';
                const isEven = idx % 2 === 0;
                return (
                  <ReferenceLine 
                    key={m.id}
                    yAxisId="casos"
                    x={m.semana} 
                    stroke={color} 
                    strokeDasharray="3 3" 
                    label={{ 
                      value: m.tituloCurto || m.titulo, 
                      position: 'top', 
                      dy: isEven ? -8 : -26,
                      fill: color, 
                      fontSize: 10,
                      fontWeight: 600
                    }} 
                  />
                );
              })}
            </ComposedChart>
          )}
        </ResponsiveContainer>
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
                {applicableMilestones.map((m) => (
                  <div key={m.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between gap-1 text-[11px]">
                      <strong className="text-cyan-300 font-mono">{m.semana}</strong>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                        m.categoria === 'vacina' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                        m.categoria === 'clinica' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                        'bg-sky-950 text-sky-400 border border-sky-800'
                      }`}>
                        {m.categoria}
                      </span>
                    </div>
                    <h5 className="font-bold text-white text-[11px] leading-tight">{m.titulo}</h5>
                    <p className="text-[11px] text-slate-400 leading-snug">{m.descricao}</p>
                  </div>
                ))}
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
