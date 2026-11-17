export interface StateEpidemiology {
  uf: string;
  nome: string;
  regiao: 'Sudeste' | 'Nordeste' | 'Sul' | 'Centro-Oeste' | 'Norte';
  casosConfirmados: number;
  casosProvaveis: number;
  casosSuspeitos: number;
  casosAno2026: number;
  obitos: number;
  taxaLetalidade: number; // em %
  tendencia: 'crescimento' | 'estavel' | 'queda';
  dosesDistribuidas: number;
  dosesAplicadas: number;
  coberturaPopulacaoAlvo: number; // em %
}

export interface NationalSummary {
  ultimaAtualizacao: string;
  totalConfirmados: number;
  totalProvaveis: number;
  totalSuspeitos: number;
  totalAno2026: number;
  totalObitos: number;
  taxaLetalidadeNacional: number;
  totalDosesDistribuidas: number;
  totalDosesAplicadas: number;
  perfilDemografico: {
    faixaEtariaPredominante: string;
    idadeMedia: number;
    idadeMediana: number;
    porcentagemHSH: number;
    porcentagemMasculino: number;
    porcentagemPessoasVivendoComHIV: number;
    faixa18a49Anos: number;
  };
}

// Dados oficiais consolidados pelo Centro Nacional de Inteligência Epidemiológica (CNIE/SVSA/MS)
// Fonte direta: https://www.gov.br/saude/pt-br/composicao/svsa/cnie/painel-mpox
export const nationalSummary: NationalSummary = {
  ultimaAtualizacao: '2026-11-16T18:00:00-03:00',
  totalConfirmados: 15488,
  totalProvaveis: 458,
  totalSuspeitos: 619,
  totalAno2026: 1099,
  totalObitos: 19,
  taxaLetalidadeNacional: 0.12,
  totalDosesDistribuidas: 48500,
  totalDosesAplicadas: 41200,
  perfilDemografico: {
    faixaEtariaPredominante: '30 a 39 anos (Média: 33a, Mediana: 32a)',
    idadeMedia: 33,
    idadeMediana: 32,
    porcentagemHSH: 65.0, // 58% sexo exclusivo c/ homens + 7% c/ ambos
    porcentagemMasculino: 93.0,
    porcentagemPessoasVivendoComHIV: 35.5, // 5.654 de 15.934 totais; 46.1% dos com status preenchido
    faixa18a49Anos: 94.5
  }
};

