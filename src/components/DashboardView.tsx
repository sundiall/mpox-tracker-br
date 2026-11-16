import type { FC } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  ShieldCheck, 
  Syringe, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { nationalSummary } from '../data/epidemiology';
import type { StateEpidemiology } from '../data/epidemiology';
import { KPICard } from './KPICard';
import { BrazilMap } from './BrazilMap';

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
      return {
        texto: 'Tendência: Queda',
        tipo: 'positivo' as const,
        icon: TrendingDown
      };
    }
    if (trend === 'crescimento') {
      return {
        texto: 'Tendência: Alta',
        tipo: 'alerta' as const,
        icon: TrendingUp
      };
    }
    return {
      texto: 'Tendência: Estável',
      tipo: 'neutro' as const,
      icon: Minus
    };
  };

  const trendInfo = getTrendBadge(currentState?.tendencia);

  return (
    <div className="space-y-6">
      {/* Banner de Contexto Epidemiológico e Inclusão Ética */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-800/30 rounded-2xl p-4.5 sm:p-5 text-left relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Painel Científico Independente
              </span>
              <span className="text-xs text-slate-400">
                {selectedUF ? `Foco Territorial: ${currentState?.nome} (${currentState?.uf})` : 'Âmbito: Brasil (Consolidado Nacional)'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Monitoramento Epidemiológico & Resposta à Mpox no Brasil
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Curadoria analítica independente orientada para a população mais afetada nos registros de vigilância
              (<strong className="text-cyan-200 font-semibold">homens cisgênero que fazem sexo com homens de 18 a 49 anos</strong>),
              promovendo informação técnica transparente, combate a estigmas e acesso equitativo a vacinas e testagem no SUS.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={() => onNavigateToTab('guia')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow-md shadow-cyan-950/50 flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4" />
              Sintomas & Guia Clínico
            </button>
            <button
              onClick={() => onNavigateToTab('vacinas')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <Syringe className="w-4 h-4" />
              Dose Fracionada (1/5)
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
          destaqueCor="red"
          badge={currentState ? { texto: trendInfo.texto, tipo: trendInfo.tipo } : { texto: 'Consolidado', tipo: 'neutro' }}
        />

        <KPICard
          titulo="Casos Suspeitos / Prováveis"
          valor={totalSuspeitos + totalProvaveis}
          subtexto={`${totalProvaveis} prováveis e ${totalSuspeitos} em investigação`}
          icon={AlertTriangle}
          destaqueCor="amber"
          badge={{ texto: 'Sob Investigação', tipo: 'alerta' }}
        />

        <KPICard
          titulo="Óbitos Registrados"
          valor={totalObitos}
          subtexto={`Taxa de letalidade: ${taxaLetalidade.toFixed(2)}%`}
          icon={ShieldCheck}
          destaqueCor="purple"
          badge={{ texto: 'Letalidade Baixa', tipo: 'positivo' }}
        />

        <KPICard
          titulo="Doses Aplicadas"
          valor={dosesAplicadas}
          subtexto={`${dosesDistribuidas.toLocaleString('pt-BR')} doses distribuídas pelo MS`}
          icon={Syringe}
          destaqueCor="emerald"
          badge={{ texto: `${((dosesAplicadas / dosesDistribuidas) * 100).toFixed(0)}% Utilizadas`, tipo: 'positivo' }}
        />
      </div>

      {/* Mapa do Brasil e Seletor Territorial */}
      <BrazilMap states={states} selectedUF={selectedUF} onSelectUF={onSelectUF} />

      {/* Recorte Demográfico e Comportamental (Sem Estigmas) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              Perfil Epidemiológico dos Casos Notificados (Brasil)
            </h3>
            <span className="text-xs text-slate-400 bg-slate-800/80 px-2 py-1 rounded-md border border-slate-700/60">
              Fonte: SVSA / DATHI / Ministério da Saúde
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            A vigilância epidemiológica nacional documenta a concentração de casos em redes de contato íntimo e
            atrito de pele prolongado, com ênfase na idade reprodutiva:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/70">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Faixa Etária</span>
              <span className="text-lg font-bold text-white mt-1 block">
                {nationalSummary.perfilDemografico.faixa18a49Anos}%
              </span>
              <span className="text-[11px] text-slate-400">Entre 18 e 49 anos</span>
            </div>

            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/70">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Sexo Designado</span>
              <span className="text-lg font-bold text-white mt-1 block">
                {nationalSummary.perfilDemografico.porcentagemMasculino}%
              </span>
              <span className="text-[11px] text-slate-400">Homens cisgênero</span>
            </div>

            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/70">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">População HSH</span>
              <span className="text-lg font-bold text-cyan-400 mt-1 block">
                {nationalSummary.perfilDemografico.porcentagemHSH}%
              </span>
              <span className="text-[11px] text-slate-400">HSH no histórico de contato</span>
            </div>

            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/70">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Coinfecção com HIV</span>
              <span className="text-lg font-bold text-indigo-400 mt-1 block">
                {nationalSummary.perfilDemografico.porcentagemPessoasVivendoComHIV}%
              </span>
              <span className="text-[11px] text-slate-400">Prioritários p/ vacina cheia</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-cyan-950/20 border border-cyan-800/40 rounded-xl text-xs text-cyan-200/90 leading-relaxed flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong>Princípio de Comunicação em Saúde Pública:</strong> O vírus não escolhe gênero ou orientação sexual.
              Qualquer indivíduo exposto a contato físico direto ou com lesões pode ser infectado. A identificação dos grupos
              majoritários serve exclusivamente para direcionar insumos (como vacinas MVA-BN e PrEP) e mensagens de redução
              de danos sem criar discriminação ou falsa sensação de imunidade em outros grupos.
            </div>
          </div>
        </div>

        {/* Card de Ação Rápida e Navegação */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
              <Syringe className="w-5 h-5 text-emerald-400" />
              Onde se Vacinar no SUS?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Consulte os postos de referência, CTAs e serviços de atendimento especializado (SAE) por estado com endereços e horários.
            </p>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Pessoas vivendo com HIV (CD4 &lt; 200 céls/mm³)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>Usuários em uso de PrEP (via intradérmica 0,1 mL)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Profissionais de laboratórios de virologia NB-3</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800">
            <button
              onClick={() => onNavigateToTab('postos')}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-950/40 flex items-center justify-center gap-2"
            >
              Consultar Postos e Centros de Testagem
            </button>
          </div>
        </div>
      </div>

      {/* Tabela Comparativa de Estados */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-white">Tabela Detalhada por Unidade Federativa</h3>
            <p className="text-xs text-slate-400">Métricas acumuladas e cobertura de vacinação da população-alvo</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Estado / UF</th>
                <th className="py-3 px-3">Região</th>
                <th className="py-3 px-3">Confirmados</th>
                <th className="py-3 px-3">Prováveis</th>
                <th className="py-3 px-3">Óbitos</th>
                <th className="py-3 px-3">Letalidade</th>
                <th className="py-3 px-3">Doses Aplicadas</th>
                <th className="py-3 px-3">Tendência</th>
                <th className="py-3 px-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {states.map((state) => {
                const isSelected = selectedUF === state.uf;
                return (
                  <tr
                    key={state.uf}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isSelected ? 'bg-cyan-950/30 border-l-4 border-cyan-400' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-semibold text-white flex items-center gap-2">
                      <span className="w-6 text-center py-0.5 rounded bg-slate-800 text-[10px] text-cyan-300 font-mono">
                        {state.uf}
                      </span>
                      <span>{state.nome}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{state.regiao}</td>
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-200">
                      {state.casosConfirmados.toLocaleString('pt-BR')}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-400">{state.casosProvaveis}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-300">{state.obitos}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-400">{state.taxaLetalidade.toFixed(2)}%</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-400 font-medium">
                      {state.dosesAplicadas.toLocaleString('pt-BR')}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          state.tendencia === 'queda'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : state.tendencia === 'crescimento'
                            ? 'bg-red-500/15 text-red-300 border border-red-500/30'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {state.tendencia === 'queda' ? 'Queda' : state.tendencia === 'crescimento' ? 'Alta' : 'Estável'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => onSelectUF(isSelected ? null : state.uf)}
                        className={`text-[11px] px-2.5 py-1 rounded transition-colors ${
                          isSelected
                            ? 'bg-cyan-600 text-white'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        {isSelected ? 'Desmarcar' : 'Filtrar'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
