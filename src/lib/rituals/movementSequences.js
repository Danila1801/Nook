export const MOVEMENT_SEQUENCES = {
  walkAndWater: {
    totalSeconds: 300,
    steps: [
      { instructionKey: 'moveStandUp', seconds: 30 },
      { instructionKey: 'moveWalkToWater', seconds: 90 },
      { instructionKey: 'moveRefill', seconds: 90 },
      { instructionKey: 'moveReturnSlowly', seconds: 90 },
    ],
  },
  standAndReach: {
    totalSeconds: 120,
    steps: [
      { instructionKey: 'moveStandUp', seconds: 30 },
      { instructionKey: 'moveReachUp', seconds: 60 },
      { instructionKey: 'moveSideReach', seconds: 30 },
    ],
  },
  gentleMarching: {
    totalSeconds: 180,
    steps: [
      { instructionKey: 'moveMarchTall', seconds: 60 },
      { instructionKey: 'moveMarchSwing', seconds: 60 },
      { instructionKey: 'moveMarchSlow', seconds: 60 },
    ],
  },
  staircaseLap: {
    totalSeconds: 300,
    steps: [
      { instructionKey: 'moveStaircaseUp', seconds: 120 },
      { instructionKey: 'moveStaircasePause', seconds: 60 },
      { instructionKey: 'moveStaircaseDown', seconds: 120 },
    ],
  },
  shakeItOut: {
    totalSeconds: 120,
    steps: [
      { instructionKey: 'moveShakeArms', seconds: 30 },
      { instructionKey: 'moveShakeLegs', seconds: 30 },
      { instructionKey: 'moveShakeWhole', seconds: 60 },
    ],
  },
  desksideSquats: {
    totalSeconds: 180,
    steps: [
      { instructionKey: 'moveSquatStand', seconds: 30 },
      { instructionKey: 'moveSquatSlow', seconds: 120 },
      { instructionKey: 'moveSquatRest', seconds: 30 },
    ],
  },
  calfRaises: {
    totalSeconds: 120,
    steps: [
      { instructionKey: 'moveCalfStand', seconds: 20 },
      { instructionKey: 'moveCalfRise', seconds: 60 },
      { instructionKey: 'moveCalfLower', seconds: 40 },
    ],
  },
  aroundTheBlock: {
    totalSeconds: 600,
    steps: [
      { instructionKey: 'moveBlockStart', seconds: 60 },
      { instructionKey: 'moveBlockWalk', seconds: 480 },
      { instructionKey: 'moveBlockReturn', seconds: 60 },
    ],
  },
  shoulderRollsStanding: {
    totalSeconds: 120,
    steps: [
      { instructionKey: 'moveShoulderForward', seconds: 50 },
      { instructionKey: 'moveShoulderBack', seconds: 50 },
      { instructionKey: 'moveShoulderRest', seconds: 20 },
    ],
  },
};

export function getMovementSequence(ritualKey) {
  return MOVEMENT_SEQUENCES[ritualKey] || MOVEMENT_SEQUENCES.walkAndWater;
}
