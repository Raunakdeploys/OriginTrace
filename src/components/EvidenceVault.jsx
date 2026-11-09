import React, { useState } from 'react';
import { 
  FileCheck2, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Check, 
  Download, 
  Fingerprint
} from 'lucide-react';

export const EvidenceVault = ({ investigations = [] }) => {
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
    <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.07]">
        <div className="space-y-1">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-500">
            Cryptographic EVM Evidence Registry & Vault
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white font-heading">
            Evidence Vault & Ledger
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            Cryptographically preserve investigation findings with canonical SHA-256 report hashing registered on an immutable EVM state contract.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
          <span>Ledger: EVM Mainnet Simulation</span>
          <span aria-hidden="true">·</span>
          <span>SHA-256 canonical RFC 6234</span>
        </div>
      </div>

      {/* Disclaimers & Integrity Boundary */}
      <div className="p-5 rounded-xl panel text-xs text-slate-300 flex items-start gap-3.5">
        <ShieldCheck className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-white tracking-wide">Forensic Integrity Principle:</div>
          <p className="text-slate-400 leading-relaxed text-xs">
            Blockchain registry integrity guarantees that a report has <strong className="text-slate-200">never been altered or tampered with</strong> after issuance. It does not replace qualitative intelligence analysis. Never store personally identifiable or confidential payload text on unencrypted blocks.
          </p>
        </div>
      </div>

      {/* Independent Verification Search Bar */}
      <div className="p-6 rounded-2xl panel space-y-4">
        <div className="space-y-1">
          <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-slate-400" />
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
            className="flex-1 bg-black/40 border border-white/[0.08] rounded-lg px-4 py-2.5 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-white/30 transition-colors"
          />
          <button
            type="button"
            onClick={() => handleVerifyHash()}
            disabled={isVerifying}
            className="px-5 py-2.5 bg-white hover:bg-slate-200 text-slate-950 font-medium rounded-lg text-xs cursor-pointer transition-colors shrink-0 disabled:opacity-50"
          >
            {isVerifying ? 'Verifying...' : 'Verify Cryptographic State'}
          </button>
        </div>

        {/* Verification Result Output */}
        {verifyResult && (
          <div className={`p-4 rounded-lg text-xs font-mono space-y-2 ${
            verifyResult.verified 
              ? 'bg-emerald-950/20 border border-emerald-500/30 text-emerald-300' 
              : 'bg-rose-950/20 border border-rose-500/30 text-rose-300'
          }`}>
            <div className="flex items-center gap-2 font-semibold text-sm">
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
                <div>Block Height: <span className="text-white font-mono tabular-nums">#{verifyResult.block_number}</span></div>
                <div className="sm:col-span-2 truncate">Tx Hash: <span className="text-slate-300 font-mono">{verifyResult.transaction_hash}</span></div>
              </div>
            )}
            {!verifyResult.verified && (
              <p className="text-slate-300">{verifyResult.detail || verifyResult.error}</p>
            )}
          </div>
        )}
      </div>

      {/* Evidentiary Ledger Table */}
      <div className="p-6 rounded-2xl panel space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Registered Evidence Ledger
            </h3>
            <p className="text-xs text-slate-400">
              Canonical SHA-256 hashes registered on EVM contract with ECDSA secp256k1 signatures
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 tabular-nums">
            {investigations.length} Sealed Records
          </span>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-black/40 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-white/[0.02] border-b border-white/[0.07] text-slate-400 text-xs">
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
                  <td className="p-3.5 font-medium text-white whitespace-nowrap">
                    {item.investigation_id}
                  </td>
                  <td className="p-3.5 text-slate-300 max-w-[200px] truncate">
                    {item.target}
                  </td>
                  <td className="p-3.5 text-slate-400 max-w-[220px] truncate">
                    {item.evidence?.canonical_sha256}
                  </td>
                  <td className="p-3.5 text-slate-400 tabular-nums whitespace-nowrap">
                    #{item.evidence?.evm_block_number || 19842000}
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap space-x-2">
                    <button
                      type="button"
                      onClick={() => handleVerifyHash(item.evidence?.canonical_sha256)}
                      className="px-2.5 py-1 bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/[0.08] rounded-md text-xs font-medium cursor-pointer transition-colors"
                    >
                      Verify
                    </button>
                    <button
                      type="button"
                      onClick={() => exportEvidenceCertificate(item)}
                      className="px-2.5 py-1 bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/[0.08] rounded-md text-xs font-medium cursor-pointer transition-colors"
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
