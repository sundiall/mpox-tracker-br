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
  "ultimaAtualizacao": "2026-11-27T04:52:27.635557-03:00",
  "totalConfirmados": 16527,
  "totalProvaveis": 458,
  "totalSuspeitos": 619,
  "totalAno2026": 1691,
  "totalObitos": 19,
  "taxaLetalidadeNacional": 0.12,
  "totalDosesDistribuidas": 48500,
  "totalDosesAplicadas": 41200,
  "perfilDemografico": {
    "faixaEtariaPredominante": "30 a 39 anos (M\u00e9dia: 33a, Mediana: 32a)",
    "idadeMedia": 33,
    "idadeMediana": 32,
    "porcentagemHSH": 65.0,
    "porcentagemMasculino": 93.0,
    "porcentagemPessoasVivendoComHIV": 35.5,
    "faixa18a49Anos": 94.5
  }
};

export const statesData: StateEpidemiology[] = [
  {
    "uf": "SP",
    "nome": "S\u00e3o Paulo",
    "regiao": "Sudeste",
    "obitos": 7,
    "dosesDistribuidas": 18500,
    "dosesAplicadas": 16200,
    "coberturaPopulacaoAlvo": 87.5,
    "casosConfirmados": 6475,
    "casosProvaveis": 0,
    "casosSuspeitos": 0,
    "casosAno2026": 605,
    "taxaLetalidade": 0.11,
    "tendencia": "crescimento"
  },
  {
    "uf": "RJ",
    "nome": "Rio de Janeiro",
    "regiao": "Sudeste",
    "obitos": 7,
    "dosesDistribuidas": 11200,
    "dosesAplicadas": 9800,
    "coberturaPopulacaoAlvo": 87.5,
    "casosConfirmados": 2481,
    "casosProvaveis": 0,
    "casosSuspeitos": 0,
    "casosAno2026": 474,
    "taxaLetalidade": 0.28,
    "tendencia": "crescimento"
  },
  {
    "uf": "MG",
    "nome": "Minas Gerais",
    "regiao": "Sudeste",
    "obitos": 2,
    "dosesDistribuidas": 4200,
    "dosesAplicadas": 3500,
    "coberturaPopulacaoAlvo": 83.3,
    "casosConfirmados": 973,
    "casosProvaveis": 0,
    "casosSuspeitos": 0,
    "casosAno2026": 78,
    "taxaLetalidade": 0.21,
    "tendencia": "estavel"
  },
  {
    "uf": "GO",
    "nome": "Goi\u00e1s",
    "regiao": "Centro-Oeste",
    "obitos": 1,
    "dosesDistribuidas": 2400,
    "dosesAplicadas": 1980,
    "coberturaPopulacaoAlvo": 82.5,
    "casosConfirmados": 791,
    "casosProvaveis": 0,
    "casosSuspeitos": 0,
    "casosAno2026": 13,
    "taxaLetalidade": 0.13,
    "tendencia": "estavel"
  },
  {
    "uf": "CE",
    "nome": "Cear\u00e1",
    "regiao": "Nordeste",
    "obitos": 0,
    "dosesDistribuidas": 1600,
    "dosesAplicadas": 1320,
    "coberturaPopulacaoAlvo": 82.5,
    "casosConfirmados": 747,
    "casosProvaveis": 0,
    "casosSuspeitos": 0,
    "casosAno2026": 220,
    "taxaLetalidade": 0.0,
    "tendencia": "crescimento"
  },
  {
    "uf": "SC",
    "nome": "Santa Catarina",
    "regiao": "Sul",
    "obitos": 0,
    "dosesDistribuidas": 1950,
    "dosesAplicadas": 1640,
    "coberturaPopulacaoAlvo": 84.1,
    "casosConfirmados": 653,
    "casosProvaveis": 0,
    "casosSuspeitos": 0,
    "casosAno2026": 29,
    "taxaLetalidade": 0.0,
    "tendencia": "estavel"
  },
  {
    "uf": "PR",
    "nome": "Paran\u00e1",
    "regiao": "Sul",
    "obitos": 0,
    "dosesDistribuidas": 2200,
    "dosesAplicadas": 1850,
    "coberturaPopulacaoAlvo": 84.1,
    "casosConfirmados": 645,
    "casosProvaveis": 0,
    "casosSuspeitos": 0,
    "casosAno2026": 22,
    "taxaLetalidade": 0.0,
    "tendencia": "estavel"
  },
  {
    "uf": "AM",
    "nome": "Amazonas",
    "regiao": "Norte",
    "obitos": 0,
    "dosesDistribuidas": 1100,
    "dosesAplicadas": 890,
    "coberturaPopulacaoAlvo": 80.9,
    "casosConfirmados": 536,
    "casosProvaveis": 0,
    "casosSuspeitos": 0,
    "casosAno2026": 2,
    "taxaLetalidade": 0.0,
    "tendencia": "queda"
  },
  {
    "uf": "DF",
    "nome": "Distrito Federal",
    "regiao": "Centro-Oeste",
    "obitos": 1,
    "dosesDistribuidas": 2100,
    "dosesAplicadas": 1780,
    "coberturaPopulacaoAlvo": 84.8,
    "casosConfirmados": 490,
    "casosProvaveis": 0,
    "casosSuspeitos": 0,
    "casosAno2026": 78,
    "taxaLetalidade": 0.2,
    "tendencia": "estavel"
  },
  {
    "uf": "RS",
    "nome": "Rio Grande do Sul",
    "regiao": "Sul",
    "obitos": 1,
    "dosesDistribuidas": 1800,
    "dosesAplicadas": 1520,
    "coberturaPopulacaoAlvo": 84.4,
    "casosConfirmados": 426,
    "casosProvaveis": 0,
    "casosSuspeitos": 0,
    "casosAno2026": 21,
    "taxaLetalidade": 0.23,
    "tendencia": "estavel"
  },
  {
    "uf": "BA",
    "nome": "Bahia",
    "regiao": "Nordeste",
    "obitos": 0,
    "dosesDistribuidas": 1400,
    "dosesAplicadas": 1150,
    "coberturaPopulacaoAlvo": 82.1,
    "casosConfirmados": 310,
    "casosProvaveis": 0,
    "casosSuspeitos": 0,
    "casosAno2026": 18,
    "taxaLetalidade": 0.0,
    "tendencia": "estavel"
  },
  {
    "uf": "PA",
    "nome": "Par\u00e1",
    "regiao": "Norte",
    "obitos": 0,
    "dosesDistribuidas": 950,
    "dosesAplicadas": 780,
    "coberturaPopulacaoAlvo": 82.1,
    "casosConfirmados": 241,
    "casosProvaveis": 0,
    "casosSuspeitos": 0,
    "casosAno2026": 9,
    "taxaLetalidade": 0.0,
    "tendencia": "queda"
  },
  {
    "uf": "PE",
    "nome": "Pernambuco",
    "regiao": "Nordeste",
    "obitos": 0,
    "dosesDistribuidas": 1300,
    "dosesAplicadas": 1050,
    "coberturaPopulacaoAlvo": 80.8,
    "casosConfirmados": 419,
    "casosProvaveis": 0,
    "casosSuspeitos": 0,
    "casosAno2026": 19,
    "taxaLetalidade": 0.0,
    "tendencia": "estavel"
  },
  {
    "uf": "ES",
    "nome": "Esp\u00edrito Santo",
    "regiao": "Sudeste",
    "obitos": 0,
    "dosesDistribuidas": 850,
    "dosesAplicadas": 710,
    "coberturaPopulacaoAlvo": 83.5,
    "casosConfirmados": 274,
    "casosProvaveis": 0,
    "casosSuspeitos": 0,
    "casosAno2026": 6,
    "taxaLetalidade": 0.0,
    "tendencia": "queda"
  },
  {
    "uf": "MT",
    "nome": "Mato Grosso",
    "regiao": "Centro-Oeste",
    "obitos": 0,
    "dosesDistribuidas": 650,
    "dosesAplicadas": 520,
    "coberturaPopulacaoAlvo": 80.0,
    "casosConfirmados": 151,
    "casosProvaveis": 0,
    "casosSuspeitos": 0,
    "casosAno2026": 1,
    "taxaLetalidade": 0.0,
    "tendencia": "queda"
  },
  {
    "uf": "MS",
    "nome": "Mato Grosso do Sul",
    "regiao": "Centro-Oeste",
    "obitos": 0,
    "dosesDistribuidas": 600,
    "dosesAplicadas": 490,
    "coberturaPopulacaoAlvo": 81.7,
    "casosConfirmados": 190,
    "casosProvaveis": 0,
    "casosSuspeitos": 0,
    "casosAno2026": 4,
    "taxaLetalidade": 0.0,
    "tendencia": "queda"
  },
  {
    "uf": "RN",
    "nome": "Rio Grande do Norte",
    "regiao": "Nordeste",
    "obitos": 0,
    "dosesDistribuidas": 550,
    "dosesAplicadas": 440,
    "coberturaPopulacaoAlvo": 80.0,
    "casosConfirmados": 160,
    "casosProvaveis": 0,
    "casosSuspeitos": 0,
    "casosAno2026": 10,
    "taxaLetalidade": 0.0,
    "tendencia": "estavel"
  },
  {
    "uf": "PB",
    "nome": "Para\u00edba",
    "regiao": "Nordeste",
    "obitos": 0,
    "dosesDistribuidas": 500,
    "dosesAplicadas": 390,
    "coberturaPopulacaoAlvo": 78.0,
    "casosConfirmados": 147,
    "casosProvaveis": 0,
    "casosSuspeitos": 0,
    "casosAno2026": 24,
    "taxaLetalidade": 0.0,
    "tendencia": "estavel"
  },
  {
    "uf": "PI",
    "nome": "Piau\u00ed",
    "regiao": "Nordeste",
    "obitos": 0,
    "dosesDistribuidas": 450,
    "dosesAplicadas": 360,
    "coberturaPopulacaoAlvo": 80.0,
    "casosConfirmados": 41,
    "casosProvaveis": 0,
    "casosSuspeitos": 0,
    "casosAno2026": 4,
    "taxaLetalidade": 0.0,
    "tendencia": "queda"
  },
  {
    "uf": "MA",
    "nome": "Maranh\u00e3o",
    "regiao": "Nordeste",
    "obitos": 0,
    "dosesDistribuidas": 480,
    "dosesAplicadas": 370,
    "coberturaPopulacaoAlvo": 77.1,
    "casosConfirmados": 168,
    "casosProvaveis": 0,
    "casosSuspeitos": 0,
    "casosAno2026": 31,
    "taxaLetalidade": 0.0,
    "tendencia": "estavel"
  },
  {
    "uf": "SE",
    "nome": "Sergipe",
    "regiao": "Nordeste",
    "obitos": 0,
    "dosesDistribuidas": 400,
    "dosesAplicadas": 310,
    "coberturaPopulacaoAlvo": 77.5,
    "casosConfirmados": 102,
    "casosProvaveis": 0,
    "casosSuspeitos": 0,
    "casosAno2026": 1,
    "taxaLetalidade": 0.0,
    "tendencia": "queda"
  },
  {
    "uf": "AL",
    "nome": "Alagoas",
    "regiao": "Nordeste",
    "obitos": 0,
    "dosesDistribuidas": 380,
    "dosesAplicadas": 290,
    "coberturaPopulacaoAlvo": 76.3,
    "casosConfirmados": 34,
    "casosProvaveis": 0,
    "casosSuspeitos": 0,
    "casosAno2026": 0,
    "taxaLetalidade": 0.0,
    "tendencia": "queda"
  },
  {
    "uf": "RO",
    "nome": "Rond\u00f4nia",
    "regiao": "Norte",
    "obitos": 0,
    "dosesDistribuidas": 320,
    "dosesAplicadas": 250,
    "coberturaPopulacaoAlvo": 78.1,
    "casosConfirmados": 33,
    "casosProvaveis": 0,
    "casosSuspeitos": 0,
    "casosAno2026": 20,
    "taxaLetalidade": 0.0,
    "tendencia": "estavel"
  },
  {
    "uf": "TO",
    "nome": "Tocantins",
    "regiao": "Norte",
    "obitos": 0,
    "dosesDistribuidas": 280,
    "dosesAplicadas": 210,
    "coberturaPopulacaoAlvo": 75.0,
    "casosConfirmados": 20,
    "casosProvaveis": 0,
    "casosSuspeitos": 0,
    "casosAno2026": 0,
    "taxaLetalidade": 0.0,
    "tendencia": "queda"
  },
  {
    "uf": "AC",
    "nome": "Acre",
    "regiao": "Norte",
    "obitos": 0,
    "dosesDistribuidas": 220,
    "dosesAplicadas": 170,
    "coberturaPopulacaoAlvo": 77.3,
    "casosConfirmados": 4,
    "casosProvaveis": 0,
    "casosSuspeitos": 0,
    "casosAno2026": 0,
    "taxaLetalidade": 0.0,
    "tendencia": "queda"
  },
  {
    "uf": "AP",
    "nome": "Amap\u00e1",
    "regiao": "Norte",
    "obitos": 0,
    "dosesDistribuidas": 200,
    "dosesAplicadas": 150,
    "coberturaPopulacaoAlvo": 75.0,
    "casosConfirmados": 4,
    "casosProvaveis": 0,
    "casosSuspeitos": 0,
    "casosAno2026": 0,
    "taxaLetalidade": 0.0,
    "tendencia": "queda"
  },
  {
    "uf": "RR",
    "nome": "Roraima",
    "regiao": "Norte",
    "obitos": 0,
    "dosesDistribuidas": 180,
    "dosesAplicadas": 130,
    "coberturaPopulacaoAlvo": 72.2,
    "casosConfirmados": 12,
    "casosProvaveis": 0,
    "casosSuspeitos": 0,
    "casosAno2026": 2,
    "taxaLetalidade": 0.0,
    "tendencia": "queda"
  }
];
