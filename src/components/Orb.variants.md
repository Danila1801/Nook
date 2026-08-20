# Orb — design notes

## Technique chosen: layered SVG (baked filters) + compositor-only CSS animation

No canvas, no RAF loop, no dependencies. Six layered techniques, all driven by
`transform`/`opacity`:

1. **Baked `feTurbulence` + `feDisplacementMap` edge wobble.** The body circle
   is displaced by a *static* turbulence field (fixed `seed`, `baseFrequency`,
   never re-evaluated). The wobble is brought to life by animating the
   *wrapping `<g>`'s* `transform` (a slow ±1.2° rotate + hairline scale, 12s
   ease-in-out) instead of animating the filter's `scale` attribute directly.
2. **Three parallax interior blobs.** Independent radial gradients (amber,
   sage-soft, terracotta) drifting at 9.5s / 13s / 16.5s on translate+scale+
   opacity, clipped inside the body so they read as light moving under the
   surface rather than shapes stacked on top of it.
3. **An independent caustic highlight** — a small blurred-falloff white
   ellipse with its own 11s drift path and phase offset, so it never moves in
   sync with the body blobs (breaks up any "breathing gradient" mechanical
   feel). **Dark mode only** — see "Revision" below for why light mode
   doesn't get one.
4. **Concentric breathing rings**, staggered by index. In ambient (no `phase`
   prop) they loop as a continuous soft ripple. When `phase`/`progress` are
   supplied, their `transform`/`opacity` are computed directly from those
   props (inhale = expand + fade out, exhale = contract + fade, hold /
   holdEmpty = settle) with a short CSS transition for interpolation — this
   syncs precisely to a real breath cycle instead of guessing a duration.
5. **A specular rim arc** (partial `stroke-dasharray`, not a full stroke)
   that slowly orbits the edge (46s linear) — a glint traveling around glass,
   not a uniform outline. **Dark mode only**, same reason as the caustic.
6. **Baked grain** (`feTurbulence` fractalNoise → alpha via `feColorMatrix`),
   painted once, `mix-blend-mode: overlay`, only its opacity shimmers (5.2s).

Plus a CSS-only halo (radial-gradient div, blurred, behind the SVG) — broad
and low-contrast in light mode, and reads as "the only light source in the
room" in dark mode.

**Why SVG+CSS over canvas:** every one of the above only ever animates
`transform` and `opacity` on elements whose *content* never changes after
first paint — that's compositor-thread work with zero JS execution per
frame. A canvas+RAF version would have to touch the main thread every frame
just to redraw, is harder to keep crisp across 56/112/280px and arbitrary
DPRs without manual devicePixelRatio handling, and buys nothing here since
none of the effects need per-pixel procedural generation at runtime — the
turbulence is baked once and never resampled. SVG filters give the organic
texture natively; CSS keyframes give free vsync-aligned motion; `useId()`
keeps multiple simultaneous instances (e.g. the Today card) collision-free.

**Perf budget measured:** Chromium (iPhone 14 Pro viewport, 3x DPR) on the
heaviest case — dark mode, 280px, five filters + 3 blobs + rim + rings + grain
all animating at once. Sampled 726–741 `requestAnimationFrame` deltas over
3.2s via `page.evaluate`: avg 4.3–4.4ms/frame, p95 5.1–6.7ms, max 12.3–13.8ms,
**zero frames exceeded the 16.7ms (60fps) budget**. (Headless Chrome's virtual
compositor isn't vsync-locked the way a real device is, so the raw ms/frame
numbers read faster than a phone would show — the useful signal is the low,
flat variance and the absence of any multi-frame spikes, which is what you'd
expect to see blow up if a filter were being re-rasterized every frame. It
wasn't — the turbulence bakes once, then everything downstream is compositor
transform/opacity.) Verified with Playwright against the project's Vite dev
server at Welcome (112px, light), Today (56px, light, in-card), and
RitualBreath (280px, dark).

**Reduced motion:** `@media (prefers-reduced-motion: reduce)` doesn't just
freeze whatever frame the animation happened to land on — every animated
element gets an explicit, deliberately-composed static `transform`/`opacity`
(rim glint parked at a natural upper-left angle, blobs at a pleasant fixed
offset, one faint static ring) so the still state looks intentional, not
broken.

