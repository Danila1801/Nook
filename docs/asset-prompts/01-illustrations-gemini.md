# Illustration prompt pack — Gemini / nano-banana

Generates the 23 figure illustrations Nook needs. Read the workflow section
before pasting anything — the order matters more than the prompt text.

---

## Why the current set fails (fix these, don't repeat them)

The 8 existing images are beautiful but unusable as UI assets:

| Problem | Cause | Fix in this pack |
|---|---|---|
| Visible square edge around every figure | Image has a baked-in *textured* cream paper background at ~`#FDF8E8`, sitting on the app canvas `#F4EEE3`. Reads as a pasted sticker. | Demand a **flat, uniform, untextured** background at exactly `#F4EEE3` |
| Gemini's ✦ watermark visible bottom-right | `sharp.trim()` can't find a bbox on a textured background, so nothing got cropped | Flat background makes `trim()` work → watermark crops off automatically. Also demand generous margin. |
| Subjects float off-centre with dead space | Same — trim failed, so original framing survived | Demand centred subject, full body in frame, even margin |
| Poses are wrong (`catCow.webp` is a person sitting upright) | Prompt described the ritual name, not the anatomy | Every prompt below describes the **body position**, not the pose name |
| Character drifts between images | Each image generated independently | **Generate the character sheet first, then reference it every time** |

---

## Workflow — do this in order

### Step 1 — Generate the character sheet (once)

Paste STYLE ANCHOR below. Generate 3–4 candidates, pick the one you like most.
**Save it. This is your reference image for everything else.**

### Step 2 — Generate each pose

For every pose prompt: **attach the character sheet image**, then paste the pose
prompt. Nano-banana holds character consistency well when given a reference —
without one it will drift and you'll get 23 different people.

### Step 3 — Drop into the repo

Save as `raw-illustrations/<ritualKey>.png` using the **exact** keys listed.
The filename is the lookup key — a typo means a missing illustration.

```bash
npm run build:illustrations
```

This trims, pads, resizes to 900px, and writes WebP to `public/illustrations/`.

### Step 4 — Verify

Open the app and check the figure sits on the canvas with **no visible box edge**.
If you can see a rectangle, the background wasn't flat enough — regenerate.

---

## STYLE ANCHOR — paste this first

```
Create a character reference sheet for a wellness app illustration system.

SUBJECT
A calm woman in her early thirties, shoulder-length dark hair loosely gathered
in a low bun with a few soft strands escaping at the temple. Serene, relaxed
expression, eyes gently closed. Warm light skin. She wears a soft sage-green
linen set — a loose collarless tunic with three-quarter sleeves and a small
knotted tie at the neckline, and matching wide-leg linen trousers. Barefoot.

MEDIUM
Delicate traditional watercolour and fine ink linework. Soft, wet-edge washes
with visible pigment granulation. Fine, confident, slightly broken ink contour
lines — hand-drawn, not vector. Minimal shading, lots of untouched paper
showing through. Restrained, quiet, unhurried. The feeling of a page from a
Japanese or Scandinavian illustrated wellness journal.

PALETTE — strictly limited
Sage green #7A8C6E for the clothing washes
Warm charcoal #2A2A24 for ink linework
Soft warm skin tones only
NO other hues. No blues, no pinks, no bright saturated colour anywhere.

BACKGROUND — this is critical
A completely FLAT, UNIFORM, SOLID background of exactly #F4EEE3.
NO paper texture. NO grain. NO speckles. NO fibres. NO vignette. NO gradient.
NO border, NO frame, NO drop shadow, NO edge darkening.
The background must be one single unbroken colour value across the entire image,
so it can be programmatically removed. This is a technical requirement.

COMPOSITION
Square 1:1. Full figure, head to feet, entirely inside the frame.
Subject perfectly centred horizontally and vertically.
Generous even margin — the figure occupies roughly 70% of the frame height,
with clear empty background on all four sides.

SHEET CONTENTS
Show the same character in four views on one sheet: front, three-quarter,
profile, and back. Keep proportions, clothing, hair, and palette identical
across all four.

NO text, NO labels, NO annotations, NO logos, NO signatures anywhere.
```

---

## POSE PROMPT TEMPLATE

Attach the character sheet, then paste this with `{{POSE}}` and `{{VIEW}}` filled
from the tables below.

