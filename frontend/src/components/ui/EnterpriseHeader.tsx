'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface EnterpriseHeaderProps {
  currentModule?: string;
  badgeText?: string;
}

export function EnterpriseHeader({ currentModule, badgeText }: EnterpriseHeaderProps) {
  const pathname = usePathname();
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { href: '/', label: 'Command Hub' },
    { href: '/ai-planner', label: 'AI Planner' },
    { href: '/rbms', label: 'RBMS Suite' },
    { href: '/map', label: 'Corridor Twin' },
    { href: '/maintenance', label: 'Possessions' },
    { href: '/workers', label: 'Gang Logistics' },
  ];

  return (
    <header className="flex flex-col sticky top-0 z-50 w-full shadow-sm">
      {/* Top Utility Bar (System Context) */}
      <div className="bg-slate-900 text-slate-300 h-8 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-slate-800 text-[11px] font-medium tracking-wide">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-100 font-bold tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            CRIS &bull; SOUTHERN RAILWAY
          </span>
          <span className="hidden sm:inline border-l border-slate-700 pl-4 text-slate-400">
            MAS &ndash; AJJ Quadruple Corridor
          </span>
        </div>

        <div className="flex items-center gap-4 font-mono">
          <span className="hidden md:inline flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            COA &amp; Kavach 4.0 Active
          </span>
          <span className="border-l border-slate-700 pl-4 text-slate-300">
            {timeStr || 'LIVE IST'}
          </span>
          <a
            href="/neural_network_layers.html"
            target="_blank"
            rel="noopener noreferrer"
            className="border-l border-slate-700 pl-4 text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
            title="View Interactive Neural Network Architecture"
          >
            NN Visualizer &rarr;
          </a>
        </div>
      </div>

      {/* Main Navigation Bar (App Level) */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Logo */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex flex-col group pt-1 pb-1">
                <span className="text-[24px] font-black text-slate-900 tracking-tighter leading-none group-hover:text-indigo-600 transition-colors">
                  BLOCKTRAIN
                </span>
                {(badgeText || currentModule) && (
                  <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-1 group-hover:text-slate-600 transition-colors">
                    {badgeText || currentModule}
                  </span>
                )}
              </Link>
            </div>

            {/* Premium Navigation Pills */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 shadow-inner">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 border border-transparent'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            
          </div>
        </div>
      </div>
    </header>
  );
}