**Battery:** `paused` prop and `document.hidden` (via a `visibilitychange`
listener) both map to a single `.orb--paused` class that sets
`animation-play-state: paused` on every animated layer — no RAF loop exists
to cancel in the first place.

## Two directions considered and rejected

**A — `<canvas>` with a hand-rolled noise field + RAF loop.** Would allow
true per-pixel procedural "water caustics" and finer control over the
displacement over time. Rejected because: (1) it puts JS on the main thread
every frame instead of letting the compositor do the work — directly against
the 60fps-on-mid-range-phone constraint; (2) crisp rendering across three
very different sizes (56/112/280px) and arbitrary device pixel ratios means
manually managing canvas backing-store resolution and redraw-on-resize,
which SVG gets for free as a vector; (3) it's harder to keep the "controlled"
phase/progress API cheap and precise — canvas would need to redraw the whole
frame to change ring state, where SVG only needs a `transform`/`opacity`
write on the affected elements.

**B — Animating the `feDisplacementMap`'s `scale` attribute directly via
SMIL (`<animate attributeName="scale">`) for a truly "breathing" turbulence
edge**, as the brief's own example suggests. Prototyped mentally and
rejected: it requires re-running the displacement filter every frame (filter
primitives aren't compositor-only, this is deep-repaint work, not
transform/opacity), it violates the "animate transform/opacity only" hard
constraint, and SMIL animation is a legacy/soft-deprecated path browsers are
inconsistent about long-term. The rotate+scale-the-wrapping-group substitute
achieves the same "the wobble feels alive, not static" perception at
effectively zero cost and stays strictly inside the allowed animation
properties.

## Revision: light mode was reading as an object, not a presence

First pass gave light mode a bright specular hotspot (the caustic ellipse +
a canvas-colored gradient center) plus a darkened edge on a `36%/30%`-offset
base gradient. Those two cues together are exactly how a renderer fakes a
lit sphere — specular highlight up-and-left, terminator down-and-right — so
even after boosting the interior blobs, light mode read as "glossy snooker
ball," a different flavor of "inert object" than the original flat circle,
not a fix. Diagnosis and fix, mode by mode:

- **Body gradient.** Light mode's radial gradient is now centered (`50%/
  50%`) with a narrow, low opacity-range (0.46 → 0.6) — a faint vignette
  with no directional light story. Dark mode keeps the original offset,
  higher-contrast gradient; that reading was earned and praised ("the only
  light source in the room"), so it's untouched.
- **Caustic + rim.** Both are point/arc specular cues — "glass catching
  light" — which is precisely what needed to disappear. Both now render
  **only when `mode="dark"`**; light mode has neither element in the DOM.
- **Interior blobs are the primary read in light mode**, not a layer under
  sphere shading: opacity raised again (amber 0.62, sage-soft 0.66,
  terracotta 0.5), radii enlarged ~25–30% so they overlap into a continuous
  field rather than three discrete spots, and `mix-blend-mode: soft-light`
  (light mode only, via `.orb-interior--soft`) so they read as color
  diffusing into the surface instead of highlights painted on top of it.
- **Edge softened, asymmetrically by mode.** The `feDisplacementMap` scale is
  now mode-dependent (dark `6`, light `16`) with a `feGaussianBlur` added
  after the displacement (dark `0.6`, light `2.6`) — light mode's boundary is
  both more distorted *and* blurrier, so it reads as indeterminate (breath on
  glass) rather than a crisp vector edge. Dark mode's edge stays tight and
  legible against near-black, where softness just looked muddy in testing.
- **Halo picked up more of the "presence" load** in light mode (`--orb-halo-
  base` 0.22 → 0.3) since the hotspot and rim no longer contribute anything —
  it's still a single broad, centered, blurred radial gradient, so it stays
  non-directional by construction.

Also done in this pass:

- **Tokens.** `Orb.css`'s local `--orb-*` palette now points at the real
  primitives from `tokens.css` (`--c-paper-100`, `--c-ink-900`, `--c-sage`,
  `--c-sage-soft`, `--c-amber`, `--c-terracotta`) instead of duplicating
  their hex values. `--orb-sage-deep` (`#4C5744`) isn't a tokens.css
  primitive — it's a derived shading value (darkened `--c-sage`) used only
  for the dark-mode body gradient's rim stop, so it stays local with a
  comment explaining why, per the "raw hex only lives in tokens.css" rule.
