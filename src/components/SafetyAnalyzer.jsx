import { 
  Navigation, 
  MapPin, 
  ArrowUpDown, 
  Sun, 
  Sunset, 
  Moon, 
  Sunrise, 
  Footprints, 
  Car, 
  Train, 
  Bike, 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  Zap, 
  Info,
  Clock
} from 'lucide-react';
import { LOCATION_PRESETS, TIME_OF_DAY_OPTIONS, TRAVEL_MODES } from '../data/mockData';

export default function SafetyAnalyzer({
  origin,
  setOrigin,
  destination,
  setDestination,
  timeOfDay,
  setTimeOfDay,
  mode,
  setMode,
  safetyResult,
  onAnalyze,
  isAnalyzing
}) {
  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const score = safetyResult?.score || 88;
  const level = safetyResult?.level || 'High Safety';
  const badgeColor = safetyResult?.badgeColor || 'emerald';

  // SVG Gauge calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let scoreGradientClass = 'from-emerald-400 to-teal-500';
  let badgeBorderClass = 'border-emerald-500/40 bg-emerald-950/60 text-emerald-300';
  let pulseGlowClass = 'animate-pulse-emerald';

  if (badgeColor === 'amber') {
    scoreGradientClass = 'from-amber-400 to-yellow-500';
    badgeBorderClass = 'border-amber-500/40 bg-amber-950/60 text-amber-300';
    pulseGlowClass = 'animate-pulse-amber';
  } else if (badgeColor === 'rose') {
    scoreGradientClass = 'from-rose-500 to-red-600';
    badgeBorderClass = 'border-rose-500/40 bg-rose-950/60 text-rose-300';
    pulseGlowClass = 'animate-pulse-rose';
  }

  return (
    <div className="glass-panel-elevated rounded-3xl p-5 sm:p-7 transition-all">
      <div className="flex flex-col lg:flex-row gap-7 items-stretch">
        
        {/* Left Form Controls: Route, Time, Mode */}
        <div className="flex-1 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white tracking-wide">
                Route Safety Assessment
              </h2>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              Real-Time AI Model v3.4
            </span>
          </div>

          {/* Location Inputs with Swap button */}
          <div className="space-y-3 relative">
            {/* Origin Input */}
            <div className="relative">
              <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center justify-between">
                <span>Origin (Departure Point)</span>
                <span className="text-[11px] text-cyan-400">GPS Verified</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-emerald-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  list="location-origins"
                  placeholder="Enter starting location..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                />
                <datalist id="location-origins">
                  {LOCATION_PRESETS.map((loc) => (
                    <option key={loc.id} value={loc.name}>
                      {loc.address}
                    </option>
                  ))}
                </datalist>
              </div>
            </div>

            {/* Quick Swap Icon */}
            <div className="flex justify-center -my-1.5 relative z-10">
              <button
                type="button"
                onClick={handleSwap}
                title="Swap Origin & Destination"
                className="p-1.5 rounded-full bg-slate-800 hover:bg-cyan-900/60 border border-slate-700 text-slate-300 hover:text-cyan-300 transition-all hover:scale-110 shadow-md"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Destination Input */}
            <div className="relative">
              <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center justify-between">
                <span>Destination (Target Location)</span>
                <span className="text-[11px] text-slate-400">Select or Type</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-rose-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  list="location-destinations"
                  placeholder="Enter destination..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                />
                <datalist id="location-destinations">
                  {LOCATION_PRESETS.map((loc) => (
                    <option key={loc.id} value={loc.name}>
                      {loc.address}
                    </option>
                  ))}
                </datalist>
              </div>
            </div>
          </div>

          {/* Time of Day & Travel Mode Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Time of Day Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Time of Day</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {TIME_OF_DAY_OPTIONS.map((item) => {
                  const isSelected = timeOfDay === item.id;
                  let Icon = Sun;
                  if (item.id === 'dusk') Icon = Sunset;
                  if (item.id === 'late_night') Icon = Moon;
                  if (item.id === 'pre_dawn') Icon = Sunrise;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTimeOfDay(item.id)}
                      className={`flex items-center gap-2 p-2 rounded-xl text-xs font-medium border transition-all text-left ${
                        isSelected
                          ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 shadow-sm shadow-cyan-500/20'
                          : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                      <span className="truncate">{item.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mode of Travel Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-slate-400" />
                <span>Mode of Travel</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {TRAVEL_MODES.map((item) => {
                  const isSelected = mode === item.id;
                  let Icon = Footprints;
                  if (item.id === 'cab') Icon = Car;
                  if (item.id === 'transit') Icon = Train;
                  if (item.id === 'cycling') Icon = Bike;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMode(item.id)}
                      className={`flex items-center gap-2 p-2 rounded-xl text-xs font-medium border transition-all text-left ${
                        isSelected
                          ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 shadow-sm shadow-cyan-500/20'
                          : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                      <span className="truncate">{item.label.split('/')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Analyze Button */}
          <button
            type="button"
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-600/30 hover:shadow-cyan-600/50 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Computing AI Safety Matrix...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Recalculate Dynamic Safety Score</span>
              </>
            )}
          </button>
        </div>

        {/* Right Hero: Dynamic Safety Score Gauge & Badge */}
        <div className={`w-full lg:w-80 rounded-2xl bg-slate-900/90 border border-slate-800/80 p-5 flex flex-col items-center justify-between relative overflow-hidden ${pulseGlowClass}`}>
          {/* Subtle background radar ring */}
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />

          <div className="w-full flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/60">
            <span className="font-semibold uppercase tracking-wider">Dynamic Safety Index</span>
            <span className="text-cyan-400 font-mono text-[11px]">0-100 SCALE</span>
          </div>

          {/* Circular SVG Gauge */}
          <div className="relative my-3 flex items-center justify-center">
            <svg className="w-36 h-36 transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="text-slate-800"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Colored progress circle */}
              <circle
                cx="72"
                cy="72"
                r={radius}
                stroke="currentColor"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className={`transition-all duration-1000 ease-out ${
                  badgeColor === 'emerald' ? 'text-emerald-400' : badgeColor === 'amber' ? 'text-amber-400' : 'text-rose-500'
                }`}
              />
            </svg>

            {/* Inner numeric readout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className={`text-4xl font-extrabold tracking-tight bg-gradient-to-r ${scoreGradientClass} bg-clip-text text-transparent`}>
                {score}
              </span>
              <span className="text-[11px] font-medium text-slate-400 tracking-wider uppercase">
                / 100 PTS
              </span>
            </div>
          </div>

          {/* Color-Coded Safety Badge */}
          <div className={`w-full py-2 px-3 rounded-xl border text-center font-bold text-xs flex items-center justify-center gap-2 shadow-md ${badgeBorderClass}`}>
            {badgeColor === 'emerald' && <ShieldCheck className="w-4 h-4" />}
            {badgeColor === 'amber' && <Activity className="w-4 h-4" />}
            {badgeColor === 'rose' && <ShieldAlert className="w-4 h-4" />}
            <span>{level.toUpperCase()}</span>
          </div>

          {/* Short AI Insight Snippet */}
          <div className="w-full mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
            <p className="flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span>{safetyResult?.riskSummary || 'Well-lit corridors, active emergency call boxes, and continuous footfall.'}</span>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
