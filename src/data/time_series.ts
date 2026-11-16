export interface EpidemiologicalWeekData {
  semana: string; // e.g. "2022-SE25"
  ano: number;
  semanaNum: number;
  casosNovos: number;
  casosAcumulados: number;
  obitosNovos: number;
  obitosAcumulados: number;
  mediaMovel7d: number;
}

export interface VaccineRolloutTimeData {
  mes: string; // "2023-03"
  periodoRotulo: string; // "Mar 2023"
  dosesDistribuidasAcumuladas: number;
  dosesAplicadasAcumuladas: number;
  primeiraDose: number;
  segundaDose: number;
}

// Série histórica nacional de Mpox no Brasil (2022 - 2026) baseada nos Informes da SVSA/MS e Sinan
export const nationalEpidemicCurve: EpidemiologicalWeekData[] = [
  // Onda Inicial 2022
  { semana: '2022-SE23', ano: 2022, semanaNum: 23, casosNovos: 12, casosAcumulados: 12, obitosNovos: 0, obitosAcumulados: 0, mediaMovel7d: 1.7 },
  { semana: '2022-SE26', ano: 2022, semanaNum: 26, casosNovos: 84, casosAcumulados: 168, obitosNovos: 0, obitosAcumulados: 0, mediaMovel7d: 12.0 },
  { semana: '2022-SE29', ano: 2022, semanaNum: 29, casosNovos: 340, casosAcumulados: 812, obitosNovos: 1, obitosAcumulados: 1, mediaMovel7d: 48.5 },
  { semana: '2022-SE32', ano: 2022, semanaNum: 32, casosNovos: 980, casosAcumulados: 2540, obitosNovos: 1, obitosAcumulados: 2, mediaMovel7d: 140.0 },
  { semana: '2022-SE34', ano: 2022, semanaNum: 34, casosNovos: 1260, casosAcumulados: 4850, obitosNovos: 2, obitosAcumulados: 4, mediaMovel7d: 180.0 }, // Pico 2022
  { semana: '2022-SE37', ano: 2022, semanaNum: 37, casosNovos: 890, casosAcumulados: 6920, obitosNovos: 3, obitosAcumulados: 7, mediaMovel7d: 127.1 },
  { semana: '2022-SE41', ano: 2022, semanaNum: 41, casosNovos: 410, casosAcumulados: 8410, obitosNovos: 2, obitosAcumulados: 9, mediaMovel7d: 58.5 },
  { semana: '2022-SE46', ano: 2022, semanaNum: 46, casosNovos: 195, casosAcumulados: 9480, obitosNovos: 2, obitosAcumulados: 11, mediaMovel7d: 27.8 },
  { semana: '2022-SE52', ano: 2022, semanaNum: 52, casosNovos: 85, casosAcumulados: 10120, obitosNovos: 1, obitosAcumulados: 12, mediaMovel7d: 12.1 },

  // Período Interendêmico 2023 (Início da Vacinação)
  { semana: '2023-SE08', ano: 2023, semanaNum: 8, casosNovos: 45, casosAcumulados: 10410, obitosNovos: 1, obitosAcumulados: 13, mediaMovel7d: 6.4 },
  { semana: '2023-SE16', ano: 2023, semanaNum: 16, casosNovos: 32, casosAcumulados: 10620, obitosNovos: 0, obitosAcumulados: 13, mediaMovel7d: 4.5 },
  { semana: '2023-SE24', ano: 2023, semanaNum: 24, casosNovos: 28, casosAcumulados: 10810, obitosNovos: 1, obitosAcumulados: 14, mediaMovel7d: 4.0 },
  { semana: '2023-SE36', ano: 2023, semanaNum: 36, casosNovos: 35, casosAcumulados: 11090, obitosNovos: 0, obitosAcumulados: 14, mediaMovel7d: 5.0 },
  { semana: '2023-SE48', ano: 2023, semanaNum: 48, casosNovos: 42, casosAcumulados: 11390, obitosNovos: 1, obitosAcumulados: 15, mediaMovel7d: 6.0 },

  // Retomada e Monitoramento 2024 (Alerta Clado I e Reforço Clado IIb)
  { semana: '2024-SE08', ano: 2024, semanaNum: 8, casosNovos: 68, casosAcumulados: 11620, obitosNovos: 0, obitosAcumulados: 15, mediaMovel7d: 9.7 },
  { semana: '2024-SE18', ano: 2024, semanaNum: 18, casosNovos: 85, casosAcumulados: 11980, obitosNovos: 1, obitosAcumulados: 16, mediaMovel7d: 12.1 },
  { semana: '2024-SE28', ano: 2024, semanaNum: 28, casosNovos: 115, casosAcumulados: 12340, obitosNovos: 0, obitosAcumulados: 16, mediaMovel7d: 16.4 },
  { semana: '2024-SE34', ano: 2024, semanaNum: 34, casosNovos: 148, casosAcumulados: 12580, obitosNovos: 1, obitosAcumulados: 17, mediaMovel7d: 21.1 },
  { semana: '2024-SE44', ano: 2024, semanaNum: 44, casosNovos: 92, casosAcumulados: 12720, obitosNovos: 0, obitosAcumulados: 17, mediaMovel7d: 13.1 },

  // Monitoramento Recente 2025 - 2026
  { semana: '2025-SE10', ano: 2025, semanaNum: 10, casosNovos: 48, casosAcumulados: 12780, obitosNovos: 0, obitosAcumulados: 17, mediaMovel7d: 6.8 },
  { semana: '2025-SE30', ano: 2025, semanaNum: 30, casosNovos: 32, casosAcumulados: 12815, obitosNovos: 1, obitosAcumulados: 18, mediaMovel7d: 4.5 },
  { semana: '2026-SE05', ano: 2026, semanaNum: 5, casosNovos: 15, casosAcumulados: 12832, obitosNovos: 0, obitosAcumulados: 18, mediaMovel7d: 2.1 },
  { semana: '2026-SE45', ano: 2026, semanaNum: 45, casosNovos: 8, casosAcumulados: 12840, obitosNovos: 0, obitosAcumulados: 18, mediaMovel7d: 1.1 }
];

