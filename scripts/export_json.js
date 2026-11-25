import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { officialAlerts } from '../src/data/alerts.ts';
import { vaccinationSites } from '../src/data/vaccination_sites.ts';
import { vaccineMilestones } from '../src/data/vaccines.ts';
import { epidemicTimeSeries, weeklyByYearData, epidemicMilestones, vaccineProgressTimeData } from '../src/data/time_series.ts';
import { statesData, nationalSummary } from '../src/data/epidemiology.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.resolve(__dirname, '../public/data');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Preservar alertas dinâmicos gerados pelo agente se já existirem
const alertsJsonPath = path.join(outputDir, 'alerts.json');
let alertsToExport = officialAlerts;
if (fs.existsSync(alertsJsonPath)) {
  try {
    const existingAlerts = JSON.parse(fs.readFileSync(alertsJsonPath, 'utf-8'));
    if (Array.isArray(existingAlerts) && existingAlerts.length > 0) {
      const seenIds = new Set(existingAlerts.map((a) => a.id));
      const seenTitles = new Set(existingAlerts.map((a) => a.titulo?.toLowerCase().trim()));
      const merged = [...existingAlerts];
      for (const baseAlert of officialAlerts) {
        if (!seenIds.has(baseAlert.id) && !seenTitles.has(baseAlert.titulo?.toLowerCase().trim())) {
          merged.push(baseAlert);
        }
      }
      merged.sort((a, b) => new Date(b.dataPublicacao).getTime() - new Date(a.dataPublicacao).getTime());
      alertsToExport = merged;
    }
  } catch (e) {
    console.warn('Aviso ao mesclar alerts.json:', e);
  }
}

fs.writeFileSync(
  alertsJsonPath,
  JSON.stringify(alertsToExport, null, 2),
  'utf-8'
);

// Preservar alterações dinâmicas de status feitas pelo agente se já existirem
const sitesJsonPath = path.join(outputDir, 'vaccination_sites.json');
let sitesToExport = vaccinationSites;
if (fs.existsSync(sitesJsonPath)) {
  try {
    const existing = JSON.parse(fs.readFileSync(sitesJsonPath, 'utf-8'));
    if (Array.isArray(existing) && existing.length > 0) {
      // Mesclar mantendo status dinâmico atualizado pelo agente
      const statusMap = new Map(existing.map((s) => [s.id, {
        statusEstoque: s.statusEstoque,
        dataAtualizacaoStatus: s.dataAtualizacaoStatus,
        notaStatus: s.notaStatus,
        previsaoFutura: s.previsaoFutura
      }]));
      sitesToExport = vaccinationSites.map((s) => {
        const dynamicData = statusMap.get(s.id);
        return dynamicData ? { ...s, ...dynamicData, fonteStatus: s.fonteStatus } : s;
      });
    }
  } catch (e) {
    console.warn('Aviso ao mesclar vaccination_sites.json:', e);
  }
}

fs.writeFileSync(
  sitesJsonPath,
  JSON.stringify(sitesToExport, null, 2),
  'utf-8'
);

fs.writeFileSync(
  path.join(outputDir, 'vaccines.json'),
  JSON.stringify(vaccineMilestones, null, 2),
  'utf-8'
);

fs.writeFileSync(
  path.join(outputDir, 'time_series.json'),
  JSON.stringify({
    epidemicTimeSeries,
    weeklyByYearData,
    epidemicMilestones,
    vaccineProgressTimeData,
    ultimaAtualizacao: new Date().toISOString()
  }, null, 2),
  'utf-8'
);

fs.writeFileSync(
  path.join(outputDir, 'epidemiology.json'),
  JSON.stringify({
    nationalSummary,
    statesData
  }, null, 2),
  'utf-8'
);

console.log(`✅ [Export JSON] Sincronizados ${officialAlerts.length} alertas, ${vaccinationSites.length} postos, ${vaccineMilestones.length} marcos, ${epidemicTimeSeries.length} semanas e ${statesData.length} UFs em ${outputDir}`);
