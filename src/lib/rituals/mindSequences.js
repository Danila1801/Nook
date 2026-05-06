export const MIND_SEQUENCES = {
  intentionSetting: {
    totalSeconds: 90,
    steps: [
      { instructionKey: 'mindFindWord', seconds: 50 },
      { instructionKey: 'mindLetItSettle', seconds: 40 },
    ],
  },
  noticeFiveThings: {
    totalSeconds: 90,
    steps: [
      { instructionKey: 'mindFiveSee', seconds: 18 },
      { instructionKey: 'mindFourHear', seconds: 18 },
      { instructionKey: 'mindThreeFeel', seconds: 18 },
      { instructionKey: 'mindTwoSmell', seconds: 18 },
      { instructionKey: 'mindOneTaste', seconds: 18 },
    ],
  },
  leavesOnAStream: {
    totalSeconds: 100,
    steps: [
      { instructionKey: 'mindLeavesPicture', seconds: 20 },
      { instructionKey: 'mindLeavesDrifts', seconds: 20 },
      { instructionKey: 'mindLeavesPlace', seconds: 25 },
      { instructionKey: 'mindLeavesFloat', seconds: 20 },
      { instructionKey: 'mindLeavesBank', seconds: 15 },
    ],
  },
  selfCompassionBreak: {
    totalSeconds: 90,
    steps: [
      { instructionKey: 'mindCompassionHard', seconds: 20 },
      { instructionKey: 'mindCompassionHuman', seconds: 25 },
      { instructionKey: 'mindCompassionHand', seconds: 15 },
      { instructionKey: 'mindCompassionKind', seconds: 30 },
    ],
  },
  nameItToTameIt: {
    totalSeconds: 90,
    steps: [
      { instructionKey: 'mindNameNotice', seconds: 20 },
      { instructionKey: 'mindNameOneWord', seconds: 25 },
      { instructionKey: 'mindNameSofterWord', seconds: 25 },
      { instructionKey: 'mindNameSayTwice', seconds: 20 },
    ],
  },
  quietSit: {
    totalSeconds: 100,
    steps: [
      { instructionKey: 'mindQuietSit', seconds: 25 },
      { instructionKey: 'mindQuietNoWords', seconds: 25 },
      { instructionKey: 'mindQuietSounds', seconds: 25 },
      { instructionKey: 'mindQuietBell', seconds: 25 },
    ],
  },
  reframe: {
    totalSeconds: 100,
    steps: [
      { instructionKey: 'mindReframeBring', seconds: 20 },
      { instructionKey: 'mindReframeStory', seconds: 20 },
      { instructionKey: 'mindReframeOnly', seconds: 20 },
      { instructionKey: 'mindReframeKinder', seconds: 25 },
      { instructionKey: 'mindReframeHold', seconds: 15 },
    ],
  },
  container: {
    totalSeconds: 90,
    steps: [
      { instructionKey: 'mindContainerPicture', seconds: 20 },
      { instructionKey: 'mindContainerInside', seconds: 25 },
      { instructionKey: 'mindContainerOne', seconds: 25 },
      { instructionKey: 'mindContainerClose', seconds: 20 },
    ],
  },
};

export function getMindSequence(ritualKey) {
  return MIND_SEQUENCES[ritualKey] || MIND_SEQUENCES.intentionSetting;
}
