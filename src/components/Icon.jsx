/*
 * Nook icon system
 * -----------------
 * 24x24 viewBox, 1.5px stroke, round caps, round joins, no fills except a
 * small solid dot where it marks a real point (a focus spot, a pivot, a
 * "planted" moment) — never decoration.
 *
 * Naming:
 *   - bare UI/nav keys                e.g. 'clock', 'chevron-right'
 *   - legacy category-linked keys     e.g. 'calmer-breathing', 'mind-card'
 *       (kept working — 8 screens depend on these exact strings)
 *   - category:<key>                  e.g. 'category:breath'
 *       (new alias for the same 5 category glyphs, for anything written
 *       against the newer convention)
 *   - ritual:<ritualKey>               e.g. 'ritual:boxBreathing'
 *       (one distinct glyph per ritual in src/lib/rituals/catalog.js)
 *
 * Unknown names never render nothing: they resolve to the ritual's category
 * glyph if the key is recognized, and to a neutral default otherwise.
 */

// ---------------------------------------------------------------------------
// Shared glyphs (defined once, referenced by more than one key so the
// legacy names and the new category:<key> names are pixel-identical).
// ---------------------------------------------------------------------------

// Breath — an almost-closed ring with a small flick where the breath escapes.
const breathRing = (
  <>
    <path d="M6.34 6.34 A8 8 0 1 0 12 4" />
    <path d="M12 4 L10 1.6" />
  </>
);

// Stretch — head, neck, shoulder line. (Not broken — kept as the category
// identity; individual stretch rituals below get their own distinct glyphs.)
const stretchFigure = (
  <>
    <circle cx="12" cy="6" r="3" />
    <path d="M 12 9 V 12" />
    <path d="M 5 18 L 12 12 L 19 18" />
  </>
);

// Eyes — a relaxed vesica with a pupil ring. Kept — reads fine at 18px.
const eyeShape = (
  <>
    <path d="M 4 12 Q 12 6 20 12 Q 12 18 4 12 Z" />
    <circle cx="12" cy="12" r="2" />
  </>
);

// Move — three soft, accelerating motion swooshes.
const motionTrail = (
  <>
    <path d="M4 16 Q7 13 4 10" />
    <path d="M10 18 Q15 13 10 8" />
    <path d="M16 20 Q22 13 16 6" />
  </>
);

// Mind — an open vessel: something to hold what's on your mind.
const vessel = (
  <>
    <path d="M6 9 H18" />
    <path d="M7 9 L8 17 Q8.3 19.3 12 19.3 Q15.7 19.3 16 17 L17 9" />
  </>
);

