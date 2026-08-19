import { 
  ShieldCheck, 
  Zap, 
  Lightbulb, 
  Users, 
  PhoneCall, 
  AlertTriangle, 
  Navigation, 
  CheckCircle, 
  XCircle, 
  SlidersHorizontal
} from 'lucide-react';

export default function RouteBreakdown({
  routeVariant,
  setRouteVariant,
  safetyResult,
  onOpenHazards
}) {
  const isSafest = routeVariant === 'safest';
  const metrics = safetyResult?.metrics || {
    lightingScore: 92,
    crowdScore: 84,
    responseTime: '2.8 mins',
    emergencyScore: 88,
    activeHazardsOnPath: 0,
    safeHavensOnPath: 4,
    cameraCoverage: '85%'
  };

  const tradeOff = safetyResult?.tradeOff || {};
  const safestInfo = tradeOff.safest || {};
  const fastestInfo = tradeOff.fastest || {};
  const waypoints = safetyResult?.waypoints || [];

  return (
    <div className="space-y-6">
      
      {/* Route Variant Toggle Header */}
      <div className="glass-panel-elevated rounded-3xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
              AI Route Recommendation & Safety Breakdown
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Compare AI-optimized protected pathways against standard direct routes.
            </p>
          </div>

          {/* Toggle Button Pills */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner w-full sm:w-auto">
            <button
              onClick={() => setRouteVariant('safest')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isSafest
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Safest Route (AI)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-900/80 text-emerald-200 border border-emerald-400/30">
                RECOMMENDED
              </span>
            </button>

            <button
              onClick={() => setRouteVariant('fastest')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                !isSafest
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Fastest Route</span>
            </button>
          </div>
        </div>

        {/* Trade-Off Comparison Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          
          {/* Safest Route Card */}
          <div
            onClick={() => setRouteVariant('safest')}
            className={`cursor-pointer rounded-2xl p-4 sm:p-5 border transition-all ${
              isSafest
                ? 'bg-emerald-950/40 border-emerald-500/60 ring-2 ring-emerald-500/20 shadow-lg'
                : 'bg-slate-900/60 border-slate-800/80 opacity-70 hover:opacity-100 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Safest Route</h4>
                  <p className="text-[11px] text-emerald-400 font-medium">AI Shield Priority</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-emerald-400">{safestInfo.score || 94}/100</div>
                <div className="text-[11px] text-slate-400">{safestInfo.timeMins || 16} mins • {safestInfo.distance || '1.4 mi'}</div>
              </div>
            </div>

            <ul className="mt-3 space-y-1.5 text-xs text-slate-300">
              {safestInfo.highlights?.map((hl, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{hl}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Fastest Route Card */}
          <div
            onClick={() => setRouteVariant('fastest')}
            className={`cursor-pointer rounded-2xl p-4 sm:p-5 border transition-all ${
              !isSafest
                ? 'bg-amber-950/40 border-amber-500/60 ring-2 ring-amber-500/20 shadow-lg'
                : 'bg-slate-900/60 border-slate-800/80 opacity-70 hover:opacity-100 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Zap className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Fastest Route</h4>
                  <p className="text-[11px] text-amber-400 font-medium">Direct Shortcut Path</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-amber-400">{fastestInfo.score || 52}/100</div>
                <div className="text-[11px] text-slate-400">{fastestInfo.timeMins || 12} mins • {fastestInfo.distance || '1.2 mi'}</div>
              </div>
            </div>

            <ul className="mt-3 space-y-1.5 text-xs text-slate-300">
              {fastestInfo.highlights?.map((hl, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{hl}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

      {/* 4 Key Visual Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Lighting Level */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              Lighting Level
            </span>
            <span className="text-xs font-bold text-white">{metrics.lightingScore}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                metrics.lightingScore > 75 ? 'bg-amber-400' : metrics.lightingScore > 50 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${metrics.lightingScore}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            {metrics.lightingScore > 75
              ? 'High illumination along main municipal corridors.'
              : 'Sub-optimal lighting with reported dark blind spots.'}
          </p>
        </div>

        {/* 2. Crowd Density & Footfall */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-cyan-400" />
              Crowd Density
            </span>
            <span className="text-xs font-bold text-white">{metrics.crowdScore}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                metrics.crowdScore > 70 ? 'bg-cyan-400' : metrics.crowdScore > 40 ? 'bg-cyan-600' : 'bg-rose-500'
              }`}
              style={{ width: `${metrics.crowdScore}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            {metrics.crowdScore > 65
              ? 'Active footfall with open commercial shops.'
              : 'Deserted route with low ambient pedestrian witness count.'}
          </p>
        </div>

        {/* 3. Emergency Response Access */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              Dispatch Response
            </span>
            <span className="text-xs font-bold text-emerald-400">{metrics.responseTime}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, (6 / parseFloat(metrics.responseTime || '3')) * 50)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            Average patrol arrival ETA across route buffer radius.
          </p>
        </div>

        {/* 4. Recent Community Incident Reports */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Path Hazards
            </span>
            <span className={`text-xs font-bold ${metrics.activeHazardsOnPath === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {metrics.activeHazardsOnPath === 0 ? '0 Blockers' : `${metrics.activeHazardsOnPath} Active`}
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                metrics.activeHazardsOnPath === 0 ? 'bg-emerald-500 w-full' : 'bg-rose-500 w-2/3'
              }`}
            />
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">
              {metrics.activeHazardsOnPath === 0 ? 'Safe corridor verified' : 'Avoid unsafe detour'}
            </span>
            <button
              onClick={onOpenHazards}
              className="text-cyan-400 hover:underline flex items-center gap-0.5"
            >
              <span>View Alerts</span>
            </button>
          </div>
        </div>

      </div>

      {/* Turn-by-Turn Waypoint Guidance with Individual Safety Tags */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Navigation className="w-4 h-4 text-cyan-400" />
            Turn-by-Turn Safety Guidance
          </h4>
          <span className="text-xs text-slate-400">
            {waypoints.length} Monitored Segments
          </span>
        </div>

        <div className="space-y-3">
          {waypoints.map((step) => {
            const isHighSafety = step.safetyRating === 'High';
            return (
              <div
                key={step.step}
                className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition-all"
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                  isHighSafety ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-400' : 'bg-rose-950 border border-rose-500/40 text-rose-400'
                }`}>
                  {step.step}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="text-xs font-semibold text-white">{step.instruction}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      isHighSafety ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/30' : 'bg-rose-900/60 text-rose-300 border border-rose-500/30'
                    }`}>
                      {step.safetyRating} Safety
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] text-slate-400">
                    <span className="text-slate-300 font-medium">{step.street}</span>
                    <span>•</span>
                    <span className="text-amber-400/90">{step.lighting}</span>
                    {step.safeHavenNearby && (
                      <>
                        <span>•</span>
                        <span className="text-cyan-400 font-medium">Safe Haven: {step.safeHavenNearby}</span>
                      </>
                    )}
                    {step.hazardWarning && (
                      <span className="text-rose-400 font-bold">⚠️ {step.hazardWarning}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
