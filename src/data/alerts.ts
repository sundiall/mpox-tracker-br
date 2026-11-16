export interface OfficialAlert {
  id: string;
  dataPublicacao: string; // YYYY-MM-DD
  orgaoEmissor: 'Ministério da Saúde' | 'Anvisa' | 'Fiocruz' | 'SES-RJ' | 'SES-SP' | 'OMS / OPAS';
  ufRelacionada: string; // 'Nacional' ou UF
  titulo: string;
  tipo: 'alerta_urgente' | 'disponibilidade_vacina' | 'nota_tecnica' | 'avanco_cientifico';
  resumo: string;
  linkOficial: string;
  categoria: 'Vigilância' | 'Imunização' | 'Pesquisa e Ensaios' | 'Epidemiologia';
}

export const officialAlerts: OfficialAlert[] = [
  {
    id: 'alert-1',
    dataPublicacao: '2026-11-12',
    orgaoEmissor: 'Ministério da Saúde',
    ufRelacionada: 'Nacional',
    titulo: 'Vigilância Genômica confirma circulação estável de Clado IIb e ausência de Clado Ib no território nacional',
    tipo: 'nota_tecnica',
    resumo: 'A Rede Nacional de Sequenciamento Genômico da SVSA analisou mais de 800 amostras recentes de lesões, confirmando que todos os genomas identificados pertencem à linhagem Clado IIb (circulante desde 2022). Não há detecção até o momento do Clado Ib no Brasil.',
    linkOficial: 'https://www.gov.br/saude/pt-br/composicao/svsa/cnie/painel-mpox',
    categoria: 'Vigilância'
  },
  {
    id: 'alert-2',
    dataPublicacao: '2026-10-28',
    orgaoEmissor: 'SES-RJ',
    ufRelacionada: 'RJ',
    titulo: 'Secretaria de Saúde do Rio de Janeiro reabastece 4 polos estratégicos com doses intradérmicas de MVA-BN',
    tipo: 'disponibilidade_vacina',
    resumo: 'O Rio de Janeiro recebeu novo lote com 1.200 frascos, permitindo atendimento de até 6.000 pessoas via aplicação fracionada intradérmica (0,1 mL). O imunizante está disponível sem necessidade de agendamento no CMS Lapa e polos descentralizados para usuários cadastrados em PrEP.',
    linkOficial: 'https://www.saude.rj.gov.br',
    categoria: 'Imunização'
  },
  {
    id: 'alert-3',
    dataPublicacao: '2026-10-15',
    orgaoEmissor: 'SES-SP',
    ufRelacionada: 'SP',
    titulo: 'São Paulo intensifica busca ativa em centros de acolhimento e unidades de referência',
    tipo: 'disponibilidade_vacina',
    resumo: 'A Secretaria de Estado da Saúde de São Paulo orientou os CTAs e CRTs a ofertarem a segunda dose da vacina MVA-BN aos usuários com mais de 28 dias da primeira aplicação para garantir consolidação da imunidade.',
    linkOficial: 'https://www.saude.sp.gov.br',
    categoria: 'Imunização'
  },
  {
    id: 'alert-4',
    dataPublicacao: '2026-09-20',
    orgaoEmissor: 'Fiocruz',
    ufRelacionada: 'Nacional',
    titulo: 'Ensaio clínico da Fiocruz avalia eficácia duradoura da resposta celular induzida por dose fracionada',
    tipo: 'avanco_cientifico',
    resumo: 'Pesquisadores do Instituto Oswaldo Cruz (IOC/Fiocruz) demonstraram que a via intradérmica de 0,1 mL estimula memória imunológica duradoura de Linfócitos T CD4+ e CD8+, com níveis de células T de memória comparáveis ao regime subcutâneo pleno de 0,5 mL.',
    linkOficial: 'https://portal.fiocruz.br',
    categoria: 'Pesquisa e Ensaios'
  },
  {
    id: 'alert-5',
    dataPublicacao: '2026-08-30',
    orgaoEmissor: 'OMS / OPAS',
    ufRelacionada: 'Nacional',
    titulo: 'Atualização das Diretrizes de Manejo Clínico: Redução do Estigma e Abordagem Centrada na Comunidade',
    tipo: 'nota_tecnica',
    resumo: 'A Organização Pan-Americana da Saúde enfatiza a importância de campanhas de informação sem estigmatização, articuladas diretamente com movimentos sociais e serviços de saúde sexual, garantindo privacidade e acolhimento.',
    linkOficial: 'https://www.paho.org/pt/brasil',
    categoria: 'Epidemiologia'
  }
];
