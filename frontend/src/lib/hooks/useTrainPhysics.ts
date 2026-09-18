import { useState, useEffect } from 'react';
import { Train } from '../types';
import { STATIONS, CANVAS_WIDTH } from '../stations';
import { STATION_SPACING, DEFAULT_SPEED_MULTIPLIER } from '../constants';
import { useMaintenanceStore } from '../store';

export const getTrainLength = (type: Train['type']): number => {
  if (type === 'freight') return 405; // 28 + 5 + 12*(26+5)
  if (type === 'express') return 279; // 28 + 5 + 6*(36+5)
  return 187; // passenger: 26 + 5 + 4*(34+5)
};

export const generateTrains = (): Train[] => {
  return [
    // Southbound Fleet (Direction: 1, MSB -> CGL)
    { 
      id: 'T1', 
      trainNumber: '40001',
      name: 'EMU 40001 (MSB-TBM)', 
      x: 1500, 
      direction: 1, 
      baseLane: -1, 
      switchDirection: 0, 
      speed: 1.8, 
      currentSpeed: 1.8,
      type: 'passenger',
      scheduledStops: ['MSB', 'MSF', 'MPK', 'MS', 'MSC', 'NBK', 'MKK', 'MBM', 'SP', 'GDY', 'STM', 'PZA', 'MN', 'TLM', 'PV', 'CMP', 'TBMS', 'TBM'],
      scheduledArrival: '04:20',
      scheduledDeparture: '04:20',
      nextStop: 'Chennai Fort',
      timetableActive: true,
      locoModel: 'SR EMU 12-Car (Medha AC Rake)',
      consist: '12 Suburban Coaches',
      length: 187
    },
    { 
      id: 'T2', 
      trainNumber: '40003',
      name: 'EMU 40003 (MS-GDY Fast)', 
      x: 9000, 
      direction: 1, 
      baseLane: -1, 
      switchDirection: 0, 
      speed: 1.9, 
      currentSpeed: 1.9,
      type: 'passenger',
      scheduledStops: ['MS', 'MBM', 'GDY'],
      scheduledArrival: '06:05',
      scheduledDeparture: '06:06',
      nextStop: 'Mambalam',
      timetableActive: true,
      locoModel: 'SR EMU 12-Car (BEML)',
      consist: '12 Suburban Coaches',
      length: 187
    },
    { 
      id: 'T3', 
      trainNumber: '12635',
      name: 'EXP 12635 Vaigai Superfast', 
      x: 14000, 
      direction: 1, 
      baseLane: 0, 
      switchDirection: 0, 
      speed: 2.5, 
      currentSpeed: 2.5,
      type: 'express',
      scheduledStops: ['MSB', 'MS', 'MBM', 'TBM', 'CGL'],
      scheduledArrival: '12:45',
      scheduledDeparture: '12:45',
      nextStop: 'Tambaram',
      timetableActive: true,
      locoModel: 'WAP-7 #30452 (Royapuram RPM Shed)',
      consist: '22 LHB AC Coaches (Crimson/Silver)',
      length: 279
    },
    { 
      id: 'T4', 
      trainNumber: '40005',
      name: 'EMU 40005 (STM-TBM)', 
      x: 26000, 
      direction: 1, 
      baseLane: -1, 
      switchDirection: 0, 
      speed: 1.8, 
      currentSpeed: 1.8,
      type: 'passenger',
      scheduledStops: ['STM', 'PZA', 'MN', 'TLM', 'PV', 'CMP', 'TBMS', 'TBM'],
      scheduledArrival: '06:30',
      scheduledDeparture: '06:31',
      nextStop: 'Pazhavanthangal',
      timetableActive: true,
      locoModel: 'SR EMU 12-Car',
      consist: '12 Suburban Coaches',
      length: 187
    },
    { 
      id: 'T5', 
      trainNumber: 'FRT90021',
      name: 'FRT 90021 Auto Logistics Rake', 
      x: 33000, 
      direction: 1, 
      baseLane: 0, 
      switchDirection: 0, 
      speed: 1.4, 
      currentSpeed: 1.4,
      type: 'freight',
      scheduledStops: [],
      scheduledArrival: '--',
      scheduledDeparture: '--',
      nextStop: 'Singaperumal Koil Siding',
      timetableActive: false,
      locoModel: 'WAG-9 #31189 (Arakkonam AJJ Shed)',
      consist: '12 Double-Decker Auto Wagons',
      length: 405
    },
    { 
      id: 'T6', 
      trainNumber: '40505',
      name: 'EMU 40505 (TBM-GI)', 
      x: 43000, 
      direction: 1, 
      baseLane: -1, 
      switchDirection: 0, 
      speed: 1.8, 
      currentSpeed: 1.8,
      type: 'passenger',
      scheduledStops: ['TBM', 'PRGL', 'VDR', 'UPM', 'GI'],
      scheduledArrival: '05:00',
      scheduledDeparture: '05:01',
      nextStop: 'Perungalathur',
      timetableActive: true,
      locoModel: 'SR EMU 12-Car',
      consist: '12 Suburban Coaches',
      length: 187
    },
    { 
      id: 'T7', 
      trainNumber: '12605',
      name: 'EXP 12605 Pallavan Superfast', 
      x: 49000, 
      direction: 1, 
      baseLane: 0, 
      switchDirection: 0, 
      speed: 2.6, 
      currentSpeed: 2.6,
      type: 'express',
      scheduledStops: ['MSB', 'MS', 'MBM', 'TBM', 'CGL'],
      scheduledArrival: '15:45',
      scheduledDeparture: '15:45',
      nextStop: 'Tambaram',
      timetableActive: true,
      locoModel: 'WAP-7 #30488 (Erode ED Shed)',
      consist: '22 LHB Coaches (Pallavan)',
      length: 279
    },
    { 
      id: 'T8', 
      trainNumber: '40517',
      name: 'EMU 40517 (MMNK-CGL)', 
      x: 56500, 
      direction: 1, 
      baseLane: -1, 
      switchDirection: 0, 
      speed: 1.8, 
      currentSpeed: 1.8,
      type: 'passenger',
      scheduledStops: ['MMNK', 'SKL', 'CGL'],
      scheduledArrival: '06:55',
      scheduledDeparture: '06:56',
      nextStop: 'Singaperumal Koil',
      timetableActive: true,
      locoModel: 'SR EMU 12-Car',
      consist: '12 Suburban Coaches',
      length: 187
    },

    // Northbound Fleet (Direction: -1, CGL -> MSB)
    { 
      id: 'T9', 
      trainNumber: '40524',
      name: 'EMU 40524 (CGL-TBM)', 
      x: 59000, 
      direction: -1, 
      baseLane: 1, 
      switchDirection: 0, 
      speed: 1.8, 
      currentSpeed: 1.8,
      type: 'passenger',
      scheduledStops: ['CGL', 'SKL', 'MMNK', 'POTI', 'GI', 'UPM', 'VDR', 'PRGL', 'TBM'],
      scheduledArrival: '08:35',
      scheduledDeparture: '08:35',
      nextStop: 'Singaperumal Koil',
      timetableActive: true,
      locoModel: 'SR EMU 12-Car',
      consist: '12 Suburban Coaches',
      length: 187
    },
    { 
      id: 'T10', 
      trainNumber: '12636',
      name: 'EXP 12636 Pandian Superfast', 
      x: 52000, 
      direction: -1, 
      baseLane: 0, 
      switchDirection: 0, 
      speed: 2.5, 
      currentSpeed: 2.5,
      type: 'express',
      scheduledStops: ['CGL', 'TBM', 'MBM', 'MS', 'MSB'],
      scheduledArrival: '13:08',
      scheduledDeparture: '13:10',
      nextStop: 'Tambaram',
      timetableActive: true,
      locoModel: 'WAP-7 #30221 (Royapuram RPM Shed)',
      consist: '22 LHB Coaches',
      length: 279
    },
    { 
      id: 'T11', 
      trainNumber: '40522',
      name: 'EMU 40522 (SKL-GI Semi Fast)', 
      x: 45000, 
      direction: -1, 
      baseLane: 1, 
      switchDirection: 0, 
      speed: 1.8, 
      currentSpeed: 1.8,
      type: 'passenger',
      scheduledStops: ['SKL', 'MMNK', 'POTI', 'GI'],
      scheduledArrival: '08:25',
      scheduledDeparture: '08:25',
      nextStop: 'Guduvancheri',
      timetableActive: true,
      locoModel: 'SR EMU 12-Car',
      consist: '12 Suburban Coaches',
      length: 187
    },
    { 
      id: 'T12', 
      trainNumber: 'FRT90022',
      name: 'FRT 90022 BTPN Petroleum Tanker', 
      x: 36000, 
      direction: -1, 
      baseLane: 0, 
      switchDirection: 0, 
      speed: 1.4, 
      currentSpeed: 1.4,
      type: 'freight',
      scheduledStops: [],
      scheduledArrival: '--',
      scheduledDeparture: '--',
      nextStop: 'Chengalpattu Yard',
      timetableActive: false,
      locoModel: 'WAG-9 #31245 (Tughlakabad TKD Shed)',
      consist: '12 BTPN Petroleum Tankers',
      length: 405
    },
    { 
      id: 'T13', 
      trainNumber: '40107',
      name: 'EMU 40107 (TBM-STM)', 
      x: 39000, 
      direction: -1, 
      baseLane: 1, 
      switchDirection: 0, 
      speed: 1.8, 
      currentSpeed: 1.8,
      type: 'passenger',
      scheduledStops: ['TBM', 'TBMS', 'CMP', 'PV', 'TLM', 'MN', 'PZA', 'STM'],
      scheduledArrival: '17:20',
      scheduledDeparture: '17:21',
      nextStop: 'Tambaram Sanatorium',
      timetableActive: true,
      locoModel: 'SR EMU 12-Car',
      consist: '12 Suburban Coaches',
      length: 187
    },
    { 
      id: 'T14', 
      trainNumber: '40025',
      name: 'EMU 40025 (CMP-GDY Fast)', 
      x: 21500, 
      direction: -1, 
      baseLane: 1, 
      switchDirection: 0, 
      speed: 1.9, 
      currentSpeed: 1.9,
      type: 'passenger',
      scheduledStops: ['CMP', 'PV', 'GDY'],
      scheduledArrival: '08:37',
      scheduledDeparture: '08:38',
      nextStop: 'Pallavaram',
      timetableActive: true,
      locoModel: 'SR EMU 12-Car',
      consist: '12 Suburban Coaches',
      length: 187
    },
    { 
      id: 'T15', 
      trainNumber: '16128',
      name: 'EXP 16128 Guruvayur Express', 
      x: 16000, 
      direction: -1, 
      baseLane: 0, 
      switchDirection: 0, 
      speed: 2.5, 
      currentSpeed: 2.5,
      type: 'express',
      scheduledStops: ['CGL', 'TBM', 'MS'],
      scheduledArrival: '19:03',
      scheduledDeparture: '19:05',
      nextStop: 'Tambaram',
      timetableActive: true,
      locoModel: 'WAP-4 #22510 (Arakkonam AJJ Shed)',
      consist: '22 LHB Coaches',
      length: 279
    },
    { 
      id: 'T16', 
      trainNumber: '40031',
      name: 'EMU 40031 (GDY-MS)', 
      x: 7500, 
      direction: -1, 
      baseLane: 1, 
      switchDirection: 0, 
      speed: 1.8, 
      currentSpeed: 1.8,
      type: 'passenger',
      scheduledStops: ['GDY', 'SP', 'MBM', 'MKK', 'NBK', 'MSC', 'MS'],
      scheduledArrival: '09:07',
      scheduledDeparture: '09:08',
      nextStop: 'Saidapet',
      timetableActive: true,
      locoModel: 'SR EMU 12-Car',
      consist: '12 Suburban Coaches',
      length: 187
    },
    { 
      id: 'T17', 
      trainNumber: '40037',
      name: 'EMU 40037 (MS-MSB)', 
      x: 3200, 
      direction: -1, 
      baseLane: 1, 
      switchDirection: 0, 
      speed: 1.8, 
      currentSpeed: 1.8,
      type: 'passenger',
      scheduledStops: ['MS', 'MPK', 'MSF', 'MSB'],
      scheduledArrival: '09:26',
      scheduledDeparture: '09:27',
      nextStop: 'Chennai Fort',
      timetableActive: true,
      locoModel: 'SR EMU 12-Car',
      consist: '12 Suburban Coaches',
      length: 187
    }
  ];
};

