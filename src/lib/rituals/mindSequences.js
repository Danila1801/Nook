export const MIND_SEQUENCES = {
  oneBreathReset: {
    totalSeconds: 60,
    steps: [
      { instructionKey: 'mindOneBreath', seconds: 60 },
    ],
  },
  noticeFiveThings: {
    totalSeconds: 120,
    steps: [
      { instructionKey: 'mindFiveSee', seconds: 24 },
      { instructionKey: 'mindFourHear', seconds: 24 },
      { instructionKey: 'mindThreeFeel', seconds: 24 },
      { instructionKey: 'mindTwoSmell', seconds: 24 },
      { instructionKey: 'mindOneTaste', seconds: 24 },
    ],
  },
  gratitudeMoment: {
    totalSeconds: 120,
    steps: [
      { instructionKey: 'mindBringOneToMind', seconds: 40 },
      { instructionKey: 'mindHoldGently', seconds: 40 },
      { instructionKey: 'mindSayThankYou', seconds: 40 },
    ],
  },
  softGazeMeditation: {
    totalSeconds: 180,
    steps: [
      { instructionKey: 'mindLetEyesRest', seconds: 60 },
      { instructionKey: 'mindSoftenFocus', seconds: 60 },
      { instructionKey: 'mindLetEverythingBlurry', seconds: 60 },
    ],
  },
  bodyScanShort: {
    totalSeconds: 240,
    steps: [
      { instructionKey: 'mindAttentionHead', seconds: 40 },
      { instructionKey: 'mindShouldersDrop', seconds: 40 },
      { instructionKey: 'mindSoftenChest', seconds: 40 },
      { instructionKey: 'mindNoticeBelly', seconds: 40 },
      { instructionKey: 'mindFindHips', seconds: 40 },
      { instructionKey: 'mindFeelFeet', seconds: 40 },
    ],
  },
  intentionSetting: {
    totalSeconds: 120,
    steps: [
      { instructionKey: 'mindFindWord', seconds: 60 },
      { instructionKey: 'mindLetItSettle', seconds: 60 },
    ],
  },
};

export function getMindSequence(ritualKey) {
  return MIND_SEQUENCES[ritualKey] || MIND_SEQUENCES.oneBreathReset;
}
