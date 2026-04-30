const MAX_PAUSES = 6;
const ACTIVE_WINDOW_MIN = 15;

const FOCUS_TO_TYPE = {
  neckShoulders: 'stretch',
  lowerBack: 'stretch',
  tiredEyes: 'eye',
  calmerBreathing: 'breath',
  moreMovement: 'movement',
  steadierFocus: 'breath',
};

const FOCUS_TO_KEY = {
  neckShoulders: 'shouldersAndNeck',
  lowerBack: 'lowerBackRelease',
  tiredEyes: 'lookFarAway',
  calmerBreathing: 'easeIntoTheDay',
  moreMovement: 'walkAndWater',
  steadierFocus: 'fourSevenEight',
};

const RITUALS_BY_TYPE = {
  breath: ['easeIntoTheDay', 'fourSevenEight', 'windDownBreath'],
  stretch: ['shouldersAndNeck', 'lowerBackRelease', 'hipOpener'],
  eye: ['lookFarAway', 'twentyTwentyTwenty'],
  movement: ['walkAndWater', 'standAndReach'],
};

const RITUAL_DURATIONS = {
  easeIntoTheDay: 3,
  windDownBreath: 3,
  fourSevenEight: 2,
  shouldersAndNeck: 5,
  hipOpener: 6,
  lowerBackRelease: 4,
  lookFarAway: 1,
  twentyTwentyTwenty: 1,
  walkAndWater: 5,
  standAndReach: 5,
};

const DEFAULT_ROTATION = ['breath', 'stretch', 'eye', 'movement', 'stretch', 'breath'];

function parseHHMM(hhmm, baseDate) {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date(baseDate);
  d.setHours(h, m, 0, 0);
  return d;
}

function formatHHMM(date) {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

function buildRotation(focusAreas) {
  if (!focusAreas || focusAreas.length === 0) return DEFAULT_ROTATION;
  const focused = [...new Set(
    focusAreas.map((k) => FOCUS_TO_TYPE[k]).filter(Boolean)
  )];
  if (focused.length === 0) return DEFAULT_ROTATION;
  const rotation = [...DEFAULT_ROTATION];
  for (let i = 0; i < focused.length && i < rotation.length; i++) {
    rotation[i] = focused[i];
  }
  return rotation;
}

function pickRitualKey(type, focusAreas, occurrenceIndex) {
  const keys = RITUALS_BY_TYPE[type] || [];
  if (keys.length === 0) return null;
  const preferred = [];
  const rest = [];
  for (const key of keys) {
    const isFocused = focusAreas.some((fa) => FOCUS_TO_KEY[fa] === key);
    (isFocused ? preferred : rest).push(key);
  }
  const ordered = [...preferred, ...rest];
  return ordered[occurrenceIndex % ordered.length];
}

export function buildPausesForToday(settings, focusAreas = [], now = new Date()) {
  if (!settings || !settings.startTime || !settings.endTime || !settings.frequencyMinutes) {
    return [];
  }

  const baseDate = new Date(now);
  baseDate.setHours(0, 0, 0, 0);

  const start = parseHHMM(settings.startTime, baseDate);
  const end = parseHHMM(settings.endTime, baseDate);
  const freq = settings.frequencyMinutes;

  const times = [];
  const cursor = new Date(start);
  cursor.setMinutes(cursor.getMinutes() + freq);
  while (cursor <= end && times.length < MAX_PAUSES) {
    times.push(new Date(cursor));
    cursor.setMinutes(cursor.getMinutes() + freq);
  }

  const rotation = buildRotation(focusAreas);
  const typeCounts = {};

  const pauses = times.map((time, i) => {
    const ritualType = rotation[i % rotation.length];
    const occurrence = typeCounts[ritualType] || 0;
    typeCounts[ritualType] = occurrence + 1;
    const ritualKey = pickRitualKey(ritualType, focusAreas, occurrence);
    const durationMin = RITUAL_DURATIONS[ritualKey] || 3;
    const hhmm = formatHHMM(time);
    return {
      id: `p${i + 1}`,
      time: hhmm,
      timeDisplay: hhmm,
      ritualType,
      ritualKey,
      durationMin,
      _date: time,
    };
  });

  let nextIdx = -1;
  for (let i = 0; i < pauses.length; i++) {
    const diffMin = (pauses[i]._date - now) / 60000;
    if (diffMin >= -ACTIVE_WINDOW_MIN) {
      nextIdx = i;
      break;
    }
  }

  return pauses.map((p, i) => {
    let status;
    if (nextIdx === -1) {
      status = 'done';
    } else if (i < nextIdx) {
      status = 'done';
    } else if (i === nextIdx) {
      status = 'next';
    } else {
      status = 'upcoming';
    }
    const { _date, ...rest } = p;
    return { ...rest, status };
  });
}
