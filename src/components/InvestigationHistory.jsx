import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  ExternalLink, 
  FileText, 
  Trash2,
  Calendar,
  Globe,
  Mail,
  MessageSquare,
  ArrowRight,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';

export const InvestigationHistory = ({
  investigations = [],
  onSelectInvestigation,
  onClearHistory,
  setActiveView
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [classificationFilter, setClassificationFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = investigations.filter((item) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      item.investigation_id.toLowerCase().includes(term) ||
      item.target.toLowerCase().includes(term) ||
      (item.summary && item.summary.toLowerCase().includes(term));

    const matchesClass = classificationFilter === 'all' || item.classification === classificationFilter;
    const matchesType = typeFilter === 'all' || item.target_type === typeFilter;

    return matchesSearch && matchesClass && matchesType;
  });

  const exportAllHistory = () => {
    const blob = new Blob([JSON.stringify(investigations, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ORIGINTRACE-Investigation-History-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getBadgeStyle = (classification) => {
    switch (classification) {
      case 'CONFIRMED MALICIOUS':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'HIGH RISK':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'SUSPICIOUS':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'LOW RISK':
      default:
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <History className="w-3.5 h-3.5" />
            <span className="tracking-wider uppercase font-semibold">CASE ARCHIVE & FORENSIC DOSSIER LOG</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Historical Investigation Dossiers
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Comprehensive archive of historical investigations, extracted indicators, and cryptographic certificates.
          </p>
        </div>

        <button
          onClick={exportAllHistory}
          className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] text-xs font-medium flex items-center gap-2 self-start sm:self-auto transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export All ({investigations.length})</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl glass-panel space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by target, report ID, brand, or summary..."
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 pl-10 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60 transition-colors"
            />
          </div>

          <div className="flex gap-2">
            {/* Classification Filter */}
            <select
              value={classificationFilter}
              onChange={(e) => setClassificationFilter(e.target.value)}
              className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500/60 transition-colors"
            >
              <option value="all" className="bg-slate-900 text-white">All Classifications</option>
              <option value="CONFIRMED MALICIOUS" className="bg-slate-900 text-rose-400">Confirmed Malicious</option>
              <option value="HIGH RISK" className="bg-slate-900 text-orange-400">High Risk</option>
              <option value="SUSPICIOUS" className="bg-slate-900 text-amber-400">Suspicious</option>
              <option value="LOW RISK" className="bg-slate-900 text-emerald-400">Low Risk</option>
            </select>

            {/* Target Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500/60 transition-colors"
            >
              <option value="all" className="bg-slate-900 text-white">All Types</option>
              <option value="url" className="bg-slate-900 text-white">URLs</option>
              <option value="domain" className="bg-slate-900 text-white">Domains</option>
              <option value="message" className="bg-slate-900 text-white">Messages</option>
              <option value="email" className="bg-slate-900 text-white">Emails</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Stream */}
      <div className="rounded-2xl glass-panel overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <History className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-sm font-medium">No investigation records match your filter criteria.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {filtered.map((item) => {
              const badgeStyle = getBadgeStyle(item.classification);

              return (
                <div
                  key={item.investigation_id}
                  onClick={() => {
                    if (onSelectInvestigation) onSelectInvestigation(item);
                    if (setActiveView) setActiveView('investigate');
                  }}
                  className="p-4 sm:p-5 hover:bg-white/[0.02] transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono">
                      <span className="font-bold text-cyan-400">{item.investigation_id}</span>
                      <span className="text-slate-600">•</span>
                      <span className="uppercase text-[11px] px-2 py-0.5 rounded bg-white/5 text-slate-300 font-semibold">{item.target_type}</span>
                      <span className="text-slate-600">•</span>
                      <span className="tabular-nums text-slate-500">{new Date(item.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="text-sm sm:text-base font-semibold text-white truncate">
                      {item.target}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {item.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 self-end md:self-auto">
                    <div className="text-right">
                      <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full border ${badgeStyle}`}>
                        {item.classification}
                      </span>
                      <div className="text-[11px] font-mono text-slate-400 tabular-nums mt-1">
                        Risk Score: <span className="font-bold text-white">{item.risk_score}</span>/100
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectInvestigation) onSelectInvestigation(item);
                        if (setActiveView) setActiveView('investigate');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <span>Open Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
