import { useState } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  X, 
  ExternalLink, 
  Radio, 
  BatteryCharging, 
  Smartphone
} from 'lucide-react';
import { generateShareUrl, formatCoordinates } from '../utils/formatters';

export default function TripShareModal({
  isOpen,
  onClose,
  origin,
  destination,
  userLocation
}) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? generateShareUrl() : 'https://guardianroute.ai/track/demo-992';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = `🛡️ Track my live commute on GuardianRoute AI:
Route: ${origin} ➡️ ${destination}
Live tracking link: ${shareUrl}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-slate-100 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Share Live Trip Telemetry</h3>
              <p className="text-xs text-slate-400">Share live encrypted route tracking with trusted friends.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Trip Status Card */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              Live Beacon Active
            </span>
            <span className="text-slate-400 flex items-center gap-1">
              <BatteryCharging className="w-3.5 h-3.5 text-cyan-400" />
              Battery: 84%
            </span>
          </div>

          <div className="text-xs text-slate-300">
            <div className="font-semibold text-white truncate">
              {origin} ➡️ {destination}
            </div>
            <div className="text-[11px] font-mono text-cyan-300/90 mt-1">
              GPS: {formatCoordinates(userLocation?.lat, userLocation?.lng)}
            </div>
          </div>
        </div>

        {/* Shareable Link Box */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-400">
            Encrypted Live Share Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-cyan-300 select-all focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="py-2.5 px-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-md"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Quick Social / Messenger Dispatch */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 rounded-xl bg-teal-950 border border-teal-500/40 text-teal-300 hover:bg-teal-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>

          <a
            href={`sms:?body=${encodeURIComponent(shareText)}`}
            className="py-2.5 px-3 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>SMS Message</span>
          </a>
        </div>

      </div>
    </div>
  );
}
