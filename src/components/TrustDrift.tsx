import React, { useState } from 'react';
import { 
  GitCompare, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Server,
  Lock,
  RefreshCw,
  Layers
} from 'lucide-react';
import { UnifiedInvestigationResult, TrustDriftComparison } from '../types/investigation';

interface TrustDriftProps {
  currentReport: UnifiedInvestigationResult | null;
  allReports: UnifiedInvestigationResult[];
  onTriggerReinvestigation: (target: string) => void;
  setActiveView: (view: string) => void;
}

export const TrustDrift: React.FC<TrustDriftProps> = ({
  currentReport,
  allReports,
  onTriggerReinvestigation,
  setActiveView
}) => {
  const urlReports = allReports.filter(r => r.target_type === 'url' || r.target_type === 'domain');
  const [selectedTarget, setSelectedTarget] = useState<string>(
    currentReport && (currentReport.target_type === 'url' || currentReport.target_type === 'domain')
      ? currentReport.target
      : (urlReports[0]?.target || 'https://chase-security-verify.net/auth/login')
  );

  const report = allReports.find(r => r.target === selectedTarget) || currentReport;
  const drift = report?.trust_drift;

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-mono uppercase tracking-wider text-cyan-400">
            Differentiator B · Infrastructure Drift
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Trust Drift Detection
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Compare timestamped investigation snapshots to identify weaponization patterns, sudden IP migrations, stealth certificate swaps, and security header degradation.
          </p>
        </div>

        {/* Target Picker */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Domain Target:</span>
          <select
            value={selectedTarget}
            onChange={(e) => setSelectedTarget(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
          >
            {urlReports.map((r) => (
              <option key={r.investigation_id} value={r.target}>
                {r.target.slice(0, 35)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Drift Comparison View */}
      {drift?.has_previous_snapshot ? (
        <div className="space-y-6">
          {/* Drift Score Banner */}
          <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                <span>BASELINE: {new Date(drift.baseline_timestamp || '').toLocaleDateString()}</span>
                <span aria-hidden="true">→</span>
                <span>LATEST: {new Date(drift.current_timestamp).toLocaleDateString()}</span>
              </div>
              <h2 className="text-base font-semibold text-slate-200">
                Structural Drift Variance Identified
              </h2>
              <p className="text-xs text-slate-400 max-w-xl">
                {drift.notes}
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0 p-4 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-right">
                <div className="text-xs text-slate-500 uppercase font-mono">Drift Index</div>
                <div className={`text-2xl font-bold font-mono tabular-nums ${
                  drift.drift_score >= 70 ? 'text-rose-400' : drift.drift_score >= 30 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {drift.drift_score}/100
                </div>
              </div>
              <button
                onClick={() => onTriggerReinvestigation(selectedTarget)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Capture new snapshot"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Probe Again</span>
              </button>
            </div>
          </div>

          {/* Diff Grid */}
          <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wide">
              Detected Snapshot Deviations
            </h3>

            <div className="divide-y divide-slate-800 border-t border-slate-800">
              {drift.changes_detected.map((change, idx) => (
                <div key={idx} className="py-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300 font-semibold uppercase">
                      [{change.category.toUpperCase()}] {change.field}
                    </span>
                    <span className={`text-[11px] font-semibold uppercase ${
                      change.severity === 'critical' ? 'text-rose-400' :
                      change.severity === 'high' ? 'text-rose-300' : 'text-amber-400'
                    }`}>
                      {change.severity} Severity
                    </span>
                  </div>

                  {/* Side-by-Side Diff */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
                      <div className="text-slate-500 text-[10px] uppercase">Prior Snapshot State:</div>
                      <div className="text-rose-400/90 break-all">{change.previous_value}</div>
                    </div>
                    <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
                      <div className="text-slate-500 text-[10px] uppercase">Current Probed State:</div>
                      <div className="text-emerald-400/90 break-all">{change.current_value}</div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 leading-relaxed font-sans pt-1">
                    <span className="font-semibold text-slate-300">Security Implication:</span> {change.risk_implication}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Honest Baseline Notice when no prior history */
        <div className="p-8 rounded-lg bg-slate-900 border border-slate-800 text-center space-y-4">
          <GitCompare className="w-10 h-10 text-slate-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-slate-200">
              Historical Comparison Unavailable
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              ORIGINTRACE never fabricates historical timestamps. A baseline snapshot for <code className="text-cyan-400 font-mono">{selectedTarget}</code> was created on initial probe.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => onTriggerReinvestigation(selectedTarget)}
              className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-900 rounded-md text-xs font-semibold cursor-pointer transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Capture Second Snapshot for Drift Diff</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
