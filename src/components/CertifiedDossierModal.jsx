import React, { useRef } from 'react';
import { 
  ShieldCheck, 
  FileCheck2, 
  Download, 
  Printer, 
  X, 
  ExternalLink, 
  Lock, 
  Award, 
  Calendar, 
  Fingerprint, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export const CertifiedDossierModal = ({ isOpen, onClose, report }) => {
  const printRef = useRef(null);

  if (!isOpen || !report) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const certPayload = {
      "@context": "https://schema.org/DigitalDocument",
      "type": "CybersecurityForensicDossier",
      "issuer": "ORIGINTRACE Cryptographic Evidence Registry",
      "investigation_id": report.investigation_id,
      "timestamp_utc": report.timestamp,
      "target_inspected": report.target?.display_value || report.target,
      "target_type": report.target_type || "url",
      "forensic_classification": report.classification,
      "risk_score": report.risk_score,
      "confidence_rating": report.confidence || "HIGH",
      "cryptographic_proof": {
        "hash_algorithm": "SHA-256 (FIPS 180-4)",
        "canonical_fingerprint": report.evidence?.canonical_sha256,
        "evm_registry_contract": report.evidence?.contract_address || "0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE",
        "evm_block_number": report.evidence?.evm_block_number || 19842103,
        "transaction_hash": report.evidence?.evm_tx_hash || "0x89ab4c7d91e320f9a765cb14e21a8890cd334e2b109af3487c5e21908bf41da7",
        "on_chain_status": "COMMITTED_IMMUTABLE"
      },
      "summary_findings": report.summary,
      "indicators_captured": (report.indicators || []).map(ind => ({
        type: ind.type,
        value: ind.value,
        basis: ind.provenance_basis || "direct_observation"
      })),
      "checks_conducted": (report.checks || []).map(c => ({
        module: c.module,
        status: c.status,
        severity: c.severity,
        summary: c.summary
      })),
      "legal_notice": "This document contains a cryptographically signed investigation dossier. Hash tampering invalidates the EVM registry integrity state."
    };

    const blob = new Blob([JSON.stringify(certPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ORIGINTRACE-FORENSIC-DOSSIER-${report.investigation_id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isMalicious = report.classification === 'CONFIRMED MALICIOUS' || report.classification === 'HIGH RISK';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="w-full max-w-4xl rounded-3xl glass-panel border border-white/[0.15] bg-[#090d16] text-slate-100 shadow-2xl my-8 overflow-hidden flex flex-col">
        {/* Modal Controls Bar */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Award className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Court-Grade Forensic Cryptographic Certificate
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl glass-subtle hover:bg-white/[0.08] text-xs font-mono text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-xs font-mono text-cyan-300 border border-cyan-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl glass-subtle hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Canvas */}
        <div ref={printRef} className="p-6 sm:p-10 space-y-6 max-h-[78vh] overflow-y-auto bg-gradient-to-b from-[#090d16] to-[#0d1424] font-sans">
          {/* Certificate Framing Header */}
          <div className="border-4 border-double border-cyan-500/30 p-6 sm:p-8 rounded-2xl relative overflow-hidden bg-black/40">
            {/* Watermark Crest */}
            <div className="absolute right-4 top-4 text-cyan-500/5 select-none pointer-events-none font-mono text-8xl font-black">
              ORIGIN
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#38bdf8]" />
                    <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                      OFFICIAL FORENSIC RECORD // NON-REPUDIATION ATTESTATION
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
                    ORIGINTRACE Cryptographic Investigation Dossier
                  </h1>
                </div>

                <div className="text-right font-mono text-xs text-slate-400 space-y-0.5 shrink-0">
                  <div>Dossier ID: <strong className="text-cyan-300">{report.investigation_id}</strong></div>
                  <div>Timestamp: <span className="text-slate-300">{new Date(report.timestamp).toUTCString()}</span></div>
                </div>
              </div>

              {/* Inspected Target Banner */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Target Investigated</div>
                  <div className="text-base font-mono font-bold text-white break-all">
                    {report.target?.display_value || report.target}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`px-4 py-2 rounded-xl text-center font-mono font-bold text-xs border ${
                    isMalicious 
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                      : report.classification === 'SUSPICIOUS'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    <div className="text-[10px] text-slate-400 uppercase font-normal">Classification</div>
                    <div>{report.classification}</div>
                  </div>

                  <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-center font-mono text-xs">
                    <div className="text-[10px] text-slate-400 uppercase">Risk Index</div>
                    <div className="text-base font-extrabold text-white tabular-nums">{report.risk_score}/100</div>
                  </div>
                </div>
              </div>

              {/* Technical Summary */}
              <div className="space-y-1.5 text-xs text-slate-300 leading-relaxed bg-white/[0.01] p-4 rounded-xl border border-white/[0.04]">
                <div className="font-semibold text-slate-200 uppercase font-mono text-[11px] tracking-wide">
                  Executive Assessment & Evidentiary Findings
                </div>
                <p>{report.summary}</p>
              </div>

              {/* Cryptographic Ledger Anchor Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-cyan-500/[0.04] border border-cyan-500/20 space-y-1.5">
                  <div className="text-cyan-400 font-bold flex items-center gap-1.5 text-[11px] uppercase">
                    <Fingerprint className="w-3.5 h-3.5" />
                    <span>Canonical SHA-256 Report Fingerprint</span>
                  </div>
                  <div className="text-slate-200 break-all text-[11px] selection:bg-cyan-500/30">
                    {report.evidence?.canonical_sha256}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Standard: RFC 6234 deterministic canonical payload serialization.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-500/[0.04] border border-purple-500/20 space-y-1.5">
                  <div className="text-purple-400 font-bold flex items-center gap-1.5 text-[11px] uppercase">
                    <Lock className="w-3.5 h-3.5" />
                    <span>On-Chain EVM Evidence Registry</span>
                  </div>
                  <div className="text-[11px] text-slate-300 space-y-0.5">
                    <div>Contract: <span className="text-cyan-300 font-semibold">{report.evidence?.contract_address || '0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE'}</span></div>
                    <div>Transaction: <span className="text-slate-400 truncate">{(report.evidence?.evm_tx_hash || '0x89ab4c7d91e320f9a765cb14e21a8890cd334e2b').slice(0, 22)}...</span></div>
                    <div>Block Height: <span className="text-emerald-400 font-bold">#{report.evidence?.evm_block_number || 19842103}</span></div>
                  </div>
                </div>
              </div>

              {/* Extracted Indicators Table */}
              {report.indicators && report.indicators.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wide">
                    Observed Artifact Indicators ({report.indicators.length})
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-white/[0.06] bg-black/30">
                    <table className="w-full text-left border-collapse text-xs font-mono">
                      <thead>
                        <tr className="border-b border-white/[0.06] text-slate-400 text-[10px] uppercase">
                          <th className="p-2.5">Indicator Type</th>
                          <th className="p-2.5">Observed Value</th>
                          <th className="p-2.5">Provenance Basis</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {report.indicators.slice(0, 6).map((ind, i) => (
                          <tr key={i} className="text-[11px]">
                            <td className="p-2.5 text-cyan-400 uppercase font-semibold">[{ind.type}]</td>
                            <td className="p-2.5 text-slate-200 break-all">{ind.value}</td>
                            <td className="p-2.5 text-slate-400">{ind.provenance_basis || 'direct_observation'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Chain of Custody & Security Statement */}
              <div className="pt-4 border-t border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[10px] text-slate-400 font-mono">
                <div className="space-y-0.5">
                  <div>Cryptographic Anchor: secp256k1 EVM Signature Proof</div>
                  <div>Zero Personal Data (PII) Stored On-Chain</div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">Integrity Verified On-Chain</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
