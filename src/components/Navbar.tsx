import React from 'react';
import { ShieldCheck, PlusCircle, Terminal, HelpCircle, Activity, Globe, Zap, Search } from 'lucide-react';

interface NavbarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  onNewInvestigation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeView, setActiveView, onNewInvestigation }) => {
  return (
    <header className="h-16 border-b border-[#1b253b] bg-[#070a10]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-6 shrink-0 z-30 select-none">
      {/* Zone 1: Brand & Cybernetic Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a 
          href="#overview" 
          onClick={(e) => { e.preventDefault(); setActiveView('overview'); }}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          {/* High-tech Emblem */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-950 via-slate-900 to-blue-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono text-xs font-black shadow-[0_0_12px_rgba(6,182,212,0.25)] group-hover:border-cyan-400 transition-all">
            OT
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold tracking-wider text-slate-100 font-display group-hover:text-cyan-400 transition-colors">
                ORIGINTRACE
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 font-bold hidden sm:inline">
                v1.0-DEFENSE
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-500 hidden md:block">
              CYBER DIGITAL IDENTITY & THREAT VERIFIER
            </div>
          </div>
        </a>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-950/80 rounded-lg border border-slate-800/80 text-xs font-mono">
        <button 
          onClick={() => setActiveView('overview')}
          className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
            activeView === 'overview' 
              ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/80 font-bold shadow-sm' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          [!] COMMAND
        </button>
        <button 
          onClick={() => setActiveView('investigate')}
          className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
            activeView === 'investigate' 
              ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/80 font-bold shadow-sm' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          [#] INVESTIGATE
        </button>
        <button 
          onClick={() => setActiveView('identity_graph')}
          className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
            activeView === 'identity_graph' 
              ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/80 font-bold shadow-sm' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          [*] IDENTITY GRAPH
        </button>
        <button 
          onClick={() => setActiveView('trust_drift')}
          className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
            activeView === 'trust_drift' 
              ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/80 font-bold shadow-sm' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          [~] TRUST DRIFT
        </button>
        <button 
          onClick={() => setActiveView('evidence_vault')}
          className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
            activeView === 'evidence_vault' 
              ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/80 font-bold shadow-sm' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          [$] EVIDENCE VAULT
        </button>
      </nav>

      {/* Zone 3: Live Perimeter Status & Action Button */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>SSRF FIREWALL: <strong className="text-emerald-400">ISOLATED</strong></span>
        </div>

        <button
          onClick={onNewInvestigation}
          className="px-3.5 py-1.5 text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 rounded-md transition-all flex items-center gap-1.5 shadow-md shadow-cyan-950 cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>INTERROGATE TARGET</span>
        </button>
      </div>
    </header>
  );
};
