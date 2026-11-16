import { useState } from 'react';
import type { FC } from 'react';
import { 
  HelpCircle, 
  ShieldAlert, 
  Clock, 
  BookOpen, 
  ExternalLink, 
  Search, 
  AlertCircle,
  HeartHandshake
} from 'lucide-react';
import { 
  clinicalStages, 
  scientificReferences, 
  faqList
} from '../data/clinical_guide';

export const ClinicalGuideFAQView: FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const filteredFaqs = faqList.filter((item) => {
    const matchesCat = activeCategory === 'todos' || item.categoria === activeCategory;
    const matchesQuery = 
      item.pergunta.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.resposta.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-8">
      {/* Banner Principal de Acolhimento e Base Científica */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900 to-purple-950/40 border border-indigo-800/30 rounded-2xl p-5 backdrop-blur-md">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5" />
              Cuidado Integral, Autonomia & Prevenção
            </span>
            <span className="text-xs text-slate-400">Guia Clínico & Perguntas Frequentes</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Tudo sobre a Mpox: Sintomas, Transmissibilidade e Cuidados
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Informações respaldadas pela Organização Mundial da Saúde (OMS), ensaios clínicos revisados por pares
            e diretrizes do SUS. Comunicação direta, sem moralismos ou estigmas, focada em proteger a saúde de quem
            está mais exposto.
          </p>
        </div>
      </div>

      {/* Seção 1: O Que Fazer em Caso de Suspeita (Protocolo de Ação) */}
      <div className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-5 backdrop-blur-md">
        <div className="flex items-center gap-2 text-amber-400 mb-3">
          <ShieldAlert className="w-5 h-5" />
          <h3 className="text-base sm:text-lg font-bold text-white">
            O que fazer em caso de suspeita ou aparecimento de lesões?
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
              1
            </span>
            <h4 className="font-semibold text-white">Isole-se de Imediato</h4>
            <p className="text-slate-300 leading-relaxed">
              Fique em quarto privativo. Não durma na mesma cama e não compartilhe lençóis, toalhas ou talheres.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-xs">
              2
            </span>
            <h4 className="font-semibold text-white">Proteja as Lesões</h4>
            <p className="text-slate-300 leading-relaxed">
              Cubra com roupas leves de manga longa ou gaze sem apertar. Não fure bolhas e evite tocar no rosto e olhos.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-xs">
              3
            </span>
            <h4 className="font-semibold text-white">Use Máscara & Busque UBS</h4>
            <p className="text-slate-300 leading-relaxed">
              Coloque máscara cirúrgica ao sair de casa e procure uma UBS, UPA ou CTA de referência para avaliação e coleta do exame.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
              4
            </span>
            <h4 className="font-semibold text-white">Avise Seus Contatos</h4>
            <p className="text-slate-300 leading-relaxed">
              Comunique pessoas com quem você teve contato íntimo ou sexual nos últimos 21 dias para que fiquem atentas a sintomas.
            </p>
          </div>
        </div>
      </div>

      {/* Seção 2: Linha do Tempo da Doença & Períodos de Transmissibilidade */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              Fases Clínicas, Período de Incubação e Transmissibilidade
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Entenda em que momento o vírus é transmitido e os sinais biológicos de resolução completa
            </p>
          </div>
          <span className="text-xs text-cyan-300 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800/40 self-start sm:self-auto font-mono">
            Incubação: 3 a 21 dias (média 6-13 dias)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {clinicalStages.map((stage, idx) => {
            const riskColor = 
              stage.nivelTransmissibilidade === 'Risco Máximo'
                ? 'border-red-500/40 bg-red-950/20 text-red-400'
                : stage.nivelTransmissibilidade === 'Risco em Declínio'
                ? 'border-amber-500/40 bg-amber-950/20 text-amber-400'
                : stage.nivelTransmissibilidade === 'Início de Risco'
                ? 'border-blue-500/40 bg-blue-950/20 text-blue-400'
                : 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400';

            return (
              <div 
                key={idx}
                className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between space-y-2 text-xs"
              >
                <div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${riskColor} inline-block mb-1.5`}>
                    {stage.nivelTransmissibilidade}
                  </span>
                  <h4 className="font-bold text-white text-sm">{stage.fase}</h4>
                  <div className="text-[11px] font-mono text-cyan-400 mt-0.5">{stage.periodoDias}</div>
                  <p className="text-slate-300 leading-relaxed mt-2 text-[11px]">
                    {stage.descricao}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">Sinais Típicos:</span>
                  <ul className="list-disc list-inside text-[10px] text-slate-300 space-y-0.5">
                    {stage.sinaisPrincipais.slice(0, 3).map((s, i) => (
                      <li key={i} className="truncate">{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 bg-indigo-950/30 border border-indigo-800/40 rounded-xl text-xs text-indigo-200 leading-relaxed flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <strong>Regra de Ouro da Transmissão:</strong> A transmissão só cessa quando <strong>100% das crostas caírem espontaneamente</strong> e
            derem lugar a uma nova camada lisa de pele rosada ou reepitelizada. Jamais arranque as cascas, pois isso expõe vírus viável e
            aumenta o risco de cicatrizes profundas.
          </div>
        </div>
      </div>

      {/* Seção 3: Perguntas Frequentes (FAQ com Busca e Filtros) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-cyan-400" />
              Perguntas Frequentes (FAQ)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Dúvidas comuns sobre imunização, prevenção, vias de contágio e estratégias terapêuticas
            </p>
          </div>

          {/* Barra de Busca */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar no FAQ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Categorias do FAQ */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          {[
            { id: 'todos', label: 'Todas as Dúvidas' },
            { id: 'transmissao', label: 'Transmissão' },
            { id: 'vacina', label: 'Vacinas & 1/5 da Dose' },
            { id: 'sintomas', label: 'Sintomas & Diferenciação' },
            { id: 'cuidados', label: 'Isolamento & Cuidados' },
            { id: 'tratamento', label: 'Tratamento & Antivirais' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg border transition-colors ${
                activeCategory === cat.id
                  ? 'bg-indigo-600 text-white border-indigo-500 font-semibold'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Lista de Acordeões do FAQ */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isExpanded = expandedFaq === faq.id;

            return (
              <div
                key={faq.id}
                className="bg-slate-950/70 border border-slate-800 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                  className="w-full text-left p-4 flex items-center justify-between gap-3 hover:bg-slate-800/40 transition-colors"
                >
                  <span className="font-semibold text-white text-xs sm:text-sm">
                    {faq.pergunta}
                  </span>
                  <span className="text-slate-400 font-mono text-sm shrink-0">
                    {isExpanded ? '−' : '+'}
                  </span>
                </button>

                {isExpanded && (
                  <div className="p-4 pt-0 space-y-3 text-xs border-t border-slate-800/60 bg-slate-950/40">
                    <p className="text-slate-300 leading-relaxed whitespace-pre-line mt-3">
                      {faq.resposta}
                    </p>

                    {faq.destaque && (
                      <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-cyan-200 text-[11px] font-medium">
                        💡 {faq.destaque}
                      </div>
                    )}

                    {faq.referencias && faq.referencias.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/80 space-y-1">
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">
                          Estudos Científicos de Suporte:
                        </span>
                        {faq.referencias.map((ref, i) => (
                          <div key={i} className="text-[11px] text-slate-300">
                            <span className="text-slate-400">{ref.autores} ({ref.ano}). </span>
                            <a
                              href={ref.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-cyan-400 hover:underline inline-flex items-center gap-1 font-medium"
                            >
                              {ref.periodico} <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Seção 4: Estudos e Artigos Científicos de Referência */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            Evidência Científica & Estudos de Referência
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Trabalhos originais publicados nas principais revistas médicas do mundo (NEJM, The Lancet, Vaccine)
            que fundamentam os protocolos clínicos e as estratégias adotadas no Brasil.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {scientificReferences.map((ref, idx) => (
            <div
              key={idx}
              className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between text-xs space-y-2 hover:border-slate-700 transition-colors"
            >
              <div>
                <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider block">
                  {ref.periodico} ({ref.ano})
                </span>
                <h4 className="font-bold text-white text-xs sm:text-sm mt-1 leading-snug">
                  {ref.titulo}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 italic">
                  Autores: {ref.autores}
                </p>
                <p className="text-[11px] text-slate-300 leading-relaxed mt-2">
                  {ref.relevancia}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">
                  {ref.doi ? `DOI: ${ref.doi}` : 'Diretriz Oficial'}
                </span>
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-medium flex items-center gap-1 transition-colors"
                >
                  Ler Artigo <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