const glyphs = {
  // -------------------------------------------------------------------
  // Legacy keys — every one of these strings is read by an existing
  // screen. Five were genuinely broken and are redesigned below; the
  // rest were already clear at 18px and are kept as-is.
  // -------------------------------------------------------------------

  'neck-shoulders': stretchFigure, // fine as-is — stretch category identity
  'tired-eyes': eyeShape, // fine as-is — eyes category identity

  // was: two parallel diagonal slashes ("\\"), unreadable as "movement".
  // now: a swoosh with an arrowhead — motion with direction.
  'more-movement': (
    <>
      <path d="M5 18 Q8 8 18 6" />
      <path d="M12.5 5.3 L18 6 L17.3 11.3" />
    </>
  ),

  // was: a bare S-squiggle, no readable meaning.
  // now: a spine curve with a filled dot marking the lower/lumbar point —
  // the dot is load-bearing, it's the only thing that says "lower".
  'lower-back': (
    <>
      <path d="M10 4 Q14 8 10 12 Q7 15 11 18" />
      <circle cx="11" cy="19.4" r="1.3" fill="currentColor" />
    </>
  ),

  // was: plain circle-in-circle, indistinguishable from mind-card /
  // steadier-focus. now: an almost-closed breathing ring with a flick —
  // shares its shape with category:breath so the two are guaranteed to
  // match wherever either name is used.
  'calmer-breathing': breathRing,

  // move category identity — was three flat bars (looked like a bar
  // chart, said nothing about "movement"). Now shares motionTrail with
  // category:move.
  'move-card': motionTrail,

  // was: plain circle-in-circle. now: an open vessel — shares its shape
  // with category:mind.
  'mind-card': vessel,

  // was: plain circle-in-circle with a filled center dot — the exact
  // same silhouette as calmer-breathing/mind-card at 18px. now: a focus
  // reticle (ring + four ticks + center dot) — reads as "target", not
  // "breath" or "container".
  'steadier-focus': (
    <>
      <circle cx="12" cy="12" r="6" />
      <path d="M12 3 V5.5 M12 18.5 V21 M3 12 H5.5 M18.5 12 H21" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" />
    </>
  ),

  'clock': (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M 12 12 V 7" />
      <path d="M 12 12 L 16 12" />
    </>
  ),
  'slider': (
    <>
      <path d="M 4 12 H 20" />
      <circle cx="15" cy="12" r="2.5" />
    </>
  ),
  'sun': (
    <>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M 12 4 V 6" />
      <path d="M 12 18 V 20" />
      <path d="M 4 12 H 6" />
      <path d="M 18 12 H 20" />
      <path d="M 6.34 6.34 L 7.76 7.76" />
      <path d="M 16.24 16.24 L 17.66 17.66" />
      <path d="M 6.34 17.66 L 7.76 16.24" />
      <path d="M 16.24 7.76 L 17.66 6.34" />
    </>
  ),
  'library': (
    <>
      <path d="M 5 7 V 19 H 9 V 7 Z" />
      <path d="M 11 5 V 19 H 14 V 5 Z" />
      <path d="M 16 9 V 19 H 19 V 9 Z" />
    </>
  ),
  'chart': (
    <path d="M 4 16 L 9 11 L 13 14 L 19 7" />
  ),
  'person': (
    <>
      <circle cx="12" cy="9" r="3" />
      <path d="M 5 19 Q 5 14 12 14 Q 19 14 19 19" />
    </>
  ),
  'chevron-right': (
    <path d="M 9 6 L 15 12 L 9 18" />
  ),
  'check': (
    <path d="M 5 12 L 10 17 L 19 8" />
  ),
  'x-close': (
    <>
      <path d="M 6 6 L 18 18" />
      <path d="M 18 6 L 6 18" />
    </>
  ),

  // -------------------------------------------------------------------
  // Category glyphs — the new naming convention, same shapes as the
  // legacy keys above so both resolve identically.
  // -------------------------------------------------------------------
  'category:breath': breathRing,
  'category:stretch': stretchFigure,
  'category:eyes': eyeShape,
  'category:move': motionTrail,
  'category:mind': vessel,

  // -------------------------------------------------------------------
  // Breath rituals (9) — rhythm, expansion, containment.
  // -------------------------------------------------------------------

  // Box breathing: a traced square, one corner marked.
  'ritual:boxBreathing': (
    <>
      <path d="M6 6 H18 V18 H6 Z" />
      <circle cx="6" cy="6" r="1.3" fill="currentColor" />
    </>
  ),

  // 4-7-8: three arcs, proportional depth — short hold, longer hold, long exhale.
  'ritual:fourSevenEight': (
    <>
      <path d="M9 8 Q12 6.5 15 8" />
      <path d="M7 12 Q12 9 17 12" />
      <path d="M5 16 Q12 11.5 19 16" />
    </>
  ),

  // Physiological sigh: two quick peaks, one long shallow exhale.
  'ritual:physiologicalSigh': (
    <path d="M3 15 Q4.5 10 6 15 Q7.5 10 9 15 Q14 20 21 13" />
  ),

  // Coherent breathing: one smooth, even, continuous wave.
  'ritual:coherentBreathing': (
    <path d="M3 12 Q7 5 11 12 Q15 19 19 12" />
  ),

  // Lion breath: open exhale with a burst above it.
  'ritual:lionBreath': (
    <>
      <path d="M6 9 Q12 17 18 9" />
      <path d="M9 6 L7.5 3.5" />
      <path d="M15 6 L16.5 3.5" />
    </>
  ),

  // Alternate nostril: a center axis, flow crossing side to side.
  'ritual:alternateNostril': (
    <>
      <path d="M12 4 V20" />
      <path d="M7 8 Q12 8 12 12 Q12 16 17 16" />
    </>
  ),

  // Ease into the day: a soft sunrise over the horizon.
  'ritual:easeIntoTheDay': (
    <>
      <path d="M4 16 H20" />
      <path d="M7.5 16 A4.5 4.5 0 0 1 16.5 16" />
    </>
  ),

  // Wind down breath: a crescent settling in for the evening.
  'ritual:windDownBreath': (
    <path d="M14 5 A7 7 0 1 0 14 19 A5.5 5.5 0 1 1 14 5 Z" />
  ),

  // One-breath reset: a single arc, a single moment.
  'ritual:oneBreathReset': (
    <>
      <path d="M6 15 Q12 6 18 15" />
      <circle cx="18" cy="15" r="1.3" fill="currentColor" />
    </>
  ),

  // -------------------------------------------------------------------
  // Stretch rituals (14) — directional, anatomical hints, arcs of motion.
  // -------------------------------------------------------------------

  'ritual:shouldersAndNeck': (
    <>
      <path d="M4 16 Q12 11 20 16" />
      <path d="M9 9 V5" />
      <path d="M15 9 V5" />
    </>
  ),

  // Hip opener: two arcs easing apart from center — not a closed loop, so
  // it never reads as the figure-eight tracking lemniscate at small sizes.
  'ritual:hipOpener': (
    <>
      <path d="M5 8 Q11 12 5 16" />
      <path d="M19 8 Q13 12 19 16" />
    </>
  ),

  // Lower back release: tension unwinding outward.
  'ritual:lowerBackRelease': (
    <path d="M12 19 Q6.5 19 6.5 14.5 Q6.5 10 11 10 Q14 10 14 12.5 Q14 14.5 12 14.5" />
  ),

  // Chest opener: chest lifting, arms sweeping back.
  'ritual:chestOpener': (
    <>
      <path d="M6 10 Q12 7 18 10" />
      <path d="M6 10 Q4 14 6 18" />
      <path d="M18 10 Q20 14 18 18" />
    </>
  ),

  // Wrist & forearm: forearm meeting a bent-back wrist.
  'ritual:wristAndForearm': (
    <>
      <path d="M5 18 L12.5 11.5" />
      <path d="M12.5 11.5 Q17 9 15 5.5" />
    </>
  ),

  // Standing forward fold: standing tall, curving down to the ground.
  'ritual:standingForwardFold': (
    <>
      <path d="M7 4 V12 Q7 18 14 19.5" />
      <circle cx="15.3" cy="19.7" r="1.3" />
    </>
  ),

  // Cat-cow in chair: the spine waking up, seated.
  'ritual:catCowInChair': (
    <>
      <path d="M5 13 Q9 7 12 13 Q15 19 19 13" />
      <path d="M7 20 H17" />
    </>
  ),

  // Gentle side bend: length on the opposite side of the bend.
  'ritual:gentleSideBend': (
    <>
      <path d="M12.5 4 Q17 11 14 20" />
      <path d="M8 8 Q6 12 8 16" />
    </>
  ),

  // Neck rolls: slow circles around the head.
  'ritual:neckRolls': (
    <>
      <path d="M12 5.5 A6.5 6.5 0 1 1 6 11" />
      <circle cx="12" cy="16" r="2.3" />
    </>
  ),

  // Shoulder shrug & release: up, then drop.
  'ritual:shoulderShrugAndRelease': (
    <>
      <path d="M5 16 Q12 12.5 19 16" />
      <path d="M12 12 V6" />
      <path d="M9 8.5 L12 5.5 L15 8.5" />
    </>
  ),

  // Seated spinal twist: wringing around a fixed pivot.
  'ritual:seatedSpinalTwist': (
    <>
      <path d="M8 7 Q16 9 12 12 Q8 15 16 17" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" />
    </>
  ),

  // Ankle & calf release: leg, ankle, a small flex.
  'ritual:ankleAndCalfRelease': (
    <>
      <path d="M12 4 V14.5" />
      <circle cx="12" cy="17" r="2" />
      <path d="M16 17 Q18.5 17 18.5 13.5" />
    </>
  ),

  // Figure four: the pose is literally shaped like its name.
  'ritual:figureFour': (
    <>
      <path d="M6 18 Q6 10 12.5 10 Q16.5 10 16.5 14" />
      <path d="M9 8 L18 18" />
    </>
  ),

  // Doorway chest stretch: standing tall, arms wide on the frame.
  'ritual:doorwayChestStretch': (
    <>
      <path d="M12 5 V20" />
      <path d="M12 10 Q6.5 10 5.5 5.5" />
      <path d="M12 10 Q17.5 10 18.5 5.5" />
    </>
  ),

  // -------------------------------------------------------------------
  // Eye rituals (5) — focal geometry, distance, convergence.
  // -------------------------------------------------------------------

  // Look far away: horizon and a distant peak.
  'ritual:lookFarAway': (
    <>
      <path d="M4 18 H20" />
      <path d="M8 18 L12 10.5 L16 18" />
    </>
  ),

  // 20-20-20: a near circle, a far circle, a line of sight.
  'ritual:twentyTwentyTwenty': (
    <>
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="12" r="1.3" />
      <path d="M9.5 12 H14.5" />
    </>
  ),

  // Palming: a curve cupped over an eye shape.
  'ritual:palming': (
    <>
      <path d="M4.5 13.5 Q12 17.5 19.5 13.5" />
      <path d="M4 11.5 Q12 3 20 11.5" />
    </>
  ),

  // Figure-eight tracking: a lemniscate.
  'ritual:figureEightTracking': (
    <path d="M8 12 C8 9.5 10 9.5 12 12 C14 14.5 16 14.5 16 12 C16 9.5 14 9.5 12 12 C10 14.5 8 14.5 8 12 Z" />
  ),

  // Soft gaze: a wide, relaxed vesica — no hard pupil, just a soft mark.
  'ritual:softGazeMeditation': (
    <>
      <path d="M4 12 Q12 6.5 20 12 Q12 17.5 4 12 Z" />
      <path d="M9.5 12 Q12 11 14.5 12" />
    </>
  ),

  // -------------------------------------------------------------------
  // Move rituals (9) — directional, arcs of motion, not full bodies.
  // -------------------------------------------------------------------

  // Walk & water: a glass, and a step.
  'ritual:walkAndWater': (
    <>
      <path d="M8 6 H16 L15 17 Q14.8 19 12 19 Q9.2 19 9 17 Z" />
      <path d="M4 19.5 Q6 17.5 8 19.5" />
    </>
  ),

  // Stand & reach: spine tall, arms reaching up.
  'ritual:standAndReach': (
    <>
      <path d="M12 8 V19" />
      <path d="M6 19 H18" />
      <path d="M12 8 L7.5 4 M12 8 L16.5 4" />
    </>
  ),

  // Gentle marching: one knee lifted, steady tempo.
  'ritual:gentleMarching': (
    <>
      <path d="M5 20 H19" />
      <path d="M15 6 V20" />
      <path d="M9 10 L9 14 L11 20" />
    </>
  ),

  // Staircase lap: literal stairs, up and down.
  'ritual:staircaseLap': (
    <path d="M4 19 H8 V15 H12 V11 H16 V7 H20" />
  ),

  // Shake it out: two loose, wobbly limbs.
  'ritual:shakeItOut': (
    <>
      <path d="M6 6 Q9.5 9 6 12 Q9.5 15 6 18" />
      <path d="M18 6 Q14.5 9 18 12 Q14.5 15 18 18" />
    </>
  ),

  // Deskside squats: one continuous bend, down and up.
  'ritual:desksideSquats': (
    <path d="M8 5 V13 L12 17.5 L16 13 V5" />
  ),

  // Calf raises: rising onto the toes.
  'ritual:calfRaises': (
    <>
      <path d="M12 7 V15" />
      <path d="M8 19.5 Q12 14.5 16 19.5" />
      <path d="M9.5 6 L12 3 L14.5 6" />
    </>
  ),

  // Around the block: a lap around a track.
  'ritual:aroundTheBlock': (
    <>
      <path d="M6 8 Q6 5 9 5 H15 Q18 5 18 8 V16 Q18 19 15 19 H9 Q6 19 6 16 Z" />
      <path d="M13.5 3.7 L16.5 5 L13.8 6.8" />
    </>
  ),

  // Shoulder rolls, standing: shoulders wide, a slow roll above them.
  'ritual:shoulderRollsStanding': (
    <>
      <path d="M5 17 Q12 13.5 19 17" />
      <path d="M12 5.5 A3.5 3.5 0 1 1 8.5 9" />
    </>
  ),

  // -------------------------------------------------------------------
  // Mind rituals (8) — containment, release, observation.
  // -------------------------------------------------------------------

  // One word: a marker, planted.
  'ritual:intentionSetting': (
    <>
      <path d="M12 20 V9" />
      <path d="M12 9 L18 9.5 L14.5 12.5 Z" />
      <circle cx="12" cy="20" r="1.3" fill="currentColor" />
    </>
  ),

  // Quiet sit: a cushion, a still shape settled on it.
  'ritual:quietSit': (
    <>
      <path d="M5 17.5 Q12 15 19 17.5" />
      <path d="M8 17.5 Q8 10 12 10 Q16 10 16 17.5" />
    </>
  ),

  // Name it to tame it: a formless shape given an outline.
  'ritual:nameItToTameIt': (
    <>
      <path d="M7 13 Q6 9 9.5 9 Q11 7.5 13.5 8.5 Q17 8.5 16.5 12 Q18 13.5 15.5 15.5 Q13.5 17 11 15.5 Q7.5 16 7 13 Z" />
      <path d="M4 12 A8 8 0 0 1 20 12" />
    </>
  ),

  // Self-compassion break: two hands cupping a held point.
  'ritual:selfCompassionBreak': (
    <>
      <path d="M5 10 Q5 16.5 12 18.5" />
      <path d="M19 10 Q19 16.5 12 18.5" />
      <circle cx="12" cy="13.5" r="1.3" fill="currentColor" />
    </>
  ),

  // Leaves on a stream: a wave carrying a leaf.
  'ritual:leavesOnAStream': (
    <>
      <path d="M3 15.5 Q7 12.5 11 15.5 Q15 18.5 21 15.5" />
      <path d="M13 9.5 Q16 7.5 18 10 Q16 12.5 13 9.5 Z" />
    </>
  ),

  // Reframe: a frame's corners, ready to be repositioned.
  'ritual:reframe': (
    <>
      <path d="M6 9 V6 H9" />
      <path d="M15 6 H18 V9" />
      <path d="M18 15 V18 H15" />
      <path d="M9 18 H6 V15" />
    </>
  ),

  // Container: closed, sealed for later — distinct from the open vessel
  // that stands for the whole mind category.
  'ritual:container': (
    <>
      <path d="M6 8 Q6 6 8 6 H16 Q18 6 18 8 V17 Q18 19 16 19 H8 Q6 19 6 17 Z" />
      <path d="M6 10 H18" />
    </>
  ),

  // Notice five things: scattered small marks — sight, sound, texture.
  'ritual:noticeFiveThings': (
    <>
      <circle cx="6.5" cy="6.5" r="1.3" fill="currentColor" />
      <circle cx="17.5" cy="7.5" r="1.8" />
      <path d="M5.5 17 H9.5" />
      <path d="M14.5 15.5 Q17.5 15.5 17.5 19" />
    </>
  ),
};

