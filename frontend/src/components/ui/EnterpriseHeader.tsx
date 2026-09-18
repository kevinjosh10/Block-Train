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
            <Link href="/" className="flex flex-col justify-center py-1 group">
              <div className="flex items-baseline gap-2.5">
                <span className="text-[15px] font-bold text-slate-100 tracking-wide">
                  BLOCKTRAIN
                </span>
                <span className="text-[11px] font-semibold text-slate-400 border-l border-slate-700 pl-2.5">
                  CRIS / SR
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium tracking-wide mt-0.5">
                Southern Railway • MAS–AJJ Quadruple Corridor
              </span>
            </Link>

            {badgeText && (
              <span className="hidden xl:inline-flex items-center gap-1.5 text-[11px] text-slate-400 font-medium ml-4 border-l border-slate-700/50 pl-4">
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
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {timeStr || 'LIVE IST'}
              </span>
              <span className="text-[10px] text-slate-500">
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
