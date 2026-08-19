import { useState, useEffect } from 'react';
import { 
  Compass, 
  Play, 
  Pause, 
  RotateCcw, 
  Hospital, 
  PhoneCall, 
  ShieldCheck, 
  AlertTriangle, 
  X, 
  Layers
} from 'lucide-react';
import { SAFE_HAVENS, SAFETY_ZONES } from '../data/mockData';

export default function InteractiveSafetyMap({
  routeVariant,
  hazards,
  origin,
  destination,
  onSelectHazard
}) {
  // Layer toggles
  const [showGreenZones, setShowGreenZones] = useState(true);
  const [showYellowZones, setShowYellowZones] = useState(true);
  const [showRedZones, setShowRedZones] = useState(true);
  const [showLightingLayer, setShowLightingLayer] = useState(true);
  const [showSafeHavensLayer, setShowSafeHavensLayer] = useState(true);

  // Navigation Simulator state
  const [isNavigating, setIsNavigating] = useState(false);
  const [navProgress, setNavProgress] = useState(0);

  // Interactive inspect states
  const [selectedZone, setSelectedZone] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(null);

  const isSafest = routeVariant === 'safest';

  // Navigation simulation loop
  useEffect(() => {
    let interval = null;
    if (isNavigating) {
      interval = setInterval(() => {
        setNavProgress((prev) => {
          if (prev >= 100) {
            setIsNavigating(false);
            return 100;
          }
          return prev + 2;
        });
      }, 120);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isNavigating]);

  // Coordinates on 800x480 SVG canvas
  const originCoord = { x: 120, y: 380 };
  const destCoord = { x: 680, y: 100 };

  // Safest route path (well-lit arterial detour through Green Safe Zones)
  const safestPathD = "M 120 380 C 180 340, 240 370, 310 260 S 480 220, 540 180 S 600 120, 680 100";
  
  // Fastest route path (direct shortcut cutting right through Red Hazard Zones)
  const fastestPathD = "M 120 380 L 320 290 L 460 210 L 680 100";

  // Interpolated animated avatar position along path
  const getNavPosition = (progress) => {
    const t = progress / 100;
    if (isSafest) {
      const x = 120 + t * (680 - 120);
      const y = 380 - Math.sin(t * Math.PI) * 80 - t * 280;
      return { x, y };
    } else {
      const x = 120 + t * (680 - 120);
      const y = 380 - t * 280;
      return { x, y };
    }
  };

  const currentNavPos = getNavPosition(navProgress);

  return (
    <div className="glass-panel-elevated rounded-3xl p-5 sm:p-6 relative overflow-hidden transition-all space-y-4">
      
      {/* Map Header & Zone Legend Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '20s' }} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              Interactive Route Safety Map Visualization
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                MULTI-ZONE RADAR
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Color-coded safety corridors: <strong className="text-emerald-400">Green (Safe)</strong>, <strong className="text-amber-400">Yellow (Caution)</strong>, and <strong className="text-rose-400">Red (High-Risk Hazards)</strong>.
            </p>
          </div>
        </div>

        {/* Action Controls: Simulate Walk & Reset */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              if (navProgress >= 100) setNavProgress(0);
              setIsNavigating(!isNavigating);
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white flex items-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            {isNavigating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isNavigating ? 'Pause Walk' : navProgress > 0 && navProgress < 100 ? 'Resume Walk' : 'Simulate Walk'}</span>
          </button>

          {navProgress > 0 && (
            <button
              onClick={() => {
                setIsNavigating(false);
                setNavProgress(0);
              }}
              className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              title="Reset walk simulation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Safety Zone Layer Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-2 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
        <div className="flex items-center gap-1 text-slate-400 font-semibold px-2">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Safety Layers:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {/* Green Zones Toggle */}
          <button
            onClick={() => setShowGreenZones(!showGreenZones)}
            className={`px-2.5 py-1.5 rounded-xl font-bold border transition-all flex items-center gap-1.5 ${
              showGreenZones
                ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
            <span>Green Safe Zones</span>
          </button>

          {/* Yellow Zones Toggle */}
          <button
            onClick={() => setShowYellowZones(!showYellowZones)}
            className={`px-2.5 py-1.5 rounded-xl font-bold border transition-all flex items-center gap-1.5 ${
              showYellowZones
                ? 'bg-amber-950/80 border-amber-500/60 text-amber-300 shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
            <span>Yellow Caution</span>
          </button>

          {/* Red Zones Toggle */}
          <button
            onClick={() => setShowRedZones(!showRedZones)}
            className={`px-2.5 py-1.5 rounded-xl font-bold border transition-all flex items-center gap-1.5 ${
              showRedZones
                ? 'bg-rose-950/80 border-rose-500/60 text-rose-300 shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500" />
            <span>Red Hazard Zones</span>
          </button>

          {/* Safe Havens Toggle */}
          <button
            onClick={() => setShowSafeHavensLayer(!showSafeHavensLayer)}
            className={`px-2.5 py-1.5 rounded-xl font-bold border transition-all flex items-center gap-1.5 ${
              showSafeHavensLayer
                ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300 shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <Hospital className="w-3.5 h-3.5 text-cyan-400" />
            <span>24/7 Safe Havens</span>
          </button>

          {/* Lighting Corridors */}
          <button
            onClick={() => setShowLightingLayer(!showLightingLayer)}
            className={`px-2.5 py-1.5 rounded-xl font-bold border transition-all flex items-center gap-1.5 ${
              showLightingLayer
                ? 'bg-yellow-950/80 border-yellow-500/50 text-yellow-300 shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-yellow-300" />
            <span>Lighting Corridors</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas Multi-Zone Map */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/10] bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl select-none">
        
        {/* Subtle background radar scan sweep */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <div className="absolute top-1/2 left-1/2 w-[120%] h-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-500/20 bg-gradient-to-tr from-cyan-500/10 to-transparent animate-radar" />
        </div>

        <svg
          viewBox="0 0 800 480"
          className="w-full h-full"
          style={{ background: 'radial-gradient(circle at 50% 50%, #0c1527 0%, #030712 100%)' }}
        >
          {/* Pattern Grids & Glow Filters */}
          <defs>
            <pattern id="tactical-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
            </pattern>
            <filter id="glow-emerald-zone" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-amber-zone" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-rose-zone" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="7" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <rect width="100%" height="100%" fill="url(#tactical-grid)" />

          {/* City Road Network Arterials */}
          <g stroke="rgba(148, 163, 184, 0.16)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M 60 400 L 740 400" />
            <path d="M 60 260 L 740 260" />
            <path d="M 60 120 L 740 120" />
            <path d="M 160 40 L 160 440" />
            <path d="M 340 40 L 340 440" />
            <path d="M 520 40 L 520 440" />
            <path d="M 680 40 L 680 440" />
            <path d="M 120 420 L 480 80" />
            <path d="M 300 440 L 720 140" />
          </g>

          {/* 1. GREEN SAFE ZONES */}
          {showGreenZones && SAFETY_ZONES.filter(z => z.type === 'safe').map((zone) => (
            <g
              key={zone.id}
              className="cursor-pointer transition-opacity hover:opacity-90"
              onClick={() => setSelectedZone(zone)}
            >
              <circle
                cx={zone.cx}
                cy={zone.cy}
                r={zone.r}
                fill={zone.fillColor}
                stroke={zone.borderColor}
                strokeWidth="2"
                filter="url(#glow-emerald-zone)"
              />
              <circle cx={zone.cx} cy={zone.cy} r="4" fill="#34d399" />
              <text x={zone.cx} y={zone.cy + zone.r + 14} fill="#6ee7b7" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                🟢 SAFE ZONE
              </text>
            </g>
          ))}

          {/* 2. YELLOW CAUTION CORRIDORS */}
          {showYellowZones && SAFETY_ZONES.filter(z => z.type === 'caution').map((zone) => (
            <g
              key={zone.id}
              className="cursor-pointer transition-opacity hover:opacity-90"
              onClick={() => setSelectedZone(zone)}
            >
              <circle
                cx={zone.cx}
                cy={zone.cy}
                r={zone.r}
                fill={zone.fillColor}
                stroke={zone.borderColor}
                strokeWidth="1.8"
                strokeDasharray="4 3"
                filter="url(#glow-amber-zone)"
              />
              <text x={zone.cx} y={zone.cy + zone.r + 14} fill="#fcd34d" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                🟡 CAUTION ZONE
              </text>
            </g>
          ))}

          {/* 3. RED HIGH-RISK HAZARD ZONES */}
          {showRedZones && SAFETY_ZONES.filter(z => z.type === 'hazard').map((zone) => (
            <g
              key={zone.id}
              className="cursor-pointer transition-opacity hover:opacity-90"
              onClick={() => setSelectedZone(zone)}
            >
              <circle
                cx={zone.cx}
                cy={zone.cy}
                r={zone.r}
                fill={zone.fillColor}
                stroke={zone.borderColor}
                strokeWidth="2.5"
                strokeDasharray="6 4"
                filter="url(#glow-rose-zone)"
              />
              <polygon points={`${zone.cx},${zone.cy - 12} ${zone.cx + 10},${zone.cy + 6} ${zone.cx - 10},${zone.cy + 6}`} fill="#e11d48" stroke="#fff" strokeWidth="1" />
              <text x={zone.cx} y={zone.cy + 4} fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">!</text>
              <text x={zone.cx} y={zone.cy + zone.r + 14} fill="#fda4af" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                🔴 DANGER ZONE
              </text>
            </g>
          ))}

          {/* Lighting Corridor Overlays */}
          {showLightingLayer && (
            <g>
              <path
                d={safestPathD}
                stroke="rgba(6, 182, 212, 0.22)"
                strokeWidth="32"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          )}

          {/* Active Navigation Route Path */}
          {isSafest ? (
            <g>
              <path
                d={safestPathD}
                stroke="#10b981"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
                filter="url(#glow-emerald-zone)"
              />
              <path
                d={safestPathD}
                stroke="#a7f3d0"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                className="animate-dash-flow"
              />
            </g>
          ) : (
            <g>
              <path
                d={fastestPathD}
                stroke="#f59e0b"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
                filter="url(#glow-amber-zone)"
              />
              <path
                d={fastestPathD}
                stroke="#fef08a"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                className="animate-dash-flow"
              />
            </g>
          )}

          {/* Safe Haven Pins */}
          {showSafeHavensLayer && SAFE_HAVENS.slice(0, 4).map((sh, idx) => {
            const positions = [
              { x: 210, y: 350 },
              { x: 480, y: 160 },
              { x: 570, y: 130 },
              { x: 340, y: 400 }
            ];
            const pos = positions[idx];
            return (
              <g
                key={sh.id}
                className="cursor-pointer transition-transform hover:scale-125"
                onClick={() => setActiveTooltip({ type: 'haven', data: sh })}
              >
                <circle cx={pos.x} cy={pos.y} r="11" fill="#064e3b" stroke="#34d399" strokeWidth="2" />
                <circle cx={pos.x} cy={pos.y} r="4" fill="#a7f3d0" />
                <text x={pos.x + 15} y={pos.y + 4} fill="#a7f3d0" fontSize="9" fontWeight="bold">
                  {sh.type.split(' ')[0]}
                </text>
              </g>
            );
          })}

          {/* Interactive Community Hazard Pins */}
          {hazards.slice(0, 2).map((haz, idx) => {
            const positions = [{ x: 320, y: 290 }, { x: 460, y: 210 }];
            const pos = positions[idx];
            return (
              <g
                key={haz.id}
                className="cursor-pointer transition-transform hover:scale-125"
                onClick={() => onSelectHazard && onSelectHazard(haz)}
              >
                <polygon points={`${pos.x},${pos.y - 12} ${pos.x + 12},${pos.y + 8} ${pos.x - 12},${pos.y + 8}`} fill="#be123c" stroke="#ffffff" strokeWidth="1.5" />
                <text x={pos.x} y={pos.y + 6} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">!</text>
              </g>
            );
          })}

          {/* Origin Marker */}
          <g>
            <circle cx={originCoord.x} cy={originCoord.y} r="15" fill="#047857" opacity="0.4" />
            <circle cx={originCoord.x} cy={originCoord.y} r="9" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
            <text x={originCoord.x} y={originCoord.y + 24} fill="#a7f3d0" fontSize="11" fontWeight="bold" textAnchor="middle">
              ORIGIN: {origin.split(' ')[0]}
            </text>
          </g>

          {/* Destination Marker */}
          <g>
            <circle cx={destCoord.x} cy={destCoord.y} r="15" fill="#be123c" opacity="0.4" />
            <circle cx={destCoord.x} cy={destCoord.y} r="9" fill="#f43f5e" stroke="#ffffff" strokeWidth="2.5" />
            <text x={destCoord.x} y={destCoord.y - 15} fill="#fda4af" fontSize="11" fontWeight="bold" textAnchor="middle">
              DESTINATION: {destination.split(' ')[0]}
            </text>
          </g>

          {/* Simulated User GPS Marker */}
          <g transform={`translate(${currentNavPos.x}, ${currentNavPos.y})`}>
            <circle cx="0" cy="0" r="18" fill="rgba(6, 182, 212, 0.3)" className="animate-ping" />
            <circle cx="0" cy="0" r="9" fill="#06b6d4" stroke="#ffffff" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="3.5" fill="#ffffff" />
            <text x="0" y="-16" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
              {navProgress > 0 ? `${navProgress}% Complete` : 'You (Live GPS)'}
            </text>
          </g>
        </svg>

        {/* Map Legend Overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-800 text-[11px] text-slate-300 flex flex-wrap items-center gap-3 shadow-lg">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>Green: Safe Zones</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>Yellow: Caution Corridors</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Red: High-Risk Hotspots</span>
          </div>
        </div>

        {/* Coordinates Readout */}
        <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] font-mono text-cyan-400 hidden sm:block">
          RADAR: 37.7749° N | 122.4194° W
        </div>

      </div>

      {/* Selected Safety Zone Telemetry Inspector Modal */}
      {selectedZone && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700 animate-in fade-in flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-xl shrink-0 ${
              selectedZone.type === 'safe' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
              selectedZone.type === 'caution' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
              'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}>
              {selectedZone.type === 'safe' ? <ShieldCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h5 className="text-sm font-bold text-white">{selectedZone.name}</h5>
                <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold uppercase ${
                  selectedZone.type === 'safe' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' :
                  selectedZone.type === 'caution' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                  'bg-rose-950 text-rose-300 border border-rose-500/40'
                }`}>
                  {selectedZone.riskLevel}
                </span>
              </div>
              <p className="text-xs text-slate-300">{selectedZone.description}</p>
              
              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                <span>💡 {selectedZone.lumens}</span>
                <span>•</span>
                <span>👥 {selectedZone.footfall}</span>
                <span>•</span>
                <span>📹 {selectedZone.cctv}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setSelectedZone(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 self-start sm:self-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Safe Haven Mini Inspector */}
      {activeTooltip && (
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Hospital className="w-4 h-4" />
            </span>
            <div>
              <h5 className="text-xs font-bold text-white">{activeTooltip.data.name}</h5>
              <p className="text-[11px] text-slate-400">{activeTooltip.data.address} • {activeTooltip.data.openHours}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`tel:${activeTooltip.data.phone}`}
              className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors flex items-center gap-1"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call</span>
            </a>
            <button
              onClick={() => setActiveTooltip(null)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
