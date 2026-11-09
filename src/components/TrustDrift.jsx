import React, { useState } from 'react';
import { GitCompare, AlertTriangle, ArrowRight } from 'lucide-react';

export const TrustDrift = ({
  currentReport = null,
  allReports = [],
  onTriggerReinvestigation = () => {}
}) => {
  const urlReports = allReports.filter(r => r.target_type === 'url' || r.target_type === 'domain');
  const [selectedTarget, setSelectedTarget] = useState(
    currentReport && (currentReport.target_type === 'url' || currentReport.target_type === 'domain')
      ? currentReport.target
      : (urlReports[0]?.target || 'https://chase-security-verify.net/auth/login')
  );

  const report = allReports.find(r => r.target === selectedTarget) || currentReport;
  const drift = report?.trust_drift;

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.07]">
        <div className="space-y-1">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-500">
            Infrastructure Evolution & Snapshot Delta
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white font-heading">
            Trust Drift Forensics
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            Detect sudden hosting migrations, stealth TLS certificate changes, and security posture degradation over time.
          </p>
        </div>

        {/* Target Picker */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500">Target:</span>
          <select
            value={selectedTarget}
            onChange={(e) => setSelectedTarget(e.target.value)}
            className="p-2 rounded-lg bg-black/40 border border-white/[0.08] text-xs text-white font-mono focus:outline-none focus:border-white/30"
          >
            {urlReports.map((r) => (
              <option key={r.investigation_id} value={r.target} className="bg-slate-900 text-white">
                {r.target}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Drift Scorecard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl panel space-y-1">
          <div className="text-xs font-mono text-slate-400">Drift Variance Score</div>
          <div className="text-2xl sm:text-3xl font-semibold font-mono text-white tabular-nums">
            {drift?.drift_score || 0} <span className="text-sm text-slate-500 font-normal">/ 100</span>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            {drift?.drift_score && drift.drift_score > 50 ? 'Significant infrastructure shift' : 'Baseline stability nominal'}
          </div>
        </div>

        <div className="p-5 rounded-xl panel space-y-1">
          <div className="text-xs font-mono text-slate-400">Baseline Timestamp</div>
          <div className="text-sm font-mono text-slate-200 mt-2 truncate tabular-nums">
            {drift?.baseline_timestamp ? new Date(drift.baseline_timestamp).toLocaleString() : 'First Recorded'}
          </div>
          <div className="text-xs text-slate-500 font-mono">Historical anchor</div>
        </div>

        <div className="p-5 rounded-xl panel space-y-1">
          <div className="text-xs font-mono text-slate-400">Mutation Events</div>
          <div className="text-2xl sm:text-3xl font-semibold font-mono text-white tabular-nums">
            {drift?.changes_detected?.length || 0}
          </div>
          <div className="text-xs text-slate-500 font-mono">Observed delta across snapshots</div>
        </div>
      </div>

      {/* Drift Comparison Breakdown */}
      <div className="p-6 rounded-2xl panel space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.07]">
          <h2 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <GitCompare className="w-3.5 h-3.5 text-slate-400" />
            <span>Infrastructure Diff Log</span>
          </h2>
          <button
            type="button"
            onClick={() => onTriggerReinvestigation(selectedTarget)}
            className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Re-scan Baseline</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {drift?.changes_detected?.length > 0 ? (
          <div className="divide-y divide-white/[0.05]">
            {drift.changes_detected.map((change, idx) => (
              <div key={idx} className="py-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono font-semibold text-slate-200">
                    {change.category.toUpperCase()} · {change.field}
                  </div>
                  <span className={`text-xs font-mono uppercase font-medium ${
                    change.severity === 'critical' ? 'text-rose-400' :
                    change.severity === 'high' ? 'text-orange-400' :
                    'text-amber-400'
                  }`}>
                    {change.severity}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono p-3 rounded-lg bg-black/40 border border-white/[0.06]">
                  <div>
                    <span className="text-slate-500 text-[11px]">PREVIOUS VALUE:</span>
                    <div className="text-slate-300 truncate mt-0.5">{change.previous_value}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">CURRENT VALUE:</span>
                    <div className="text-white truncate mt-0.5 font-medium">{change.current_value}</div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  {change.risk_implication}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center space-y-2 rounded-xl bg-black/20 border border-dashed border-white/[0.08]">
            <AlertTriangle className="w-5 h-5 text-slate-500 mx-auto" />
            <div className="text-sm font-medium text-white">
              No historical baseline available — Trust Drift cannot yet be assessed.
            </div>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Trust Drift compares observable differences across distinct timestamped snapshots. Run a second investigation on this target at a later point in time to establish differential telemetry.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
