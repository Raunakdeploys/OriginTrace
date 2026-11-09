import React from 'react';
import { ShieldAlert, PlusCircle, Terminal, HelpCircle } from 'lucide-react';

interface NavbarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  onNewInvestigation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeView, setActiveView, onNewInvestigation }) => {
  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between gap-8 shrink-0 z-30">
      {/* Zone 1: Single Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a 
          href="#overview" 
          onClick={(e) => { e.preventDefault(); setActiveView('overview'); }}
          className="text-base font-bold tracking-tight text-slate-100 flex items-center gap-2 hover:text-cyan-400 transition-colors whitespace-nowrap"
        >
          <div className="w-7 h-7 rounded bg-cyan-950 border border-cyan-800/80 flex items-center justify-center text-cyan-400 font-mono text-xs font-semibold">
            OT
          </div>
          ORIGINTRACE
        </a>
        <span className="text-slate-600 text-xs hidden sm:inline" aria-hidden="true">/</span>
        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
          Cyber Digital Identity & Threat Verifier
        </span>
      </div>

      {/* Zone 2: Concise Nav Links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
        <button 
          onClick={() => setActiveView('overview')}
          className={`hover:text-slate-200 transition-colors whitespace-nowrap shrink-0 ${activeView === 'overview' ? 'text-cyan-400 font-semibold' : ''}`}
        >
          Operations
        </button>
        <button 
          onClick={() => setActiveView('investigate')}
          className={`hover:text-slate-200 transition-colors whitespace-nowrap shrink-0 ${activeView === 'investigate' ? 'text-cyan-400 font-semibold' : ''}`}
        >
          Investigate
        </button>
        <button 
          onClick={() => setActiveView('identity_graph')}
          className={`hover:text-slate-200 transition-colors whitespace-nowrap shrink-0 ${activeView === 'identity_graph' ? 'text-cyan-400 font-semibold' : ''}`}
        >
          Identity Graph
        </button>
        <button 
          onClick={() => setActiveView('emudhra')}
          className={`hover:text-slate-200 transition-colors whitespace-nowrap shrink-0 ${activeView === 'emudhra' ? 'text-cyan-400 font-semibold' : ''}`}
        >
          eMudhra Audit
        </button>
        <button 
          onClick={() => setActiveView('evidence_vault')}
          className={`hover:text-slate-200 transition-colors whitespace-nowrap shrink-0 ${activeView === 'evidence_vault' ? 'text-cyan-400 font-semibold' : ''}`}
        >
          Evidence Vault
        </button>
      </nav>

      {/* Zone 3: 1 Primary Action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onNewInvestigation}
          className="px-3.5 py-1.5 text-xs font-medium text-slate-900 bg-cyan-400 rounded-md hover:bg-cyan-300 transition-colors flex items-center gap-1.5 shadow-sm shadow-cyan-950 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Investigation</span>
        </button>
      </div>
    </header>
  );
};
