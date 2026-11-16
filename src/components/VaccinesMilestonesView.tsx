import { useState } from 'react';
import type { FC } from 'react';
import { 
  Syringe, 
  Calendar, 
  Building2, 
  AlertCircle, 
  ExternalLink,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { vaccineMilestones } from '../data/vaccines';
import type { VaccineMilestone } from '../data/vaccines';

interface VaccinesMilestonesViewProps {
  selectedUF: string | null;
}

export const VaccinesMilestonesView: FC<VaccinesMilestonesViewProps> = ({
  selectedUF
}) => {
  const [filterTipo, setFilterTipo] = useState<string>('todos');

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

  return (
    <div className="space-y-6">
      {/* Header com Explicativo da Estratégia de Dose Fracionada */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-emerald-800/30 rounded-2xl p-5 backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                <Syringe className="w-3.5 h-3.5" />
                Vacina MVA-BN (JYNNEOS / Imvanex)
              </span>
              <span className="text-xs text-slate-400">Fabricante: Bavarian Nordic (Dinamarca)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Cronograma de Liberação, Marcos & Estratégia Vacinal
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Acompanhamento histórico das remessas adquiridas pelo Ministério da Saúde via Fundo Rotatório da OPAS,
              regras de priorização clínica e critérios de aplicação de 1/5 da dose (intradérmica) para usuários de PrEP.
            </p>
          </div>
        </div>
      </div>

      {/* Destaque Científico Especial: Estratégia de 1/5 da Dose no Rio de Janeiro e Brasil */}
      <div className="bg-slate-900/90 border-2 border-cyan-500/40 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -z-10"></div>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-cyan-950/60 border border-cyan-500/40 rounded-xl text-cyan-300 shrink-0 hidden sm:block">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Estratégia Rio de Janeiro & Nacional
              </span>
              <span className="text-xs text-slate-400">
                Nota Técnica Conjunta nº 17/2024-SVSA/MS & Anvisa
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white">
              Por que a aplicação de 1/5 da dose (0,1 mL Intradérmica) é igualmente eficaz?
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Com a escassez mundial de doses decorrente da existência de uma única fábrica autorizada no mundo, o Ministério da Saúde
              e a Secretaria Municipal de Saúde do Rio de Janeiro (SMS-Rio) adotaram a aplicação por <strong>via intradérmica</strong> no
              volume de <strong>0,1 mL</strong> para populações elegíveis imunocompetentes e usuários de PrEP.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  Mecanismo Imunológico
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  A derme cutânea contém concentração altíssima de células dendríticas e de Langerhans, gerando forte apresentação
                  de antígenos com menor volume de injeção.
                </p>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  Evidência Clínica (Frey et al.)
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Ensaio clínico do NIH/NIAID (Vaccine 2015) comprovou títulos de anticorpos neutralizantes e soroconversão equivalentes
                  entre 0,1 mL ID e 0,5 mL SC.
                </p>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  Multiplicação de Vidas
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Cada frasco original atende até 5 pessoas em vez de 1 só, expandindo a proteção coletiva e blindando redes
                  sexuais e afetivas contra a disseminação.
                </p>
              </div>
            </div>

            <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-xl text-xs text-amber-200/90 leading-relaxed flex items-start gap-2 mt-2">
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
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
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
              className={`px-3 py-1.5 rounded-lg border transition-colors ${
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
      <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-800 space-y-6">
        {filteredMilestones.map((milestone) => {
          const badge = getTipoBadge(milestone.tipo);

          return (
            <div key={milestone.id} className="relative group">
              {/* Ponto na timeline */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-cyan-400 group-hover:scale-125 transition-transform"></div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4.5 sm:p-5 backdrop-blur-md hover:border-slate-700 transition-all">
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
                    <span className={`px-2 py-0.5 rounded-full border text-[10px] font-medium ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>

                  {milestone.quantidadeDoses && (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded-md border border-emerald-800/40">
                      {milestone.quantidadeDoses.toLocaleString('pt-BR')} doses
                    </span>
                  )}
                </div>

                <h4 className="text-base font-bold text-white mb-2">{milestone.titulo}</h4>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
                  {milestone.detalhes}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-800/80">
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
