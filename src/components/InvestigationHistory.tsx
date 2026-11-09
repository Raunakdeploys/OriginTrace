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
  MessageSquare
} from 'lucide-react';
import { UnifiedInvestigationResult, VerdictClassification, TargetType } from '../types/investigation';

interface InvestigationHistoryProps {
  investigations: UnifiedInvestigationResult[];
  onSelectInvestigation: (item: UnifiedInvestigationResult) => void;
  onClearHistory: () => void;
  setActiveView: (view: string) => void;
}

export const InvestigationHistory: React.FC<InvestigationHistoryProps> = ({
  investigations,
  onSelectInvestigation,
  onClearHistory,
  setActiveView
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [classificationFilter, setClassificationFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered = investigations.filter((item) => {
    const matchesSearch = 
      item.investigation_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase());

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
    <div className="flex-1 overflow-y-auto p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-mono uppercase tracking-wider text-cyan-400">
            Case Archive & Audit Trail
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Investigation History
          </h1>
          <p className="text-xs text-slate-400">
            Comprehensive archive of historical investigations, extracted indicators, and cryptographic certificates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportAllHistory}
            className="px-3.5 py-1.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Archive</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by target, report ID, brand, or summary..."
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 pl-9 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Classification Filter */}
          <select
            value={classificationFilter}
            onChange={(e) => setClassificationFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Classifications</option>
            <option value="CONFIRMED MALICIOUS">Confirmed Malicious</option>
            <option value="HIGH RISK">High Risk</option>
            <option value="SUSPICIOUS">Suspicious</option>
            <option value="LOW RISK">Low Risk</option>
          </select>

          {/* Target Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Target Types</option>
            <option value="url">URLs</option>
            <option value="domain">Domains</option>
            <option value="message">Messages</option>
            <option value="email">Emails</option>
          </select>
        </div>
      </div>

      {/* History Stream */}
      <div className="rounded-lg bg-slate-900 border border-slate-800 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <History className="w-8 h-8 mx-auto text-slate-600" />
            <p className="text-xs">No investigation records match your search criteria.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {filtered.map((item) => {
              const isMalicious = item.classification === 'CONFIRMED MALICIOUS' || item.classification === 'HIGH RISK';
              const isSuspicious = item.classification === 'SUSPICIOUS';

              return (
                <div
                  key={item.investigation_id}
                  onClick={() => {
                    onSelectInvestigation(item);
                    setActiveView('investigate');
                  }}
                  className="p-4 hover:bg-slate-850/80 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                      <span>{item.investigation_id}</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{item.target_type}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{new Date(item.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-200 truncate">
                      {item.target}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {item.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className={`text-xs font-bold ${
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
                        setActiveView('investigate');
                      }}
                      className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                    >
                      Open Case
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
