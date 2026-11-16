import React from 'react';
import { ExternalLink, ShieldCheck, Heart, AlertCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/90 text-xs text-slate-400 mt-12 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coluna 1: Propósito e Autoria */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Mpox Brasil — Dados Abertos
            </h4>
            <p className="leading-relaxed text-slate-400">
              Microsite de ciência de dados independente focado em vigilância epidemiológica,
              transparência na distribuição de vacinas e educação em saúde baseada em evidências.
            </p>
            <p className="text-[11px] text-slate-500">
              Desenvolvido com carinho e rigor técnico para fortalecer a resposta comunitária no Brasil.
            </p>
          </div>

          {/* Coluna 2: Diretriz Ética & População-Foco */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              Princípios de Comunicação Sem Estigma
            </h4>
            <p className="leading-relaxed text-slate-400">
              Priorizamos informações práticas para os grupos com maior incidência estatística nos boletins
              (homens cisgênero que fazem sexo com homens de 18 a 49 anos, independentemente de raça ou orientação),
              afirmando com clareza científica que a mpox é uma infecção transmitida por contato físico estreito e que
              não pertence a nenhuma identidade ou grupo social específico.
            </p>
          </div>

          {/* Coluna 3: Fontes e Emergência SUS */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              Fontes Oficiais & Disque Saúde
            </h4>
            <p className="leading-relaxed text-slate-400">
              Dados agregados do <strong className="text-slate-300">Ministério da Saúde (SVSA/CNIE)</strong>,
              Portal de Dados Abertos do SUS, Fiocruz e Organização Mundial da Saúde (OMS).
            </p>
            <div className="pt-1 text-[11px] space-y-1">
              <div>
                Em caso de urgência médica:{' '}
                <span className="text-cyan-300 font-semibold font-mono">Disque 136 (Disque Saúde do SUS)</span>
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                <a
                  href="https://www.gov.br/saude/pt-br/composicao/svsa/cnie/painel-mpox"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline inline-flex items-center gap-1"
                >
                  Painel Oficial MS <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <a
                  href="https://portal.fiocruz.br"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline inline-flex items-center gap-1"
                >
                  Fiocruz <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <a
                  href="https://www.who.int/emergencies/situations/mpox"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline inline-flex items-center gap-1"
                >
                  OMS (WHO) <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © 2026 Mpox Brasil — Coleta Não Oficial de Dados em Saúde Pública. Licença Open Source.
          </div>
          <div className="flex items-center gap-2">
            <span>Atualização contínua com fontes oficiais do SUS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

