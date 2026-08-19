import { useState, useEffect } from 'react';
import { 
  PhoneCall, 
  PhoneOff, 
  Volume2, 
  Mic, 
  MicOff, 
  Grid, 
  X, 
  MessageCircle
} from 'lucide-react';
import { FAKE_CALL_PERSONAS } from '../data/mockData';
import { playRingtonePulse } from '../utils/audioAlerts';

export default function FakeCallModal({
  isOpen,
  onClose
}) {
  const [selectedPersona, setSelectedPersona] = useState(FAKE_CALL_PERSONAS[0]);
  const [callState, setCallState] = useState('ringing'); // 'ringing' | 'connected'
  const [callDuration, setCallDuration] = useState(0);
  const [scriptIdx, setScriptIdx] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Ringtone interval
  useEffect(() => {
    let ringInterval = null;
    if (isOpen && callState === 'ringing') {
      playRingtonePulse();
      ringInterval = setInterval(() => {
        playRingtonePulse();
      }, 3500);
    }
    return () => {
      if (ringInterval) clearInterval(ringInterval);
    };
  }, [isOpen, callState]);

  // Call timer and dialogue progression
  useEffect(() => {
    let timer = null;
    if (isOpen && callState === 'connected') {
      timer = setInterval(() => {
        setCallDuration((prev) => {
          const next = prev + 1;
          if (next % 6 === 0 && selectedPersona.script) {
            setScriptIdx((s) => (s + 1) % selectedPersona.script.length);
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOpen, callState, selectedPersona]);

  if (!isOpen) return null;

  const handleAnswer = () => {
    setCallState('connected');
    setCallDuration(0);
    setScriptIdx(0);
  };

  const handleEndCall = () => {
    setCallState('ringing');
    setCallDuration(0);
    onClose();
  };

  const formatSeconds = (sec) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 text-white text-center relative">
        
        {/* Close Button top right */}
        <button
          onClick={handleEndCall}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Persona Selector (when ringing) */}
        {callState === 'ringing' && (
          <div className="flex items-center justify-center gap-1.5 pt-2">
            {FAKE_CALL_PERSONAS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPersona(p)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                  selectedPersona.id === p.id
                    ? 'bg-purple-950 border-purple-500 text-purple-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>
        )}

        {/* Caller Avatar & Info */}
        <div className="space-y-2 pt-2">
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-4xl shadow-xl shadow-purple-600/30 mx-auto ring-4 ring-white/10">
              {selectedPersona.avatar}
            </div>
            {callState === 'ringing' && (
              <span className="absolute inset-0 rounded-full border-2 border-purple-400 animate-ping opacity-50 pointer-events-none" />
            )}
          </div>

          <div>
            <h3 className="text-xl font-black text-white">{selectedPersona.name}</h3>
            <p className="text-xs text-purple-300 font-medium">{selectedPersona.subtitle}</p>
            <p className="text-xs font-mono text-slate-400 mt-1">
              {callState === 'ringing' ? 'Incoming Decoy Call...' : formatSeconds(callDuration)}
            </p>
          </div>
        </div>

        {/* Dynamic Voice Prompts (When Connected) */}
        {callState === 'connected' && (
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-purple-500/30 text-left space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-400 uppercase tracking-wider">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Simulated Voice Response</span>
            </div>
            <p className="text-xs text-slate-200 italic leading-relaxed">
              "{selectedPersona.script[scriptIdx]}"
            </p>
            <p className="text-[10px] text-slate-400 border-t border-slate-800 pt-1.5">
              💡 Tip: Speak out loud like: "Yeah, I'm right on the sidewalk, coming inside now!"
            </p>
          </div>
        )}

        {/* Dial Controls */}
        {callState === 'ringing' ? (
          /* Incoming Actions */
          <div className="flex items-center justify-around pt-4">
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={handleEndCall}
                className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 active:scale-95 transition-all"
              >
                <PhoneOff className="w-7 h-7" />
              </button>
              <span className="text-[11px] text-slate-400 font-medium">Decline</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <button
                onClick={handleAnswer}
                className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/40 active:scale-95 transition-all animate-bounce"
              >
                <PhoneCall className="w-7 h-7" />
              </button>
              <span className="text-[11px] text-emerald-400 font-bold">Answer</span>
            </div>
          </div>
        ) : (
          /* In-Call Controls */
          <div className="space-y-5 pt-2">
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                  isMuted ? 'bg-rose-950 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                {isMuted ? <MicOff className="w-5 h-5 text-rose-400" /> : <Mic className="w-5 h-5" />}
                <span>{isMuted ? 'Muted' : 'Mute'}</span>
              </button>

              <button className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 flex flex-col items-center gap-1">
                <Volume2 className="w-5 h-5 text-cyan-400" />
                <span>Speaker</span>
              </button>

              <button className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 flex flex-col items-center gap-1">
                <Grid className="w-5 h-5" />
                <span>Keypad</span>
              </button>
            </div>

            <button
              onClick={handleEndCall}
              className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2"
            >
              <PhoneOff className="w-5 h-5" />
              <span>End Fake Call</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