```
Using the attached character reference, illustrate this exact same woman —
identical face, identical hair, identical sage-green linen tunic and trousers,
identical watercolour and ink style, identical limited palette.

POSE: {{POSE}}
CAMERA: {{VIEW}}

Render the body position exactly as described. Anatomy must be correct and the
pose must be immediately readable as this specific movement. Her expression
stays calm with eyes gently closed.

BACKGROUND — critical technical requirement
Completely FLAT, UNIFORM, SOLID #F4EEE3.
NO texture, NO grain, NO speckle, NO fibre, NO vignette, NO gradient,
NO border, NO frame, NO shadow under the figure, NO edge darkening.
One single unbroken colour value across the entire image.

COMPOSITION
Square 1:1. Full figure head to feet, entirely inside the frame.
Perfectly centred. Figure occupies ~70% of frame height.
Generous even empty margin on all four sides.

NO text, NO labels, NO logos, NO signature, NO watermark, NO decorative marks.
```

---

## STRETCH — 14 poses

Save as `raw-illustrations/<key>.png`

| Key | POSE | VIEW |
|---|---|---|
| `shouldersAndNeck` | Standing tall. Right hand reaches over the top of the head to rest on the left temple, gently tilting the head toward the right shoulder. Left arm hangs long and relaxed, fingers reaching toward the floor. Shoulders level and down. | Front |
| `hipOpener` | Seated on a plain wooden chair. Right ankle crossed and resting on the left knee, right knee opening out to the side. Torso hinged forward from the hips over the crossed leg, back long and flat, both hands resting on the right shin. | Three-quarter |
| `lowerBackRelease` | Seated on a plain wooden chair, knees together. Torso folded forward over the thighs, spine rounded softly, head hanging heavy and relaxed. Both arms hanging loose toward the floor beside the feet. | Profile |
| `chestOpener` | Standing tall. Both arms behind the back, fingers interlaced, hands lifted away from the body. Shoulder blades drawing together, chest open and lifted, chin slightly raised. | Three-quarter |
| `wristAndForearm` | Standing. Right arm extended straight forward at shoulder height, palm facing away, fingers pointing down. Left hand gently draws the right fingers back toward the body, stretching the forearm. | Front |
| `standingForwardFold` | Standing with feet hip-width, knees very slightly soft. Body folded completely forward from the hips, spine long, head hanging fully released. Both arms dangling straight down, fingertips near the floor. | Profile |
| `catCowInChair` | **Seated on a plain wooden chair, hands on knees. Spine arched into a deep backbend — chest lifted and open, shoulders rolled back, collarbones wide, chin gently lifted, lower back curved inward.** This is the "cow" half of cat-cow. It must NOT look like sitting upright. | Profile |
| `gentleSideBend` | Standing, feet together. Left arm sweeps up and over the head, curving toward the right, creating a long crescent through the left side body. Right arm slides down the right thigh. Hips stay square and level. | Front |
| `neckRolls` | **Standing tall, both arms hanging completely loose at the sides. Head rolled fully to one side — right ear dropped toward the right shoulder, neck in a clear lateral curve, chin drifting slightly toward the chest. Hands must NOT touch the body.** | Front |
| `shoulderShrugAndRelease` | Standing. Both shoulders lifted high and squeezed up toward the ears, neck visibly shortened, arms hanging straight and heavy. A held shrug at its peak. | Front |
| `seatedSpinalTwist` | Seated on a plain wooden chair. Torso rotated to the right. Left hand placed on the outside of the right knee to deepen the twist, right hand resting on the chair back behind her. Head turned to look over the right shoulder. Hips stay square. | Three-quarter |
| `ankleAndCalfRelease` | Seated on a plain wooden chair. Right leg extended forward, heel resting on the floor, toes pulled back toward the shin. Left foot flat on the floor. Hands resting lightly on the thighs. | Profile |
| `figureFour` | Lying on the back on a plain floor. Right ankle crossed over the left thigh just above the knee, forming a figure four. Both hands reach through the gap to clasp behind the left thigh, drawing it toward the chest. Head and shoulders relaxed on the floor. | Three-quarter from above |
| `doorwayChestStretch` | Standing in a simple open doorway, drawn with the barest minimum of line. Right forearm pressed flat against the door frame at shoulder height, elbow bent to ninety degrees. Torso rotated gently away from the arm, opening the chest. | Three-quarter |

