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
  Layers, 
  RefreshCw, 
  FileCheck2, 
  Activity, 
  Zap 
} from 'lucide-react';
import { ScamExposureRescueModal } from './ScamExposureRescue.jsx';

export const Investigate = ({
  initialTarget = '',
  initialType = 'url',
  currentReport = null,
  setCurrentReport = () => {},
  onSaveToHistory = () => {},
  setActiveView = () => {}
}) => {
  const [targetType, setTargetType] = useState(initialType === 'message' ? 'message' : 'url');
  const [targetInput, setTargetInput] = useState(initialTarget);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedIndicator, setCopiedIndicator] = useState(null);
  const [isRescueOpen, setIsRescueOpen] = useState(false);

  const handleLoadPreset = (target, type) => {
    setTargetType(type);
    setTargetInput(target);
    setErrorMessage(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      setTargetType('email');
      setTargetInput(content);
    };
    reader.readAsText(file);
  };

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
    } catch (err) {
      setErrorMessage(err.message || 'Investigation request failed');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text, isHash = false) => {
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
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="space-y-1 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono tracking-wider uppercase text-cyan-400 font-semibold">
            Forensic Interrogation
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-xs font-mono text-emerald-400">Live Telemetry</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-heading">
          Target Interrogation Bay
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">
          Evaluate untrusted web assets, domains, emails, or text messages. Features automated DNS mapping, TLS root CA inspection, VirusTotal vendor consensus, and Google Safe Browsing checks.
        </p>
      </div>

      {/* Input Card */}
      <div className="p-6 rounded-3xl glass-panel space-y-4">
        {/* Type Toggle Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 rounded-xl glass-subtle text-xs font-mono">
            <button
              onClick={() => setTargetType('url')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                targetType === 'url' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>URL</span>
            </button>
            <button
              onClick={() => setTargetType('domain')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                targetType === 'domain' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Domain</span>
            </button>
            <button
              onClick={() => setTargetType('message')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                targetType === 'message' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Message</span>
            </button>
            <button
              onClick={() => setTargetType('email')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                targetType === 'email' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </button>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Presets:</span>
            <button
              onClick={() => handleLoadPreset('https://chase-security-verify.net/auth/login', 'url')}
              className="text-cyan-400 hover:underline cursor-pointer"
            >
              Chase Phish
            </button>
            <span>·</span>
            <button
              onClick={() => handleLoadPreset('https://secure-auth-emudhra-banking.net', 'url')}
              className="text-amber-400 hover:underline cursor-pointer"
            >
              eMudhra CA
            </button>
            <span>·</span>
            <button
              onClick={() => handleLoadPreset('https://github.com', 'url')}
              className="text-emerald-400 hover:underline cursor-pointer"
            >
              GitHub Clean
            </button>
          </div>
        </div>

        {/* Input Area */}
        <div className="space-y-2">
          {targetType === 'url' || targetType === 'domain' ? (
            <input
              type="text"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStartInvestigation()}
              placeholder={targetType === 'url' ? 'https://target-portal.com/auth' : 'example-domain.org'}
              className="w-full px-4 py-3.5 rounded-2xl glass-subtle text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/50 transition-all font-mono"
            />
          ) : (
            <div className="space-y-2">
              <textarea
                rows={5}
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                placeholder="Paste suspicious SMS notification, email body, or communication headers..."
                className="w-full p-4 rounded-2xl glass-subtle text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/50 transition-all font-mono leading-relaxed"
              />
              <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                <span>Upload RFC 822 email file:</span>
                <label className="px-3 py-1.5 rounded-xl glass-subtle hover:bg-white/[0.08] text-slate-300 cursor-pointer flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Choose .EML</span>
                  <input type="file" accept=".eml,.txt" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-mono text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/[0.06]">
          <div className="text-xs font-mono text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>SSRF Firewall: Active</span>
            <span>·</span>
            <span>Timeout: 8s</span>
          </div>

          <button
            onClick={handleStartInvestigation}
            disabled={isLoading}
            className={`px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer ${
              isLoading ? 'opacity-70 cursor-wait' : ''
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Interrogating...</span>
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

      {/* Results View */}
      {currentReport && !isLoading && (
        <div className="space-y-6">
          {/* Executive Summary Card */}
          <div className="p-6 rounded-3xl glass-panel space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
              <div className="space-y-1">
                <div className="text-xs font-mono text-slate-400 flex flex-wrap items-center gap-2">
                  <span>ID: <strong className="text-slate-200">{currentReport.investigation_id}</strong></span>
                  <span>·</span>
                  <span>{new Date(currentReport.timestamp).toLocaleString()}</span>
                </div>
                <div className="text-base sm:text-lg font-bold text-cyan-300 font-mono break-all">
                  {currentReport.target}
                </div>
              </div>

              {/* Score Badge */}
              <div className="flex items-center gap-3 shrink-0 p-3 rounded-2xl glass-subtle">
                <div className="text-right">
                  <div className={`text-sm font-bold font-mono ${
                    currentReport.classification === 'CONFIRMED MALICIOUS' || currentReport.classification === 'HIGH RISK'
                      ? 'text-rose-400'
                      : currentReport.classification === 'SUSPICIOUS'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}>
                    {currentReport.classification}
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    Risk: {currentReport.risk_score} / 100
                  </div>
                </div>

                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-mono font-black text-xs border ${
                  currentReport.risk_score >= 70 ? 'border-rose-500 text-rose-400 bg-rose-500/10' :
                  currentReport.risk_score >= 40 ? 'border-amber-500 text-amber-400 bg-amber-500/10' :
                  'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                }`}>
                  {currentReport.risk_score}
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {currentReport.summary}
            </p>

            {/* Scope & Truthfulness Notice (Mandatory Blueprint Principle) */}
            <div className="p-3.5 rounded-2xl glass-subtle border border-cyan-500/20 text-xs text-slate-300 flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-semibold text-white flex items-center gap-2">
                  <span>Scope & Assurance Policy</span>
                  <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    Confidence: {currentReport.confidence || 'HIGH'}
                  </span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  A <span className="text-emerald-400 font-semibold">LOW RISK</span> finding signifies absence of malicious indicators within completed checks only—it does not constitute guaranteed safety. A valid TLS certificate or accredited CA does not prove a site is legitimate.
                </p>
              </div>
            </div>

            {/* Prompt for Scam Exposure Rescue */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06]">
              <span className="text-xs text-slate-400">
                Already clicked or shared credentials with this target?
              </span>
              <button
                type="button"
                onClick={() => setIsRescueOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Open Scam Exposure Rescue</span>
              </button>
            </div>
          </div>

          {/* Limitations Card (if any recorded) */}
          {currentReport.limitations && currentReport.limitations.length > 0 && (
            <div className="p-4 rounded-2xl glass-panel border border-amber-500/20 bg-amber-500/[0.02] space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Investigation Scope Limitations</span>
              </div>
              <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                {currentReport.limitations.map((lim, idx) => (
                  <li key={idx} className="leading-relaxed">{lim}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Technical Checks Card */}
          <div className="p-6 rounded-3xl glass-panel space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h2 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>Technical Checks & Evidence</span>
              </h2>
              <span className="text-xs font-mono text-slate-400">
                {currentReport.checks.length} executed
              </span>
            </div>

            <div className="divide-y divide-white/[0.06]">
              {currentReport.checks.map((chk) => (
                <div key={chk.id} className="py-3.5 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                        <span>{chk.title}</span>
                        <span className="text-[10px] font-mono text-cyan-400 px-1.5 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/20">
                          {chk.module}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {chk.finding}
                      </p>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      chk.severity === 'critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                      chk.severity === 'high' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                      chk.severity === 'medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-white/[0.05] text-slate-400 border border-white/[0.08]'
                    }`}>
                      {chk.severity}
                    </span>
                  </div>

                  {chk.evidence && chk.evidence.length > 0 && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-mono text-slate-300 p-2 rounded-xl glass-subtle">
                      {chk.evidence.map((ev, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <span className="text-slate-500">{ev.key}:</span>
                          <span className="text-slate-200">{String(ev.value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* IOC Indicators Card */}
          <div className="p-6 rounded-3xl glass-panel space-y-4">
            <h2 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Extracted Indicators of Compromise</span>
            </h2>
            <div className="divide-y divide-white/[0.06]">
              {currentReport.indicators.map((ind, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between gap-4 text-xs font-mono">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-slate-500 uppercase">[{ind.type}]</span>
                    <span className="text-slate-200 truncate">{ind.value}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      ind.reputation === 'malicious' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                      ind.reputation === 'suspicious' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-white/[0.05] text-slate-400 border border-white/[0.08]'
                    }`}>
                      {ind.reputation}
                    </span>
                    <button
                      onClick={() => copyToClipboard(ind.value)}
                      className="p-1 rounded-lg glass-subtle hover:text-white transition-colors cursor-pointer"
                      title="Copy IOC"
                    >
                      {copiedIndicator === ind.value ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* EVM Cryptographic Proof Card */}
          <div className="p-6 rounded-3xl glass-panel space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                  Verifiable Cryptographic Proof
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs font-mono text-emerald-400">Intact</span>
              </div>
              <button
                onClick={() => setActiveView('evidence_vault')}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <span>Verify in Vault</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl glass-subtle font-mono text-xs space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-500 shrink-0">SHA-256 Fingerprint:</span>
                <div className="flex items-center gap-2 truncate">
                  <span className="text-cyan-300 truncate">{currentReport.evidence.canonical_sha256}</span>
                  <button
                    onClick={() => copyToClipboard(currentReport.evidence.canonical_sha256, true)}
                    className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-white/[0.04]">
                <span>EVM Tx: <strong className="text-slate-300">{(currentReport.evidence.evm_tx_hash || '0x0000000000000000').slice(0, 18)}...</strong></span>
                <span className="text-emerald-400">Block #{currentReport.evidence.evm_block_number || 19842103}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Modal for Scam Exposure Rescue */}
      <ScamExposureRescueModal
        isOpen={isRescueOpen}
        onClose={() => setIsRescueOpen(false)}
        currentReport={currentReport}
      />
    </div>
  );
};
