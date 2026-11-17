/**
 * Metadados Oficiais de Sincronização & Agenda de Atualização
 * Ministério da Saúde (SVSA/CNIE) & Sinan / DATASUS
 */

export interface SyncMetadata {
  ultimaAtualizacaoDados: string;      // Timestamp ISO ou legível do snapshot oficial
  ultimaAtualizacaoFormatada: string; // "16 de Novembro de 2026 às 20:59 BRT"
  semanaEpidemiologica: string;        // "SE 46/2026"
  proximaAtualizacaoPrevista: string;  // "24 de Novembro de 2026 às 03:00 BRT"
  proximaSemanaPrevista: string;       // "SE 47/2026"
  periodicidadeOficial: string;        // "Semanal (Ciclo Terças-feiras / SVSA-MS)"
  fontePrimaria: string;               // "DATASUS / Sinan / PowerBI Oficial MS"
  statusConexao: 'sincronizado' | 'pendente';
  cronSchedule: string;                // "Terças-feiras às 06:00 UTC (03:00 Brasília)"
  emailContato: string;                // "357946931+sundiall@users.noreply.github.com"
}

export const syncMetadata: SyncMetadata = {
  ultimaAtualizacaoDados: "2026-11-16T20:59:28-03:00",
  ultimaAtualizacaoFormatada: "16/11/2026 às 20:59 BRT (SE 46/2026)",
  semanaEpidemiologica: "SE 46/2026",
  proximaAtualizacaoPrevista: "24/11/2026 às 03:00 BRT (Consolidação SE 47/2026)",
  proximaSemanaPrevista: "SE 47/2026",
  periodicidadeOficial: "Semanal (Fechamento nas terças-feiras pela SVSA/MS)",
  fontePrimaria: "DATASUS / Sinan / PowerBI Ministério da Saúde",
  statusConexao: "sincronizado",
  cronSchedule: "Terças-feiras às 06:00 UTC (03:00 BRT) + Quartas às 18:00 UTC",
  emailContato: "357946931+sundiall@users.noreply.github.com"
};