---

## MOVE — 9 poses

| Key | POSE | VIEW |
|---|---|---|
| `walkAndWater` | Mid-stride walking, weight on the front foot, back heel lifting. Holding a simple undecorated glass of water in the right hand at waist height. Relaxed, unhurried gait. **Eyes open, calm, looking softly ahead** — this one is an outward-facing ritual. | Three-quarter |
| `standAndReach` | Standing tall on the balls of the feet, heels lifted. Both arms extended straight overhead, fingers interlaced, palms turned up toward the ceiling. Whole body lengthening upward. Chin slightly lifted. | Front |
| `gentleMarching` | Standing in place, marching. Right knee lifted to hip height, right foot flexed. Left arm swung gently forward in natural opposition. Upright, easy posture. | Three-quarter |
| `staircaseLap` | Mid-step climbing a simple staircase drawn with minimal line. Right foot planted on the step above, left foot still on the lower step, weight transferring forward. Right hand resting lightly on a plain handrail. **Eyes open.** | Profile |
| `shakeItOut` | Standing, loose and unstructured. Both arms hanging and visibly shaking out — hands soft and blurred with light motion lines, shoulders loose. Slight bounce through the knees. The only image in the set with visible motion marks. | Front |
| `desksideSquats` | Mid-squat beside a simple plain desk. Hips lowered to roughly knee height, knees tracking over the toes, chest lifted, spine long. Both arms extended straight forward at shoulder height for balance. | Profile |
| `calfRaises` | Standing tall, both heels lifted high off the floor, weight fully on the balls of the feet, calves engaged. Fingertips resting lightly on the back of a plain wooden chair for balance. | Profile |
| `aroundTheBlock` | Walking outdoors. Full figure walking with an easy, relaxed stride, arms swinging naturally. **Eyes open, calm, looking ahead.** Suggest outdoors with at most one or two extremely minimal line elements — a single bare branch, or nothing at all. Do not add scenery, buildings, or landscape. | Three-quarter |
| `shoulderRollsStanding` | Standing tall, arms hanging relaxed. Both shoulders rolled fully back and down, shoulder blades drawing together, chest opening. Mid-rotation, clearly a rolling motion not a static shrug. | Three-quarter |

---

## EYES — 5 (optional, lower priority)

These read fine as abstract geometry in the icon system. Only generate figures
here if you want the eye rituals to feel as rich as stretch. Use head-and-
shoulders crops rather than full body, and keep the same background rules.

| Key | POSE | VIEW |
|---|---|---|
| `palming` | Head and shoulders only. Both palms cupped gently over closed eyes, heels of the hands resting on the cheekbones, fingers overlapping softly on the forehead. No pressure on the eyeballs. | Front, cropped at chest |
| `softGazeMeditation` | Head and shoulders only. Eyes softly half-open with an unfocused, middle-distance gaze. Face completely relaxed, jaw soft. | Three-quarter, cropped at chest |
| `lookFarAway` | Head and shoulders only, in profile, gazing calmly into the far distance. Eyes open. | Profile, cropped at chest |
| `twentyTwentyTwenty` | Head and shoulders, turning away from an implied screen toward a window suggested by a single vertical line. Eyes open, looking out. | Three-quarter, cropped at chest |
| `figureEightTracking` | Head and shoulders. Eyes open, tracking to one side, with a single faint continuous figure-eight line traced in the air in front of her in light sage. | Front, cropped at chest |

---

## BREATH and MIND — do NOT generate figures

These 17 rituals are carried by the Orb and typography. Adding figures would
dilute the moment — the whole point of a breath ritual is that you close your
eyes. Leave them.

---

## Quality gate — reject and regenerate if

- [ ] You can see a rectangle edge where the image meets the app canvas
- [ ] The background has any visible texture, speckle, grain, or vignette
- [ ] Any watermark, sparkle glyph, signature, or text appears anywhere
- [ ] The face, hair, or clothing differs noticeably from the character sheet
- [ ] The figure is cropped at any edge, or is off-centre
- [ ] Any colour outside sage / warm charcoal / skin appears
- [ ] The pose doesn't obviously read as the movement described
- [ ] Anatomy is wrong — check hands and feet especially

## Batch tip

Generate 3–4 variants per pose and keep the best. It's much cheaper than
discovering at integration time that a pose is unreadable at 240px.
