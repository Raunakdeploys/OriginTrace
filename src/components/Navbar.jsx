import React from 'react';
import { Menu, PlusCircle, ShieldCheck, Search, Activity, Globe } from 'lucide-react';

export const Navbar = ({ 
  activeView, 
  setActiveView, 
  onNewInvestigation,
  onToggleSidebar 
}) => {
  const viewTitles = {
    overview: 'Operations Overview',
    investigate: 'Target Interrogator',
    identity_graph: 'Digital Identity Graph',
    trust_drift: 'Trust Drift Forensics',
    emudhra: 'eMudhra CA Audit',
    evidence_vault: 'EVM Evidence Vault',
    history: 'Historical Dossiers',
    settings: 'Settings & Security'
  };

  return (
    <header className="h-16 px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0 z-30 select-none">
      {/* Zone 1: Mobile Hamburger + Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl glass-subtle text-slate-300 hover:text-white cursor-pointer"
          aria-label="Toggle navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <a 
          href="#overview" 
          onClick={(e) => { e.preventDefault(); setActiveView('overview'); }}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            OT
          </div>
          <div>
            <div className="text-sm sm:text-base font-extrabold tracking-tight text-white font-heading">
              ORIGINTRACE
            </div>
            <div className="text-[10px] text-slate-500 font-mono hidden sm:block">
              Digital Threat & Identity Intelligence
            </div>
          </div>
        </a>
      </div>

      {/* Zone 2: Contextual Breadcrumb / Active View */}
      <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400">
        <span className="text-slate-600">/</span>
        <span className="text-slate-200 font-medium">{viewTitles[activeView] || 'Console'}</span>
      </div>

      {/* Zone 3: Security Status & Primary Action */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-subtle text-xs font-mono text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-300">SSRF Active</span>
        </div>

        <button
          onClick={onNewInvestigation}
          className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Scan</span>
        </button>
      </div>
    </header>
  );
};
