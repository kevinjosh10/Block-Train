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
    { href: '/', label: 'Command Hub', icon: '🏛️' },
    { href: '/ai-planner', label: 'AI Planner', badge: 'PS 26027', icon: '🧠' },
    { href: '/rbms', label: 'RBMS Suite', badge: 'SR Ops', icon: '📅' },
    { href: '/map', label: 'Corridor Twin', icon: '🗺️' },
    { href: '/maintenance', label: 'Possessions', icon: '🚧' },
    { href: '/workers', label: 'Gang Logistics', icon: '👷' },
  ];

  return (
    <header className="border-b border-slate-800/90 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50 text-slate-200 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand & Zone */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                BT
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                    BLOCKTRAIN
                  </span>
                  <span className="text-[10px] font-mono uppercase bg-blue-950/90 text-blue-300 border border-blue-800/60 px-1.5 py-0.2 rounded font-semibold">
                    IR-CRIS
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                  Southern Railway • MAS–AJJ Corridor
                </span>
              </div>
            </Link>

            {badgeText && (
              <span className="hidden xl:inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {badgeText}
              </span>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 font-semibold shadow-sm shadow-blue-500/10'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <span className="text-sm">{link.icon}</span>
                  <span>{link.label}</span>
                  {link.badge && (
                    <span
                      className={`text-[9px] font-mono px-1 py-0.2 rounded ${
                        isActive
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Live Status & Clock */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex flex-col items-end text-right font-mono">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {timeStr || 'LIVE IST'}
              </span>
              <span className="text-[9px] text-slate-400 uppercase tracking-wider">
                COA &amp; Kavach 4.0 Sync
              </span>
            </div>

            <a
              href="/neural_network_layers.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-medium font-mono px-2.5 py-1.5 rounded-lg bg-indigo-950/80 text-indigo-300 border border-indigo-800/80 hover:bg-indigo-900/90 transition-colors flex items-center gap-1 shadow-sm"
              title="View Interactive 5-Layer Neural Network Architecture"
            >
              <span>🔬</span>
              <span className="hidden sm:inline">NN Topology</span>
            </a>
          </div>

        </div>
      </div>
    </header>
  );
}
