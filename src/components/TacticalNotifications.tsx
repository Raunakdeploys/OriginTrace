import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Bell, ArrowRight, ExternalLink } from 'lucide-react';

interface TacticalNotificationsProps {
  onNavigateToInvestigate: (target?: string, type?: 'url' | 'message') => void;
  setActiveView: (view: string) => void;
}

export const TacticalNotifications: React.FC<TacticalNotificationsProps> = ({
  onNavigateToInvestigate,
  setActiveView
}) => {
  const notifications = [
    {
      id: 'notif-1',
      tag: 'PAYMENT FRAUD INTERCEPTED',
      type: 'threat',
      time: '2m ago',
      target: 'chase-security-verify.net',
      desc: 'Active typosquatted banking domain flagged by VirusTotal & Levenshtein heuristics.',
      prefill: 'https://chase-security-verify.net/login',
      prefillType: 'url' as const
    },
    {
      id: 'notif-2',
      tag: 'VIRUSTOTAL v3 CONSENSUS SYNC',
      type: 'info',
      time: '14m ago',
      desc: 'Live intelligence consensus confirmed 0 malicious flags across 74 vendor engines for baseline domains.',
      prefill: 'https://example.com',
      prefillType: 'url' as const
    },
    {
      id: 'notif-3',
      tag: 'GOOGLE SAFE BROWSING ARMED',
      type: 'active',
      time: '28m ago',
      desc: 'Lookup API v4 active with real-time detection for SOCIAL_ENGINEERING and MALWARE.',
      prefill: '',
      prefillType: 'url' as const
    },
    {
      id: 'notif-4',
      tag: 'EVM LEDGER VERIFIED',
      type: 'provenance',
      time: '1h ago',
      desc: 'Cryptographic SHA-256 fingerprint anchored to Smart Contract 0x3f5C...f0bE.',
      actionView: 'evidence_vault'
    }
  ];

  return (
    <div className="p-5 rounded-xl bg-gradient-to-b from-[#0c101a] to-[#07090e] border border-[#1b253b] flex flex-col justify-between shadow-lg">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
          <div className="flex items-center gap-2 text-[11px] font-mono tracking-wider uppercase text-cyan-400 font-semibold">
            <Bell className="w-3.5 h-3.5" />
            <span>[&gt;] LIVE THREAT INTEL NOTIFICATIONS</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800">
            FEED: REALTIME
          </span>
        </div>

        {/* Notifications List */}
        <div className="space-y-2.5">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                if (n.actionView) {
                  setActiveView(n.actionView);
                } else if (n.prefill) {
                  onNavigateToInvestigate(n.prefill, n.prefillType);
                } else {
                  setActiveView('investigate');
                }
              }}
              className="p-3 rounded-lg bg-slate-950/90 border border-slate-800/80 hover:border-cyan-500/50 hover:bg-slate-900 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span className={`font-bold tracking-wide ${
                  n.type === 'threat' ? 'text-rose-400' :
                  n.type === 'active' ? 'text-emerald-400' :
                  n.type === 'provenance' ? 'text-purple-400' : 'text-cyan-400'
                }`}>
                  {n.tag}
                </span>
                <span className="text-slate-500">{n.time}</span>
              </div>
              <p className="text-xs text-slate-300 leading-snug group-hover:text-slate-100 transition-colors">
                {n.desc}
              </p>
              {n.target && (
                <div className="mt-1.5 flex items-center gap-1 text-[11px] font-mono text-cyan-400/90 group-hover:text-cyan-300">
                  <span className="truncate">{n.target}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Button */}
      <button
        onClick={() => setActiveView('investigate')}
        className="mt-4 w-full py-2.5 px-3 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
      >
        <span>[+] INTERROGATE NEW TARGET</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
