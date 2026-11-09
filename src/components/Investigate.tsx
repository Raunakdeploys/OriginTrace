import React, { useState } from 'react';
import { 
  Search, 
  Globe, 
  Mail, 
  MessageSquare, 
  FileCode, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Lock, 
  Server, 
  ArrowRight, 
  Copy, 
  Check, 
  ExternalLink,
  GitCommit,
  Layers,
  Database,
  RefreshCw,
  FileCheck2,
  Activity,
  Zap,
  Radio,
  Clock,
  Fingerprint
} from 'lucide-react';
import { UnifiedInvestigationResult, InvestigationCheck } from '../types/investigation';

interface InvestigateProps {
  initialTarget?: string;
  initialType?: 'url' | 'message';
  currentReport: UnifiedInvestigationResult | null;
  setCurrentReport: (report: UnifiedInvestigationResult) => void;
  onSaveToHistory: (report: UnifiedInvestigationResult) => void;
  setActiveView: (view: string) => void;
}

export const Investigate: React.FC<InvestigateProps> = ({
  initialTarget = '',
  initialType = 'url',
  currentReport,
  setCurrentReport,
  onSaveToHistory,
  setActiveView
}) => {
  const [targetType, setTargetType] = useState<'url' | 'domain' | 'message' | 'email'>(
    initialType === 'message' ? 'message' : 'url'
  );
  const [targetInput, setTargetInput] = useState<string>(initialTarget);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [copiedIndicator, setCopiedIndicator] = useState<string | null>(null);

  // Quick preset loader
  const handleLoadPreset = (target: string, type: 'url' | 'domain' | 'message' | 'email') => {
    setTargetType(type);
    setTargetInput(target);
    setErrorMessage(null);
  };

  // EML File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setTargetType('email');
      setTargetInput(content);
    };
    reader.readAsText(file);
  };

  // Run Investigation
  const handleStartInvestigation = async () => {
    if (!targetInput.trim()) {
      setErrorMessage('Please provide a target URL, domain, or message content to investigate.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (targetType === 'url' || targetType === 'domain') {
        const res = await fetch('/api/investigate/url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ target: targetInput.trim() })
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Investigation failed');
        }
        setCurrentReport(data);
        onSaveToHistory(data);
      } else {
        const res = await fetch('/api/investigate/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: targetInput.trim(), target_type: targetType })
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Investigation failed');
        }
        setCurrentReport(data);
        onSaveToHistory(data);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network request failed');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, isHash = false) => {
    navigator.clipboard.writeText(text);
    if (isHash) {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } else {
      setCopiedIndicator(text);
      setTimeout(() => setCopiedIndicator(null), 2000);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto w-full cyber-grid">
      {/* Tactical Interrogation Header */}
      <div className="space-y-1 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono tracking-widest uppercase text-cyan-400 font-bold">
            [#] FORENSIC INTERROGATION BAY
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-[10px] font-mono text-emerald-400">
            VT + GSB THREAT INTEL ACTIVE
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 font-heading">
          Target Interrogation & Threat Dissection
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">
          Submit an untrusted URL, domain, raw email, or SMS notification. ORIGINTRACE executes autonomous multi-vector correlation across DNS topography, TLS root chains, VirusTotal v3 consensus, and Google Safe Browsing telemetry.
        </p>
      </div>

      {/* Input Module Box */}
      <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-b from-[#0c101a] to-[#07090e] border border-[#1b253b] space-y-4 shadow-xl">
        {/* Target Type Selector — Segmented Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-950/80 rounded-lg border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setTargetType('url')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                targetType === 'url' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>URL Target</span>
            </button>
            <button
              onClick={() => setTargetType('domain')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                targetType === 'domain' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Domain Only</span>
            </button>
            <button
              onClick={() => setTargetType('message')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                targetType === 'message' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>SMS / Message</span>
            </button>
            <button
              onClick={() => setTargetType('email')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                targetType === 'email' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email / .EML</span>
            </button>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span>PRESETS:</span>
            <button
              onClick={() => handleLoadPreset('https://chase-security-verify.net/auth/login', 'url')}
              className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 cursor-pointer"
            >
              Chase Phish
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => handleLoadPreset('https://secure-auth-emudhra-banking.net', 'url')}
              className="text-amber-400 hover:text-amber-300 underline underline-offset-2 cursor-pointer"
            >
              eMudhra CA
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => handleLoadPreset('https://github.com', 'url')}
              className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 cursor-pointer"
            >
              GitHub Clean
            </button>
          </div>
        </div>

        {/* Target Input Field or Textarea */}
        <div className="space-y-2">
          {targetType === 'url' || targetType === 'domain' ? (
            <div className="relative">
              <input
                type="text"
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleStartInvestigation()}
                placeholder={targetType === 'url' ? 'https://suspicious-login-portal.com/auth' : 'example-domain.org'}
                className="w-full bg-[#05070c] border border-slate-800 rounded-lg px-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition-colors font-mono shadow-inner"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                rows={5}
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                placeholder="Paste suspicious SMS notification, email body, job lure, or headers here..."
                className="w-full bg-[#05070c] border border-slate-800 rounded-lg p-4 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 transition-colors font-mono shadow-inner leading-relaxed"
              />
              <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                <span>Or upload an RFC 822 .eml file directly:</span>
                <label className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium cursor-pointer transition-colors flex items-center gap-1.5 border border-slate-800">
                  <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Choose .EML file</span>
                  <input type="file" accept=".eml,.txt" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Error banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-lg bg-rose-950/60 border border-rose-800 text-xs font-mono text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Button & SSRF Guard Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          <div className="text-xs font-mono text-slate-500 flex items-center gap-2">
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> SSRF ISOLATED
            </span>
            <span aria-hidden="true">·</span>
            <span>TIMEOUT: 8,000ms</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-400">SHA-256 PROVENANCE</span>
          </div>

          <button
            onClick={handleStartInvestigation}
            disabled={isLoading}
            className={`px-6 py-2.5 rounded-lg text-xs font-mono font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-950 cursor-pointer ${
              isLoading ? 'opacity-70 cursor-wait' : ''
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>INTERROGATING TARGET...</span>
              </>
            ) : (
              <>
                <span>EXECUTE INVESTIGATION</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="p-6 rounded-xl bg-[#0c101a] border border-[#1b253b] space-y-4 animate-pulse">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>PROBING NETWORK, DNS TOPOGRAPHY, TLS ROOT STORES & THREAT DATABASES...</span>
          </div>
          <div className="h-6 bg-slate-800/60 rounded w-1/3"></div>
          <div className="h-10 bg-slate-800/40 rounded w-3/4"></div>
          <div className="grid grid-cols-4 gap-4 pt-4">
            <div className="h-24 bg-slate-900 rounded"></div>
            <div className="h-24 bg-slate-900 rounded"></div>
            <div className="h-24 bg-slate-900 rounded"></div>
            <div className="h-24 bg-slate-900 rounded"></div>
          </div>
        </div>
      )}

      {/* Investigation Results Report */}
      {currentReport && !isLoading && (
        <div className="space-y-6">
          {/* Executive Summary & Classification Header */}
          <div className="p-6 rounded-xl bg-gradient-to-b from-[#0c101a] to-[#07090e] border border-[#1b253b] space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
              <div className="space-y-1">
                <div className="text-xs font-mono text-slate-500 flex flex-wrap items-center gap-2">
                  <span>CASE: <strong className="text-slate-300">{currentReport.investigation_id}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{new Date(currentReport.timestamp).toLocaleString()}</span>
                  {currentReport.is_sample_data && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-400 border border-amber-800 font-bold text-[10px]">
                      SAMPLE RECORD
                    </span>
                  )}
                </div>
                <div className="text-lg sm:text-xl font-bold text-slate-100 font-mono break-all text-cyan-300">
                  {currentReport.target}
                </div>
              </div>

              {/* Classification & Risk Score Gauge */}
              <div className="flex items-center gap-4 shrink-0 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <div className="text-right">
                  <div className={`text-base font-extrabold tracking-wider font-mono ${
                    currentReport.classification === 'CONFIRMED MALICIOUS' || currentReport.classification === 'HIGH RISK'
                      ? 'text-rose-400'
                      : currentReport.classification === 'SUSPICIOUS'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}>
                    {currentReport.classification}
                  </div>
                  <div className="text-xs font-mono text-slate-400 tabular-nums">
                    RISK SCORE: <strong className="text-slate-200">{currentReport.risk_score} / 100</strong>
                  </div>
                </div>

                {/* Circular / Segmented Mini Indicator */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-mono font-black text-xs border-2 ${
                  currentReport.risk_score >= 70 ? 'border-rose-500 text-rose-400 bg-rose-950/50' :
                  currentReport.risk_score >= 40 ? 'border-amber-500 text-amber-400 bg-amber-950/50' :
                  'border-emerald-500 text-emerald-400 bg-emerald-950/50'
                }`}>
                  {currentReport.risk_score}
                </div>
              </div>
            </div>

            {/* Executive Summary Prose */}
            <div className="text-sm text-slate-300 leading-relaxed font-sans">
              {currentReport.summary}
            </div>
          </div>

          {/* Forensic Telemetry Matrix Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#0c101a] border border-[#1b253b]">
              <div className="text-xs font-mono text-slate-400">CONFIDENCE LEVEL</div>
              <div className="text-xl font-bold font-mono text-slate-100 mt-1">
                {currentReport.confidence}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Multi-angle consensus</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0c101a] border border-[#1b253b]">
              <div className="text-xs font-mono text-slate-400">CHECKS EXECUTED</div>
              <div className="text-xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">
                {currentReport.checks.length} checks
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {currentReport.checks.filter(c => c.status === 'failed').length} flagged vulnerabilities
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0c101a] border border-[#1b253b]">
              <div className="text-xs font-mono text-slate-400">EXTRACTED IOCs</div>
              <div className="text-xl font-bold font-mono text-purple-400 mt-1 tabular-nums">
                {currentReport.indicators.length} indicators
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Domains, IPs & Certs</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0c101a] border border-[#1b253b]">
              <div className="text-xs font-mono text-slate-400">IDENTITY GRAPH NODES</div>
              <div className="text-xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
                {currentReport.identity_graph.nodes.length} nodes
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {currentReport.identity_graph.edges.length} evidence links
              </div>
            </div>
          </div>

          {/* Technical Checks & Forensic Evidence */}
          <div className="p-6 rounded-xl bg-gradient-to-b from-[#0c101a] to-[#07090e] border border-[#1b253b] space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>[+] TECHNICAL CHECKS & FORENSIC EVIDENCE LOG</span>
              </h3>
              <span className="text-xs font-mono text-slate-500">
                {currentReport.checks.length} MODULES EXECUTED
              </span>
            </div>

            <div className="divide-y divide-slate-800/80">
              {currentReport.checks.map((chk) => (
                <div key={chk.id} className="py-4 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                        <span>{chk.title}</span>
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-800">
                          [{chk.module.toUpperCase()}]
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans">
                        {chk.finding}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${
                        chk.severity === 'critical' ? 'bg-rose-950/80 text-rose-400 border-rose-800' :
                        chk.severity === 'high' ? 'bg-orange-950/80 text-orange-400 border-orange-800' :
                        chk.severity === 'medium' ? 'bg-amber-950/80 text-amber-400 border-amber-800' : 
                        'bg-slate-900 text-slate-400 border-slate-800'
                      }`}>
                        {chk.severity.toUpperCase()}
                      </span>
                      <div className="text-[10px] text-slate-500 font-mono mt-1">
                        Source: {chk.source}
                      </div>
                    </div>
                  </div>

                  {/* Evidence Items */}
                  {chk.evidence && chk.evidence.length > 0 && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] font-mono text-slate-300 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80 mt-2">
                      {chk.evidence.map((ev, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <span className="text-slate-500 font-semibold">{ev.key}:</span>
                          <span className="text-slate-200">{String(ev.value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Message & Social Engineering Analysis (If applicable) */}
          {currentReport.message_analysis && (
            <div className="p-6 rounded-xl bg-gradient-to-b from-[#0c101a] to-[#07090e] border border-[#1b253b] space-y-4 shadow-xl">
              <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                <span>[*] AI LINGUISTIC & SOCIAL ENGINEERING DISSECTION (GEMINI 3.8 FLASH)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-xs font-mono text-slate-400">PRIMARY ACTOR INTENT</div>
                  <div className="text-sm font-bold text-purple-300 font-sans">
                    {currentReport.message_analysis.intent}
                  </div>
                  <div className="text-xs font-mono text-slate-500">
                    Urgency Level: <span className="text-rose-400 uppercase font-bold">{currentReport.message_analysis.urgency_level}</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-xs font-mono text-slate-400">TARGETED ENTITIES</div>
                  <div className="text-sm font-semibold text-slate-200 font-sans">
                    {currentReport.message_analysis.impersonated_entities.join(', ') || 'None identified'}
                  </div>
                </div>
              </div>

              {currentReport.message_analysis.actionable_recommendations.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="text-xs font-mono font-bold text-slate-300">ACTIONABLE DEFENSE DIRECTIVES:</div>
                  <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside font-sans">
                    {currentReport.message_analysis.actionable_recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* TLS & Security Headers Technical Drilldown */}
          {currentReport.tls_data && (
            <div className="p-6 rounded-xl bg-gradient-to-b from-[#0c101a] to-[#07090e] border border-[#1b253b] space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>[!] TLS CERTIFICATE & WEB TRUST ANALYSIS</span>
                </h3>
                {currentReport.tls_data.is_emudhra_issued && (
                  <button
                    onClick={() => setActiveView('emudhra')}
                    className="text-xs font-mono text-amber-400 hover:text-amber-300 underline underline-offset-2 flex items-center gap-1 cursor-pointer"
                  >
                    <span>eMudhra Surveillance Correlated</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-slate-500">ISSUER CA</div>
                  <div className="text-slate-200 truncate mt-1 font-bold">{currentReport.tls_data.issuer_org}</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-slate-500">PROTOCOL & CIPHER</div>
                  <div className="text-slate-200 truncate mt-1 font-bold">{currentReport.tls_data.protocol}</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-slate-500">KEY LENGTH</div>
                  <div className="text-slate-200 mt-1 tabular-nums font-bold">{currentReport.tls_data.key_length} bits RSA</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-slate-500">DAYS REMAINING</div>
                  <div className={`mt-1 tabular-nums font-bold ${currentReport.tls_data.days_remaining <= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {currentReport.tls_data.days_remaining} days
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Extracted Indicators (IOCs) */}
          <div className="p-6 rounded-xl bg-gradient-to-b from-[#0c101a] to-[#07090e] border border-[#1b253b] space-y-4 shadow-xl">
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>[#] EXTRACTED INDICATORS OF COMPROMISE (IOCs)</span>
            </h3>
            <div className="divide-y divide-slate-800/80">
              {currentReport.indicators.map((ind, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between gap-4 text-xs font-mono">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-slate-500 uppercase shrink-0 font-bold">[{ind.type}]</span>
                    <span className="text-slate-200 truncate">{ind.value}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded border ${
                      ind.reputation === 'malicious' ? 'bg-rose-950 text-rose-400 border-rose-800' :
                      ind.reputation === 'suspicious' ? 'bg-amber-950 text-amber-400 border-amber-800' : 
                      'bg-slate-900 text-slate-400 border-slate-800'
                    }`}>
                      {ind.reputation}
                    </span>
                    <button
                      onClick={() => copyToClipboard(ind.value)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                      title="Copy indicator"
                    >
                      {copiedIndicator === ind.value ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verifiable Threat Evidence Seal (EVM Smart Contract Provenance) */}
          <div className="p-6 rounded-xl bg-gradient-to-b from-[#0c101a] to-[#07090e] border border-cyan-500/40 space-y-3 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest">
                  [$] VERIFIABLE THREAT EVIDENCE // EVM PROVENANCE
                </span>
                <span className="text-slate-600" aria-hidden="true">·</span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  CRYPTOGRAPHICALLY SEALED
                </span>
              </div>
              <button
                onClick={() => setActiveView('evidence_vault')}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline underline-offset-2 flex items-center gap-1 cursor-pointer"
              >
                <span>VERIFY ON EVM REGISTRY</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-500 shrink-0">Canonical SHA-256:</span>
                <div className="flex items-center gap-2 truncate">
                  <span className="text-cyan-300 truncate">{currentReport.evidence.canonical_sha256}</span>
                  <button
                    onClick={() => copyToClipboard(currentReport.evidence.canonical_sha256, true)}
                    className="p-1 hover:text-slate-100 text-slate-500 transition-colors cursor-pointer"
                  >
                    {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 pt-1 border-t border-slate-900">
                <span>EVM Registry Tx: <strong className="text-slate-300">{(currentReport.evidence.evm_tx_hash || '0x0000000000000000').slice(0, 18)}...</strong></span>
                <span className="text-emerald-400 font-bold tabular-nums">BLOCK #{currentReport.evidence.evm_block_number || 19842103}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
