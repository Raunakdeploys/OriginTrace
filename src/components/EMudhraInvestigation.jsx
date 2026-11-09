import React, { useState } from 'react';
import { 
  Award, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  Search, 
  Clock, 
  FileText, 
  Lock,
  ArrowRight,
  ShieldCheck,
  Building,
  Layers,
  Fingerprint
} from 'lucide-react';
import { EMUDHRA_AUDIT_REPORT } from '../data/emudhraIncident.js';

export const EMudhraInvestigation = ({
  onInvestigateTarget,
  setActiveView
}) => {
  const [selectedIncident, setSelectedIncident] = useState(
    EMUDHRA_AUDIT_REPORT.incidents[0]
  );
  const [searchSerial, setSearchSerial] = useState('');
  const [lookupResult, setLookupResult] = useState(null);

  const handleSerialSearch = () => {
    if (!searchSerial.trim()) return;
    const term = searchSerial.trim().toLowerCase();

    let matched = false;
    let detail = '';

    for (const inc of EMUDHRA_AUDIT_REPORT.incidents) {
      for (const ind of inc.indicators) {
        if (ind.value.toLowerCase().includes(term) || term.includes(ind.value.toLowerCase())) {
          matched = true;
          detail = `Matched ${ind.type} (${ind.description}) under ${inc.incident_title} [${inc.authority}].`;
          break;
        }
      }
      if (matched) break;
    }

    if (!matched) {
      if (term.includes('emudhra') || term.includes('sub ca')) {
        matched = true;
        detail = `Entity matches eMudhra Certificate Authority namespace. Verify leaf domain registration dates and Subject Alternative Names (SANs).`;
      } else {
        detail = `No specific misissuance telemetry matches this query in the current audit registry.`;
      }
    }

    setLookupResult({ matched, detail });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="tracking-wider uppercase font-semibold">CA ROOT STORE SURVEILLANCE // EMUDHRA AUDIT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            eMudhra Certificate Authority Audit Dossier
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Forensic analysis of compliance telemetry across Mozilla NSS, CA/Browser Forum, and Google Chrome Root Store programs.
          </p>
        </div>

        <button
          onClick={() => {
            if (onInvestigateTarget) onInvestigateTarget('https://secure-auth-emudhra-banking.net');
            if (setActiveView) setActiveView('investigate');
          }}
          className="px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-medium flex items-center gap-2 self-start md:self-auto transition-colors"
        >
          <span>Run Live eMudhra Test</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Non-Negotiable Principle Banner */}
      <div className="p-4 rounded-2xl glass-panel border border-amber-500/30 bg-amber-500/[0.03] text-xs text-amber-200/90 flex items-start gap-3.5">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-white tracking-wide">Investigative Principles & Non-Negotiable Axioms:</div>
          <p className="text-slate-300 leading-relaxed text-xs">
            1. An issuer name alone is <span className="text-amber-300 font-semibold underline decoration-amber-500/50">NOT proof of maliciousness</span>. Legitimate organizations globally utilize eMudhra certificates.
            <br />
            2. A valid TLS certificate does <span className="text-amber-300 font-semibold underline decoration-amber-500/50">NOT prove that a website is legitimate</span>. Phishing and credential harvesters frequently obtain accredited certificates.
          </p>
        </div>
      </div>

      {/* Audit Scorecard Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl glass-panel space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Authority Entity</div>
          <div className="text-sm sm:text-base font-bold text-white truncate">
            {EMUDHRA_AUDIT_REPORT.ca_name}
          </div>
          <div className="text-[11px] text-slate-500">{EMUDHRA_AUDIT_REPORT.headquarters}</div>
        </div>

        <div className="p-4 rounded-2xl glass-panel space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Supervisory Status</div>
          <div className="text-sm sm:text-base font-bold text-amber-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Enhanced Monitoring</span>
          </div>
          <div className="text-[11px] text-slate-500">Mozilla NSS & Chrome Root</div>
        </div>

        <div className="p-4 rounded-2xl glass-panel space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Documented Incidents</div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400">
            {EMUDHRA_AUDIT_REPORT.incidents_count} Cases
          </div>
          <div className="text-[11px] text-slate-500">Under CABF baseline rules</div>
        </div>

        <div className="p-4 rounded-2xl glass-panel space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Trust Stores Impacted</div>
          <div className="text-sm sm:text-base font-mono text-white font-semibold">
            4 Global Stores
          </div>
          <div className="text-[11px] text-slate-500">Mozilla, Google, Apple, Microsoft</div>
        </div>
      </div>

      {/* Incident Case Selector & Deep Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident List */}
        <div className="rounded-2xl glass-panel p-4 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 pb-2 border-b border-white/[0.06] flex items-center justify-between">
            <span>Documented Audit Breaches</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-400">
              {EMUDHRA_AUDIT_REPORT.incidents.length} Records
            </span>
          </div>
          <div className="space-y-2">
            {EMUDHRA_AUDIT_REPORT.incidents.map((inc) => {
              const isSelected = selectedIncident.id === inc.id;
              return (
                <button
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`w-full text-left p-3.5 rounded-xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/15 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)] text-cyan-300'
                      : 'bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                    <span className="font-semibold text-cyan-400">{inc.id}</span>
                    <span className="tabular-nums text-slate-500">{inc.disclosure_date}</span>
                  </div>
                  <div className="text-xs font-semibold text-white line-clamp-2">
                    {inc.incident_title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Incident Drilldown */}
        <div className="lg:col-span-2 rounded-2xl glass-panel p-6 space-y-5">
          <div className="space-y-2 pb-4 border-b border-white/[0.06]">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
              <span className="px-2 py-0.5 rounded-md bg-white/5 text-cyan-400 font-semibold">{selectedIncident.id}</span>
              <span className="text-slate-600">•</span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 uppercase font-semibold border border-amber-500/20">
                {selectedIncident.severity} Severity
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">{selectedIncident.authority}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {selectedIncident.incident_title}
            </h2>
          </div>

          <div className="space-y-4 text-xs leading-relaxed">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="font-semibold text-slate-300 mb-1 text-xs">Incident Overview:</div>
              <p className="text-slate-400 leading-relaxed">{selectedIncident.summary}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="font-semibold text-slate-300 mb-1 text-xs">Technical Breakdown:</div>
              <p className="text-slate-400 leading-relaxed">{selectedIncident.technical_breakdown}</p>
            </div>
          </div>

          {/* Sub CAs Affected */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Affected Subordinate CAs:</span>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] font-mono">
              {selectedIncident.affected_sub_cas.map((sub, i) => (
                <span key={i} className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                  {sub}
                </span>
              ))}
            </div>
          </div>

          {/* Auditing Bodies & Bugzilla */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono pt-1">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
              <div className="text-slate-500 text-[10px] uppercase font-semibold">Auditing Entities</div>
              <div className="text-slate-300 font-sans text-xs">{selectedIncident.auditing_bodies.join(', ')}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
              <div className="text-slate-500 text-[10px] uppercase font-semibold">Bugzilla Disclosure</div>
              <div className="text-cyan-400 font-mono text-xs">{selectedIncident.bugzilla_references.join(', ')}</div>
            </div>
          </div>

          {/* Technical Indicators */}
          {selectedIncident.indicators && selectedIncident.indicators.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Fingerprint className="w-3.5 h-3.5 text-cyan-400" />
                <span>Forensic Indicators & Hashes:</span>
              </div>
              <div className="divide-y divide-white/[0.04] rounded-xl bg-white/[0.02] border border-white/[0.06] p-3 text-xs font-mono">
                {selectedIncident.indicators.map((ind, i) => (
                  <div key={i} className="py-2.5 first:pt-1 last:pb-1 space-y-1">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="uppercase text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">[{ind.type}]</span>
                      <span className="text-[10px] text-slate-500">{ind.description}</span>
                    </div>
                    <div className="text-slate-200 text-xs break-all font-mono selection:bg-cyan-500/30">{ind.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Forensic Certificate & Serial Query Tool */}
      <div className="p-6 rounded-2xl glass-panel space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <Search className="w-4 h-4 text-cyan-400" />
            <span>Subordinate CA & Serial Cross-Reference Tool</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Cross-reference certificate serial numbers, SHA-256 fingerprints, or common names against eMudhra surveillance telemetry.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={searchSerial}
            onChange={(e) => setSearchSerial(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSerialSearch()}
            placeholder="e.g. 7A446DB820B11D79... or eMudhra Premium TLS Sub CA"
            className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60 transition-colors"
          />
          <button
            onClick={handleSerialSearch}
            className="px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-xl text-xs cursor-pointer transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] shrink-0"
          >
            Query Registry
          </button>
        </div>

        {lookupResult && (
          <div className={`p-4 rounded-xl text-xs font-mono ${
            lookupResult.matched
              ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
              : 'bg-white/[0.02] border border-white/[0.06] text-slate-400'
          }`}>
            <div className="font-semibold mb-1 flex items-center gap-1.5">
              {lookupResult.matched ? <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> : <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />}
              <span>Query Result:</span>
            </div>
            <div>{lookupResult.detail}</div>
          </div>
        )}
      </div>
    </div>
  );
};