export const vaccineProgressTimeData: VaccineRolloutTimeData[] = [
  { mes: '2022-10', periodoRotulo: 'Out 2022', dosesDistribuidasAcumuladas: 9800, dosesAplicadasAcumuladas: 1200, primeiraDose: 1150, segundaDose: 50 },
  { mes: '2023-03', periodoRotulo: 'Mar 2023', dosesDistribuidasAcumuladas: 26000, dosesAplicadasAcumuladas: 9800, primeiraDose: 7200, segundaDose: 2600 },
  { mes: '2023-08', periodoRotulo: 'Ago 2023', dosesDistribuidasAcumuladas: 34000, dosesAplicadasAcumuladas: 24500, primeiraDose: 14800, segundaDose: 9700 },
  { mes: '2024-03', periodoRotulo: 'Mar 2024', dosesDistribuidasAcumuladas: 38000, dosesAplicadasAcumuladas: 32100, primeiraDose: 18900, segundaDose: 13200 },
  { mes: '2024-09', periodoRotulo: 'Set 2024', dosesDistribuidasAcumuladas: 45000, dosesAplicadasAcumuladas: 38200, primeiraDose: 22400, segundaDose: 15800 },
  { mes: '2025-06', periodoRotulo: 'Jun 2025', dosesDistribuidasAcumuladas: 47000, dosesAplicadasAcumuladas: 40100, primeiraDose: 23200, segundaDose: 16900 },
  { mes: '2026-11', periodoRotulo: 'Nov 2026', dosesDistribuidasAcumuladas: 48500, dosesAplicadasAcumuladas: 41200, primeiraDose: 23800, segundaDose: 17400 }
];
