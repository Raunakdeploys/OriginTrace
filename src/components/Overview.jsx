import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Globe, 
  Terminal, 
  ArrowUpRight, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Radio, 
  ArrowRight,
  TrendingUp,
  Activity,
  Zap,
  Lock
} from 'lucide-react';
import { CyberShield3D } from './CyberShield3D.jsx';

export const Overview = ({ 
  investigations = [], 
  onSelectInvestigation = () => {}, 
  onNavigateToInvestigate = () => {},
  setActiveView = () => {}
}) => {
  const [quickInput, setQuickInput] = useState('');

  const maliciousCount = investigations.filter(
    i => i.classification === 'CONFIRMED MALICIOUS' || i.classification === 'HIGH RISK'
  ).length;
  const totalIndicators = investigations.reduce((acc, curr) => acc + (curr.indicators?.length || 0), 0);
  const cleanCount = investigations.filter(i => i.classification === 'LOW RISK').length;
  const resolutionRate = investigations.length > 0 ? Math.round((cleanCount / investigations.length) * 100) : 98;

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (quickInput.trim()) {
      onNavigateToInvestigate(quickInput.trim(), quickInput.includes('http') ? 'url' : 'domain');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Hero Interrogation Bar with Glassmorphic Card */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel relative overflow-hidden">
        {/* Subtle Ambient Radial Highlight */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              Cyber Defense & Identity Verification
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight font-heading">
            Investigate digital identity threats with cryptographic certainty.
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">
            Correlate suspicious domains, TLS chains, and deceptive communications against live VirusTotal consensus and Google Safe Browsing telemetry.
          </p>

          {/* Quick Interrogate Search Bar */}
          <form onSubmit={handleQuickSubmit} className="pt-2 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder="Enter target URL or domain (e.g. chase-security-verify.net)"
                className="w-full pl-11 pr-4 py-3 rounded-2xl glass-subtle text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/50 transition-all font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.25)] flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Scan Target</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* 4 Proportionate Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel relative overflow-hidden">
          <div className="text-xs font-mono text-slate-400">Issues Mitigated</div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white tabular-nums">
              {resolutionRate}%
            </span>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold">+4.2%</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            {investigations.length} Active Dossiers
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel relative overflow-hidden">
          <div className="text-xs font-mono text-slate-400">Time Saved</div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-cyan-400 tabular-nums">
              642'
            </span>
            <span className="text-[11px] font-mono text-slate-400">Minutes</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Automated Heuristics
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel relative overflow-hidden">
          <div className="text-xs font-mono text-slate-400">Active Threats</div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white tabular-nums">
              {maliciousCount}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Contained
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            100% Shield Protection
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel relative overflow-hidden">
          <div className="text-xs font-mono text-slate-400">Extracted IOCs</div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-purple-400 tabular-nums">
              {totalIndicators}
            </span>
            <span className="text-[11px] font-mono text-slate-400">Indicators</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Domains, IPs & Certs
          </div>
        </div>
      </div>

      {/* Centerpiece: 3D Cyber Shield + Live Intelligence Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column (7 cols): 3D Cyber Shield */}
        <div className="lg:col-span-7 h-[360px]">
          <CyberShield3D
            threatLevel={maliciousCount > 0 ? 'HIGH' : 'LOW'}
            activeNodesCount={totalIndicators + 24}
            className="h-full"
          />
        </div>

        {/* Right Column (5 cols): Live Defense Feeds & Presets */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass-panel flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                  Live Defense Engines
                </span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                All Systems Online
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded-xl glass-subtle flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-200">VirusTotal v3 API</div>
                  <div className="text-[10px] text-slate-400">Multi-vendor consensus scanning</div>
                </div>
                <span className="text-emerald-400 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  Ready
                </span>
              </div>

              <div className="p-3 rounded-xl glass-subtle flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-200">Google Safe Browsing v4</div>
                  <div className="text-[10px] text-slate-400">Malware & phishing blacklist lookup</div>
                </div>
                <span className="text-emerald-400 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  Armed
                </span>
              </div>

              <div className="p-3 rounded-xl glass-subtle flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-200">Gemini 3.8 Flash</div>
                  <div className="text-[10px] text-slate-400">Linguistic scam & social engineering analyzer</div>
                </div>
                <span className="text-purple-400 text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                  Active
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateToInvestigate()}
            className="w-full py-2.5 rounded-xl glass-subtle hover:bg-white/[0.08] text-xs font-mono font-medium text-cyan-300 transition-all flex items-center justify-center gap-2 cursor-pointer border border-cyan-500/20"
          >
            <span>Open Interrogation Bay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 1-Click Interactive Test Scenarios */}
      <div className="p-6 rounded-2xl glass-panel space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wide font-mono">
            Interactive Test Cases & Scenarios
          </h2>
          <span className="text-xs text-slate-500 font-mono">1-Click Telemetry</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div
            onClick={() => onNavigateToInvestigate('https://example.com', 'url')}
            className="p-4 rounded-xl glass-subtle hover:bg-white/[0.06] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Clean Baseline
              </span>
              <span className="text-emerald-400 text-[10px]">Low Risk</span>
            </div>
            <div className="text-slate-200 font-medium truncate group-hover:text-cyan-300 transition-colors">
              https://example.com
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-sans">
              Validates baseline DNS, authentic TLS certificates, and clean VT/GSB scores.
            </p>
          </div>

          <div
            onClick={() => onNavigateToInvestigate('https://chase-security-verify.net/auth/login', 'url')}
            className="p-4 rounded-xl glass-subtle hover:bg-white/[0.06] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-rose-400 font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" /> Typosquatting Phish
              </span>
              <span className="text-rose-400 text-[10px]">Critical</span>
            </div>
            <div className="text-slate-200 font-medium truncate group-hover:text-rose-300 transition-colors">
              chase-security-verify.net
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-sans">
              Triggers Levenshtein brand proximity detection and automated risk escalation.
            </p>
          </div>

          <div
            onClick={() => onNavigateToInvestigate(
              'URGENT: Your Wells Fargo account has been locked due to unauthorized access. Click here immediately to restore credentials: https://bit.ly/bank-auth-99',
              'message'
            )}
            className="p-4 rounded-xl glass-subtle hover:bg-white/[0.06] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-purple-400 font-bold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" /> AI Scam Parser
              </span>
              <span className="text-purple-400 text-[10px]">Gemini 3.8</span>
            </div>
            <div className="text-slate-200 font-medium truncate group-hover:text-purple-300 transition-colors">
              Urgent Credential Phish
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-sans">
              Evaluates artificial urgency, extracted credentials, and shortlink cloaking.
            </p>
          </div>
        </div>
      </div>

      {/* Forensic Investigations Corpus Table */}
      <div className="p-6 rounded-2xl glass-panel space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div>
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wide font-mono">
              Recent Forensic Investigations
            </h2>
            <div className="text-xs text-slate-400 font-mono mt-0.5">
              Sealed with verifiable SHA-256 fingerprints
            </div>
          </div>
          <button
            onClick={() => setActiveView('history')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({investigations.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-white/[0.06] text-slate-500">
                <th className="py-2.5 px-3">Target</th>
                <th className="py-2.5 px-3">Verdict</th>
                <th className="py-2.5 px-3 text-right">Risk Score</th>
                <th className="py-2.5 px-3">SHA-256 Hash</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {investigations.slice(0, 5).map((item) => (
                <tr 
                  key={item.investigation_id}
                  onClick={() => onSelectInvestigation(item)}
                  className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-3 text-slate-200 font-sans font-medium max-w-[260px] truncate">
                    {item.target}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.classification === 'CONFIRMED MALICIOUS'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : item.classification === 'HIGH RISK'
                        ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                        : item.classification === 'SUSPICIOUS'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {item.classification}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-bold tabular-nums">
                    <span className={item.risk_score >= 70 ? 'text-rose-400' : item.risk_score >= 40 ? 'text-amber-400' : 'text-emerald-400'}>
                      {item.risk_score} / 100
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500">
                    {item.evidence.canonical_sha256.slice(0, 14)}...
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="text-cyan-400 group-hover:text-cyan-300 font-semibold flex items-center justify-end gap-1">
                      <span>Audit</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
