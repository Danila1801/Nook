export const CATEGORIES = [
  {
    key: 'breath',
    accent: 'sage',
    iconKey: 'calmer-breathing',
    rituals: [
      { key: 'boxBreathing', durationMin: 3 },
      { key: 'fourSevenEight', durationMin: 3 },
      { key: 'physiologicalSigh', durationMin: 1 },
      { key: 'coherentBreathing', durationMin: 5 },
      { key: 'lionBreath', durationMin: 2 },
      { key: 'alternateNostril', durationMin: 4 },
      { key: 'easeIntoTheDay', durationMin: 2 },
      { key: 'windDownBreath', durationMin: 3 },
    ],
  },
  {
    key: 'stretch',
    accent: 'sage',
    iconKey: 'neck-shoulders',
    rituals: [
      { key: 'shouldersAndNeck', durationMin: 5 },
      { key: 'hipOpener', durationMin: 6 },
      { key: 'lowerBackRelease', durationMin: 4 },
      { key: 'chestOpener', durationMin: 3 },
      { key: 'wristAndForearm', durationMin: 2 },
      { key: 'standingForwardFold', durationMin: 3 },
      { key: 'catCowInChair', durationMin: 3 },
      { key: 'gentleSideBend', durationMin: 2 },
      { key: 'neckRolls', durationMin: 2 },
      { key: 'shoulderShrugAndRelease', durationMin: 2 },
      { key: 'seatedSpinalTwist', durationMin: 3 },
      { key: 'ankleAndCalfRelease', durationMin: 3 },
      { key: 'figureFour', durationMin: 4 },
      { key: 'doorwayChestStretch', durationMin: 2 },
    ],
  },
  {
    key: 'eyes',
    accent: 'amber',
    iconKey: 'tired-eyes',
    rituals: [
      { key: 'lookFarAway', durationMin: 1 },
      { key: 'twentyTwentyTwenty', durationMin: 1 },
      { key: 'palming', durationMin: 2 },
      { key: 'figureEightTracking', durationMin: 2 },
    ],
  },
  {
    key: 'move',
    accent: 'plum',
    iconKey: 'more-movement',
    rituals: [
      { key: 'walkAndWater', durationMin: 5 },
      { key: 'standAndReach', durationMin: 2 },
      { key: 'gentleMarching', durationMin: 3 },
      { key: 'staircaseLap', durationMin: 5 },
      { key: 'shakeItOut', durationMin: 2 },
      { key: 'desksideSquats', durationMin: 3 },
      { key: 'calfRaises', durationMin: 2 },
      { key: 'aroundTheBlock', durationMin: 10 },
      { key: 'shoulderRollsStanding', durationMin: 2 },
    ],
  },
  {
    key: 'mind',
    accent: 'slate-blue',
    iconKey: 'steadier-focus',
    rituals: [
      { key: 'oneBreathReset', durationMin: 1 },
      { key: 'noticeFiveThings', durationMin: 2 },
      { key: 'gratitudeMoment', durationMin: 2 },
      { key: 'softGazeMeditation', durationMin: 3 },
      { key: 'bodyScanShort', durationMin: 4 },
      { key: 'intentionSetting', durationMin: 2 },
    ],
  },
];

const ACCENT_VARS = {
  sage: 'var(--accent-sage)',
  amber: 'var(--accent-amber)',
  plum: 'var(--accent-plum)',
  'slate-blue': 'var(--accent-slate-blue)',
};

export function accentVar(accent) {
  return ACCENT_VARS[accent] || 'var(--ink)';
}

export function getCategory(key) {
  return CATEGORIES.find((c) => c.key === key) || null;
}

export function getRitual(categoryKey, ritualKey) {
  const category = getCategory(categoryKey);
  if (!category) return null;
  const ritual = category.rituals.find((r) => r.key === ritualKey);
  return ritual ? { ...ritual, categoryKey } : null;
}
