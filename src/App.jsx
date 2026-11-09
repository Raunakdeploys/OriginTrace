import React, { useState } from 'react';
import { Navbar } from './components/Navbar.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { Overview } from './components/Overview.jsx';
import { Investigate } from './components/Investigate.jsx';
import { IdentityGraph } from './components/IdentityGraph.jsx';
import { TrustDrift } from './components/TrustDrift.jsx';
import { EMudhraInvestigation } from './components/EMudhraInvestigation.jsx';
import { EvidenceVault } from './components/EvidenceVault.jsx';
import { InvestigationHistory } from './components/InvestigationHistory.jsx';
import { SettingsView } from './components/SettingsView.jsx';
import { SAMPLE_INVESTIGATIONS } from './data/sampleInvestigations.js';

export default function App() {
  const [activeView, setActiveView] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [investigations, setInvestigations] = useState(SAMPLE_INVESTIGATIONS);
  const [currentReport, setCurrentReport] = useState(SAMPLE_INVESTIGATIONS[0]);
  const [prefillTarget, setPrefillTarget] = useState('');
  const [prefillType, setPrefillType] = useState('url');

  const handleNewInvestigation = () => {
    setPrefillTarget('');
    setPrefillType('url');
    setActiveView('investigate');
    setIsSidebarOpen(false);
  };

  const handleSelectInvestigation = (report) => {
    setCurrentReport(report);
  };

  const handleNavigateToInvestigate = (target, type = 'url') => {
    if (target) setPrefillTarget(target);
    if (type) setPrefillType(type);
    setActiveView('investigate');
    setIsSidebarOpen(false);
  };

  const handleSaveToHistory = (newReport) => {
    setInvestigations(prev => {
      const existsIndex = prev.findIndex(item => item.investigation_id === newReport.investigation_id);
      if (existsIndex >= 0) {
        const copy = [...prev];
        copy[existsIndex] = newReport;
        return copy;
      }
      return [newReport, ...prev];
    });
  };

  const handleClearHistory = () => {
    setInvestigations([]);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300 ambient-glow relative overflow-x-hidden">
      {/* Top Bar with Mobile Hamburger & Navigation State */}
      <Navbar
        activeView={activeView}
        setActiveView={(view) => {
          setActiveView(view);
          setIsSidebarOpen(false);
        }}
        onNewInvestigation={handleNewInvestigation}
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
      />

      {/* Main Workspace Frame with Desktop Sidebar & Mobile Slide-Over Drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar
          activeView={activeView}
          setActiveView={(view) => {
            setActiveView(view);
            setIsSidebarOpen(false);
          }}
          historyCount={investigations.length}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Dynamic Route Content */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-transparent relative z-0">
          {activeView === 'overview' && (
            <Overview
              investigations={investigations}
              onSelectInvestigation={(item) => {
                handleSelectInvestigation(item);
                setActiveView('investigate');
              }}
              onNavigateToInvestigate={handleNavigateToInvestigate}
              setActiveView={setActiveView}
            />
          )}

          {activeView === 'investigate' && (
            <Investigate
              initialTarget={prefillTarget}
              initialType={prefillType}
              currentReport={currentReport}
              setCurrentReport={setCurrentReport}
              onSaveToHistory={handleSaveToHistory}
              setActiveView={setActiveView}
            />
          )}

          {activeView === 'identity_graph' && (
            <IdentityGraph
              currentReport={currentReport}
              allReports={investigations}
              onSelectReport={handleSelectInvestigation}
              setActiveView={setActiveView}
            />
          )}

          {activeView === 'trust_drift' && (
            <TrustDrift
              currentReport={currentReport}
              allReports={investigations}
              onTriggerReinvestigation={(target) => {
                handleNavigateToInvestigate(target, 'url');
              }}
              setActiveView={setActiveView}
            />
          )}

          {activeView === 'emudhra' && (
            <EMudhraInvestigation
              onInvestigateTarget={(target) => {
                handleNavigateToInvestigate(target, 'url');
              }}
              setActiveView={setActiveView}
            />
          )}

          {activeView === 'evidence_vault' && (
            <EvidenceVault
              investigations={investigations}
              setActiveView={setActiveView}
            />
          )}

          {activeView === 'history' && (
            <InvestigationHistory
              investigations={investigations}
              onSelectInvestigation={handleSelectInvestigation}
              onClearHistory={handleClearHistory}
              setActiveView={setActiveView}
            />
          )}

          {activeView === 'settings' && (
            <SettingsView />
          )}
        </main>
      </div>
    </div>
  );
}
