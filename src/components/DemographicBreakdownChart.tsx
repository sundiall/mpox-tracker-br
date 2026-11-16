import { useState } from 'react';
import type { FC } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Cell
} from 'recharts';
import { 
  ageDistributionData, 
  raceDistributionData, 
  symptomsPrevalenceData,
  lesionLocationData,
  immuneStatusData
} from '../data/epidemiology_breakdown';
import { Users } from 'lucide-react';

export const DemographicBreakdownChart: FC = () => {
  const [activeTab, setActiveTab] = useState<'idade' | 'raca' | 'sintomas' | 'lesoes' | 'imunidade'>('idade');

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg shadow-lg text-xs space-y-1">
          <p className="font-semibold text-slate-200">
            {data.categoria || data.sintoma || data.localizacao}
          </p>
          <p className="text-cyan-400 font-medium">
            Proporção: {data.porcentagem || data.prevalenciaPercentual || data.frequenciaPercentual}%
          </p>
          {data.totalCasos && (
            <p className="text-slate-400">
              Casos notificados: {data.totalCasos.toLocaleString('pt-BR')}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            Perfil Demográfico & Manifestações Clínicas Registradas (Sinan)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Dados epidemiológicos oficiais desestratificados sem juízo de valor ou suposições morais
          </p>
        </div>

        {/* Sub-Tabs */}
        <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs self-start sm:self-auto">
          {[
            { id: 'idade', label: 'Faixa Etária' },
            { id: 'raca', label: 'Raça / Cor' },
            { id: 'sintomas', label: 'Sinais & Sintomas' },
            { id: 'lesoes', label: 'Local das Lesões' },
            { id: 'imunidade', label: 'Condição Imunológica' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-cyan-600 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo Dinâmico por Aba */}
      {activeTab === 'idade' && (
        <div className="space-y-3">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="categoria" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit="%" />
                <Tooltip content={customTooltip} />
                <Bar dataKey="porcentagem" name="% do Total" fill="#0284c7" radius={[4, 4, 0, 0]}>
                  {ageDistributionData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === 1 || index === 2 ? '#06b6d4' : '#334155'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-400">
            A faixa dos 18 aos 39 anos concentra mais de 81% de todas as notificações registradas no Brasil.
          </p>
        </div>
      )}

      {activeTab === 'raca' && (
        <div className="space-y-3">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={raceDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="categoria" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit="%" />
                <Tooltip content={customTooltip} />
                <Bar dataKey="porcentagem" name="% do Total" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-400">
            Distribuição por raça/cor autodeclarada conforme quesito padrão do IBGE no Sinan.
          </p>
        </div>
      )}

      {activeTab === 'sintomas' && (
        <div className="space-y-3">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={symptomsPrevalenceData} 
                layout="vertical"
                margin={{ top: 5, right: 20, left: 70, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={11} unit="%" domain={[0, 100]} />
                <YAxis type="category" dataKey="sintoma" stroke="#94a3b8" fontSize={11} tickLine={false} width={130} />
                <Tooltip content={customTooltip} />
                <Bar dataKey="prevalenciaPercentual" name="Frequência (%)" fill="#0d9488" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-400">
            Erupções na pele/mucosas e febre são os achados clínicos mais comuns na anamnese médica do SUS.
          </p>
        </div>
      )}

      {activeTab === 'lesoes' && (
        <div className="space-y-3">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={lesionLocationData} 
                layout="vertical"
                margin={{ top: 5, right: 20, left: 80, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={11} unit="%" domain={[0, 100]} />
                <YAxis type="category" dataKey="localizacao" stroke="#94a3b8" fontSize={11} tickLine={false} width={150} />
                <Tooltip content={customTooltip} />
                <Bar dataKey="frequenciaPercentual" name="Frequência (%)" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-400">
            Predomínio de acometimento anogenital, refletindo a transmissão predominante por atrito cutâneo em contato íntimo.
          </p>
        </div>
      )}

      {activeTab === 'imunidade' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Com HIV Documentado</span>
            <span className="text-xl font-bold text-indigo-400 block">{immuneStatusData.comHIV.toLocaleString('pt-BR')}</span>
            <span className="text-[11px] text-slate-400">54.2% dos casos notificados</span>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">HIV Negativo</span>
            <span className="text-xl font-bold text-slate-200 block">{immuneStatusData.semHIV.toLocaleString('pt-BR')}</span>
            <span className="text-[11px] text-slate-400">38.1% dos casos notificados</span>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Taxa de Internação</span>
            <span className="text-xl font-bold text-amber-400 block">{immuneStatusData.taxaInternacaoGeral}%</span>
            <span className="text-[11px] text-slate-400">Maioria por controle álgico</span>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Admissão em UTI</span>
            <span className="text-xl font-bold text-emerald-400 block">{immuneStatusData.taxaInternacaoUTI}%</span>
            <span className="text-[11px] text-slate-400">Restrita a imunossupressão grave</span>
          </div>
        </div>
      )}
    </div>
  );
};
