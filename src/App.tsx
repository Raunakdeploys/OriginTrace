import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Overview } from './components/Overview';
import { Investigate } from './components/Investigate';
import { IdentityGraph } from './components/IdentityGraph';
import { TrustDrift } from './components/TrustDrift';
import { EMudhraInvestigation } from './components/EMudhraInvestigation';
import { EvidenceVault } from './components/EvidenceVault';
import { InvestigationHistory } from './components/InvestigationHistory';
import { SettingsView } from './components/SettingsView';
import { SAMPLE_INVESTIGATIONS } from './data/sampleInvestigations';
import { UnifiedInvestigationResult } from './types/investigation';

export default function App() {
  const [activeView, setActiveView] = useState<string>('overview');
  const [investigations, setInvestigations] = useState<UnifiedInvestigationResult[]>(SAMPLE_INVESTIGATIONS);
  const [currentReport, setCurrentReport] = useState<UnifiedInvestigationResult | null>(SAMPLE_INVESTIGATIONS[0]);
  const [prefillTarget, setPrefillTarget] = useState<string>('');
  const [prefillType, setPrefillType] = useState<'url' | 'message'>('url');

  const handleNewInvestigation = () => {
    setPrefillTarget('');
    setPrefillType('url');
    setActiveView('investigate');
  };

  const handleSelectInvestigation = (report: UnifiedInvestigationResult) => {
    setCurrentReport(report);
  };

  const handleNavigateToInvestigate = (target?: string, type?: 'url' | 'message') => {
    if (target) setPrefillTarget(target);
    if (type) setPrefillType(type);
    setActiveView('investigate');
  };

  const handleSaveToHistory = (newReport: UnifiedInvestigationResult) => {
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
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Top Bar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        onNewInvestigation={handleNewInvestigation}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          historyCount={investigations.length}
        />

        {/* View Routing */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#0b0f17]">
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
