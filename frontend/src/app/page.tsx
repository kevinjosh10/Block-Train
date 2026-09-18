'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { EnterpriseHeader } from '../components/ui/EnterpriseHeader';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'ai' | 'ops' | 'safety'>('all');

  const modules = [
    {
      id: 'ai-planner',
      title: 'AI Block Planner',
      category: 'ai',
      badge: 'PS 26027 Engine',
      route: '/ai-planner',
      icon: '🧠',
      stat: '93.21% R² Regressor Accuracy',
      description:
        'Two-Stage GBDT (630 Trees) & Google OR-Tools CP-SAT for multi-department spatial shadow block clustering (±2.5 km).',
      actionLabel: 'Open AI Planner'
    },
    {
      id: 'rbms',
      title: 'RBMS Suite',
      category: 'ops',
      badge: '14-Day Rolling RBP',
      route: '/rbms',
      icon: '📅',
      stat: '>53% Downtime Cut (99.8 hrs/wk)',
      description:
        'Standard operating workflow for 14-day rolling schedules, digital vetting, Private Number sanctioning, and TSR relaxation.',
      actionLabel: 'Open RBMS Desk'
    },
    {
      id: 'map',
      title: 'Corridor Digital Twin',
      category: 'safety',
      badge: 'MAS–AJJ 73 KM Quadruple',
      route: '/map',
      icon: '🗺️',
      stat: '19 Interlocked Stations',
      description:
        'Real-time corridor GIS twin tracking active line possessions, live train locations, signal aspects, and speed restrictions.',
      actionLabel: 'Launch Digital Twin'
    },
    {
      id: 'maintenance',
      title: 'Possession Requisition Desk',
      category: 'ops',
      badge: 'TMS • SMMS • TDMS',
      route: '/maintenance',
      icon: '🚧',
      stat: 'Unified Defect Ingestion',
      description:
        'Cross-departmental possession logging unifying Track (Civil), Signal (S&T), and Overhead Traction (25kV OHE).',
      actionLabel: 'Manage Possessions'
    },
    {
      id: 'workers',
      title: 'Gang & Machinery Logistics',
      category: 'ops',
      badge: 'Field Operations',
      route: '/workers',
      icon: '👷',
      stat: 'Active Roster Directory',
      description:
        'Logistics coordination for track machinery (BCM, CSM, Tower Wagons) and field supervisor assignments.',
      actionLabel: 'View Gang Directory'
    }
  ];

  const filteredModules =
    activeTab === 'all'
      ? modules
      : modules.filter((m) => m.category === activeTab);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <EnterpriseHeader badgeText="MAS-AJJ Live Corridor Interlocked" />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Clean Hero Bar */}
        <section className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="text-blue-400 font-bold">Ministry of Railways</span>
                <span>•</span>
                <span>Southern Railway Division</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">PS 26027 Verified</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                AI Automatic Block Planning &amp; Corridor Command
              </h1>
              <p className="text-sm text-slate-300">
                Centralized maintenance synchronization for Indian Railways. Eliminates redundant line blocks, optimizes asset uptime, and guarantees zero passenger train detention.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/ai-planner"
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                Launch AI Planner &rarr;
              </Link>
              <Link
                href="/rbms"
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
              >
                Open RBMS
              </Link>
              <Link
                href="/map"
                className="px-4 py-2.5 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-xs font-medium transition-colors"
              >
                Digital Twin
              </Link>
            </div>
          </div>
        </section>

        {/* Corridor Key Performance Metrics */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Corridor Operations Benchmark (MAS–AJJ 73 KM)
            </h2>
            <span className="text-xs font-mono text-slate-500">Live Telemetry</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="border border-slate-800 p-3.5 rounded-xl">
              <span className="text-xs font-mono uppercase text-slate-400 block">Asset Availability</span>
              <div className="text-xl font-bold text-emerald-400 mt-1">97.59%</div>
              <span className="text-[11px] text-slate-500 block">+14.9% vs Manual</span>
            </div>

            <div className="border border-slate-800 p-3.5 rounded-xl">
              <span className="text-xs font-mono uppercase text-slate-400 block">Downtime Cut</span>
              <div className="text-xl font-bold text-cyan-400 mt-1">&gt;53%</div>
              <span className="text-[11px] text-slate-500 block">99.8 hrs/wk Saved</span>
            </div>

            <div className="border border-slate-800 p-3.5 rounded-xl">
              <span className="text-xs font-mono uppercase text-slate-400 block">ML Regressor R²</span>
              <div className="text-xl font-bold text-blue-400 mt-1">93.21%</div>
              <span className="text-[11px] text-slate-500 block">630 Trees (GBDT)</span>
            </div>

            <div className="border border-slate-800 p-3.5 rounded-xl">
              <span className="text-xs font-mono uppercase text-slate-400 block">Emergency Precision</span>
              <div className="text-xl font-bold text-emerald-400 mt-1">100.0%</div>
              <span className="text-[11px] text-slate-500 block">Zero False Alarms</span>
            </div>

            <div className="border border-slate-800 p-3.5 rounded-xl">
              <span className="text-xs font-mono uppercase text-slate-400 block">Train Detention</span>
              <div className="text-xl font-bold text-amber-400 mt-1">0 Min</div>
              <span className="text-[11px] text-slate-500 block">Conflict-Free COA</span>
            </div>

            <div className="border border-slate-800 p-3.5 rounded-xl">
              <span className="text-xs font-mono uppercase text-slate-400 block">Annual Savings</span>
              <div className="text-xl font-bold text-indigo-400 mt-1">₹44.8 Cr</div>
              <span className="text-[11px] text-slate-500 block">3 Pilot Divisions</span>
            </div>
          </div>
        </section>

        {/* Operational Modules */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Operational Subsystems
            </h2>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 border border-slate-800 p-1 rounded-xl bg-slate-900">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  activeTab === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  activeTab === 'ai' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                AI &amp; Optimization
              </button>
              <button
                onClick={() => setActiveTab('ops')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  activeTab === 'ops' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                RBMS Operations
              </button>
              <button
                onClick={() => setActiveTab('safety')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  activeTab === 'safety' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                GIS &amp; Safety
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredModules.map((m) => (
              <div
                key={m.id}
                className="flex flex-col justify-between border border-slate-800 hover:border-slate-700 bg-slate-900/40 transition-colors rounded-xl p-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{m.icon}</span>
                    <span className="text-xs font-mono text-slate-400 border border-slate-800 px-2 py-0.5 rounded">
                      {m.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{m.title}</h3>
                    <span className="text-xs font-mono text-blue-400 block mt-0.5">{m.stat}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {m.description}
                  </p>
                </div>

                <div className="pt-5">
                  <Link
                    href={m.route}
                    className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-1 border border-slate-700 hover:border-blue-500"
                  >
                    <span>{m.actionLabel}</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Corridor Stations Strip */}
        <section className="border border-slate-800 rounded-xl p-5 space-y-4 bg-slate-900/30">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase font-bold text-blue-400">Corridor Topology</span>
              <h3 className="text-sm font-bold text-white mt-0.5">
                Chennai Central (MAS) ⇄ Arakkonam Jn (AJJ) • 73 KM Quadruple Line
              </h3>
            </div>
            <Link
              href="/map"
              className="text-xs font-mono font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              Open Live Map &rarr;
            </Link>
          </div>

          <div className="border border-slate-800/80 rounded-lg p-3 overflow-x-auto">
            <div className="min-w-[650px] flex items-center justify-between text-center relative py-1">
              <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
              {[
                { code: 'MAS', name: 'Chennai Central', km: '0.0' },
                { code: 'BBQ', name: 'Basin Bridge', km: '2.2' },
                { code: 'PER', name: 'Perambur', km: '5.6' },
                { code: 'VLK', name: 'Villivakkam', km: '9.2' },
                { code: 'ABU', name: 'Ambattur', km: '15.0' },
                { code: 'AVD', name: 'Avadi', km: '21.3' },
                { code: 'TI', name: 'Tiruninravur', km: '29.1' },
                { code: 'TRL', name: 'Tiruvallur', km: '41.8' },
                { code: 'KBT', name: 'Kadambattur', km: '47.2' },
                { code: 'AJJ', name: 'Arakkonam Jn', km: '68.8' }
              ].map((stn, idx) => (
                <div key={stn.code} className="relative z-10 flex flex-col items-center">
                  <div className={`w-2.5 h-2.5 rounded-full border ${
                    idx === 0 || idx === 9 ? 'bg-blue-500 border-white' : 'bg-slate-900 border-slate-600'
                  }`} />
                  <span className="text-xs font-mono font-bold text-white mt-1.5">{stn.code}</span>
                  <span className="text-[10px] text-slate-400">{stn.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 py-6 px-4 sm:px-6 lg:px-8 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-400 font-medium">
            Ministry of Railways • Southern Railway Division • BlockTrain Digital Operations
          </p>
          <div className="flex items-center gap-3 text-slate-400 font-mono text-xs">
            <Link href="/ai-planner" className="hover:text-white">AI Planner</Link>
            <span>•</span>
            <Link href="/rbms" className="hover:text-white">RBMS</Link>
            <span>•</span>
            <Link href="/map" className="hover:text-white">Live Map</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
