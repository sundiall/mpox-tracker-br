import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { officialAlerts } from '../src/data/alerts.ts';
import { vaccinationSites } from '../src/data/vaccination_sites.ts';
import { vaccineMilestones } from '../src/data/vaccines.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.resolve(__dirname, '../public/data');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(
  path.join(outputDir, 'alerts.json'),
  JSON.stringify(officialAlerts, null, 2),
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

console.log(`✅ [Export JSON] Sincronizados ${officialAlerts.length} alertas, ${vaccinationSites.length} postos e ${vaccineMilestones.length} marcos em ${outputDir}`);