const getHazardZones = (activeBlocks: Array<{ id: string; urgency?: string }>) => {
  const zones: { minX: number, maxX: number, laneId: number, urgency: string }[] = [];
  
  for (const block of activeBlocks) {
    const bid = block.id;
    const urgency = block.urgency || 'Critical';
    
    let laneId = 0;
    if (bid.includes('Down Line') || bid.includes('Main Line Down') || bid.includes('Loop Line 1')) laneId = -1;
    else if (bid.includes('Up Line') || bid.includes('Main Line Up') || bid.includes('Loop Line 2')) laneId = 1;
    else laneId = 0;

    let minX = 0;
    let maxX = CANVAS_WIDTH;
    
    let found = false;
    for (let i = 0; i < STATIONS.length - 1; i++) {
       const st = STATIONS[i];
       const nxt = STATIONS[i+1];
       if (bid.includes(`${st.name} to ${nxt.name}`)) {
          const sX = 600 + i * STATION_SPACING;
          minX = sX + st.yardEndOffset;
          maxX = sX + STATION_SPACING + nxt.yardStartOffset;
          found = true;
          break;
       }
    }
    
    if (!found) {
       for (let i = 0; i < STATIONS.length; i++) {
         const st = STATIONS[i];
         if (bid.includes(st.name)) {
            const sX = 600 + i * STATION_SPACING;
            minX = sX + st.yardStartOffset;
            maxX = sX + st.yardEndOffset;
             if (bid.includes('Loop')) {
                 const pfMatch = bid.match(/PF(\d+)/);
                 if (pfMatch) {
                     const pIdx = parseInt(pfMatch[1], 10) - 1;
                     if (st.platforms[pIdx]) {
                         minX = sX + st.platforms[pIdx].sZoneStartOffset;
                         maxX = sX + st.platforms[pIdx].sZoneEndOffset;
                     }
                 }
             }
            break;
         }
       }
    }
    
    zones.push({ minX, maxX, laneId, urgency });
  }
  return zones;
};