// Maps each ritual key (from src/lib/rituals/catalog.js) to its category,
// so an unrecognized 'ritual:<key>' still falls back to something on-theme
// instead of a generic blank.
const RITUAL_CATEGORY = {
  boxBreathing: 'breath',
  fourSevenEight: 'breath',
  physiologicalSigh: 'breath',
  coherentBreathing: 'breath',
  lionBreath: 'breath',
  alternateNostril: 'breath',
  easeIntoTheDay: 'breath',
  windDownBreath: 'breath',
  oneBreathReset: 'breath',

  shouldersAndNeck: 'stretch',
  hipOpener: 'stretch',
  lowerBackRelease: 'stretch',
  chestOpener: 'stretch',
  wristAndForearm: 'stretch',
  standingForwardFold: 'stretch',
  catCowInChair: 'stretch',
  gentleSideBend: 'stretch',
  neckRolls: 'stretch',
  shoulderShrugAndRelease: 'stretch',
  seatedSpinalTwist: 'stretch',
  ankleAndCalfRelease: 'stretch',
  figureFour: 'stretch',
  doorwayChestStretch: 'stretch',

  lookFarAway: 'eyes',
  twentyTwentyTwenty: 'eyes',
  palming: 'eyes',
  figureEightTracking: 'eyes',
  softGazeMeditation: 'eyes',

  walkAndWater: 'move',
  standAndReach: 'move',
  gentleMarching: 'move',
  staircaseLap: 'move',
  shakeItOut: 'move',
  desksideSquats: 'move',
  calfRaises: 'move',
  aroundTheBlock: 'move',
  shoulderRollsStanding: 'move',

  intentionSetting: 'mind',
  quietSit: 'mind',
  nameItToTameIt: 'mind',
  selfCompassionBreak: 'mind',
  leavesOnAStream: 'mind',
  reframe: 'mind',
  container: 'mind',
  noticeFiveThings: 'mind',
};

const DEFAULT_GLYPH = glyphs['category:mind'];

function resolveGlyph(name) {
  const direct = glyphs[name];
  if (direct) return direct;

  if (typeof name === 'string') {
    const ritualKey = name.startsWith('ritual:') ? name.slice('ritual:'.length) : name;
    const category = RITUAL_CATEGORY[ritualKey];
    if (category && glyphs[`category:${category}`]) {
      return glyphs[`category:${category}`];
    }
  }

  // Never render nothing — fall back to a neutral, on-brand default.
  return DEFAULT_GLYPH;
}

export default function Icon({ name, size = 20, color = 'currentColor', strokeWidth = 1.5 }) {
  const glyph = resolveGlyph(name);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      style={{ color }}
      aria-hidden="true"
      focusable="false"
    >
      {glyph}
    </svg>
  );
}
