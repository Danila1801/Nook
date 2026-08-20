# Video prompt pack — Omni / Veo

## Scope decision, first

**Do not put video inside the ritual player.** A 10-second 1080p loop is
2–4 MB, decodes continuously, and measurably drains battery — against an app
whose entire promise is being small, quiet, and offline. The Orb and the
watercolour stills carry the rituals better than footage would.

Video earns its place in exactly three spots:

1. **Landing / marketing page** — the thing that makes someone install it
2. **App Store / Play Store preview** — required later for the native shell
3. **Social** — vertical cuts for launch

Everything below targets those.

---

## House style — applies to every clip

```
Locked-off camera or an extremely slow push, no faster than 2% over the shot.
NO whip pans, NO snap zooms, NO handheld shake, NO drone moves, NO speed ramps.

Natural window light from one side, soft and diffused, late afternoon.
Warm neutral grade. Lifted blacks, gentle film curve, light grain.
Palette limited to warm cream #F4EEE3, sage green #7A8C6E, warm charcoal
#2A2A24, and natural wood.

Real textures: linen, unglazed ceramic, raw paper, plaster, pale oak.
NO glass-and-steel office. NO neon. NO screens visible. NO logos.
NO stock-footage smiling. NO one looking directly at camera.

Shallow depth of field. Quiet, unhurried, slightly imperfect.
Every shot should feel observed rather than staged.
```

**The reject test:** if a shot could sell a productivity SaaS, it's wrong.

---

## Clip 1 — Hero loop (landing page, seamless, 8s)

```
Extreme close-up, macro. A single drop of water meets the still surface of
water in a shallow unglazed ceramic bowl. One slow concentric ripple expands
outward and fades completely to stillness.

Shot at high frame rate, played back at roughly 40% speed.
Soft directional window light rakes across the surface, catching the ripple
crest. Warm cream and sage reflections in the water. Background falls to a
soft out-of-focus warm blur.

The surface must return to complete stillness by the final frame, matching
frame one exactly, so the clip loops invisibly.

No hands. No people. No text. No camera movement whatsoever.
8 seconds. 1080x1920 vertical and 1920x1080 horizontal.
```

Use: muted, autoplay, loop, behind the landing hero. Ship a WebP/AVIF still as
`poster` so nothing shifts before the video decodes.

## Clip 2 — The pause (12s, narrative)

```
Interior, quiet home office, late afternoon. Warm window light.

A woman in her thirties sits at a plain oak desk, shoulders tight, head
forward toward an unseen screen. She holds it for two seconds.

Then she exhales — visibly, the shoulders drop — pushes back slightly from
the desk, closes her eyes, and rolls her head slowly to one side.
Her face releases.

Camera locked off in a wide-ish medium, slightly off to one side, as if
someone quietly noticed her. She never looks at camera.

The screen is never visible in frame. No phone in shot until the final two
seconds, where her hand rests near it, face down.

12 seconds. Natural sound only, no music in the render.
```

## Clip 3 — Morning light (6s, ambient, loops)

```
Static macro. Warm morning light moves almost imperceptibly across a fold of
sage-green linen. Dust motes drift slowly through the light beam.

Nothing else happens. The only movement is light and dust.

The fabric texture must stay crisp; the background stays soft.
6 seconds, seamless loop. No people, no objects, no text.
```

## Clip 4 — Hands (5s, ambient)

```
Close-up, top-down. Two hands rest open and still in a lap on sage-green linen.
The fingers uncurl very slightly, releasing tension held from off-screen.
That is the entire action.

Soft side window light. Skin texture visible and real — not retouched.
5 seconds. No face, no context, no text.
```

## Clip 5 — Store preview (25s, cut later)

Generate these four beats separately and cut them together with the app's own
screen recordings between:

```
Beat A (4s) — a phone face down on a wooden desk beside a cup, morning light
Beat B (5s) — same woman standing at a window, mid side-bend stretch, eyes closed
Beat C (4s) — close macro, steam rising from a plain cup, very slow
Beat D (6s) — she picks the phone up, glances at it briefly, sets it down again,
              and walks out of frame. The phone stays in shot, still.
```

Beat D is the thesis of the whole product: the app is something you put down.

---

## Delivery

| Use | Format |
|---|---|
| Landing hero | 1920×1080 + 1080×1920, H.264 MP4 **and** VP9 WebM, ≤ 2 MB, muted, no audio track at all |
| Store preview | 1080×1920, 30fps, H.264, 15–30s |
| Social | 1080×1920, with a burned-in caption safe area of 220px top / 320px bottom |

Always ship a `poster` still. Always `preload="none"` on anything below the fold.
Always respect `prefers-reduced-motion` — swap the video for the poster still.

---

## Quality gate

- [ ] Loops are genuinely seamless — watch three cycles without blinking
- [ ] No colour outside the palette
- [ ] Nobody looks at camera; nobody smiles at camera
- [ ] No visible screens, logos, or text
- [ ] Hands and faces survive a frame-by-frame check (generative video fails here first)
- [ ] Under the size budget after encoding
- [ ] Watched muted — it still reads
