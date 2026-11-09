import React from 'react';
import { 
  Activity, 
  Search, 
  Network, 
  GitCompare, 
  Award, 
  FileCheck2, 
  History, 
  Settings,
  ShieldCheck,
  Zap,
  Radio,
  Cpu,
  UserCheck
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  historyCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, historyCount }) => {
  const navItems = [
    { id: 'overview', label: 'Command Overview', code: 'CMD-01', icon: Activity, count: null },
    { id: 'investigate', label: 'Target Interrogator', code: 'INT-02', icon: Search, count: 'LIVE' },
    { id: 'identity_graph', label: '3D Threat Identity Net', code: 'NET-03', icon: Network, count: null },
    { id: 'trust_drift', label: 'Infrastructure Drift', code: 'DFT-04', icon: GitCompare, count: null },
    { id: 'emudhra', label: 'eMudhra Root Audit', code: 'EMU-05', icon: Award, count: '3 ISSUES' },
    { id: 'evidence_vault', label: 'EVM Evidence Vault', code: 'EVM-06', icon: FileCheck2, count: null },
    { id: 'history', label: 'Forensic Dossiers', code: 'HIS-07', icon: History, count: historyCount > 0 ? `${historyCount}` : null },
    { id: 'settings', label: 'Engine Settings & TI', code: 'CFG-08', icon: Settings, count: null }
  ];

  return (
    <aside className="w-64 border-r border-[#1b253b] bg-[#07090e] flex flex-col justify-between shrink-0 select-none">
      <div className="py-4 px-3 flex flex-col gap-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
          <span>OPERATOR WORKSPACE</span>
          <span className="text-cyan-400 font-bold">[ONLINE]</span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition-all text-left cursor-pointer group ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-950/90 to-blue-950/70 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-950/50'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 hover:border-slate-800 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <div className={`p-1 rounded ${isActive ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-500 group-hover:text-cyan-400 group-hover:bg-slate-800'}`}>
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                </div>
                <div className="truncate">
                  <div className="font-semibold leading-tight truncate">{item.label}</div>
                  <div className="text-[9px] text-slate-600 font-mono">{item.code}</div>
                </div>
              </div>
              {item.count && (
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold tabular-nums ${
                  item.count === 'LIVE' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                  item.count.includes('ISSUES') ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                  'bg-slate-900 text-slate-400 border border-slate-800'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}

        {/* Live Threat Feeds Status Strip */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 px-2 space-y-1.5 font-mono text-[10px]">
          <div className="text-slate-500 font-bold uppercase tracking-wider mb-2">THREAT INTEL FEEDS</div>
          <div className="flex items-center justify-between text-slate-400 p-1.5 rounded bg-slate-950/80 border border-slate-850">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              VIRUSTOTAL v3
            </span>
            <span className="text-emerald-400 font-bold">ONLINE</span>
          </div>
          <div className="flex items-center justify-between text-slate-400 p-1.5 rounded bg-slate-950/80 border border-slate-850">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SAFE BROWSING v4
            </span>
            <span className="text-emerald-400 font-bold">ARMED</span>
          </div>
          <div className="flex items-center justify-between text-slate-400 p-1.5 rounded bg-slate-950/80 border border-slate-850">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              GEMINI 3.8 FLASH
            </span>
            <span className="text-purple-400 font-bold">ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Operator Rank & Security Clearance Card (M.O.N.K.Y Style) */}
      <div className="p-3 border-t border-[#1b253b] bg-slate-950/90">
        <div className="p-2.5 rounded-lg bg-gradient-to-br from-[#0e1422] to-[#070a10] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-mono font-bold text-[10px]">
                OP
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200 leading-tight">ORIGIN-ANALYST</div>
                <div className="text-[9px] font-mono text-cyan-400">CLEARANCE: LVL-5</div>
              </div>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
              ACTIVE
            </span>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>EVM PROVENANCE:</span>
            <span className="text-cyan-300 font-bold">#19842103</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
