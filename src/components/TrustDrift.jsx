import React, { useState } from 'react';
import { GitCompare, Clock, AlertTriangle, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const TrustDrift = ({
  currentReport = null,
  allReports = [],
  onTriggerReinvestigation = () => {},
  setActiveView = () => {}
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
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div className="space-y-1">
          <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            Infrastructure Evolution
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-heading">
            Trust Drift Forensics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Detect sudden hosting migrations, stealth TLS certificate changes, and security posture degradation over time.
          </p>
        </div>

        {/* Target Picker */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500">Target:</span>
          <select
            value={selectedTarget}
            onChange={(e) => setSelectedTarget(e.target.value)}
            className="p-2 rounded-xl glass-subtle text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
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
        <div className="p-5 rounded-2xl glass-panel space-y-1">
          <div className="text-xs font-mono text-slate-400">Drift Variance Score</div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
            {drift?.drift_score || 0} <span className="text-sm text-slate-500 font-normal">/ 100</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            {drift?.drift_score && drift.drift_score > 50 ? 'Significant infrastructure shift' : 'Baseline stability nominal'}
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel space-y-1">
          <div className="text-xs font-mono text-slate-400">Baseline Timestamp</div>
          <div className="text-sm font-mono text-slate-200 mt-2 truncate">
            {drift?.baseline_timestamp ? new Date(drift.baseline_timestamp).toLocaleString() : 'First Recorded'}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">Historical anchor</div>
        </div>

        <div className="p-5 rounded-2xl glass-panel space-y-1">
          <div className="text-xs font-mono text-slate-400">Mutation Events</div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400 tabular-nums">
            {drift?.changes_detected?.length || 0}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">Changes between snapshots</div>
        </div>
      </div>

      {/* Drift Comparison Breakdown */}
      <div className="p-6 rounded-3xl glass-panel space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <h2 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <GitCompare className="w-3.5 h-3.5 text-cyan-400" />
            <span>Infrastructure Diff Log</span>
          </h2>
          <button
            onClick={() => onTriggerReinvestigation(selectedTarget)}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Re-scan Baseline</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {drift?.changes_detected?.length > 0 ? (
          <div className="divide-y divide-white/[0.06]">
            {drift.changes_detected.map((change, idx) => (
              <div key={idx} className="py-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono font-bold text-slate-200">
                    {change.category.toUpperCase()} · {change.field}
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    change.severity === 'critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                    change.severity === 'high' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                    'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {change.severity}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono p-3 rounded-xl glass-subtle">
                  <div>
                    <span className="text-slate-500 text-[10px]">PREVIOUS VALUE:</span>
                    <div className="text-slate-300 truncate mt-0.5">{change.previous_value}</div>
                  </div>
                  <div>
                    <span className="text-cyan-400 text-[10px]">CURRENT VALUE:</span>
                    <div className="text-white truncate mt-0.5 font-semibold">{change.current_value}</div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  {change.risk_implication}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 text-xs font-mono">
            No unexpected structural mutations detected between snapshots.
          </div>
        )}
      </div>
    </div>
  );
};
