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
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  historyCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, historyCount }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: Activity, count: null },
    { id: 'investigate', label: 'Investigate', icon: Search, count: null },
    { id: 'identity_graph', label: 'Digital Identity Graph', icon: Network, count: null },
    { id: 'trust_drift', label: 'Trust Drift', icon: GitCompare, count: null },
    { id: 'emudhra', label: 'eMudhra Investigation', icon: Award, count: '3 Cases' },
    { id: 'evidence_vault', label: 'Evidence Vault', icon: FileCheck2, count: null },
    { id: 'history', label: 'Investigation History', icon: History, count: historyCount > 0 ? String(historyCount) : null },
    { id: 'settings', label: 'Settings & Security', icon: Settings, count: null }
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col justify-between shrink-0 select-none">
      <div className="py-4 px-3 flex flex-col gap-1">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Analyst Workspace
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors text-left cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-cyan-400 border border-slate-800'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.count && (
                <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="p-3 border-t border-slate-800/80">
        <div className="p-2.5 rounded-md bg-slate-900/70 border border-slate-800 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>SSRF Isolation Active</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            Localhost & private CIDR ranges blocked. Outbound hops authenticated.
          </p>
        </div>
      </div>
    </aside>
  );
};
