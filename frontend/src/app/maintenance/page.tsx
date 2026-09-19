'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DigitalTwinMap } from '../../components/map/DigitalTwinMap';
import { useMaintenanceStore } from '../../lib/store';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { CustomCalendar } from '../../components/ui/CustomCalendar';
import { Chatbot } from '../../components/chat/Chatbot';
import { VoiceRecorder } from '../../components/audio/VoiceRecorder';
import { EnterpriseHeader } from '../../components/ui/EnterpriseHeader';

interface AIDecisionData {
  success: boolean;
  predicted_mpi: number;
  urgency_level: string;
  action_recommendation: string;
  shadow_block_decision: {
    recommended_block_id: string;
    station_code: string;
    window: string;
    departments_clustered: string;
    allocated_hours: number;
    hours_saved_by_clustering: number;
    downtime_reduction_pct: string;
  };
}

export default function MaintenancePage() {
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [evaluatingAi, setEvaluatingAi] = useState(false);
  const [aiDecision, setAiDecision] = useState<AIDecisionData | null>(null);
  const [formUrgency, setFormUrgency] = useState('Critical');
  const addBlock = useMaintenanceStore((state) => state.addBlock);
  const activeBlocks = useMaintenanceStore((state) => state.activeBlocks);
  const removeBlock = useMaintenanceStore((state) => state.removeBlock);

  React.useEffect(() => {
    useMaintenanceStore.getState().fetchBlocks();
  }, []);

  const evaluateWithAi = async () => {
    setEvaluatingAi(true);
    try {
      const station = selectedTrack?.split(' ')[0] || 'TBM';
      const res = await fetch('/api/ai-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          department: 'Track Maintenance (Civil)',
          station_code: station,
          safety_risk_score: 9,
          overdue_days: 22
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiDecision(data);
        const mappedUrgency =
          data.urgency_level === 'CRITICAL_EMERGENCY'
            ? 'Critical'
            : data.urgency_level === 'HIGH_PRIORITY'
            ? 'High'
            : data.urgency_level === 'MEDIUM_PLANNED'
            ? 'Medium'
            : 'Low';
        setFormUrgency(mappedUrgency);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluatingAi(false);
    }
  };

  const times = Array.from({ length: 48 }, (_, i) => {
    const h = Math.floor(i / 2).toString().padStart(2, '0');
    const m = i % 2 === 0 ? '00' : '30';
    return `${h}:${m}`;
  });

  return (
    <div className="h-screen w-full bg-slate-950 text-slate-200 font-sans flex flex-col selection:bg-blue-600/30 overflow-hidden relative">
      
      {/* Top Header */}
      <div className="relative z-50">
        <EnterpriseHeader badgeText="Possession Control Active" />
      </div>
      


      {/* Active Blocks Dashboard */}
      <div className="absolute right-8 top-24 bottom-8 w-80 z-40 pointer-events-none flex flex-col gap-4">
        {activeBlocks.length > 0 && (
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 backdrop-blur-md pointer-events-auto flex flex-col max-h-full">
            <h2 className="text-sm font-medium text-white mb-4 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Active Blocks ({activeBlocks.length})
            </h2>
            <div className="overflow-y-auto pr-2 space-y-3">
                {activeBlocks.map((b) => (
                  <div key={b.id} className={`bg-zinc-950 border ${b.urgency === 'Critical' ? 'border-red-500/50' : b.urgency === 'High' ? 'border-orange-500/50' : b.urgency === 'Medium' ? 'border-amber-500/50' : 'border-zinc-800'} rounded-lg p-4 relative group`}>
                    <button onClick={() => removeBlock(b.id)} className="absolute top-2 right-2 text-zinc-500 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all text-xs">
                      ✕
                    </button>
                    <p className={`font-mono text-[10px] mb-1 ${b.urgency === 'Critical' ? 'text-red-500' : b.urgency === 'High' ? 'text-orange-500' : b.urgency === 'Medium' ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {b.department} • {b.urgency ? b.urgency.toUpperCase() : 'CRITICAL'}
                    </p>
                    <p className="text-zinc-200 text-xs mb-2 leading-tight">{b.id}</p>
                    <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono bg-zinc-900 px-2 py-1 rounded">
                      <span>{b.date}</span>
                      <span>{b.fromTime} - {b.toTime}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
        

      </div>

      {/* Map (Trains Hidden, Interactive enabled) */}
      <div className="absolute inset-0 z-10">
        <DigitalTwinMap hideTrains={true} interactive={true} onTrackClick={setSelectedTrack} />
      </div>
      {/* Block Modal */}
      {selectedTrack && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl shadow-2xl relative flex flex-col">
            
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50 rounded-t-2xl shrink-0">
              <div>
                <h2 className="text-xl font-medium text-white mb-1">Schedule Maintenance</h2>
                <p className="text-sm text-zinc-400 font-mono">
                  {selectedTrack}
                </p>
              </div>
              <button 
                onClick={() => setSelectedTrack(null)}
                className="text-zinc-500 hover:text-zinc-300 bg-zinc-800 p-2 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="p-6 flex-1">
              <form className="flex flex-col h-full" onSubmit={async (e) => { 
                e.preventDefault(); 
                const formData = new FormData(e.currentTarget);
                if (selectedTrack) {
                  const department = formData.get('dept') as string;
                  const date = formData.get('date') as string;
                  const fromTime = formData.get('fromTime') as string;
                  const toTime = formData.get('toTime') as string;
                  const urgency = formData.get('urgency') as string;

                  await addBlock({
                    id: selectedTrack,
                    department,
                    date,
                    fromTime,
                    toTime,
                    urgency
                  });

                  // Trigger Twilio Call
                  const audioUrl = useMaintenanceStore.getState().dispatchAudioUrl;
                  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://13.204.43.188:5000';
                  
                  try {
                    const notifyRes = await fetch(`${backendUrl}/api/dispatch/notify`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        blockId: selectedTrack,
                        department,
                        date,
                        fromTime,
                        toTime,
                        audioUrl
                      })
                    });
                    const notifyData = await notifyRes.json();
                    
                    if (notifyData.success) {
                      // Trigger native SMS App (Windows/Android/iOS)
                      if (notifyData.phoneNumbers && notifyData.phoneNumbers.length > 0) {
                        const smsBody = `🚨 URGENT: Maintenance Block scheduled for ${department}.\nTrack: ${selectedTrack}\nTime: ${fromTime} to ${toTime} on ${date}.\n\nListen to dispatch audio: ${audioUrl || 'N/A'}`;
                        const phoneString = notifyData.phoneNumbers.join(',');
                        
                        // Instantly open the SMS app without any browser alerts
                        window.location.href = `sms:${phoneString}?body=${encodeURIComponent(smsBody)}`;
                      }
                      
                      // Modal will close automatically because of setSelectedTrack(null) below
                    } else {
                      console.error(`FAILED: Dispatch returned error.\nReason: ${notifyData.error || notifyData.message}`);
                    }
                  } catch (err) {
                    console.error(`NETWORK ERROR: Could not reach backend for dispatch.\nDetails: ${err}`);
                  }
                }
                setSelectedTrack(null); 
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* Left Column: Form Details */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-zinc-500 mb-2 font-bold">Station / Department</label>
                      <select name="dept" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-300 outline-none focus:border-amber-500 transition-colors">
                        <option>Track Maintenance Dept.</option>
                        <option>Signal & Telecom Dept.</option>
                        <option>Electrical Traction Dept.</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-zinc-500 mb-2 font-bold">Date</label>
                      <CustomCalendar name="date" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-zinc-500 mb-2 font-bold">From Time (24H)</label>
                        <CustomSelect name="fromTime" placeholder="Start Time" options={times} />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-zinc-500 mb-2 font-bold">To Time (24H)</label>
                        <CustomSelect name="toTime" placeholder="End Time" options={times} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold">Urgency Classification</label>
                        <button
                          type="button"
                          onClick={evaluateWithAi}
                          disabled={evaluatingAi}
                          className="text-[10px] font-mono px-2.5 py-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 hover:bg-cyan-900 transition-colors flex items-center gap-1.5"
                        >
                          {evaluatingAi ? 'Evaluating...' : 'Auto-Evaluate with AI'}
                        </button>
                      </div>

                      {aiDecision && (
                        <div className="mb-3 p-3 bg-cyan-950/40 border border-cyan-800/60 rounded-lg text-xs font-mono">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-cyan-400 font-bold">AI Recommendation:</span>
                            <span className="text-white font-bold">{aiDecision.urgency_level} (MPI: {aiDecision.predicted_mpi})</span>
                          </div>
                          <p className="text-[11px] text-zinc-300 leading-tight mb-1">
                            {aiDecision.action_recommendation}
                          </p>
                          <div className="text-[10px] text-emerald-400">
                            ✓ Suggested Window: {aiDecision.shadow_block_decision.window}
                          </div>
                        </div>
                      )}

                      <select
                        name="urgency"
                        value={formUrgency}
                        onChange={(e) => setFormUrgency(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-300 outline-none focus:border-amber-500 transition-colors"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Right Column: Voice Recorder */}
                  <div className="space-y-6">
                    <div>
                      
                      <div className="">
                        <VoiceRecorder />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-zinc-800">
                  <button type="submit" className="w-full bg-emerald-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-emerald-500 transition-all">
                    CONFIRM BLOCK & DISPATCH NOTIFICATIONS
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
