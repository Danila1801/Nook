export const audio = {
  singingBowlSrc: '/audio/singing-bowl.mp3',
};

let audioCtx = null;

function getAudioCtx() {
  if (audioCtx) return audioCtx;
  if (typeof window === 'undefined') return null;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  try {
    audioCtx = new Ctx();
  } catch {
    audioCtx = null;
  }
  return audioCtx;
}

function synthSingingBowl(volume) {
  const ctx = getAudioCtx();
  if (!ctx) return;
  if (ctx.state === 'suspended' && typeof ctx.resume === 'function') {
    ctx.resume().catch(() => {});
  }
  const now = ctx.currentTime;
  const fundamental = 528;
  const partials = [
    { freq: fundamental, gain: 0.55, decay: 1.8 },
    { freq: fundamental * 2.0, gain: 0.20, decay: 1.4 },
    { freq: fundamental * 2.76, gain: 0.10, decay: 1.2 },
    { freq: fundamental * 4.0, gain: 0.05, decay: 1.0 },
  ];
  for (const p of partials) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(p.freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, p.gain * volume), now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + p.decay + 0.05);
  }
}

export function playSingingBowl(volume = 0.6) {
  if (typeof window === 'undefined') return;
  const safeVolume = Math.max(0, Math.min(1, volume));
  try {
    const a = new Audio(audio.singingBowlSrc);
    a.volume = safeVolume;
    const playPromise = a.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise.catch(() => synthSingingBowl(safeVolume));
    }
  } catch {
    synthSingingBowl(safeVolume);
  }
}
