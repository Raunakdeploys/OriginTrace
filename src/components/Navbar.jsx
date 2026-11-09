import React from 'react';
import { Menu, Plus, ShieldCheck, ArrowLeft } from 'lucide-react';

export const Navbar = ({ 
  activeView, 
  setActiveView, 
  onNewInvestigation,
  onToggleSidebar,
  onGoBack,
  canGoBack = false
}) => {
  const viewTitles = {
    overview: 'Operations Overview',
    investigate: 'Target Interrogation',
    identity_graph: 'Digital Identity Graph',
    trust_drift: 'Trust Drift Analysis',
    emudhra: 'eMudhra CA Audit Dossier',
    threat_lab: 'Adversarial Threat Lab',
    evidence_vault: 'Cryptographic Evidence Vault',
    history: 'Historical Investigations',
    settings: 'Settings & Security Policy'
  };

  return (
    <header className="h-14 px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0 z-30 select-none bg-[#0b0d11] border-b border-white/[0.07]">
      {/* Zone 1: Mobile Hamburger + Back Button + Brand Wordmark */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 rounded-lg border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer"
          aria-label="Toggle navigation drawer"
        >
          <Menu className="w-4 h-4" />
        </button>

        {canGoBack && (
          <button
            onClick={onGoBack}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200 border border-cyan-500/25 text-xs font-mono font-medium transition-colors cursor-pointer shadow-sm"
            aria-label="Go back to previous screen"
            title="Go back"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold">Back</span>
          </button>
        )}

        <a 
          href="#overview" 
          onClick={(e) => { e.preventDefault(); setActiveView('overview'); }}
          className="flex items-center gap-2.5 cursor-pointer group ml-1"
        >
          <div className="w-6 h-6 rounded-md bg-white/[0.08] border border-white/[0.12] flex items-center justify-center text-white font-mono font-bold text-[11px]">
            OT
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold tracking-tight text-white font-heading">
              ORIGINTRACE
            </span>
            <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
              v1.0
            </span>
          </div>
        </a>
      </div>

      {/* Zone 2: Contextual Breadcrumb with clickable root */}
      <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400">
        {activeView !== 'overview' ? (
          <>
            <button 
              onClick={() => setActiveView('overview')}
              className="text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1"
            >
              Overview
            </button>
            <span className="text-slate-600">/</span>
            <span className="text-slate-200 font-medium">{viewTitles[activeView] || 'Console'}</span>
          </>
        ) : (
          <>
            <span className="text-slate-600">/</span>
            <span className="text-slate-200 font-medium">{viewTitles[activeView] || 'Console'}</span>
          </>
        )}
      </div>

      {/* Zone 3: Quiet Telemetry & Primary Action */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">SSRF Active</span>
        </div>

        <button
          onClick={onNewInvestigation}
          className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-950 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Investigation</span>
        </button>
      </div>
    </header>
  );
};
