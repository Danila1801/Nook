# Nook

Nook is a wellness app for desk workers — small, gentle moments of attention woven into the workday.
We are rebuilding it as a real React app, with the prototype as the locked design spec.

## The prototype

The original prototype, built by Leonid (Dan's dad), lives at [`prototype/dad-original.html`](prototype/dad-original.html). It is the canonical design spec.

**Never modify or delete this file.** It is read-only by convention.

The folder [`Live is Health/`](Live%20is%20Health/) is Leonid's original working folder (concepts, frames, references, mood images). It is preserved untouched as an archive.

## Principles (do not drift)

- Brand voice is quiet, considered, gentle. "A friend lighting a candle." No marketing energy.
- No gamification — no streaks, scores, achievements. Progress is observation, not pressure.
- Visuals: SVG line-art only. No video files.
- Design system is locked. Tokens come from the prototype. Don't invent new ones.
- Localization-ready from day one — strings live in a dictionary structure (English first; Russian, Romanian, Dutch later).

## Running

```bash
npm install
npm run dev
```
