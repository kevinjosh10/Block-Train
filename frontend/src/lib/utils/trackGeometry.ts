import { Station } from '../types';
import { CENTER_Y, TRACK_GAP } from '../constants';

export const getStationMainY = (station: any, effectiveLane: number) => {
  const pYs = [];
  const startY = CENTER_Y + station.yOffset - ((station.p - 1) * TRACK_GAP) / 2;
  for (let i = 0; i < station.p; i++) pYs.push(startY + i * TRACK_GAP);
  
  const numLanes = station.p <= 4 ? 2 : 3;
  let idxTop, idxMid, idxBot;
  if (numLanes === 3) {
    const third = Math.floor(station.p / 3);
    idxTop = Math.floor(third / 2);
    idxMid = third + Math.floor(third / 2);
    idxBot = third * 2 + Math.floor((station.p - third * 2) / 2);
  } else {
    const half = Math.floor(station.p / 2);
    idxTop = Math.floor(half / 2);
    idxMid = idxTop; // Mid merges into Top for 2-lane stations
    idxBot = half + Math.floor((station.p - half) / 2);
  }
  
  const yTop = pYs[idxTop];
  const yMid = pYs[idxMid];
  const yBot = pYs[idxBot];
  
  if (effectiveLane <= -1) return yTop;
  if (effectiveLane >= 1) return yBot;
  if (effectiveLane < 0) return yMid + (yTop - yMid) * Math.abs(effectiveLane);
  return yMid + (yBot - yMid) * effectiveLane;
};

export const drawThroat = (startX: number, startY: number, endX: number, endY: number) => {
  let path = `M ${startX} ${startY}`;
  const steps = 24; 
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const x = startX + (endX - startX) * t;
    const y = startY + (endY - startY) * ((1 - Math.cos(Math.PI * t)) / 2);
    path += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return path;
};
