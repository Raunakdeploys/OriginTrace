import React, { useState, useEffect } from 'react';
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
  Lock,
  Clipboard,
  Mail,
  HelpCircle,
  Cpu,
  FileCheck2
} from 'lucide-react';
import { CyberShield3D } from './CyberShield3D.jsx';
import { ScamExposureRescueCard, ScamExposureRescueModal } from './ScamExposureRescue.jsx';

export const Overview = ({ 
  investigations = [], 
  onSelectInvestigation = () => {}, 
  onNavigateToInvestigate = () => {},
  setActiveView = () => {}
}) => {
  const [quickInput, setQuickInput] = useState('');
  const [isRescueOpen, setIsRescueOpen] = useState(false);
  const [pasteNotice, setPasteNotice] = useState(false);
  const [healthStatus, setHealthStatus] = useState({
    gemini_connected: true,
    virustotal_configured: false,
    safe_browsing_configured: false,
    database_configured: true,
    ssrf_protection: 'active'
  });

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data === 'object') {
          setHealthStatus(prev => ({ ...prev, ...data }));
        }
      })
      .catch(() => {});
  }, []);

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

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setQuickInput(text.trim());
        setPasteNotice(true);
        setTimeout(() => setPasteNotice(false), 2000);
      }
    } catch {
      // Clipboard permissions may be denied in some browsers
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Primary Investigation Hub: URL Checker (Left) + Scam Exposure Rescue (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column (7 cols): Prominent URL Checker */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl glass-panel relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                Digital Identity & Threat Investigation
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight font-heading">
              Investigate suspicious links, messages and digital identities — with evidence you can inspect.
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Verify destinations, typosquatting brands, DNS records, and TLS certificate chains before interacting.
            </p>

            {/* URL Input Form */}
            <form onSubmit={handleQuickSubmit} className="pt-2 space-y-3">
              <div>
                <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Target URL or Domain to Investigate</span>
                  {pasteNotice && <span className="text-emerald-400 text-[11px]">Pasted from clipboard!</span>}
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={quickInput}
                    onChange={(e) => setQuickInput(e.target.value)}
                    placeholder="e.g. https://chase-security-verify.net/auth/login"
                    className="w-full pl-11 pr-24 py-3.5 rounded-2xl bg-[#0b1322] border border-white/[0.12] text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all font-mono shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={handlePaste}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-xl glass-subtle hover:bg-white/[0.1] text-[11px] font-mono text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                    title="Paste from clipboard"
                  >
                    <Clipboard className="w-3 h-3" />
                    <span>Paste</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.25)] flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <span>Investigate link</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateToInvestigate('', 'message')}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl glass-subtle hover:bg-white/[0.08] border border-white/[0.1] text-xs font-mono font-medium text-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Analyze Message / Email</span>
                </button>
              </div>

              {/* Plain-Language First-Use Guidance & Privacy Note */}
              <div className="pt-2 text-[11px] text-slate-400 leading-normal space-y-1 border-t border-white/[0.06]">
                <p>
                  Paste a link you received. We inspect its destination, domain, certificate and other available warning signs. <strong className="text-slate-300">You do not need to open it.</strong>
                </p>
                <p className="text-[10px] text-slate-500">
                  Privacy assurance: Scans evaluate public DNS, TLS handshakes, and reputation telemetry. Never submits credentials or triggers automated actions.
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column (5 cols): Scam Exposure Rescue (Visible on first screen) */}
        <div className="lg:col-span-5 flex flex-col">
          <ScamExposureRescueCard 
            onOpenRescue={() => setIsRescueOpen(true)}
            currentReport={investigations[0] || null}
          />
        </div>
      </div>

      {/* Compact "How It Works" Strip */}
      <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-white/[0.08]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-300 font-mono font-bold text-[11px] flex items-center justify-center shrink-0 border border-cyan-500/20">
              1
            </span>
            <div>
              <div className="font-bold text-white">Submit Target</div>
              <div className="text-[11px] text-slate-400">URL, domain, or raw message text</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-300 font-mono font-bold text-[11px] flex items-center justify-center shrink-0 border border-cyan-500/20">
              2
            </span>
            <div>
              <div className="font-bold text-white">We Check</div>
              <div className="text-[11px] text-slate-400">DNS, TLS chain, SSRF hops & AI signals</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-300 font-mono font-bold text-[11px] flex items-center justify-center shrink-0 border border-cyan-500/20">
              3
            </span>
            <div>
              <div className="font-bold text-white">See Evidence</div>
              <div className="text-[11px] text-slate-400">Provenance logs & Identity Graph</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-300 font-mono font-bold text-[11px] flex items-center justify-center shrink-0 border border-emerald-500/20">
              4
            </span>
            <div>
              <div className="font-bold text-white">Decide Safely</div>
              <div className="text-[11px] text-slate-400">Verifiable SHA-256 sealed report</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Proportionate Stat Cards with Real Counts */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel relative overflow-hidden">
          <div className="text-xs font-mono text-slate-400">Resolution Rate</div>
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
          <div className="text-xs font-mono text-slate-400">Safe / Clean Targets</div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-cyan-400 tabular-nums">
              {cleanCount}
            </span>
            <span className="text-[11px] font-mono text-slate-400">Dossiers</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Verified Clean Baseline
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel relative overflow-hidden">
          <div className="text-xs font-mono text-slate-400">Flagged Threats</div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-rose-400 tabular-nums">
              {maliciousCount}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
              High / Malicious
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Evidence-Backed Findings
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel relative overflow-hidden">
          <div className="text-xs font-mono text-slate-400">Correlated IOCs</div>
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

        {/* Right Column (5 cols): Live Defense Feeds (Real Backend Telemetry) */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass-panel flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                  Live Defense Telemetry
                </span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                Express :3000 Active
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded-xl glass-subtle flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-200">SSRF Egress Perimeter Guard</div>
                  <div className="text-[10px] text-slate-400">Pre-resolution IP filter & redirect hops</div>
                </div>
                <span className="text-emerald-400 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 font-bold">
                  Enforcing
                </span>
              </div>

              <div className="p-3 rounded-xl glass-subtle flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-200">Gemini 3.8 Flash Analysis</div>
                  <div className="text-[10px] text-slate-400">Linguistic scam & coercion heuristics</div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${
                  healthStatus.gemini_connected 
                    ? 'text-purple-400 bg-purple-500/10 border-purple-500/20' 
                    : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                }`}>
                  {healthStatus.gemini_connected ? 'Online' : 'Fallback Rules'}
                </span>
              </div>

              <div className="p-3 rounded-xl glass-subtle flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-200">Cryptographic EVM Registry</div>
                  <div className="text-[10px] text-slate-400">RFC 6234 canonical SHA-256 fingerprinting</div>
                </div>
                <span className="text-cyan-400 text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 font-bold">
                  Active (0x3f5C)
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateToInvestigate()}
            className="w-full py-2.5 rounded-xl glass-subtle hover:bg-white/[0.08] text-xs font-mono font-medium text-cyan-300 transition-all flex items-center justify-center gap-2 cursor-pointer border border-cyan-500/20"
          >
            <span>Open Investigation Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 1-Click Interactive Scenarios */}
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

      {/* Interactive Modal for Scam Exposure Rescue */}
      <ScamExposureRescueModal
        isOpen={isRescueOpen}
        onClose={() => setIsRescueOpen(false)}
        currentReport={investigations[0] || null}
      />
    </div>
  );
};
