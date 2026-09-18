'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useMaintenanceStore } from '../../lib/store';
import { STATIONS } from '../../lib/stations';
import { Chatbot } from '../../components/chat/Chatbot';
import { VoiceRecorder } from '../../components/audio/VoiceRecorder';
import { EnterpriseHeader } from '../../components/ui/EnterpriseHeader';

interface RollingBlockItem {
  id: string;
  memoNo: string;
  dayOffset: number;
  dateStr: string;
  stationCode: string;
  stationName: string;
  trackId: string;
  zone: string;
  status: 'PLANNED' | 'VETTED' | 'SANCTIONED' | 'ACTIVE' | 'BURST' | 'COMPLETED';
  departments: string[];
  primaryDept: string;
  allocatedHours: number;
  uncoordinatedHours: number;
  hoursSaved: number;
  machinery: string[];
  timeWindow: string;
  powerBlockRequired: boolean;
  tsrSpeedKm: number;
  privateNumber?: string;
  remainingSeconds?: number;
}

interface TSRItem {
  id: string;
  stationCode: string;
  stationName: string;
  chainageKm: string;
  trackLine: string;
  currentSpeed: number;
  normalSpeed: number;
  reason: string;
  imposedDate: string;
  status: 'ACTIVE' | 'RELAXED' | 'NORMALIZED';
  stepStage: number; // 1: 20-30, 2: 45-50, 3: 75, 4: 100
}

interface TrainRegulation {
  trainNo: string;
  trainName: string;
  trainType: string;
  scheduledTime: string;
  actionTaken: string;
  detentionMinutes: number;
  alternateLine: string;
  status: 'DIVERTED' | 'REGULATED' | 'RESCHEDULED' | 'ON_TIME';
}

let memoCounter = 72;
let blockCounter = 340;

function generatePrivateNumbers(stationCode: string) {
  const seq = ++blockCounter;
  return {
    pn: `CTRL/MAS-${7000 + (seq % 2000)}`,
    smUp: `SM/${stationCode.split('-')[0] || 'TBM'}-${4000 + (seq % 3000)}`,
    smDn: `SM/${stationCode.split('-')[1] || 'MAS'}-${5000 + (seq % 3000)}`,
    tpc: `TPC/MAS-${8000 + (seq % 1500)}`
  };
}

function generateNewBlockMemos() {
  const memoSeq = ++memoCounter;
  const blockSeq = ++blockCounter;
  return {
    memo: `SR/MAS/RBP/2026/W38/${memoSeq}`,
    blockId: `RB-2026-${blockSeq}`
  };
}

