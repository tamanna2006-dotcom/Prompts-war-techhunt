/**
 * Native Web Audio API Sound Synthesizer for GuardianRoute AI
 * Generates emergency sirens, safety chimes, and phone ringtones
 * with zero external audio assets or network dependencies.
 */

let audioCtx = null;
let sirenOscillator1 = null;
let sirenGain = null;
let sirenInterval = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Starts a realistic alternating emergency siren
 */
export function startEmergencySiren() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return false;

    stopEmergencySiren(); // Ensure previous siren is cleaned up

    sirenGain = ctx.createGain();
    sirenGain.gain.setValueAtTime(0.3, ctx.currentTime);
    sirenGain.connect(ctx.destination);

    sirenOscillator1 = ctx.createOscillator();
    sirenOscillator1.type = 'sawtooth';
    sirenOscillator1.frequency.setValueAtTime(960, ctx.currentTime);
    sirenOscillator1.connect(sirenGain);
    sirenOscillator1.start();

    let toggle = false;
    sirenInterval = setInterval(() => {
      if (!sirenOscillator1 || !ctx) return;
      toggle = !toggle;
      const freq = toggle ? 770 : 960;
      sirenOscillator1.frequency.setValueAtTime(freq, ctx.currentTime);
    }, 450);

    return true;
  } catch (err) {
    console.warn('Emergency siren failed to initialize:', err);
    return false;
  }
}

/**
 * Stops the emergency siren immediately
 */
export function stopEmergencySiren() {
  try {
    if (sirenInterval) {
      clearInterval(sirenInterval);
      sirenInterval = null;
    }
    if (sirenOscillator1) {
      sirenOscillator1.stop();
      sirenOscillator1.disconnect();
      sirenOscillator1 = null;
    }
    if (sirenGain) {
      sirenGain.disconnect();
      sirenGain = null;
    }
  } catch (err) {
    console.warn('Error stopping siren:', err);
  }
}

/**
 * Plays a pleasant confirmation chime (for check-in or safe arrival)
 */
export function playSafeChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
      
      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.1);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + idx * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.4);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + idx * 0.1);
      osc.stop(ctx.currentTime + idx * 0.1 + 0.45);
    });
  } catch (err) {
    console.warn('Safe chime error:', err);
  }
}

/**
 * Simulates a realistic incoming telephone ringtone
 */
export function playRingtonePulse() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(440, ctx.currentTime); // US standard ring 440Hz + 480Hz
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(480, ctx.currentTime);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.6);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 1.6);
    osc2.stop(ctx.currentTime + 1.6);
  } catch (err) {
    console.warn('Ringtone error:', err);
  }
}
