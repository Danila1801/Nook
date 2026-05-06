import { load, save } from '../storage/index.js';
import { buildPausesForToday } from '../rhythm/engine.js';
import { t } from '../i18n/index.js';

const STORAGE_KEY = 'notifications.enabled';

export function isNotificationSupported() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getPermissionState() {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

export function isEnabled() {
  return load(STORAGE_KEY, false) === true && getPermissionState() === 'granted';
}

export function setEnabled(value) {
  save(STORAGE_KEY, value);
}

export async function requestPermission() {
  if (!isNotificationSupported()) return 'unsupported';

  const result = await Notification.requestPermission();
  if (result === 'granted') {
    setEnabled(true);
  }
  return result;
}

const activeTimeouts = new Set();

export function clearScheduledNotifications() {
  for (const id of activeTimeouts) {
    clearTimeout(id);
  }
  activeTimeouts.clear();
}

export function scheduleNotificationsForToday() {
  if (!isEnabled()) return;
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;

  clearScheduledNotifications();

  const settings = load('rhythm.settings', null);
  const focus = load('focus.selected', []);
  if (!settings) return;

  const now = new Date();
  const pauses = buildPausesForToday(settings, focus, now);
  const upcoming = pauses.filter((p) => p.status !== 'done');

  for (const pause of upcoming.slice(0, 6)) {
    const [hh, mm] = pause.time.split(':').map(Number);
    const scheduledAt = new Date();
    scheduledAt.setHours(hh, mm, 0, 0);

    const delayMs = scheduledAt.getTime() - now.getTime();
    if (delayMs <= 0) continue;

    const timeoutId = setTimeout(() => {
      fireNotification(pause);
      activeTimeouts.delete(timeoutId);
    }, delayMs);

    activeTimeouts.add(timeoutId);
  }
}

const TYPE_TO_PATH = {
  breath: '/ritual/breath',
  stretch: '/ritual/stretch',
  eye: '/ritual/eye',
  movement: '/ritual/movement',
  mind: '/ritual/mind',
};

function ritualPath(ritualType) {
  return TYPE_TO_PATH[ritualType] || '/today';
}

function ritualName(ritualKey) {
  const localized = t(`rituals.${ritualKey}.name`);
  if (localized && localized !== `rituals.${ritualKey}.name`) return localized;
  return ritualKey
    .replace(/([A-Z])/g, ' $1')
    .toLowerCase()
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

export async function fireNotification(pause) {
  if (!isEnabled()) return;
  if (Notification.permission !== 'granted') return;

  const title = t('notifications.title');
  const body = `${ritualName(pause.ritualKey)} · ${pause.durationMin} ${t('today.minShort')}`;
  const url = '/#' + ritualPath(pause.ritualType);

  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) {
    new Notification(title, { body, icon: '/icon-192.png' });
    return;
  }

  registration.showNotification(title, {
    body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'nook-pause-' + pause.id,
    data: { url },
    requireInteraction: false,
    silent: false,
  });
}

export async function fireTestNotification() {
  await fireNotification({
    id: 'test',
    ritualKey: 'walkAndWater',
    ritualType: 'movement',
    durationMin: 5,
  });
}
