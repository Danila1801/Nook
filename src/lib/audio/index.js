/**
 * Ritual audio.
 *
 * The previous version played /audio/singing-bowl.mp3 through an <audio>
 * element from sample zero. That means you hear the *strike transient* — the
 * mallet hitting the rim — which is what made it read as a blunt ping rather
 * than a bowl. An <audio> element gives no way to avoid it.
 *
 * This routes through Web Audio instead, which buys three things the element
 * couldn't:
 *
 *   1. ATTACK SKIP    begin playback past the transient, so only the bloom is
 *                     heard. Single biggest quality change, and it works on the
 *                     existing sample with no new assets.
 *   2. ENVELOPE       real fade in/out, so nothing ever clicks.
 *   3. TAIL CONTROL   let the completion tone ring out to true silence instead
 *                     of being cut off.
 *
 * Design brief and the intended replacement sound family are in
 * docs/asset-prompts/02-voice-and-audio.md.
 */

export const audio = {
  singingBowlSrc: '/audio/singing-bowl.mp3',
};

/**
 * Per-cue shaping. `skip` is how far into the file to begin, in seconds —
 * enough to clear the mallet strike. `attack` and `release` are the envelope.
 */
const CUES = {
  begin:    { skip: 0.045, attack: 0.35, release: 2.2, gain: 0.55, rate: 1.0 },
  complete: { skip: 0.045, attack: 0.40, release: 4.5, gain: 0.60, rate: 1.5 },
  phase:    { skip: 0.060, attack: 0.25, release: 0.9, gain: 0.22, rate: 1.0 },
  step:     { skip: 0.050, attack: 0.12, release: 0.5, gain: 0.30, rate: 1.25 },
};

let ctx = null;
let masterGain = null;
let bowlBuffer = null;
let bowlLoadPromise = null;
let unlocked = false;
let muted = false;

function getCtx() {
  if (ctx) return ctx;
  if (typeof window === 'undefined') return null;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  try {
    ctx = new Ctx();
    masterGain = ctx.createGain();
    masterGain.gain.value = 1;
    masterGain.connect(ctx.destination);
  } catch {
    ctx = null;
  }
  return ctx;
}

function resume() {
  const c = getCtx();
  if (c && c.state === 'suspended' && typeof c.resume === 'function') {
    c.resume().catch(() => {});
  }
  return c;
}

function loadBowl() {
  if (bowlBuffer) return Promise.resolve(bowlBuffer);
  if (bowlLoadPromise) return bowlLoadPromise;

  const c = getCtx();
  if (!c) return Promise.resolve(null);

  bowlLoadPromise = fetch(audio.singingBowlSrc)
    .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error('fetch failed'))))
    .then(
      (buf) =>
        // Safari still needs the callback form of decodeAudioData.
        new Promise((res, rej) => {
          const p = c.decodeAudioData(buf, res, rej);
          if (p && typeof p.then === 'function') p.then(res, rej);
        })
    )
    .then((decoded) => {
      bowlBuffer = decoded;
      return decoded;
    })
    .catch(() => null);

  return bowlLoadPromise;
}

/** Must be called from a real user gesture — iOS keeps the context suspended. */
export function primeAudio() {
  if (unlocked || typeof window === 'undefined') return;
  unlocked = true;

  const c = resume();
  if (!c) return;

  // A one-sample silent source is the canonical iOS unlock.
  try {
    const src = c.createBufferSource();
    src.buffer = c.createBuffer(1, 1, 22050);
    src.connect(c.destination);
    if (typeof src.start === 'function') src.start(0);
    else if (typeof src.noteOn === 'function') src.noteOn(0);
  } catch {
    /* unlock attempt only */
  }

  loadBowl();
}

export function setMuted(next) {
  muted = Boolean(next);
  if (masterGain && ctx) {
    masterGain.gain.setTargetAtTime(muted ? 0 : 1, ctx.currentTime, 0.02);
  }
}

export function isMuted() {
  return muted;
}

/**
 * Synthesised fallback, used when the sample can't be fetched or decoded.
 * Deliberately slow-attack so it can't click either.
 */
function synthBowl(cue, volume) {
  const c = resume();
  if (!c) return;

  const now = c.currentTime;
  const fundamental = 528 * cue.rate;
  // Inharmonic partials — a struck bowl is not a harmonic series, and using
  // integer multiples is what makes synthesised bells sound like organs.
  const partials = [
    { ratio: 1.0,  gain: 0.50, decay: cue.release },
    { ratio: 2.0,  gain: 0.18, decay: cue.release * 0.8 },
    { ratio: 2.76, gain: 0.10, decay: cue.release * 0.65 },
    { ratio: 5.4,  gain: 0.04, decay: cue.release * 0.4 },
  ];

  for (const p of partials) {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(fundamental * p.ratio, now);

    const peak = Math.max(0.0001, p.gain * cue.gain * volume);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(peak, now + cue.attack);
    g.gain.exponentialRampToValueAtTime(0.0001, now + cue.attack + p.decay);

    osc.connect(g);
    g.connect(masterGain || c.destination);
    osc.start(now);
    osc.stop(now + cue.attack + p.decay + 0.05);
  }
}

/**
 * Play one cue.
 *
 * @param {'begin'|'complete'|'phase'|'step'} name
 * @param {number} volume 0..1
 */
export function playCue(name = 'begin', volume = 1) {
  if (typeof window === 'undefined' || muted) return;

  const cue = CUES[name] || CUES.begin;
  const v = Math.max(0, Math.min(1, volume));

  const c = resume();
  if (!c) return;

  loadBowl().then((buffer) => {
    if (!buffer) {
      synthBowl(cue, v);
      return;
    }

    const now = c.currentTime;
    const src = c.createBufferSource();
    src.buffer = buffer;
    src.playbackRate.value = cue.rate;

    const g = c.createGain();
    // Start effectively silent and ramp up, so beginning mid-waveform (past
    // the strike) can't produce a discontinuity click.
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(cue.gain * v, now + cue.attack);

    const available = Math.max(0, buffer.duration / cue.rate - cue.skip);
    const holdFor = Math.min(available, cue.attack + cue.release);
    g.gain.setTargetAtTime(
      0.0001,
      now + Math.max(cue.attack, holdFor - cue.release),
      cue.release / 4
    );

    src.connect(g);
    g.connect(masterGain || c.destination);

    // Third argument is the offset into the buffer — this is the attack skip.
    src.start(now, cue.skip);
    src.stop(now + holdFor + 0.25);
  });
}

/** Back-compat: existing call sites use playSingingBowl(). */
export function playSingingBowl(volume = 0.6) {
  playCue('begin', volume);
}
