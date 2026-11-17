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
      />

      {/* Conteúdo Principal Dinâmico com Semântica Acessível */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <section
          id="panel-painel"
          role="tabpanel"
          aria-labelledby="tab-painel"
          hidden={activeTab !== 'painel'}
        >
          {activeTab === 'painel' && (
            <DashboardView
              states={statesData}
              selectedUF={selectedUF}
              onSelectUF={setSelectedUF}
              onNavigateToTab={setActiveTab}
            />
          )}
        </section>

        <section
          id="panel-vacinas"
          role="tabpanel"
          aria-labelledby="tab-vacinas"
          hidden={activeTab !== 'vacinas'}
        >
          {activeTab === 'vacinas' && (
            <VaccinesMilestonesView
              selectedUF={selectedUF}
            />
          )}
        </section>

        <section
          id="panel-postos"
          role="tabpanel"
          aria-labelledby="tab-postos"
          hidden={activeTab !== 'postos'}
        >
          {activeTab === 'postos' && (
            <VaccinationSitesView
              selectedUF={selectedUF}
              onSelectUF={setSelectedUF}
            />
          )}
        </section>

        <section
          id="panel-guia"
          role="tabpanel"
          aria-labelledby="tab-guia"
          hidden={activeTab !== 'guia'}
        >
          {activeTab === 'guia' && <ClinicalGuideFAQView />}
        </section>

        <section
          id="panel-alertas"
          role="tabpanel"
          aria-labelledby="tab-alertas"
          hidden={activeTab !== 'alertas'}
        >
          {activeTab === 'alertas' && (
            <AlertsRSSView
              selectedUF={selectedUF}
            />
          )}
        </section>
      </main>

      {/* Rodapé Institucional */}
      <Footer />
    </div>
  );
}

export default App;
