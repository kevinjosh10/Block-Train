import React from 'react';
import Link from 'next/link';

export const DashboardHUD = ({ time }: { time: string }) => {
  return (
    <div className="absolute top-4 left-6 pointer-events-none flex flex-col gap-2 z-50">
      <Link href="/" className="pointer-events-auto hover:opacity-90 transition-opacity w-fit">
        <h1 className="text-2xl font-black tracking-tight text-white drop-shadow-sm flex items-center gap-2">
          <span>BLOCKTRAIN</span>
          <span className="text-xs font-mono text-blue-400 font-bold px-1.5 py-0.5 border border-blue-500/40 rounded">
            CORRIDOR DIGITAL TWIN
          </span>
        </h1>
      </Link>
      
      <div className="flex flex-wrap items-center gap-2 pointer-events-auto text-xs font-mono">
        <div className="text-slate-300 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 backdrop-blur-md flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>LIVE • {time}</span>
        </div>

        <div className="text-slate-300 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 backdrop-blur-md">
          <span>MAS–AJJ 73 KM • 19 STN</span>
        </div>

        <Link
          href="/ai-planner"
          className="text-blue-300 hover:text-white bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-blue-500 backdrop-blur-md transition-colors"
        >
          🧠 AI Planner
        </Link>
        <Link
          href="/rbms"
          className="text-amber-300 hover:text-white bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-amber-500 backdrop-blur-md transition-colors"
        >
          📅 RBMS
        </Link>
        <Link
          href="/maintenance"
          className="text-slate-300 hover:text-white bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-600 backdrop-blur-md transition-colors"
        >
          🚧 Possessions
        </Link>
        <Link
          href="/"
          className="text-slate-400 hover:text-white bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 backdrop-blur-md transition-colors"
        >
          ✕ Hub
        </Link>
      </div>
    </div>
  );
};
