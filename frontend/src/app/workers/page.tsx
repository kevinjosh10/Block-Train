'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { EnterpriseHeader } from '../../components/ui/EnterpriseHeader';

type Worker = {
  id: number;
  name: string;
  phone: string;
  department: string;
};

const DEPARTMENTS = [
  "Track Maintenance Dept.",
  "Signal & Telecom Dept.",
  "Electrical Traction Dept."
];

let workerIdSeq = 1000;

const DEFAULT_WORKERS: Worker[] = [
  { id: 1, name: "K. R. Natarajan (Track Inspector)", phone: "+91 94440 12831", department: "Track Maintenance Dept." },
  { id: 2, name: "S. Venkatesh (Senior Section Engineer - S&T)", phone: "+91 98401 54920", department: "Signal & Telecom Dept." },
  { id: 3, name: "M. Anbarasan (OHE Traction Foreman)", phone: "+91 97908 61245", department: "Electrical Traction Dept." },
  { id: 4, name: "P. Selvakumar (Permanent Way Gang Lead)", phone: "+91 94450 78312", department: "Track Maintenance Dept." },
  { id: 5, name: "D. Jayaprakash (Relay Interlocking Tech)", phone: "+91 98842 19047", department: "Signal & Telecom Dept." },
  { id: 6, name: "R. Muralidharan (Tower Wagon Supervisor)", phone: "+91 94441 83022", department: "Electrical Traction Dept." }
];

export default function WorkersPage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const API_URL = `${baseUrl}/api`;

  const [workers, setWorkers] = useState<Worker[]>(DEFAULT_WORKERS);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedDept, setSelectedDept] = useState(DEPARTMENTS[0]);

  useEffect(() => {
    fetch(`${API_URL}/workers`)
      .then(res => res.json())
      .then(data => {
        if (data.workers && data.workers.length > 0) setWorkers(data.workers);
      })
      .catch(() => {
        // Retain default workers if backend is offline
      });
  }, [API_URL]);

  const handleAddWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newWorker: Worker = {
      id: ++workerIdSeq,
      name: name.trim(),
      phone: phone.trim() || "+91 90000 00000",
      department: selectedDept
    };
    try {
      const res = await fetch(`${API_URL}/workers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim(), department: selectedDept })
      });
      const data = await res.json().catch(() => ({}));
      if (data.success && data.worker) {
        setWorkers((prev) => [data.worker, ...prev]);
      } else {
        setWorkers((prev) => [newWorker, ...prev]);
      }
    } catch {
      setWorkers((prev) => [newWorker, ...prev]);
    }
    setName("");
    setPhone("");
  };

  const handleDeleteWorker = async (id: number) => {
    setWorkers((prev) => prev.filter(w => w.id !== id));
    try {
      await fetch(`${API_URL}/workers/${id}`, { method: 'DELETE' });
    } catch {
      // Local optimistic delete suffices
    }
  };

  const trackCount = workers.filter(w => w.department === "Track Maintenance Dept.").length;
  const signalCount = workers.filter(w => w.department === "Signal & Telecom Dept.").length;
  const elecCount = workers.filter(w => w.department === "Electrical Traction Dept.").length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-blue-600/30">
      <EnterpriseHeader badgeText="Gang Logistics • Live Duty" />

      {/* Subheader */}
      <div className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono tracking-widest text-cyan-400 uppercase font-bold">
                Field Gang Operations
              </span>
              <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800/80 px-2 py-0.5 rounded-full font-mono">
                WhatsApp Safety Broadcast Sync
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white mt-0.5">
              Field Gangs &amp; Machinery Supervisors Directory
            </h1>
          </div>

        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Quick Stats Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Active Personnel</span>
            <span className="text-2xl font-black text-white">{workers.length}</span>
            <span className="text-[11px] text-slate-400 font-mono block">Across 3 Disciplines</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Civil Track Gangs</span>
            <span className="text-2xl font-black text-blue-400">{trackCount}</span>
            <span className="text-[11px] text-slate-400 font-mono block">TMS Registered</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Signal &amp; Telecom</span>
            <span className="text-2xl font-black text-purple-400">{signalCount}</span>
            <span className="text-[11px] text-slate-400 font-mono block">SMMS Registered</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">OHE Traction Crews</span>
            <span className="text-2xl font-black text-amber-400">{elecCount}</span>
            <span className="text-[11px] text-slate-400 font-mono block">TDMS Registered</span>
          </div>
        </div>

        {/* Add Worker Section */}
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Enroll Field Personnel / Machine Supervisor
            </h2>
          </div>
          <form onSubmit={handleAddWorker} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">Assigned Department</label>
              <select 
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl text-white px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 transition-colors"
              >
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">Supervisor Name &amp; Designation</label>
              <input 
                type="text" 
                placeholder="e.g. K. R. Natarajan (Track Inspector)" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl text-white px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">CUG Mobile / Radio Telephony</label>
              <input 
                type="text" 
                placeholder="+91 94440 12831" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl text-white px-3.5 py-2.5 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
            <div className="flex items-end">
              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5"
              >
                Enroll Supervisor
              </button>
            </div>
          </form>
        </div>

        {/* Department Gangs Directory */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {DEPARTMENTS.map(dept => {
            const deptWorkers = workers.filter(w => w.department === dept);
            const isTrack = dept.includes('Track');
            const isSignal = dept.includes('Signal');
            return (
              <div key={dept} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col shadow-md">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isTrack ? 'bg-blue-400' : isSignal ? 'bg-purple-400' : 'bg-amber-400'}`} />
                    {dept}
                  </h3>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {deptWorkers.length} Active
                  </span>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto max-h-[420px]">
                  {deptWorkers.length === 0 ? (
                    <p className="text-slate-500 text-xs italic py-4 text-center">No registered supervisors.</p>
                  ) : (
                    deptWorkers.map(w => (
                      <div
                        key={w.id}
                        className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 p-3.5 rounded-xl flex items-center justify-between group transition-all"
                      >
                        <div className="space-y-0.5">
                          <span className="text-xs font-semibold text-slate-100 block">{w.name}</span>
                          <span className="text-[11px] text-slate-400 font-mono block">{w.phone}</span>
                        </div>
                        <button 
                          onClick={() => handleDeleteWorker(w.id)} 
                          className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-xs"
                          title="Remove supervisor"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}
