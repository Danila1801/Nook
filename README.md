# Nook

An installable wellness PWA for desk workers: 45 short guided rituals across breathing, stretching, eyes, movement, and focus, with offline support and push reminders.

**Live: [nook-liard.vercel.app](https://nook-liard.vercel.app)**

## What it is / why it exists

Most wellness apps push streaks, scores, and notifications that add pressure to a
workday that already has enough. Nook is the opposite: small, quiet moments of
attention, with deliberately no gamification. Progress is observation, not
pressure.

It started as an HTML prototype (kept in `prototype/` as the locked design spec)
and was rebuilt as a real React application. My work was the rebuild: the app
architecture, the ritual engine, the animated ritual canvas, the PWA layer, and
the localization system.

## Tech stack

- **React 19** + **Vite 8**, **react-router-dom 7**
- Plain CSS per component, design tokens taken from the prototype
- **PWA**: web app manifest, service worker, install prompt, offline caching
- **Web Push** notifications via the service worker
- **Web Audio** for ritual cues
- `localStorage` persistence, no backend and no accounts
- **sharp** build scripts that generate icons and illustrations at build time
- Deployed on **Vercel**

## Key features

- **45 guided rituals in 5 categories**: breath, stretch, eyes, movement, mind. Each has a defined duration and its own animated sequence
- **Per-category ritual players** (`RitualBreath`, `RitualStretch`, `RitualEye`, `RitualMovement`, `RitualMind`), driven by a shared animated `RitualCanvas`
- **Rhythm engine** that maps a user's chosen focus areas (tired eyes, lower back, calmer breathing, and so on) to matching ritual types and schedules pauses across an active window
- **Onboarding flow**: name, focus areas, and rhythm preferences, all stored locally
- **Progress view** built on observation rather than streaks or scores
- **Installable and offline-capable**: service worker with cache versioning, plus `push` and `notificationclick` handlers for reminders
- **Localization system** with a dictionary lookup and runtime locale switching
- **SVG line-art only**, no video, per the design system

## Status

**In progress.** The app is deployed and the full ritual library, rhythm engine,
onboarding, and PWA layer all work. Localization is partially complete: the
framework supports four locales and **English and Russian are fully translated**,
while **Dutch and Romanian are scaffolded as empty dictionaries** that currently
fall back to English.

## Run it locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # generates icons + illustrations, then builds to dist/
```

`npm run build` runs `build:icons` and `build:illustrations` first, which use
sharp to generate raster assets from source SVGs.

## Repository notes

- `prototype/dad-original.html` is the canonical design spec and is read-only by convention
- `Live is Health/` is the original working folder (concepts, frames, references), preserved as an archive
