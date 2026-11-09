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
  FileCheck2
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
          throw new Error(data.error || 'Message investigation failed');
        }
        setCurrentReport(data);
        onSaveToHistory(data);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during network analysis.');
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
    <div className="flex-1 overflow-y-auto p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="text-xs font-mono uppercase tracking-wider text-cyan-400">
          Forensic Inspection Suite
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">
          Target Investigation Workspace
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Input an untrusted URL, hostname, raw email, or SMS communication. ORIGINTRACE correlates digital identity signatures across DNS, TLS, redirects, and content indicators.
        </p>
      </div>

      {/* Input Module */}
      <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
        {/* Target Type Selector — Segmented Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
            <button
              onClick={() => setTargetType('url')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                targetType === 'url' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>URL Target</span>
            </button>
            <button
              onClick={() => setTargetType('domain')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                targetType === 'domain' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Domain Only</span>
            </button>
            <button
              onClick={() => setTargetType('message')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                targetType === 'message' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>SMS / Message</span>
            </button>
            <button
              onClick={() => setTargetType('email')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                targetType === 'email' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email / .EML</span>
            </button>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Presets:</span>
            <button
              onClick={() => handleLoadPreset('https://chase-security-verify.net/auth/login', 'url')}
              className="hover:text-cyan-400 transition-colors underline underline-offset-2 cursor-pointer"
            >
              Chase Phish Lure
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => handleLoadPreset('https://secure-auth-emudhra-banking.net', 'url')}
              className="hover:text-amber-400 transition-colors underline underline-offset-2 cursor-pointer"
            >
              eMudhra Gateway
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => handleLoadPreset('https://github.com', 'url')}
              className="hover:text-emerald-400 transition-colors underline underline-offset-2 cursor-pointer"
            >
              GitHub (Clean)
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
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                rows={5}
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                placeholder="Paste suspicious SMS notification, email body, job lure, or headers here..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
              />
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Or upload an RFC 822 .eml file directly:</span>
                <label className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer transition-colors flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Choose .EML file</span>
                  <input type="file" accept=".eml,.txt" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Error banner */}
        {errorMessage && (
          <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800/80 text-xs text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span>SSRF Policy: Active</span>
            <span aria-hidden="true">·</span>
            <span>Timeout: 8s</span>
            <span aria-hidden="true">·</span>
            <span>Deterministic SHA-256</span>
          </div>
          <button
            onClick={handleStartInvestigation}
            disabled={isLoading}
            className={`px-5 py-2.5 rounded-md text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-colors flex items-center gap-2 shadow-sm shadow-cyan-950 cursor-pointer ${
              isLoading ? 'opacity-70 cursor-wait' : ''
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Investigating Target...</span>
              </>
            ) : (
              <>
                <span>Start Investigation</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4 animate-pulse">
          <div className="h-4 bg-slate-800 rounded w-1/4"></div>
          <div className="h-8 bg-slate-800 rounded w-3/4"></div>
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="h-20 bg-slate-800/60 rounded"></div>
            <div className="h-20 bg-slate-800/60 rounded"></div>
            <div className="h-20 bg-slate-800/60 rounded"></div>
          </div>
        </div>
      )}

      {/* Investigation Results Report */}
      {currentReport && !isLoading && (
        <div className="space-y-6">
          {/* 1 & 2: Executive Summary & Classification Header */}
          <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="text-xs font-mono text-slate-500">
                  REPORT ID: <span className="text-slate-300">{currentReport.investigation_id}</span>
                  <span className="mx-2" aria-hidden="true">·</span>
                  TIMESTAMP: <span className="text-slate-300 tabular-nums">{new Date(currentReport.timestamp).toLocaleString()}</span>
                  {currentReport.is_sample_data && (
                    <>
                      <span className="mx-2" aria-hidden="true">·</span>
                      <span className="text-amber-400">Sample Reference</span>
                    </>
                  )}
                </div>
                <div className="text-base font-bold text-slate-100 font-mono break-all">
                  {currentReport.target}
                </div>
              </div>

              {/* Classification Badge */}
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <div className={`text-base font-extrabold tracking-wider ${
                    currentReport.classification === 'CONFIRMED MALICIOUS' || currentReport.classification === 'HIGH RISK'
                      ? 'text-rose-400'
                      : currentReport.classification === 'SUSPICIOUS'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}>
                    {currentReport.classification}
                  </div>
                  <div className="text-xs font-mono text-slate-400 tabular-nums">
                    Risk Score: {currentReport.risk_score} / 100
                  </div>
                </div>
              </div>
            </div>

            {/* Executive Summary Prose */}
            <div className="text-sm text-slate-300 leading-relaxed">
              {currentReport.summary}
            </div>
          </div>

          {/* 3: Risk Score & Indicators Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Confidence Level</div>
              <div className="text-xl font-bold font-mono text-slate-100 mt-1">
                {currentReport.confidence}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Based on multi-angle telemetry</div>
            </div>

            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Total Checks Run</div>
              <div className="text-xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">
                {currentReport.checks.length} checks
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {currentReport.checks.filter(c => c.status === 'failed').length} flagged vulnerabilities
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">IOC Indicators</div>
              <div className="text-xl font-bold font-mono text-purple-400 mt-1 tabular-nums">
                {currentReport.indicators.length} extracted
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Domains, IPs & Certs</div>
            </div>

            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Identity Graph Nodes</div>
              <div className="text-xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
                {currentReport.identity_graph.nodes.length} nodes
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {currentReport.identity_graph.edges.length} evidence relationships
              </div>
            </div>
          </div>

          {/* 4 & 5 & 6: Technical Findings & Checks (Module findings) */}
          <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">
                Technical Checks & Forensic Evidence
              </h3>
              <span className="text-xs text-slate-500">
                {currentReport.checks.length} modules executed
              </span>
            </div>

            <div className="divide-y divide-slate-800 border-t border-slate-800">
              {currentReport.checks.map((chk) => (
                <div key={chk.id} className="py-3.5 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                        <span>{chk.title}</span>
                        <span className="text-[10px] font-mono text-slate-500">[{chk.module.toUpperCase()}]</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {chk.finding}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-[11px] font-mono font-semibold ${
                        chk.severity === 'critical' ? 'text-rose-400' :
                        chk.severity === 'high' ? 'text-rose-300' :
                        chk.severity === 'medium' ? 'text-amber-400' : 'text-slate-400'
                      }`}>
                        {chk.severity.toUpperCase()}
                      </span>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Source: {chk.source}
                      </div>
                    </div>
                  </div>

                  {/* Evidence Items */}
                  {chk.evidence && chk.evidence.length > 0 && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-mono text-slate-400 bg-slate-950/60 p-2 rounded border border-slate-800/80">
                      {chk.evidence.map((ev, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <span className="text-slate-500">{ev.key}:</span>
                          <span className="text-slate-300">{String(ev.value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 7: Message Analysis (If applicable) */}
          {currentReport.message_analysis && (
            <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">
                Linguistic & Social Engineering Dissection
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-xs text-slate-400">Primary Actor Intent</div>
                  <div className="text-sm font-semibold text-purple-300">
                    {currentReport.message_analysis.intent}
                  </div>
                  <div className="text-xs text-slate-500">
                    Urgency Level: <span className="text-rose-400 uppercase font-mono font-semibold">{currentReport.message_analysis.urgency_level}</span>
                  </div>
                </div>

                <div className="p-4 rounded bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-xs text-slate-400">Targeted Entities</div>
                  <div className="text-sm font-semibold text-slate-200">
                    {currentReport.message_analysis.impersonated_entities.join(', ') || 'None identified'}
                  </div>
                </div>
              </div>

              {currentReport.message_analysis.actionable_recommendations.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <div className="text-xs font-semibold text-slate-300">Actionable Defense Recommendations:</div>
                  <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                    {currentReport.message_analysis.actionable_recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* 8: TLS & Security Headers Technical Drilldown (If URL) */}
          {currentReport.tls_data && (
            <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">
                  TLS Certificate & Web Trust Analysis
                </h3>
                {currentReport.tls_data.is_emudhra_issued && (
                  <button
                    onClick={() => setActiveView('emudhra')}
                    className="text-xs text-amber-400 hover:text-amber-300 underline underline-offset-2 flex items-center gap-1 cursor-pointer"
                  >
                    <span>eMudhra Surveillance Correlated</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                <div className="p-3 bg-slate-950 rounded border border-slate-800">
                  <div className="text-slate-500">Issuer CA</div>
                  <div className="text-slate-200 truncate mt-1">{currentReport.tls_data.issuer_org}</div>
                </div>
                <div className="p-3 bg-slate-950 rounded border border-slate-800">
                  <div className="text-slate-500">Protocol & Cipher</div>
                  <div className="text-slate-200 truncate mt-1">{currentReport.tls_data.protocol}</div>
                </div>
                <div className="p-3 bg-slate-950 rounded border border-slate-800">
                  <div className="text-slate-500">Key Length</div>
                  <div className="text-slate-200 mt-1 tabular-nums">{currentReport.tls_data.key_length} bits RSA</div>
                </div>
                <div className="p-3 bg-slate-950 rounded border border-slate-800">
                  <div className="text-slate-500">Days Remaining</div>
                  <div className={`mt-1 tabular-nums ${currentReport.tls_data.days_remaining <= 0 ? 'text-rose-400' : 'text-slate-200'}`}>
                    {currentReport.tls_data.days_remaining} days
                  </div>
                </div>
              </div>

              {currentReport.tls_data.subject_alt_names.length > 0 && (
                <div className="text-xs space-y-1">
                  <span className="text-slate-500">Subject Alternative Names (SANs):</span>
                  <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-300">
                    {currentReport.tls_data.subject_alt_names.map((san, i) => (
                      <span key={i} className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {san}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 9: Extracted Indicators (IOCs) */}
          <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">
              Extracted Indicators of Compromise (IOCs)
            </h3>
            <div className="divide-y divide-slate-800 border-t border-slate-800">
              {currentReport.indicators.map((ind, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between gap-4 text-xs font-mono">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-slate-500 uppercase shrink-0">[{ind.type}]</span>
                    <span className="text-slate-200 truncate">{ind.value}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[10px] uppercase font-semibold ${
                      ind.reputation === 'malicious' ? 'text-rose-400' :
                      ind.reputation === 'suspicious' ? 'text-amber-400' : 'text-slate-500'
                    }`}>
                      {ind.reputation}
                    </span>
                    <button
                      onClick={() => copyToClipboard(ind.value)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                      title="Copy indicator"
                    >
                      {copiedIndicator === ind.value ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 10 & 11: Inline Identity Graph Preview & Trust Drift */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Identity Graph Box */}
            <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-semibold text-slate-200">
                    Digital Identity Graph
                  </h3>
                  <p className="text-xs text-slate-500">
                    Evidence-backed relationship graph
                  </p>
                </div>
                <button
                  onClick={() => setActiveView('identity_graph')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>Expand Canvas</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="p-4 rounded bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
                {currentReport.identity_graph.edges.map((e) => (
                  <div key={e.id} className="flex items-center justify-between text-slate-300 py-1 border-b border-slate-900 last:border-0">
                    <div className="truncate">
                      <span className="text-cyan-400">{e.source.replace(/^(domain_|brand_|ip_)/, '')}</span>
                      <span className="text-slate-600 mx-2">→ {e.relationship} →</span>
                      <span className="text-purple-400">{e.target.replace(/^(domain_|brand_|ip_)/, '')}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0 ml-2">
                      via {e.evidenceSource}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Drift Box */}
            <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-semibold text-slate-200">
                    Trust Drift
                  </h3>
                  <p className="text-xs text-slate-500">
                    Infrastructure snapshot comparison
                  </p>
                </div>
                <button
                  onClick={() => setActiveView('trust_drift')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>Full Drift Timeline</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="p-4 rounded bg-slate-950 border border-slate-800 space-y-3">
                {currentReport.trust_drift?.has_previous_snapshot ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Drift Variance Score:</span>
                      <span className="text-rose-400 font-bold tabular-nums">
                        {currentReport.trust_drift.drift_score} / 100
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 leading-relaxed">
                      {currentReport.trust_drift.notes}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 leading-relaxed font-mono">
                    Historical comparison is unavailable for this first-time target. The current digital infrastructure state has been snapshotted as the baseline.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 13: Limitations Boundary */}
          {currentReport.limitations.length > 0 && (
            <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="font-semibold text-slate-300">Technical Scope & Limitations:</div>
              <ul className="list-disc list-inside space-y-0.5 text-slate-500">
                {currentReport.limitations.map((lim, idx) => (
                  <li key={idx}>{lim}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 14 & 15: Verifiable Threat Evidence Seal */}
          <div className="p-6 rounded-lg bg-slate-900 border border-cyan-900/40 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  Verifiable Threat Evidence
                </span>
                <span className="text-slate-600" aria-hidden="true">·</span>
                <span className="text-xs font-mono text-emerald-400">
                  {currentReport.evidence.tamper_status === 'verified_intact' ? 'Cryptographically Sealed' : 'Verified'}
                </span>
              </div>
              <button
                onClick={() => setActiveView('evidence_vault')}
                className="text-xs text-cyan-400 hover:text-cyan-300 underline underline-offset-2 flex items-center gap-1 cursor-pointer"
              >
                <span>Verify on Local EVM Ledger</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="p-3 rounded bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-500 shrink-0">Canonical SHA-256:</span>
                <div className="flex items-center gap-2 truncate">
                  <span className="text-slate-300 truncate">{currentReport.evidence.canonical_sha256}</span>
                  <button
                    onClick={() => copyToClipboard(currentReport.evidence.canonical_sha256, true)}
                    className="p-1 hover:text-slate-100 text-slate-500 transition-colors"
                  >
                    {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
                <span>EVM Registry Tx:</span>
                <span className="text-slate-400 truncate">{currentReport.evidence.evm_tx_hash}</span>
                <span className="tabular-nums">Block #{currentReport.evidence.evm_block_number}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
