import React, { useState } from 'react';
import { Network, Filter, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

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
        <Network className="w-10 h-10 mb-3 text-slate-600" />
        <h2 className="text-base font-semibold text-slate-200">No Target Selected</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          Run an investigation to view its correlated Digital Identity Graph.
        </p>
        <button
          type="button"
          onClick={() => setActiveView('investigate')}
          className="mt-4 px-4 py-2 bg-white text-slate-950 rounded-lg text-xs font-medium hover:bg-slate-200 cursor-pointer transition-colors"
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
    if (severity === 'critical') return '#f43f5e'; // rose-500
    if (severity === 'high') return '#fb923c';     // orange-400
    if (type === 'brand') return '#a5b4fc';        // indigo-300
    if (type === 'domain') return '#94a3b8';       // slate-400
    if (type === 'ip_address') return '#fbbf24';   // amber-400
    if (type === 'tls_cert') return '#34d399';     // emerald-400
    return '#64748b';
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-6 lg:p-10 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.07]">
        <div className="space-y-1">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-500">
            Network Topology & Provenance
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white font-heading">
            Digital Identity Graph
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
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
            className="p-2 rounded-lg bg-black/40 border border-white/[0.08] text-xs text-white font-mono focus:outline-none focus:border-white/30"
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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[500px]">
        {/* Canvas Area */}
        <div className="lg:col-span-3 rounded-2xl panel flex flex-col relative overflow-hidden">
          {/* Controls Bar */}
          <div className="p-3 border-b border-white/[0.07] flex items-center justify-between z-10 bg-black/20">
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="text-slate-500 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Filter:
              </span>
              {['all', 'domain', 'brand', 'ip_address', 'tls_cert'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTypeFilter(t)}
                  className={`px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                    typeFilter === t ? 'bg-white text-slate-950 font-medium' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t === 'all' ? 'All' : t.replace('_', ' ').toUpperCase()}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                type="button"
                onClick={() => setZoom(z => Math.max(0.6, z - 0.1))}
                className="p-1.5 rounded-md hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-mono tabular-nums px-1 text-slate-500">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoom(z => Math.min(1.6, z + 0.1))}
                className="p-1.5 rounded-md hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoom(1)}
                className="p-1.5 rounded-md hover:bg-white/[0.06] hover:text-white ml-1 transition-colors cursor-pointer"
                title="Reset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="flex-1 flex items-center justify-center p-4 overflow-auto bg-black/10">
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
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#64748b" />
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
                      stroke={isSelected ? '#f8fafc' : 'rgba(255,255,255,0.14)'}
                      strokeWidth={isSelected ? 2 : 1}
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
                      r={isSelected ? 16 : 12}
                      fill="#11141a"
                      stroke={isSelected ? '#ffffff' : color}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      className="transition-all"
                    />
                    <text
                      y={24}
                      textAnchor="middle"
                      fill="#cbd5e1"
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
        <div className="p-6 rounded-2xl panel flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 pb-2 border-b border-white/[0.07]">
              Inspector Detail
            </div>

            {selectedNode && (
              <div className="space-y-3 text-xs font-mono">
                <div>
                  <div className="text-slate-500">Node Identifier</div>
                  <div className="font-medium text-white break-all mt-0.5">{selectedNode.label}</div>
                </div>
                <div>
                  <div className="text-slate-500">Type</div>
                  <div className="text-slate-300 uppercase mt-0.5">{selectedNode.type}</div>
                </div>
                <div>
                  <div className="text-slate-500">Risk Assessment</div>
                  <div className={`mt-0.5 font-bold uppercase ${
                    selectedNode.severity === 'critical' ? 'text-rose-400' :
                    selectedNode.severity === 'high' ? 'text-orange-400' :
                    'text-slate-300'
                  }`}>
                    {selectedNode.severity || 'Normal'}
                  </div>
                </div>
              </div>
            )}

            {selectedEdge && (
              <div className="space-y-3 text-xs font-mono">
                <div>
                  <div className="text-slate-500">Relationship</div>
                  <div className="font-medium text-white mt-0.5">{selectedEdge.relationship}</div>
                </div>
                <div>
                  <div className="text-slate-500">Evidence Provenance</div>
                  <div className="text-slate-300 mt-0.5 font-sans leading-relaxed">{selectedEdge.evidenceSource}</div>
                </div>
              </div>
            )}

            {!selectedNode && !selectedEdge && (
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Click any node or relationship link on the graph to inspect evidence and underlying DNS/TLS bindings.
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-white/[0.07] text-xs text-slate-500 font-mono">
            {filteredNodes.length} Nodes · {filteredEdges.length} Verified Links
          </div>
        </div>
      </div>
    </div>
  );
};
