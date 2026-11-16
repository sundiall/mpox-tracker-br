import { useState } from 'react';
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
  Area
} from 'recharts';
import { nationalEpidemicCurve } from '../data/time_series';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';

interface EpidemicCurveChartProps {
  ufNome?: string;
}

export const EpidemicCurveChart: FC<EpidemicCurveChartProps> = ({ ufNome = 'Brasil' }) => {
  const [metricView, setMetricView] = useState<'novos' | 'acumulados'>('novos');

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-xs space-y-1">
          <p className="font-semibold text-slate-200 border-b border-slate-800 pb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            Semana Epidemiológica: {label}
          </p>
          {metricView === 'novos' ? (
            <>
              <p className="text-cyan-400">
                <span className="font-medium text-slate-400">Casos Notificados: </span>
                {payload[0]?.value?.toLocaleString('pt-BR')}
              </p>
              <p className="text-amber-400">
                <span className="font-medium text-slate-400">Média Móvel (7d): </span>
                {payload[1]?.value}
              </p>
            </>
          ) : (
            <p className="text-indigo-300">
              <span className="font-medium text-slate-400">Casos Acumulados: </span>
              {payload[0]?.value?.toLocaleString('pt-BR')}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
      {/* Header do Gráfico */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            Curva Epidêmica & Série Temporal de Notificações ({ufNome})
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Semanas Epidemiológicas (SE) registradas no Sistema de Informação de Agravos de Notificação (Sinan)
          </p>
        </div>

        {/* Toggle Novos vs Acumulados */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs self-start sm:self-auto">
          <button
            onClick={() => setMetricView('novos')}
            className={`px-3 py-1 rounded-md transition-colors ${
              metricView === 'novos'
                ? 'bg-cyan-600 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Casos por Semana
          </button>
          <button
            onClick={() => setMetricView('acumulados')}
            className={`px-3 py-1 rounded-md transition-colors ${
              metricView === 'acumulados'
                ? 'bg-indigo-600 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Casos Acumulados
          </button>
        </div>
      </div>

      {/* Visualizador Recharts */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {metricView === 'novos' ? (
            <ComposedChart data={nationalEpidemicCurve} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="semana" 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false}
                interval={2}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
              />
              <Tooltip content={customTooltip} />
              <Legend 
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} 
              />
              <Bar 
                dataKey="casosNovos" 
                name="Casos Notificados (Semana)" 
                fill="#0891b2" 
                radius={[4, 4, 0, 0]} 
              />
              <Line 
                type="monotone" 
                dataKey="mediaMovel7d" 
                name="Média Móvel" 
                stroke="#f59e0b" 
                strokeWidth={2} 
                dot={false} 
              />
            </ComposedChart>
          ) : (
            <ComposedChart data={nationalEpidemicCurve} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="semana" 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false}
                interval={2}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
              />
              <Tooltip content={customTooltip} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area 
                type="monotone" 
                dataKey="casosAcumulados" 
                name="Casos Acumulados no Brasil" 
                stroke="#6366f1" 
                fill="#312e81" 
                fillOpacity={0.4} 
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
        <span className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          Pico da onda inicial registrado entre as SE 32 e 34 de 2022 (&gt; 1.200 casos/semana).
        </span>
        <span className="font-mono text-slate-500">Fonte: Sinan / SVSA / Ministério da Saúde</span>
      </div>
    </div>
  );
};
