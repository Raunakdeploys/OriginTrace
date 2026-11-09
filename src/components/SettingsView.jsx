import React, { useEffect, useState } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Cpu, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  FileText, 
  Lock, 
  Server, 
  Activity, 
  Radio,
  Network,
  Database,
  Code
} from 'lucide-react';

export const SettingsView = () => {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setHealth(data))
      .catch(err => console.warn('Health check error:', err));
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Settings className="w-3.5 h-3.5" />
            <span className="tracking-wider uppercase font-semibold">SYSTEM ARCHITECTURE // ENGINE CONFIGURATION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Engine Settings & Security Architecture
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Review SSRF security perimeter rules, live threat intelligence integrations, server-side AI model configurations, and local EVM state contracts.
          </p>
        </div>

        <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-2 self-start md:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>ENV: {health?.env || 'production'}</span>
        </span>
      </div>

      {/* Live Threat Intelligence Status */}
      <div className="p-6 rounded-2xl glass-panel space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-white uppercase tracking-wider">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Live Threat Intelligence Integrations</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          All external threat APIs are secured behind server-side proxy routes with zero client exposure. Keys are validated and loaded via root <code className="text-cyan-300 font-mono">.env</code>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs font-mono">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold">VIRUSTOTAL v3</span>
              {health?.virustotal_configured ? (
                <span className="text-emerald-400 flex items-center gap-1 text-[10px] font-bold"><CheckCircle2 className="w-3 h-3" /> ONLINE</span>
              ) : (
                <span className="text-amber-400 text-[10px]">STANDBY</span>
              )}
            </div>
            <div className="text-slate-400 font-sans text-xs">Global malware & vendor consensus engine</div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold">SAFE BROWSING v4</span>
              {health?.safe_browsing_configured ? (
                <span className="text-emerald-400 flex items-center gap-1 text-[10px] font-bold"><CheckCircle2 className="w-3 h-3" /> ONLINE</span>
              ) : (
                <span className="text-amber-400 text-[10px]">STANDBY</span>
              )}
            </div>
            <div className="text-slate-400 font-sans text-xs">Google phishing & malware blacklist telemetry</div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold">GEMINI 3.8 FLASH</span>
              {health?.gemini_connected ? (
                <span className="text-emerald-400 flex items-center gap-1 text-[10px] font-bold"><CheckCircle2 className="w-3 h-3" /> ONLINE</span>
              ) : (
                <span className="text-amber-400 text-[10px]">STANDBY</span>
              )}
            </div>
            <div className="text-slate-400 font-sans text-xs">Autonomous social engineering analyzer</div>
          </div>
        </div>
      </div>

      {/* Security Perimeter Box */}
      <div className="p-6 rounded-2xl glass-panel space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-white uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>SSRF Defense Policy & Network Perimeter</span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          All outbound socket probes, HTTP crawls, and DNS requests are filtered through an automated SSRF firewall preventing internal microservice reconnaissance or loopback exploitation.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
            <span className="text-slate-500 text-[11px] font-bold">BLOCKED CIDRs:</span>
            <div className="text-slate-200">
              127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
            <span className="text-slate-500 text-[11px] font-bold">CLOUD METADATA PROTECTION:</span>
            <div className="text-slate-200">
              169.254.169.254 (APIPA / AWS / GCP) Blocked
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
            <span className="text-slate-500 text-[11px] font-bold">IPV6 RESTRICTIONS:</span>
            <div className="text-slate-200">
              ::1 (Loopback), fe80::/10 (Link-Local), fc00::/7 (ULA) Blocked
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
            <span className="text-slate-500 text-[11px] font-bold">PROBING TIMEOUT:</span>
            <div className="text-slate-200">
              8,000 ms max connection SLA · 2MB response cap
            </div>
          </div>
        </div>
      </div>

      {/* AI Dissection Engine */}
      <div className="p-6 rounded-2xl glass-panel space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-white uppercase tracking-wider">
          <Cpu className="w-4 h-4 text-purple-400" />
          <span>Gemini 3.8 Flash Threat Linguistic Analyzer</span>
        </div>

        <div className="text-xs text-slate-400 space-y-3 leading-relaxed">
          <p>
            Natural language threat dissection (social engineering extraction, urgency scoring, authority impersonation, and IOC regex parsing) executes server-side via the <code className="text-purple-300 font-mono">@google/genai</code> SDK.
          </p>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] font-mono text-xs space-y-1.5 text-slate-400">
            <div>Model: <span className="text-white font-semibold">gemini-3.8-flash</span></div>
            <div>Context Architecture: <span className="text-white font-semibold">Server-Side Proxy with User-Agent telemetry</span></div>
            <div>Client Exposure: <span className="text-emerald-400 font-semibold">Zero API Keys Exposed to Browser</span></div>
          </div>
        </div>
      </div>

      {/* EVM Ledger Parameters */}
      <div className="p-6 rounded-2xl glass-panel space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-white uppercase tracking-wider">
          <Lock className="w-4 h-4 text-cyan-400" />
          <span>EVM Evidence Registry Contract</span>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] font-mono text-xs space-y-1.5 text-slate-400">
          <div>CONTRACT ADDRESS: <span className="text-cyan-400 font-bold">0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE</span></div>
          <div>HASHING ALGORITHM: <span className="text-white">Canonical SHA-256 (RFC 6234)</span></div>
          <div>SIGNING SCHEME: <span className="text-white">ECDSA secp256k1 Provenance</span></div>
        </div>
      </div>

      {/* Upstream Open Source Attributions */}
      <div className="p-6 rounded-2xl glass-panel space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-white uppercase tracking-wider">
          <FileText className="w-4 h-4 text-slate-400" />
          <span>Upstream Candidate Repositories & Attributions</span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          ORIGINTRACE inspects and builds upon methodologies established by open-source cybersecurity intelligence projects. Upstream source trees and original licenses are preserved within the repository.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white font-bold text-sm">PhishGuard</span>
              <span className="text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">MIT LICENSE</span>
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Autonomous email phishing detection, SPF/DKIM validation heuristics, and attachment analysis engine.
            </p>
            <div className="text-[11px] text-slate-500">
              Preserved in <code className="text-cyan-400">candidates/PhishGuard/</code>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white font-bold text-sm">URLvet</span>
              <span className="text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">GNU AGPLv3</span>
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              High-throughput URL analyzer, Punycode/homoglyph heuristics, and redirect chain forensics.
            </p>
            <div className="text-[11px] text-slate-500">
              Preserved in <code className="text-cyan-400">candidates/urlvet/</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