// Distribuição oficial das 27 UFs consolidada do Painel Mpox (CNIE / SVSA / MS)
export const statesData: StateEpidemiology[] = [
  {
    uf: 'SP',
    nome: 'São Paulo',
    regiao: 'Sudeste',
    casosConfirmados: 6102,
    casosProvaveis: 176,
    casosSuspeitos: 230,
    casosAno2026: 409,
    obitos: 7,
    taxaLetalidade: 0.11,
    tendencia: 'estavel',
    dosesDistribuidas: 18500,
    dosesAplicadas: 16200,
    coberturaPopulacaoAlvo: 87.5
  },
  {
    uf: 'RJ',
    nome: 'Rio de Janeiro',
    regiao: 'Sudeste',
    casosConfirmados: 2335,
    casosProvaveis: 67,
    casosSuspeitos: 95,
    casosAno2026: 395,
    obitos: 7,
    taxaLetalidade: 0.29,
    tendencia: 'crescimento',
    dosesDistribuidas: 11200,
    dosesAplicadas: 9800,
    coberturaPopulacaoAlvo: 87.5
  },
  {
    uf: 'MG',
    nome: 'Minas Gerais',
    regiao: 'Sudeste',
    casosConfirmados: 914,
    casosProvaveis: 27,
    casosSuspeitos: 42,
    casosAno2026: 46,
    obitos: 2,
    taxaLetalidade: 0.21,
    tendencia: 'queda',
    dosesDistribuidas: 4200,
    dosesAplicadas: 3500,
    coberturaPopulacaoAlvo: 83.3
  },
  {
    uf: 'GO',
    nome: 'Goiás',
    regiao: 'Centro-Oeste',
    casosConfirmados: 763,
    casosProvaveis: 22,
    casosSuspeitos: 31,
    casosAno2026: 7,
    obitos: 1,
    taxaLetalidade: 0.13,
    tendencia: 'estavel',
    dosesDistribuidas: 2400,
    dosesAplicadas: 1980,
    coberturaPopulacaoAlvo: 82.5
  },
  {
    uf: 'SC',
    nome: 'Santa Catarina',
    regiao: 'Sul',
    casosConfirmados: 630,
    casosProvaveis: 18,
    casosSuspeitos: 26,
    casosAno2026: 24,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'estavel',
    dosesDistribuidas: 1950,
    dosesAplicadas: 1640,
    coberturaPopulacaoAlvo: 84.1
  },
  {
    uf: 'PR',
    nome: 'Paraná',
    regiao: 'Sul',
    casosConfirmados: 621,
    casosProvaveis: 18,
    casosSuspeitos: 25,
    casosAno2026: 16,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'queda',
    dosesDistribuidas: 1900,
    dosesAplicadas: 1590,
    coberturaPopulacaoAlvo: 83.7
  },
  {
    uf: 'CE',
    nome: 'Ceará',
    regiao: 'Nordeste',
    casosConfirmados: 573,
    casosProvaveis: 16,
    casosSuspeitos: 24,
    casosAno2026: 62,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'crescimento',
    dosesDistribuidas: 1800,
    dosesAplicadas: 1480,
    coberturaPopulacaoAlvo: 82.2
  },
  {
    uf: 'AM',
    nome: 'Amazonas',
    regiao: 'Norte',
    casosConfirmados: 523,
    casosProvaveis: 15,
    casosSuspeitos: 21,
    casosAno2026: 4,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'estavel',
    dosesDistribuidas: 1650,
    dosesAplicadas: 1380,
    coberturaPopulacaoAlvo: 83.6
  },
  {
    uf: 'DF',
    nome: 'Distrito Federal',
    regiao: 'Centro-Oeste',
    casosConfirmados: 440,
    casosProvaveis: 13,
    casosSuspeitos: 18,
    casosAno2026: 41,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'estavel',
    dosesDistribuidas: 1500,
    dosesAplicadas: 1310,
    coberturaPopulacaoAlvo: 87.3
  },
  {
    uf: 'RS',
    nome: 'Rio Grande do Sul',
    regiao: 'Sul',
    casosConfirmados: 409,
    casosProvaveis: 12,
    casosSuspeitos: 17,
    casosAno2026: 16,
    obitos: 1,
    taxaLetalidade: 0.24,
    tendencia: 'estavel',
    dosesDistribuidas: 1450,
    dosesAplicadas: 1220,
    coberturaPopulacaoAlvo: 84.1
  },
  {
    uf: 'PE',
    nome: 'Pernambuco',
    regiao: 'Nordeste',
    casosConfirmados: 401,
    casosProvaveis: 12,
    casosSuspeitos: 17,
    casosAno2026: 13,
    obitos: 1,
    taxaLetalidade: 0.24,
    tendencia: 'queda',
    dosesDistribuidas: 1400,
    dosesAplicadas: 1180,
    coberturaPopulacaoAlvo: 84.3
  },
  {
    uf: 'BA',
    nome: 'Bahia',
    regiao: 'Nordeste',
    casosConfirmados: 291,
    casosProvaveis: 8,
    casosSuspeitos: 12,
    casosAno2026: 7,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'estavel',
    dosesDistribuidas: 1100,
    dosesAplicadas: 920,
    coberturaPopulacaoAlvo: 83.6
  },
  {
    uf: 'ES',
    nome: 'Espírito Santo',
    regiao: 'Sudeste',
    casosConfirmados: 266,
    casosProvaveis: 8,
    casosSuspeitos: 11,
    casosAno2026: 6,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'estavel',
    dosesDistribuidas: 950,
    dosesAplicadas: 780,
    coberturaPopulacaoAlvo: 82.1
  },
  {
    uf: 'PA',
    nome: 'Pará',
    regiao: 'Norte',
    casosConfirmados: 231,
    casosProvaveis: 7,
    casosSuspeitos: 10,
    casosAno2026: 6,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'estavel',
    dosesDistribuidas: 850,
    dosesAplicadas: 690,
    coberturaPopulacaoAlvo: 81.2
  },
  {
    uf: 'MS',
    nome: 'Mato Grosso do Sul',
    regiao: 'Centro-Oeste',
    casosConfirmados: 182,
    casosProvaveis: 5,
    casosSuspeitos: 7,
    casosAno2026: 1,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'queda',
    dosesDistribuidas: 650,
    dosesAplicadas: 520,
    coberturaPopulacaoAlvo: 80.0
  },
  {
    uf: 'RN',
    nome: 'Rio Grande do Norte',
    regiao: 'Nordeste',
    casosConfirmados: 153,
    casosProvaveis: 5,
    casosSuspeitos: 6,
    casosAno2026: 8,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'estavel',
    dosesDistribuidas: 550,
    dosesAplicadas: 440,
    coberturaPopulacaoAlvo: 80.0
  },
  {
    uf: 'MT',
    nome: 'Mato Grosso',
    regiao: 'Centro-Oeste',
    casosConfirmados: 146,
    casosProvaveis: 4,
    casosSuspeitos: 6,
    casosAno2026: 0,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'queda',
    dosesDistribuidas: 520,
    dosesAplicadas: 410,
    coberturaPopulacaoAlvo: 78.8
  },
  {
    uf: 'MA',
    nome: 'Maranhão',
    regiao: 'Nordeste',
    casosConfirmados: 142,
    casosProvaveis: 4,
    casosSuspeitos: 6,
    casosAno2026: 9,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'estavel',
    dosesDistribuidas: 500,
    dosesAplicadas: 390,
    coberturaPopulacaoAlvo: 78.0
  },
  {
    uf: 'PB',
    nome: 'Paraíba',
    regiao: 'Nordeste',
    casosConfirmados: 125,
    casosProvaveis: 4,
    casosSuspeitos: 5,
    casosAno2026: 6,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'estavel',
    dosesDistribuidas: 450,
    dosesAplicadas: 350,
    coberturaPopulacaoAlvo: 77.8
  },
  {
    uf: 'SE',
    nome: 'Sergipe',
    regiao: 'Nordeste',
    casosConfirmados: 99,
    casosProvaveis: 3,
    casosSuspeitos: 4,
    casosAno2026: 1,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'estavel',
    dosesDistribuidas: 380,
    dosesAplicadas: 290,
    coberturaPopulacaoAlvo: 76.3
  },
  {
    uf: 'PI',
    nome: 'Piauí',
    regiao: 'Nordeste',
    casosConfirmados: 37,
    casosProvaveis: 1,
    casosSuspeitos: 2,
    casosAno2026: 1,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'queda',
    dosesDistribuidas: 180,
    dosesAplicadas: 130,
    coberturaPopulacaoAlvo: 72.2
  },
  {
    uf: 'AL',
    nome: 'Alagoas',
    regiao: 'Nordeste',
    casosConfirmados: 33,
    casosProvaveis: 1,
    casosSuspeitos: 2,
    casosAno2026: 0,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'estavel',
    dosesDistribuidas: 170,
    dosesAplicadas: 125,
    coberturaPopulacaoAlvo: 73.5
  },
  {
    uf: 'RO',
    nome: 'Rondônia',
    regiao: 'Norte',
    casosConfirmados: 32,
    casosProvaveis: 1,
    casosSuspeitos: 2,
    casosAno2026: 20,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'crescimento',
    dosesDistribuidas: 160,
    dosesAplicadas: 120,
    coberturaPopulacaoAlvo: 75.0
  },
  {
    uf: 'TO',
    nome: 'Tocantins',
    regiao: 'Norte',
    casosConfirmados: 19,
    casosProvaveis: 1,
    casosSuspeitos: 1,
    casosAno2026: 0,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'estavel',
    dosesDistribuidas: 120,
    dosesAplicadas: 85,
    coberturaPopulacaoAlvo: 70.8
  },
  {
    uf: 'RR',
    nome: 'Roraima',
    regiao: 'Norte',
    casosConfirmados: 11,
    casosProvaveis: 0,
    casosSuspeitos: 1,
    casosAno2026: 1,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'estavel',
    dosesDistribuidas: 100,
    dosesAplicadas: 70,
    coberturaPopulacaoAlvo: 70.0
  },
  {
    uf: 'AC',
    nome: 'Acre',
    regiao: 'Norte',
    casosConfirmados: 4,
    casosProvaveis: 0,
    casosSuspeitos: 1,
    casosAno2026: 0,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'estavel',
    dosesDistribuidas: 80,
    dosesAplicadas: 50,
    coberturaPopulacaoAlvo: 62.5
  },
  {
    uf: 'AP',
    nome: 'Amapá',
    regiao: 'Norte',
    casosConfirmados: 4,
    casosProvaveis: 0,
    casosSuspeitos: 1,
    casosAno2026: 0,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'estavel',
    dosesDistribuidas: 80,
    dosesAplicadas: 50,
    coberturaPopulacaoAlvo: 62.5
  }
];
