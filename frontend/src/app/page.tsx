'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [glitchPhase, setGlitchPhase] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setGlitchPhase(Math.random() * 3);
        setTimeout(() => setGlitchPhase(0), 100);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-full bg-black text-white font-sans overflow-hidden relative flex flex-col items-center justify-center selection:bg-red-500/30">
      
      {/* Background Speeding Tracks */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-40 perspective-[1000px]"
        style={{
          transform: `rotateY(${mousePosition.x * 5}deg) rotateX(${mousePosition.y * 5}deg)`,
          transformStyle: 'preserve-3d'
        }}
      >
        <div 
          className="absolute inset-[-100%] animate-[speedingTracks_0.5s_linear_infinite]"
          style={{
            backgroundImage: `
              linear-gradient(to right, transparent 30%, #555 30%, #555 32%, transparent 32%, transparent 68%, #555 68%, #555 70%, transparent 70%),
              linear-gradient(to bottom, transparent 90%, #222 90%, #222 100%)
            `,
            backgroundSize: '200px 200px',
            transform: 'rotateX(75deg) translateZ(-200px)',
            transformOrigin: 'center center'
          }}
        />
      </div>
      
      {/* Overlay to fade out tracks in the distance */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none" />

      {/* Scanning Line */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="w-full h-1 bg-red-500/50 shadow-[0_0_40px_10px_rgba(255,0,0,0.5)] animate-[scan_4s_linear_infinite]" />
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(-100px); }
          100% { transform: translateY(120vh); }
        }
        @keyframes flow {
          0% { background-position: 0% center; }
          100% { background-position: -200% center; }
        }
        @keyframes speedingTracks {
          0% { background-position: 0px 0px; }
          100% { background-position: 0px 200px; }
        }
        .glitch-1 { clip-path: inset(20% 0 80% 0); transform: translate(-5px, 5px); }
        .glitch-2 { clip-path: inset(60% 0 10% 0); transform: translate(5px, -5px); }
        .glitch-3 { clip-path: inset(40% 0 50% 0); transform: translate(-5px, -2px); }
      `}} />

      {/* Main Title */}
      <div className="relative z-10 text-center mb-16 select-none">
        <div className="text-[10px] md:text-sm text-red-500 font-mono tracking-[0.5em] mb-4 uppercase">
          Southern Railway Command
        </div>
        
        <div className="relative inline-block">
          <h1 className={`text-7xl md:text-[120px] font-black tracking-tighter uppercase leading-none mix-blend-difference bg-clip-text text-transparent bg-[linear-gradient(to_right,#ffffff,#ffffff,#ef4444,#ffffff,#ffffff)] bg-[length:200%_auto] animate-[flow_3s_linear_infinite] ${glitchPhase > 1 ? 'opacity-0' : 'opacity-100'}`}>
            BlockTrain
          </h1>
          {glitchPhase > 0 && (
            <>
              <h1 className={`absolute top-0 left-0 text-7xl md:text-[120px] font-black tracking-tighter uppercase leading-none text-cyan-400 mix-blend-screen ${glitchPhase > 1 ? 'glitch-1' : 'glitch-2'}`}>
                BlockTrain
              </h1>
              <h1 className={`absolute top-0 left-0 text-7xl md:text-[120px] font-black tracking-tighter uppercase leading-none text-red-500 mix-blend-screen ${glitchPhase > 2 ? 'glitch-3' : 'glitch-1'}`}>
                BlockTrain
              </h1>
            </>
          )}
        </div>
        
        <p className="mt-8 max-w-2xl mx-auto text-sm md:text-base text-zinc-400 font-mono tracking-widest leading-relaxed px-4">
          CENTRALIZED BLOCK PLANNING & COMMAND
        </p>
      </div>

      {/* Links Grid */}
      <div className="relative z-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 w-full max-w-7xl px-6" style={{ perspective: '1000px' }}>
        
        {/* RBMS Suite Link */}
        <Link 
          href="/rbms"
          className="group relative bg-[#050505] border border-amber-900/40 p-6 hover:bg-black transition-all duration-300 shadow-2xl"
          style={{
            transform: `rotateY(${mousePosition.x * 4}deg) rotateX(${mousePosition.y * -4}deg)`,
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
          
          <div className="relative" style={{ transform: 'translateZ(20px)' }}>
            <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-1 font-bold">
              SOUTHERN RAILWAY // RBP
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 text-white group-hover:text-amber-400 transition-colors">
              RBMS Suite
            </h2>
            <div className="h-[2px] w-12 bg-zinc-800 mb-6 group-hover:bg-amber-400 group-hover:w-full transition-all duration-500" />
            <p className="text-zinc-500 font-mono text-xs mb-8 leading-relaxed">
              &gt; 14-day rolling schedule<br/>
              &gt; joint vetting &amp; requisition<br/>
              &gt; controller desk &amp; burst alert
            </p>
            <div className="flex justify-between items-center text-xs font-mono font-bold tracking-widest text-zinc-700 group-hover:text-white transition-colors">
              <span>OPEN DASHBOARD</span>
              <span className="text-amber-400 font-black">&rarr;</span>
            </div>
          </div>
        </Link>

        {/* AI Planner Link */}
        <Link 
          href="/ai-planner"
          className="group relative bg-[#050505] border border-zinc-900 p-6 hover:bg-black transition-all duration-300 shadow-2xl"
          style={{
            transform: `rotateY(${mousePosition.x * 4}deg) rotateX(${mousePosition.y * -4}deg)`,
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
          
          <div className="relative" style={{ transform: 'translateZ(20px)' }}>
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-1">
              AI DECISION ENGINE
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 text-white group-hover:text-cyan-400 transition-colors">
              AI Planner
            </h2>
            <div className="h-[2px] w-12 bg-zinc-800 mb-6 group-hover:bg-cyan-400 group-hover:w-full transition-all duration-500" />
            <p className="text-zinc-500 font-mono text-xs mb-8 leading-relaxed">
              &gt; live ml triage &amp; mpi<br/>
              &gt; shadow block bundling<br/>
              &gt; 86.1% downtime saved
            </p>
            <div className="flex justify-between items-center text-xs font-mono font-bold tracking-widest text-zinc-700 group-hover:text-white transition-colors">
              <span>OPEN PLANNER</span>
              <span className="text-cyan-400 font-black">&rarr;</span>
            </div>
          </div>
        </Link>

        {/* Map Link */}
        <Link 
          href="/map"
          className="group relative bg-[#050505] border border-zinc-900 p-7 hover:bg-black transition-all duration-300 shadow-2xl"
          style={{
            transform: `rotateY(${mousePosition.x * 4}deg) rotateX(${mousePosition.y * -4}deg)`,
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
          
          <div className="relative" style={{ transform: 'translateZ(20px)' }}>
            <div className="text-[10px] font-mono text-red-400 uppercase tracking-widest mb-1">
              FLEET &amp; SIGNALS
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-white group-hover:text-red-500 transition-colors">
              Live Map
            </h2>
            <div className="h-[2px] w-12 bg-zinc-800 mb-6 group-hover:bg-red-500 group-hover:w-full transition-all duration-500" />
            <p className="text-zinc-500 font-mono text-xs mb-10 leading-relaxed">
              &gt; monitor active fleet<br/>
              &gt; real-time interlocking<br/>
              &gt; telemetry parsing
            </p>
            <div className="flex justify-between items-center text-xs font-mono font-bold tracking-widest text-zinc-700 group-hover:text-white transition-colors">
              <span>VIEW CORRIDOR</span>
              <span className="text-red-600 font-black">&rarr;</span>
            </div>
          </div>
        </Link>

        {/* Maintenance Link */}
        <Link 
          href="/maintenance"
          className="group relative bg-[#050505] border border-zinc-900 p-7 hover:bg-black transition-all duration-300 shadow-2xl"
          style={{
            transform: `rotateY(${mousePosition.x * 4}deg) rotateX(${mousePosition.y * -4}deg)`,
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute bottom-0 right-0 w-[1px] h-full bg-gradient-to-t from-transparent via-yellow-500 to-transparent scale-y-0 group-hover:scale-y-100 transition-transform duration-700" />
          
          <div className="relative" style={{ transform: 'translateZ(20px)' }}>
            <div className="text-[10px] font-mono text-yellow-400 uppercase tracking-widest mb-1">
              TRACK CLOSURES
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-white group-hover:text-yellow-500 transition-colors">
              Blocks
            </h2>
            <div className="h-[2px] w-12 bg-zinc-800 mb-6 group-hover:bg-yellow-500 group-hover:w-full transition-all duration-500" />
            <p className="text-zinc-500 font-mono text-xs mb-10 leading-relaxed">
              &gt; execute line blocks<br/>
              &gt; divert traffic flow<br/>
              &gt; maintenance override
            </p>
            <div className="flex justify-between items-center text-xs font-mono font-bold tracking-widest text-zinc-700 group-hover:text-white transition-colors">
              <span>SCHEDULE BLOCK</span>
              <span className="text-yellow-500 font-black">&rarr;</span>
            </div>
          </div>
        </Link>

        {/* Workers Link */}
        <Link 
          href="/workers"
          className="group relative bg-[#050505] border border-zinc-900 p-7 hover:bg-black transition-all duration-300 shadow-2xl"
          style={{
            transform: `rotateY(${mousePosition.x * -4}deg) rotateX(${mousePosition.y * -4}deg)`,
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-bl from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute bottom-0 left-0 w-[1px] h-full bg-gradient-to-t from-transparent via-emerald-500 to-transparent scale-y-0 group-hover:scale-y-100 transition-transform duration-700" />
          
          <div className="relative" style={{ transform: 'translateZ(20px)' }}>
            <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest mb-1">
              FIELD CREWS
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-white group-hover:text-emerald-400 transition-colors">
              Workers
            </h2>
            <div className="h-[2px] w-12 bg-zinc-800 mb-6 group-hover:bg-emerald-400 group-hover:w-full transition-all duration-500" />
            <p className="text-zinc-500 font-mono text-xs mb-10 leading-relaxed">
              &gt; automated dispatch<br/>
              &gt; telecom bridging<br/>
              &gt; personnel routing
            </p>
            <div className="flex justify-between items-center text-xs font-mono font-bold tracking-widest text-zinc-700 group-hover:text-white transition-colors">
              <span>MANAGE CREWS</span>
              <span className="text-emerald-400 font-black">&rarr;</span>
            </div>
          </div>
        </Link>

      </div>
      
      {/* Footer Details */}
      <div className="absolute bottom-4 left-4 font-mono text-[9px] text-zinc-600 uppercase tracking-widest">
        SOUTHERN RAILWAY IT DIVISION<br/>
        CENTRAL CONTROL ROOM
      </div>
      <div className="absolute bottom-4 right-4 font-mono text-[9px] text-zinc-600 uppercase tracking-widest text-right">
        FOR AUTHORIZED PERSONNEL ONLY<br/>
        ALL ACTIONS LOGGED
      </div>
    </div>
  );
}
