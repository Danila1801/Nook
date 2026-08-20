/**
 * Spoken ritual guidance.
 *
 * Nook's ritual scripts are fixed — 87 instruction lines, 12 breath cues,
 * 8 step names. So the intended path is pre-rendered studio audio, not the
 * browser's speech synthesiser:
 *
 *   - `speechSynthesis` is robotic, varies wildly per device, has an audible
 *     100-400ms cold start, and stops when iOS locks the screen.
 *   - Pre-rendered files give real breath and warmth, cost nothing at runtime,
 *     and the service worker can cache them for offline.
 *
 * This module tries pre-rendered first and falls back to `speechSynthesis`, so
 * the feature works before a single audio file exists and silently upgrades as
 * files are added. See docs/asset-prompts/02-voice-and-audio.md for the
 * generation brief and the expected file layout.
 *
 * Layout:  public/voice/<locale>/<key>.opus  (+ .mp3 for older Safari)
 *          public/voice/<locale>/manifest.json  -> { keys: { key: {d, ext} } }
 */

import { getLocale } from '../i18n/index.js';

const VOICE_ROOT = '/voice';

/** Deliberately under normal pace. The slowness is the point. */
const SYNTH_RATE = 0.84;
const SYNTH_PITCH = 0.96;

/**
 * Voices that tend to sound warm and low rather than bright and clipped.
 * Ordered by preference; `enhanced`/`premium` variants are markedly better on
 * iOS and are matched loosely because Apple's naming is inconsistent.
 */
const PREFERRED_VOICES = [
  'samantha', 'ava', 'allison', 'susan', 'zoe', 'joanna',
  'serena', 'karen', 'moira', 'tessa', 'fiona',
];

/**
 * 'on'   speak, using studio audio where it exists and device speech otherwise
 * 'off'  silent
 * 'auto' speak only where studio audio exists — so a robotic device voice is
 *        never the first impression of the feature. This is the default.
 */
let mode = 'auto';
let volume = 0.9;
let unlocked = false;

/** locale -> manifest | null (null means "checked, none present") */
const manifests = new Map();
/** `${locale}/${key}` -> HTMLAudioElement */
const preloaded = new Map();

let current = null;      // { stop(): void }
let synthVoice = null;
let synthVoiceResolved = false;

/* ------------------------------------------------------------------ config */

export function setVoiceMode(next) {
  mode = ['on', 'off', 'auto'].includes(next) ? next : 'auto';
  if (mode === 'off') stopVoice();
}

export function getVoiceMode() {
  return mode;
}

/** Whether a line should be spoken at all right now. */
function shouldSpeak() {
  if (mode === 'off') return false;
  if (mode === 'on') return true;
  return hasStudioVoice(); // 'auto'
}

/** True if voice will produce sound right now, for UI labelling. */
export function isVoiceActive() {
  return shouldSpeak();
}

export function setVoiceVolume(next) {
  volume = Math.max(0, Math.min(1, next));
}

export function isVoiceSupported() {
  if (typeof window === 'undefined') return false;
  return typeof window.Audio === 'function' || 'speechSynthesis' in window;
}

/**
 * Must be called from a real user gesture. iOS refuses to play audio and
 * refuses to enumerate speech voices until it has seen one.
 */
export function primeVoice() {
  if (unlocked || typeof window === 'undefined') return;
  unlocked = true;

  // Touching speechSynthesis inside the gesture is what unlocks it on iOS.
  if ('speechSynthesis' in window) {
    try {
      const warm = new SpeechSynthesisUtterance('');
      warm.volume = 0;
      window.speechSynthesis.speak(warm);
      window.speechSynthesis.cancel();
    } catch {
      /* non-fatal */
    }
  }

  loadManifest(getLocale());
}

/* ---------------------------------------------------------------- manifest */

async function loadManifest(locale) {
  if (manifests.has(locale)) return manifests.get(locale);

  let manifest = null;
  try {
    const res = await fetch(`${VOICE_ROOT}/${locale}/manifest.json`, { cache: 'force-cache' });
    if (res.ok) {
      const parsed = await res.json();
      // Accept either { keys: {...} } or a bare key map.
      manifest = parsed && parsed.keys ? parsed : { keys: parsed || {} };
    }
  } catch {
    // No manifest for this locale. Expected until audio is generated.
    manifest = null;
  }

  manifests.set(locale, manifest);
  return manifest;
}

function manifestEntry(locale, key) {
  const m = manifests.get(locale);
  if (!m || !m.keys) return null;
  return m.keys[key] || null;
}

/**
 * Warm the browser cache for lines a ritual is about to need, so the first cue
 * isn't late. Safe to call with keys that don't exist.
 */
