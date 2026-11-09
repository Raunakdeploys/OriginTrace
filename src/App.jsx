import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
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
import { ThreatLab } from './components/ThreatLab.jsx';
import { SAMPLE_INVESTIGATIONS } from './data/sampleInvestigations.js';

const VIEW_TITLES = {
  overview: 'Operations Overview',
  investigate: 'Target Interrogation Bay',
  identity_graph: 'Digital Identity Graph',
  trust_drift: 'Trust Drift Analysis',
  emudhra: 'eMudhra CA Audit Dossier',
  threat_lab: 'Adversarial Threat Lab',
  evidence_vault: 'Cryptographic Evidence Vault',
  history: 'Historical Investigations',
  settings: 'Settings & Security Policy'
};

export default function App() {
  const [activeView, setActiveView] = useState('overview');
  const [viewHistory, setViewHistory] = useState(['overview']);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [investigations, setInvestigations] = useState(SAMPLE_INVESTIGATIONS);
  const [currentReport, setCurrentReport] = useState(SAMPLE_INVESTIGATIONS[0]);
  const [prefillTarget, setPrefillTarget] = useState('');
  const [prefillType, setPrefillType] = useState('url');

  const handleNavigate = (view) => {
    if (view === activeView) return;
    setViewHistory(prev => [...prev, view]);
    setActiveView(view);
    setIsSidebarOpen(false);
  };

  const handleGoBack = () => {
    if (viewHistory.length > 1) {
      const updated = [...viewHistory];
      updated.pop();
      const previous = updated[updated.length - 1] || 'overview';
      setViewHistory(updated);
      setActiveView(previous);
    } else {
      setActiveView('overview');
      setViewHistory(['overview']);
    }
  };

  // Browser back-forward button support
  useEffect(() => {
    const handlePopState = () => {
      handleGoBack();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [viewHistory]);

  const handleNewInvestigation = () => {
    setPrefillTarget('');
    setPrefillType('url');
    handleNavigate('investigate');
  };

  const handleSelectInvestigation = (report) => {
    setCurrentReport(report);
  };

  const handleNavigateToInvestigate = (target, type = 'url') => {
    if (target) setPrefillTarget(target);
    if (type) setPrefillType(type);
    handleNavigate('investigate');
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

  const previousViewKey = viewHistory.length > 1 ? viewHistory[viewHistory.length - 2] : 'overview';
  const previousViewLabel = VIEW_TITLES[previousViewKey] || 'Overview';

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300 ambient-glow relative overflow-x-hidden">
      {/* Top Bar with Mobile Hamburger, Back button & Navigation State */}
      <Navbar
        activeView={activeView}
        setActiveView={handleNavigate}
        onNewInvestigation={handleNewInvestigation}
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        onGoBack={handleGoBack}
        canGoBack={activeView !== 'overview'}
      />

      {/* Main Workspace Frame with Desktop Sidebar & Mobile Slide-Over Drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar
          activeView={activeView}
          setActiveView={handleNavigate}
          historyCount={investigations.length}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Dynamic Route Content */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-transparent relative z-0">
          {/* Quick Contextual Back Bar for all sub-views */}
          {activeView !== 'overview' && (
            <div className="sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-2.5 bg-[#07090e]/95 backdrop-blur-md border-b border-white/[0.08] flex items-center justify-between gap-4 shadow-lg">
              <button
                type="button"
                onClick={handleGoBack}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 hover:text-white border border-white/[0.12] text-xs font-mono font-medium transition-all cursor-pointer group shadow-sm"
                title={`Go back to ${previousViewLabel}`}
              >
                <ArrowLeft className="w-3.5 h-3.5 text-cyan-400 group-hover:-translate-x-0.5 transition-transform" />
                <span>Back</span>
                <span className="text-slate-400 text-[11px] hidden sm:inline">
                  to {previousViewLabel}
                </span>
              </button>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <button 
                  type="button"
                  onClick={() => handleNavigate('overview')}
                  className="hover:text-cyan-400 text-slate-400 transition-colors cursor-pointer"
                >
                  Operations Overview
                </button>
                <span className="text-slate-600">/</span>
                <span className="text-cyan-300 font-semibold">{VIEW_TITLES[activeView] || activeView}</span>
              </div>
            </div>
          )}

          {activeView === 'overview' && (
            <Overview
              investigations={investigations}
              onSelectInvestigation={(item) => {
                handleSelectInvestigation(item);
                handleNavigate('investigate');
              }}
              onNavigateToInvestigate={handleNavigateToInvestigate}
              setActiveView={handleNavigate}
            />
          )}

          {activeView === 'investigate' && (
            <Investigate
              initialTarget={prefillTarget}
              initialType={prefillType}
              currentReport={currentReport}
              setCurrentReport={setCurrentReport}
              onSaveToHistory={handleSaveToHistory}
              setActiveView={handleNavigate}
              onGoBack={handleGoBack}
            />
          )}

          {activeView === 'threat_lab' && (
            <ThreatLab
              onInvestigateTarget={(target) => {
                handleNavigateToInvestigate(target, 'url');
              }}
              setActiveView={handleNavigate}
              onGoBack={handleGoBack}
            />
          )}

          {activeView === 'identity_graph' && (
            <IdentityGraph
              currentReport={currentReport}
              allReports={investigations}
              onSelectReport={handleSelectInvestigation}
              setActiveView={handleNavigate}
              onGoBack={handleGoBack}
            />
          )}

          {activeView === 'trust_drift' && (
            <TrustDrift
              currentReport={currentReport}
              allReports={investigations}
              onTriggerReinvestigation={(target) => {
                handleNavigateToInvestigate(target, 'url');
              }}
              setActiveView={handleNavigate}
              onGoBack={handleGoBack}
            />
          )}

          {activeView === 'emudhra' && (
            <EMudhraInvestigation
              onInvestigateTarget={(target) => {
                handleNavigateToInvestigate(target, 'url');
              }}
              setActiveView={handleNavigate}
              onGoBack={handleGoBack}
            />
          )}

          {activeView === 'evidence_vault' && (
            <EvidenceVault
              investigations={investigations}
              setActiveView={handleNavigate}
              onGoBack={handleGoBack}
            />
          )}

          {activeView === 'history' && (
            <InvestigationHistory
              investigations={investigations}
              onSelectInvestigation={handleSelectInvestigation}
              onClearHistory={handleClearHistory}
              setActiveView={handleNavigate}
              onGoBack={handleGoBack}
            />
          )}

          {activeView === 'settings' && (
            <SettingsView 
              setActiveView={handleNavigate}
              onGoBack={handleGoBack}
            />
          )}
        </main>
      </div>
    </div>
  );
}
