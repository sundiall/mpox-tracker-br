export interface VaccineMilestone {
  id: string;
  data: string; // ISO date YYYY-MM-DD
  titulo: string;
  tipo: 'aquisicao' | 'distribuicao' | 'normativa' | 'estudo';
  quantidadeDoses?: number;
  publicoAlvo: string;
  estadosEnvolvidos: string[];
  detalhes: string;
  fonteOficial: string;
  urlFonte?: string;
  status: 'concluido' | 'em_andamento' | 'previsto';
}

export const vaccineMilestones: VaccineMilestone[] = [
  {
    id: 'milestone-1',
    data: '2022-08-25',
    titulo: 'Aprovação Emergencial da Vacina MVA-BN pela ANVISA',
    tipo: 'normativa',
    publicoAlvo: 'Pessoas com alto risco de exposição e contatos diretos de casos confirmados',
    estadosEnvolvidos: ['Nacional'],
    detalhes: 'A Diretoria Colegiada da Anvisa aprovou a dispensa de registro para importação excepcional da vacina JYNNEOS/Imvanex (Bavarian Nordic), vírus vivo atenuado não replicante.',
    fonteOficial: 'Resolução da Diretoria Colegiada (RDC) Anvisa',
    urlFonte: 'https://www.gov.br/anvisa/pt-br',
    status: 'concluido'
  },
  {
    id: 'milestone-2',
    data: '2022-10-04',
    titulo: 'Chegada do Primeiro Lote ao Brasil via Fundo Rotatório da OPAS',
    tipo: 'aquisicao',
    quantidadeDoses: 9800,
    publicoAlvo: 'Profissionais de saúde de laboratórios de referência (NB-3) e contatos imediatos',
    estadosEnvolvidos: ['Nacional'],
    detalhes: 'Primeira remessa internacional de 9.800 doses desembarcou no Aeroporto de Guarulhos/SP, adquirida pelo Ministério da Saúde em articulação com a Organização Pan-Americana da Saúde.',
    fonteOficial: 'Ministério da Saúde - SVSA',
    urlFonte: 'https://www.gov.br/saude',
    status: 'concluido'
  },
  {
    id: 'milestone-3',
    data: '2023-03-13',
    titulo: 'Início da Campanha Nacional de Vacinação Pré-Exposição e Pós-Exposição',
    tipo: 'distribuicao',
    quantidadeDoses: 26000,
    publicoAlvo: 'Pessoas vivendo com HIV/aids com CD4 < 200 céls/mm³ e comunicantes de casos graves',
    estadosEnvolvidos: ['SP', 'RJ', 'MG', 'BA', 'DF', 'CE', 'PR', 'RS'],
    detalhes: 'Distribuição prioritária para as Unidades da Federação com mais de 80% dos casos registrados no país. Esquema original de 2 doses (0,5 mL via subcutânea) com intervalo de 28 dias.',
    fonteOficial: 'Nota Técnica nº 40/2023-CGPNI/DEIDT/SVS/MS',
    status: 'concluido'
  },
  {
    id: 'milestone-4',
    data: '2023-08-18',
    titulo: 'Adoção da Estratégia de Dose Fracionada Intradérmica (0,1 mL - 1/5 da dose)',
    tipo: 'normativa',
    publicoAlvo: 'Usuários de PrEP (Profilaxia Pré-Exposição) e profissionais de laboratório',
    estadosEnvolvidos: ['RJ', 'SP', 'DF', 'MG', 'BA'],
    detalhes: 'Frente à escassez global do imunizante, o Ministério da Saúde orientou a administração intradérmica de 0,1 mL (1/5 da dose subcutânea padrão). A estratégia multiplica em até 5 vezes o rendimento por frasco, garantindo títulos protetores comparáveis aos 0,5 mL para indivíduos imunocompetentes e usuários de PrEP.',
    fonteOficial: 'Informe Técnico PNI/DATHI/SVSA e Resolução ANVISA',
    status: 'concluido'
  },
  {
    id: 'milestone-5',
    data: '2024-08-22',
    titulo: 'Criação do Centro de Operações de Emergência (COE Mpox) e Reforço de Estoques',
    tipo: 'distribuicao',
    quantidadeDoses: 25000,
    publicoAlvo: 'Grupos prioritários nas capitais com maior incidência e controle de fronteiras',
    estadosEnvolvidos: ['RJ', 'SP', 'CE', 'DF', 'MG', 'BA', 'RS', 'PR', 'GO'],
    detalhes: 'Em resposta à declaração de Emergência em Saúde Pública de Importância Internacional (ESPII) pela OMS devido à circulação do Clado Ib, o Ministério da Saúde encomendou novo lote de 25 mil doses e enviou remessas imediatas de 3.650 doses fracionadas para 9 estados prioritários, com destaque para Rio de Janeiro e São Paulo.',
    fonteOficial: 'Ministério da Saúde - Gabinete do Ministro / COE Mpox',
    urlFonte: 'https://www.gov.br/saude/pt-br/assuntos/noticias/2024/agosto/ministerio-da-saude-instala-centro-de-operacoes-de-emergencia-para-mpox',
    status: 'concluido'
  },
  {
    id: 'milestone-6',
    data: '2025-06-10',
    titulo: 'Consolidação da Cobertura de Segunda Dose e Monitoramento de Efetividade',
    tipo: 'estudo',
    quantidadeDoses: 12000,
    publicoAlvo: 'População vacinada com D1 (reforço após 28 dias)',
    estadosEnvolvidos: ['RJ', 'SP', 'DF'],
    detalhes: 'Avaliação de efetividade vacinal da via intradérmica no Rio de Janeiro demonstrando taxa de soroconversão superior a 90% em indivíduos aderentes à PrEP, com baixa taxa de reações adversas sistêmicas.',
    fonteOficial: 'Observatório Epidemiológico Fiocruz / SMS-Rio',
    status: 'concluido'
  },
  {
    id: 'milestone-7',
    data: '2026-03-15',
    titulo: 'Manutenção de Estoque Estratégico e Vigilância Ativa de Novas Cepas',
    tipo: 'distribuicao',
    quantidadeDoses: 15000,
    publicoAlvo: 'Manutenção de estoque regulador nos Centros de Referência (SAE/CTA)',
    estadosEnvolvidos: ['Nacional'],
    detalhes: 'Doses mantidas a -20°C nos centros de distribuição nacional para despacho sob demanda em caso de novos clusters ou surtos localizados.',
    fonteOficial: 'Coordenação Geral de Vigilância em Saúde - SVSA/MS',
    status: 'em_andamento'
  },
  {
    id: 'milestone-8',
    data: '2026-11-17',
    titulo: 'Liberação Ampla para Usuários de PrEP e Trabalhadores Expostos (RJ e SP)',
    tipo: 'distribuicao',
    quantidadeDoses: 5000,
    publicoAlvo: 'Usuários de PrEP (com laudo/receita até 6 meses), PVHA com CD4 < 200 e profissionais expostos',
    estadosEnvolvidos: ['RJ', 'SP'],
    detalhes: 'A Prefeitura do Rio de Janeiro (SMS-Rio) liberou formalmente a vacinação contra Mpox para todos os usuários em uso de PrEP que nunca tenham tomado a vacina, além de trabalhadores de saúde e laboratório com risco ocupacional. Aplicação concentrada nos Super Centros Cariocas (Botafogo, Shopping Nova América, ParkShopping Campo Grande), CEVAA Dr. Álvaro Aguiar e CRIE/Fiocruz.',
    fonteOficial: 'Secretaria Municipal de Saúde do Rio de Janeiro (SMS-Rio) / Ministério da Saúde',
    urlFonte: 'https://prefeitura.rio/saude',
    status: 'concluido'
  }
];

