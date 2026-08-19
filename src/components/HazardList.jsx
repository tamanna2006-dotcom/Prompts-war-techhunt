import { useState } from 'react';
import { 
  AlertTriangle, 
  ThumbsUp, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  PlusCircle, 
  ArrowUpDown
} from 'lucide-react';

export default function HazardList({
  hazards,
  onUpvoteHazard,
  onResolveHazard,
  onOpenReportModal
}) {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'severity' | 'upvotes'

  const categories = ['All', 'Critical', 'Broken Streetlight', 'Harassment Hotspot', 'Construction Obstacle', 'Poor Cell Coverage'];

  const filteredHazards = hazards
    .filter((h) => {
      if (selectedFilter === 'All') return true;
      if (selectedFilter === 'Critical') return h.severity === 'Critical';
      return h.category === selectedFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'upvotes') return b.upvotes - a.upvotes;
      if (sortBy === 'severity') {
        const rank = { Critical: 4, High: 3, Medium: 2, Low: 1 };
        return (rank[b.severity] || 0) - (rank[a.severity] || 0);
      }
      return 0; // Default order
    });

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'Critical':
        return 'bg-rose-950/80 text-rose-300 border-rose-500/50';
      case 'High':
        return 'bg-orange-950/80 text-orange-300 border-orange-500/50';
      case 'Medium':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/50';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="glass-panel-elevated rounded-3xl p-5 sm:p-6 space-y-5">
      
      {/* Header & New Report Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            Live Community Hazard Feed
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-500/40">
              {hazards.filter(h => !h.resolved).length} ACTIVE
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified spot alerts reported by nearby commuters and students.
          </p>
        </div>

        <button
          onClick={onOpenReportModal}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report Unsafe Spot</span>
        </button>
      </div>

      {/* Filter Tabs & Sorting Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                selectedFilter === cat
                  ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 shadow-sm'
                  : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-800">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[11px] text-slate-500">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer"
          >
            <option value="recent" className="bg-slate-900 text-slate-200">Most Recent</option>
            <option value="severity" className="bg-slate-900 text-slate-200">Highest Severity</option>
            <option value="upvotes" className="bg-slate-900 text-slate-200">Most Verified</option>
          </select>
        </div>

      </div>

      {/* Hazard Cards Feed */}
      <div className="space-y-3">
        {filteredHazards.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800/80">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-white">No active hazards in this filter</h4>
            <p className="text-xs text-slate-400 mt-1">This segment of the commuter network is currently clear.</p>
          </div>
        ) : (
          filteredHazards.map((hazard) => (
            <div
              key={hazard.id}
              className={`p-4 rounded-2xl border transition-all ${
                hazard.resolved
                  ? 'bg-slate-900/40 border-slate-800/50 opacity-60'
                  : 'bg-slate-900/80 border-slate-800/90 hover:border-slate-700 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                
                {/* Hazard Details */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${getSeverityBadge(hazard.severity)}`}>
                      {hazard.severity} Severity
                    </span>

                    <span className="text-xs font-bold text-white">
                      {hazard.title}
                    </span>

                    {hazard.verified && (
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Community Verified
                      </span>
                    )}

                    {hazard.resolved && (
                      <span className="text-[10px] text-teal-400 font-bold px-2 py-0.5 rounded bg-teal-950/70 border border-teal-500/40">
                        RESOLVED
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {hazard.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-slate-300 font-medium">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      {hazard.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {hazard.timestamp}
                    </span>
                  </div>

                  {/* Tags */}
                  {hazard.tags && hazard.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {hazard.tags.map((tag, idx) => (
                        <span key={idx} className="text-[10px] font-mono text-cyan-400/90 px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Photo Preview if attached */}
                  {hazard.photoUrl && (
                    <div className="pt-2">
                      <img
                        src={hazard.photoUrl}
                        alt="Hazard upload"
                        className="w-24 h-24 object-cover rounded-xl border border-slate-700 shadow-md"
                      />
                    </div>
                  )}
                </div>

                {/* Actions: Upvote / Verify & Mark Resolved */}
                <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <button
                    onClick={() => onUpvoteHazard(hazard.id)}
                    title="Verify this hazard is currently active"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-emerald-950/60 text-slate-300 hover:text-emerald-300 border border-slate-700/80 hover:border-emerald-500/40 text-xs font-semibold transition-all active:scale-95"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Verify ({hazard.upvotes || 0})</span>
                  </button>

                  {!hazard.resolved && (
                    <button
                      onClick={() => onResolveHazard(hazard.id)}
                      title="Mark this hazard as fixed or clear"
                      className="text-[11px] text-slate-400 hover:text-teal-300 hover:underline px-2 py-1 transition-colors"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
