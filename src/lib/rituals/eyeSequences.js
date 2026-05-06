export const EYE_SEQUENCES = {
  lookFarAway: {
    totalSeconds: 30,
    steps: [
      { instructionKey: 'eyeFindWindow', seconds: 5 },
      { instructionKey: 'eyeLookFar', seconds: 15 },
      { instructionKey: 'eyeBlinkSoftly', seconds: 5 },
      { instructionKey: 'eyeReturn', seconds: 5 },
    ],
  },
  twentyTwentyTwenty: {
    totalSeconds: 45,
    steps: [
      { instructionKey: 'eyeFindFarPoint', seconds: 15 },
      { instructionKey: 'eyeFocusFarPoint', seconds: 15 },
      { instructionKey: 'eyeReturnSoftly', seconds: 15 },
    ],
  },
  palming: {
    totalSeconds: 45,
    steps: [
      { instructionKey: 'eyeRubHandsWarm', seconds: 5 },
      { instructionKey: 'eyeCupPalms', seconds: 10 },
      { instructionKey: 'eyeRestInDarkness', seconds: 25 },
      { instructionKey: 'eyeOpenSlowly', seconds: 5 },
    ],
  },
  figureEightTracking: {
    totalSeconds: 45,
    steps: [
      { instructionKey: 'eyeImagineEight', seconds: 5 },
      { instructionKey: 'eyeTraceSlowly', seconds: 15 },
      { instructionKey: 'eyeReverseDirection', seconds: 15 },
      { instructionKey: 'eyeBlink', seconds: 10 },
    ],
  },
};

export function getEyeSequence(ritualKey) {
  return EYE_SEQUENCES[ritualKey] || EYE_SEQUENCES.lookFarAway;
}
