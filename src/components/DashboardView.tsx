import { useState } from 'react';
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
  Building2
} from 'lucide-react';
import { nationalSummary } from '../data/epidemiology';
import type { StateEpidemiology } from '../data/epidemiology';
import { KPICard } from './KPICard';
import { BrazilMap } from './BrazilMap';
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

export const DashboardView: FC<DashboardViewProps> = ({
  states,
  selectedUF,
  onSelectUF,
  onNavigateToTab
}) => {
  const [inspectingState, setInspectingState] = useState<StateEpidemiology | null>(null);

  const currentState = selectedUF ? states.find((s) => s.uf === selectedUF) : null;

  const totalConfirmados = currentState ? currentState.casosConfirmados : nationalSummary.totalConfirmados;
  const totalProvaveis = currentState ? currentState.casosProvaveis : nationalSummary.totalProvaveis;
  const totalSuspeitos = currentState ? currentState.casosSuspeitos : nationalSummary.totalSuspeitos;
  const totalObitos = currentState ? currentState.obitos : nationalSummary.totalObitos;
  const taxaLetalidade = currentState ? currentState.taxaLetalidade : nationalSummary.taxaLetalidadeNacional;
  const dosesAplicadas = currentState ? currentState.dosesAplicadas : nationalSummary.totalDosesAplicadas;
  const dosesDistribuidas = currentState ? currentState.dosesDistribuidas : nationalSummary.totalDosesDistribuidas;

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
      {/* Banner Institucional & Contexto Científico */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                Vigilância Epidemiológica Baseada em Evidências
              </span>
              <span className="text-xs text-slate-400">
                {selectedUF ? `Foco Territorial: ${currentState?.nome} (${currentState?.uf})` : 'Âmbito: Brasil (Consolidado Nacional)'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Painel de Monitoramento Epidemiológico & Resposta à Mpox
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Consolidação analítica de dados oficiais abertos do Ministério da Saúde (Sinan/SVSA/DATHI) e Fiocruz.
              Apresentação rigorosa de séries temporais, perfil demográfico sem moralismos e orientação de acesso
              à vacinação e testagem pelo SUS.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={() => onNavigateToTab('guia')}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4" />
              Sintomas & Guia Clínico
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
      </div>

      {/* Grid de KPIs Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          titulo="Casos Confirmados"
          valor={totalConfirmados}
          subtexto={selectedUF ? `Em ${currentState?.nome}` : 'Acumulado no Brasil'}
          icon={Activity}
          destaqueCor="cyan"
          badge={currentState ? { texto: trendInfo.texto, tipo: trendInfo.tipo } : { texto: 'Consolidado', tipo: 'neutro' }}
        />

        <KPICard
          titulo="Casos Prováveis / Suspeitos"
          valor={totalSuspeitos + totalProvaveis}
          subtexto={`${totalProvaveis} prováveis e ${totalSuspeitos} sob investigação`}
          icon={AlertTriangle}
          destaqueCor="amber"
          badge={{ texto: 'Em Investigação', tipo: 'alerta' }}
        />

        <KPICard
          titulo="Total de Óbitos"
          valor={totalObitos}
          subtexto={`Taxa de letalidade: ${taxaLetalidade.toFixed(2)}%`}
          icon={ShieldCheck}
          destaqueCor="purple"
          badge={{ texto: 'Letalidade Baixa', tipo: 'positivo' }}
        />

        <KPICard
          titulo="Doses Aplicadas no SUS"
          valor={dosesAplicadas}
          subtexto={`${dosesDistribuidas.toLocaleString('pt-BR')} doses enviadas`}
          icon={Syringe}
          destaqueCor="emerald"
          badge={{ texto: `${((dosesAplicadas / dosesDistribuidas) * 100).toFixed(0)}% Utilizadas`, tipo: 'positivo' }}
        />
      </div>

      {/* Gráfico 1: Curva Epidêmica Temporal (Recharts) */}
      <EpidemicCurveChart ufNome={currentState?.nome || 'Brasil'} />

      {/* Gráfico 2: Perfil Demográfico & Manifestações Clínicas (Recharts) */}
      <DemographicBreakdownChart />

      {/* Mapa do Brasil Interativo */}
      <BrazilMap states={states} selectedUF={selectedUF} onSelectUF={onSelectUF} />

      {/* Tabela Navegável, Paginada e Ordenável (Google Modern Web Guidance) */}
      <SortableStateTable 
        states={states} 
        onOpenStateInspector={(state) => setInspectingState(state)} 
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
