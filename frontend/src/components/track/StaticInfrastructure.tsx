import React from 'react';
import { TrackLine } from './TrackLine';
import { TrackCurve } from './TrackCurve';
import { EntryExitTracks } from './EntryExitTracks';
import { drawThroat } from '../../lib/utils/trackGeometry';
import { STATIONS } from '../../lib/stations';
import { STATION_SPACING, TRACK_GAP } from '../../lib/constants';
import { getStationMainY } from '../../lib/utils/trackGeometry';

export const StaticInfrastructure = React.memo(() => {
  return (
    <>
      <EntryExitTracks />

      {STATIONS.map((station, i) => {
        const sX = 600 + i * STATION_SPACING;
        const yardStart = sX + station.yardStartOffset;
        const yardEnd = sX + station.yardEndOffset;
        
        const mTop = getStationMainY(station, -1);
        const mMid = getStationMainY(station, 0);
        const mBot = getStationMainY(station, 1);

        const currLanes = station.p <= 4 ? 2 : 3;

        return (
          <g key={station.id}>
            {/* Mainlines running straight through yard */}
            <TrackLine x1={yardStart} y1={mTop} x2={yardEnd} y2={mTop} />
            {currLanes === 3 && (
              <TrackLine x1={yardStart} y1={mMid} x2={yardEnd} y2={mMid} />
            )}
            <TrackLine x1={yardStart} y1={mBot} x2={yardEnd} y2={mBot} />

            {/* Inter-station S-Curves */}
            {i < STATIONS.length - 1 && (() => {
              const nextStation = STATIONS[i+1];
              const nextYardStart = sX + STATION_SPACING + nextStation.yardStartOffset;
              
              const currLanes = station.p <= 4 ? 2 : 3;
              const nextLanes = nextStation.p <= 4 ? 2 : 3;

              const nTop = getStationMainY(nextStation, -1);
              const nBot = getStationMainY(nextStation, 1);
              const nMid = nextLanes === 3 ? getStationMainY(nextStation, 0) : nTop; // mid merges to top if missing

              return (
                <>
                  <TrackCurve d={drawThroat(yardEnd, mTop, nextYardStart, nTop)} />
                  {currLanes === 3 && nextLanes === 3 && (
                    <TrackCurve d={drawThroat(yardEnd, mMid, nextYardStart, nMid)} />
                  )}
                  {currLanes === 3 && nextLanes === 2 && (
                    <TrackCurve d={drawThroat(yardEnd, mMid, nextYardStart, nTop)} opacity={0.5} />
                  )}
                  {currLanes === 2 && nextLanes === 3 && (
                    <TrackCurve d={drawThroat(yardEnd, mTop, nextYardStart, nMid)} opacity={0.5} />
                  )}
                  <TrackCurve d={drawThroat(yardEnd, mBot, nextYardStart, nBot)} />
                </>
              );
            })()}

            {/* Explicit Crossovers specifically at MMNK */}
            {station.id === 'MMNK' && station.p <= 4 && (
              <>
                <TrackCurve d={drawThroat(sX - 450, mTop, sX - 300, mBot)} />
                <TrackCurve d={drawThroat(sX - 450, mBot, sX - 300, mTop)} />
              </>
            )}

            {/* Premium Glassmorphic Station Box */}
            <rect x={sX - 250} y={station.platforms[0].y - 45} width={500} height={(station.p * TRACK_GAP) + 70} fill="rgba(255, 255, 255, 0.05)" stroke="#374151" strokeWidth="1" rx="8" />
            
            {/* High-Tech Corner Accents */}
            <path d={`M ${sX - 250} ${station.platforms[0].y - 30} L ${sX - 250} ${station.platforms[0].y - 45} L ${sX - 235} ${station.platforms[0].y - 45}`} fill="none" stroke="#4b5563" strokeWidth="2" opacity="0.8" />
            <path d={`M ${sX + 250} ${station.platforms[0].y - 30} L ${sX + 250} ${station.platforms[0].y - 45} L ${sX + 235} ${station.platforms[0].y - 45}`} fill="none" stroke="#4b5563" strokeWidth="2" opacity="0.8" />
            <path d={`M ${sX - 250} ${station.platforms[station.p-1].y + 10} L ${sX - 250} ${station.platforms[station.p-1].y + 25} L ${sX - 235} ${station.platforms[station.p-1].y + 25}`} fill="none" stroke="#4b5563" strokeWidth="2" opacity="0.8" />
            <path d={`M ${sX + 250} ${station.platforms[station.p-1].y + 10} L ${sX + 250} ${station.platforms[station.p-1].y + 25} L ${sX + 235} ${station.platforms[station.p-1].y + 25}`} fill="none" stroke="#4b5563" strokeWidth="2" opacity="0.8" />
            
            {/* Station Name Header Bar */}
            <rect x={sX - 180} y={station.platforms[0].y - 85} width={360} height={40} fill="#111827" stroke="#374151" strokeWidth="1" rx="20" />
            <text x={sX} y={station.platforms[0].y - 59} fill="#9ca3af" fontSize="18" textAnchor="middle" fontWeight="800" className="font-mono tracking-widest">
              <tspan fill="#facc15">{station.id}</tspan> <tspan fill="#4b5563">|</tspan> {station.name.toUpperCase()}
            </text>

            {/* Tracks & Platforms */}
            {station.platforms.map((plat, pIndex) => {
              const py = plat.y;
              const mainLineY = plat.mainLineY;
              const divergeStart = sX + plat.divergeStartOffset;
              const sZoneStart = sX + plat.sZoneStartOffset;
              const sZoneEnd = sX + plat.sZoneEndOffset;
              const convergeEnd = sX + plat.convergeEndOffset;

              return (
                <g key={`${station.id}-p${pIndex}`}>
                  {!plat.isMainline && (
                    <>
                      <TrackCurve d={drawThroat(divergeStart, mainLineY, sZoneStart, py)} />
                      <TrackLine x1={sZoneStart} y1={py} x2={sZoneEnd} y2={py} />
                      <TrackCurve d={drawThroat(sZoneEnd, py, convergeEnd, mainLineY)} />
                    </>
                  )}

                  {pIndex < station.p - 1 && (() => {
                    const pWidth = Math.max(40, sZoneEnd - sZoneStart - 40);
                    const pStartX = sZoneStart + 20;
                    return (
                      <g>
                        {/* Platform Base */}
                        <rect 
                          x={pStartX} 
                          y={py + 8} 
                          width={pWidth} 
                          height={TRACK_GAP - 16} 
                          fill="#1f2937" 
                          stroke="#374151" 
                          strokeWidth="1"
                          rx="2"
                        />
                        {/* Yellow Safety Edge Lines */}
                        <line x1={pStartX} y1={py + 9} x2={pStartX + pWidth} y2={py + 9} stroke="#facc15" strokeWidth="1" strokeDasharray="4 4" opacity="0.8" />
                        <line x1={pStartX} y1={py + 8 + (TRACK_GAP - 16) - 1} x2={pStartX + pWidth} y2={py + 8 + (TRACK_GAP - 16) - 1} stroke="#facc15" strokeWidth="1" strokeDasharray="4 4" opacity="0.8" />
                        
                        {/* Platform Hatching Pattern Simulated */}
                        <rect 
                          x={pStartX + 4} 
                          y={py + 12} 
                          width={pWidth - 8} 
                          height={TRACK_GAP - 24} 
                          fill="rgba(55, 65, 81, 0.4)" 
                          rx="1"
                        />
                        {/* Platform Numbers */}
                        <text x={pStartX + pWidth/2} y={py + (TRACK_GAP / 2) + 2} fill="#9ca3af" fontSize="9" textAnchor="middle" fontWeight="700" className="font-mono">
                          PF-{pIndex + 1}
                        </text>
                      </g>
                    )
                  })()}
                </g>
              );
            })}
          </g>
        );
      })}
    </>
  );
});
