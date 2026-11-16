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
  }
];