export const useTrainPhysics = (userSpeedMultiplier: number = DEFAULT_SPEED_MULTIPLIER) => {
  const [trains, setTrains] = useState<Train[]>(() => generateTrains());

  useEffect(() => {
    const physicsFactor = Math.min(10, Math.max(0.1, userSpeedMultiplier)); 
    
      let animationFrameId: number;
      let lastTime = performance.now();

      const loop = (time: number) => {
        const delta = time - lastTime;
        
        // Target roughly 60fps (16ms per frame)
        if (delta >= 16) {
          const state = useMaintenanceStore.getState();
          const hazardZones = getHazardZones(state.activeBlocks);
          const now = Date.now();

          setTrains(curr => {
            const nextTrains: Train[] = curr.map((t): Train => {
              const tLen = t.length || getTrainLength(t.type);


          // 1. Station Dwell Timer Check
          if (t.stopUntil && now < t.stopUntil) {
            const remainingSec = Math.ceil((t.stopUntil - now) / 1000);
            return {
              ...t,
              currentSpeed: 0,
              speedKmh: 0,
              signalAspect: 'red' as const,
              statusText: `Station Dwell • Departs in ${remainingSec}s`
            };
          }
          
          let newStopUntil: number | undefined = undefined;
          let appliedSpeed = t.speed;
          let currentBaseLane = t.baseLane;
          let newTargetLane = t.targetLane;
          let newSwitchStartX = t.switchStartX;
          let activeLane = newTargetLane !== undefined ? newTargetLane : currentBaseLane;
          const SWITCH_LENGTH = 280;
          
          // Complete track switch if distance traversed exceeds switch length
          if (newTargetLane !== undefined && newSwitchStartX !== undefined) {
             const distSwitched = Math.abs(t.x - newSwitchStartX);
             if (distSwitched >= SWITCH_LENGTH + 400) {
                currentBaseLane = newTargetLane;
                newTargetLane = undefined;
                newSwitchStartX = undefined;
                activeLane = currentBaseLane;
             }
          }

          const LOOKAHEAD = 5500;
          const lookaheadMin = t.direction === 1 ? t.x : Math.max(0, t.x - LOOKAHEAD);
          const lookaheadMax = t.direction === 1 ? Math.min(CANVAS_WIDTH, t.x + LOOKAHEAD) : t.x;

          // 2. Find nearest physical crossover in front of train for emergency detour
          const validSwitches: number[] = [];
          for (let i = 0; i < STATIONS.length; i++) {
              const sX = 600 + i * STATION_SPACING;
              const st = STATIONS[i];
              if (t.direction === 1) {
                  validSwitches.push(sX + st.yardStartOffset + 50);
                  validSwitches.push(sX + st.yardEndOffset - 300);
              } else {
                  validSwitches.push(sX + st.yardStartOffset + 300);
                  validSwitches.push(sX + st.yardEndOffset - 50);
              }
          }
          
          let targetSwitchX = -1;
          let distToSwitch = Infinity;
          for (const sx of validSwitches) {
              const dist = t.direction === 1 ? (sx - t.x) : (t.x - sx);
              if (dist > 50 && dist < distToSwitch) {
                  distToSwitch = dist;
                  targetSwitchX = sx;
              }
          }

          // 3. Hazards on current active lane
          const hazardsAhead = hazardZones.filter(z => 
             z.laneId === activeLane &&
             (Math.max(lookaheadMin, z.minX) <= Math.min(lookaheadMax, z.maxX))
          );

          // 4. Evaluate if an escape crossover lane is safe (only needed if hazard directly ahead)
          let escapeIsSafe = false;
          let proposedTargetLane = activeLane;
          if (hazardsAhead.length > 0 && targetSwitchX !== -1 && newTargetLane === undefined) {
              proposedTargetLane = activeLane === 0 ? (t.direction === 1 ? -1 : 1) : 0;
              
              const targetLaneHazards = hazardZones.filter(z => 
                  z.laneId === proposedTargetLane && (Math.max(lookaheadMin, z.minX) <= Math.min(lookaheadMax, z.maxX))
              );
              const targetLaneTrains = curr.filter(other => {
                  if (other.id === t.id) return false;
                  const oLen = other.length || getTrainLength(other.type);
                  const otherIsSwitching = other.targetLane !== undefined && Math.abs(other.x - (other.switchStartX || 0)) < 600;
                  const inTargetLane = other.baseLane === proposedTargetLane || other.targetLane === proposedTargetLane || (otherIsSwitching && other.baseLane === proposedTargetLane);
                  if (!inTargetLane) return false;
                  
                  const otherMin = other.direction === 1 ? other.x - oLen : other.x;
                  const otherMax = other.direction === 1 ? other.x : other.x + oLen;
                  return Math.max(lookaheadMin, otherMin) <= Math.min(lookaheadMax, otherMax);
              });
              
              if (targetLaneHazards.length === 0 && targetLaneTrains.length === 0) {
                  escapeIsSafe = true;
              }
          }

          let threatLookaheadMin = lookaheadMin;
          let threatLookaheadMax = lookaheadMax;
          if (escapeIsSafe && targetSwitchX !== -1) {
              if (t.direction === 1) threatLookaheadMax = Math.max(t.x, Math.min(lookaheadMax, targetSwitchX));
              else threatLookaheadMin = Math.min(t.x, Math.max(lookaheadMin, targetSwitchX));
          }

          const trainsAhead = curr.filter(other => {
             if (other.id === t.id) return false;
             const oLen = other.length || getTrainLength(other.type);
             const otherIsSwitching = other.targetLane !== undefined && Math.abs(other.x - (other.switchStartX || 0)) < 600;
             const inMyLane = other.baseLane === activeLane || other.targetLane === activeLane || (otherIsSwitching && other.baseLane === activeLane);
             if (!inMyLane) return false;
             
             const otherMin = other.direction === 1 ? other.x - oLen : other.x;
             const otherMax = other.direction === 1 ? other.x : other.x + oLen;
             return Math.max(threatLookaheadMin, otherMin) <= Math.min(threatLookaheadMax, otherMax);
          });

          // Turnout speed restriction (PSR 30 km/h) if currently switching
          if (newTargetLane !== undefined) {
             appliedSpeed = Math.min(appliedSpeed, 0.9);
          }

          // 5. Calculate Distance to Threat & 4-Aspect Signal State
          let minDistanceToThreat = LOOKAHEAD;
          let activeSignalAspect: 'green' | 'double_yellow' | 'yellow' | 'red' = 'green';
          let statusText = 'Line Clear • Speed MPS';

          hazardsAhead.forEach(z => {
              const myFront = t.x;
              const myBack = t.direction === 1 ? t.x - tLen : t.x + tLen;
              const myMin = Math.min(myFront, myBack);
              const myMax = Math.max(myFront, myBack);
              
              if (Math.max(myMin, z.minX) <= Math.min(myMax, z.maxX)) {
                  minDistanceToThreat = 0;
              } else {
                  const dist = t.direction === 1 ? (z.minX - t.x) : (t.x - z.maxX);
                  if (dist > 0 && dist < minDistanceToThreat) minDistanceToThreat = dist;
              }
          });

          trainsAhead.forEach(other => {
              const oLen = other.length || getTrainLength(other.type);
              let dist = 0;
              if (t.direction === 1) {
                  const otherRear = other.direction === 1 ? (other.x - oLen) : other.x;
                  dist = otherRear - t.x;
              } else {
                  const otherRear = other.direction === -1 ? (other.x + oLen) : other.x;
                  dist = t.x - otherRear;
              }
              if (dist > 0 && dist < minDistanceToThreat) {
                  minDistanceToThreat = dist;
              }
          });

          // 4-Aspect Automatic Signaling Rules:
          if (minDistanceToThreat <= 350) {
              appliedSpeed = 0;
              activeSignalAspect = 'red';
              statusText = 'Danger Aspect (RED) • Stop at Fouling Mark';
          } else if (minDistanceToThreat < 1200) {
              const factor = Math.max(0.15, (minDistanceToThreat - 350) / 850);
              appliedSpeed *= (factor * 0.45);
              activeSignalAspect = 'yellow';
              statusText = 'Caution Aspect (YELLOW) • Speed Restricted to 30 km/h';
          } else if (minDistanceToThreat < 2800) {
              const factor = 0.45 + 0.35 * ((minDistanceToThreat - 1200) / 1600);
              appliedSpeed *= factor;
              activeSignalAspect = 'double_yellow';
              statusText = 'Attention Aspect (DOUBLE YELLOW) • Approach Caution';
          } else {
              activeSignalAspect = 'green';
              statusText = 'Line Clear (GREEN) • Normal MPS Track Speed';
          }

          // 6. Trigger Crossover Switch if safe and reached
          if (escapeIsSafe && newTargetLane === undefined && hazardsAhead.length > 0) {
              const passedSwitch = (t.direction === 1 && t.x >= targetSwitchX && (t.x - 70.0) <= targetSwitchX) ||
                                   (t.direction === -1 && t.x <= targetSwitchX && (t.x + 70.0) >= targetSwitchX);
              if (passedSwitch) {
                  newTargetLane = proposedTargetLane;
                  newSwitchStartX = targetSwitchX;
                  statusText = 'Negotiating Crossover • Detour via Interlocking';
              }
          }

          let targetSpeed = appliedSpeed;

          // 7. Authentic Station Stoppages & Dwell Scheduling
          let nearestStationName = 'Open Section';
          if (!t.stopUntil && targetSpeed > 0 && t.scheduledStops && t.scheduledStops.length > 0) {
              let distToNextScheduledStop = LOOKAHEAD;
              let targetStation = null;

              for (let i = 0; i < STATIONS.length; i++) {
                  const st = STATIONS[i];
                  if (!t.scheduledStops.includes(st.id)) continue;
                  if (t.lastStopStationId === st.id) continue;

                  const sX = 600 + i * STATION_SPACING;
                  const tx = sX + (95 * t.direction);
                  const dist = t.direction === 1 ? (tx - t.x) : (t.x - tx);
                  
                  if (dist > 0 && dist < distToNextScheduledStop) {
                      distToNextScheduledStop = dist;
                      targetStation = st;
                  }
              }

              if (targetStation) {
                  nearestStationName = targetStation.name;
                  if (distToNextScheduledStop < 900) {
                      const brakeFactor = Math.max(0.18, Math.pow(distToNextScheduledStop / 900, 1.2));
                      targetSpeed *= brakeFactor;
                      statusText = `Approaching ${targetStation.name} • Sched Arr: ${t.scheduledArrival || '--'} • Right Time`;
                  }
              }
          }

          // 8. Authentic Physics Engine: Inertia, Acceleration & Smooth Braking
          let cur = t.currentSpeed !== undefined ? t.currentSpeed : t.speed;
          
          let accelRate = 0.03;
          let decelRate = 0.05;
          if (t.type === 'express') {
              accelRate = 0.025;
              decelRate = 0.04;
          } else if (t.type === 'freight') {
              accelRate = 0.015;
              decelRate = 0.03;
          }

          if (cur < targetSpeed) {
              cur += accelRate * physicsFactor;
              if (cur > targetSpeed) cur = targetSpeed;
          } else if (cur > targetSpeed) {
              cur -= decelRate * physicsFactor;
              if (cur < targetSpeed) cur = targetSpeed;
          }
          // Dead stop clamp only when train is commanded to halt
          if (targetSpeed === 0 && cur < 0.02) cur = 0;

          // 9. Absolute Anti-Collision Bounding Box Shield
          curr.forEach(other => {
              if (other.id === t.id) return;
              const oLen = other.length || getTrainLength(other.type);
              const otherIsSwitching = other.targetLane !== undefined && Math.abs(other.x - (other.switchStartX || 0)) < 600;
              const inMyLane = other.baseLane === activeLane || other.targetLane === activeLane || (otherIsSwitching && other.baseLane === activeLane);
              
              if (inMyLane) {
                  const myFront = t.x;
                  const otherFront = other.x;
                  let separation = Infinity;
                  if (t.direction === 1) {
                      const otherRear = other.direction === 1 ? (otherFront - oLen) : otherFront;
                      separation = otherRear - myFront;
                  } else {
                      const otherRear = other.direction === -1 ? (otherFront + oLen) : otherFront;
                      separation = myFront - otherRear;
                  }
                  
                  if (separation > 0 && separation < 180) {
                      cur = 0;
                  }
              }
          });

          const actualApplied = cur * physicsFactor;
          let newX = t.x + t.direction * actualApplied;

          // 10. Platform Arrival Detection & Dwell Trigger
          let newLastStopStationId = t.lastStopStationId;
          if (!t.stopUntil && actualApplied > 0 && t.scheduledStops && t.scheduledStops.length > 0) {
              for (let i = 0; i < STATIONS.length; i++) {
                  const st = STATIONS[i];
                  if (!t.scheduledStops.includes(st.id)) continue;
                  if (t.lastStopStationId === st.id) continue;

                  const sX = 600 + i * STATION_SPACING;
                  const targetX = sX + (95 * t.direction);

                  if ((t.direction === 1 && t.x < targetX && newX >= targetX) ||
                      (t.direction === -1 && t.x > targetX && newX <= targetX)) {
                      newX = targetX;
                      cur = 0;
                      const dwellTimeMs = t.type === 'express' ? 12000 : 8000;
                      const scaledDwell = dwellTimeMs / Math.max(1, userSpeedMultiplier);
                      newStopUntil = now + scaledDwell;
                      newLastStopStationId = st.id;
                      activeSignalAspect = 'red';
                      statusText = `Platform Dwell at ${st.name} • Sched Dep: ${t.scheduledDeparture || '--'} • Right Time`;
                      break;
                  }
              }
          }

          // Clear lastStopStationId once train has cleared the station yard
          if (newLastStopStationId) {
              const prevStation = STATIONS.find(s => s.id === newLastStopStationId);
              if (prevStation) {
                  const prevIdx = STATIONS.indexOf(prevStation);
                  const prevSX = 600 + prevIdx * STATION_SPACING;
                  const distFromPrev = Math.abs(newX - prevSX);
                  if (distFromPrev > 350) {
                      newLastStopStationId = undefined;
                  }
              }
          }

          // 11. Terminal Turnaround Mechanics (Chennai Beach & Chengalpattu Junction)
          const MAX_TERMINAL_X = CANVAS_WIDTH - 450;
          const MIN_TERMINAL_X = 450;

          if (newX > MAX_TERMINAL_X) {
              return {
                 ...t,
                 x: MAX_TERMINAL_X,
                 direction: -1,
                 baseLane: 1,
                 targetLane: undefined,
                 switchStartX: undefined,
                 stopUntil: now + 8000,
                 currentSpeed: 0,
                 speedKmh: 0,
                 signalAspect: 'red' as const,
                 statusText: 'Chengalpattu Terminal • Reversing Direction',
                 lastStopStationId: 'CGL'
              };
          }
          if (newX < MIN_TERMINAL_X) {
              return {
                 ...t,
                 x: MIN_TERMINAL_X,
                 direction: 1,
                 baseLane: -1,
                 targetLane: undefined,
                 switchStartX: undefined,
                 stopUntil: now + 8000,
                 currentSpeed: 0,
                 speedKmh: 0,
                 signalAspect: 'red' as const,
                 statusText: 'Chennai Beach Terminal • Reversing Direction',
                 lastStopStationId: 'MSB'
              };
          }

          const maxKmh = t.type === 'express' ? 110 : t.type === 'passenger' ? 80 : 65;
          const speedKmh = Math.round((cur / t.speed) * maxKmh);

          if (cur > 0 && statusText === 'Line Clear • Speed MPS') {
              const targetName = t.nextStop || nearestStationName;
              statusText = `Cruising to ${targetName} • ${speedKmh} km/h • Right Time`;
          }
          
          return { 
            ...t, 
            x: newX, 
            stopUntil: newStopUntil,
            baseLane: currentBaseLane,
            targetLane: newTargetLane,
            switchStartX: newSwitchStartX,
            currentSpeed: cur,
            speedKmh,
            signalAspect: activeSignalAspect,
            statusText,
            currentStation: nearestStationName,
            length: tLen,
            lastStopStationId: newLastStopStationId,
            trainNumber: t.trainNumber,
            scheduledArrival: t.scheduledArrival,
            scheduledDeparture: t.scheduledDeparture,
            nextStop: t.nextStop,
            timetableActive: t.timetableActive
            };
          });

          queueMicrotask(() => {
            useMaintenanceStore.getState().setTrains(nextTrains);
          });
          return nextTrains;
        });
          lastTime = time - (delta % 16);
        }
        animationFrameId = requestAnimationFrame(loop);
      };
      
      animationFrameId = requestAnimationFrame(loop);
      
      return () => cancelAnimationFrame(animationFrameId);
    }, [userSpeedMultiplier]);
  
    return trains;
  };
