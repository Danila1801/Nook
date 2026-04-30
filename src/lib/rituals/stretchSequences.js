export const STRETCH_SEQUENCES = {
  shouldersAndNeck: {
    totalSeconds: 300,
    steps: [
      { nameKey: 'neckRolls', figureKey: 'neckRolls', seconds: 30, instructionKey: 'slowCircles' },
      { nameKey: 'shoulderShrug', figureKey: 'shoulderShrug', seconds: 30, instructionKey: 'upHoldDrop' },
      { nameKey: 'chestOpener', figureKey: 'chestOpener', seconds: 60, instructionKey: 'handsBehindBackLift' },
      { nameKey: 'catCowInChair', figureKey: 'catCow', seconds: 60, instructionKey: 'archAndRound' },
      { nameKey: 'gentleSideBend', figureKey: 'sideBend', seconds: 60, instructionKey: 'lengthThroughRibs' },
    ],
  },
  hipOpener: {
    totalSeconds: 360,
    steps: [
      { nameKey: 'figureFour', figureKey: 'figureFour', seconds: 90, instructionKey: 'rightAnkleOnLeftKnee' },
      { nameKey: 'figureFour', figureKey: 'figureFour', seconds: 90, instructionKey: 'leftAnkleOnRightKnee' },
      { nameKey: 'standingForwardFold', figureKey: 'forwardFold', seconds: 60, instructionKey: 'letHeadHang' },
      { nameKey: 'seatedSpinalTwist', figureKey: 'spinalTwist', seconds: 60, instructionKey: 'wringOutTheDay' },
      { nameKey: 'gentleSideBend', figureKey: 'sideBend', seconds: 60, instructionKey: 'lengthThroughRibs' },
    ],
  },
  lowerBackRelease: {
    totalSeconds: 240,
    steps: [
      { nameKey: 'catCowInChair', figureKey: 'catCow', seconds: 60, instructionKey: 'archAndRound' },
      { nameKey: 'seatedSpinalTwist', figureKey: 'spinalTwist', seconds: 60, instructionKey: 'wringOutTheDay' },
      { nameKey: 'standingForwardFold', figureKey: 'forwardFold', seconds: 60, instructionKey: 'letHeadHang' },
      { nameKey: 'gentleSideBend', figureKey: 'sideBend', seconds: 60, instructionKey: 'lengthThroughRibs' },
    ],
  },
};

export function getStretchSequence(ritualKey) {
  return STRETCH_SEQUENCES[ritualKey] || STRETCH_SEQUENCES.shouldersAndNeck;
}
