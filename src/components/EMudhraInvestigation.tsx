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
  ArrowRight
} from 'lucide-react';
import { EMUDHRA_AUDIT_REPORT, EMudhraIncidentRecord } from '../data/emudhraIncident';

interface EMudhraInvestigationProps {
  onInvestigateTarget: (domain: string) => void;
  setActiveView: (view: string) => void;
}

export const EMudhraInvestigation: React.FC<EMudhraInvestigationProps> = ({
  onInvestigateTarget,
  setActiveView
}) => {
  const [selectedIncident, setSelectedIncident] = useState<EMudhraIncidentRecord>(
    EMUDHRA_AUDIT_REPORT.incidents[0]
  );
  const [searchSerial, setSearchSerial] = useState<string>('');
  const [lookupResult, setLookupResult] = useState<{ matched: boolean; detail: string } | null>(null);

  const handleSerialSearch = () => {
    if (!searchSerial.trim()) return;
    const term = searchSerial.trim().toLowerCase();

    // Check if term matches known incident indicators
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
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto w-full cyber-grid">
      {/* Header */}
      <div className="space-y-1 pb-4 border-b border-slate-800/80">
        <div className="text-[11px] font-mono tracking-widest uppercase text-amber-400 font-bold">
          [!] CA ROOT STORE SURVEILLANCE // EMUDHRA AUDIT
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 font-heading">
          eMudhra Certificate Authority Audit & Incident Dossier
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          Comprehensive forensic autopsy of recent eMudhra compliance incidents across Mozilla NSS, CA/Browser Forum, and Google Chrome Root Store programs (2024–2025).
        </p>
      </div>

      {/* Non-Negotiable Principle Banner */}
      <div className="p-4 rounded-lg bg-slate-900 border border-amber-900/40 text-xs text-amber-200/90 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-slate-200">Investigative Principles:</div>
          <p className="text-slate-400 leading-relaxed">
            1. An issuer name alone is <span className="text-amber-300 font-semibold">NOT proof of maliciousness</span>. Legitimate organizations globally utilize eMudhra certificates.
            <br />
            2. A valid TLS certificate does <span className="text-amber-300 font-semibold">NOT prove that a website is legitimate</span>. Phishing and credential harvesters frequently obtain accredited certificates.
          </p>
        </div>
      </div>

      {/* Audit Scorecard Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Authority Entity</div>
          <div className="text-sm font-bold text-slate-100 mt-1 truncate">
            {EMUDHRA_AUDIT_REPORT.ca_name}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Bengaluru, India</div>
        </div>

        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Supervisory Status</div>
          <div className="text-sm font-bold text-amber-400 mt-1">
            Enhanced Monitoring
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Mozilla NSS & Chrome Root</div>
        </div>

        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Documented Incidents</div>
          <div className="text-xl font-bold font-mono text-slate-100 tabular-nums mt-1">
            {EMUDHRA_AUDIT_REPORT.incidents_count} Cases
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Under CABF baseline rules</div>
        </div>

        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Trust Stores Impacted</div>
          <div className="text-sm font-mono text-slate-200 mt-1">
            4 Global Stores
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Mozilla, Google, Apple, Microsoft</div>
        </div>
      </div>

      {/* Incident Case Selector & Deep Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident List */}
        <div className="rounded-lg bg-slate-900 border border-slate-800 p-4 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800">
            Documented Audit Breaches
          </div>
          <div className="space-y-2">
            {EMUDHRA_AUDIT_REPORT.incidents.map((inc) => (
              <div
                key={inc.id}
                onClick={() => setSelectedIncident(inc)}
                className={`p-3 rounded-md transition-colors cursor-pointer text-left ${
                  selectedIncident.id === inc.id
                    ? 'bg-slate-800 border border-cyan-800/80 text-cyan-400'
                    : 'bg-slate-950/60 hover:bg-slate-850 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
                  <span>{inc.id}</span>
                  <span className="tabular-nums">{inc.disclosure_date}</span>
                </div>
                <div className="text-xs font-semibold line-clamp-2">
                  {inc.incident_title}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Incident Drilldown */}
        <div className="lg:col-span-2 rounded-lg bg-slate-900 border border-slate-800 p-6 space-y-5">
          <div className="space-y-1.5 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span>{selectedIncident.id}</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400 uppercase font-semibold">{selectedIncident.severity} Severity</span>
              <span aria-hidden="true">·</span>
              <span>{selectedIncident.authority}</span>
            </div>
            <h2 className="text-base font-bold text-slate-100">
              {selectedIncident.incident_title}
            </h2>
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-slate-300">
            <div>
              <span className="font-semibold text-slate-200">Incident Overview: </span>
              {selectedIncident.summary}
            </div>
            <div>
              <span className="font-semibold text-slate-200">Technical Breakdown: </span>
              {selectedIncident.technical_breakdown}
            </div>
          </div>

          {/* Sub CAs Affected */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-300">Affected Subordinate CAs:</div>
            <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-300">
              {selectedIncident.affected_sub_cas.map((sub, i) => (
                <span key={i} className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-cyan-400">
                  {sub}
                </span>
              ))}
            </div>
          </div>

          {/* Auditing Bodies & Bugzilla */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono pt-2">
            <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-slate-500 text-[10px]">Auditing Entities:</div>
              <div className="text-slate-300">{selectedIncident.auditing_bodies.join(', ')}</div>
            </div>
            <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-slate-500 text-[10px]">Bugzilla Disclosure:</div>
              <div className="text-cyan-400">{selectedIncident.bugzilla_references.join(', ')}</div>
            </div>
          </div>

          {/* Technical Indicators */}
          {selectedIncident.indicators.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="text-xs font-semibold text-slate-300">Forensic Indicators:</div>
              <div className="divide-y divide-slate-800 bg-slate-950 rounded border border-slate-800 p-3 text-xs font-mono">
                {selectedIncident.indicators.map((ind, i) => (
                  <div key={i} className="py-2 first:pt-0 last:pb-0 space-y-0.5">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="uppercase text-[10px] text-cyan-400">[{ind.type}]</span>
                      <span className="text-[10px] text-slate-500">{ind.description}</span>
                    </div>
                    <div className="text-slate-200 break-all">{ind.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Forensic Certificate & Serial Query Tool */}
      <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">
          Subordinate CA & Serial Cross-Reference Tool
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Cross-reference certificate serial numbers, SHA-256 fingerprints, or common names against eMudhra surveillance telemetry.
        </p>

        <div className="flex gap-3">
          <input
            type="text"
            value={searchSerial}
            onChange={(e) => setSearchSerial(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSerialSearch()}
            placeholder="e.g. 7A446DB820B11D79... or eMudhra Premium TLS Sub CA"
            className="flex-1 bg-slate-950 border border-slate-800 rounded px-4 py-2.5 text-xs text-slate-200 font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={handleSerialSearch}
            className="px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-900 rounded text-xs font-semibold cursor-pointer transition-colors"
          >
            Query Registry
          </button>
        </div>

        {lookupResult && (
          <div className={`p-4 rounded text-xs font-mono ${
            lookupResult.matched ? 'bg-amber-950/60 border border-amber-800/80 text-amber-300' : 'bg-slate-950 border border-slate-800 text-slate-400'
          }`}>
            <div className="font-semibold mb-1">Query Result:</div>
            <div>{lookupResult.detail}</div>
          </div>
        )}

        {/* Sample Target Launcher */}
        <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
          <span>Test Live eMudhra Investigation:</span>
          <button
            onClick={() => {
              onInvestigateTarget('https://secure-auth-emudhra-banking.net');
              setActiveView('investigate');
            }}
            className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 flex items-center gap-1 cursor-pointer"
          >
            <span>Scan secure-auth-emudhra-banking.net</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
