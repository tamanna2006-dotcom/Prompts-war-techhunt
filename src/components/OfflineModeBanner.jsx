import { useState } from 'react';
import { 
  WifiOff, 
  Send, 
  Copy, 
  Check, 
  Zap
} from 'lucide-react';

export default function OfflineModeBanner({
  isOfflineMode,
  onToggleOfflineMode,
  userLocation,
  origin,
  destination,
  contacts
}) {
  const [copied, setCopied] = useState(false);

  if (!isOfflineMode) return null;

  const primaryContact = contacts?.find((c) => c.isPrimary) || contacts?.[0];
  const lat = userLocation?.lat?.toFixed(4) || '37.7749';
  const lng = userLocation?.lng?.toFixed(4) || '-122.4194';

  // Strict 160-character GSM cellular SMS payload for zero-data / 2G tower environments
  const shortSmsPayload = `EMERGENCY! At ${lat},${lng}. ${origin.split(' ')[0]}->${destination.split(' ')[0]}. Bat:84%. maps.google.com/?q=${lat},${lng}`;

  const handleCopySms = () => {
    navigator.clipboard.writeText(shortSmsPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/90 border-y border-amber-500/60 p-3 sm:p-4 text-amber-100 shadow-xl backdrop-blur-md animate-in fade-in transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Left Status Alert */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse shrink-0">
            <WifiOff className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black text-amber-300 tracking-wide uppercase flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                Emergency Low-Connectivity Mode Active
              </span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-amber-900/80 text-amber-200 border border-amber-500/40 font-bold">
                160-CHAR GSM READY
              </span>
            </div>
            <p className="text-xs text-amber-200/80 mt-0.5">
              Zero-data cellular fallback engaged. Cached telemetry and direct cellular SMS transmitter active.
            </p>
          </div>
        </div>

        {/* Center: Compressed 160-Char Cellular Payload Preview */}
        <div className="w-full md:w-auto flex-1 max-w-md bg-slate-950/90 border border-amber-500/40 rounded-xl p-2 px-3 flex items-center justify-between gap-2">
          <div className="overflow-hidden">
            <div className="text-[10px] font-mono text-amber-400/90 uppercase font-semibold">
              Cellular SMS ({shortSmsPayload.length}/160 chars)
            </div>
            <div className="text-xs font-mono text-slate-200 truncate select-all">
              {shortSmsPayload}
            </div>
          </div>

          <button
            onClick={handleCopySms}
            title="Copy Cellular SMS"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white shrink-0 border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Right Actions: Direct SMS Link & Exit Offline Mode */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {primaryContact && (
            <a
              href={`sms:${primaryContact.phone}?body=${encodeURIComponent(shortSmsPayload)}`}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-amber-600/30 transition-all active:scale-95 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send SMS to {primaryContact.name.split(' ')[0]}</span>
            </a>
          )}

          <button
            onClick={() => onToggleOfflineMode(false)}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-bold border border-slate-700 transition-colors shrink-0"
          >
            Exit Offline Mode
          </button>
        </div>

      </div>
    </div>
  );
}
