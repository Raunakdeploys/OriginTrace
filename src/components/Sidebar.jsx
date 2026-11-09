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
  X,
  Flame
} from 'lucide-react';

export const Sidebar = ({ 
  activeView, 
  setActiveView, 
  historyCount = 0,
  isOpen = false,
  onClose = () => {}
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: Activity, tag: null },
    { id: 'investigate', label: 'Investigate', icon: Search, tag: 'Live' },
    { id: 'threat_lab', label: 'Adversarial Threat Lab', icon: Flame, tag: 'Red Team' },
    { id: 'identity_graph', label: 'Identity Graph', icon: Network, tag: null },
    { id: 'trust_drift', label: 'Trust Drift', icon: GitCompare, tag: null },
    { id: 'emudhra', label: 'eMudhra Audit', icon: Award, tag: '4 cases' },
    { id: 'evidence_vault', label: 'Evidence Vault', icon: FileCheck2, tag: null },
    { id: 'history', label: 'History Archive', icon: History, tag: historyCount > 0 ? String(historyCount) : null },
    { id: 'settings', label: 'Settings & Telemetry', icon: Settings, tag: null }
  ];

  const handleSelect = (id) => {
    setActiveView(id);
    onClose();
  };

  const content = (
    <div className="h-full flex flex-col justify-between p-4 select-none">
      <div className="space-y-6">
        {/* Mobile Header with Close Button */}
        <div className="flex items-center justify-between lg:hidden pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs">
              OT
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-wide">ORIGINTRACE</div>
              <div className="text-[10px] text-slate-400 font-mono">Cyber Intelligence</div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg glass-subtle text-slate-400 hover:text-white"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section Label */}
        <div className="hidden lg:block px-3 text-[11px] font-mono tracking-wider text-slate-400 uppercase">
          Navigation Deck
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer group ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.tag && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    isActive 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                      : 'bg-white/[0.05] text-slate-400 border border-white/[0.06]'
                  }`}>
                    {item.tag}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Threat Intelligence Feeds Status */}
        <div className="pt-4 border-t border-white/[0.06] space-y-2">
          <div className="px-3 text-[10px] font-mono tracking-wider text-slate-500 uppercase">
            Live Defense Feeds
          </div>
          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="px-3 py-2 rounded-xl glass-subtle flex items-center justify-between">
              <span className="text-slate-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                VirusTotal v3
              </span>
              <span className="text-emerald-400 text-[10px]">Online</span>
            </div>
            <div className="px-3 py-2 rounded-xl glass-subtle flex items-center justify-between">
              <span className="text-slate-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                Safe Browsing
              </span>
              <span className="text-emerald-400 text-[10px]">Armed</span>
            </div>
            <div className="px-3 py-2 rounded-xl glass-subtle flex items-center justify-between">
              <span className="text-slate-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_#c084fc]" />
                Gemini 3.8
              </span>
              <span className="text-purple-400 text-[10px]">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Operator Status Card */}
      <div className="pt-4 border-t border-white/[0.06]">
        <div className="p-3 rounded-xl glass-subtle flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold text-xs">
              OP
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">Security Analyst</div>
              <div className="text-[10px] text-slate-500 font-mono">EVM #19842103</div>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            Active
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 p-4">
        <div className="h-full rounded-2xl glass-panel">
          {content}
        </div>
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Blur Overlay */}
          <div 
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
          />

          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[85vw] h-full glass-panel border-r border-white/10 z-10 shadow-2xl flex flex-col">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
