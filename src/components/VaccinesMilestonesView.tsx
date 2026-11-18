import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { 
  Syringe, 
  Calendar, 
  Building2, 
  AlertCircle, 
  ExternalLink,
  Filter,
  CheckCircle2,
  TrendingUp,
  Users,
  FileText,
  Clock,
  MapPin,
  Sparkles
} from 'lucide-react';
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
  ReferenceLine 
} from 'recharts';
import { vaccineMilestones, vaccinePopulationsRelease } from '../data/vaccines';
import type { VaccineMilestone } from '../data/vaccines';
import { vaccineProgressTimeData } from '../data/time_series';
import { syncMetadata } from '../data/sync_status';

interface VaccinesMilestonesViewProps {
  selectedUF: string | null;
}

export const VaccinesMilestonesView: FC<VaccinesMilestonesViewProps> = ({
  selectedUF
}) => {
  const [filterTipo, setFilterTipo] = useState<string>('todos');
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredMilestones = vaccineMilestones.filter((m) => {
    const matchesTipo = filterTipo === 'todos' || m.tipo === filterTipo;
    const matchesUF = !selectedUF || m.estadosEnvolvidos.includes('Nacional') || m.estadosEnvolvidos.includes(selectedUF);
    return matchesTipo && matchesUF;
  });

  const getTipoBadge = (tipo: VaccineMilestone['tipo']) => {
    switch (tipo) {
      case 'aquisicao':
        return { label: 'Aquisição / Chegada', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30' };
      case 'distribuicao':
        return { label: 'Distribuição aos Estados', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
      case 'normativa':
        return { label: 'Diretriz / Nota Técnica', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30' };
      case 'estudo':
        return { label: 'Estudo / Efetividade', color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' };
    }
  };

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0]?.payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-xs space-y-1.5 min-w-[220px]">
          <div className="font-semibold text-slate-200 border-b border-slate-800 pb-1 flex items-center justify-between">
            <span className="text-cyan-300">Mês: {label}</span>
            <span className="text-[10px] text-slate-500 font-mono">{dataPoint?.mes}</span>
          </div>
          <p className="text-slate-300 flex justify-between">
            <span>Doses Distribuídas:</span>
            <strong className="text-white font-mono">{dataPoint?.dosesDistribuidasAcumuladas?.toLocaleString('pt-BR')}</strong>
          </p>
          <p className="text-emerald-400 flex justify-between">
            <span>Doses Aplicadas SUS:</span>
            <strong className="font-mono">{dataPoint?.dosesAplicadasAcumuladas?.toLocaleString('pt-BR')}</strong>
          </p>
          <div className="pt-1 border-t border-slate-800 text-[10px] text-slate-400 space-y-0.5">
            <div className="flex justify-between">
              <span>1ª Dose:</span>
              <span className="text-slate-300 font-mono">{dataPoint?.primeiraDose?.toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex justify-between">
              <span>2ª Dose:</span>
              <span className="text-slate-300 font-mono">{dataPoint?.segundaDose?.toLocaleString('pt-BR')}</span>
            </div>
          </div>
          {dataPoint?.marco && (
            <div className="mt-1 p-1.5 rounded bg-purple-950/80 border border-purple-800/80 text-[10px] text-purple-200 flex items-center gap-1">
              <Syringe className="w-3 h-3 text-purple-400 shrink-0" />
              <span><strong>Marco:</strong> {dataPoint.marco}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header Institucional */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center gap-1.5">
            <Syringe className="w-3.5 h-3.5" />
            Vacina MVA-BN (JYNNEOS / Imvanex)
          </span>
          <span className="text-xs text-slate-400">Fabricante: Bavarian Nordic (Dinamarca)</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Cronograma de Liberação, Marcos & Estratégia Vacinal
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
          Acompanhamento histórico das remessas adquiridas pelo Ministério da Saúde via Fundo Rotatório da OPAS,
          regras de priorização clínica e critérios de aplicação de 1/5 da dose (intradérmica) para usuários de PrEP.
        </p>
      </div>

      {/* Alerta de Destaque: Liberação Recente para Usuários de PrEP no Rio de Janeiro e SP */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-cyan-950/80 border border-emerald-500/40 rounded-xl p-4.5 space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500 text-slate-950">
            LIBERAÇÃO RECENTE (17/11/2026)
          </span>
          <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Ampliação para Usuários de PrEP e Trabalhadores de Saúde no Rio de Janeiro
          </span>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed">
          A Prefeitura do Rio de Janeiro (SMS-Rio) iniciou a vacinação ampliada contra a Mpox para <strong>todos os usuários em Profilaxia Pré-Exposição (PrEP)</strong> com laudo ou receita médica válida de até 6 meses que nunca tenham se vacinado, além de <strong>trabalhadores expostos de saúde e laboratório</strong>. A aplicação ocorre em <strong>5 polos estratégicos</strong> (Super Centros de Vacinação Botafogo, Shopping Nova América e ParkShopping Campo Grande, CEVAA Álvaro Aguiar e CRIE/Fiocruz).
        </p>
      </div>

      {/* Seção Estruturada: Cronograma de Liberação por População & Critérios de Elegibilidade */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="border-b border-slate-800/80 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              Cronograma de Liberação por População & Critérios no SUS
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Datas oficiais em que cada público-alvo foi contemplado, documentação necessária e via de administração
            </p>
          </div>
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-800/60 self-start sm:self-auto">
            {vaccinePopulationsRelease.length} Populações Contempladas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vaccinePopulationsRelease.map((pop) => (
            <div 
              key={pop.id} 
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                pop.id === 'pop-prep' 
                  ? 'bg-slate-950/90 border-cyan-500/50 shadow-lg shadow-cyan-950/30' 
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    pop.categoria === 'pre_exposicao' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                    pop.categoria === 'pos_exposicao' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-purple-950 text-purple-300 border border-purple-800'
                  }`}>
                    {pop.categoria === 'pre_exposicao' ? 'Pré-Exposição' :
                     pop.categoria === 'pos_exposicao' ? 'Pós-Exposição (14d)' : 'Ocupacional'}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                    {pop.statusLiberacao === 'liberado_ativo' ? 'Liberado / Ativo' : 'Sob Demanda'}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white leading-snug">
                  {pop.populacao}
                </h4>

                <div className="p-2 rounded bg-slate-900 border border-slate-800/80 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-cyan-300 font-medium">
                    <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Liberada em: <strong>{pop.dataLiberacao}</strong></span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {pop.marcoTemporal}
                  </p>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="text-slate-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    Critérios de Elegibilidade:
                  </span>
                  <p className="text-[11px] text-slate-300 leading-relaxed pl-4">
                    {pop.criteriosElegibilidade}
                  </p>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="text-slate-400 font-semibold flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    Documentos Obrigatórios:
                  </span>
                  <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-0.5 pl-1">
                    {pop.documentosExigidos.map((doc, dIdx) => (
                      <li key={dIdx} className="leading-snug">{doc}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-800/80 space-y-1.5 text-[11px]">
                <div className="flex items-start gap-1 text-slate-400">
                  <Syringe className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Esquema:</strong> {pop.esquemaVacinal}</span>
                </div>
                <div className="flex items-start gap-1 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Locais:</strong> {pop.locaisAtendimento}</span>
                </div>
                {pop.detalhesAdicionais && (
                  <p className="text-[10px] text-amber-300/90 italic pt-0.5">
                    * {pop.detalhesAdicionais}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gráfico Temporal de Evolução da Vacinação */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="border-b border-slate-800/80 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Evolução Temporal: Doses Distribuídas vs. Doses Aplicadas no Brasil
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Progressão cumulativa de remessas enviadas aos estados e doses administradas pelo PNI
          </p>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={vaccineProgressTimeData} margin={{ top: 25, right: isMobile ? 8 : 20, left: isMobile ? -16 : -5, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="periodoRotulo" 
                stroke="#64748b" 
                tickLine={false}
                interval={isMobile ? 7 : 5}
                height={isMobile ? 38 : 48}
                tick={{ angle: -30, textAnchor: 'end', fontSize: isMobile ? 8 : 10, fill: '#64748b', dy: 4, dx: -3 }}
              />
              <YAxis stroke="#64748b" fontSize={isMobile ? 8 : 10} width={isMobile ? 28 : 45} tickLine={false} />
              <Tooltip content={customTooltip} />
              <Legend 
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px', color: '#cbd5e1' }}
                formatter={(val) => <span style={{ color: '#cbd5e1', fontWeight: 500 }}>{val}</span>}
              />
              <Bar 
                dataKey="dosesDistribuidasAcumuladas" 
                name="Doses Distribuídas (Estoque Nacional)" 
                fill="#334155" 
                radius={[4, 4, 0, 0]} 
              />
              <Line 
                type="monotone" 
                dataKey="dosesAplicadasAcumuladas" 
                name="Doses Aplicadas no SUS" 
                stroke="#10b981" 
                strokeWidth={3} 
                dot={false} 
              />
              {/* Marcos Históricos de Imunização Posicionados na Escala Temporal Exata */}
              {vaccineProgressTimeData.filter((d) => d.marco).map((m, idx) => (
                <ReferenceLine
                  key={m.mes}
                  x={m.periodoRotulo}
                  stroke={m.marcoCategoria === 'distribuicao' ? '#10b981' : m.marcoCategoria === 'aquisicao' ? '#38bdf8' : '#c084fc'}
                  strokeDasharray="3 3"
                  label={{
                    value: m.marco,
                    position: 'top',
                    fill: '#cbd5e1',
                    fontSize: 9,
                    dy: idx % 2 === 0 ? -10 : -22
                  }}
                />
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Destaque Científico Especial: Estratégia de 1/5 da Dose no Rio de Janeiro e Brasil */}
      <div className="bg-slate-900 border border-cyan-800/60 rounded-xl p-5 space-y-3">
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-slate-950 border border-cyan-800/80 rounded-lg text-cyan-300 shrink-0 hidden sm:block">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="space-y-3 w-full">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/80">
                Estratégia Rio de Janeiro & Nacional
              </span>
              <span className="text-xs text-slate-400">
                Nota Técnica Conjunta nº 17/2024-SVSA/MS & Resolução Anvisa
              </span>
            </div>

            <h3 className="text-base font-bold text-white">
              Por que a aplicação de 1/5 da dose (0,1 mL Intradérmica) é igualmente eficaz?
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Frente à escassez mundial de doses decorrente da capacidade produtiva limitada internacionalmente, o Ministério da Saúde
              e a Secretaria Municipal de Saúde do Rio de Janeiro (SMS-Rio) adotaram a aplicação por <strong>via intradérmica</strong> no
              volume de <strong>0,1 mL</strong> para populações elegíveis imunocompetentes e usuários de PrEP.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  Mecanismo Imunológico
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  A derme cutânea contém concentração altíssima de células dendríticas e de Langerhans, gerando forte apresentação
                  de antígenos com menor volume de injeção.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    Evidência Clínica (Frey et al.)
                  </span>
                  <p className="text-[11px] text-slate-300 leading-relaxed mb-2">
                    Ensaio clínico do NIH/NIAID (Vaccine 2015) comprovou títulos de anticorpos neutralizantes e soroconversão equivalentes
                    entre 0,1 mL ID e 0,5 mL SC.
                  </p>
                </div>
                <a
                  href="https://pubmed.ncbi.nlm.nih.gov/26143613/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline font-medium pt-1"
                >
                  <ExternalLink className="w-3 h-3 shrink-0" />
                  <span>Fonte: PubMed (NIH / Vaccine 2015)</span>
                </a>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  Multiplicação de Vidas
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Cada frasco atende até 5 pessoas em vez de 1 só, expandindo a proteção coletiva e blindando redes
                  sexuais e de convívio íntimo contra a disseminação.
                </p>
              </div>
            </div>

            <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-lg text-xs text-amber-200/90 leading-relaxed flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>Atenção ao esquema integral (0,5 mL SC):</strong> Para pessoas vivendo com HIV com imunossupressão grave
                (contagem de CD4 &lt; 200 céls/mm³), mantém-se a indicação estrita de <strong>0,5 mL por via subcutânea</strong> em 2 doses,
                com intervalo de 28 dias.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controles de Filtro para Milestones */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-3 rounded-lg border border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span>Filtrar por tipo de marco:</span>
        </div>

        <div className="flex flex-wrap gap-1.5 text-xs">
          {[
            { id: 'todos', label: 'Todos os Marcos' },
            { id: 'distribuicao', label: 'Distribuições' },
            { id: 'aquisicao', label: 'Aquisições' },
            { id: 'normativa', label: 'Normativas Técnicas' },
            { id: 'estudo', label: 'Estudos Científicos' }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilterTipo(btn.id)}
              className={`px-3 py-1.5 rounded-md border transition-colors ${
                filterTipo === btn.id
                  ? 'bg-cyan-600 text-white border-cyan-500 font-medium'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Linha do Tempo de Marcos (Milestones) */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-800 space-y-5">
        {filteredMilestones.map((milestone, index) => {
          const badge = getTipoBadge(milestone.tipo);

          return (
            <div key={milestone.id} className="relative group">
              {/* Ponto na timeline */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-cyan-400 group-hover:scale-125 transition-transform"></div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5 hover:border-slate-700 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs font-semibold text-slate-300 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      {new Date(milestone.data).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>

                  {milestone.quantidadeDoses && (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40 font-mono">
                      {milestone.quantidadeDoses.toLocaleString('pt-BR')} doses
                    </span>
                  )}
                </div>

                {milestone.urlFonte ? (
                  <a
                    href={milestone.urlFonte}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm sm:text-base font-bold text-white hover:text-cyan-300 transition-colors inline-flex items-center gap-1.5 mb-1.5 group/mtitle"
                    title={`Acessar estudo / fonte oficial: ${milestone.fonteOficial}`}
                  >
                    <span className="group-hover/mtitle:underline">{milestone.titulo}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400 group-hover/mtitle:translate-x-0.5 transition-transform shrink-0" />
                  </a>
                ) : (
                  <h4 className="text-sm sm:text-base font-bold text-white mb-1.5">{milestone.titulo}</h4>
                )}

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {milestone.detalhes}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-800">
                  <div>
                    <span className="text-slate-400">Público-Alvo: </span>
                    <span className="text-slate-200 font-medium">{milestone.publicoAlvo}</span>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-2">
                    <span className="text-slate-400">Fonte: {milestone.fonteOficial}</span>
                    {milestone.urlFonte && (
                      <a
                        href={milestone.urlFonte}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
                      >
                        Abrir <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {index === filteredMilestones.length - 1 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-semibold text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      Campanha Ativa
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-mono">
                      <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Próxima atualização correspondente: <strong className="text-cyan-300">{syncMetadata.proximaAtualizacaoPrevista}</strong></span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
