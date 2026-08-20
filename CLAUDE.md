# Nook — working notes for Claude

An installable, phone-first wellness PWA for desk workers. 45 short guided rituals
across breath, stretch, eyes, movement, and mind. Offline-capable, no backend,
no accounts, no gamification.

**Live:** https://nook-liard.vercel.app · **Repo:** https://github.com/Danila1801/Nook

---

## The one rule that governs everything

**Nook is quiet.** No streaks. No scores. No badges. No "you're on fire 🔥". No
guilt for a missed pause. Progress is *observation*, not pressure. If a change
would make the user feel judged, measured, or nagged, it does not ship.

Every copy decision, animation, and notification passes this filter first.

---

## Phone-first is literal

The primary target is a phone held in one hand, installed to the home screen,
opened for 90 seconds between meetings. Desktop is a courtesy, not a goal.

Consequences that are easy to forget:

- **Never `100vh`.** Use `100dvh`. iOS Safari's `100vh` ignores the collapsing
  URL bar and content jumps. `min-height: 100dvh` everywhere.
- **Safe areas are not optional.** `env(safe-area-inset-*)` on every fixed
  element. Do not add the inset to both `height` and `padding` — that
  double-counts and clips content (this was a real shipped bug in `BottomNav`).
- **Touch targets ≥ 44×44pt** with ≥ 8px between them.
- **Body text ≥ 16px** or iOS auto-zooms the viewport on input focus.
- Test at **375px** width, not just 390px. And test landscape.
- `touch-action: manipulation` on tappables to kill the 300ms delay.

Plan: stay a PWA now, but keep the door open for a Capacitor native shell later.
Avoid anything that would need a rewrite to wrap — no server-only assumptions,
no reliance on URL bar chrome, keep notification logic behind an adapter.

---

## Stack

React 19 · Vite 8 · react-router-dom 7 (**HashRouter**, not BrowserRouter) ·
plain CSS per component · no state library · no CSS framework · no animation
library. `localStorage` only, namespaced `nook.`.

**Adding a dependency is a real decision.** The app's whole value is being small
and fast on a mid-range phone. Argue for it before installing it.

## Layout

```
src/
  screens/          one .jsx + one .css per route, colocated
  components/       shared UI (Orb, Icon, BottomNav, RitualCanvas, Figure)
  lib/
    rituals/        catalog.js is the source of truth for all 45 rituals
    rhythm/         engine.js schedules the day's pauses from focus areas
    i18n/           en, ru complete · nl, ro are EMPTY stubs falling back to en
    audio/          Web Audio + sample playback
    notifications/  service worker messaging + scheduling
    storage/        thin localStorage wrapper, all keys prefixed `nook.`
  styles/tokens.css design tokens — the only place raw hex belongs
scripts/            sharp build scripts, run via `prebuild`
public/             manifest, sw.js, icons, illustrations, audio
docs/asset-prompts/ prompt packs for generating images/audio/video externally
prototype/          original HTML design spec — READ-ONLY by convention
"Live is Health"/   original working folder, archived. Duplicates prototype/.
```

## Commands

```bash
npm run dev      # http://localhost:5173
npm run build    # runs build:icons + build:illustrations (sharp) then vite build
npm run lint
```

---

## Conventions

- **Tokens, not hex.** Raw hex in a component file is a bug. It goes in
  `src/styles/tokens.css`.
- **Every user-facing string goes through `t()`.** No literals in JSX. Add the
  key to `en.js` and `ru.js` together — a key that exists in one and not the
  other is a silent English fallback.
- Storage access only through `lib/storage` — never `localStorage` directly.
- `prototype/dad-original.html` is the canonical design reference. Don't edit it.

## Motion

- 150–300ms for micro-interactions, ≤400ms for transitions
- Animate `transform` and `opacity` only. Never `width`/`height`/`top`/`left`.
- Spring/ease-out entering, ease-in exiting; exits ~65% of enter duration
- Stagger list items 30–50ms
- **Always honour `prefers-reduced-motion`** — degrade to a still, intentional
  state, never a broken one
- Timers and counters use `font-variant-numeric: tabular-nums` so they don't jitter

## Accessibility

- Text contrast ≥ 4.5:1, verified in both themes independently
- Never convey meaning by colour alone
- Icon-only buttons need `aria-label`
- Visible focus rings — do not remove them

---

## Known state (updated 2026-07-25)

Working: all 15 routes render clean, no console errors. Rhythm engine,
ritual players, onboarding, i18n framework, PWA manifest.

Outstanding:
- `public/sw.js` declares `CACHE_NAME` but **caches nothing** — offline is
  claimed in the README but not actually implemented
- `nl.js` / `ro.js` are `export const x = {}`
- Notification scheduling only fires while a tab is open (`setTimeout`-based)
- Only 8 illustrations exist for 45 rituals, and several are mislabeled
  (`catCow.webp` shows a person sitting upright on a chair)
- `Progress` ships a debug **ADD SAMPLE DATA** button

## Asset generation

Illustrations, audio, and video are generated externally (Gemini / nano-banana,
Omni, audio tools) using the prompt packs in `docs/asset-prompts/`. Source PNGs
drop into `raw-illustrations/` (gitignored) and `npm run build:illustrations`
compresses them to WebP in `public/illustrations/`.

**Source images must have a flat, untextured background** or `sharp`'s `trim()`
cannot crop them — that is why the current set has visible square edges and a
surviving Gemini watermark.
