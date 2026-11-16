export interface StateEpidemiology {
  uf: string;
  nome: string;
  regiao: 'Sudeste' | 'Nordeste' | 'Sul' | 'Centro-Oeste' | 'Norte';
  casosConfirmados: number;
  casosProvaveis: number;
  casosSuspeitos: number;
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
  totalObitos: number;
  taxaLetalidadeNacional: number;
  totalDosesDistribuidas: number;
  totalDosesAplicadas: number;
  perfilDemografico: {
    faixaEtariaPredominante: string;
    porcentagemHSH: number; // ~85-92% no surto brasileiro
    porcentagemMasculino: number;
    porcentagemPessoasVivendoComHIV: number;
    faixa18a49Anos: number;
  };
}

export const nationalSummary: NationalSummary = {
  ultimaAtualizacao: '2026-11-15T18:00:00-03:00',
  totalConfirmados: 12840,
  totalProvaveis: 1980,
  totalSuspeitos: 2450,
  totalObitos: 18,
  taxaLetalidadeNacional: 0.14,
  totalDosesDistribuidas: 48500,
  totalDosesAplicadas: 41200,
  perfilDemografico: {
    faixaEtariaPredominante: '18 a 49 anos',
    porcentagemHSH: 89.4,
    porcentagemMasculino: 91.8,
    porcentagemPessoasVivendoComHIV: 54.2,
    faixa18a49Anos: 93.6
  }
};

