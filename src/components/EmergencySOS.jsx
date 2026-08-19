import { useState } from 'react';
import { 
  AlertOctagon, 
  Send, 
  MessageSquare, 
  Radio, 
  Copy, 
  Check, 
  ExternalLink,
  Users
} from 'lucide-react';
import { formatCoordinates, generateEmergencySmsPayload, formatTimestamp } from '../utils/formatters';

export default function EmergencySOS({
  onTriggerSos,
  contacts,
  userLocation,
  origin,
  destination,
  onOpenContacts
}) {
  const [customNote, setCustomNote] = useState('');
  const [copied, setCopied] = useState(false);

  const payload = generateEmergencySmsPayload({
    userName: 'Solo Traveler (You)',
    origin: origin || 'University Main Library',
    destination: destination || 'Westgate Dorms',
    coords: {
      lat: userLocation?.lat || 37.7749,
      lng: userLocation?.lng || -122.4194
    },
    battery: 84,
    timestamp: formatTimestamp(),
    customNote: customNote.trim()
  });

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const primaryContact = contacts?.find((c) => c.isPrimary) || contacts?.[0];

  return (
    <div className="glass-panel-elevated rounded-3xl p-5 sm:p-7 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-600/20 text-rose-400 border border-rose-500/40 animate-pulse">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              One-Tap Guardian Emergency SOS
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40">
                CRITICAL DISPATCH
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Instantly broadcasts live GPS telemetry, dispatches SMS payloads, and alerts verified emergency contacts.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenContacts}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <Users className="w-4 h-4 text-emerald-400" />
          <span>{contacts?.length || 3} Contacts Armed</span>
        </button>
      </div>

      {/* Big Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Giant SOS Trigger Button */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-rose-950/40 via-slate-900 to-slate-950 border border-rose-500/30 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-radial from-rose-500/10 to-transparent pointer-events-none" />
          
          <button
            onClick={onTriggerSos}
            className="group relative flex flex-col items-center justify-center w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-rose-700 via-red-600 to-rose-500 text-white font-black text-xl tracking-wider shadow-2xl shadow-rose-600/60 hover:shadow-rose-600/80 active:scale-95 transition-all border-4 border-rose-400/50 my-2 cursor-pointer"
          >
            {/* Ripple rings */}
            <span className="animate-ripple absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-40"></span>
            
            <AlertOctagon className="w-10 h-10 sm:w-12 sm:h-12 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-2xl sm:text-3xl font-black">SOS</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-rose-200 mt-0.5">
              1-TAP TRIGGER
            </span>
          </button>

          <p className="text-xs text-slate-400 mt-3 font-medium">
            3-Second Safety Window with Siren & Live Dispatch
          </p>

          <div className="mt-4 flex items-center gap-2 text-[11px] text-emerald-400 font-semibold bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Telemetry: {formatCoordinates(userLocation?.lat, userLocation?.lng)}</span>
          </div>
        </div>

        {/* Live SMS Payload Preview & Emergency Payload Inspector */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Automated Emergency SMS & WhatsApp Payload Preview</span>
            </label>
            <button
              onClick={handleCopyPayload}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Payload'}</span>
            </button>
          </div>

          <div className="relative">
            <textarea
              readOnly
              value={payload}
              rows="6"
              className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-mono text-cyan-300 leading-relaxed focus:outline-none select-all"
            />
          </div>

          {/* Quick Custom Distress Note */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Optional distress note (e.g. 'Being followed by silver car', 'Stuck at underpass')..."
              className="flex-1 py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>

          {/* Action links for real mobile devices */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {primaryContact && (
              <a
                href={`sms:${primaryContact.phone}?body=${encodeURIComponent(payload)}`}
                className="flex-1 py-2 px-3 bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Real SMS to {primaryContact.name}</span>
              </a>
            )}

            <a
              href={`https://wa.me/?text=${encodeURIComponent(payload)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-4 bg-teal-950/70 hover:bg-teal-900/80 border border-teal-500/40 text-teal-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>WhatsApp Dispatch</span>
            </a>
          </div>

        </div>

      </div>

    </div>
  );
}
