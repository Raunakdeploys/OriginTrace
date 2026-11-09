import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Download, 
  ArrowRight
} from 'lucide-react';

export const InvestigationHistory = ({
  investigations = [],
  onSelectInvestigation,
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

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.07]">
        <div className="space-y-1">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-500">
            Case Archive & Forensic Dossier Log
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white font-heading">
            Investigation Archive
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            Comprehensive archive of historical investigations, extracted indicators, and cryptographic certificates.
          </p>
        </div>

        <button
          type="button"
          onClick={exportAllHistory}
          className="px-4 py-2.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.08] text-xs font-medium flex items-center gap-2 self-start sm:self-auto transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Export All ({investigations.length})</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl panel space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by target, report ID, brand, or summary..."
              className="w-full bg-black/40 border border-white/[0.08] rounded-lg px-4 py-2.5 pl-10 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-white/30 transition-colors font-mono"
            />
          </div>

          <div className="flex gap-2">
            {/* Classification Filter */}
            <select
              value={classificationFilter}
              onChange={(e) => setClassificationFilter(e.target.value)}
              className="bg-black/40 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-white/30 transition-colors"
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
              className="bg-black/40 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-white/30 transition-colors"
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
      <div className="rounded-2xl panel overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <History className="w-8 h-8 mx-auto text-slate-600" />
            <p className="text-sm font-medium">No investigation records match your filter criteria.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {filtered.map((item) => {
              return (
                <div
                  key={item.investigation_id}
                  onClick={() => {
                    if (onSelectInvestigation) onSelectInvestigation(item);
                    if (setActiveView) setActiveView('investigate');
                  }}
                  className="p-5 hover:bg-white/[0.02] transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono">
                      <span className="font-semibold text-slate-300">{item.investigation_id}</span>
                      <span aria-hidden="true" className="text-slate-700">·</span>
                      <span className="uppercase text-slate-400">{item.target_type}</span>
                      <span aria-hidden="true" className="text-slate-700">·</span>
                      <span className="tabular-nums">{new Date(item.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="text-sm sm:text-base font-medium text-white truncate">
                      {item.target}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1 font-sans">
                      {item.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-5 shrink-0 self-end md:self-auto">
                    <div className="text-right font-mono">
                      <div className={`text-xs font-semibold uppercase ${
                        item.classification === 'CONFIRMED MALICIOUS' || item.classification === 'HIGH RISK' ? 'text-rose-400' :
                        item.classification === 'SUSPICIOUS' ? 'text-amber-400' :
                        'text-emerald-400'
                      }`}>
                        {item.classification}
                      </div>
                      <div className="text-xs text-slate-500 tabular-nums mt-0.5">
                        Risk {item.risk_score} / 100
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectInvestigation) onSelectInvestigation(item);
                        if (setActiveView) setActiveView('investigate');
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/[0.08] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Open Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
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