export const statesData: StateEpidemiology[] = [
  {
    uf: 'SP',
    nome: 'São Paulo',
    regiao: 'Sudeste',
    casosConfirmados: 5480,
    casosProvaveis: 720,
    casosSuspeitos: 890,
    obitos: 6,
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
    casosConfirmados: 2980,
    casosProvaveis: 460,
    casosSuspeitos: 510,
    obitos: 5,
    taxaLetalidade: 0.17,
    tendencia: 'estavel',
    dosesDistribuidas: 11200,
    dosesAplicadas: 9800,
    coberturaPopulacaoAlvo: 87.5
  },
  {
    uf: 'MG',
    nome: 'Minas Gerais',
    regiao: 'Sudeste',
    casosConfirmados: 1140,
    casosProvaveis: 180,
    casosSuspeitos: 210,
    obitos: 2,
    taxaLetalidade: 0.18,
    tendencia: 'queda',
    dosesDistribuidas: 4200,
    dosesAplicadas: 3500,
    coberturaPopulacaoAlvo: 83.3
  },
  {
    uf: 'BA',
    nome: 'Bahia',
    regiao: 'Nordeste',
    casosConfirmados: 540,
    casosProvaveis: 95,
    casosSuspeitos: 130,
    obitos: 1,
    taxaLetalidade: 0.19,
    tendencia: 'estavel',
    dosesDistribuidas: 2100,
    dosesAplicadas: 1750,
    coberturaPopulacaoAlvo: 83.3
  },
  {
    uf: 'DF',
    nome: 'Distrito Federal',
    regiao: 'Centro-Oeste',
    casosConfirmados: 490,
    casosProvaveis: 85,
    casosSuspeitos: 110,
    obitos: 1,
    taxaLetalidade: 0.20,
    tendencia: 'estavel',
    dosesDistribuidas: 2400,
    dosesAplicadas: 2150,
    coberturaPopulacaoAlvo: 89.6
  },
  {
    uf: 'CE',
    nome: 'Ceará',
    regiao: 'Nordeste',
    casosConfirmados: 420,
    casosProvaveis: 70,
    casosSuspeitos: 90,
    obitos: 1,
    taxaLetalidade: 0.24,
    tendencia: 'queda',
    dosesDistribuidas: 1800,
    dosesAplicadas: 1480,
    coberturaPopulacaoAlvo: 82.2
  },
  {
    uf: 'PR',
    nome: 'Paraná',
    regiao: 'Sul',
    casosConfirmados: 390,
    casosProvaveis: 65,
    casosSuspeitos: 80,
    obitos: 1,
    taxaLetalidade: 0.26,
    tendencia: 'queda',
    dosesDistribuidas: 1600,
    dosesAplicadas: 1350,
    coberturaPopulacaoAlvo: 84.4
  },
  {
    uf: 'RS',
    nome: 'Rio Grande do Sul',
    regiao: 'Sul',
    casosConfirmados: 360,
    casosProvaveis: 60,
    casosSuspeitos: 75,
    obitos: 1,
    taxaLetalidade: 0.28,
    tendencia: 'estavel',
    dosesDistribuidas: 1500,
    dosesAplicadas: 1250,
    coberturaPopulacaoAlvo: 83.3
  },
  {
    uf: 'GO',
    nome: 'Goiás',
    regiao: 'Centro-Oeste',
    casosConfirmados: 290,
    casosProvaveis: 45,
    casosSuspeitos: 60,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'estavel',
    dosesDistribuidas: 1100,
    dosesAplicadas: 920,
    coberturaPopulacaoAlvo: 83.6
  },
  {
    uf: 'PE',
    nome: 'Pernambuco',
    regiao: 'Nordeste',
    casosConfirmados: 210,
    casosProvaveis: 40,
    casosSuspeitos: 55,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'queda',
    dosesDistribuidas: 950,
    dosesAplicadas: 790,
    coberturaPopulacaoAlvo: 83.2
  },
  {
    uf: 'SC',
    nome: 'Santa Catarina',
    regiao: 'Sul',
    casosConfirmados: 195,
    casosProvaveis: 35,
    casosSuspeitos: 45,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'queda',
    dosesDistribuidas: 850,
    dosesAplicadas: 690,
    coberturaPopulacaoAlvo: 81.2
  },
  {
    uf: 'ES',
    nome: 'Espírito Santo',
    regiao: 'Sudeste',
    casosConfirmados: 98,
    casosProvaveis: 22,
    casosSuspeitos: 30,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'estavel',
    dosesDistribuidas: 550,
    dosesAplicadas: 430,
    coberturaPopulacaoAlvo: 78.2
  },
  {
    uf: 'PA',
    nome: 'Pará',
    regiao: 'Norte',
    casosConfirmados: 75,
    casosProvaveis: 18,
    casosSuspeitos: 25,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'estavel',
    dosesDistribuidas: 400,
    dosesAplicadas: 310,
    coberturaPopulacaoAlvo: 77.5
  },
  {
    uf: 'AM',
    nome: 'Amazonas',
    regiao: 'Norte',
    casosConfirmados: 70,
    casosProvaveis: 15,
    casosSuspeitos: 20,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'estavel',
    dosesDistribuidas: 380,
    dosesAplicadas: 290,
    coberturaPopulacaoAlvo: 76.3
  },
  {
    uf: 'MT',
    nome: 'Mato Grosso',
    regiao: 'Centro-Oeste',
    casosConfirmados: 52,
    casosProvaveis: 12,
    casosSuspeitos: 18,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'queda',
    dosesDistribuidas: 300,
    dosesAplicadas: 230,
    coberturaPopulacaoAlvo: 76.7
  },
  {
    uf: 'MS',
    nome: 'Mato Grosso do Sul',
    regiao: 'Centro-Oeste',
    casosConfirmados: 48,
    casosProvaveis: 10,
    casosSuspeitos: 15,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'estavel',
    dosesDistribuidas: 280,
    dosesAplicadas: 215,
    coberturaPopulacaoAlvo: 76.8
  },
  {
    uf: 'RN',
    nome: 'Rio Grande do Norte',
    regiao: 'Nordeste',
    casosConfirmados: 42,
    casosProvaveis: 9,
    casosSuspeitos: 14,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'estavel',
    dosesDistribuidas: 240,
    dosesAplicadas: 180,
    coberturaPopulacaoAlvo: 75.0
  },
  {
    uf: 'PB',
    nome: 'Paraíba',
    regiao: 'Nordeste',
    casosConfirmados: 38,
    casosProvaveis: 8,
    casosSuspeitos: 12,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'queda',
    dosesDistribuidas: 220,
    dosesAplicadas: 165,
    coberturaPopulacaoAlvo: 75.0
  },
  {
    uf: 'MA',
    nome: 'Maranhão',
    regiao: 'Nordeste',
    casosConfirmados: 35,
    casosProvaveis: 8,
    casosSuspeitos: 11,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'estavel',
    dosesDistribuidas: 210,
    dosesAplicadas: 155,
    coberturaPopulacaoAlvo: 73.8
  },
  {
    uf: 'AL',
    nome: 'Alagoas',
    regiao: 'Nordeste',
    casosConfirmados: 26,
    casosProvaveis: 6,
    casosSuspeitos: 9,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'estavel',
    dosesDistribuidas: 170,
    dosesAplicadas: 125,
    coberturaPopulacaoAlvo: 73.5
  },
  {
    uf: 'SE',
    nome: 'Sergipe',
    regiao: 'Nordeste',
    casosConfirmados: 22,
    casosProvaveis: 5,
    casosSuspeitos: 8,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'estavel',
    dosesDistribuidas: 150,
    dosesAplicadas: 110,
    coberturaPopulacaoAlvo: 73.3
  },
  {
    uf: 'PI',
    nome: 'Piauí',
    regiao: 'Nordeste',
    casosConfirmados: 19,
    casosProvaveis: 4,
    casosSuspeitos: 7,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'queda',
    dosesDistribuidas: 140,
    dosesAplicadas: 100,
    coberturaPopulacaoAlvo: 71.4
  },
  {
    uf: 'TO',
    nome: 'Tocantins',
    regiao: 'Norte',
    casosConfirmados: 16,
    casosProvaveis: 4,
    casosSuspeitos: 6,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'estavel',
    dosesDistribuidas: 120,
    dosesAplicadas: 85,
    coberturaPopulacaoAlvo: 70.8
  },
  {
    uf: 'RO',
    nome: 'Rondônia',
    regiao: 'Norte',
    casosConfirmados: 15,
    casosProvaveis: 3,
    casosSuspeitos: 5,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'estavel',
    dosesDistribuidas: 110,
    dosesAplicadas: 75,
    coberturaPopulacaoAlvo: 68.2
  },
  {
    uf: 'AP',
    nome: 'Amapá',
    regiao: 'Norte',
    casosConfirmados: 11,
    casosProvaveis: 2,
    casosSuspeitos: 4,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'estavel',
    dosesDistribuidas: 90,
    dosesAplicadas: 60,
    coberturaPopulacaoAlvo: 66.7
  },
  {
    uf: 'AC',
    nome: 'Acre',
    regiao: 'Norte',
    casosConfirmados: 9,
    casosProvaveis: 2,
    casosSuspeitos: 3,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'estavel',
    dosesDistribuidas: 80,
    dosesAplicadas: 50,
    coberturaPopulacaoAlvo: 62.5
  },
  {
    uf: 'RR',
    nome: 'Roraima',
    regiao: 'Norte',
    casosConfirmados: 8,
    casosProvaveis: 1,
    casosSuspeitos: 3,
    obitos: 0,
    taxaLetalidade: 0.0,
    tendencia: 'estavel',
    dosesDistribuidas: 70,
    dosesAplicadas: 45,
    coberturaPopulacaoAlvo: 64.3
  }
];