export default function RBMSPage() {
  const [activeTab, setActiveTab] = useState<'RBP' | 'DEMAND' | 'CONTROLLER' | 'TSR' | 'REGULATION' | 'MEMO'>('RBP');
  const [zoneFilter, setZoneFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Maintenance store sync
  const addBlock = useMaintenanceStore((state) => state.addBlock);
  const removeBlock = useMaintenanceStore((state) => state.removeBlock);
  const applyAISchedule = useMaintenanceStore((state) => state.applyAISchedule);

  const handleSyncAISchedule = async () => {
    try {
      const res = await fetch('/api/ai-plan');
      const data = await res.json();
      if (data.success && data.weekly_blocks) {
        const todayStr = new Date().toISOString().split('T')[0];
        const blocksToApply = data.weekly_blocks.map((b: { track_id: string; departments_list: string }) => ({
          id: b.track_id,
          department: `[AI SHADOW BLOCK] ${b.departments_list}`,
          date: todayStr,
          fromTime: '00:00',
          toTime: '23:59',
          urgency: 'Critical'
        }));
        applyAISchedule(blocksToApply);
        setActionSuccessMessage(`✓ Synced ${blocksToApply.length} AI Coordinated Shadow Blocks! Live Digital Twin & 4-Aspect Signals updated.`);
        setTimeout(() => setActionSuccessMessage(null), 6000);
      }
    } catch (e) {
      console.error('Failed to sync AI schedule:', e);
    }
  };

  // 14-Day Rolling Schedule initial data
  const [rollingBlocks, setRollingBlocks] = useState<RollingBlockItem[]>([
    {
      id: 'RB-2026-001',
      memoNo: 'SR/MAS/RBP/2026/W37/01',
      dayOffset: 0,
      dateStr: 'Today',
      stationCode: 'TBM',
      stationName: 'Tambaram Junction',
      trackId: 'Tambaram - Mainline (Sec 1)',
      zone: 'Zone 3 (km 26.0 - 32.0)',
      status: 'ACTIVE',
      departments: ['Civil (TMS)', 'S&T (SMMS)', 'Electrical TRD (TDMS)'],
      primaryDept: 'Civil (TMS)',
      allocatedHours: 2.67,
      uncoordinatedHours: 8.5,
      hoursSaved: 5.83,
      machinery: ['CSM 09-32 Tamper', 'Tower Wagon (DETC 8W)'],
      timeWindow: '01:00 - 03:40',
      powerBlockRequired: true,
      tsrSpeedKm: 30,
      privateNumber: 'PN-MAS-7419',
      remainingSeconds: 4200
    },
    {
      id: 'RB-2026-002',
      memoNo: 'SR/MAS/RBP/2026/W37/02',
      dayOffset: 1,
      dateStr: 'Tomorrow',
      stationCode: 'GDY-STM',
      stationName: 'Guindy to St. Thomas Mount',
      trackId: 'Guindy to St. Thomas Mount Main Line',
      zone: 'Zone 2 (km 14.0 - 18.0)',
      status: 'SANCTIONED',
      departments: ['Electrical TRD', 'Civil Track'],
      primaryDept: 'Electrical TRD',
      allocatedHours: 2.50,
      uncoordinatedHours: 5.0,
      hoursSaved: 2.50,
      machinery: ['Tower Wagon RU-112', 'Welding Plant'],
      timeWindow: '01:15 - 03:45',
      powerBlockRequired: true,
      tsrSpeedKm: 45
    },
    {
      id: 'RB-2026-003',
      memoNo: 'SR/MAS/RBP/2026/W37/03',
      dayOffset: 2,
      dateStr: 'Day +2',
      stationCode: 'MSB',
      stationName: 'Chennai Beach Terminal',
      trackId: 'Chennai Beach - Mainline (Sec 1)',
      zone: 'Zone 1 (km 0.0 - 4.0)',
      status: 'SANCTIONED',
      departments: ['Civil Engineering', 'S&T Points'],
      primaryDept: 'Civil Engineering',
      allocatedHours: 2.75,
      uncoordinatedHours: 6.0,
      hoursSaved: 3.25,
      machinery: ['UNIMAT 08-275 Point Tamper'],
      timeWindow: '00:30 - 03:15',
      powerBlockRequired: false,
      tsrSpeedKm: 30
    },
    {
      id: 'RB-2026-004',
      memoNo: 'SR/MAS/RBP/2026/W37/04',
      dayOffset: 4,
      dateStr: 'Day +4',
      stationCode: 'PV-CMP',
      stationName: 'Pallavaram to Chromepet',
      trackId: 'Pallavaram to Chromepet Main Line',
      zone: 'Zone 2 (km 22.0 - 26.0)',
      status: 'VETTED',
      departments: ['S&T Track Circuits', 'Civil Track', 'Electrical TRD'],
      primaryDept: 'S&T',
      allocatedHours: 2.50,
      uncoordinatedHours: 7.0,
      hoursSaved: 4.50,
      machinery: ['CSM 09-32 Tamper', 'AFTC Calibration Kit'],
      timeWindow: '01:30 - 04:00',
      powerBlockRequired: true,
      tsrSpeedKm: 45
    },
    {
      id: 'RB-2026-005',
      memoNo: 'SR/MAS/RBP/2026/W37/05',
      dayOffset: 6,
      dateStr: 'Day +6',
      stationCode: 'MMNK-SKL',
      stationName: 'Maraimalai Nagar to Singaperumal Koil',
      trackId: 'Maraimalai Nagar to Singaperumal Koil Main Line',
      zone: 'Zone 4 (km 46.0 - 52.0)',
      status: 'VETTED',
      departments: ['Civil Track', 'Electrical TRD'],
      primaryDept: 'Civil Track',
      allocatedHours: 3.00,
      uncoordinatedHours: 6.5,
      hoursSaved: 3.50,
      machinery: ['BCM Ballast Cleaner', 'DGS Stabilizer', 'Tower Wagon'],
      timeWindow: '01:00 - 04:00',
      powerBlockRequired: true,
      tsrSpeedKm: 20
    },
    {
      id: 'RB-2026-006',
      memoNo: 'SR/MAS/RBP/2026/W37/06',
      dayOffset: 8,
      dateStr: 'Day +8',
      stationCode: 'CGL',
      stationName: 'Chengalpattu Junction',
      trackId: 'Chengalpattu Junction - Mainline (Sec 1)',
      zone: 'Zone 4 (km 58.0 - 62.0)',
      status: 'PLANNED',
      departments: ['Civil Engineering', 'S&T Interlocking', 'Electrical TRD'],
      primaryDept: 'Civil Engineering',
      allocatedHours: 2.75,
      uncoordinatedHours: 8.0,
      hoursSaved: 5.25,
      machinery: ['UNIMAT Points Tamper', 'OHE Rake'],
      timeWindow: '01:30 - 04:15',
      powerBlockRequired: true,
      tsrSpeedKm: 30
    },
    {
      id: 'RB-2026-007',
      memoNo: 'SR/MAS/RBP/2026/W37/07',
      dayOffset: 11,
      dateStr: 'Day +11',
      stationCode: 'MS',
      stationName: 'Chennai Egmore Junction',
      trackId: 'Chennai Egmore - Mainline (Sec 1)',
      zone: 'Zone 1 (km 4.0 - 8.0)',
      status: 'PLANNED',
      departments: ['S&T Interlocking', 'Civil Track'],
      primaryDept: 'S&T',
      allocatedHours: 2.50,
      uncoordinatedHours: 5.5,
      hoursSaved: 3.00,
      machinery: ['Relay Auto-Tester', 'Tie Tamping Unit'],
      timeWindow: '01:00 - 03:30',
      powerBlockRequired: false,
      tsrSpeedKm: 45
    }
  ]);

  // Section Controller State
  const [selectedBlockForControl, setSelectedBlockForControl] = useState<RollingBlockItem>(rollingBlocks[0]);
  const [controllerPrivateNumber, setControllerPrivateNumber] = useState('CTRL/MAS-8124');
  const [smUpPrivateNumber, setSmUpPrivateNumber] = useState('SM/TBM-4392');
  const [smDnPrivateNumber, setSmDnPrivateNumber] = useState('SM/PRGL-6218');
  const [tpcPermitNumber, setTpcPermitNumber] = useState('TPC/MAS-0941');
  const [checklist, setChecklist] = useState({
    pointsClamped: true,
    powerIsolated: true,
    earthingRodsPlaced: true,
    detonatorsDeployed: true
  });
  const [isBurstSimulated, setIsBurstSimulated] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Official Documents (Dossier) State
  const [selectedMemoType, setSelectedMemoType] = useState<'SR_DOM' | 'T_B_1525' | 'FORM_E1_PTW' | 'ST_T351' | 'FORM_T409'>('SR_DOM');

  // Caution Orders (TSR) Register State
  const [tsrList, setTsrList] = useState<TSRItem[]>([
    {
      id: 'TSR-2026-101',
      stationCode: 'TBM',
      stationName: 'Tambaram Yard',
      chainageKm: 'km 29.14 - 29.80',
      trackLine: 'Main Fast Down Line',
      currentSpeed: 30,
      normalSpeed: 100,
      reason: 'Post-CSM Tamping Ballast Settlement & Point 118 Overhaul',
      imposedDate: '2026-09-12',
      status: 'ACTIVE',
      stepStage: 1
    },
    {
      id: 'TSR-2026-102',
      stationCode: 'GDY-STM',
      stationName: 'Guindy - St. Thomas Mount',
      chainageKm: 'km 16.20 - 17.00',
      trackLine: 'Up Suburban Line',
      currentSpeed: 50,
      normalSpeed: 100,
      reason: 'Flash-Butt Rail Weld Replacement & Stressing',
      imposedDate: '2026-09-10',
      status: 'RELAXED',
      stepStage: 2
    },
    {
      id: 'TSR-2026-103',
      stationCode: 'MMNK',
      stationName: 'Maraimalai Nagar Yard',
      chainageKm: 'km 46.80 - 47.60',
      trackLine: 'Main Fast Up Line',
      currentSpeed: 20,
      normalSpeed: 100,
      reason: 'BCM Deep Screening & Cuttings Formation Repair',
      imposedDate: '2026-09-13',
      status: 'ACTIVE',
      stepStage: 1
    }
  ]);

  // Train Regulation Register
  const [trainRegulations] = useState<TrainRegulation[]>([
    {
      trainNo: '40001',
      trainName: 'Chennai Beach - Tambaram EMU Local',
      trainType: 'Suburban Passenger',
      scheduledTime: '01:15',
      actionTaken: 'Short-terminated at St. Thomas Mount',
      detentionMinutes: 0,
      alternateLine: 'Suburban Platform 2',
      status: 'REGULATED'
    },
    {
      trainNo: '12635',
      trainName: 'Vaigai Superfast Express (MS - MDU)',
      trainType: 'Superfast Mail/Exp',
      scheduledTime: '01:40',
      actionTaken: 'Diverted through Tambaram Fast Down Line (Zero Delay)',
      detentionMinutes: 0,
      alternateLine: 'Main Fast Down',
      status: 'DIVERTED'
    },
    {
      trainNo: '90021',
      trainName: 'Automobile Carrier Rake (WFD - CGL)',
      trainType: 'Freight Freight Rake',
      scheduledTime: '02:00',
      actionTaken: 'Regulated at Guduvancheri Loop Line (held 24 mins)',
      detentionMinutes: 24,
      alternateLine: 'Guduvancheri Loop 1',
      status: 'REGULATED'
    },
    {
      trainNo: '12636',
      trainName: 'Pandian Superfast Express (MDU - MS)',
      trainType: 'Superfast Mail/Exp',
      scheduledTime: '02:45',
      actionTaken: 'Cleared via Up Fast Line under Caution Order (45 km/h)',
      detentionMinutes: 3,
      alternateLine: 'Mainline Up',
      status: 'ON_TIME'
    },
    {
      trainNo: '40003',
      trainName: 'Chennai Beach - Chengalpattu EMU Local',
      trainType: 'Suburban Passenger',
      scheduledTime: '03:10',
      actionTaken: 'Rescheduled departure by +20 mins from Beach',
      detentionMinutes: 20,
      alternateLine: 'Suburban Main',
      status: 'RESCHEDULED'
    }
  ]);

  // Joint Demand Requisition Form State
  const [demandDept, setDemandDept] = useState('Civil (P-Way / TMS)');
  const [demandStFrom, setDemandStFrom] = useState('TBM');
  const [demandStTo, setDemandStTo] = useState('PRGL');
  const [demandLine, setDemandLine] = useState('Mainline Down Line');
  const [demandPossessionType, setDemandPossessionType] = useState('Integrated Traffic & Power Block');
  const [demandMachine, setDemandMachine] = useState('CSM 09-32 Continuous Action Tamper');
  const [demandHours, setDemandHours] = useState(2.75);
  const [demandPowerBlock, setDemandPowerBlock] = useState(true);
  const [demandTSR, setDemandTSR] = useState(30);
  const [demandJustification, setDemandJustification] = useState('Continuous Welded Rail (CWR) De-stressing & LC 28 Gate Overhaul');

  // Countdown timer & store hydration
  useEffect(() => {
    useMaintenanceStore.getState().hydrate();
    useMaintenanceStore.getState().fetchBlocks();

    const timer = setInterval(() => {
      setRollingBlocks((prev) => {
        let changed = false;
        const next = prev.map((b) => {
          if (b.status === 'ACTIVE' && b.remainingSeconds !== undefined && b.remainingSeconds > 0) {
            changed = true;
            return { ...b, remainingSeconds: b.remainingSeconds - 1 };
          }
          return b;
        });
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleGrantBlock = (block: RollingBlockItem) => {
    const isSafetyChecklistComplete = checklist.pointsClamped && checklist.powerIsolated && checklist.earthingRodsPlaced && checklist.detonatorsDeployed;
    if (!isSafetyChecklistComplete) {
      setActionSuccessMessage("⚠️ SAFETY INTERLOCKING INCOMPLETE: All 4 Indian Railways safety verification checks must be verified before transmitting Form T/B 1525!");
      setTimeout(() => setActionSuccessMessage(null), 6000);
      return;
    }

    const { pn, smUp, smDn, tpc } = generatePrivateNumbers(block.stationCode);

    setControllerPrivateNumber(pn);
    setSmUpPrivateNumber(smUp);
    setSmDnPrivateNumber(smDn);
    setTpcPermitNumber(tpc);

    setRollingBlocks((prev) =>
      prev.map((b) => (b.id === block.id ? { ...b, status: 'ACTIVE', privateNumber: pn, remainingSeconds: Math.round(b.allocatedHours * 3600) } : b))
    );
    setSelectedBlockForControl((prev) => ({ ...prev, status: 'ACTIVE', privateNumber: pn, remainingSeconds: Math.round(block.allocatedHours * 3600) }));

    // Apply to live digital twin maintenance store!
    addBlock({
      id: block.trackId,
      department: `[RBMS RBP] ${block.departments.join(' + ')}`,
      date: new Date().toISOString().split('T')[0],
      fromTime: block.timeWindow.split(' - ')[0] || '01:00',
      toTime: block.timeWindow.split(' - ')[1] || '03:30',
      urgency: 'Critical'
    });

    setActionSuccessMessage(`✓ POSSESSION GRANTED: ${block.memoNo} under Private Number ${pn}. Form T/B 1525 dispatched. Track active on Digital Twin Map!`);
    setTimeout(() => setActionSuccessMessage(null), 6000);
  };

  const handleClearBlock = (block: RollingBlockItem) => {
    setRollingBlocks((prev) => prev.map((b) => (b.id === block.id ? { ...b, status: 'COMPLETED', remainingSeconds: 0 } : b)));
    setSelectedBlockForControl((prev) => ({ ...prev, status: 'COMPLETED', remainingSeconds: 0 }));

    // Remove from digital twin map
    removeBlock(block.trackId);

    setActionSuccessMessage(`✓ TRACK SAFE & CLEARED: Form T/C 1525 executed for ${block.memoNo}. Line reopened for 100% timetable speed.`);
    setTimeout(() => setActionSuccessMessage(null), 6000);
  };

  const handleRelaxTsr = (tsrId: string) => {
    setTsrList((prev) =>
      prev.map((item) => {
        if (item.id === tsrId) {
          if (item.stepStage === 1) {
            return { ...item, currentSpeed: 50, stepStage: 2, status: 'RELAXED' };
          } else if (item.stepStage === 2) {
            return { ...item, currentSpeed: 75, stepStage: 3, status: 'RELAXED' };
          } else {
            return { ...item, currentSpeed: 100, stepStage: 4, status: 'NORMALIZED' };
          }
        }
        return item;
      })
    );
  };

  const handleRegisterDemand = (e: React.FormEvent) => {
    e.preventDefault();
    const stFromName = STATIONS.find((s) => s.id === demandStFrom)?.name || demandStFrom;
    const stToName = STATIONS.find((s) => s.id === demandStTo)?.name || demandStTo;
    const isYard = demandStFrom === demandStTo;
    const { memo: generatedMemo, blockId: generatedBlockId } = generateNewBlockMemos();
    const trackString = isYard ? `${stFromName} - Mainline (Sec 1)` : `${stFromName} to ${stToName} Main Line`;
    const stationDisplayName = isYard ? `${stFromName} Yard` : `${stFromName} to ${stToName}`;

    // Approximate chainage from station index
    const stIdx = STATIONS.findIndex(s => s.id === demandStFrom);
    const chainageKmStart = (Math.max(0, stIdx) * 2.4).toFixed(1);
    const chainageKmEnd = ((Math.max(0, stIdx) + (isYard ? 0.8 : 2.5)) * 2.4).toFixed(1);
    const zoneNum = stIdx < 4 ? 1 : stIdx < 11 ? 2 : stIdx < 18 ? 3 : 4;

    const newBlock: RollingBlockItem = {
      id: generatedBlockId,
      memoNo: generatedMemo,
      dayOffset: 3,
      dateStr: 'Day +3',
      stationCode: isYard ? demandStFrom : `${demandStFrom}-${demandStTo}`,
      stationName: stationDisplayName,
      trackId: trackString,
      zone: `Zone ${zoneNum} (km ${chainageKmStart} - ${chainageKmEnd})`,
      status: 'SANCTIONED',
      departments: [demandDept, 'Electrical TRD (OHE Shadow)', 'S&T Points Inspection'],
      primaryDept: demandDept,
      allocatedHours: Number(demandHours),
      uncoordinatedHours: Number(demandHours) * 2.4,
      hoursSaved: Number(demandHours) * 1.4,
      machinery: [demandMachine, 'Tower Wagon DETC'],
      timeWindow: '01:30 - 04:15',
      powerBlockRequired: demandPowerBlock,
      tsrSpeedKm: Number(demandTSR)
    };

    setRollingBlocks([newBlock, ...rollingBlocks]);
    setActiveTab('RBP');
    setActionSuccessMessage(`✓ DEMAND REGISTERED & CLUSTERED: ${generatedMemo} slotted into Week 38 Rolling Block Programme!`);
    setTimeout(() => setActionSuccessMessage(null), 6000);
  };

  const filteredBlocks = rollingBlocks.filter((b) => {
    if (zoneFilter !== 'ALL' && !b.zone.includes(zoneFilter)) return false;
    if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-200 font-sans flex flex-col selection:bg-blue-600/30 relative">
      {/* Enterprise Global Header */}
      <EnterpriseHeader badgeText="RBMS Suite • 14-Day Rolling Horizon" />

      {/* Subheader Banner */}
      <div className="border-b border-slate-800 bg-slate-900 px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-sm bg-amber-400 shadow-none shadow-amber-500/50" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono tracking-widest text-amber-400 uppercase font-bold">
                  Southern Railway // Chennai Division (MAS)
                </span>
                <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800/80 px-2 py-0.5 rounded-sm font-mono font-bold">
                  RBMS Suite
                </span>
              </div>
              <h1 className="text-lg md:text-lg font-black uppercase tracking-tight text-white mt-0.5">
                Rolling Block Management System
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncAISchedule}
              className="px-3.5 py-1.5 rounded-sm bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all shadow-none flex items-center gap-1.5"
              title="Sync Coordinated AI Shadow Blocks directly to Digital Twin"
            >
              Sync AI Shadow Blocks
            </button>
          </div>
        </div>
      </div>

      {/* Global Notification Banner */}
      {actionSuccessMessage && (
        <div className="bg-emerald-950/90 border-b border-emerald-500 text-emerald-100 px-4 py-3 text-xs font-mono font-bold flex justify-between items-center shadow-none">
          <span>{actionSuccessMessage}</span>
          <button onClick={() => setActionSuccessMessage(null)} className="text-emerald-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <nav className="border-b border-slate-800 bg-slate-900 px-4 flex flex-wrap gap-2 pt-3">
        {[
          { id: 'RBP', label: '14-Day Rolling Schedule' },
          { id: 'DEMAND', label: 'Joint Requisition' },
          { id: 'CONTROLLER', label: 'Controller Desk' },
          { id: 'TSR', label: 'TSR Caution Register' },
          { id: 'REGULATION', label: 'Train Regulations' },
          { id: 'MEMO', label: 'Sanction Dossier' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 font-mono text-xs font-semibold uppercase tracking-wider rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 ${
                isActive
                  ? 'text-white border-blue-500 bg-slate-800/80 font-bold'
                  : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Container */}
      <main className="flex-1 p-3 max-w-7xl mx-auto w-full space-y-3">
        {/* ==================================================================== */}
        {/* TAB 1: 14-DAY ROLLING BLOCK SCHEDULE (RBP)                           */}
        {/* ==================================================================== */}
        {activeTab === 'RBP' && (
          <div className="space-y-3">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-sm">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">RBP Horizon</span>
                <span className="text-lg font-black text-white">14 Days Rolling</span>
                <span className="text-[10px] text-emerald-400 font-mono block mt-1">✓ Weekly Re-evaluation</span>
              </div>
              <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-sm">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">Corridor Blocks Registered</span>
                <span className="text-lg font-black text-amber-400">{rollingBlocks.length} Slots</span>
                <span className="text-[10px] text-zinc-400 font-mono block mt-1">100% Shadow Co-utilized</span>
              </div>
              <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-sm">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">Track Hours Saved</span>
                <span className="text-lg font-black text-emerald-400">
                  +{rollingBlocks.reduce((acc, b) => acc + b.hoursSaved, 0).toFixed(1)} hrs
                </span>
                <span className="text-[10px] text-zinc-400 font-mono block mt-1">Line Closure Compression</span>
              </div>
              <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-sm">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">Current Active Blocks</span>
                <span className="text-lg font-black text-cyan-400">
                  {rollingBlocks.filter((b) => b.status === 'ACTIVE').length} Live
                </span>
                <span className="text-[10px] text-cyan-400 font-mono block mt-1">Active on Digital Twin</span>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-[#0c1018] border border-slate-700 p-2.5 rounded-sm flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono uppercase text-zinc-400 font-bold">Corridor Zone:</span>
                <select
                  value={zoneFilter}
                  onChange={(e) => setZoneFilter(e.target.value)}
                  className="bg-slate-800 border border-slate-600 text-xs font-mono text-zinc-200 rounded-sm px-3 py-1.5 outline-none"
                >
                  <option value="ALL">All Corridor Zones (km 0 to 60)</option>
                  <option value="Zone 1">Zone 1: Beach — Egmore (km 0 - 8)</option>
                  <option value="Zone 2">Zone 2: Egmore — Guindy — STM (km 8 - 20)</option>
                  <option value="Zone 3">Zone 3: Tambaram Junction (km 26 - 34)</option>
                  <option value="Zone 4">Zone 4: Guduvancheri — Chengalpattu (km 40 - 60)</option>
                </select>

                <span className="text-xs font-mono uppercase text-zinc-400 font-bold ml-2">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-800 border border-slate-600 text-xs font-mono text-zinc-200 rounded-sm px-3 py-1.5 outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ACTIVE">ACTIVE (In Progress)</option>
                  <option value="SANCTIONED">SANCTIONED (Sr. DOM Approved)</option>
                  <option value="VETTED">VETTED (Co-utilized)</option>
                  <option value="PLANNED">PLANNED (Advance RBP)</option>
                </select>
              </div>

              <div className="text-xs font-mono text-zinc-400">
                Displaying <span className="text-amber-400 font-bold">{filteredBlocks.length}</span> Rolling Block Possessions
              </div>
            </div>

            {/* Blocks Grid / Table */}
            <div className="space-y-3">
              {filteredBlocks.map((b) => (
                <div
                  key={b.id}
                  className={`bg-[#0c1018] border ${
                    b.status === 'ACTIVE'
                      ? 'border-cyan-500/70 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                      : b.status === 'SANCTIONED'
                      ? 'border-emerald-500/40'
                      : 'border-slate-700'
                  } p-5 rounded-sm transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2.5`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400 border border-amber-800/60 px-2 py-0.5 rounded">
                        {b.memoNo}
                      </span>
                      <span
                        className={`text-xs font-mono font-semibold uppercase px-2 py-0.5 rounded border ${
                          b.status === 'ACTIVE'
                            ? 'text-cyan-400 border-cyan-500'
                            : b.status === 'SANCTIONED'
                            ? 'text-emerald-400 border-emerald-600/60'
                            : 'text-zinc-400 border-slate-600'
                        }`}
                      >
                        {b.status}
                      </span>
                      <span className="text-xs font-mono text-zinc-500">• {b.dateStr}</span>
                      <span className="text-xs font-mono text-zinc-400">({b.timeWindow})</span>
                    </div>

                    <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                      {b.stationName} <span className="text-zinc-500 text-xs font-mono font-normal">[{b.trackId}]</span>
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-400">
                      <span>Depts:</span>
                      {b.departments.map((d, i) => (
                        <span key={i} className="border border-slate-600/80 px-2 py-0.5 rounded text-zinc-300 text-xs">
                          {d}
                        </span>
                      ))}
                      {b.powerBlockRequired && (
                        <span className="text-red-400 border border-red-800/80 px-2 py-0.5 rounded text-xs font-semibold">
                          ⚡ 25kV OHE Power Block
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] font-mono text-zinc-500 flex flex-wrap gap-3 pt-1">
                      <span>Machines: <strong className="text-zinc-300">{b.machinery.join(', ')}</strong></span>
                      <span>Imposed TSR: <strong className="text-amber-300">{b.tsrSpeedKm} km/h</strong></span>
                      {b.privateNumber && (
                        <span>Private Number: <strong className="text-cyan-300">{b.privateNumber}</strong></span>
                      )}
                    </div>
                  </div>

                  {/* Right Side Stats & Actions */}
                  <div className="flex flex-row lg:flex-col items-end justify-between gap-3 w-full lg:w-auto border-t lg:border-t-0 border-slate-700 pt-3 lg:pt-0">
                    <div className="text-right">
                      <span className="text-[10px] font-mono uppercase text-zinc-500 block">Downtime Saved</span>
                      <span className="text-base font-black text-emerald-400">+{b.hoursSaved.toFixed(1)} hrs</span>
                      <span className="text-[10px] text-zinc-500 block font-mono">Compressed to {b.allocatedHours}h</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {b.status !== 'ACTIVE' && b.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleGrantBlock(b)}
                          className="px-3.5 py-1.5 rounded-sm bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                        >
                          ⚡ Grant Block
                        </button>
                      )}
                      {b.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleClearBlock(b)}
                          className="px-3.5 py-1.5 rounded-sm bg-red-500 hover:bg-red-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                        >
                          ✓ Clear Track
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedBlockForControl(b);
                          setActiveTab('CONTROLLER');
                        }}
                        className="px-3 py-1.5 rounded-sm bg-slate-700 hover:bg-zinc-700 text-zinc-300 font-mono text-xs transition-colors cursor-pointer"
                      >
                        Desk &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: MULTI-DEPARTMENT JOINT DEMAND REQUISITION                      */}
        {/* ==================================================================== */}
        {activeTab === 'DEMAND' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            <div className="lg:col-span-8 bg-[#0c1018] border border-slate-700 rounded-sm p-3 shadow-none space-y-3">
              <div className="border-b border-slate-700 pb-4">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold tracking-wider">
                  SOUTHERN RAILWAY // DIVISIONAL REQUISITION PORTAL
                </span>
                <h2 className="text-lg font-bold text-white">File Multi-Department Corridor Possession Demand</h2>
                <p className="text-xs text-zinc-400 font-mono mt-1">
                  Submitted demands are automatically vetted against scheduled timetables and clustered into joint shadow blocks with S&T and Electrical TRD.
                </p>
              </div>

              <form onSubmit={handleRegisterDemand} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1 font-bold">
                      Primary Department
                    </label>
                    <select
                      value={demandDept}
                      onChange={(e) => setDemandDept(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-600 text-xs font-mono text-white p-2.5 rounded-sm outline-none focus:border-amber-500"
                    >
                      <option>Civil (P-Way / TMS)</option>
                      <option>Signalling & Telecom (S&T / SMMS)</option>
                      <option>Electrical Traction (TRD / TDMS)</option>
                      <option>Mechanical (C&W / Crane)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1 font-bold">
                      Possession Category
                    </label>
                    <select
                      value={demandPossessionType}
                      onChange={(e) => setDemandPossessionType(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-600 text-xs font-mono text-white p-2.5 rounded-sm outline-none focus:border-amber-500"
                    >
                      <option>Integrated Traffic & Power Block</option>
                      <option>Traffic Block Only</option>
                      <option>OHE Power Block Only</option>
                      <option>S&T Disconnection Shadow Block</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1 font-bold">
                      Station From
                    </label>
                    <select
                      value={demandStFrom}
                      onChange={(e) => setDemandStFrom(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-600 text-xs font-mono text-white p-2.5 rounded-sm outline-none focus:border-amber-500"
                    >
                      {STATIONS.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.id} - {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1 font-bold">
                      Station To
                    </label>
                    <select
                      value={demandStTo}
                      onChange={(e) => setDemandStTo(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-600 text-xs font-mono text-white p-2.5 rounded-sm outline-none focus:border-amber-500"
                    >
                      {STATIONS.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.id} - {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1 font-bold">
                      Track Line Type
                    </label>
                    <select
                      value={demandLine}
                      onChange={(e) => setDemandLine(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-600 text-xs font-mono text-white p-2.5 rounded-sm outline-none focus:border-amber-500"
                    >
                      <option>Suburban Down Line (Slow)</option>
                      <option>Suburban Up Line (Slow)</option>
                      <option>Main Fast Down Line</option>
                      <option>Main Fast Up Line</option>
                      <option>Platform Loop Track</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1 font-bold">
                      Primary Heavy Machinery
                    </label>
                    <select
                      value={demandMachine}
                      onChange={(e) => setDemandMachine(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-600 text-xs font-mono text-white p-2.5 rounded-sm outline-none focus:border-amber-500"
                    >
                      <option>CSM 09-32 Continuous Action Tamper</option>
                      <option>BCM Ballast Cleaning Machine</option>
                      <option>UNIMAT Points & Crossing Tamper</option>
                      <option>8-Wheeler Tower Wagon (DETC)</option>
                      <option>DGS Dynamic Track Stabilizer</option>
                      <option>Manual P-Way Gang Rake</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1 font-bold">
                      Requested Duration (Hours)
                    </label>
                    <input
                      type="number"
                      step="0.25"
                      min="1"
                      max="6"
                      value={demandHours}
                      onChange={(e) => setDemandHours(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-600 text-xs font-mono text-white p-2.5 rounded-sm outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1 font-bold">
                      Proposed TSR (km/h)
                    </label>
                    <select
                      value={demandTSR}
                      onChange={(e) => setDemandTSR(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-600 text-xs font-mono text-white p-2.5 rounded-sm outline-none focus:border-amber-500"
                    >
                      <option value="20">20 km/h (Deep Screening)</option>
                      <option value="30">30 km/h (Initial Tamping Pass)</option>
                      <option value="45">45 km/h (Weld Renewal)</option>
                      <option value="75">75 km/h (Minor Works)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1 font-bold">
                    Technical Scope & Justification
                  </label>
                  <textarea
                    rows={3}
                    value={demandJustification}
                    onChange={(e) => setDemandJustification(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-600 text-xs font-mono text-white p-2.5 rounded-sm outline-none focus:border-amber-500"
                    placeholder="Enter engineering justification, sleeper counts, weld counts, OHE section..."
                  />
                </div>

                <div className="flex items-center gap-2 p-3 bg-amber-950/20 border border-amber-800/40 rounded-sm">
                  <input
                    type="checkbox"
                    id="pwrBlock"
                    checked={demandPowerBlock}
                    onChange={(e) => setDemandPowerBlock(e.target.checked)}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <label htmlFor="pwrBlock" className="text-xs font-mono text-zinc-300">
                    Mandatory 25kV Traction Power Isolation required (Requires TRD Earthing Discharge Rods)
                  </label>
                </div>

                {/* Voice Dispatch Audio Attachment */}
                <div className="flex items-center justify-between p-3.5 bg-slate-900/90 rounded-sm border border-slate-700">
                  <div>
                    <span className="text-xs font-mono font-bold text-white block">Voice Dispatch Recording (Cloudinary Audio)</span>
                    <span className="text-[11px] text-zinc-400">Record voice directive to attach real-time audio note to this demand requisition.</span>
                  </div>
                  <VoiceRecorder />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-sm bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] cursor-pointer"
                >
                  🚀 Submit & Auto-Cluster into Rolling Block Programme
                </button>
              </form>
            </div>

            {/* Explainer Sidebar */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-slate-900 border border-slate-700 p-5 rounded-sm">
                <h3 className="text-sm font-bold text-white uppercase font-mono mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-sm bg-amber-400" />
                  RBMS Integrated Vetting Policy
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  As per Southern Railway safety circular, standalone track closures for Civil Engineering are automatically bundled with S&T Point Overhauls and TRD Tower Wagon inspections.
                </p>
                <div className="mt-4 p-3 bg-slate-800/90 rounded-sm border border-slate-700 text-[11px] font-mono text-zinc-300 space-y-1">
                  <div>• Max Permitted Work Duration: <strong>03h 30m</strong></div>
                  <div>• Default Window: <strong>00:45 - 04:15 hrs</strong></div>
                  <div>• Subordinate Dept: <strong>Auto-assigned</strong></div>
                </div>
              </div>

              <div className="bg-emerald-950/20 border border-emerald-800/40 p-5 rounded-sm">
                <h3 className="text-sm font-bold text-emerald-300 uppercase font-mono mb-2">
                  ✓ Machine Rakes Available
                </h3>
                <div className="text-xs font-mono text-zinc-300 space-y-2">
                  <div className="flex justify-between">
                    <span>CSM 09-32 (Tambaram Sdg):</span>
                    <span className="text-emerald-400 font-bold">READY</span>
                  </div>
                  <div className="flex justify-between">
                    <span>BCM-34 (Chengalpattu):</span>
                    <span className="text-emerald-400 font-bold">READY</span>
                  </div>
                  <div className="flex justify-between">
                    <span>UNIMAT-204 (Egmore):</span>
                    <span className="text-emerald-400 font-bold">READY</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DETC Tower Wagon (Guindy):</span>
                    <span className="text-emerald-400 font-bold">READY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: SECTION CONTROLLER LIVE DESK (GRANT, BURST & SAFETY)          */}
        {/* ==================================================================== */}
        {activeTab === 'CONTROLLER' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            {/* Left Column: Active Block Selector & Status */}
            <div className="lg:col-span-5 bg-[#0c1018] border border-slate-700 rounded-sm p-3 shadow-none space-y-5">
              <div className="border-b border-slate-700 pb-3 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">OPERATIONS DESK</span>
                  <h3 className="text-lg font-bold text-white">Section Controller Console</h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-zinc-500 block">DESK ID</span>
                  <span className="text-xs font-mono text-cyan-400">CTRL/MAS/SUBURBAN</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1 font-bold">
                  Select Corridor Block to Command
                </label>
                <select
                  value={selectedBlockForControl.id}
                  onChange={(e) => {
                    const found = rollingBlocks.find((b) => b.id === e.target.value);
                    if (found) setSelectedBlockForControl(found);
                  }}
                  className="w-full bg-slate-800 border border-slate-600 text-xs font-mono text-white p-2.5 rounded-sm outline-none focus:border-amber-500"
                >
                  {rollingBlocks.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.memoNo} — {b.stationName} ({b.status})
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Block Dossier */}
              <div className="bg-slate-900 p-2.5 rounded-sm border border-slate-700 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Location:</span>
                  <span className="text-white font-bold">{selectedBlockForControl.stationName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Track Line:</span>
                  <span className="text-amber-400">{selectedBlockForControl.trackId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Allocated Duration:</span>
                  <span className="text-white">{selectedBlockForControl.allocatedHours} hrs ({selectedBlockForControl.timeWindow})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Status:</span>
                  <span className="font-bold text-cyan-400">{selectedBlockForControl.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Private Number:</span>
                  <span className="font-bold text-emerald-400">{selectedBlockForControl.privateNumber || 'Awaiting Grant'}</span>
                </div>
              </div>

              {/* Live Countdown & Burst Detection */}
              {selectedBlockForControl.status === 'ACTIVE' && (
                <div className={`p-2.5 rounded-sm border ${isBurstSimulated ? 'bg-red-950/60 border-red-500 animate-pulse' : 'bg-cyan-950/40 border-cyan-500/60'}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-xs font-mono font-bold ${isBurstSimulated ? 'text-red-400' : 'text-cyan-400'}`}>
                      {isBurstSimulated ? '🚨 CRITICAL: BLOCK BURST! (OVERSTAYING)' : '⏱️ LIVE POSSESSION COUNTDOWN'}
                    </span>
                    <button
                      onClick={() => setIsBurstSimulated(!isBurstSimulated)}
                      className="text-[10px] font-mono underline text-zinc-400 hover:text-white cursor-pointer"
                    >
                      {isBurstSimulated ? 'Reset Burst' : 'Simulate Burst'}
                    </button>
                  </div>

                  <div className="text-lg font-black font-mono text-white tracking-widest text-center py-2">
                    {isBurstSimulated
                      ? '+ 00:14:32 OVERSTAY'
                      : `${Math.floor((selectedBlockForControl.remainingSeconds || 3600) / 3600)
                          .toString()
                          .padStart(2, '0')}:${Math.floor(((selectedBlockForControl.remainingSeconds || 3600) % 3600) / 60)
                          .toString()
                          .padStart(2, '0')}:${((selectedBlockForControl.remainingSeconds || 3600) % 60)
                          .toString()
                          .padStart(2, '0')}`}
                  </div>

                  {isBurstSimulated && (
                    <div className="text-[11px] font-mono text-red-300 mt-2 bg-red-900/40 p-2.5 rounded-sm border border-red-700/60 space-y-1">
                      <div className="font-bold text-red-200 flex items-center gap-1.5">
                        <span>🚨</span> BURST ESCALATION LOGGED IN COA (#MAS-INC-8912)
                      </div>
                      <div>• Defaulter Branch: <strong>{selectedBlockForControl.primaryDept}</strong></div>
                      <div>• Penalty Charge: <strong className="text-amber-300">₹1,45,200</strong> (COA Operational Delay Debit)</div>
                      <div>• Relief Action: <strong>Emergency Diesel Tower Wagon (TW-RU-112)</strong> alerted at Tambaram Loco Siding for emergency clearance.</div>
                    </div>
                  )}
                </div>
              )}

              {/* Grant / Clear Action Buttons */}
              <div className="pt-2 flex gap-3">
                {selectedBlockForControl.status !== 'ACTIVE' ? (
                  <button
                    onClick={() => handleGrantBlock(selectedBlockForControl)}
                    disabled={!(checklist.pointsClamped && checklist.powerIsolated && checklist.earthingRodsPlaced && checklist.detonatorsDeployed)}
                    className={`flex-1 py-3 px-4 rounded-sm font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-none cursor-pointer ${
                      checklist.pointsClamped && checklist.powerIsolated && checklist.earthingRodsPlaced && checklist.detonatorsDeployed
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-950'
                        : 'bg-slate-700 text-zinc-500 cursor-not-allowed border border-slate-600'
                    }`}
                  >
                    {checklist.pointsClamped && checklist.powerIsolated && checklist.earthingRodsPlaced && checklist.detonatorsDeployed
                      ? '⚡ Grant Line Possession (Form T/B 1525)'
                      : '⚠️ Verify 4 Safety Points First'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleClearBlock(selectedBlockForControl)}
                    className="flex-1 py-3 px-4 rounded-sm bg-red-600 hover:bg-red-500 text-white font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-none cursor-pointer"
                  >
                    ✓ Track Safe & Clear (Form T/C 1525)
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: 4-Point Safety Interlocking Checklist */}
            <div className="lg:col-span-7 bg-[#0c1018] border border-slate-700 rounded-sm p-3 shadow-none space-y-3">
              <div className="border-b border-slate-700 pb-3 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">SAFETY PROTOCOL</span>
                  <h3 className="text-lg font-bold text-white">4-Point Section Interlocking Sign-off</h3>
                </div>
                <span className="text-[11px] font-mono text-zinc-400 bg-slate-800 border border-slate-700 px-2.5 py-1 rounded">
                  G&SR Rules 15.06 / 15.08
                </span>
              </div>

              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3.5 bg-slate-900 rounded-sm border border-slate-700 cursor-pointer hover:border-slate-600 transition-colors">
                  <input
                    type="checkbox"
                    checked={checklist.pointsClamped}
                    onChange={(e) => setChecklist({ ...checklist, pointsClamped: e.target.checked })}
                    className="w-5 h-5 mt-0.5 accent-emerald-500"
                  />
                  <div>
                    <span className="text-xs font-mono font-bold text-white block">
                      1. Facing Points Clamped & Padlocked
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      All facing points leading into the isolated block section clamped, spiked, and padlocked away from work zone.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 bg-slate-900 rounded-sm border border-slate-700 cursor-pointer hover:border-slate-600 transition-colors">
                  <input
                    type="checkbox"
                    checked={checklist.powerIsolated}
                    onChange={(e) => setChecklist({ ...checklist, powerIsolated: e.target.checked })}
                    className="w-5 h-5 mt-0.5 accent-emerald-500"
                  />
                  <div>
                    <span className="text-xs font-mono font-bold text-white block">
                      2. 25kV Traction Catenary De-energized
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      Feeder sub-station circuit breaker tripped. No electrical potential on contact wire confirmed by TRD supervisor.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 bg-slate-900 rounded-sm border border-slate-700 cursor-pointer hover:border-slate-600 transition-colors">
                  <input
                    type="checkbox"
                    checked={checklist.earthingRodsPlaced}
                    onChange={(e) => setChecklist({ ...checklist, earthingRodsPlaced: e.target.checked })}
                    className="w-5 h-5 mt-0.5 accent-emerald-500"
                  />
                  <div>
                    <span className="text-xs font-mono font-bold text-white block">
                      3. Dual Discharge Earthing Rods Clamped
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      Portable earthing discharge rods clamped on both the Up and Down approaches to provide zero-voltage earth shielding.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 bg-slate-900 rounded-sm border border-slate-700 cursor-pointer hover:border-slate-600 transition-colors">
                  <input
                    type="checkbox"
                    checked={checklist.detonatorsDeployed}
                    onChange={(e) => setChecklist({ ...checklist, detonatorsDeployed: e.target.checked })}
                    className="w-5 h-5 mt-0.5 accent-emerald-500"
                  />
                  <div>
                    <span className="text-xs font-mono font-bold text-white block">
                      4. Red Banner Flags & Detonator Protection Deployed
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      Banner flags erected at 600m; 3 detonators placed 10m apart at 1200m from the work zone as per G&SR rules.
                    </span>
                  </div>
                </label>
              </div>

              {/* 4-Channel Private Number Exchange Console */}
              <div className="p-2.5 bg-slate-900 rounded-sm border border-slate-700 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-700/80 pb-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">4-CHANNEL PRIVATE NUMBER EXCHANGE CONSOLE</span>
                    <span className="text-[11px] font-mono text-zinc-400">Interlocking authorization between Controller, Station Masters & TPC</span>
                  </div>
                  <button
                    onClick={() => {
                      const stA = selectedBlockForControl.stationCode.split('-')[0] || 'TBM';
                      const stB = selectedBlockForControl.stationCode.split('-')[1] || 'MAS';
                      setControllerPrivateNumber(`CTRL/MAS-${Math.floor(1000 + Math.random() * 9000)}`);
                      setSmUpPrivateNumber(`SM/${stA}-${Math.floor(1000 + Math.random() * 9000)}`);
                      setSmDnPrivateNumber(`SM/${stB}-${Math.floor(1000 + Math.random() * 9000)}`);
                      setTpcPermitNumber(`TPC/MAS-${Math.floor(1000 + Math.random() * 9000)}`);
                    }}
                    className="text-[10px] font-mono text-amber-400 hover:text-amber-300 underline cursor-pointer"
                  >
                    ↻ Regenerate All
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  <div className="bg-slate-800/90 border border-slate-700 p-2.5 rounded-sm">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase block">1. Section Controller</span>
                    <span className="text-xs font-mono font-bold text-cyan-400 block mt-0.5">{controllerPrivateNumber}</span>
                  </div>
                  <div className="bg-slate-800/90 border border-slate-700 p-2.5 rounded-sm">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase block">2. SM Up-Station</span>
                    <span className="text-xs font-mono font-bold text-emerald-400 block mt-0.5">{smUpPrivateNumber}</span>
                  </div>
                  <div className="bg-slate-800/90 border border-slate-700 p-2.5 rounded-sm">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase block">3. SM Down-Station</span>
                    <span className="text-xs font-mono font-bold text-emerald-400 block mt-0.5">{smDnPrivateNumber}</span>
                  </div>
                  <div className="bg-slate-800/90 border border-slate-700 p-2.5 rounded-sm">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase block">4. TPC Power Permit</span>
                    <span className="text-xs font-mono font-bold text-amber-400 block mt-0.5">{tpcPermitNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: TEMPORARY SPEED RESTRICTIONS (TSR) & CAUTION ORDERS           */}
        {/* ==================================================================== */}
        {activeTab === 'TSR' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-slate-700 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">PERMANENT & TEMPORARY SPEED REGISTRY</span>
                <h2 className="text-lg font-bold text-white">Active Caution Orders & Stepped Relaxation</h2>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  Stepped speed recovery protocol: Day 1 (20/30 km/h) &rarr; Day 3 (50 km/h) &rarr; Day 7 (75 km/h) &rarr; Normal (100 km/h).
                </p>
              </div>
              <span className="text-xs font-mono bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-sm text-zinc-300">
                Active Restrictions: <strong className="text-amber-400">{tsrList.filter((t) => t.status !== 'NORMALIZED').length}</strong>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300 font-mono">
                <thead className="bg-slate-800 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-4">TSR ID</th>
                    <th className="py-3 px-4">Station & Chainage</th>
                    <th className="py-3 px-4">Track Line</th>
                    <th className="py-3 px-4">Imposed Speed</th>
                    <th className="py-3 px-4">Engineering Reason</th>
                    <th className="py-3 px-4">Relaxation Stage</th>
                    <th className="py-3 px-4 text-right">Speed Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {tsrList.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-800 transition-colors">
                      <td className="py-3 px-4 text-cyan-400 font-bold">{t.id}</td>
                      <td className="py-3 px-4">
                        <span className="text-white font-bold">{t.stationName}</span>
                        <span className="block text-[10px] text-zinc-500">{t.chainageKm}</span>
                      </td>
                      <td className="py-3 px-4 text-zinc-300">{t.trackLine}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-sm font-black px-2.5 py-1 rounded ${
                            t.currentSpeed <= 30
                              ? 'bg-red-950 text-red-400 border border-red-800/60'
                              : t.currentSpeed <= 50
                              ? 'bg-amber-950 text-amber-400 border border-amber-800/60'
                              : 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                          }`}
                        >
                          {t.currentSpeed} km/h
                        </span>
                      </td>
                      <td className="py-3 px-4 text-zinc-400 max-w-xs">{t.reason}</td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-zinc-300">Stage {t.stepStage} / 4</span>
                        <span className="block text-[10px] text-zinc-500">{t.status}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedMemoType('FORM_T409');
                              setActiveTab('MEMO');
                            }}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono text-[11px] rounded-sm border border-slate-600 transition-colors cursor-pointer"
                          >
                            T/409 Form
                          </button>
                          {t.status !== 'NORMALIZED' ? (
                            <button
                              onClick={() => handleRelaxTsr(t.id)}
                              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-bold font-mono text-[11px] rounded-sm transition-colors cursor-pointer"
                            >
                              Relax &uarr;
                            </button>
                          ) : (
                            <span className="text-emerald-400 font-bold text-xs">✓ Normal</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 5: TRAIN REGULATION & DETENTION AUDIT                             */}
        {/* ==================================================================== */}
        {activeTab === 'REGULATION' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-slate-700 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">OPERATING TRAFFIC AUDIT</span>
                <h2 className="text-lg font-bold text-white">Train Regulation & Punctuality Protection</h2>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  Chronological log of suburban EMU, Express, and freight traffic regulation during corridor possessions.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-sm text-xs font-mono">
                  Punctuality Preserved: <strong className="text-emerald-400">97.8%</strong>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300 font-mono">
                <thead className="bg-slate-800 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-4">Train No</th>
                    <th className="py-3 px-4">Train Name</th>
                    <th className="py-3 px-4">Service Category</th>
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4">Regulation Directive</th>
                    <th className="py-3 px-4">Alternate Line Path</th>
                    <th className="py-3 px-4 text-right">Detention</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {trainRegulations.map((tr) => (
                    <tr key={tr.trainNo} className="hover:bg-slate-800 transition-colors">
                      <td className="py-3 px-4 text-cyan-400 font-bold">{tr.trainNo}</td>
                      <td className="py-3 px-4 text-white font-bold">{tr.trainName}</td>
                      <td className="py-3 px-4 text-zinc-400">{tr.trainType}</td>
                      <td className="py-3 px-4 text-amber-300">{tr.scheduledTime}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            tr.status === 'DIVERTED'
                              ? 'bg-blue-950 text-blue-300 border border-blue-800'
                              : tr.status === 'REGULATED'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : tr.status === 'RESCHEDULED'
                              ? 'bg-purple-950 text-purple-300 border border-purple-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          {tr.actionTaken}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-zinc-300">{tr.alternateLine}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={tr.detentionMinutes > 0 ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                          {tr.detentionMinutes} mins
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 6: OFFICIAL SOUTHERN RAILWAY BLOCK SANCTION MEMO & STATUTORY FORMS*/}
        {/* ==================================================================== */}
        {activeTab === 'MEMO' && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 border-b border-slate-700 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">STATUTORY OPERATING RECORDS</span>
                <h2 className="text-lg font-bold text-white">Southern Railway Official Block Dossier & Forms</h2>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  Conforming to Indian Railways General & Subsidiary Rules (G&SR), ACTM, and Operating Manuals.
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-sm bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-mono text-xs font-bold transition-all shadow-none hover:from-amber-400 hover:to-yellow-500 flex items-center gap-2 cursor-pointer"
              >
                <span>🖨️</span> Print Selected Statutory Form
              </button>
            </div>

            {/* Document Selector Sub-tabs */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900/80 border border-slate-700 rounded-sm">
              <button
                onClick={() => setSelectedMemoType('SR_DOM')}
                className={`px-3 py-1.5 rounded-sm font-mono text-xs transition-all cursor-pointer ${
                  selectedMemoType === 'SR_DOM'
                    ? 'bg-amber-500 text-black font-bold shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                📜 Sr. DOM Master Sanction Order
              </button>
              <button
                onClick={() => setSelectedMemoType('T_B_1525')}
                className={`px-3 py-1.5 rounded-sm font-mono text-xs transition-all cursor-pointer ${
                  selectedMemoType === 'T_B_1525'
                    ? 'bg-amber-500 text-black font-bold shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                🚦 Form T/B 1525 (Line Block Authority)
              </button>
              <button
                onClick={() => setSelectedMemoType('FORM_E1_PTW')}
                className={`px-3 py-1.5 rounded-sm font-mono text-xs transition-all cursor-pointer ${
                  selectedMemoType === 'FORM_E1_PTW'
                    ? 'bg-amber-500 text-black font-bold shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                ⚡ Form E-1 (PTW Traction Permit)
              </button>
              <button
                onClick={() => setSelectedMemoType('ST_T351')}
                className={`px-3 py-1.5 rounded-sm font-mono text-xs transition-all cursor-pointer ${
                  selectedMemoType === 'ST_T351'
                    ? 'bg-amber-500 text-black font-bold shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                🔧 Form S&T (T/351 Disconnection Memo)
              </button>
              <button
                onClick={() => setSelectedMemoType('FORM_T409')}
                className={`px-3 py-1.5 rounded-sm font-mono text-xs transition-all cursor-pointer ${
                  selectedMemoType === 'FORM_T409'
                    ? 'bg-amber-500 text-black font-bold shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                ⚠️ Form T/409 (Caution Order)
              </button>
            </div>

            {/* DOCUMENT 1: SR. DOM MASTER SANCTION ORDER */}
            {selectedMemoType === 'SR_DOM' && (
              <div className="bg-white text-black p-8 rounded-sm shadow-none font-serif space-y-3 max-w-4xl mx-auto border border-zinc-300">
                <div className="text-center border-b-2 border-black pb-4 space-y-1">
                  <h2 className="text-lg font-black uppercase tracking-wider">SOUTHERN RAILWAY</h2>
                  <h3 className="text-base font-bold uppercase">OFFICE OF THE SENIOR DIVISIONAL OPERATIONS MANAGER (SR. DOM)</h3>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-700">CHENNAI DIVISION (MAS) — NGO ANNEXE, PARK TOWN, CHENNAI 600003</h4>
                  <div className="text-xs font-mono pt-2 font-bold flex justify-between border-t border-zinc-400 mt-2">
                    <span>REF NO: SR/MAS/RBP/2026/W37/01</span>
                    <span>DATE: 13-SEP-2026</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-bold uppercase tracking-tight">
                    SUB: SANCTION OF INTEGRATED ROLLING CORRIDOR BLOCK (TRAFFIC & POWER) ON TAMBARAM SECTION.
                  </p>
                  <p className="text-xs text-zinc-700 mt-1 italic">
                    Ref: Joint Demand Requisition No. SR/MAS/ENGG-ST-TRD/TBM-2026 submitted by SSE/P-Way/TBM, SSE/Sig/TBM, and SSE/TRD/TBM.
                  </p>
                </div>

                <table className="w-full text-xs border border-black border-collapse text-left font-sans">
                  <tbody>
                    <tr className="border-b border-black">
                      <td className="p-2 font-bold bg-zinc-100 w-1/3 border-r border-black">Section / Station Limits</td>
                      <td className="p-2">Tambaram Junction (TBM) — km 28.00 to km 31.50</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 font-bold bg-zinc-100 border-r border-black">Line Nominated</td>
                      <td className="p-2">Main Fast Down Line & Crossover Throat Points 118A/B</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 font-bold bg-zinc-100 border-r border-black">Possession Duration</td>
                      <td className="p-2">02 Hours 40 Minutes (From 01:00 hrs to 03:40 hrs)</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 font-bold bg-zinc-100 border-r border-black">Coordinated Departments</td>
                      <td className="p-2">1. Civil (P-Way Track Tamping) &bull; 2. S&T (Point 118 Overhaul) &bull; 3. TRD (25kV Catenary Wire Tuning)</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 font-bold bg-zinc-100 border-r border-black">Specialized Machinery Deployed</td>
                      <td className="p-2">CSM 09-32 Tamper + 8-Wheeler DETC Tower Wagon</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-2 font-bold bg-zinc-100 border-r border-black">Traction Isolation (Power Block)</td>
                      <td className="p-2">Permitted. Feeder Isolator TBM-SS-02 to be opened. Dual earthing discharge rods mandatory.</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold bg-zinc-100 border-r border-black">Speed Restriction Imposed</td>
                      <td className="p-2">30 km/h Caution Order between km 29.14 and 29.80 upon track handover.</td>
                    </tr>
                  </tbody>
                </table>

                <div className="text-xs space-y-1.5 text-zinc-800 leading-relaxed font-sans">
                  <p><strong>SPECIAL CONDITIONS:</strong></p>
                  <p>1. Section Controller / MAS shall verify 4-point safety check before communicating private number.</p>
                  <p>2. No block bursting will be permitted. Any detention exceeding sanctioned time will be debited to defaulting branch.</p>
                  <p>3. Passenger trains 40001 and 12635 to be regulated and diverted as per regulation schedule.</p>
                </div>

                <div className="pt-8 grid grid-cols-3 text-center text-xs font-sans font-bold border-t border-black">
                  <div>
                    <div className="h-10 text-zinc-400 italic">[Signed digitally]</div>
                    <div>Sr. Divisional Engineer (Co-ord)</div>
                    <div className="text-[10px] text-zinc-600">Southern Railway / MAS</div>
                  </div>
                  <div>
                    <div className="h-10 text-zinc-400 italic">[Signed digitally]</div>
                    <div>Sr. Divl. Signal & Telecom Engr</div>
                    <div className="text-[10px] text-zinc-600">Southern Railway / MAS</div>
                  </div>
                  <div>
                    <div className="h-10 text-zinc-400 italic">[Signed digitally]</div>
                    <div>Sr. Divisional Operations Manager</div>
                    <div className="text-[10px] text-zinc-600">Southern Railway / MAS</div>
                  </div>
                </div>
              </div>
            )}

            {/* DOCUMENT 2: STATUTORY FORM T/B 1525 (LINE BLOCK AUTHORITY) */}
            {selectedMemoType === 'T_B_1525' && (
              <div className="bg-white text-black p-8 rounded-sm shadow-none font-serif space-y-3 max-w-4xl mx-auto border border-zinc-300">
                <div className="text-center border-b-2 border-black pb-3 space-y-1">
                  <h2 className="text-lg font-black uppercase tracking-wider">SOUTHERN RAILWAY — OPERATING DEPARTMENT</h2>
                  <h3 className="text-sm font-bold uppercase tracking-wide bg-zinc-100 py-1 border border-black">
                    FORM T/B 1525 // AUTHORITY TO IMPOSE BLOCK ON DOUBLE / MULTIPLE LINES
                  </h3>
                  <div className="text-xs font-mono pt-1 flex justify-between">
                    <span>STATION: TAMBARAM (TBM)</span>
                    <span>DATE: 13-SEP-2026</span>
                    <span>TIME: 01:00 HRS</span>
                  </div>
                </div>

                <div className="text-xs font-sans space-y-3 leading-relaxed">
                  <p>
                    <strong>TO:</strong> Station Master on Duty at <u>Tambaram (TBM)</u> and Station Master at <u>Perungalathur (PRGL)</u>.
                  </p>
                  <p>
                    Line Block is hereby granted on <strong>Main Fast Down Line</strong> between Tambaram and Perungalathur from <strong>01:00 hrs</strong> to <strong>03:40 hrs</strong> for engineering works with <strong>CSM 09-32 Tamper & Tower Wagon</strong>.
                  </p>

                  <table className="w-full text-xs border border-black border-collapse text-left my-2 font-mono">
                    <tbody>
                      <tr className="border-b border-black">
                        <td className="p-2 font-bold bg-zinc-100 w-1/2 border-r border-black">Section Controller Private Number</td>
                        <td className="p-2 font-bold text-base">{controllerPrivateNumber}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-2 font-bold bg-zinc-100 border-r border-black">Station Master (Up Station) Private Number</td>
                        <td className="p-2 font-bold text-base">{smUpPrivateNumber}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-2 font-bold bg-zinc-100 border-r border-black">Station Master (Down Station) Private Number</td>
                        <td className="p-2 font-bold text-base">{smDnPrivateNumber}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold bg-zinc-100 border-r border-black">Traction Power Permit to Work (PTW)</td>
                        <td className="p-2 font-bold text-base">{tpcPermitNumber}</td>
                      </tr>
                    </tbody>
                  </table>

                  <p className="bg-yellow-50 p-2.5 border border-yellow-300 text-[11px]">
                    <strong>INTERLOCKING COMPLIANCE CERTIFICATE:</strong> All facing points have been clamped, bolted, and padlocked against the blocked line. Signals governing entry into the section placed at &lsquo;ON&rsquo; (Danger) and reminder collars placed on lever frames / VDU console.
                  </p>
                </div>

                <div className="pt-6 border-t-2 border-black">
                  <h4 className="text-xs font-bold uppercase mb-2">FORM T/C 1525 (REOPENING MEMO / LINE CLEARANCE CERTIFICATE)</h4>
                  <p className="text-xs font-sans text-zinc-700 italic mb-4">
                    To be completed by SSE/P-Way upon work completion: &ldquo;Track between km 28.00 and 31.50 is certified safe for train movement at 30 km/h under Caution Order T/409. All men, machines, discharge rods, and banner flags removed.&rdquo;
                  </p>
                  <div className="grid grid-cols-2 text-center text-xs font-sans font-bold pt-4 border-t border-zinc-400">
                    <div>
                      <div className="h-8 italic text-zinc-400">[Signed]</div>
                      <div>Site Supervisor (SSE/P-Way/TBM)</div>
                    </div>
                    <div>
                      <div className="h-8 italic text-zinc-400">[Authenticated via PN]</div>
                      <div>Chief Section Controller (MAS Control)</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DOCUMENT 3: FORM E-1 (PTW TRACTION POWER PERMIT) */}
            {selectedMemoType === 'FORM_E1_PTW' && (
              <div className="bg-white text-black p-8 rounded-sm shadow-none font-serif space-y-3 max-w-4xl mx-auto border border-zinc-300">
                <div className="text-center border-b-2 border-black pb-3 space-y-1">
                  <h2 className="text-lg font-black uppercase tracking-wider">SOUTHERN RAILWAY — ELECTRICAL (TRD) BRANCH</h2>
                  <h3 className="text-sm font-bold uppercase tracking-wide bg-zinc-100 py-1 border border-black">
                    FORM E-1 // PERMIT TO WORK (PTW) ON 25 kV AC TRACTION OVERHEAD EQUIPMENT
                  </h3>
                  <div className="text-xs font-mono pt-1 flex justify-between">
                    <span>PERMIT NO: {tpcPermitNumber}</span>
                    <span>TSS: TAMBARAM SUB-STATION</span>
                    <span>DATE: 13-SEP-2026</span>
                  </div>
                </div>

                <div className="text-xs font-sans space-y-3 leading-relaxed">
                  <p>
                    <strong>ISSUED TO:</strong> <u>Senior Section Engineer (P-Way / Machine In-charge / TBM)</u>
                  </p>
                  <p>
                    I hereby permit you and your authorized staff to work on or near the 25kV OHE catenary and contact wire in the section defined below:
                  </p>

                  <table className="w-full text-xs border border-black border-collapse text-left my-2">
                    <tbody>
                      <tr className="border-b border-black">
                        <td className="p-2 font-bold bg-zinc-100 w-1/3 border-r border-black">Kilometerage Limits</td>
                        <td className="p-2">From km 28.000 to km 31.500 (Tambaram Yard limits)</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-2 font-bold bg-zinc-100 border-r border-black">Substation Isolator Switch</td>
                        <td className="p-2 font-bold text-emerald-800">ISOLATOR TBM-02 OPENED & LOCKED (Danger Notice Affixed)</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-2 font-bold bg-zinc-100 border-r border-black">Dual Earthing Rods Clamped</td>
                        <td className="p-2">Discharge Rod #SR-ED-41 (North End) & #SR-ED-42 (South End) pinned to running rail</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold bg-zinc-100 border-r border-black">Permitted Time Window</td>
                        <td className="p-2 font-bold">01:05 hrs to 03:35 hrs (150 minutes)</td>
                      </tr>
                    </tbody>
                  </table>

                  <p className="bg-red-50 p-2.5 border border-red-300 text-red-900 text-[11px]">
                    <strong>CRITICAL ELECTRICAL SAFETY WARNING:</strong> The electrical equipment specified above is dead and connected to earth. Under no circumstances must any worker or track machine jib approach within 2.0 meters of any neighboring energized track equipment (Suburban Up Line).
                  </p>
                </div>

                <div className="pt-8 grid grid-cols-2 text-center text-xs font-sans font-bold border-t border-black">
                  <div>
                    <div className="h-10 text-zinc-400 italic">[Signed digitally]</div>
                    <div>Traction Power Controller (TPC / MAS)</div>
                    <div className="text-[10px] text-zinc-600">Southern Railway Electrical Control</div>
                  </div>
                  <div>
                    <div className="h-10 text-zinc-400 italic">[Signed on Site]</div>
                    <div>SSE / Overhead Equipment (OHE / TBM)</div>
                    <div className="text-[10px] text-zinc-600">Authorized TRD Supervisor</div>
                  </div>
                </div>
              </div>
            )}

            {/* DOCUMENT 4: FORM S&T (T/351 DISCONNECTION NOTICE) */}
            {selectedMemoType === 'ST_T351' && (
              <div className="bg-white text-black p-8 rounded-sm shadow-none font-serif space-y-3 max-w-4xl mx-auto border border-zinc-300">
                <div className="text-center border-b-2 border-black pb-3 space-y-1">
                  <h2 className="text-lg font-black uppercase tracking-wider">SOUTHERN RAILWAY — SIGNAL & TELECOM DEPARTMENT</h2>
                  <h3 className="text-sm font-bold uppercase tracking-wide bg-zinc-100 py-1 border border-black">
                    FORM S&T (T/351) // NOTICE OF DISCONNECTION OF SIGNAL & INTERLOCKING GEARS
                  </h3>
                  <div className="text-xs font-mono pt-1 flex justify-between">
                    <span>MEMO NO: SR/S&T/DISCON/2026/041</span>
                    <span>STATION: TAMBARAM (TBM)</span>
                    <span>DATE: 13-SEP-2026</span>
                  </div>
                </div>

                <div className="text-xs font-sans space-y-3 leading-relaxed">
                  <p>
                    <strong>TO:</strong> <u>Station Master on Duty / Tambaram (TBM)</u>
                  </p>
                  <p>
                    Please take notice that the undermentioned signaling and interlocking apparatus will be disconnected for overhaul and maintenance from <strong>01:00 hrs</strong> to <strong>03:30 hrs</strong>:
                  </p>

                  <table className="w-full text-xs border border-black border-collapse text-left my-2">
                    <tbody>
                      <tr className="border-b border-black">
                        <td className="p-2 font-bold bg-zinc-100 w-1/3 border-r border-black">Gear Disconnected</td>
                        <td className="p-2 font-bold">Electric Point Machine No. 118A/B (Tambaram South Throat)</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-2 font-bold bg-zinc-100 border-r border-black">Axle Counters / Track Circuits</td>
                        <td className="p-2">Digital Axle Counter DAC-TBM-18 isolated for ballast screening</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold bg-zinc-100 border-r border-black">Interlocking Safeguards</td>
                        <td className="p-2">Point No. 118 spiked in Normal position and padlocked. Key deposited with SM.</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="border-t border-black pt-4 mt-4">
                    <h4 className="font-bold uppercase text-xs mb-1">RECONNECTION CERTIFICATE (FORM S&T T/351 PART II)</h4>
                    <p className="text-[11px] text-zinc-700 italic">
                      &ldquo;The S&T gears above mentioned have been tested in both Normal and Reverse positions under load. Track circuit voltage verified at 2.20V DC. Interlocking restored to full service at 03:35 hrs.&rdquo;
                    </p>
                  </div>
                </div>

                <div className="pt-6 grid grid-cols-2 text-center text-xs font-sans font-bold border-t border-black">
                  <div>
                    <div className="h-8 italic text-zinc-400">[Signed]</div>
                    <div>Senior Section Engineer (Signals / TBM)</div>
                  </div>
                  <div>
                    <div className="h-8 italic text-zinc-400">[Accepted & Reconnected]</div>
                    <div>Station Master on Duty (Tambaram)</div>
                  </div>
                </div>
              </div>
            )}

            {/* DOCUMENT 5: FORM T/409 (CAUTION ORDER) */}
            {selectedMemoType === 'FORM_T409' && (
              <div className="bg-white text-black p-8 rounded-sm shadow-none font-serif space-y-3 max-w-4xl mx-auto border border-zinc-300">
                <div className="text-center border-b-2 border-black pb-3 space-y-1">
                  <h2 className="text-lg font-black uppercase tracking-wider">SOUTHERN RAILWAY — OPERATING DEPARTMENT</h2>
                  <h3 className="text-sm font-bold uppercase tracking-wide bg-zinc-100 py-1 border border-black">
                    FORM T/409 // CAUTION ORDER (STATUTORY TRAIN OPERATION RECORD)
                  </h3>
                  <div className="text-xs font-mono pt-1 flex justify-between">
                    <span>ORDER NO: SR/T409/MAS/2026/894</span>
                    <span>ISSUED AT: TAMBARAM (TBM)</span>
                    <span>DATE: 13-SEP-2026</span>
                  </div>
                </div>

                <div className="text-xs font-sans space-y-3 leading-relaxed">
                  <p>
                    <strong>TO:</strong> <u>Loco Pilot & Train Manager (Guard) of Train No. 40001 / 12635 / ALL TRAINS</u>
                  </p>
                  <p>
                    You are hereby instructed to observe the following Temporary Speed Restrictions (TSR) between stations as specified:
                  </p>

                  <table className="w-full text-xs border border-black border-collapse text-left my-2 font-mono">
                    <thead className="bg-zinc-100 border-b border-black">
                      <tr>
                        <th className="p-2 border-r border-black">Station Between</th>
                        <th className="p-2 border-r border-black">Kilometers</th>
                        <th className="p-2 border-r border-black">Line</th>
                        <th className="p-2 border-r border-black">Speed Restriction</th>
                        <th className="p-2">Reason / Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-black">
                        <td className="p-2 font-bold border-r border-black">Tambaram (TBM) - Perungalathur (PRGL)</td>
                        <td className="p-2 border-r border-black">km 29.140 - 29.800</td>
                        <td className="p-2 border-r border-black">Down Main Fast</td>
                        <td className="p-2 font-black text-red-600 border-r border-black text-sm">30 km/h</td>
                        <td className="p-2 text-[11px] font-sans">Ballast Consolidation post CSM Machine Tamping</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="p-2 font-bold border-r border-black">Guindy (GDY) - St. Thomas Mount (STM)</td>
                        <td className="p-2 border-r border-black">km 16.200 - 17.000</td>
                        <td className="p-2 border-r border-black">Up Suburban</td>
                        <td className="p-2 font-black text-amber-600 border-r border-black text-sm">50 km/h</td>
                        <td className="p-2 text-[11px] font-sans">Flash-butt rail weld settlement (Day 2 relaxation)</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold border-r border-black">Maraimalai Nagar (MMNK)</td>
                        <td className="p-2 border-r border-black">km 46.800 - 47.600</td>
                        <td className="p-2 border-r border-black">Up Main Fast</td>
                        <td className="p-2 font-black text-red-600 border-r border-black text-sm">20 km/h</td>
                        <td className="p-2 text-[11px] font-sans">BCM Deep screening cuttings formation</td>
                      </tr>
                    </tbody>
                  </table>

                  <p className="bg-yellow-50 p-2.5 border border-yellow-300 text-[11px]">
                    <strong>SPECIAL WHISTLING INSTRUCTIONS:</strong> Whistle board (W/L) erected 600m in advance of each engineering restriction zone. Loco Pilots must sound continuous intermittent horn and maintain strict vigilant lookout.
                  </p>
                </div>

                <div className="pt-8 grid grid-cols-3 text-center text-xs font-sans font-bold border-t border-black">
                  <div>
                    <div className="h-8 italic text-zinc-400">[Acknowledged]</div>
                    <div>Loco Pilot Signature</div>
                  </div>
                  <div>
                    <div className="h-8 italic text-zinc-400">[Acknowledged]</div>
                    <div>Train Manager (Guard)</div>
                  </div>
                  <div>
                    <div className="h-8 italic text-zinc-400">[Dated Stamp]</div>
                    <div>Station Master on Duty / TBM</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating BlockTrain Central AI Dispatch Assistant */}
      <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
        <Chatbot />
      </div>
    </div>
  );
}
