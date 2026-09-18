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
    { href: '/ai-planner', label: 'AI Planner', tag: 'PS 26027' },
    { href: '/rbms', label: 'RBMS Suite', tag: 'SR Ops' },
    { href: '/map', label: 'Corridor Twin' },
    { href: '/maintenance', label: 'Possessions' },
    { href: '/workers', label: 'Gang Logistics' },
  ];

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand & Zone */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                BT
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                    BLOCKTRAIN
                  </span>
                  <span className="text-[11px] font-mono uppercase text-blue-400 font-semibold tracking-wider">
                    CRIS / SR
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  Southern Railway • MAS–AJJ Quadruple Corridor
                </span>
              </div>
            </Link>

            {badgeText && (
              <span className="hidden xl:inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium ml-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {badgeText}
              </span>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'text-white border-b-2 border-blue-500 font-semibold'
                      : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.tag && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({link.tag})
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Live Status & Clock */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex flex-col items-end text-right font-mono">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {timeStr || 'LIVE IST'}
              </span>
              <span className="text-[10px] text-slate-400">
                COA &amp; Kavach 4.0 Active
              </span>
            </div>

            <a
              href="/neural_network_layers.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-indigo-300 hover:text-white transition-colors border border-indigo-700/50 hover:border-indigo-500 px-3 py-1.5 rounded-lg"
              title="View Interactive 5-Layer Neural Network Architecture"
            >
              NN Visualizer &rarr;
            </a>
          </div>

        </div>
      </div>
    </header>
  );
}
