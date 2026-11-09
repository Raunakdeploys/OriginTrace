import React, { useState } from 'react';
import { 
  FileCheck2, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  Download, 
  Search,
  Lock,
  Layers,
  AlertTriangle,
  Fingerprint
} from 'lucide-react';

export const EvidenceVault = ({ investigations = [], setActiveView }) => {
  const [verifyInput, setVerifyInput] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedHash, setCopiedHash] = useState(null);

  const handleVerifyHash = async (hashToVerify) => {
    const hash = (hashToVerify || verifyInput).trim().toLowerCase();
    if (!hash) return;

    setIsVerifying(true);
    setVerifyResult(null);

    try {
      const res = await fetch('/api/evidence/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hash })
      });
      const data = await res.json();
      setVerifyResult(data);
    } catch (err) {
      setVerifyResult({
        verified: false,
        error: err.message || 'Verification network failure'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const copyText = (txt) => {
    navigator.clipboard.writeText(txt);
    setCopiedHash(txt);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const exportEvidenceCertificate = (item) => {
    const certData = {
      title: "ORIGINTRACE Cryptographic Investigation Certificate",
      version: "1.0-secp256k1",
      report_id: item.investigation_id,
      target: item.target,
      classification: item.classification,
      risk_score: item.risk_score,
      canonical_sha256: item.evidence?.canonical_sha256,
      timestamp: item.timestamp,
      evm_registry: {
        contract: item.evidence?.contract_address,
        block_number: item.evidence?.evm_block_number,
        transaction_hash: item.evidence?.evm_tx_hash
      },
      provenance_signature: item.evidence?.provenance_signature,
      security_notice: "Blockchain record integrity guarantees non-repudiation and tamper prevention. It does not replace independent forensic review."
    };

    const blob = new Blob([JSON.stringify(certData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ORIGINTRACE-CERT-${item.investigation_id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span className="tracking-wider uppercase font-semibold">CRYPTOGRAPHIC EVM EVIDENCE REGISTRY & VAULT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Evidence Vault & On-Chain State Verifier
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Cryptographically preserve investigation findings with canonical SHA-256 report hashing registered on an immutable EVM state contract.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl glass-subtle text-xs font-mono text-cyan-400 self-start md:self-auto flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>EVM LEDGER: MAINNET SIM</span>
        </div>
      </div>

      {/* Disclaimers & Integrity Boundary */}
      <div className="p-4 rounded-2xl glass-panel border border-cyan-500/20 bg-cyan-500/[0.02] text-xs text-slate-300 flex items-start gap-3.5">
        <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-white tracking-wide">Forensic Integrity Principle:</div>
          <p className="text-slate-400 leading-relaxed text-xs">
            Blockchain registry integrity guarantees that a report has <span className="text-cyan-300 font-semibold">never been altered or tampered with</span> after issuance. It does not replace qualitative intelligence analysis. Never store personally identifiable or confidential payload text on unencrypted blocks.
          </p>
        </div>
      </div>

      {/* Independent Verification Search Bar */}
      <div className="p-6 rounded-2xl glass-panel space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-cyan-400" />
            <span>Independent Fingerprint Verification</span>
          </h3>
          <p className="text-xs text-slate-400">
            Paste any 64-character SHA-256 investigation fingerprint to verify cryptographic registration and block inclusion:
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={verifyInput}
            onChange={(e) => setVerifyInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleVerifyHash()}
            placeholder="Paste SHA-256 fingerprint hash (e.g. d5a6b7e89104cfbc192847a98b76c5...)"
            className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60 transition-colors"
          />
          <button
            onClick={() => handleVerifyHash()}
            disabled={isVerifying}
            className="px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-xl text-xs cursor-pointer transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] shrink-0 disabled:opacity-50"
          >
            {isVerifying ? 'Verifying...' : 'Verify Cryptographic State'}
          </button>
        </div>

        {/* Verification Result Output */}
        {verifyResult && (
          <div className={`p-4 rounded-xl text-xs font-mono space-y-2.5 ${
            verifyResult.verified 
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' 
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm">
              {verifyResult.verified ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>REPORT FINGERPRINT AUTHENTICATED ON EVM LEDGER</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>FINGERPRINT NOT FOUND OR TAMPERED</span>
                </>
              )}
            </div>

            {verifyResult.verified && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                <div>Contract: <span className="text-white font-mono">{verifyResult.contract}</span></div>
                <div>Block Height: <span className="text-cyan-400 font-mono tabular-nums">#{verifyResult.block_number}</span></div>
                <div className="sm:col-span-2 truncate">Tx Hash: <span className="text-white font-mono">{verifyResult.transaction_hash}</span></div>
              </div>
            )}
            {!verifyResult.verified && (
              <p className="text-slate-300">{verifyResult.detail || verifyResult.error}</p>
            )}
          </div>
        )}
      </div>

      {/* Evidentiary Ledger Table */}
      <div className="p-6 rounded-2xl glass-panel space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Registered Evidence Ledger
            </h3>
            <p className="text-xs text-slate-400">
              Canonical SHA-256 hashes registered on EVM contract with ECDSA secp256k1 signatures
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 tabular-nums">
            {investigations.length} Sealed Records
          </span>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-black/30 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-white/[0.03] border-b border-white/[0.06] text-slate-400 text-[11px]">
              <tr>
                <th className="p-3.5">Report ID</th>
                <th className="p-3.5">Target</th>
                <th className="p-3.5">SHA-256 Fingerprint</th>
                <th className="p-3.5">EVM Block</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {investigations.map((item) => (
                <tr key={item.investigation_id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3.5 font-bold text-cyan-400 whitespace-nowrap">
                    {item.investigation_id}
                  </td>
                  <td className="p-3.5 text-slate-200 max-w-[200px] truncate">
                    {item.target}
                  </td>
                  <td className="p-3.5 text-slate-400 max-w-[220px] truncate selection:bg-cyan-500/30">
                    {item.evidence?.canonical_sha256}
                  </td>
                  <td className="p-3.5 text-slate-400 tabular-nums whitespace-nowrap">
                    #{item.evidence?.evm_block_number || 19842000}
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap space-x-2">
                    <button
                      onClick={() => handleVerifyHash(item.evidence?.canonical_sha256)}
                      className="px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                    >
                      Verify
                    </button>
                    <button
                      onClick={() => exportEvidenceCertificate(item)}
                      className="px-2.5 py-1 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] rounded-lg text-xs font-medium cursor-pointer transition-colors"
                      title="Download JSON certificate"
                    >
                      Cert
                    </button>
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
