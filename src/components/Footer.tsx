import React from 'react';
import { ExternalLink, ShieldCheck, Heart, Database, AlertTriangle, MessageSquare, Info, Clock } from 'lucide-react';
import { syncMetadata } from '../data/sync_status';

interface FooterProps {
  onOpenFeedback?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenFeedback }) => {
  const sources = [
    {
      name: 'Painel Mpox Brasil — Ministério da Saúde (SVSA/CNIE)',
      desc: 'Painel oficial de inteligência epidemiológica e vigilância genômica.',
      url: 'https://www.gov.br/saude/pt-br/composicao/svsa/cnie/painel-mpox',
      tag: 'Painel Oficial MS'
    },
    {
      name: 'PowerBI Oficial — Relatório Interativo MS',
      desc: 'Endpoint direto e modelo semântico do relatório PowerBI público do Ministério da Saúde.',
      url: 'https://app.powerbi.com/view?r=eyJrIjoiYTU1Zjg4OGUtNjA1ZC00NTBkLTg1NzAtZjljOTNmMmNkM2ZiIiwidCI6IjlhNTU0YWQzLWI1MmItNDg2Mi1hMzZmLTg0ZDg5MWU1YzcwNSJ9',
      tag: 'PowerBI Fonte Direta'
    },
    {
      name: 'OpenDataSUS — Microdados de Notificação Sinan',
      desc: 'Base de dados aberta de notificações individuais de casos suspeitos e confirmados de Mpox no Brasil.',
      url: 'https://opendatasus.saude.gov.br/dataset/notificacoes-de-mpox',
      tag: 'Open Data SUS'
    },
    {
      name: 'Fiocruz — Instituto Nacional de Infectologia Evandro Chagas (INI)',
      desc: 'Referência clínica nacional, protocolo de atenção terciária e pesquisa científica em Mpox.',
      url: 'https://www.ini.fiocruz.br/',
      tag: 'Fiocruz INI'
    },
    {
      name: 'OMS (WHO) — Vigilância Global e Emergência Clado Ib',
      desc: 'Diretrizes internacionais de vigilância, contingência e informes epidemiológicos globais da OMS.',
      url: 'https://www.who.int/emergencies/situations/mpox-outbreak',
      tag: 'OMS / WHO'
    },
    {
      name: 'CDC — Centers for Disease Control and Prevention (Mpox)',
      desc: 'Guias clínicos diagnósticos, prevenção pós-exposição e dados de eficácia da vacina MVA-BN.',
      url: 'https://www.cdc.gov/poxvirus/mpox/',
      tag: 'CDC Internacional'
    }
  ];

  return (
    <footer className="bg-slate-950 border-t border-slate-800/90 text-xs text-slate-400 mt-12 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Bloco de Fontes Oficiais & Transparência dos Dados */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Fontes de Informação & Repositórios de Dados Oficiais</span>
            </div>
            <span className="text-[11px] text-slate-400">
              Fontes primárias auditáveis com links diretos
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {sources.map((s, idx) => (
              <a
                key={idx}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="group p-3 rounded-lg bg-slate-950 border border-slate-800/80 hover:border-cyan-500/50 hover:bg-slate-900 transition-all flex flex-col justify-between space-y-1.5"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                      {s.tag}
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <h5 className="font-semibold text-white text-xs group-hover:text-cyan-300 transition-colors leading-tight">
                    {s.name}
                  </h5>
                  <p className="text-[11px] text-slate-400 leading-snug mt-1">
                    {s.desc}
                  </p>
                </div>
                <div className="text-[10px] text-cyan-400/90 font-mono truncate pt-1 border-t border-slate-900">
                  {s.url.replace('https://', '')}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Informações Institucionais e Princípios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
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
              Coleta reproduzível diretamente do modelo semântico oficial do Ministério da Saúde.
            </p>
          </div>

          {/* Coluna 2: Diretriz Ética & Comunicação Sem Estigma */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              Comunicação Sem Estigma
            </h4>
            <p className="leading-relaxed text-slate-400">
              Promovemos a educação em saúde pública estritamente orientada por evidências científicas e vigilância
              epidemiológica, reafirmando que a mpox é uma infecção viral transmitida prioritariamente por contato físico direto
              pele a pele, gotículas respiratórias ou fômites contaminados, não pertencendo a nenhuma orientação sexual,
              raça ou identidade de gênero específica.
            </p>
          </div>

          {/* Coluna 3: Emergência e Disque Saúde */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Atendimento no SUS
            </h4>
            <p className="leading-relaxed text-slate-400">
              Em caso de lesões vesiculares ou suspeita clínica, procure a Unidade Básica de Saúde (UBS) ou CTA/SAE mais próximo.
            </p>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-xs">
              <span className="text-slate-400">Dúvidas ou urgência: </span>
              <span className="text-cyan-300 font-bold font-mono">Disque 136 (Disque Saúde do SUS)</span>
              <p className="text-[10px] text-slate-500 mt-0.5">Ligação gratuita em todo o território nacional.</p>
            </div>
          </div>
        </div>

        {/* Bloco de Deslinde de Responsabilidade e Canal de Feedback */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
          <div className="flex items-start gap-3 max-w-3xl">
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="font-bold text-slate-200 text-xs flex items-center gap-2">
                Aviso Legal & Deslinde de Responsabilidade (Finalidade Científica e Aberta)
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  BETA
                </span>
              </h5>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Este portal é uma iniciativa independente de agregação de dados públicos (DATASUS / Ministério da Saúde / Sinan) e literatura científica aberta. As informações e estimativas apresentadas destinam-se exclusivamente à pesquisa acadêmica, transparência e monitoramento de vigilância em saúde. Não constituem aconselhamento médico, diagnóstico clínico ou diretriz terapêutica individual. Havendo sintomas ou necessidade clínica, recorra sempre aos serviços oficiais de saúde e unidades do SUS.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2 w-full md:w-auto justify-end">
            {onOpenFeedback && (
              <button
                type="button"
                onClick={onOpenFeedback}
                className="w-full md:w-auto px-3.5 py-2 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/80 text-cyan-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                <span>Dar Feedback ao Desenvolvedor</span>
              </button>
            )}
          </div>
        </div>

        {/* Timestamps de Atualização e Contato Oficial */}
        <div className="pt-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="space-y-1 text-center md:text-left">
            <div>
              © 2026 Mpox Brasil — Coleta Não Oficial de Dados em Saúde Pública. Licença Open Source MIT.
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-slate-400">
              <span>Contato oficial:</span>
              <a 
                href={`mailto:${syncMetadata.emailContato}`} 
                className="text-cyan-400 hover:underline font-mono text-[10px]"
              >
                {syncMetadata.emailContato}
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-[11px] text-emerald-300 font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Campanha Ativa</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Última atualização: <strong className="text-slate-100 font-mono">{syncMetadata.ultimaAtualizacaoFormatada}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Próxima prevista: <strong className="text-cyan-300 font-mono">{syncMetadata.proximaAtualizacaoPrevista}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