- **Dark-mode halo rebalanced.** The amber stop was pushed outward (45% →
  56% of the gradient radius) and diluted 28% toward sage-soft via
  `color-mix()`, plus `--orb-halo-base` trimmed 0.55 → 0.5. Sage now carries
  the inner two-thirds of the glow; amber only warms the outer edge instead
  of dominating the whole halo.

## Revision 2: dark mode was still a glossy ball, and light mode had gone too faint

The previous revision's "honest take" called dark mode the strongest result
and left it alone. That was wrong, and a second look (real screenshots, not
just the diff) made it obvious why: dark mode had never lost its specular
hotspot or its terminator. It had a bright white caustic ellipse parked
up-and-left and a dark edge down-and-right, on an off-center (`36%/30%`)
body gradient — the exact recipe light mode was fixed for, just rendered
more handsomely against near-black. "The room's only light source" halo and
rings were carrying real weight, but the object underneath them was still a
lit snooker ball. Meanwhile light mode, pushed hard toward "faint and
indeterminate" in the previous pass, had overshot into "coffee stain on
paper" at 112px — not enough color density or internal contrast to read as
a presence at all, especially next to warm cream.

**Dark mode, mode by mode:**

- **Caustic removed outright**, not adjusted. The `id('caustic')` gradient,
  the `<g className="orb-caustic">` ellipse, and its CSS/keyframes are gone
  entirely — a defined point highlight is the single clearest "lit sphere"
  cue there is, and light mode had already proven adjusting it wasn't good
  enough; only removing it was.
- **Body gradient centered** (`cx/cy` 36%/30% -> 50%/50%, both modes now
  share this). First attempt at this stopped there and it wasn't enough: a
  circle with a centered light-to-dark radial gradient is *still* the
  standard flat-design trick for faking a shaded sphere (limb darkening —
  the same reason a photo of an evenly-lit planet reads as "a ball," not
  "a light"). Screenshots confirmed it: still very obviously a glowing
  moon/marble. The actual fix took three more steps:
  1. **Narrowed the value range.** The old dark stops ran sage-soft ->
     sage -> sage-deep -> ink-deep, a near-black outer stop — a full
     light-to-dark ramp, which is exactly what "shading a sphere" means
     regardless of whether it's centered. The new stops stay in a tight
     sage-soft <-> sage band and never reach sage-deep or ink-deep; the
     edge is now handled by *alpha* thinning (opacity trailing off to
     ~0.16 near the boundary), not a lightness ramp implying a lit surface.
  2. **Opened up the edge filter dramatically.** `edgeWobble`'s dark-mode
     displacement scale went 6 -> 20 and its blur 0.6 -> 4.4 (light mode's
     values are untouched). The first attempt at this alone (scale 11,
     blur 2.2) barely moved the screenshot — the body still read as a
     small crisp disc sitting inside a much softer external halo, like a
     lightbulb with a bloom around it (still an object, just a glowing
     one).
  3. **Lowered the turbulence frequency for dark specifically**
     (`0.011 0.017` -> `0.006 0.009`, keeping light's higher frequency
     unchanged). This was the move that actually broke the "circle" read:
     fine, high-frequency ripples at high displacement just look like
     texture on a circular edge; a lower frequency produces a handful of
     large, slow bulges, so the silhouette itself stops being circular. The
     resulting shape is visibly irregular — you can no longer trace a
     clean boundary — while the halo, rings, and interior blobs (all
     untouched) still read clearly through it.
