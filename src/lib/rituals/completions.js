import { load, save } from '../storage/index.js';

const KEY = 'completions.log';
const MAX_ENTRIES = 1000;

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function logCompletion(completion) {
  const list = load(KEY, []);
  const entry = {
    id: completion.id || generateId(),
    ritualKey: completion.ritualKey,
    ritualType: completion.ritualType,
    durationMin: completion.durationMin,
    completedAt: completion.completedAt || new Date().toISOString(),
  };
  const next = [entry, ...list].slice(0, MAX_ENTRIES);
  save(KEY, next);
  return entry;
}

export function getCompletions() {
  const list = load(KEY, []);
  return list.slice().sort((a, b) => (a.completedAt < b.completedAt ? 1 : -1));
}

export function clearCompletions() {
  save(KEY, []);
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function dateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const WEEKDAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export function getCompletionsForWeek(date = new Date()) {
  const end = startOfDay(date);
  const start = new Date(end);
  start.setDate(end.getDate() - 6);
  const startMs = start.getTime();
  const endMs = end.getTime() + 24 * 60 * 60 * 1000;
  return getCompletions().filter((c) => {
    const t = new Date(c.completedAt).getTime();
    return t >= startMs && t < endMs;
  });
}

export function getCompletionsByDay(date = new Date()) {
  const end = startOfDay(date);
  const buckets = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date(end);
    day.setDate(end.getDate() - i);
    buckets.push({
      date: dateKey(day),
      weekdayKey: WEEKDAY_KEYS[day.getDay()],
      isToday: i === 0,
      count: 0,
    });
  }
  const lookup = Object.fromEntries(buckets.map((b) => [b.date, b]));
  for (const c of getCompletionsForWeek(date)) {
    const k = dateKey(new Date(c.completedAt));
    if (lookup[k]) lookup[k].count += 1;
  }
  return buckets;
}

export function seedSampleCompletions(now = new Date()) {
  const samples = [];
  const breathRituals = ['boxBreathing', 'fourSevenEight', 'coherentBreathing', 'easeIntoTheDay'];
  const stretchRituals = ['shouldersAndNeck', 'hipOpener', 'lowerBackRelease'];
  const breathDur = { boxBreathing: 3, fourSevenEight: 3, coherentBreathing: 5, easeIntoTheDay: 2 };
  const stretchDur = { shouldersAndNeck: 5, hipOpener: 6, lowerBackRelease: 4 };

  function pick(arr, i) { return arr[i % arr.length]; }

  function addAt(daysAgo, hour, minute, type) {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    d.setHours(hour, minute, 0, 0);
    const ritualKey = type === 'breath'
      ? pick(breathRituals, daysAgo + hour)
      : pick(stretchRituals, daysAgo + hour);
    const durationMin = type === 'breath' ? breathDur[ritualKey] : stretchDur[ritualKey];
    samples.push({
      id: generateId(),
      ritualKey,
      ritualType: type,
      durationMin,
      completedAt: d.toISOString(),
    });
  }

  addAt(6, 8, 30, 'breath');
  addAt(6, 14, 10, 'stretch');
  addAt(5, 8, 45, 'breath');
  addAt(5, 11, 0, 'breath');
  addAt(5, 15, 30, 'stretch');
  addAt(4, 9, 0, 'breath');
  addAt(4, 16, 0, 'stretch');
  addAt(3, 8, 20, 'breath');
  addAt(3, 13, 45, 'stretch');
  addAt(2, 9, 15, 'breath');
  addAt(2, 17, 0, 'stretch');
  addAt(1, 8, 30, 'breath');
  addAt(0, 9, 0, 'breath');
  addAt(0, 14, 30, 'stretch');

  const existing = load(KEY, []);
  const next = [...samples.reverse(), ...existing].slice(0, MAX_ENTRIES);
  save(KEY, next);
  return samples.length;
}
