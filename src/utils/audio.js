let audioCtx = null;
let ambientOsc = null;
let ambientGain = null;
let ambientFilter = null;
let ambientLfo = null;

export function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setMuteState(muted) {
  localStorage.setItem('playverse_ui_muted', muted ? 'true' : 'false');
  if (muted) {
    stopAmbientSoundscape();
  }
}

export function getMuteState() {
  const saved = localStorage.getItem('playverse_ui_muted');
  return saved === 'true';
}

export function playUiTick() {
  if (getMuteState()) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.02);
    
    gain.gain.setValueAtTime(0.012, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.02);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.02);
  } catch {
    // ignore
  }
}

export function playUiClick() {
  if (getMuteState()) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.06);
    
    gain.gain.setValueAtTime(0.022, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  } catch {
    // ignore
  }
}

export function startAmbientSoundscape() {
  if (getMuteState()) return;
  try {
    const ctx = getAudioContext();
    if (ambientOsc) return; // Already running
    
    ambientOsc = ctx.createOscillator();
    ambientGain = ctx.createGain();
    ambientFilter = ctx.createBiquadFilter();
    
    ambientOsc.type = 'sawtooth';
    ambientOsc.frequency.setValueAtTime(55, ctx.currentTime); // A1 note
    
    ambientFilter.type = 'lowpass';
    ambientFilter.frequency.setValueAtTime(150, ctx.currentTime);
    
    ambientLfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    ambientLfo.frequency.setValueAtTime(0.12, ctx.currentTime); // Slow breathing sweep
    lfoGain.gain.setValueAtTime(45, ctx.currentTime);
    
    ambientLfo.connect(lfoGain);
    lfoGain.connect(ambientFilter.frequency);
    
    ambientGain.gain.setValueAtTime(0, ctx.currentTime);
    ambientGain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 2.0); // Fade in over 2s
    
    ambientOsc.connect(ambientFilter);
    ambientFilter.connect(ambientGain);
    ambientGain.connect(ctx.destination);
    
    ambientOsc.start();
    ambientLfo.start();
  } catch {
    // ignore
  }
}

export function stopAmbientSoundscape() {
  try {
    if (ambientGain && audioCtx) {
      ambientGain.gain.cancelScheduledValues(audioCtx.currentTime);
      ambientGain.gain.setValueAtTime(ambientGain.gain.value, audioCtx.currentTime);
      ambientGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.6);
    }
    
    setTimeout(() => {
      if (ambientOsc) {
        ambientOsc.stop();
        ambientOsc.disconnect();
        ambientOsc = null;
      }
      if (ambientLfo) {
        ambientLfo.stop();
        ambientLfo.disconnect();
        ambientLfo = null;
      }
      if (ambientGain) {
        ambientGain.disconnect();
        ambientGain = null;
      }
      if (ambientFilter) {
        ambientFilter.disconnect();
        ambientFilter = null;
      }
    }, 700);
  } catch {
    // ignore
  }
}

export function playAchievementUnlockedFanfare() {
  if (getMuteState()) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Ascending arpeggio notes (C5, E5, G5, C6)
    const freqs = [523.25, 659.25, 783.99, 1046.50];
    
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      
      gain.gain.setValueAtTime(0.02, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.15);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.15);
    });
  } catch {
    // ignore
  }
}
