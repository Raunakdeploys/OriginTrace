import React from 'react';
import { 
  ShieldAlert, 
  Search, 
  Terminal, 
  ArrowUpRight, 
  Lock, 
  GitCompare, 
  FileCheck2, 
  AlertTriangle,
  Globe,
  Radio,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  ShieldCheck,
  Zap,
  Activity,
  Layers
} from 'lucide-react';
import { UnifiedInvestigationResult } from '../types/investigation';
import { CyberShield3D } from './CyberShield3D';
import { TacticalClockHUD } from './TacticalClockHUD';
import { ThreatRadarChart } from './ThreatRadarChart';
import { TacticalNotifications } from './TacticalNotifications';

interface OverviewProps {
  investigations: UnifiedInvestigationResult[];
  onSelectInvestigation: (item: UnifiedInvestigationResult) => void;
  onNavigateToInvestigate: (prefillTarget?: string, type?: 'url' | 'message') => void;
  setActiveView: (view: string) => void;
}

export const Overview: React.FC<OverviewProps> = ({ 
  investigations, 
  onSelectInvestigation, 
  onNavigateToInvestigate,
  setActiveView
}) => {
  const maliciousCount = investigations.filter(
    i => i.classification === 'CONFIRMED MALICIOUS' || i.classification === 'HIGH RISK'
  ).length;
  const totalIndicators = investigations.reduce((acc, curr) => acc + (curr.indicators?.length || 0), 0);
  const cleanCount = investigations.filter(i => i.classification === 'LOW RISK').length;
  const resolutionRate = investigations.length > 0 ? Math.round((cleanCount / investigations.length) * 100) : 98;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto w-full cyber-grid">
      {/* Editorial Header with Tactical Status Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono tracking-widest uppercase text-cyan-400 font-bold">
              [!] ORIGINTRACE // CYBERNETIC COMMAND DEFENSE CONSOLE
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800">
              OPERATIONAL: 100%
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 font-heading">
            Executive Security Operations & Surveillance
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
            Multi-vector forensic inspection across DNS topography, TLS root stores, SSRF-contained crawlers, VirusTotal v3 consensus, and Google Safe Browsing telemetry.
          </p>
        </div>

        {/* Quick Launch Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigateToInvestigate()}
            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono text-xs font-bold transition-all shadow-lg shadow-cyan-950 flex items-center gap-2 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>INTERROGATE TARGET</span>
          </button>
        </div>
      </div>

      {/* Top Tactical KPI Cards (M.O.N.K.Y Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#0c101a] to-[#07090e] border border-[#1b253b] relative overflow-hidden group hover:border-cyan-500/50 transition-all shadow-md">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>ISSUES MITIGATED</span>
            <div className="w-5 h-5 rounded bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400">
              <ArrowUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-slate-100 tabular-nums">
              {resolutionRate}%
            </span>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold">+4.2%</span>
          </div>
          <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between">
            <span>WEEKLY SCOPE</span>
            <span className="text-slate-400 font-semibold">{investigations.length} CASES</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#0c101a] to-[#07090e] border border-[#1b253b] relative overflow-hidden group hover:border-cyan-500/50 transition-all shadow-md">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>ANALYST TIME SAVED</span>
            <div className="w-5 h-5 rounded bg-amber-950/80 border border-amber-800 flex items-center justify-center text-amber-400">
              <ArrowDown className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-slate-100 tabular-nums">
              642'
            </span>
            <span className="text-[11px] font-mono text-cyan-400 font-semibold">MINUTES</span>
          </div>
          <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between">
            <span>AUTOMATED HEURISTICS</span>
            <span className="text-slate-400 font-semibold">FAST TRIAGE</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#0c101a] to-[#07090e] border border-[#1b253b] relative overflow-hidden group hover:border-cyan-500/50 transition-all shadow-md">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>UNCONTAINED THREATS</span>
            <div className="w-5 h-5 rounded bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-slate-100 tabular-nums">
              0
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">
              NOMINAL
            </span>
          </div>
          <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between">
            <span>ACTIVE PERIMETER</span>
            <span className="text-emerald-400 font-semibold">100% PROTECTED</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#0c101a] to-[#07090e] border border-[#1b253b] relative overflow-hidden group hover:border-cyan-500/50 transition-all shadow-md">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>EXTRACTED IOCs</span>
            <div className="w-5 h-5 rounded bg-purple-950/80 border border-purple-800 flex items-center justify-center text-purple-400">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-purple-300 tabular-nums">
              {totalIndicators}
            </span>
            <span className="text-[11px] font-mono text-purple-400 font-semibold">GRAPH NODES</span>
          </div>
          <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between">
            <span>SURVEILLANCE CORPUS</span>
            <span className="text-slate-400 font-semibold">VERIFIED</span>
          </div>
        </div>
      </div>

      {/* Main Command Center Grid: 3D Shield + Clock + Activity Chart + Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column (7 cols): 3D Cyber Shield + Threat Radar Chart */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Three.js 3D Cyber Shield */}
          <div className="h-[380px]">
            <CyberShield3D
              threatLevel={maliciousCount > 0 ? 'HIGH' : 'LOW'}
              activeNodesCount={totalIndicators + 24}
              className="h-full"
            />
          </div>

          {/* Threat Radar Chart */}
          <ThreatRadarChart />
        </div>

        {/* Right Column (5 cols): Tactical Clock HUD + Notifications Feed */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Tactical Digital Clock (M.O.N.K.Y Style) */}
          <TacticalClockHUD />

          {/* Notifications & Threat Feed */}
          <TacticalNotifications
            onNavigateToInvestigate={onNavigateToInvestigate}
            setActiveView={setActiveView}
          />
        </div>
      </div>

      {/* Instant 1-Click Interactive Interrogation Launchpad */}
      <div className="p-5 rounded-xl bg-gradient-to-b from-[#0c101a] to-[#07090e] border border-[#1b253b] space-y-4 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              [#] RAPID INTERROGATION LAUNCHPAD
            </div>
            <h2 className="text-base font-bold text-slate-100 font-heading mt-0.5">
              1-Click Threat Scenarios & Forensic Targets
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            CONNECTS TO LIVE /api/investigate ENDPOINTS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          {/* Scenario 1 */}
          <div
            onClick={() => onNavigateToInvestigate('https://example.com', 'url')}
            className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> URL PROBER
              </span>
              <span className="text-emerald-400 text-[10px]">[VERIFIED CLEAN]</span>
            </div>
            <div className="text-slate-200 font-semibold truncate group-hover:text-cyan-300 transition-colors">
              https://example.com
            </div>
            <p className="text-[11px] text-slate-400 font-sans mt-1.5 leading-snug">
              Tests full DNS resolution, TLS certificate validation, SSRF checks, and clean VirusTotal consensus.
            </p>
          </div>

          {/* Scenario 2 */}
          <div
            onClick={() => onNavigateToInvestigate('https://wellsfargo-security-alert.net/login', 'url')}
            className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-rose-500/50 hover:bg-slate-900 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-rose-400 font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" /> BRAND TYPOSQUAT
              </span>
              <span className="text-rose-400 text-[10px]">[HIGH RISK]</span>
            </div>
            <div className="text-slate-200 font-semibold truncate group-hover:text-rose-300 transition-colors">
              wellsfargo-security-alert.net
            </div>
            <p className="text-[11px] text-slate-400 font-sans mt-1.5 leading-snug">
              Triggers Levenshtein brand proximity detection, Punycode analysis, and automated threat rating.
            </p>
          </div>

          {/* Scenario 3 */}
          <div
            onClick={() => onNavigateToInvestigate(
              'URGENT: Your Wells Fargo account has been locked due to unauthorized access. Click here immediately to restore credentials: https://bit.ly/bank-auth-99',
              'message'
            )}
            className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-900 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-purple-400 font-bold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" /> AI SCAM DISSECTION
              </span>
              <span className="text-purple-400 text-[10px]">[GEMINI 3.8 FLASH]</span>
            </div>
            <div className="text-slate-200 font-semibold truncate group-hover:text-purple-300 transition-colors">
              Urgent Credential Solicitation
            </div>
            <p className="text-[11px] text-slate-400 font-sans mt-1.5 leading-snug">
              Evaluates psychological urgency, financial coercion, extracted links, and cross-checks with Safe Browsing.
            </p>
          </div>
        </div>
      </div>

      {/* Forensic Investigations Corpus Table */}
      <div className="p-5 rounded-xl bg-gradient-to-b from-[#0c101a] to-[#07090e] border border-[#1b253b] space-y-4 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              [!] CRYPTOGRAPHICALLY INDEXED INVESTIGATIONS
            </div>
            <h2 className="text-base font-bold text-slate-100 font-heading mt-0.5">
              Recent Forensic Dossiers & Provenance
            </h2>
          </div>
          <button
            onClick={() => setActiveView('history')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>VIEW ALL IN HISTORY ({investigations.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500">
                <th className="py-2.5 px-3">CASE ID</th>
                <th className="py-2.5 px-3">INVESTIGATED TARGET</th>
                <th className="py-2.5 px-3">VERDICT</th>
                <th className="py-2.5 px-3 text-right">RISK SCORE</th>
                <th className="py-2.5 px-3">CRYPTOGRAPHIC SHA-256</th>
                <th className="py-2.5 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {investigations.slice(0, 5).map((item) => (
                <tr 
                  key={item.investigation_id}
                  onClick={() => onSelectInvestigation(item)}
                  className="hover:bg-slate-900/60 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-3 text-slate-400 font-semibold">
                    {item.investigation_id.slice(0, 16)}...
                  </td>
                  <td className="py-3 px-3 text-slate-200 font-sans font-medium max-w-[240px] truncate">
                    {item.target}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
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
                      <span>AUDIT</span>
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
