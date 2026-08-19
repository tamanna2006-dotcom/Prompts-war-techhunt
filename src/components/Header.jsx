import { 
  ShieldCheck, 
  Radio, 
  Sparkles, 
  AlertOctagon, 
  PhoneCall, 
  Clock, 
  Sun, 
  Moon, 
  Share2, 
  Users,
  Mic,
  FileText,
  Wifi,
  WifiOff
} from 'lucide-react';
import { DEMO_PRESETS } from '../data/mockData';

export default function Header({
  activeTheme,
  setTheme,
  isOfflineMode,
  setIsOfflineMode,
  onSelectPreset,
  onTriggerSos,
  onOpenCheckIn,
  onOpenFakeCall,
  onOpenContacts,
  onOpenTripShare,
  onOpenVoiceListener,
  onOpenExportAudit,
  gpsStatus
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo & Telemetry Indicator */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25 ring-1 ring-white/20">
              <ShieldCheck className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  GuardianRoute <span className="text-cyan-400 font-extrabold text-sm px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40">AI</span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 hidden sm:flex items-center gap-2 font-medium">
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  AI Threat Radar Active
                </span>
                <span className="text-slate-600">•</span>
                <span>{isOfflineMode ? 'Offline Cache Active' : gpsStatus?.isSimulated ? 'Simulated GPS Mode' : 'Live GPS Locked'}</span>
              </p>
            </div>
          </div>

          {/* Quick Preset Selector & Status Indicators */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="relative group">
              <button 
                type="button"
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700/70 rounded-xl transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Demo Safety Scenarios</span>
              </button>
              
              <div className="absolute right-0 mt-1 w-80 p-2 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1 border-b border-slate-800">
                  Quick Load Commuter Scenarios
                </div>
                <div className="mt-1 space-y-1">
                  {DEMO_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => onSelectPreset(preset)}
                      className="w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-slate-800 transition-colors text-slate-200 hover:text-cyan-300 flex flex-col"
                    >
                      <span className="font-semibold">{preset.title}</span>
                      <span className="text-[11px] text-slate-400 line-clamp-1">{preset.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Offline Mode Switcher */}
            <button
              onClick={() => setIsOfflineMode(!isOfflineMode)}
              title={isOfflineMode ? "Disable Emergency Offline Mode" : "Engage Low-Connectivity Offline Mode"}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all shadow-sm ${
                isOfflineMode
                  ? 'bg-amber-950 border-amber-500 text-amber-300 shadow-amber-500/20'
                  : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {isOfflineMode ? (
                <WifiOff className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              ) : (
                <Wifi className="w-3.5 h-3.5 text-slate-500" />
              )}
              <span>{isOfflineMode ? 'Offline Active' : 'Offline Mode'}</span>
            </button>

            {/* AI Voice Trigger Shortcut */}
            <button
              onClick={onOpenVoiceListener}
              title="Open AI Voice-Activated Emergency Trigger"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-300 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 rounded-xl transition-all shadow-sm"
            >
              <Mic className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>Voice Trigger</span>
            </button>

            {/* Export Safety Audit Report */}
            <button
              onClick={onOpenExportAudit}
              title="Export Printable PDF / Text Audit Report"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 rounded-xl transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export Audit</span>
            </button>

            {/* Fake Call Shield */}
            <button
              onClick={onOpenFakeCall}
              title="Trigger Decoy Phone Call"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900/90 hover:bg-purple-950/60 hover:text-purple-300 border border-slate-800 hover:border-purple-500/40 rounded-xl transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5 text-purple-400" />
              <span>Fake Call</span>
            </button>

            {/* Check-In */}
            <button
              onClick={onOpenCheckIn}
              title="Set Arrival Check-in Timer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Check-In</span>
            </button>

            {/* Contacts */}
            <button
              onClick={onOpenContacts}
              title="Manage Emergency Contacts"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all"
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Contacts</span>
            </button>
          </div>

          {/* Right Action Tools & Main Emergency SOS Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Share Trip Link Button */}
            <button
              onClick={onOpenTripShare}
              title="Share Live Safety Link"
              className="p-2 sm:px-3 sm:py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span className="hidden md:inline">Share</span>
            </button>

            {/* Tactical Vision / Theme Selector */}
            <button
              onClick={() => setTheme(activeTheme === 'dark' ? 'radar' : activeTheme === 'radar' ? 'light' : 'dark')}
              title="Toggle Tactical Vision Mode"
              className="p-2 sm:p-2.5 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors"
            >
              {activeTheme === 'radar' ? (
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              ) : activeTheme === 'light' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-300" />
              )}
            </button>

            {/* Instant Emergency SOS Action Button */}
            <button
              onClick={onTriggerSos}
              className="group relative flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white text-xs sm:text-sm font-bold tracking-wide shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 active:scale-95 transition-all border border-rose-400/40"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
              </span>
              <AlertOctagon className="w-4 h-4 transition-transform group-hover:rotate-12" />
              <span>SOS DISPATCH</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