- **Rim glint reworked, not dropped.** It survived the "keep it only if it
  reads as bleeding light" test, but not unchanged. Old version: pure white
  (`#ffffff`), 1.4px stroke, tight 68/600 dasharray, 46s rotation — a crisp
  specular arc, the last unambiguous "glass" cue once the caustic was gone.
  New version: tinted `var(--orb-sage-soft)` instead of white (a glass
  highlight is conventionally rendered white; ambient light bleeding
  through a colored lantern picks up the lantern's own hue instead), 10px
  stroke, 150/430 dasharray (a broad patch, not a point), pushed through a
  new `rimBleed` filter (the same turbulence family as the body edge, with
  a heavier blur) so it shares the body's own uneven boundary instead of
  drawing a second, crisper edge on top of it, `mix-blend-mode: screen`
  (adds like light instead of sitting on top like paint), and slowed to
  58s. Whether this fully clears the bar is the one thing in this pass I'm
  not 100% settled on — see below.
- **Interior blobs, grain, halo, rings: untouched.** These were the parts
  that were actually already good, and the brief was explicit about not
  regressing them. They're doing real work now that the body fill isn't
  drowning them out with its own contrast.

**Light mode, mode by mode:**

- **Body gradient denser**, still centered, still no directional story:
  opacity range 0.46-0.6 -> 0.58-0.8, same three stops otherwise.
- **Interior blobs deepened.** Amber and terracotta got a straight opacity
  bump (0.62 -> 0.74, 0.5 -> 0.62). The sage blob got a real second stop
  instead — its core now uses `var(--orb-sage)` (the deeper primitive, not
  `--orb-sage-soft`) fading through sage-soft to transparent, so it has
  actual color depth rather than one flat hue thinning out. Dark mode's
  sage blob is untouched (single-stop, as it always was).
- **Edge tightened slightly**, per the brief's "shouldn't wholly dissolve":
  displacement scale 16 -> 12, blur 2.6 -> 1.8. Still clearly softer/more
  distorted than dark mode's edge — it's read against much lower
  background contrast, so it can afford to be — just not quite as far into
  "fog" as the previous pass pushed it.
- **Halo raised again** (`--orb-halo-base` 0.3 -> 0.36). It's still the one
  layer that can carry more density for free, since it has no edge and no
  internal shape to turn into an object cue.

**Tokens.** No new raw hex anywhere. The rim and (now-deleted) caustic
gradients were the last `#ffffff` literals in the file; the rim now
references `var(--orb-sage-soft)` like everything else, so removing the
caustic didn't just delete a layer, it also removed hex that would've
otherwise been the last exception to the "tokens.css only" rule beyond
`--orb-sage-deep`. `--orb-sage-deep` itself is currently unused (the dark
body gradient no longer reaches into deep-shade territory) but stays
defined per the brief's explicit instruction to keep it in place with its
comment — it's plausible some future dark-mode tweak wants it again, and it
costs nothing sitting idle in `:root`-scoped `.orb` custom properties.

**Perf.** Nothing about *what's animated* changed — still transform/opacity
only, still one static bake of every filter. The values inside the baked
filters got heavier (bigger blur kernel, bigger displacement), which is a
one-time paint cost, not a per-frame one. Re-sampled 299 `requestAnimationFrame`
deltas on the heaviest case (dark, 280px, RitualBreath) via Playwright against
the dev server: avg 4.17ms/frame, p95 4.3ms, max 4.6ms, zero frames over the
16.7ms budget — in the same range the previous pass measured, as expected
given the animation architecture didn't change.

## Honest take

Both tests — cover the label and ask if it's a ball; squint and ask if
anything's there — now pass in my own judgment, in both modes, at all three
real sizes (Welcome 112px light, Today 56px light in-card, RitualBreath
280px dark). Dark mode took real rework, not a tweak: centering the old
gradient in place was not sufficient by itself (it just swapped "lit sphere
via directional light" for "lit sphere via limb darkening," which is
arguably an even more textbook way to fake a 3D ball out of a flat circle),
and it took narrowing the fill's own value range, substantially loosening
the edge filter, and lowering the turbulence frequency specifically for
dark before the silhouette actually stopped reading as circular. The halo,
rings, and blobs that made dark mode good before are exactly as good now —
they were never the problem. Light mode is denser and more assertive than
the previous pass without any new directional light story, hotspot, or
terminator; at 56px inside the Today card it's the one I'd keep an eye on
longest in real use, since that's the size with the least room for the
effect to read, but it held up in the screenshots I took.

The one place I'm genuinely not fully settled: the reworked rim glint in
dark mode. It no longer looks like a white specular streak, and blending it
through the same turbulence as the body edge does make it feel like part of
the same glow rather than an independent reflection — but a traveling
brighter patch on the boundary is inherently the closest thing left to a
"highlight" cue, and if a future pass finds it's still doing more "glass"
work than "atmosphere" work, dropping it entirely (as the brief allowed)
is a one-line change: delete the `{isDark && (...)}` block that renders it.
I chose to keep it because removing it also removes one of the few things
that gives the dark orb any sense of slow, ongoing motion at rest (before
rings/blobs settle into their own cycles), but it's the part of this pass
I'd most want a second pair of eyes on.
