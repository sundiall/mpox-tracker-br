import { useState, useMemo } from 'react';
import type { FC } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { getDemographicBreakdown } from '../data/epidemiology_breakdown';
import { Users, Filter, Stethoscope, ShieldPlus } from 'lucide-react';

interface DemographicBreakdownChartProps {
  selectedUF: string | null;
  onSelectUF?: (uf: string | null) => void;
  periodTotalCases?: number;
  periodLabel?: string;
}

const DONUT_COLORS_SEX = ['#0284c7', '#f43f5e'];
const DONUT_COLORS_AGE = ['#94a3b8', '#06b6d4', '#0284c7', '#3b82f6', '#6366f1', '#475569'];
const DONUT_COLORS_RACE = ['#38bdf8', '#fbbf24', '#f87171', '#a78bfa', '#34d399', '#64748b'];
const DONUT_COLORS_HIV = ['#6366f1', '#06b6d4', '#475569'];
const DONUT_COLORS_SEV = ['#10b981', '#f59e0b', '#64748b', '#ef4444'];

export const DemographicBreakdownChart: FC<DemographicBreakdownChartProps> = ({
  selectedUF,
  onSelectUF,
  periodTotalCases,
  periodLabel
}) => {
  const [activeTab, setActiveTab] = useState<'sociodemo' | 'sintomas_lesoes' | 'imunidade'>('sociodemo');

  const rawBreakdown = getDemographicBreakdown(selectedUF);

  const scale = periodTotalCases !== undefined ? (periodTotalCases / 15488) : 1;
  const activeBaseCasos = periodTotalCases !== undefined 
    ? (selectedUF ? Math.round(periodTotalCases * (rawBreakdown.totalBaseCasos / 15488)) : periodTotalCases)
    : rawBreakdown.totalBaseCasos;

  const breakdown = useMemo(() => {
    return {
      ...rawBreakdown,
      totalBaseCasos: activeBaseCasos,
      sexDistribution: rawBreakdown.sexDistribution.map(item => ({
        ...item,
        totalCasos: Math.round(item.totalCasos * scale)
      })),
      ageDistribution: rawBreakdown.ageDistribution.map(item => ({
        ...item,
        totalCasos: Math.round(item.totalCasos * scale)
      })),
      raceDistribution: rawBreakdown.raceDistribution.map(item => ({
        ...item,
        totalCasos: Math.round(item.totalCasos * scale)
      })),
      immuneStatus: rawBreakdown.immuneStatus.map(item => ({
        ...item,
        totalCasos: Math.round(item.totalCasos * scale)
      })),
      severityMetrics: rawBreakdown.severityMetrics.map(item => ({
        ...item,
        totalCasos: Math.round(item.totalCasos * scale)
      })),
      genderIdentityDistribution: rawBreakdown.genderIdentityDistribution.map(item => ({
        ...item,
        totalCasos: Math.round(item.totalCasos * scale)
      })),
      sexualBehaviorDistribution: rawBreakdown.sexualBehaviorDistribution.map(item => ({
        ...item,
        totalCasos: Math.round(item.totalCasos * scale)
      })),
      symptomsPrevalence: rawBreakdown.symptomsPrevalence.map(item => ({
        ...item,
        casosReportados: Math.round(item.casosReportados * scale)
      })),
      lesionLocation: rawBreakdown.lesionLocation.map(item => ({
        ...item
      }))
    };
  }, [rawBreakdown, scale, activeBaseCasos]);

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs space-y-1">
          <p className="font-semibold text-slate-200">
            {data.categoria || data.sintoma || data.localizacao}
          </p>
          <p className="text-cyan-400 font-medium">
            Proporção: {data.porcentagem || data.prevalenciaPercentual || data.frequenciaPercentual}%
          </p>
          {data.totalCasos !== undefined && (
            <p className="text-slate-400 font-mono">
              Casos estimados na base: {data.totalCasos.toLocaleString('pt-BR')}
            </p>
          )}
          {data.casosReportados !== undefined && (
            <p className="text-slate-400 font-mono">
              Casos estimados na base: {data.casosReportados.toLocaleString('pt-BR')}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
      {/* Header com Filtro Territorial e Navegação por Abas Consolidadas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              Perfil Epidemiológico & Manifestações Clínicas (Sinan / DATASUS)
            </h3>
            {selectedUF && onSelectUF && (
              <button
                onClick={() => onSelectUF(null)}
                title="Limpar filtro e voltar para o Brasil inteiro"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 hover:bg-cyan-900 transition-colors cursor-pointer"
              >
                <Filter className="w-3 h-3" />
                {selectedUF} ✕
              </button>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Território ativo: <span className="text-cyan-300 font-medium">{breakdown.nomeTerritorio}</span>{periodLabel ? ` • Recorte: ${periodLabel}` : ''} • Base oficial consolidada: <span className="font-mono text-slate-200 font-bold">{breakdown.totalBaseCasos.toLocaleString('pt-BR')}</span> casos confirmados
          </p>
        </div>

        {/* 3 Abas Consolidadas Conforme Demanda */}
        <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('sociodemo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'sociodemo'
                ? 'bg-cyan-600 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Perfil Sociodemográfico
          </button>

          <button
            onClick={() => setActiveTab('sintomas_lesoes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'sintomas_lesoes'
                ? 'bg-cyan-600 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            Sintomas & Topografia das Lesões
          </button>

          <button
            onClick={() => setActiveTab('imunidade')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'imunidade'
                ? 'bg-cyan-600 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldPlus className="w-3.5 h-3.5" />
            Condição Imunológica & Gravidade
          </button>
        </div>
      </div>

      {/* ABA 1: PERFIL SOCIODEMOGRÁFICO CONSOLIDADO COM GRÁFICOS DONUT */}
      {activeTab === 'sociodemo' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Donut 1: Sexo ao Nascimento */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center">
              <span className="text-xs font-semibold text-slate-300 block mb-1">
                Sexo Atribuído ao Nascer
              </span>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={customTooltip} />
                    <Pie
                      data={breakdown.sexDistribution}
                      dataKey="porcentagem"
                      nameKey="categoria"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={3}
                    >
                      {breakdown.sexDistribution.map((_, idx) => (
                        <Cell key={`cell-sex-${idx}`} fill={DONUT_COLORS_SEX[idx % DONUT_COLORS_SEX.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-4 text-xs font-mono pt-1">
                <span className="flex items-center gap-1 text-cyan-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-600"></span>
                  Masc: 93% ({breakdown.sexDistribution[0]?.totalCasos.toLocaleString('pt-BR')})
                </span>
                <span className="flex items-center gap-1 text-rose-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  Fem: 7% ({breakdown.sexDistribution[1]?.totalCasos.toLocaleString('pt-BR')})
                </span>
              </div>
            </div>

            {/* Donut 2: Faixa Etária */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center">
              <span className="text-xs font-semibold text-slate-300 block mb-1">
                Faixa Etária (Média: 33a • Mediana: 32a)
              </span>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={customTooltip} />
                    <Pie
                      data={breakdown.ageDistribution}
                      dataKey="porcentagem"
                      nameKey="categoria"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={2}
                    >
                      {breakdown.ageDistribution.map((_, idx) => (
                        <Cell key={`cell-age-${idx}`} fill={DONUT_COLORS_AGE[idx % DONUT_COLORS_AGE.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-slate-300 pt-1">
                <span className="text-cyan-300">18-29a: 37,8%</span>
                <span className="text-blue-400 font-bold">30-39a: 43,5%</span>
                <span className="text-indigo-400">40-49a: 13,2%</span>
                <span className="text-slate-400">Outros: 5,5%</span>
              </div>
            </div>

            {/* Donut 3: Raça / Cor */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center">
              <span className="text-xs font-semibold text-slate-300 block mb-1">
                Raça / Cor Autodeclarada (IBGE)
              </span>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={customTooltip} />
                    <Pie
                      data={breakdown.raceDistribution}
                      dataKey="porcentagem"
                      nameKey="categoria"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={2}
                    >
                      {breakdown.raceDistribution.map((_, idx) => (
                        <Cell key={`cell-race-${idx}`} fill={DONUT_COLORS_RACE[idx % DONUT_COLORS_RACE.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-slate-300 pt-1">
                <span className="text-sky-300">Branca: 42%</span>
                <span className="text-amber-300">Parda: 32%</span>
                <span className="text-rose-400">Preta: 10%</span>
                <span className="text-slate-400">Ignorado: 12,8%</span>
              </div>
            </div>
          </div>

          {/* Destaques de Identidade de Gênero e Orientação */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="font-bold text-slate-200">Identidade de Gênero Oficial</span>
              <p className="text-slate-400 text-[11px]">
                Homem cisgênero (<strong className="text-cyan-300">74%</strong>), Mulher cisgênero (<strong className="text-rose-300">7%</strong>), Mulheres e Homens Trans / Travesti / Não binário (<strong className="text-purple-300">3%</strong>), Ignorado (<strong className="text-slate-400">16%</strong>).
              </p>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="font-bold text-slate-200">Comportamento & Práticas Sexuais</span>
              <p className="text-slate-400 text-[11px]">
                Relações sexuais com homens (<strong className="text-cyan-300">58%</strong> exclusivo + <strong className="text-cyan-400">7%</strong> com ambos = 65%), relações heterossexuais (<strong className="text-emerald-300">9%</strong>), sem informação na ficha (<strong className="text-slate-400">26%</strong>).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: SINTOMAS E LOCAL DAS LESÕES CONSOLIDADOS NA MESMA ABA */}
      {activeTab === 'sintomas_lesoes' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Gráfico Esquerdo: Sinais e Sintomas */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="border-b border-slate-800/80 pb-1.5">
                <span className="font-bold text-white text-xs block">
                  1. Prevalência dos Sinais & Sintomas Clínicos
                </span>
                <span className="text-[11px] text-slate-400">
                  Frequência percentual registrada nas anamneses do SUS
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={breakdown.symptomsPrevalence} 
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 60, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                    <XAxis type="number" stroke="#64748b" fontSize={10} unit="%" domain={[0, 100]} />
                    <YAxis type="category" dataKey="sintoma" stroke="#94a3b8" fontSize={10} tickLine={false} width={120} />
                    <Tooltip content={customTooltip} />
                    <Bar dataKey="prevalenciaPercentual" name="Frequência (%)" fill="#0d9488" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-slate-400">
                Erupções cutâneas ativas (89,5%) e febre de início súbito (58,2%) são os sintomas mais frequentes.
              </p>
            </div>

            {/* Gráfico Direito: Topografia Anatômica das Lesões */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="border-b border-slate-800/80 pb-1.5">
                <span className="font-bold text-white text-xs block">
                  2. Topografia Anatômica das Lesões Cutâneas
                </span>
                <span className="text-[11px] text-slate-400">
                  Locais do corpo com manifestação de vesículas, pústulas ou crostas
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={breakdown.lesionLocation} 
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 80, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                    <XAxis type="number" stroke="#64748b" fontSize={10} unit="%" domain={[0, 100]} />
                    <YAxis type="category" dataKey="localizacao" stroke="#94a3b8" fontSize={10} tickLine={false} width={140} />
                    <Tooltip content={customTooltip} />
                    <Bar dataKey="frequenciaPercentual" name="Frequência (%)" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-slate-400">
                Acometimento predominantemente anogenital (62,4% genital, 44,1% perianal), reflexo da transmissão íntima.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: CONDIÇÃO IMUNOLÓGICA & GRAVIDADE COM DONUTS */}
      {activeTab === 'imunidade' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Donut 1: Coinfecção com HIV */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center">
              <span className="text-xs font-semibold text-slate-300 block mb-1">
                Status de Coinfecção com HIV (Painel Oficial CNIE/MS)
              </span>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={customTooltip} />
                    <Pie
                      data={breakdown.immuneStatus}
                      dataKey="porcentagem"
                      nameKey="categoria"
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={70}
                      paddingAngle={3}
                    >
                      {breakdown.immuneStatus.map((_, idx) => (
                        <Cell key={`cell-hiv-${idx}`} fill={DONUT_COLORS_HIV[idx % DONUT_COLORS_HIV.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono pt-1">
                <span className="text-indigo-400 font-bold">PVHIV: 35,5%</span>
                <span className="text-cyan-400">Negativo: 41,5%</span>
                <span className="text-slate-400">Ignorado: 23,0%</span>
              </div>
              <p className="text-[10px] text-slate-500 text-center mt-1">
                *Entre as fichas com status sorológico informado, PVHIV atinge 46,1% dos casos.
              </p>
            </div>

            {/* Donut 2: Hospitalização e Desfechos Clínicos */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center">
              <span className="text-xs font-semibold text-slate-300 block mb-1">
                Hospitalização, Isolamento & Manejo Clínico
              </span>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={customTooltip} />
                    <Pie
                      data={breakdown.severityMetrics}
                      dataKey="porcentagem"
                      nameKey="categoria"
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={70}
                      paddingAngle={3}
                    >
                      {breakdown.severityMetrics.map((_, idx) => (
                        <Cell key={`cell-sev-${idx}`} fill={DONUT_COLORS_SEV[idx % DONUT_COLORS_SEV.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono pt-1">
                <span className="text-emerald-400">Ambulatorial: 82,3%</span>
                <span className="text-amber-400">Internação: 3,3%</span>
                <span className="text-slate-400">Isolamento: 1,9%</span>
                <span className="text-rose-400 font-bold">UTI: 1,2%</span>
              </div>
              <p className="text-[10px] text-slate-500 text-center mt-1">
                Internações e gravidade associadas a imunossupressão grave (CD4 &lt; 200 céls/mm³).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
