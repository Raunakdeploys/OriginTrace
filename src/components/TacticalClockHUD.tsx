import React, { useState, useEffect } from 'react';
import { ShieldCheck, Activity, Globe, Wifi, Cpu } from 'lucide-react';

export const TacticalClockHUD: React.FC = () => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [seconds, setSeconds] = useState<string>('00');
  const [ampm, setAmpm] = useState<string>('PM');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const mins = now.getMinutes().toString().padStart(2, '0');
      const secs = now.getSeconds().toString().padStart(2, '0');
      const currentAmpm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const hoursStr = hours.toString().padStart(2, '0');

      setTimeStr(`${hoursStr}:${mins}`);
      setSeconds(secs);
      setAmpm(currentAmpm);

      const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      setDateStr(`${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate().toString().padStart(2, '0')}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-5 rounded-xl bg-gradient-to-br from-[#0c101a] to-[#07090e] border border-[#1b253b] relative overflow-hidden flex flex-col justify-between shadow-lg">
      {/* Subtle Matrix Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Top Meta Line */}
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-1.5 text-cyan-400 font-semibold tracking-wider">
          <Globe className="w-3.5 h-3.5" />
          <span>CYBER COMMAND DEFENSE HUD</span>
        </div>
        <div className="flex items-center gap-1 text-slate-500 text-[10px]">
          <span>LATENCY:</span>
          <span className="text-emerald-400 font-bold">14ms</span>
        </div>
      </div>

      {/* Big Digital LED Clock (M.O.N.K.Y Style) */}
      <div className="my-3 flex items-baseline gap-2">
        <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-slate-100 tabular-nums">
          {timeStr || '12:01'}
        </span>
        <div className="flex flex-col text-xs font-mono font-bold leading-tight">
          <span className="text-cyan-400">{seconds}</span>
          <span className="text-slate-400 text-[10px]">{ampm}</span>
        </div>
      </div>

      {/* Date & Node Location */}
      <div className="space-y-1 font-mono text-xs border-t border-slate-800/80 pt-2.5">
        <div className="flex items-center justify-between text-slate-300">
          <span className="font-semibold text-slate-200">{dateStr}</span>
          <span className="text-cyan-400 text-[10px]">UTC-8 PERIMETER</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>THREAT SURVEILLANCE</span>
          <span className="text-emerald-400 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> SHIELD ACTIVE
          </span>
        </div>
      </div>

      {/* Sub-Metric Tags */}
      <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-800/60 text-[10px] font-mono">
        <div className="p-1.5 rounded bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
          <span className="text-slate-500">GUARD BOTS:</span>
          <span className="text-cyan-300 font-bold">124 / 124</span>
        </div>
        <div className="p-1.5 rounded bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
          <span className="text-slate-500">FIREWALL:</span>
          <span className="text-emerald-400 font-bold">100% ARMED</span>
        </div>
      </div>
    </div>
  );
};
