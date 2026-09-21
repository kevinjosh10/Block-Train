'use client';

import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full font-sans relative overflow-hidden bg-slate-50 flex items-center justify-center">
      
      {/* Background Train Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          filter: 'brightness(0.9) contrast(1.1)'
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/95 via-white/85 to-slate-100/95" />

      {/* Small Light Train Moving Background */}
      <style>{`
        @keyframes slideTrain {
          0% { transform: translateX(-20vw); }
          100% { transform: translateX(120vw); }
        }
        .train-slider {
          animation: slideTrain 20s linear infinite;
        }
      `}</style>
      <div className="absolute top-[35%] left-0 w-full overflow-hidden pointer-events-none z-0">
        <div className="train-slider w-48 text-indigo-900/10">
          <svg viewBox="0 0 64 64" fill="currentColor" className="w-full h-full">
            <path d="M62,34c0-4-10-8-16-8H6c-2.2,0-4,1.8-4,4v12h62V34z M16,30h8v4h-8V30z M32,30h8v4h-8V30z M48,30h8v4h-8V30z" />
            <circle cx="16" cy="48" r="4" />
            <circle cx="32" cy="48" r="4" />
            <circle cx="48" cy="48" r="4" />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 drop-shadow-sm mt-4">
            Block<span className="text-indigo-600">Train</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-700 font-medium max-w-2xl mx-auto leading-relaxed">
            AI-Powered Automatic Block Planning to Maximize Asset Availability for Train Operations on Indian Railways
          </p>
        </div>

        {/* Grid Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-fade-in-up delay-150">
          
          {/* RBMS Suite */}
          <Link href="/rbms" className="group bg-white/80 backdrop-blur-md border border-slate-200/60 p-8 rounded-2xl hover:bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">RBMS Suite</h2>
            <p className="text-slate-600 mb-6 line-clamp-2">Centralized 14-day rolling schedule and joint vetting command center.</p>
            <div className="flex items-center text-sm font-semibold text-indigo-600">
              Open Dashboard <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* AI Planner */}
          <Link href="/ai-planner" className="group bg-white/80 backdrop-blur-md border border-slate-200/60 p-8 rounded-2xl hover:bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">AI Planner</h2>
            <p className="text-slate-600 mb-6 line-clamp-2">Live ML triage, MPI scoring, and multi-department spatial shadow bundling.</p>
            <div className="flex items-center text-sm font-semibold text-blue-600">
              Launch Engine <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Live Map */}
          <Link href="/map" className="group bg-white/80 backdrop-blur-md border border-slate-200/60 p-8 rounded-2xl hover:bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Digital Twin</h2>
            <p className="text-slate-600 mb-6 line-clamp-2">Real-time track monitor, interlocking visualization, and active fleet tracking.</p>
            <div className="flex items-center text-sm font-semibold text-emerald-600">
              View Map <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Legacy Maintenance */}
          <Link href="/maintenance" className="group bg-white/80 backdrop-blur-md border border-slate-200/60 p-8 rounded-2xl hover:bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Legacy Blocks</h2>
            <p className="text-slate-600 mb-6 line-clamp-2">Traditional interface to manually execute line blocks and divert traffic.</p>
            <div className="flex items-center text-sm font-semibold text-amber-600">
              Legacy Mode <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Workforce */}
          <Link href="/workers" className="group bg-white/80 backdrop-blur-md border border-slate-200/60 p-8 rounded-2xl hover:bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Field Crew</h2>
            <p className="text-slate-600 mb-6 line-clamp-2">Automated WhatsApp alerts, Kavach 4.0 sync, and crew geofencing.</p>
            <div className="flex items-center text-sm font-semibold text-rose-600">
              Manage Crew <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Login */}
          <Link href="/login" className="group bg-white/80 backdrop-blur-md border border-slate-200/60 p-8 rounded-2xl hover:bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Admin Portal</h2>
              <p className="text-slate-600 mb-6 line-clamp-2">Secure access for Ministry of Railways and Division Controllers.</p>
            </div>
            <div className="flex items-center text-sm font-semibold text-violet-600">
              Secure Login <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

        </div>
        
        {/* Footer */}
        <div className="mt-16 text-center text-slate-500 text-sm font-medium">
          Powered by Hybrid Cloud Architecture • 2026 Ministry of Railways
        </div>
      </div>
    </div>
  );
}
