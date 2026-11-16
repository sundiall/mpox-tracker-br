export interface DemographicSlice {
  categoria: string;
  totalCasos: number;
  porcentagem: number;
}

export interface SymptomFrequency {
  sintoma: string;
  casosReportados: number;
  prevalenciaPercentual: number;
}

export interface LesionLocation {
  localizacao: string;
  frequenciaPercentual: number;
}

// Distribuição por Faixa Etária Oficial (Sinan / DATASUS)
export const ageDistributionData: DemographicSlice[] = [
  { categoria: '< 18 anos', totalCasos: 154, porcentagem: 1.2 },
  { categoria: '18 a 29 anos', totalCasos: 4930, porcentagem: 38.4 },
  { categoria: '30 a 39 anos', totalCasos: 5534, porcentagem: 43.1 },
  { categoria: '40 a 49 anos', totalCasos: 1553, porcentagem: 12.1 },
  { categoria: '50 a 59 anos', totalCasos: 514, porcentagem: 4.0 },
  { categoria: '60+ anos', totalCasos: 155, porcentagem: 1.2 }
];

// Distribuição por Raça / Cor Autodeclarada (Padrão IBGE / Sinan)
export const raceDistributionData: DemographicSlice[] = [
  { categoria: 'Parda', totalCasos: 5624, porcentagem: 43.8 },
  { categoria: 'Branca', totalCasos: 5290, porcentagem: 41.2 },
  { categoria: 'Preta', totalCasos: 1476, porcentagem: 11.5 },
  { categoria: 'Amarela', totalCasos: 103, porcentagem: 0.8 },
  { categoria: 'Indígena', totalCasos: 26, porcentagem: 0.2 },
  { categoria: 'Ignorado / Em Branco', totalCasos: 321, porcentagem: 2.5 }
];

// Distribuição por Sexo Biológico Registrado
export const sexDistributionData: DemographicSlice[] = [
  { categoria: 'Masculino', totalCasos: 11787, porcentagem: 91.8 },
  { categoria: 'Feminino', totalCasos: 1053, porcentagem: 8.2 }
];

// Práticas Sexuais e Vínculo Epidemiológico Declarado na Notificação
export const sexualPracticesData: DemographicSlice[] = [
  { categoria: 'Homens que fazem sexo com homens (HSH)', totalCasos: 10542, porcentagem: 89.4 },
  { categoria: 'Relações exclusivamente heterossexuais', totalCasos: 837, porcentagem: 7.1 },
  { categoria: 'Outras práticas / Não informado', totalCasos: 408, porcentagem: 3.5 }
];

// Prevalência dos Principais Sinais e Sintomas em Casos Confirmados
export const symptomsPrevalenceData: SymptomFrequency[] = [
  { sintoma: 'Erupção / Lesões cutâneas', casosReportados: 11492, prevalenciaPercentual: 89.5 },
  { sintoma: 'Febre de início súbito', casosReportados: 7473, prevalenciaPercentual: 58.2 },
  { sintoma: 'Linfadenopatia (ínguas dolorosas)', casosReportados: 5470, prevalenciaPercentual: 42.6 },
  { sintoma: 'Cefaleia (dor de cabeça)', casosReportados: 5110, prevalenciaPercentual: 39.8 },
  { sintoma: 'Mialgia / Dores musculares', casosReportados: 4032, prevalenciaPercentual: 31.4 },
  { sintoma: 'Astenia / Fadiga extrema', casosReportados: 3672, prevalenciaPercentual: 28.6 },
  { sintoma: 'Dor de garganta / Orofaringe', casosReportados: 2953, prevalenciaPercentual: 23.0 },
  { sintoma: 'Dor anorretal / Proctite', casosReportados: 2516, prevalenciaPercentual: 19.6 }
];

// Topografia Anatômica das Lesões Cutâneas
export const lesionLocationData: LesionLocation[] = [
  { localizacao: 'Região Genital (pênis, escroto, vulva)', frequenciaPercentual: 62.4 },
  { localizacao: 'Região Perianal e Retal', frequenciaPercentual: 44.1 },
  { localizacao: 'Face e Pescoço', frequenciaPercentual: 38.7 },
  { localizacao: 'Membros Superiores e Tronco', frequenciaPercentual: 35.2 },
  { localizacao: 'Palmas das Mãos e Plantas dos Pés', frequenciaPercentual: 22.8 },
  { localizacao: 'Cavidade Oral e Lábios', frequenciaPercentual: 16.5 }
];

// Condição Imunológica e Coinfecção com HIV (Total de Casos Confirmados)
export const immuneStatusData = {
  comHIV: 6959, // 54.2%
  semHIV: 4892, // 38.1%
  semInformacao: 989, // 7.7%
  taxaInternacaoGeral: 4.8, // % de internamento clínico
  taxaInternacaoUTI: 0.6 // % que necessitou de UTI
};
