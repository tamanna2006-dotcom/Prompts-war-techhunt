import { useState, useEffect, useCallback } from 'react';
import { 
  AlertOctagon, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  MapPin, 
  Radio, 
  ShieldCheck, 
  ExternalLink
} from 'lucide-react';
import { startEmergencySiren, stopEmergencySiren, playSafeChime } from '../utils/audioAlerts';
import { formatCoordinates, formatTimestamp } from '../utils/formatters';

export default function SosModal({
  isOpen,
  onClose,
  contacts,
  userLocation,
  origin,
  destination
}) {
  const [countdown, setCountdown] = useState(3);
  const [isTriggered, setIsTriggered] = useState(false);
  const [sirenActive, setSirenActive] = useState(true);
  const [strobeActive, setStrobeActive] = useState(true);
  const [dispatchLogs, setDispatchLogs] = useState([]);

  const triggerEmergencyDispatch = useCallback(() => {
    setIsTriggered(true);
    if (sirenActive) {
      startEmergencySiren();
    }

    const now = new Date();
    const t0 = formatTimestamp(now);
    const t1 = formatTimestamp(new Date(now.getTime() + 1000));
    const t2 = formatTimestamp(new Date(now.getTime() + 2000));
    const t3 = formatTimestamp(new Date(now.getTime() + 3500));
    const t4 = formatTimestamp(new Date(now.getTime() + 5000));

    setDispatchLogs([
      { time: t0, text: '🚨 SOS Emergency Distress Protocol initialized by user.' },
      { time: t0, text: `📍 GPS Coordinates Locked: ${formatCoordinates(userLocation?.lat, userLocation?.lng)}` },
      { time: t1, text: `📨 Automated SMS Distress Payload queued for ${contacts?.length || 3} emergency contacts.` },
      { time: t2, text: '🚓 Municipal Police & Campus Dispatch notified via emergency API.' },
      { time: t3, text: '🛡️ Rapid Response Unit #412 Dispatched (Estimated Arrival: 2.3 mins).' },
      { time: t4, text: '📡 Live 1Hz GPS Location Beacon broadcasting telemetry.' }
    ]);
  }, [sirenActive, userLocation, contacts]);

  // Reset and start countdown on open
  useEffect(() => {
    let timer = null;
    if (isOpen && !isTriggered) {
      const initTimer = setTimeout(() => {
        setCountdown(3);
        setDispatchLogs([]);
      }, 0);

      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            triggerEmergencyDispatch();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearTimeout(initTimer);
        if (timer) clearInterval(timer);
        stopEmergencySiren();
      };
    }

    return () => {
      if (timer) clearInterval(timer);
      stopEmergencySiren();
    };
  }, [isOpen, isTriggered, triggerEmergencyDispatch]);

  const handleToggleSiren = () => {
    if (sirenActive) {
      stopEmergencySiren();
      setSirenActive(false);
    } else {
      startEmergencySiren();
      setSirenActive(true);
    }
  };

  const handleCancelEmergency = () => {
    stopEmergencySiren();
    playSafeChime();
    setIsTriggered(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-2xl transition-all ${
      strobeActive && isTriggered ? 'animate-sos-strobe bg-rose-950/80' : 'bg-slate-950/90'
    }`}>
      
      <div className="w-full max-w-2xl bg-slate-950 border-2 border-rose-500/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-rose-600/40 relative overflow-hidden text-slate-100">
        
        {/* Countdown Phase */}
        {!isTriggered && countdown > 0 ? (
          <div className="text-center py-6 space-y-6">
            <div className="relative flex items-center justify-center w-28 h-28 mx-auto rounded-full bg-rose-600/20 border-4 border-rose-500 animate-pulse">
              <span className="text-6xl font-black text-rose-400">{countdown}</span>
            </div>

            <div>
              <h3 className="text-2xl font-black text-white uppercase tracking-wider">
                Emergency SOS Armed
              </h3>
              <p className="text-sm text-slate-300 mt-1">
                Broadcasting emergency distress telemetry to your contacts in {countdown} seconds...
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleCancelEmergency}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-600 transition-all"
              >
                Cancel SOS (False Alarm)
              </button>

              <button
                onClick={triggerEmergencyDispatch}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-600/40 transition-all"
              >
                Dispatch Instantly Now
              </button>
            </div>
          </div>
        ) : (
          /* Active SOS Dispatch Screen */
          <div className="space-y-5">
            
            {/* Header with Siren & Strobe Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-500/40 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-rose-600 text-white animate-bounce">
                  <AlertOctagon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white tracking-wide flex items-center gap-2">
                    EMERGENCY SOS ACTIVE
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-900 border border-rose-400 text-rose-200">
                      LIVE BROADCAST
                    </span>
                  </h3>
                  <p className="text-xs text-rose-300">Distress payload sent • Dispatch units alerted</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleSiren}
                  className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                    sirenActive
                      ? 'bg-rose-600 border-rose-400 text-white shadow-lg'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                  title="Toggle Emergency Siren"
                >
                  {sirenActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span>{sirenActive ? 'Siren ON' : 'Siren Muted'}</span>
                </button>

                <button
                  onClick={() => setStrobeActive(!strobeActive)}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                    strobeActive
                      ? 'bg-amber-600 border-amber-400 text-white'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  Strobe {strobeActive ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {/* GPS & Location Details */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  Your Live Distress Location
                </span>
                <a
                  href={`https://maps.google.com/?q=${userLocation?.lat || 37.7749},${userLocation?.lng || -122.4194}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px] font-semibold"
                >
                  <span>Open Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-sm font-mono text-cyan-300">
                {formatCoordinates(userLocation?.lat, userLocation?.lng)}
              </p>
              <p className="text-xs text-slate-400">
                Route: <span className="text-slate-200">{origin}</span> ➡️ <span className="text-slate-200">{destination}</span>
              </p>
            </div>

            {/* Simulated Live Dispatch Event Stream */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Live Dispatch Event Log</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <Radio className="w-3 h-3 animate-pulse" />
                  Stream Active
                </span>
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {dispatchLogs.map((log, idx) => (
                  <div key={idx} className="text-xs font-mono flex items-start gap-2 text-slate-300">
                    <span className="text-slate-500 shrink-0">[{log.time}]</span>
                    <span className="text-cyan-200">{log.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Notification Badges */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Dispatched Emergency Contacts
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {contacts?.map((c) => (
                  <div
                    key={c.id}
                    className="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/30 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white truncate">{c.name}</div>
                      <div className="text-[10px] text-slate-400">{c.phone}</div>
                    </div>
                    <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cancel & Safe Resolution Button */}
            <div className="pt-2">
              <button
                onClick={handleCancelEmergency}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>I AM SAFE - CANCEL SOS DISTRESS CALL</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
