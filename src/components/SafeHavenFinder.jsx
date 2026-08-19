import { useState } from 'react';
import { 
  ShieldCheck, 
  Hospital, 
  Store, 
  GraduationCap, 
  PhoneCall, 
  Navigation, 
  MapPin, 
  CheckCircle2,
  ExternalLink,
  Search,
  Building2
} from 'lucide-react';
import { SAFE_HAVENS } from '../data/mockData';

export default function SafeHavenFinder({
  onSetDestination
}) {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHavens = SAFE_HAVENS.filter((sh) => {
    if (filter !== 'all' && sh.category !== filter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return sh.name.toLowerCase().includes(q) || sh.address.toLowerCase().includes(q) || sh.type.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="glass-panel-elevated rounded-3xl p-5 sm:p-7 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              Emergency Safe-Haven Locator
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                24/7 VERIFIED NETWORK
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Nearby verified safe spaces: 24/7 Police Booths, Open Hospitals, and Verified Local Shops with one-click navigation.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search safe havens..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'all', label: 'All Safe Havens', icon: Building2 },
          { id: 'police', label: '24/7 Police Booths', icon: ShieldCheck },
          { id: 'hospital', label: 'Open Hospitals & ER', icon: Hospital },
          { id: 'pharmacy', label: '24/7 Pharmacies', icon: Store },
          { id: 'business', label: 'Verified Local Shops', icon: Store },
          { id: 'campus', label: 'Campus Escort Posts', icon: GraduationCap }
        ].map((cat) => {
          const Icon = cat.icon;
          const isSelected = filter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isSelected
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Safe Haven Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHavens.map((haven) => {
          let Icon = ShieldCheck;
          let iconColor = 'text-emerald-400 bg-emerald-500/20';
          let borderAccent = 'hover:border-emerald-500/50';

          if (haven.category === 'hospital') {
            Icon = Hospital;
            iconColor = 'text-cyan-400 bg-cyan-500/20';
            borderAccent = 'hover:border-cyan-500/50';
          } else if (haven.category === 'pharmacy' || haven.category === 'business') {
            Icon = Store;
            iconColor = 'text-amber-400 bg-amber-500/20';
            borderAccent = 'hover:border-amber-500/50';
          } else if (haven.category === 'campus') {
            Icon = GraduationCap;
            iconColor = 'text-indigo-400 bg-indigo-500/20';
            borderAccent = 'hover:border-indigo-500/50';
          }

          const googleNavUrl = haven.navUrl || `https://www.google.com/maps/dir/?api=1&destination=${haven.lat},${haven.lng}`;

          return (
            <div
              key={haven.id}
              className={`p-5 rounded-2xl bg-slate-900/90 border border-slate-800 ${borderAccent} transition-all flex flex-col justify-between space-y-4 shadow-sm hover:shadow-xl`}
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className={`p-2.5 rounded-xl ${iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white line-clamp-1">{haven.name}</h4>
                      <p className="text-[11px] text-emerald-400 font-medium">{haven.openHours}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md shrink-0">
                    {haven.distance}
                  </span>
                </div>

                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="line-clamp-1">{haven.address}</span>
                </p>

                {/* Features Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {haven.features.map((feat, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800 flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                      <span>{feat}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons: 1-Click Navigation & Direct Call */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
                {/* 1-Click Google Maps Navigation Link */}
                <a
                  href={googleNavUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>1-Click Nav</span>
                </a>

                {/* Direct Emergency Call Desk */}
                <a
                  href={`tel:${haven.phone}`}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1 transition-all"
                  title="Direct Phone Call"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call</span>
                </a>

                {/* Set as Destination */}
                {onSetDestination && (
                  <button
                    onClick={() => onSetDestination(haven.name)}
                    className="py-2 px-3 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center justify-center gap-1 transition-all"
                    title="Plan Route to this Safe Haven"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
