import { useState, useEffect } from 'react';
import { 
  Clock, 
  KeyRound, 
  AlertTriangle, 
  X, 
  Play, 
  CheckCircle2
} from 'lucide-react';
import { playSafeChime } from '../utils/audioAlerts';

export default function SafetyCheckIn({
  isOpen,
  onClose,
  onAutoTriggerSos
}) {
  const [isActive, setIsActive] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState(15);
  const [remainingSeconds, setRemainingSeconds] = useState(15 * 60);
  const [safetyPin, setSafetyPin] = useState('1234');
  const [inputPin, setInputPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    let timer = null;
    if (isActive && remainingSeconds > 0) {
      timer = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsActive(false);
            if (onAutoTriggerSos) onAutoTriggerSos();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, remainingSeconds, onAutoTriggerSos]);

  if (!isOpen) return null;

  const handleStartTimer = () => {
    setRemainingSeconds(selectedMinutes * 60);
    setIsActive(true);
    setIsSuccess(false);
    setInputPin('');
    setPinError(false);
  };

  const handleVerifyPin = (e) => {
    e.preventDefault();
    if (inputPin === safetyPin) {
      setIsActive(false);
      setIsSuccess(true);
      setPinError(false);
      playSafeChime();
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2500);
    } else {
      setPinError(true);
    }
  };

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-slate-100 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Guardian Angel Check-In</h3>
              <p className="text-xs text-slate-400">Auto-escalates if you don't check in on time.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* State 1: Success Banner */}
        {isSuccess && (
          <div className="p-5 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 text-center space-y-2 animate-in fade-in">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white">Safe Arrival Confirmed!</h4>
            <p className="text-xs text-emerald-300">
              Trip completed safely. Emergency contacts notified of your safe arrival.
            </p>
          </div>
        )}

        {/* State 2: Active Timer Mode */}
        {isActive && !isSuccess && (
          <div className="text-center space-y-4 py-2">
            <div className="p-5 rounded-3xl bg-slate-950 border border-cyan-500/40 relative overflow-hidden">
              <span className="text-xs uppercase font-bold tracking-widest text-slate-400 block mb-1">
                Time Remaining To Safe Check-In
              </span>
              <div className="text-5xl font-black font-mono text-cyan-400 tracking-tight">
                {formatTimer(remainingSeconds)}
              </div>
              <p className="text-[11px] text-amber-400/90 mt-2 flex items-center justify-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Auto-SOS triggers if timer expires without PIN</span>
              </p>
            </div>

            {/* PIN Verification Form */}
            <form onSubmit={handleVerifyPin} className="space-y-3">
              <label className="block text-xs font-medium text-slate-300">
                Enter Safety PIN to Confirm Safe Arrival
              </label>
              <div className="flex items-center gap-2 max-w-xs mx-auto">
                <div className="relative flex-1">
                  <KeyRound className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="password"
                    maxLength={6}
                    value={inputPin}
                    onChange={(e) => setInputPin(e.target.value)}
                    placeholder="Enter PIN (Default: 1234)"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-center text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <button
                  type="submit"
                  className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  I'm Safe
                </button>
              </div>

              {pinError && (
                <p className="text-xs text-rose-400 font-semibold">
                  Incorrect PIN. (Hint: Default PIN is {safetyPin})
                </p>
              )}
            </form>
          </div>
        )}

        {/* State 3: Timer Setup Configuration */}
        {!isActive && !isSuccess && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Expected Walk / Commute Duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 15, 25, 40].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setSelectedMinutes(mins)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      selectedMinutes === mins
                        ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {mins} mins
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Your Secret Safety PIN
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  maxLength={6}
                  value={safetyPin}
                  onChange={(e) => setSafetyPin(e.target.value)}
                  placeholder="Set 4-digit PIN (e.g. 1234)"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Used to cancel the check-in timer when you arrive safely.
              </p>
            </div>

            <button
              onClick={handleStartTimer}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              <span>Start Guardian Angel Check-In Timer</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
