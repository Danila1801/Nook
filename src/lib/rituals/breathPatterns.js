export const BREATH_PATTERNS = {
  boxBreathing: {
    totalSeconds: 180,
    phases: [
      { label: 'in', seconds: 4, orbScale: 1.0 },
      { label: 'hold', seconds: 4, orbScale: 1.0 },
      { label: 'out', seconds: 4, orbScale: 0.5 },
      { label: 'hold', seconds: 4, orbScale: 0.5 },
    ],
  },
  fourSevenEight: {
    totalSeconds: 180,
    phases: [
      { label: 'in', seconds: 4, orbScale: 1.0 },
      { label: 'hold', seconds: 7, orbScale: 1.0 },
      { label: 'out', seconds: 8, orbScale: 0.5 },
    ],
  },
  physiologicalSigh: {
    totalSeconds: 60,
    phases: [
      { label: 'inShort', seconds: 2, orbScale: 0.85 },
      { label: 'inTop', seconds: 1, orbScale: 1.0 },
      { label: 'outLong', seconds: 6, orbScale: 0.5 },
    ],
  },
  coherentBreathing: {
    totalSeconds: 300,
    phases: [
      { label: 'in', seconds: 5, orbScale: 1.0 },
      { label: 'out', seconds: 5, orbScale: 0.5 },
    ],
  },
  lionBreath: {
    totalSeconds: 120,
    phases: [
      { label: 'in', seconds: 4, orbScale: 1.0 },
      { label: 'roar', seconds: 6, orbScale: 0.5 },
    ],
  },
  alternateNostril: {
    totalSeconds: 240,
    phases: [
      { label: 'inLeft', seconds: 4, orbScale: 1.0 },
      { label: 'holdAtTop', seconds: 2, orbScale: 1.0 },
      { label: 'outRight', seconds: 4, orbScale: 0.5 },
      { label: 'inRight', seconds: 4, orbScale: 1.0 },
      { label: 'holdAtTop', seconds: 2, orbScale: 1.0 },
      { label: 'outLeft', seconds: 4, orbScale: 0.5 },
    ],
  },
  easeIntoTheDay: {
    totalSeconds: 120,
    phases: [
      { label: 'in', seconds: 4, orbScale: 1.0 },
      { label: 'out', seconds: 6, orbScale: 0.5 },
    ],
  },
  windDownBreath: {
    totalSeconds: 180,
    phases: [
      { label: 'in', seconds: 4, orbScale: 1.0 },
      { label: 'out', seconds: 8, orbScale: 0.5 },
    ],
  },
  oneBreathReset: {
    totalSeconds: 60,
    phases: [
      { label: 'in', seconds: 6, orbScale: 1.0 },
      { label: 'hold', seconds: 2, orbScale: 1.0 },
      { label: 'out', seconds: 8, orbScale: 0.5 },
    ],
  },
  noticeFiveThings: {
    totalSeconds: 120,
    phases: [
      { label: 'in', seconds: 5, orbScale: 1.0 },
      { label: 'out', seconds: 5, orbScale: 0.5 },
    ],
  },
  gratitudeMoment: {
    totalSeconds: 120,
    phases: [
      { label: 'in', seconds: 4, orbScale: 1.0 },
      { label: 'out', seconds: 6, orbScale: 0.5 },
    ],
  },
  softGazeMeditation: {
    totalSeconds: 180,
    phases: [
      { label: 'in', seconds: 5, orbScale: 1.0 },
      { label: 'out', seconds: 5, orbScale: 0.5 },
    ],
  },
  bodyScanShort: {
    totalSeconds: 240,
    phases: [
      { label: 'in', seconds: 4, orbScale: 1.0 },
      { label: 'out', seconds: 6, orbScale: 0.5 },
    ],
  },
  intentionSetting: {
    totalSeconds: 120,
    phases: [
      { label: 'in', seconds: 5, orbScale: 1.0 },
      { label: 'out', seconds: 5, orbScale: 0.5 },
    ],
  },
};

export function getBreathPattern(ritualKey) {
  return BREATH_PATTERNS[ritualKey] || BREATH_PATTERNS.boxBreathing;
}
