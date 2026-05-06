export const STRETCH_SEQUENCES = {
  shouldersAndNeck: {
    totalSeconds: 150,
    steps: [
      { nameKey: 'neckRolls', figureKey: 'neckRolls', seconds: 20, instructionKey: 'slowCircles' },
      { nameKey: 'shoulderShrug', figureKey: 'shoulderShrug', seconds: 20, instructionKey: 'upHoldDrop' },
      { nameKey: 'chestOpener', figureKey: 'chestOpener', seconds: 40, instructionKey: 'handsBehindBackLift' },
      { nameKey: 'catCowInChair', figureKey: 'catCow', seconds: 40, instructionKey: 'archAndRound' },
      { nameKey: 'gentleSideBend', figureKey: 'sideBend', seconds: 30, instructionKey: 'lengthThroughRibs' },
    ],
  },
  hipOpener: {
    totalSeconds: 235,
    steps: [
      { nameKey: 'figureFour', figureKey: 'figureFour', seconds: 60, instructionKey: 'rightAnkleOnLeftKnee' },
      { nameKey: 'figureFour', figureKey: 'figureFour', seconds: 60, instructionKey: 'leftAnkleOnRightKnee' },
      { nameKey: 'standingForwardFold', figureKey: 'forwardFold', seconds: 45, instructionKey: 'letHeadHang' },
      { nameKey: 'seatedSpinalTwist', figureKey: 'spinalTwist', seconds: 40, instructionKey: 'wringOutTheDay' },
      { nameKey: 'gentleSideBend', figureKey: 'sideBend', seconds: 30, instructionKey: 'lengthThroughRibs' },
    ],
  },
  lowerBackRelease: {
    totalSeconds: 155,
    steps: [
      { nameKey: 'catCowInChair', figureKey: 'catCow', seconds: 40, instructionKey: 'archAndRound' },
      { nameKey: 'seatedSpinalTwist', figureKey: 'spinalTwist', seconds: 40, instructionKey: 'wringOutTheDay' },
      { nameKey: 'standingForwardFold', figureKey: 'forwardFold', seconds: 45, instructionKey: 'letHeadHang' },
      { nameKey: 'gentleSideBend', figureKey: 'sideBend', seconds: 30, instructionKey: 'lengthThroughRibs' },
    ],
  },
};

export function getStretchSequence(ritualKey) {
  return STRETCH_SEQUENCES[ritualKey] || STRETCH_SEQUENCES.shouldersAndNeck;
}
