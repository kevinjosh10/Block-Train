'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { EnterpriseHeader } from '../components/ui/EnterpriseHeader';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'ai' | 'ops' | 'safety'>('all');

  const modules = [
    {
      id: 'ai-planner',
      title: 'AI Automatic Block Planner',
      category: 'ai',
      badge: 'PS 26027 Core',
      route: '/ai-planner',
      icon: '🧠',
      stat: '93.21% R² Regressor Accuracy',
      description:
        'Two-Stage Machine Learning Defect Prioritization Engine (630 Trees | 20,294 Parameters) combined with Google OR-Tools CP-SAT for multi-department spatial shadow block clustering (±2.5 km).',
      highlights: [
        'Continuous Maintenance Priority Index (MPI: 0–100)',
        '100% Precision Emergency Safety Shield (Zero False Alarms)',
        '4-Tier Sunlight & Machine-Aware Slotting Engine',
        'Direct synchronization with COA Train Timetables'
      ],
      actionLabel: 'Launch AI Decision Console'
    },
    {
      id: 'rbms',
      title: 'Rolling Block Management Suite (RBMS)',
      category: 'ops',
      badge: 'Dual Horizon (4W / 24H)',
      route: '/rbms',
      icon: '📅',
      stat: '>53% Downtime Cut (99.8 hrs/wk)',
      description:
        'Indian Railways standard operating workflow supporting 4-Week Strategic Lookahead and 24-Hour Tactical Dynamic Execution with digital vetting and Private Number sanctioning.',
      highlights: [
        'Joint Vetting across Civil (TMS), Signal (SMMS), and Traction (TDMS)',
        'Section Controller Sanction with Exchange of Private Numbers (PN)',
        'TSR Step-Up Lifecycle Relaxation Tracker (20 → 45 → 75 → 100 km/h)',
        'Automated Operating Form T/409 Disconnection Memo Generation'
      ],
      actionLabel: 'Open RBMS Rolling Schedule'
    },
    {
      id: 'map',
      title: 'Corridor Digital Twin & GIS Interlocking',
      category: 'safety',
      badge: 'MAS–AJJ 73 KM Quadruple',
      route: '/map',
      icon: '🗺️',
      stat: '19 Interlocked Stations',
      description:
        'Real-time corridor digital twin visualizing active line possessions, live train locations, signal aspects, and dynamic speed restrictions across Chennai Central to Arakkonam.',
      highlights: [
        'Quadruple Mainline: UP Slow, DN Slow, UP Fast, DN Fast',
        'Live Block Possession status & possession countdown timers',
        'Automatic headway conflict detection via NetworkX graphs',
        'Kavach 4.0 (IR-TCAS-01) ATP speed restriction broadcast'
      ],
      actionLabel: 'View Live Digital Twin'
    },
    {
      id: 'maintenance',
      title: 'Multi-Department Defect Logging Desk',
      category: 'ops',
      badge: 'TMS • SMMS • TDMS',
      route: '/maintenance',
      icon: '🚧',
      stat: '39-Feature Tensor Ingestion',
      description:
        'Cross-departmental defect intake and possession requisition portal unifying Track Engineering, Signal & Telecom, and 25 kV AC Traction into consolidated possession blocks.',
      highlights: [
        'Civil Track (TMS): USFD flaws, rail joint gaps, sleeper fatigue, TGI',
        'Signal & Telecom (SMMS): Point machines, track circuits, axle counters',
        'Electrical TRD (TDMS): OHE catenary, contact wire height/stagger',
        'Automated shadow block clustering recommendation on submission'
      ],
      actionLabel: 'Manage Line Possessions'
    },
    {
      id: 'workers',
      title: 'Mechanized Gang & Machinery Dispatch',
      category: 'ops',
      badge: 'Track Machines & Crew',
      route: '/workers',
      icon: '👷',
      stat: 'Zero-Miscommunication Gang Routing',
      description:
        'Logistics coordination for specialized track machinery (BCM, CSM, T-28, Tower Wagons) and field gang supervisors with automated safety messaging.',
      highlights: [
        'Automated Gang Supervisor assignment and roster management',
        'Heavy track machine mobilization & power block confirmation',
        'Grassroots WhatsApp safety notices for field gangs',
        'Track clearing and safety certificate verification'
      ],
      actionLabel: 'Dispatch Crews & Machinery'
    }
  ];

  const filteredModules =
    activeTab === 'all'
      ? modules
      : modules.filter((m) => m.category === activeTab);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Enterprise Navigation Header */}
      <EnterpriseHeader badgeText="MAS-AJJ Live Corridor Interlocked" />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Hero Section */}
        <section className="relative rounded-2xl bg-slate-900/80 border border-slate-800 p-8 md:p-10 shadow-lg">
          <div className="max-w-4xl space-y-4">
            
            {/* Clean Sub-header metadata - No small background boxes behind text */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
              <span className="text-blue-400 font-bold">Ministry of Railways • Govt of India</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">Smart India Hackathon 2026</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                PS ID: 26027 Verified
              </span>
            </div>

            {/* Title & Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                AI-Powered Automatic Block Planning System
              </h1>
              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-3xl">
                Unified cross-departmental maintenance synchronization for Indian Railways. Eliminates redundant track possessions, calculates continuous defect priority (MPI), and guarantees zero passenger train detention.
              </p>
            </div>

            {/* Clean Action Buttons */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <Link
                href="/ai-planner"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors flex items-center gap-2 shadow-sm"
              >
                Launch AI Block Planner &rarr;
              </Link>
              <Link
                href="/rbms"
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-sm border border-slate-700 transition-colors flex items-center gap-2"
              >
                Open RBMS Suite
              </Link>
              <Link
                href="/map"
                className="px-4 py-2.5 rounded-xl text-slate-300 hover:text-white font-medium text-sm border border-slate-700 hover:border-slate-500 transition-colors flex items-center gap-1.5"
              >
                Corridor Digital Twin
              </Link>
              <a
                href="/neural_network_layers.html"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl text-indigo-300 hover:text-indigo-100 font-medium text-sm border border-indigo-700/50 hover:border-indigo-400 transition-colors flex items-center gap-1.5"
              >
                5-Layer Neural Visualizer
              </a>
            </div>
          </div>
        </section>

        {/* Live Operational Metrics Ribbon */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Corridor Benchmark Performance Metrics (MAS–AJJ Trunk Line)
            </h2>
            <span className="text-xs font-mono text-slate-400">Empirically Validated</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-1">
              <span className="text-xs font-mono font-semibold uppercase text-slate-400 block tracking-wider">
                Asset Availability
              </span>
              <div className="text-2xl font-black text-emerald-400">97.59%</div>
              <span className="text-xs text-slate-400 block">
                +14.9% Uptime vs Baseline
              </span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-1">
              <span className="text-xs font-mono font-semibold uppercase text-slate-400 block tracking-wider">
                Downtime Cut
              </span>
              <div className="text-2xl font-black text-cyan-400">&gt;53%</div>
              <span className="text-xs text-slate-400 block">
                99.8 hrs/wk Saved
              </span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-1">
              <span className="text-xs font-mono font-semibold uppercase text-slate-400 block tracking-wider">
                ML Regressor R²
              </span>
              <div className="text-2xl font-black text-blue-400">93.21%</div>
              <span className="text-xs text-slate-400 block">
                630-Tree GBDT (MAE ±3.4)
              </span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-1">
              <span className="text-xs font-mono font-semibold uppercase text-slate-400 block tracking-wider">
                Emergency Precision
              </span>
              <div className="text-2xl font-black text-emerald-400">100.0%</div>
              <span className="text-xs text-slate-400 block">
                16/16 Fractures Flagged
              </span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-1">
              <span className="text-xs font-mono font-semibold uppercase text-slate-400 block tracking-wider">
                Train Detention
              </span>
              <div className="text-2xl font-black text-amber-400">0 Min</div>
              <span className="text-xs text-slate-400 block">
                COA Conflict-Free
              </span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-1">
              <span className="text-xs font-mono font-semibold uppercase text-slate-400 block tracking-wider">
                Annual Benefit
              </span>
              <div className="text-2xl font-black text-indigo-400">₹44.8 Cr</div>
              <span className="text-xs text-slate-400 block">
                Across 3 Pilot Divisions
              </span>
            </div>
          </div>
        </section>

        {/* Operational Modules Section */}
        <section className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Operational Subsystems &amp; Portals
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Select an operational console to inspect algorithms, schedule blocks, or monitor live corridor assets.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 border border-slate-800 p-1 rounded-xl bg-slate-900">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Modules
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'ai'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                AI &amp; Optimization
              </button>
              <button
                onClick={() => setActiveTab('ops')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'ops'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Operations &amp; RBMS
              </button>
              <button
                onClick={() => setActiveTab('safety')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'safety'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                GIS &amp; Safety
              </button>
            </div>
          </div>

          {/* Module Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map((m) => (
              <div
                key={m.id}
                className="flex flex-col justify-between bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors rounded-2xl p-6"
              >
                <div className="space-y-4">
                  {/* Top Bar with Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-xl">
                      {m.icon}
                    </span>
                    <span className="text-xs font-mono font-medium text-slate-400 border border-slate-700/60 px-2 py-0.5 rounded">
                      {m.badge}
                    </span>
                  </div>

                  {/* Title & Stat */}
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {m.title}
                    </h3>
                    <span className="text-xs font-mono text-blue-400 block mt-0.5">
                      {m.stat}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {m.description}
                  </p>

                  {/* Checklist Highlights */}
                  <ul className="space-y-1.5 pt-2 border-t border-slate-800">
                    {m.highlights.map((h, i) => (
                      <li key={i} className="text-xs text-slate-400 flex items-start gap-1.5">
                        <span className="text-blue-400 font-bold">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Action Button */}
                <div className="pt-6">
                  <Link
                    href={m.route}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-slate-700 hover:border-blue-500"
                  >
                    <span>{m.actionLabel}</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Corridor Topology & Infrastructure Blueprint */}
        <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase font-bold text-blue-400">
                  Corridor Topology Blueprint
                </span>
                <span className="text-xs font-mono text-slate-400">
                  • 73 KM Quadruple Electrified Mainline
                </span>
              </div>
              <h2 className="text-xl font-black text-white tracking-tight mt-1">
                Southern Railway Trunk Line: Chennai Central (MAS) to Arakkonam (AJJ)
              </h2>
            </div>
            <Link
              href="/map"
              className="text-xs font-mono font-semibold px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center gap-1.5"
            >
              Open Full GIS View &rarr;
            </Link>
          </div>

          {/* Corridor Stations Strip */}
          <div className="border border-slate-800 rounded-xl p-4 overflow-x-auto bg-slate-950/40">
            <div className="min-w-[700px] flex items-center justify-between text-center relative py-2">
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
                  <div className={`w-3 h-3 rounded-full border-2 ${
                    idx === 0 || idx === 9 
                      ? 'bg-blue-500 border-white' 
                      : 'bg-slate-900 border-slate-600'
                  }`} />
                  <span className="text-xs font-mono font-bold text-white mt-2 block">{stn.code}</span>
                  <span className="text-[11px] text-slate-400">{stn.name}</span>
                  <span className="text-[10px] font-mono text-slate-500">{stn.km} km</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4 Track Architecture & Specs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="border border-slate-800/80 p-4 rounded-xl space-y-2">
              <h4 className="font-bold text-white font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                Track Infrastructure &amp; Lines
              </h4>
              <ul className="space-y-1 text-slate-300">
                <li>• <strong>UP Slow &amp; DN Slow:</strong> Dedicated Chennai suburban EMU lines.</li>
                <li>• <strong>UP Fast &amp; DN Fast:</strong> Long-distance Superfast &amp; Freight lines.</li>
                <li>• <strong>Ballast &amp; Sleeper:</strong> 60 kg/m 90 UTS rails on PSC sleepers.</li>
              </ul>
            </div>

            <div className="border border-slate-800/80 p-4 rounded-xl space-y-2">
              <h4 className="font-bold text-white font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Signalling &amp; Traction Specs
              </h4>
              <ul className="space-y-1 text-slate-300">
                <li>• <strong>Signalling:</strong> Automatic Block Signalling (ABS) with 4-Aspect LED.</li>
                <li>• <strong>Traction:</strong> 25 kV AC 50 Hz Overhead Catenary (OHE).</li>
                <li>• <strong>Interlocking:</strong> Electronic Interlocking (EI) with Dual VDU.</li>
              </ul>
            </div>

            <div className="border border-slate-800/80 p-4 rounded-xl space-y-2">
              <h4 className="font-bold text-white font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                Safety &amp; Compliance Standards
              </h4>
              <ul className="space-y-1 text-slate-300">
                <li>• <strong>Kavach 4.0:</strong> Direct cab ATP packet broadcast (IR-TCAS-01).</li>
                <li>• <strong>Form T/409:</strong> Automated Caution Order &amp; Disconnection Memo.</li>
                <li>• <strong>Private Numbers:</strong> Cryptographic exchange for safe possession handoff.</li>
              </ul>
            </div>
          </div>
        </section>

      </main>

      {/* Institutional Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 py-8 px-4 sm:px-6 lg:px-8 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-blue-700 text-white font-black flex items-center justify-center text-xs">
              IR
            </div>
            <div>
              <p className="font-semibold text-slate-200">
                Government of India • Ministry of Railways • Centre for Railway Information Systems (CRIS)
              </p>
              <p className="text-xs text-slate-500">
                Southern Railway Headquarters, Chennai • Problem Statement ID 26027
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <Link href="/ai-planner" className="hover:text-white transition-colors">
              AI Planner
            </Link>
            <span>•</span>
            <Link href="/rbms" className="hover:text-white transition-colors">
              RBMS Suite
            </Link>
            <span>•</span>
            <Link href="/map" className="hover:text-white transition-colors">
              Live Map
            </Link>
            <span>•</span>
            <a
              href="/neural_network_layers.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Neural Visualizer
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
