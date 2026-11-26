/**
 * Metadados Oficiais de Sincronização & Agenda de Atualização
 * Gerado automaticamente pelo pipeline de vigilância automatizada (scripts/update_data.py)
 * Ministério da Saúde (SVSA/CNIE) & Sinan / DATASUS
 * Configurado para execução automática 30 minutos após cada atualização oficial.
 */

export interface SyncMetadata {
  ultimaAtualizacaoDados: string;      // Timestamp ISO ou legível do snapshot oficial
  ultimaAtualizacaoFormatada: string; // ex: "25/11/2026 às 17:30 BRT (SE 48/2026)"
  semanaEpidemiologica: string;        // "SE 48/2026"
  proximaAtualizacaoPrevista: string;  // Próxima checagem :30 e consolidação
  proximaSemanaPrevista: string;       // "SE 49/2026"
  periodicidadeOficial: string;        // "Horária adaptativa (:30 de cada hora) + Terças-feiras (SVSA/MS)"
  fontePrimaria: string;               // "DATASUS / Sinan / PowerBI Oficial MS & RSS"
  statusConexao: 'sincronizado' | 'pendente';
  cronSchedule: string;                // "30 * * * * (30 minutos após a hora)"
  emailContato: string;
}

export const syncMetadata: SyncMetadata = {
  ultimaAtualizacaoDados: "2026-11-26T08:24:03.617908-03:00",
  ultimaAtualizacaoFormatada: "26/11/2026 às 08:24 BRT (SE 47/2026)",
  semanaEpidemiologica: "SE 47/2026",
  proximaAtualizacaoPrevista: "26/11 às 09:30 BRT (Ciclo :30) • 01/12 às 03:30 BRT (SE 48/2026)",
  proximaSemanaPrevista: "SE 48/2026",
  periodicidadeOficial: "Horária adaptativa (minuto :30 de cada hora das 07h às 22h BRT) + Terças-feiras 03:30 BRT (SVSA/MS)",
  fontePrimaria: "DATASUS / Sinan / PowerBI Ministério da Saúde & Feeds Oficiais",
  statusConexao: "sincronizado",
  cronSchedule: "30 * * * * via GitHub Actions (30 min após publicações oficiais)",
  emailContato: "357946931+sundiall@users.noreply.github.com"
};
