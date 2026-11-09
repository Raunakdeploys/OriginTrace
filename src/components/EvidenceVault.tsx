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
  AlertTriangle
} from 'lucide-react';
import { UnifiedInvestigationResult } from '../types/investigation';

interface EvidenceVaultProps {
  investigations: UnifiedInvestigationResult[];
  setActiveView: (view: string) => void;
}

export const EvidenceVault: React.FC<EvidenceVaultProps> = ({ investigations, setActiveView }) => {
  const [verifyInput, setVerifyInput] = useState<string>('');
  const [verifyResult, setVerifyResult] = useState<any | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleVerifyHash = async (hashToVerify?: string) => {
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
    } catch (err: any) {
      setVerifyResult({
        verified: false,
        error: err.message || 'Verification network failure'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const copyText = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedHash(txt);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const exportEvidenceCertificate = (item: UnifiedInvestigationResult) => {
    const certData = {
      title: "ORIGINTRACE Cryptographic Investigation Certificate",
      version: "1.0-secp256k1",
      report_id: item.investigation_id,
      target: item.target,
      classification: item.classification,
      risk_score: item.risk_score,
      canonical_sha256: item.evidence.canonical_sha256,
      timestamp: item.timestamp,
      evm_registry: {
        contract: item.evidence.contract_address,
        block_number: item.evidence.evm_block_number,
        transaction_hash: item.evidence.evm_tx_hash
      },
      provenance_signature: item.evidence.provenance_signature,
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
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto w-full cyber-grid">
      {/* Header */}
      <div className="space-y-1 pb-4 border-b border-slate-800/80">
        <div className="text-[11px] font-mono tracking-widest uppercase text-cyan-400 font-bold">
          [$] CRYPTOGRAPHIC EVM EVIDENCE REGISTRY & VAULT
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 font-heading">
          Evidence Vault & On-Chain State Verifier
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          Cryptographically preserve investigation findings with canonical SHA-256 report hashing. Verified fingerprints are registered on an immutable EVM state contract for non-repudiation and forensic provenance.
        </p>
      </div>

      {/* Disclaimers & Integrity Boundary */}
      <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-1">
        <div className="flex items-center gap-2 text-slate-200 font-semibold">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Forensic Integrity Principle:</span>
        </div>
        <p className="leading-relaxed text-slate-500">
          Blockchain registry integrity guarantees that a report has <span className="text-slate-300">never been altered or tampered with</span> after issuance. It does not mean the finding is infallible. Never place sensitive personal data or raw private messages on-chain.
        </p>
      </div>

      {/* Independent Verification Search Bar */}
      <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">
            Independent Fingerprint Verification
          </h3>
          <p className="text-xs text-slate-400">
            Paste any 64-character SHA-256 investigation fingerprint to verify cryptographic registration and block inclusion:
          </p>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={verifyInput}
            onChange={(e) => setVerifyInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleVerifyHash()}
            placeholder="Paste SHA-256 fingerprint hash (e.g. d5a6b7e89104cfbc192847a98b76c5...)"
            className="flex-1 bg-slate-950 border border-slate-800 rounded px-4 py-2.5 text-xs text-slate-200 font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={() => handleVerifyHash()}
            disabled={isVerifying}
            className="px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-900 rounded text-xs font-semibold cursor-pointer transition-colors"
          >
            {isVerifying ? 'Verifying...' : 'Verify Cryptographic State'}
          </button>
        </div>

        {/* Verification Result Output */}
        {verifyResult && (
          <div className={`p-4 rounded-lg text-xs font-mono space-y-2 ${
            verifyResult.verified 
              ? 'bg-emerald-950/40 border border-emerald-800/80 text-emerald-300' 
              : 'bg-rose-950/40 border border-rose-800/80 text-rose-300'
          }`}>
            <div className="flex items-center gap-2 font-semibold">
              {verifyResult.verified ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>REPORT FINGERPRINT AUTHENTICATED ON EVM LEDGER</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>FINGERPRINT NOT FOUND OR TAMPERED</span>
                </>
              )}
            </div>

            {verifyResult.verified && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                <div>Contract: <span className="text-slate-200">{verifyResult.contract}</span></div>
                <div>Block Height: <span className="text-slate-200 tabular-nums">#{verifyResult.block_number}</span></div>
                <div className="sm:col-span-2 truncate">Tx Hash: <span className="text-slate-200">{verifyResult.transaction_hash}</span></div>
              </div>
            )}
            {!verifyResult.verified && (
              <p className="text-slate-400">{verifyResult.detail || verifyResult.error}</p>
            )}
          </div>
        )}
      </div>

      {/* Evidentiary Ledger Table */}
      <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">
              Registered Evidence Ledger
            </h3>
            <p className="text-xs text-slate-500">
              Canonical SHA-256 hashes registered on simulated EVM contract
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 tabular-nums">
            {investigations.length} Sealed Records
          </span>
        </div>

        <div className="rounded border border-slate-800 bg-slate-950 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 text-[11px]">
              <tr>
                <th className="p-3">Report ID</th>
                <th className="p-3">Target</th>
                <th className="p-3">SHA-256 Fingerprint</th>
                <th className="p-3">EVM Block</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {investigations.map((item) => (
                <tr key={item.investigation_id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="p-3 font-semibold text-slate-300 whitespace-nowrap">
                    {item.investigation_id}
                  </td>
                  <td className="p-3 text-slate-300 max-w-[200px] truncate">
                    {item.target}
                  </td>
                  <td className="p-3 text-slate-400 max-w-[220px] truncate">
                    {item.evidence.canonical_sha256}
                  </td>
                  <td className="p-3 text-slate-400 tabular-nums whitespace-nowrap">
                    #{item.evidence.evm_block_number || 19842000}
                  </td>
                  <td className="p-3 text-right whitespace-nowrap space-x-2">
                    <button
                      onClick={() => handleVerifyHash(item.evidence.canonical_sha256)}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded text-[11px] cursor-pointer transition-colors"
                    >
                      Verify
                    </button>
                    <button
                      onClick={() => exportEvidenceCertificate(item)}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] cursor-pointer transition-colors"
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
