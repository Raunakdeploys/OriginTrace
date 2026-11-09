import React, { useState } from 'react';
import { Activity, TrendingUp, ShieldAlert, GitCompare } from 'lucide-react';

export const ThreatRadarChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'WEEK' | 'MONTH' | 'YEAR'>('WEEK');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Timeframe datasets
  const dataMap = {
    WEEK: {
      labels: ['06/02', '07/02', '08/02', '09/02', '10/02', '11/02', '12/02'],
      ingestion: [120, 185, 140, 290, 210, 310, 260],
      blocked: [45, 80, 55, 140, 95, 160, 110],
      drift: [15, 30, 20, 50, 40, 65, 35]
    },
    MONTH: {
      labels: ['W1', 'W2', 'W3', 'W4', 'W5'],
      ingestion: [820, 1150, 980, 1420, 1260],
      blocked: [320, 540, 410, 680, 590],
      drift: [90, 160, 120, 210, 180]
    },
    YEAR: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      ingestion: [3400, 4800, 5200, 6100],
      blocked: [1400, 2100, 2300, 2900],
      drift: [410, 630, 720, 890]
    }
  };

  const current = dataMap[timeframe];
  const maxVal = Math.max(...current.ingestion) * 1.15;
  const height = 180;
  const width = 500;

  // Convert points to SVG polyline strings
  const getPoints = (values: number[]) => {
    return values.map((val, idx) => {
      const x = (idx / (values.length - 1)) * (width - 40) + 20;
      const y = height - (val / maxVal) * (height - 30) - 10;
      return `${x},${y}`;
    }).join(' ');
  };

  const getAreaPath = (values: number[]) => {
    const points = values.map((val, idx) => {
      const x = (idx / (values.length - 1)) * (width - 40) + 20;
      const y = height - (val / maxVal) * (height - 30) - 10;
      return { x, y };
    });
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x} ${points[i].y}`;
    }
    d += ` L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;
    return d;
  };

  return (
    <div className="p-5 rounded-xl bg-gradient-to-b from-[#0c101a] to-[#07090e] border border-[#1b253b] flex flex-col justify-between shadow-lg">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono tracking-wider uppercase text-cyan-400 font-semibold">
              [!] SURVEILLANCE ACTIVITY & DRIFT VELOCITY
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            Cross-engine telemetry for URL, email phishing, and DNS mutations
          </div>
        </div>

        {/* Time Filter Pills */}
        <div className="flex items-center gap-1 p-1 bg-slate-950/80 rounded-lg border border-slate-800 text-[11px] font-mono shrink-0">
          {(['WEEK', 'MONTH', 'YEAR'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                timeframe === t
                  ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/80 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas Area Chart */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-44 overflow-visible"
        >
          <defs>
            <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00ff88" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#00ff88" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffaa00" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ffaa00" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="20" y1={height * 0.25} x2={width - 20} y2={height * 0.25} stroke="#1b253b" strokeDasharray="3,3" />
          <line x1="20" y1={height * 0.5} x2={width - 20} y2={height * 0.5} stroke="#1b253b" strokeDasharray="3,3" />
          <line x1="20" y1={height * 0.75} x2={width - 20} y2={height * 0.75} stroke="#1b253b" strokeDasharray="3,3" />

          {/* Area Fills */}
          <path d={getAreaPath(current.ingestion)} fill="url(#cyanGrad)" />
          <path d={getAreaPath(current.blocked)} fill="url(#emeraldGrad)" />
          <path d={getAreaPath(current.drift)} fill="url(#amberGrad)" />

          {/* Lines */}
          <polyline
            fill="none"
            stroke="#00f0ff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={getPoints(current.ingestion)}
          />
          <polyline
            fill="none"
            stroke="#00ff88"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={getPoints(current.blocked)}
          />
          <polyline
            fill="none"
            stroke="#ffaa00"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="4,2"
            points={getPoints(current.drift)}
          />

          {/* Interactive Data Dots */}
          {current.ingestion.map((val, idx) => {
            const x = (idx / (current.ingestion.length - 1)) * (width - 40) + 20;
            const y = height - (val / maxVal) * (height - 30) - 10;
            const isHovered = hoveredIndex === idx;
            return (
              <g key={idx} onMouseEnter={() => setHoveredIndex(idx)} onMouseLeave={() => setHoveredIndex(null)}>
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 5 : 3.5}
                  className="fill-cyan-400 stroke-slate-950 transition-all cursor-pointer"
                  strokeWidth="2"
                />
              </g>
            );
          })}
        </svg>

        {/* X Axis Labels */}
        <div className="flex justify-between px-4 pt-2 text-[10px] font-mono text-slate-500">
          {current.labels.map((lbl, idx) => (
            <span key={idx} className={hoveredIndex === idx ? 'text-cyan-400 font-bold' : ''}>
              {lbl}
            </span>
          ))}
        </div>
      </div>

      {/* Chart Footer Legends & Live Rate */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-slate-300">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f0ff]" />
            <span>INGESTION</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#00ff88]" />
            <span>BLOCKED SCAMS</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_#ffaa00]" />
            <span>DRIFT ALERTS</span>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>VELOCITY: <strong className="text-slate-200">+18.4%</strong> VS BASELINE</span>
        </div>
      </div>
    </div>
  );
};
