import React from 'react';
import { 
  ShieldAlert, 
  Search, 
  Terminal, 
  ArrowUpRight, 
  Lock, 
  GitCompare, 
  FileCheck2, 
  AlertTriangle,
  Globe,
  Radio,
  ExternalLink
} from 'lucide-react';
import { UnifiedInvestigationResult } from '../types/investigation';

interface OverviewProps {
  investigations: UnifiedInvestigationResult[];
  onSelectInvestigation: (item: UnifiedInvestigationResult) => void;
  onNavigateToInvestigate: (prefillTarget?: string, type?: 'url' | 'message') => void;
  setActiveView: (view: string) => void;
}

export const Overview: React.FC<OverviewProps> = ({ 
  investigations, 
  onSelectInvestigation, 
  onNavigateToInvestigate,
  setActiveView
}) => {
  const maliciousCount = investigations.filter(i => i.classification === 'CONFIRMED MALICIOUS' || i.classification === 'HIGH RISK').length;
  const totalIndicators = investigations.reduce((acc, curr) => acc + (curr.indicators?.length || 0), 0);

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8">
      {/* Editorial Header */}
      <div className="space-y-2">
        <div className="text-xs font-mono uppercase tracking-wider text-cyan-400">
          Cyber Threat & Identity Surveillance
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">
          Executive Investigation Console
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          ORIGINTRACE investigates digital threats across domains, TLS trust chains, redirect infrastructure, and manipulative social messages. Every finding is backed by technical evidence, correlated across the Digital Identity Graph, and sealed with verifiable SHA-256 cryptographic fingerprints.
        </p>
      </div>

      {/* Metrics Strip — Tabular Numerals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Total Investigations</div>
          <div className="text-2xl font-bold font-mono text-slate-100 tabular-nums mt-1">
            {investigations.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>Verified in session</span>
            <span aria-hidden="true">·</span>
            <span>Tamper-evident</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">High Risk & Malicious</div>
          <div className="text-2xl font-bold font-mono text-rose-400 tabular-nums mt-1">
            {maliciousCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>Credential theft</span>
            <span aria-hidden="true">·</span>
            <span>Typosquatting</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Extracted IOC Indicators</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums mt-1">
            {totalIndicators}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>Domains</span>
            <span aria-hidden="true">·</span>
            <span>IPs</span>
            <span aria-hidden="true">·</span>
            <span>Certificates</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">eMudhra Audit Incidents</div>
          <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums mt-1">
            03
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>CABF Non-compliance</span>
            <span aria-hidden="true">·</span>
            <span>Surveillance</span>
          </div>
        </div>
      </div>

      {/* Quick Launchpad & Workflows */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          onClick={() => onNavigateToInvestigate()} 
          className="p-5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <Globe className="w-5 h-5 text-cyan-400" />
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </div>
          <h2 className="text-sm font-semibold text-slate-200 mt-3 group-hover:text-cyan-400 transition-colors">
            Universal URL & Domain Prober
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Execute SSRF-contained network scans, DNS record resolution, real TLS socket inspection, and typosquatting calculations.
          </p>
        </div>

        <div 
          onClick={() => onNavigateToInvestigate('URGENT: Your Wells Fargo account has been locked due to unauthorized access. Click here to restore: https://bit.ly/bank-auth-99', 'message')} 
          className="p-5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <Terminal className="w-5 h-5 text-purple-400" />
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
          </div>
          <h2 className="text-sm font-semibold text-slate-200 mt-3 group-hover:text-purple-400 transition-colors">
            AI Scam & Message Dissector
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Ingest SMS, email body copy, job offers, or .eml headers. Gemini 3.8 Flash dissects coercive urgency, brand impersonation, and IOCs.
          </p>
        </div>

        <div 
          onClick={() => setActiveView('emudhra')} 
          className="p-5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <Lock className="w-5 h-5 text-amber-400" />
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
          </div>
          <h2 className="text-sm font-semibold text-slate-200 mt-3 group-hover:text-amber-400 transition-colors">
            eMudhra CA Forensic Autopsy
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Examine the genuine 2024–2025 CA compliance audit, delayed revocation SLA breaches, and investigate certificates issued by flagged sub-CAs.
          </p>
        </div>
      </div>

      {/* Recent Investigation Case Stream */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-base font-semibold text-slate-200">
              Active Investigation Reports
            </h2>
            <p className="text-xs text-slate-500">
              Verified forensic cases stored in evidentiary registry
            </p>
          </div>
          <button 
            onClick={() => setActiveView('history')}
            className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>View All Records</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900 overflow-hidden">
          <div className="divide-y divide-slate-800">
            {investigations.map((item) => {
              const isMalicious = item.classification === 'CONFIRMED MALICIOUS' || item.classification === 'HIGH RISK';
              const isSuspicious = item.classification === 'SUSPICIOUS';

              return (
                <div 
                  key={item.investigation_id}
                  onClick={() => onSelectInvestigation(item)}
                  className="p-4 hover:bg-slate-850/80 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                      <span>{item.investigation_id}</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{item.target_type}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{new Date(item.timestamp).toLocaleDateString()}</span>
                      {item.is_sample_data && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-slate-400">Sample Baseline</span>
                        </>
                      )}
                    </div>
                    <div className="text-sm font-medium text-slate-200 truncate">
                      {item.target}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {item.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className={`text-xs font-semibold ${
                        isMalicious ? 'text-rose-400' : isSuspicious ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {item.classification}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 tabular-nums">
                        Score {item.risk_score}/100
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectInvestigation(item);
                      }}
                      className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                    >
                      Inspect
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
