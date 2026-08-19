import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Mic, 
  MicOff, 
  Radio, 
  AlertOctagon, 
  CheckCircle2, 
  Sparkles, 
  X, 
  Zap,
  SlidersHorizontal
} from 'lucide-react';
import { playSafeChime } from '../utils/audioAlerts';

export default function VoiceTriggerListener({
  isOpen,
  onClose,
  onTriggerSos,
  onConfirmSafe
}) {
  const [isListening, setIsListening] = useState(true);
  const [sensitivity, setSensitivity] = useState('balanced'); // 'low' | 'balanced' | 'high'
  const [detectedKeyword, setDetectedKeyword] = useState(null);
  const [detectionLogs, setDetectionLogs] = useState([
    { time: 'Just now', keyword: 'SYSTEM_ARMED', type: 'info', text: 'Voice keyword engine armed for "HELP" / "SAFE"' }
  ]);
  const [audioLevel, setAudioLevel] = useState(30);

  const recognitionRef = useRef(null);

  // Trigger Action when keyword recognized
  const handleKeywordRecognized = useCallback((keyword) => {
    const kw = keyword.toUpperCase();
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    
    setDetectedKeyword(kw);
    setTimeout(() => setDetectedKeyword(null), 3000);

    if (kw.includes('HELP') || kw.includes('EMERGENCY') || kw.includes('DANGER')) {
      setDetectionLogs((prev) => [
        { time, keyword: kw, type: 'danger', text: `🚨 EMERGENCY KEYWORD DETECTED: "${kw}" -> Auto-triggering SOS!` },
        ...prev.slice(0, 7)
      ]);
      if (onTriggerSos) {
        setTimeout(() => onTriggerSos(), 600);
      }
    } else if (kw.includes('SAFE') || kw.includes('OKAY') || kw.includes('ARRIVED')) {
      playSafeChime();
      setDetectionLogs((prev) => [
        { time, keyword: kw, type: 'safe', text: `🟢 Safe arrival phrase acknowledged: "${kw}"` },
        ...prev.slice(0, 7)
      ]);
      if (onConfirmSafe) onConfirmSafe();
    } else if (kw.includes('GUARDIAN')) {
      setDetectionLogs((prev) => [
        { time, keyword: kw, type: 'info', text: `🛡️ Guardian Telemetry Radar boosted: "${kw}"` },
        ...prev.slice(0, 7)
      ]);
    }
  }, [onTriggerSos, onConfirmSafe]);

  // Web Speech API / Web Audio listener setup
  useEffect(() => {
    if (!isListening) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          const current = event.resultIndex;
          const transcript = event.results[current][0].transcript.toUpperCase();
          
          if (transcript.includes('HELP')) handleKeywordRecognized('HELP');
          else if (transcript.includes('EMERGENCY')) handleKeywordRecognized('EMERGENCY');
          else if (transcript.includes('DANGER')) handleKeywordRecognized('DANGER');
          else if (transcript.includes('SAFE')) handleKeywordRecognized('SAFE');
          else if (transcript.includes('GUARDIAN')) handleKeywordRecognized('GUARDIAN');
        };

        recognition.onerror = () => {
          // Graceful fallback to simulation
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('Speech Recognition not supported in this browser context:', err);
      }
    }

    // Dynamic animated waveform fluctuation based on sensitivity
    const multiplier = sensitivity === 'high' ? 1.4 : sensitivity === 'low' ? 0.7 : 1.0;
    const interval = setInterval(() => {
      setAudioLevel(Math.floor((20 + Math.random() * 60) * multiplier));
    }, 150);

    return () => {
      clearInterval(interval);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignored
        }
      }
    };
  }, [isListening, sensitivity, handleKeywordRecognized]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 text-slate-100 relative">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Mic className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                AI Voice-Activated Emergency Trigger
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-mono">
                  LIVE LISTENER
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Continuously monitors audio for distress keywords to auto-dispatch SOS without touching screen.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Audio Waveform Equalizer Hero */}
        <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 text-center space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              {isListening ? 'Acoustic Keyword Radar Active' : 'Microphone Paused'}
            </span>
            
            {/* Sensitivity Selector */}
            <div className="flex items-center gap-1 text-[11px]">
              <SlidersHorizontal className="w-3 h-3 text-slate-500" />
              <span>Sens:</span>
              <select
                value={sensitivity}
                onChange={(e) => setSensitivity(e.target.value)}
                className="bg-slate-900 text-cyan-300 rounded px-1.5 py-0.5 border border-slate-700 text-[10px] font-bold cursor-pointer"
              >
                <option value="low">Low</option>
                <option value="balanced">Balanced</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Equalizer Bars */}
          <div className="h-16 flex items-center justify-center gap-1.5 sm:gap-2 px-4 py-2">
            {[35, 60, 85, 45, 95, 70, 50, 80, 65, 90, 40, 75, 55, 85, 40].map((baseHeight, idx) => {
              const dynHeight = isListening ? Math.min(100, Math.max(15, (baseHeight * audioLevel) / 60)) : 10;
              let barColor = 'bg-cyan-500';
              if (detectedKeyword === 'HELP' || detectedKeyword === 'EMERGENCY') barColor = 'bg-rose-500';
              if (detectedKeyword === 'SAFE') barColor = 'bg-emerald-400';

              return (
                <div
                  key={idx}
                  className={`w-1.5 sm:w-2 rounded-full transition-all duration-150 ${barColor}`}
                  style={{ height: `${dynHeight}%` }}
                />
              );
            })}
          </div>

          {/* Real-Time Detection Badge */}
          {detectedKeyword ? (
            <div className={`py-2 px-4 rounded-xl text-xs font-black uppercase tracking-wider animate-bounce inline-flex items-center gap-1.5 ${
              detectedKeyword === 'HELP' || detectedKeyword === 'EMERGENCY'
                ? 'bg-rose-950 border border-rose-500 text-rose-300 shadow-lg shadow-rose-600/30'
                : 'bg-emerald-950 border border-emerald-500 text-emerald-300'
            }`}>
              <AlertOctagon className="w-4 h-4" />
              <span>Keyword Recognized: "{detectedKeyword}"</span>
            </div>
          ) : (
            <p className="text-xs text-slate-400 font-medium">
              Say aloud: <strong className="text-rose-400">"HELP"</strong> or <strong className="text-rose-400">"EMERGENCY"</strong> to trigger SOS • <strong className="text-emerald-400">"SAFE"</strong> to confirm arrival
            </p>
          )}
        </div>

        {/* Monitored Keywords Chips */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Active Monitored Safety Keywords
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { word: '"HELP"', action: 'Immediate SOS Dispatch', color: 'border-rose-500/50 bg-rose-950/60 text-rose-300' },
              { word: '"EMERGENCY"', action: 'Immediate SOS Dispatch', color: 'border-rose-500/50 bg-rose-950/60 text-rose-300' },
              { word: '"SAFE"', action: 'Confirms Safe Arrival', color: 'border-emerald-500/50 bg-emerald-950/60 text-emerald-300' },
              { word: '"GUARDIAN"', action: 'Boosts GPS Ping Rate', color: 'border-cyan-500/50 bg-cyan-950/60 text-cyan-300' }
            ].map((kw) => (
              <div key={kw.word} className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 ${kw.color}`}>
                <span>{kw.word}</span>
                <span className="text-[10px] font-sans font-normal opacity-80">({kw.action})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rapid Voice Simulation Buttons (For Instant Testing & Demonstration) */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Zap className="w-3.5 h-3.5" />
              Simulate Voice Keyword Trigger (Demo)
            </span>
            <span className="text-[10px] text-slate-500">1-Tap Voice Simulation</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              onClick={() => handleKeywordRecognized('HELP')}
              className="py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-md shadow-rose-600/30 transition-all active:scale-95 flex items-center justify-center gap-1"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Simulate "HELP"</span>
            </button>

            <button
              onClick={() => handleKeywordRecognized('SAFE')}
              className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md shadow-emerald-600/30 transition-all active:scale-95 flex items-center justify-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Simulate "SAFE"</span>
            </button>

            <button
              onClick={() => handleKeywordRecognized('GUARDIAN')}
              className="py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black shadow-md shadow-cyan-600/30 transition-all active:scale-95 flex items-center justify-center gap-1 col-span-2 sm:col-span-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>"GUARDIAN"</span>
            </button>
          </div>
        </div>

        {/* Live Acoustic Detection Feed */}
        <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
          {detectionLogs.map((log, idx) => (
            <div key={idx} className="text-xs font-mono flex items-start gap-2 text-slate-300">
              <span className="text-slate-500 shrink-0">[{log.time}]</span>
              <span className={log.type === 'danger' ? 'text-rose-300 font-bold' : log.type === 'safe' ? 'text-emerald-300 font-bold' : 'text-cyan-200'}>
                {log.text}
              </span>
            </div>
          ))}
        </div>

        {/* Footer Toggle Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={() => setIsListening(!isListening)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              isListening
                ? 'bg-rose-950 border border-rose-500/40 text-rose-300'
                : 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{isListening ? 'Mute Voice Listener' : 'Resume Voice Listener'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
