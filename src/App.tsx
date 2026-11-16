import { useState } from 'react';
import { statesData } from './data/epidemiology';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DashboardView } from './components/DashboardView';
import { VaccinesMilestonesView } from './components/VaccinesMilestonesView';
import { ClinicalGuideFAQView } from './components/ClinicalGuideFAQView';
import { VaccinationSitesView } from './components/VaccinationSitesView';
import { AlertsRSSView } from './components/AlertsRSSView';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('painel');
  const [selectedUF, setSelectedUF] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Barra de Navegação Superior */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        states={statesData}
        selectedUF={selectedUF}
        onSelectUF={setSelectedUF}
      />

      {/* Conteúdo Principal Dinâmico */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'painel' && (
          <DashboardView
            states={statesData}
            selectedUF={selectedUF}
            onSelectUF={setSelectedUF}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'vacinas' && (
          <VaccinesMilestonesView
            selectedUF={selectedUF}
          />
        )}

        {activeTab === 'guia' && <ClinicalGuideFAQView />}

        {activeTab === 'postos' && (
          <VaccinationSitesView
            selectedUF={selectedUF}
            onSelectUF={setSelectedUF}
          />
        )}

        {activeTab === 'alertas' && (
          <AlertsRSSView
            selectedUF={selectedUF}
          />
        )}
      </main>

      {/* Rodapé com Diretrizes Éticas e Fontes Oficiais */}
      <Footer />
    </div>
  );
}

export default App;