export function preloadVoiceLines(keys) {
  if (mode === 'off' || typeof window === 'undefined') return;
  const locale = getLocale();

  loadManifest(locale).then((m) => {
    if (!m) return;
    for (const key of keys) {
      const id = `${locale}/${key}`;
      if (preloaded.has(id)) continue;
      const entry = manifestEntry(locale, key);
      if (!entry) continue;
      try {
        const el = new Audio(fileUrl(locale, key, entry));
        el.preload = 'auto';
        el.load();
        preloaded.set(id, el);
      } catch {
        /* ignore */
      }
    }
  });
}

function fileUrl(locale, key, entry) {
  const ext = (entry && entry.ext) || 'opus';
  return `${VOICE_ROOT}/${locale}/${key}.${ext}`;
}

/* ------------------------------------------------------------------ speaking */

/**
 * Speak one line.
 *
 * @param {string} key   stable line key (instructionKey / nameKey / breath label)
 * @param {object} opts
 * @param {string} opts.text       spoken text, used only by the synth fallback
 * @param {boolean} opts.interrupt cut off whatever is playing (default true)
 * @returns {Promise<void>} resolves when the line finishes or is cut off
 */
export async function say(key, { text = '', interrupt = true } = {}) {
  if (typeof window === 'undefined' || mode === 'off') return;
  if (interrupt) stopVoice();

  const locale = getLocale();
  await loadManifest(locale);

  // Checked after the manifest resolves, because 'auto' means
  // "only if studio audio exists for this locale".
  if (!shouldSpeak()) return;

  const entry = manifestEntry(locale, key);
  if (entry) {
    const played = await playFile(locale, key, entry);
    if (played) return;
    // Fall through to the synth if the file 404s or the codec is unsupported.
  }

  if (text) await speakSynth(text);
}

function playFile(locale, key, entry) {
  return new Promise((resolve) => {
    let el;
    try {
      const id = `${locale}/${key}`;
      el = preloaded.get(id) || new Audio(fileUrl(locale, key, entry));
      el.currentTime = 0;
      el.volume = volume;
    } catch {
      resolve(false);
      return;
    }

    let settled = false;
    const finish = (ok) => {
      if (settled) return;
      settled = true;
      el.removeEventListener('ended', onEnd);
      el.removeEventListener('error', onErr);
      if (current && current.el === el) current = null;
      resolve(ok);
    };
    const onEnd = () => finish(true);
    const onErr = () => finish(false);

    el.addEventListener('ended', onEnd);
    el.addEventListener('error', onErr);

    current = {
      el,
      stop() {
        try {
          el.pause();
          el.currentTime = 0;
        } catch {
          /* ignore */
        }
        finish(true);
      },
    };

    const p = el.play();
    if (p && typeof p.catch === 'function') p.catch(() => finish(false));
  });
}

/* -------------------------------------------------------- synth fallback */

function resolveSynthVoice() {
  if (synthVoiceResolved) return synthVoice;
  if (!('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  // getVoices() is async-populated on some browsers; retry on the next call.
  if (!voices || voices.length === 0) return null;

  const locale = getLocale();
  const forLocale = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith(locale));
  const pool = forLocale.length ? forLocale : voices;

  const score = (v) => {
    const name = (v.name || '').toLowerCase();
    let s = 0;
    // Apple's higher-quality downloads carry these words and sound far better.
    if (/enhanced|premium|neural|natural/.test(name)) s += 100;
    const idx = PREFERRED_VOICES.findIndex((p) => name.includes(p));
    if (idx !== -1) s += 50 - idx;
    if (v.localService) s += 10; // works offline
    return s;
  };

  synthVoice = pool.slice().sort((a, b) => score(b) - score(a))[0] || null;
  synthVoiceResolved = true;
  return synthVoice;
}

function speakSynth(text) {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve();
      return;
    }

    let u;
    try {
      u = new SpeechSynthesisUtterance(text);
    } catch {
      resolve();
      return;
    }

    const voice = resolveSynthVoice();
    if (voice) {
      u.voice = voice;
      u.lang = voice.lang;
    }
    u.rate = SYNTH_RATE;
    u.pitch = SYNTH_PITCH;
    u.volume = volume;

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      if (current && current.utterance === u) current = null;
      resolve();
    };
    u.onend = finish;
    u.onerror = finish;

    current = {
      utterance: u,
      stop() {
        try {
          window.speechSynthesis.cancel();
        } catch {
          /* ignore */
        }
        finish();
      },
    };

    try {
      window.speechSynthesis.speak(u);
    } catch {
      finish();
    }
  });
}

/* ---------------------------------------------------------------- control */

export function stopVoice() {
  if (current) {
    const c = current;
    current = null;
    try {
      c.stop();
    } catch {
      /* ignore */
    }
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* ignore */
    }
  }
}

/**
 * True when studio audio exists for the active locale. Lets the UI say
 * "Guided voice" vs "Guided voice (device speech)" honestly rather than
 * implying a quality it isn't delivering.
 */
export function hasStudioVoice() {
  const m = manifests.get(getLocale());
  return Boolean(m && m.keys && Object.keys(m.keys).length > 0);
}
