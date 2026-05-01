export const EYE_SEQUENCES = {
  lookFarAway: {
    totalSeconds: 60,
    steps: [
      { instructionKey: 'eyeFindWindow', seconds: 10 },
      { instructionKey: 'eyeLookFar', seconds: 30 },
      { instructionKey: 'eyeBlinkSoftly', seconds: 10 },
      { instructionKey: 'eyeReturn', seconds: 10 },
    ],
  },
  twentyTwentyTwenty: {
    totalSeconds: 60,
    steps: [
      { instructionKey: 'eyeFindFarPoint', seconds: 10 },
      { instructionKey: 'eyeFocusFarPoint', seconds: 20 },
      { instructionKey: 'eyeReturnSoftly', seconds: 30 },
    ],
  },
  palming: {
    totalSeconds: 120,
    steps: [
      { instructionKey: 'eyeRubHandsWarm', seconds: 10 },
      { instructionKey: 'eyeCupPalms', seconds: 15 },
      { instructionKey: 'eyeRestInDarkness', seconds: 80 },
      { instructionKey: 'eyeOpenSlowly', seconds: 15 },
    ],
  },
  figureEightTracking: {
    totalSeconds: 120,
    steps: [
      { instructionKey: 'eyeImagineEight', seconds: 10 },
      { instructionKey: 'eyeTraceSlowly', seconds: 50 },
      { instructionKey: 'eyeReverseDirection', seconds: 50 },
      { instructionKey: 'eyeBlink', seconds: 10 },
    ],
  },
};

export function getEyeSequence(ritualKey) {
  return EYE_SEQUENCES[ritualKey] || EYE_SEQUENCES.lookFarAway;
}