export interface PopulationReleaseCriteria {
  id: string;
  populacao: string;
  categoria: 'pre_exposicao' | 'pos_exposicao' | 'ocupacional';
  dataLiberacao: string;
  marcoTemporal: string;
  criteriosElegibilidade: string;
  documentosExigidos: string[];
  estadosComDisponibilidade: string[];
  esquemaVacinal: string;
  locaisAtendimento: string;
  statusLiberacao: 'liberado_ativo' | 'estoque_limitado' | 'sob_demanda';
  detalhesAdicionais?: string;
}

export const vaccinePopulationsRelease: PopulationReleaseCriteria[] = [
  {
    id: 'pop-prep',
    populacao: 'Usuários de Profilaxia Pré-Exposição ao HIV (PrEP)',
    categoria: 'pre_exposicao',
    dataLiberacao: '2023-08-18 (Pioneiro RJ/SP) • 2026-11-17 (Ampliação Ampla RJ/SP)',
    marcoTemporal: 'Liberado com ampliação ampla no Rio de Janeiro e São Paulo',
    criteriosElegibilidade: 'Pessoas de 18 a 49 anos em uso regular de PrEP que nunca receberam nenhuma dose da vacina de Mpox (MVA-BN / Jynneos).',
    documentosExigidos: [
      'Documento de identificação oficial com foto e CPF',
      'Receita médica válida ou laudo comprobatório de uso de PrEP emitido nos últimos 6 meses',
      'Cartão do SUS e caderneta de vacinação (se houver)'
    ],
    estadosComDisponibilidade: ['RJ', 'SP', 'DF'],
    esquemaVacinal: '2 doses (0,1 mL via intradérmica ou 0,5 mL subcutânea) com intervalo de 28 dias.',
    locaisAtendimento: 'RJ: Super Centros Cariocas de Vacinação (Botafogo, Shopping Nova América, ParkShopping Campo Grande), CEVAA Dr. Álvaro Aguiar e CRIE/Fiocruz. SP: Serviços de Atenção Especializada (SAE) e CRIEs.',
    statusLiberacao: 'liberado_ativo',
    detalhesAdicionais: 'A vacinação ocorre enquanto durar o estoque de doses remanescentes do Ministério da Saúde.'
  },
  {
    id: 'pop-pvha',
    populacao: 'Pessoas Vivendo com HIV/Aids (PVHA com CD4 < 200 céls/mm³)',
    categoria: 'pre_exposicao',
    dataLiberacao: '2023-03-13 (Campanha Nacional PNI)',
    marcoTemporal: 'Grupo prioritário nº 1 permanente no SUS',
    criteriosElegibilidade: 'Pessoas vivendo com HIV com idade igual ou superior a 18 anos e contagem de linfócitos T-CD4 inferior a 200 céls/mm³ (com prioridade clínica para CD4 < 100 céls/mm³).',
    documentosExigidos: [
      'Documento de identificação oficial com foto e CPF',
      'Exame laboratorial comprobatório de contagem de CD4 recente (últimos 6 a 12 meses)',
      'Relatório médico ou comprovante de acompanhamento no SAE/CTA'
    ],
    estadosComDisponibilidade: ['Nacional', 'SP', 'RJ', 'MG', 'BA', 'DF', 'CE', 'PR', 'RS'],
    esquemaVacinal: '2 doses de 0,5 mL via subcutânea com intervalo de 28 dias (via subcutânea prioritária em imunodeprimidos graves).',
    locaisAtendimento: 'Centros de Referência para Imunobiológicos Especiais (CRIE) e Serviços de Atendimento Especializado (SAE) de todo o país.',
    statusLiberacao: 'liberado_ativo'
  },
  {
    id: 'pop-pos-exposicao',
    populacao: 'Contatos Íntimos / Comunicantes de Casos (Profilaxia Pós-Exposição)',
    categoria: 'pos_exposicao',
    dataLiberacao: '2023-03-13 (Campanha Nacional PNI)',
    marcoTemporal: 'Vigilância ativa pós-contato',
    criteriosElegibilidade: 'Pessoas de 18 a 49 anos que tiveram contato físico íntimo, contato sexual direto ou exposição a fluidos corporais de pessoa com caso confirmado ou provável de Mpox nos últimos 14 dias.',
    documentosExigidos: [
      'Encaminhamento da vigilância epidemiológica municipal ou relatório de investigação de contato',
      'Documento de identificação com foto'
    ],
    estadosComDisponibilidade: ['Nacional'],
    esquemaVacinal: '2 doses com intervalo de 28 dias. A 1ª dose deve ser administrada idealmente em até 4 dias após o contato para prevenir a infecção, ou em até 14 dias para reduzir a gravidade.',
    locaisAtendimento: 'Unidades de vigilância municipal e CRIEs indicados pelo Centro de Informações Estratégicas em Vigilância em Saúde (CIEVS).',
    statusLiberacao: 'liberado_ativo'
  },
  {
    id: 'pop-laboratorio',
    populacao: 'Profissionais de Laboratórios de Referência (Ortopoxvírus)',
    categoria: 'ocupacional',
    dataLiberacao: '2022-10-04 (1º Lote OPAS)',
    marcoTemporal: 'Primeiro grupo liberado no Brasil',
    criteriosElegibilidade: 'Técnicos e pesquisadores de laboratórios de biossegurança (NB-3 ou equivalente) que manipulam diretamente culturas ativas de vírus ou espécimes clínicos de Mpox.',
    documentosExigidos: [
      'Declaração de vínculo institucional e declaração de atividade com o patógeno emitida pela chefia do laboratório',
      'Documento de identificação'
    ],
    estadosComDisponibilidade: ['Nacional'],
    esquemaVacinal: '2 doses de 0,5 mL (ou 0,1 mL ID) com intervalo de 28 dias.',
    locaisAtendimento: 'CRIEs regionais e laboratórios centrais (LACENs, Fiocruz, Instituto Adolfo Lutz, Instituto Evandro Chagas).',
    statusLiberacao: 'liberado_ativo'
  },
  {
    id: 'pop-trabalhadores-saude',
    populacao: 'Trabalhadores de Saúde e Serviços Especializados Expostos',
    categoria: 'ocupacional',
    dataLiberacao: '2026-11-17 (Remessa Estratégica RJ/SP)',
    marcoTemporal: 'Liberação ampliada recente',
    criteriosElegibilidade: 'Profissionais de saúde atuando na linha de frente de atendimento, coleta de swab de lesões suspeitas ou serviços de isolamento em áreas de alta transmissão.',
    documentosExigidos: [
      'Comprovante de vínculo empregatício em serviço de saúde de referência (SAE/CTA/CRIE/Hospital de Doenças Infecciosas)',
      'Documento profissional com foto'
    ],
    estadosComDisponibilidade: ['RJ', 'SP'],
    esquemaVacinal: '2 doses com intervalo de 28 dias.',
    locaisAtendimento: 'Super Centros de Vacinação (RJ) e Serviços Especializados (SP).',
    statusLiberacao: 'liberado_ativo'
  }
];


