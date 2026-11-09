import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ExternalLink, 
  Search, 
  ArrowRight, 
  Layers
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
      if (term.includes('emsign') || term.includes('emudhra') || term.includes('sub ca')) {
        matched = true;
        detail = `Entity matches eMudhra / emSign Certificate Authority namespace. Verify leaf domain registration dates, intermediate CA authorityKeyIdentifier, and Subject Alternative Names (SANs).`;
      } else {
        detail = `No specific misissuance telemetry or weak-key indicator matches this query in the current audit registry. Check live OCSP responders for current revocation status.`;
      }
    }

    setLookupResult({ matched, detail });
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.07]">
        <div className="space-y-1">
          <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">
            Certificate Authority Root Store Surveillance · eMudhra & emSign Audit
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white font-heading">
            eMudhra CA Audit Dossier
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            Forensic analysis of compliance telemetry across Mozilla NSS, CA/Browser Forum, and Google Chrome Root Store programs.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <a
            href={EMUDHRA_AUDIT_REPORT.official_statement_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors border border-white/[0.08]"
          >
            <span>Official Advisory</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <button
            type="button"
            onClick={() => {
              if (onInvestigateTarget) onInvestigateTarget('https://secure-auth-emudhra-banking.net');
              if (setActiveView) setActiveView('investigate');
            }}
            className="px-4 py-2 rounded-lg bg-white hover:bg-slate-200 text-slate-950 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>Run Live Host Test</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Non-Negotiable Principle Banner */}
      <div className="p-5 rounded-xl panel border-amber-500/25 bg-amber-950/10 text-xs text-slate-300 flex items-start gap-3.5">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1.5">
          <div className="font-semibold text-white tracking-wide">
            Investigative Principles & Non-Negotiable Axioms:
          </div>
          <div className="text-slate-400 leading-relaxed text-xs space-y-1">
            <p>
              1. <strong className="text-slate-200">Issuer name alone is not proof of maliciousness:</strong> Millions of legitimate organizations rely on valid accredited eMudhra certificates.
            </p>
            <p>
              2. <strong className="text-slate-200">Valid TLS encryption does not guarantee business legitimacy:</strong> Phishing and credential harvesting sites frequently obtain accredited TLS certificates.
            </p>
            <p>
              3. <strong className="text-slate-200">Intermediate CA vs Leaf Distinction:</strong> The October 2026 incident affected 8 intermediate CA private keys (revoked within 14h), not subscriber customer private keys.
            </p>
            <p>
              4. <strong className="text-slate-200">Service Isolation:</strong> eMudhra's global digital-signature / eSign and Indian DSC infrastructure operate on distinct, unaffected HSM clusters.
            </p>
          </div>
        </div>
      </div>

      {/* Audit Scorecard Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl panel space-y-1">
          <div className="text-xs font-mono text-slate-500 uppercase">Authority Entity</div>
          <div className="text-sm sm:text-base font-semibold text-white truncate">
            {EMUDHRA_AUDIT_REPORT.ca_name}
          </div>
          <div className="text-xs text-slate-500">{EMUDHRA_AUDIT_REPORT.headquarters}</div>
        </div>

        <div className="p-5 rounded-xl panel space-y-1">
          <div className="text-xs font-mono text-slate-500 uppercase">Supervisory Status</div>
          <div className="text-sm sm:text-base font-semibold text-amber-400">
            Enhanced Monitoring
          </div>
          <div className="text-xs text-slate-500">Mozilla NSS & Chrome Root</div>
        </div>

        <div className="p-5 rounded-xl panel space-y-1">
          <div className="text-xs font-mono text-slate-500 uppercase">Documented Breaches</div>
          <div className="text-xl sm:text-2xl font-semibold font-mono text-white tabular-nums">
            {EMUDHRA_AUDIT_REPORT.incidents_count} Incidents
          </div>
          <div className="text-xs text-slate-500">CABF baseline rules audited</div>
        </div>

        <div className="p-5 rounded-xl panel space-y-1">
          <div className="text-xs font-mono text-slate-500 uppercase">Trust Stores Scrutinized</div>
          <div className="text-sm sm:text-base font-mono text-white font-semibold">
            4 Global Stores
          </div>
          <div className="text-xs text-slate-500">Mozilla, Google, Apple, Microsoft</div>
        </div>
      </div>

      {/* Hierarchy Distinction Explainer Strip */}
      <div className="p-6 rounded-2xl panel space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.07]">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400" />
            <span>X.509 PKI Trust Architecture Distinction</span>
          </h3>
          <span className="text-xs font-mono text-slate-500">Technical Context</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-black/30 border border-white/[0.06] space-y-1.5">
            <div className="font-semibold text-white">
              Root CA (Anchor)
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Self-signed trust anchors embedded in operating systems and browsers (e.g. eMudhra Root CA 2022). Not compromised.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-950/15 border border-amber-500/20 space-y-1.5">
            <div className="font-semibold text-amber-300">
              Intermediate Sub-CA
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Issues certificates to subscribers. <strong>8 emSign G3 intermediates</strong> had weak private keys from script flaw and were revoked within 14h.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/30 border border-white/[0.06] space-y-1.5">
            <div className="font-semibold text-white">
              End-Entity (Leaf)
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Subscriber certificates on domains. Zero public end-entity certificates were issued by the 8 flawed G3 intermediates.
            </p>
          </div>
        </div>
      </div>

      {/* Serial / Fingerprint Search Bar */}
      <div className="p-6 rounded-2xl panel space-y-4">
        <div className="space-y-1">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Certificate Identifier & Sub-CA Telemetry Search</span>
          </h3>
          <p className="text-xs text-slate-400">
            Search serial numbers, key identifiers, or Common Names against the eMudhra audit registry:
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={searchSerial}
            onChange={(e) => setSearchSerial(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSerialSearch()}
            placeholder="e.g. emSign GCC TLS Server Sub CA, 0x1A2B3C..., or Bugzilla ID"
            className="flex-1 bg-black/40 border border-white/[0.08] rounded-lg px-4 py-2.5 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-white/30 transition-colors"
          />
          <button
            type="button"
            onClick={handleSerialSearch}
            className="px-5 py-2.5 bg-white hover:bg-slate-200 text-slate-950 font-medium rounded-lg text-xs cursor-pointer transition-colors shrink-0"
          >
            Search Registry
          </button>
        </div>

        {lookupResult && (
          <div className={`p-4 rounded-lg text-xs font-mono space-y-1.5 ${
            lookupResult.matched 
              ? 'bg-amber-950/20 border border-amber-500/30 text-amber-200' 
              : 'bg-black/30 border border-white/[0.08] text-slate-300'
          }`}>
            <div className="font-semibold text-white">
              {lookupResult.matched ? 'TELEMETRY MATCH FOUND' : 'NO RECORD MATCH'}
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {lookupResult.detail}
            </p>
          </div>
        )}
      </div>

      {/* Incident Case Selector & Deep Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident List */}
        <div className="rounded-2xl panel p-5 space-y-3">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 pb-2 border-b border-white/[0.07] flex items-center justify-between">
            <span>Audit Cases Timeline</span>
            <span className="text-xs font-mono text-slate-500 tabular-nums">
              {EMUDHRA_AUDIT_REPORT.incidents.length} Records
            </span>
          </div>
          <div className="space-y-2">
            {EMUDHRA_AUDIT_REPORT.incidents.map((inc) => {
              const isSelected = selectedIncident.id === inc.id;
              return (
                <button
                  key={inc.id}
                  type="button"
                  onClick={() => setSelectedIncident(inc)}
                  className={`w-full text-left p-3.5 rounded-xl transition-colors cursor-pointer border ${
                    isSelected
                      ? 'bg-white/[0.08] border-white/20 text-white'
                      : 'bg-black/20 hover:bg-white/[0.04] border-white/[0.04] text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                    <span className="font-semibold text-slate-200">{inc.id}</span>
                    <span className="tabular-nums text-slate-500">{inc.disclosure_date}</span>
                  </div>
                  <div className="text-xs font-medium text-white line-clamp-2">
                    {inc.incident_title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Incident Drilldown */}
        <div className="lg:col-span-2 rounded-2xl panel p-6 space-y-5">
          <div className="space-y-2 pb-4 border-b border-white/[0.07]">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
              <span className="font-semibold text-white">{selectedIncident.id}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className={`uppercase font-semibold ${
                selectedIncident.severity === 'critical' ? 'text-rose-400' :
                selectedIncident.severity === 'high' ? 'text-orange-400' :
                'text-amber-400'
              }`}>
                {selectedIncident.severity}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{selectedIncident.authority}</span>
            </div>
            <h2 className="text-lg font-semibold text-white tracking-tight">
              {selectedIncident.incident_title}
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="text-xs font-mono text-slate-500 uppercase">Incident Summary</div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed mt-1">
                {selectedIncident.description}
              </p>
            </div>

            <div>
              <div className="text-xs font-mono text-slate-500 uppercase">Root Cause Analysis</div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed mt-1">
                {selectedIncident.root_cause}
              </p>
            </div>

            <div>
              <div className="text-xs font-mono text-slate-500 uppercase">Remediation Action & Timetable</div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed mt-1">
                {selectedIncident.remediation}
              </p>
            </div>

            {selectedIncident.indicators && selectedIncident.indicators.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-white/[0.07]">
                <div className="text-xs font-mono text-slate-400 uppercase font-semibold">
                  Technical Artifacts & Indicators
                </div>
                <div className="divide-y divide-white/[0.04] rounded-lg bg-black/40 border border-white/[0.06] p-3 font-mono">
                  {selectedIncident.indicators.map((ind, i) => (
                    <div key={i} className="py-2 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div>
                        <span className="text-slate-500 uppercase">[{ind.type}] </span>
                        <span className="text-white break-all">{ind.value}</span>
                      </div>
                      <span className="text-slate-400 text-[11px] font-sans sm:text-right shrink-0">
                        {ind.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
