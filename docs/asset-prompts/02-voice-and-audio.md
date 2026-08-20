# Voice & audio prompt pack

Covers the guiding voice, the ambient beds, and the interaction sounds.

---

## The architectural decision, first

Nook's ritual scripts are **fixed**: 87 unique instruction lines, 12 breath
cues, 8 step names. Nothing is dynamically generated except the user's name.

So: **pre-render every line as an audio file.** Do not use the browser's
`speechSynthesis` as the primary path.

| | Pre-rendered files | Browser `speechSynthesis` |
|---|---|---|
| Quality | Studio. Real breath, real warmth. | Robotic. Wildly inconsistent across devices. |
| Offline | Yes — cached by the service worker | Yes, but iOS voices vary by what's downloaded |
| Cost | One-time generation | Free |
| Latency | Zero | 100–400ms cold start, audible |
| Control | Total — pacing, breath, emphasis | Almost none |
| iOS behaviour | Reliable | Cuts out when the screen locks |

Size: ~150 lines × ~2.5s at 48kbps mono Opus ≈ **1.8 MB** for a full language.
Lazy-load per ritual so first paint stays fast.

`speechSynthesis` stays only as a fallback for the one dynamic string (the
user's name in a greeting) and for locales you haven't rendered yet.

---

# PART 1 — The guiding voice

## Casting brief

> The voice of someone who loves you and is not in a hurry.
>
> A woman, 30s–40s. Low, warm, slightly breathy. Close-mic — she is speaking
> from about thirty centimetres away, not projecting across a room. There is
> air in the voice. You can hear her actually breathe between phrases, and
> those breaths are part of the performance, not something to edit out.
>
> She has infinite patience. She is not performing calm — she *is* calm.
> Not a yoga teacher's bright instructional register. Not a meditation-app
> monotone. Closer to someone sitting on the edge of your bed at 2am telling
> you it's going to be fine.
>
> Slightly downward inflection at the end of phrases. Never chirpy. Never
> rising. Never selling anything.

**Reference feel:** the last three minutes of a sleep story · an ASMR whisper
artist who dropped the gimmick · a mother reading aloud to a child who is
nearly asleep.

**Explicitly not:** corporate wellness · airline safety announcement ·
bright morning-yoga energy · anything with a smile you can hear.

## ElevenLabs settings

| Setting | Value | Why |
|---|---|---|
| Model | Eleven Multilingual v2 or newer | Needed for the Russian set |
| Stability | **0.55–0.65** | High enough to stay even, low enough to keep humanity. Above 0.8 goes flat and dead. |
| Similarity | 0.75 | |
| Style exaggeration | **0.0–0.15** | Anything higher adds performance energy. That's the enemy. |
| Speaker boost | On | |
| Speed | **0.85–0.9** | Deliberately under normal. The slowness *is* the product. |

**Voice picks (English):** audition Matilda, Charlotte, Alice, Jessica. Take
whichever sounds most like it's about to fall asleep. Generate the same test
line on all four and A/B them in a quiet room with headphones.

**Test line — audition every candidate with this:**
```
Let the shoulders drop. There's nothing you need to do right now.
```
If it sounds like an instruction rather than a kindness, reject the voice.

## Per-category delivery direction

| Category | Direction |
|---|---|
| **Breath** | Slowest of all. Land the cue *just before* the phase changes so the listener moves with it, never chases it. Almost whispered. |
| **Stretch** | Slightly more present — the body is doing something. Still soft. Never counts reps like a trainer. |
| **Eyes** | Gentle and short. These are 60-second rituals; two or three lines total. |
| **Move** | The only category with any lift. Still warm, but eyes-open energy. |
| **Mind** | The most intimate. Longest pauses. Let silence sit — a two-second gap is not dead air, it is the ritual. |

## Line-level SSML / prompt formatting

Wrap each line so pacing is baked into the render, not left to the player:

```
<break time="400ms"/> Let the shoulders drop. <break time="900ms"/>
There's nothing you need to do right now. <break time="600ms"/>
```

Rules:
- Leading `<break>` of 300–500ms so playback never clips the first syllable
- 800–1200ms between sentences within a line
- Trailing `<break>` of 500ms so the file doesn't end abruptly
- Breath cues (`in`, `hold`, `out`) get **no** leading break — they must land
  exactly on the phase boundary

## Breath cues — special handling

The 12 breath labels play on a strict timer and are the most exposed lines in
the app. Render each **twice** and pick per-context:

| Label | Line | Note |
|---|---|---|
| `in` | "Breathe in" | rising warmth, never sharp |
| `hold` | "Hold" | almost a whisper |
| `out` | "And out" | audible soft exhale on the render |
| `inShort` | "A short breath in" | |
| `inTop` | "And another, on top" | |
| `outLong` | "Long, slow out" | this one carries the physiological sigh — take your time |
| `holdAtTop` | "Stay here" | |
| `inLeft` / `inRight` | "In, through the left" / "…the right" | alternate nostril |
| `outLeft` / `outRight` | "Out, through the left" / "…the right" | |
| `roar` | "Open the mouth, and let it go" | lion breath — the one line allowed some release |

## File layout

```
public/voice/<locale>/<key>.opus     # e.g. public/voice/en/archAndRound.opus
public/voice/<locale>/manifest.json  # { key: { duration, bytes } }
```

Keys come straight from `src/lib/rituals/*Sequences.js` (`instructionKey`,
`nameKey`) and `breathPatterns.js` (`label`). **The key is the filename** —
a mismatch is a silent missing line.

Encode: mono, 48kbps Opus, with an MP3 fallback for older Safari.
Normalise every file to **−18 LUFS** so no line jumps out. Then check: play the
loudest and quietest line back to back. If you reach for the volume, renormalise.

---

# PART 2 — Ambient beds

Replace nothing-at-all with a bed that makes the silence feel intentional
rather than empty.

## Generation prompt (Suno / Udio / ElevenLabs SFX)

```
Ambient meditation underscore. Extremely minimal and slow.

Sustained low drone around 110 Hz with very slow amplitude drift.
A single sparse bowl or bell tone every 25-40 seconds, never on a regular
grid — it should feel incidental, not rhythmic.
Warm analogue tape saturation. Gentle low-pass filtering, nothing above 8 kHz.
Very slight, slow wow-and-flutter.

NO drums. NO percussion of any kind. NO discernible beat or pulse.
NO chord progression. NO melody. NO resolution. NO build. NO swell.
NO synth pads with fast attack. NO vocals. NO nature field recordings.
NO new-age harp or pan flute. NO arpeggios.

It should be possible to listen for ten minutes without noticing it,
and to notice at any moment that it was holding you the whole time.

Must loop seamlessly. Same tonal centre at the start and end.
Duration: 3 minutes.
```

**Per-category tonal centre** — same prompt, change the root so switching
categories feels like moving to a different room, not a different app:

| Category | Root | Character |
|---|---|---|
| Breath | A (110 Hz) | neutral, open |
| Stretch | G (98 Hz) | grounded, lower |
| Eyes | D (146 Hz) | lighter, thinner, less bass |
| Move | C (130 Hz) | a touch more air and movement |
| Mind | E (82 Hz) | deepest, most spacious |

Master each bed to **−28 LUFS** — well under the voice, so it never competes.
Mix the voice at −18 and the bed at −28 and the balance is right by default.

Loop check: concatenate the file to itself and listen at the seam with
headphones. Any click, level jump, or phase shift and it isn't finished.

---

# PART 3 — Interaction sounds

The current single `singing-bowl.mp3` fires as a blunt ping. Replace it with a
small, coherent family.

| Name | Brief | Length |
|---|---|---|
| `phase-in` | Barely-there upward breath of air. Not a tone — filtered noise with a slow attack. Should register as *sensation*, not sound. | 600ms |
| `phase-out` | Its inverse, falling and softer | 700ms |
| `step-advance` | A single soft wooden knock, close-mic'd, heavily damped. Like a fingertip on a table in a carpeted room. | 200ms |
| `ritual-begin` | Struck bowl, but caught **after** the attack — fade in from 40ms so the strike transient is gone and only the bloom remains. This is what's wrong with the current file: you hear the hit. | 2.5s |
| `ritual-complete` | The same bowl a fifth up, with a very long tail. Let it ring out to true silence over 6 seconds. Never cut it. | 6s |
| `tap` | Almost inaudible. A soft cloth brush. Pairs with a 10ms haptic. | 80ms |

**Global rules**
- Nothing above 6 kHz. No sparkle, no shimmer, no chime.
- Attack ≥ 30ms on everything. Zero clicks anywhere.
- Master to **−24 LUFS**, well below the voice.
- Every one of these must be individually mutable, and all of them must respect
  the `breathSounds: 'none'` preference already in `src/screens/You.jsx`.

**The test:** play the set at 11pm in a dark room at low volume. If any sound
makes you flinch, it's wrong.

---

## Quality gate

- [ ] Voice: play three consecutive lines. Does it sound like one continuous
      person, or three separate takes stitched together?
- [ ] Voice: does any line sound like it's *instructing* rather than
      *accompanying*? Re-render it.
- [ ] Beds: seam is inaudible when looped
- [ ] Beds: no rhythmic element has crept in
- [ ] Sounds: nothing makes you flinch at low volume in the dark
- [ ] Mix: voice at −18, beds at −28, sounds at −24 — never touch the volume
      control while moving through a full ritual
- [ ] All files play correctly on iOS Safari after the screen has been locked
      and unlocked
