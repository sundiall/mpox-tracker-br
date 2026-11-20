/**
 * Metadados Oficiais de Sincronização & Agenda de Atualização
 * Gerado automaticamente pelo pipeline de vigilância automatizada (scripts/update_data.py)
 * Ministério da Saúde (SVSA/CNIE) & Sinan / DATASUS
 */

export interface SyncMetadata {
  ultimaAtualizacaoDados: string;      // Timestamp ISO ou legível do snapshot oficial
  ultimaAtualizacaoFormatada: string; // ex: "18/11/2026 às 17:30 BRT (SE 46/2026)"
  semanaEpidemiologica: string;        // "SE 46/2026"
  proximaAtualizacaoPrevista: string;  // Próxima checagem horária e consolidação
  proximaSemanaPrevista: string;       // "SE 47/2026"
  periodicidadeOficial: string;        // "Horária adaptativa (07h-22h) + Semanal SVSA/MS"
  fontePrimaria: string;               // "DATASUS / Sinan / PowerBI Oficial MS & RSS"
  statusConexao: 'sincronizado' | 'pendente';
  cronSchedule: string;                // "Horário Contínuo (07h às 22h BRT)"
  emailContato: string;
}

export const syncMetadata: SyncMetadata = {
  ultimaAtualizacaoDados: "2026-11-20T09:50:04.031445-03:00",
  ultimaAtualizacaoFormatada: "20/11/2026 às 09:50 BRT (SE 46/2026)",
  semanaEpidemiologica: "SE 46/2026",
  proximaAtualizacaoPrevista: "20/11 às 10:00 BRT (Vigilância Horária) • 24/11 às 03:00 BRT (SE 47/2026)",
  proximaSemanaPrevista: "SE 47/2026",
  periodicidadeOficial: "Horária adaptativa (07h às 22h BRT em campanha) + Terças-feiras (SVSA/MS)",
  fontePrimaria: "DATASUS / Sinan / PowerBI Ministério da Saúde & Feeds Oficiais",
  statusConexao: "sincronizado",
  cronSchedule: "Horária contínua em campanha (07h-22h BRT) via GitHub Actions",
  emailContato: "357946931+sundiall@users.noreply.github.com"
};
