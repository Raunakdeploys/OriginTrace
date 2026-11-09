import React, { useState } from 'react';
import { Network, Filter, ZoomIn, ZoomOut, RotateCcw, ExternalLink } from 'lucide-react';

export const IdentityGraph = ({
  currentReport = null,
  allReports = [],
  onSelectReport = () => {},
  setActiveView = () => {}
}) => {
  const activeReport = currentReport || allReports[0];
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [zoom, setZoom] = useState(1);

  if (!activeReport) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <Network className="w-12 h-12 mb-3 text-slate-600" />
        <h2 className="text-base font-semibold text-slate-200">No Target Selected</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          Run an investigation to view its correlated Digital Identity Graph.
        </p>
        <button
          onClick={() => setActiveView('investigate')}
          className="mt-4 px-4 py-2 bg-cyan-500 text-slate-950 rounded-xl text-xs font-bold hover:bg-cyan-400 cursor-pointer"
        >
          Open Interrogator
        </button>
      </div>
    );
  }

  const rawNodes = activeReport.identity_graph.nodes || [];
  const rawEdges = activeReport.identity_graph.edges || [];

  const filteredNodes = typeFilter === 'all' 
    ? rawNodes 
    : rawNodes.filter(n => n.type === typeFilter);

  const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
  const filteredEdges = rawEdges.filter(
    e => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target)
  );

  const centerX = 360;
  const centerY = 240;
  const radius = 160;

  const nodePositions = {};
  filteredNodes.forEach((node, idx) => {
    if (idx === 0) {
      nodePositions[node.id] = { x: centerX, y: centerY };
    } else {
      const angle = ((idx - 1) / Math.max(1, filteredNodes.length - 1)) * 2 * Math.PI;
      nodePositions[node.id] = {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius
      };
    }
  });

  const getNodeColor = (type, severity) => {
    if (severity === 'critical') return '#f43f5e';
    if (severity === 'high') return '#fb7185';
    if (type === 'brand') return '#c084fc';
    if (type === 'domain') return '#38bdf8';
    if (type === 'ip_address') return '#fbbf24';
    if (type === 'tls_cert') return '#34d399';
    return '#94a3b8';
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div className="space-y-1">
          <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            Correlated Network Topology
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-heading">
            Digital Identity Graph
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Every edge in the Identity Graph represents a verified evidence relationship. A shared IP or CDN does not prove common malicious ownership.
          </p>
        </div>

        {/* Case Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500">Case:</span>
          <select
            value={activeReport.investigation_id}
            onChange={(e) => {
              const found = allReports.find(r => r.investigation_id === e.target.value);
              if (found) onSelectReport(found);
            }}
            className="p-2 rounded-xl glass-subtle text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
          >
            {allReports.map((r) => (
              <option key={r.investigation_id} value={r.investigation_id} className="bg-slate-900 text-white">
                {r.investigation_id} ({r.target.slice(0, 24)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Graph Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[480px]">
        {/* Canvas Area */}
        <div className="lg:col-span-3 rounded-3xl glass-panel flex flex-col relative overflow-hidden">
          {/* Controls Bar */}
          <div className="p-3 border-b border-white/[0.08] flex items-center justify-between z-10">
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="text-slate-500 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Filter:
              </span>
              {['all', 'domain', 'brand', 'ip_address', 'tls_cert'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                    typeFilter === t ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t === 'all' ? 'All' : t.replace('_', ' ').toUpperCase()}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={() => setZoom(z => Math.max(0.6, z - 0.1))}
                className="p-1.5 rounded-lg glass-subtle hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono tabular-nums px-1 text-slate-500">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(z => Math.min(1.6, z + 0.1))}
                className="p-1.5 rounded-lg glass-subtle hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="p-1.5 rounded-lg glass-subtle hover:text-white ml-1"
                title="Reset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
            <svg
              viewBox="0 0 720 480"
              className="w-full h-full max-h-[500px]"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.15s ease' }}
            >
              <defs>
                <marker
                  id="arrow-minimal"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#475569" />
                </marker>
              </defs>

              {/* Edge Lines */}
              {filteredEdges.map((e) => {
                const sPos = nodePositions[e.source];
                const tPos = nodePositions[e.target];
                if (!sPos || !tPos) return null;
                const isSelected = selectedEdge?.id === e.id;

                return (
                  <g key={e.id} onClick={() => { setSelectedEdge(e); setSelectedNode(null); }} className="cursor-pointer">
                    <line
                      x1={sPos.x}
                      y1={sPos.y}
                      x2={tPos.x}
                      y2={tPos.y}
                      stroke={isSelected ? '#38bdf8' : 'rgba(255,255,255,0.12)'}
                      strokeWidth={isSelected ? 2.5 : 1.2}
                      markerEnd="url(#arrow-minimal)"
                    />
                  </g>
                );
              })}

              {/* Nodes */}
              {filteredNodes.map((node) => {
                const pos = nodePositions[node.id];
                if (!pos) return null;
                const color = getNodeColor(node.type, node.severity);
                const isSelected = selectedNode?.id === node.id;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onClick={() => { setSelectedNode(node); setSelectedEdge(null); }}
                    className="cursor-pointer group"
                  >
                    <circle
                      r={isSelected ? 18 : 13}
                      fill="#0f172a"
                      stroke={color}
                      strokeWidth={isSelected ? 3 : 2}
                      className="transition-all"
                    />
                    <text
                      y={26}
                      textAnchor="middle"
                      fill="#e2e8f0"
                      fontSize="10"
                      fontFamily="JetBrains Mono, monospace"
                      className="select-none font-medium pointer-events-none"
                    >
                      {node.label.length > 20 ? node.label.slice(0, 18) + '...' : node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Node Inspector Panel */}
        <div className="p-5 rounded-3xl glass-panel flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 pb-2 border-b border-white/[0.08]">
              Inspector Detail
            </div>

            {selectedNode && (
              <div className="space-y-3 text-xs font-mono">
                <div>
                  <div className="text-slate-500">Node Identifier</div>
                  <div className="font-semibold text-white break-all mt-0.5">{selectedNode.label}</div>
                </div>
                <div>
                  <div className="text-slate-500">Type</div>
                  <div className="text-cyan-400 uppercase mt-0.5">{selectedNode.type}</div>
                </div>
                <div>
                  <div className="text-slate-500">Risk Assessment</div>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mt-1 ${
                    selectedNode.severity === 'critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                    selectedNode.severity === 'high' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {selectedNode.severity || 'Normal'}
                  </span>
                </div>
              </div>
            )}

            {selectedEdge && (
              <div className="space-y-3 text-xs font-mono">
                <div>
                  <div className="text-slate-500">Relationship</div>
                  <div className="font-semibold text-cyan-300 mt-0.5">{selectedEdge.relationship}</div>
                </div>
                <div>
                  <div className="text-slate-500">Evidence Provenance</div>
                  <div className="text-slate-200 mt-0.5 font-sans leading-relaxed">{selectedEdge.evidenceSource}</div>
                </div>
              </div>
            )}

            {!selectedNode && !selectedEdge && (
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Click any node or relationship link on the graph to inspect evidence and underlying DNS/TLS bindings.
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-white/[0.08] text-[11px] text-slate-500 font-mono">
            {filteredNodes.length} Nodes · {filteredEdges.length} Verified Links
          </div>
        </div>
      </div>
    </div>
  );
};
