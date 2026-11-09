import React, { useState } from 'react';
import { 
  Network, 
  ShieldAlert, 
  ExternalLink, 
  Info, 
  Filter, 
  Maximize2, 
  ZoomIn, 
  ZoomOut,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { UnifiedInvestigationResult, GraphNode, GraphEdge } from '../types/investigation';

interface IdentityGraphProps {
  currentReport: UnifiedInvestigationResult | null;
  allReports: UnifiedInvestigationResult[];
  onSelectReport: (report: UnifiedInvestigationResult) => void;
  setActiveView: (view: string) => void;
}

export const IdentityGraph: React.FC<IdentityGraphProps> = ({
  currentReport,
  allReports,
  onSelectReport,
  setActiveView
}) => {
  const activeReport = currentReport || allReports[0];
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<GraphEdge | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [zoom, setZoom] = useState<number>(1);

  if (!activeReport) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
        <Network className="w-12 h-12 mb-3 text-slate-600" />
        <h2 className="text-base font-semibold text-slate-300">No Investigation Selected</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          Run an investigation or select a sample report to inspect its Digital Identity Graph.
        </p>
        <button
          onClick={() => setActiveView('investigate')}
          className="mt-4 px-4 py-2 bg-cyan-400 text-slate-900 rounded-md text-xs font-semibold hover:bg-cyan-300 cursor-pointer"
        >
          Open Investigation Workspace
        </button>
      </div>
    );
  }

  const rawNodes = activeReport.identity_graph.nodes;
  const rawEdges = activeReport.identity_graph.edges;

  const filteredNodes = typeFilter === 'all' 
    ? rawNodes 
    : rawNodes.filter(n => n.type === typeFilter);

  const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
  const filteredEdges = rawEdges.filter(
    e => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target)
  );

  // Position nodes in an organic circular/hub distribution around center
  const centerX = 360;
  const centerY = 240;
  const radius = 170;

  const nodePositions: Record<string, { x: number; y: number }> = {};
  filteredNodes.forEach((node, idx) => {
    if (idx === 0) {
      // Hub center
      nodePositions[node.id] = { x: centerX, y: centerY };
    } else {
      const angle = ((idx - 1) / Math.max(1, filteredNodes.length - 1)) * 2 * Math.PI;
      nodePositions[node.id] = {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius
      };
    }
  });

  const getNodeColor = (type: GraphNode['type'], severity?: string) => {
    if (severity === 'critical') return '#f43f5e'; // rose-500
    if (severity === 'high') return '#fb7185'; // rose-400
    if (type === 'brand') return '#c084fc'; // purple-400
    if (type === 'domain') return '#22d3ee'; // cyan-400
    if (type === 'ip_address') return '#fbbf24'; // amber-400
    if (type === 'tls_cert') return '#34d399'; // emerald-400
    if (type === 'dns_record') return '#60a5fa'; // blue-400
    return '#94a3b8'; // slate-400
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-mono uppercase tracking-wider text-cyan-400">
            Differentiator A · Evidence-Linked Graph
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Digital Identity Graph
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Every edge in the Digital Identity Graph represents an evidence-proven connection. A shared IP address or hosting provider does not prove common ownership.
          </p>
        </div>

        {/* Case Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Case:</span>
          <select
            value={activeReport.investigation_id}
            onChange={(e) => {
              const found = allReports.find(r => r.investigation_id === e.target.value);
              if (found) onSelectReport(found);
            }}
            className="bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
          >
            {allReports.map((r) => (
              <option key={r.investigation_id} value={r.investigation_id}>
                {r.investigation_id} ({r.target.slice(0, 30)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Graph Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-[500px]">
        {/* Canvas Area */}
        <div className="lg:col-span-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-col relative overflow-hidden">
          {/* Canvas Toolbar */}
          <div className="p-3 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between z-10">
            {/* Filter pills */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Filter:
              </span>
              {['all', 'domain', 'brand', 'ip_address', 'tls_cert'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    typeFilter === t ? 'bg-slate-800 text-cyan-400 border border-slate-700' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t === 'all' ? 'All Nodes' : t.replace('_', ' ').toUpperCase()}
                </button>
              ))}
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={() => setZoom(z => Math.max(0.6, z - 0.1))}
                className="p-1 rounded hover:bg-slate-800 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono tabular-nums px-1 text-slate-500">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(z => Math.min(1.6, z + 0.1))}
                className="p-1 rounded hover:bg-slate-800 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="p-1 rounded hover:bg-slate-800 transition-colors ml-1"
                title="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SVG Visualizer */}
          <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
            <svg
              viewBox="0 0 720 480"
              className="w-full h-full max-h-[520px]"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.15s ease' }}
            >
              {/* Defs for arrowheads */}
              <defs>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
                </marker>
                <marker
                  id="arrow-active"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#22d3ee" />
                </marker>
              </defs>

              {/* Render Edges */}
              {filteredEdges.map((edge) => {
                const sPos = nodePositions[edge.source];
                const tPos = nodePositions[edge.target];
                if (!sPos || !tPos) return null;

                const isSelected = selectedEdge?.id === edge.id;

                return (
                  <g key={edge.id} className="cursor-pointer" onClick={() => { setSelectedEdge(edge); setSelectedNode(null); }}>
                    <line
                      x1={sPos.x}
                      y1={sPos.y}
                      x2={tPos.x}
                      y2={tPos.y}
                      stroke={isSelected ? '#22d3ee' : '#334155'}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      strokeDasharray={edge.relationship === 'impersonates' ? '4 3' : undefined}
                      markerEnd={isSelected ? 'url(#arrow-active)' : 'url(#arrow)'}
                    />
                    {/* Edge Label text in center */}
                    <text
                      x={(sPos.x + tPos.x) / 2}
                      y={(sPos.y + tPos.y) / 2 - 6}
                      fill={isSelected ? '#22d3ee' : '#64748b'}
                      fontSize="9"
                      fontFamily="JetBrains Mono, monospace"
                      textAnchor="middle"
                    >
                      {edge.relationship}
                    </text>
                  </g>
                );
              })}

              {/* Render Nodes */}
              {filteredNodes.map((node) => {
                const pos = nodePositions[node.id];
                if (!pos) return null;
                const isSelected = selectedNode?.id === node.id;
                const color = getNodeColor(node.type, node.severity);

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer"
                    onClick={() => { setSelectedNode(node); setSelectedEdge(null); }}
                  >
                    {/* Glow ring if selected */}
                    {isSelected && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="24"
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                        strokeOpacity="0.5"
                      />
                    )}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="16"
                      fill="#0f172a"
                      stroke={color}
                      strokeWidth={isSelected ? '3' : '2'}
                    />
                    <text
                      x={pos.x}
                      y={pos.y + 28}
                      fill="#e2e8f0"
                      fontSize="10"
                      fontFamily="Plus Jakarta Sans, sans-serif"
                      fontWeight="600"
                      textAnchor="middle"
                    >
                      {node.label.length > 22 ? node.label.slice(0, 22) + '...' : node.label}
                    </text>
                    <text
                      x={pos.x}
                      y={pos.y + 38}
                      fill="#64748b"
                      fontSize="8"
                      fontFamily="JetBrains Mono, monospace"
                      textAnchor="middle"
                    >
                      [{node.type.toUpperCase()}]
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Inspector Panel */}
        <div className="rounded-lg bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300 pb-2 border-b border-slate-800">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>Inspector Panel</span>
            </div>

            {selectedNode ? (
              <div className="space-y-3 font-mono text-xs">
                <div className="space-y-1">
                  <div className="text-slate-500">ENTITY ID</div>
                  <div className="text-slate-200 font-semibold break-all">{selectedNode.id}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-slate-500">LABEL</div>
                  <div className="text-slate-200 break-all">{selectedNode.label}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-slate-500">CATEGORY TYPE</div>
                  <div className="text-cyan-400 uppercase">{selectedNode.type}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-slate-500">SEVERITY CONTEXT</div>
                  <div className="text-rose-400 uppercase">{selectedNode.severity || 'INFO'}</div>
                </div>
              </div>
            ) : selectedEdge ? (
              <div className="space-y-3 font-mono text-xs">
                <div className="space-y-1">
                  <div className="text-slate-500">RELATIONSHIP</div>
                  <div className="text-cyan-400 font-semibold">{selectedEdge.relationship}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-slate-500">SOURCE NODE</div>
                  <div className="text-slate-200 break-all">{selectedEdge.source}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-slate-500">TARGET NODE</div>
                  <div className="text-slate-200 break-all">{selectedEdge.target}</div>
                </div>
                <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-slate-400 font-sans font-medium">Verified Evidence Source:</div>
                  <div className="text-slate-200 leading-relaxed font-mono text-[11px]">
                    {selectedEdge.evidenceSource}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 leading-relaxed space-y-2">
                <p>Click on any node or edge in the graph canvas to inspect its digital identity relationship and mandatory evidence source.</p>
                <div className="p-3 rounded bg-slate-950 border border-slate-800/80 space-y-1 text-[11px] font-mono">
                  <div className="text-slate-400 font-sans font-semibold">Graph Discipline:</div>
                  <p className="text-slate-500">Every link is backed by deterministic evidence (DNS, TLS SAN, Levenshtein, HTTP Location, DOM actions).</p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] font-mono text-slate-500 flex items-center justify-between">
            <span>Nodes: {filteredNodes.length}</span>
            <span>Edges: {filteredEdges.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
