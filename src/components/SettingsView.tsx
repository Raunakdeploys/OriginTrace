import React from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Cpu, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Lock,
  Server
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="text-xs font-mono uppercase tracking-wider text-cyan-400">
          Configuration & Provenance
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">
          Engine Settings & Security Architecture
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          Review SSRF security perimeter rules, server-side AI model configurations, local EVM state contracts, and upstream open-source attributions.
        </p>
      </div>

      {/* Security Perimeter Box */}
      <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200 uppercase tracking-wide">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>SSRF Defense Policy & Network Perimeter</span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          All outbound socket probes, HTTP crawls, and DNS requests are filtered through an automated SSRF firewall preventing internal microservice reconnaissance or loopback exploitation.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
            <span className="text-slate-500">BLOCKED CIDRs:</span>
            <div className="text-slate-300">
              127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
            </div>
          </div>
          <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
            <span className="text-slate-500">CLOUD METADATA PROTECTION:</span>
            <div className="text-slate-300">
              169.254.169.254 (APIPA / AWS / GCP) Blocked
            </div>
          </div>
          <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
            <span className="text-slate-500">IPV6 RESTRICTIONS:</span>
            <div className="text-slate-300">
              ::1 (Loopback), fe80::/10 (Link-Local), fc00::/7 (ULA) Blocked
            </div>
          </div>
          <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
            <span className="text-slate-500">PROBING TIMEOUT:</span>
            <div className="text-slate-300">
              8,000 ms max connection SLA · 2MB response cap
            </div>
          </div>
        </div>
      </div>

      {/* AI Dissection Engine */}
      <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200 uppercase tracking-wide">
          <Cpu className="w-4 h-4 text-purple-400" />
          <span>Gemini 3.8 Flash Threat Linguistic Analyzer</span>
        </div>

        <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
          <p>
            Natural language threat dissection (social engineering extraction, urgency scoring, authority impersonation, and IOC regex parsing) executes server-side via the <code className="text-purple-300 font-mono">@google/genai</code> SDK.
          </p>
          <div className="p-3 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-400">
            <div>Model: <span className="text-slate-200">gemini-3.8-flash</span></div>
            <div>Context Architecture: <span className="text-slate-200">Server-Side Proxy with User-Agent telemetry</span></div>
            <div>Client Exposure: <span className="text-emerald-400">Zero API Keys Exposed to Browser</span></div>
          </div>
        </div>
      </div>

      {/* EVM Ledger Parameters */}
      <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200 uppercase tracking-wide">
          <Lock className="w-4 h-4 text-cyan-400" />
          <span>EVM Evidence Registry Contract</span>
        </div>

        <div className="p-3 rounded bg-slate-950 border border-slate-800 font-mono text-xs space-y-1 text-slate-400">
          <div>CONTRACT ADDRESS: <span className="text-cyan-400">0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE</span></div>
          <div>HASHING ALGORITHM: <span className="text-slate-200">Canonical SHA-256 (RFC 6234)</span></div>
          <div>SIGNING SCHEME: <span className="text-slate-200">ECDSA secp256k1 Provenance</span></div>
        </div>
      </div>

      {/* Upstream Open Source Attributions */}
      <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200 uppercase tracking-wide">
          <FileText className="w-4 h-4 text-slate-400" />
          <span>Upstream Candidate Repositories & Attributions</span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          ORIGINTRACE inspects and builds upon methodologies established by open-source cybersecurity intelligence projects. Upstream source trees and original licenses are preserved within the repository.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 bg-slate-950 rounded border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-200 font-semibold">PhishGuard</span>
              <span className="text-emerald-400 text-[10px]">MIT LICENSE</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Autonomous email phishing detection, SPF/DKIM validation heuristics, and attachment analysis engine.
            </p>
            <div className="text-[10px] text-slate-500">
              Preserved in <code className="text-slate-400">candidates/PhishGuard/</code>
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-200 font-semibold">URLvet</span>
              <span className="text-amber-400 text-[10px]">GNU AGPLv3</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              High-throughput URL analyzer, Punycode/homoglyph heuristics, and redirect chain forensics.
            </p>
            <div className="text-[10px] text-slate-500">
              Preserved in <code className="text-slate-400">candidates/urlvet/</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
