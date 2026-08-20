import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav.jsx';
import Icon from '../components/Icon.jsx';
import { load, save } from '../lib/storage/index.js';
import { t, pluralKey, setLocale } from '../lib/i18n/index.js';
import { setVoiceMode, isVoiceActive } from '../lib/voice/index.js';
import { setMuted } from '../lib/audio/index.js';
import {
  isNotificationSupported,
  getPermissionState,
  isEnabled as notificationsEnabled,
  setEnabled as setNotificationsEnabled,
  requestPermission,
  scheduleNotificationsForToday,
  clearScheduledNotifications,
  fireTestNotification,
} from '../lib/notifications/index.js';
import './You.css';

const RHYTHM_DEFAULTS = { startTime: '09:00', endTime: '18:00', frequencyMinutes: 90 };
const PREFS_DEFAULTS = {
  breathSounds: 'bowl',
  darkRitualView: 'auto',
  guidedVoice: 'auto',
  language: 'en',
  userName: '',
};
const LANGUAGE_CYCLE = ['en', 'ru'];
const SOUND_CYCLE = ['bowl', 'none'];
const DARK_CYCLE = ['auto', 'on', 'off'];
const VOICE_CYCLE = ['auto', 'on', 'off'];

function nextInCycle(cycle, current) {
  const i = cycle.indexOf(current);
  return cycle[(i + 1) % cycle.length];
}

export default function You() {
  const navigate = useNavigate();
  const rhythm = load('rhythm.settings', RHYTHM_DEFAULTS);
  const focusSelected = load('focus.selected', []);
  const [prefs, setPrefs] = useState(() => {
    const stored = { ...PREFS_DEFAULTS, ...load('prefs', {}) };
    // A stored locale we no longer offer falls back to English. Normalising in
    // the initialiser rather than in an effect avoids a cascading second
    // render on every mount of this screen.
    return LANGUAGE_CYCLE.includes(stored.language)
      ? stored
      : { ...stored, language: 'en' };
  });

  // The initialiser corrected state; this syncs that correction outward to
  // storage and the i18n singleton. Effects are for external systems, so
  // there is deliberately no setState here.
  useEffect(() => {
    const stored = load('prefs', {});
    if (stored.language && !LANGUAGE_CYCLE.includes(stored.language)) {
      save('prefs', { ...stored, language: 'en' });
      setLocale('en');
    }
  }, []);

  const updatePref = (key, value) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    save('prefs', next);
    // Push straight through to the audio/voice singletons so the change is
    // audible on the very next ritual without a reload.
    if (key === 'guidedVoice') setVoiceMode(value);
    if (key === 'breathSounds') setMuted(value === 'none');
  };

  const [notifState, setNotifState] = useState(() => ({
    supported: isNotificationSupported(),
    permission: getPermissionState(),
    enabled: notificationsEnabled(),
  }));

  async function toggleNotifications() {
    if (!notifState.supported) return;

    if (notifState.permission === 'denied') {
      window.alert(t('you.notificationsBlockedAlert'));
      return;
    }

    if (notifState.permission === 'granted') {
      if (notifState.enabled) {
        setNotificationsEnabled(false);
        clearScheduledNotifications();
        setNotifState((s) => ({ ...s, enabled: false }));
      } else {
        setNotificationsEnabled(true);
        scheduleNotificationsForToday();
        setNotifState((s) => ({ ...s, enabled: true }));
      }
      return;
    }

    const result = await requestPermission();
    if (result === 'granted') {
      scheduleNotificationsForToday();
      setNotifState({ supported: true, permission: 'granted', enabled: true });
    } else {
      setNotifState({ supported: true, permission: result, enabled: false });
    }
  }

  function notificationsValueLabel() {
    if (!notifState.supported) return t('you.notificationsUnsupported');
    if (notifState.permission === 'denied') return t('you.notificationsBlocked');
    return notifState.enabled ? t('you.on') : t('you.off');
  }

  const soundLabel = (v) => (v === 'bowl' ? t('you.bowl') : t('you.none'));
  const voiceLabel = (v) =>
    v === 'auto' ? t('you.guidedVoiceAuto') : v === 'on' ? t('you.on') : t('you.off');
  const themeLabel = (v) =>
    v === 'auto'
      ? t('you.darkRitualAuto')
      : v === 'on'
      ? t('you.darkRitualDark')
      : t('you.darkRitualLight');

  // Read the clock once at mount, not on every render. Calling Date.now()
  // during render makes the output depend on when React happens to re-render.
  const [daysWithNook] = useState(() => {
    const onboardedAt = load('onboarded.at', null);
    if (!onboardedAt) return 0;
    return Math.floor((Date.now() - new Date(onboardedAt).getTime()) / 86400000);
  });
  const subtitle =
    daysWithNook === 0
      ? t('you.lessThanADay')
      : t(pluralKey('you.days', daysWithNook), { count: daysWithNook });

  const userName = (prefs.userName || '').trim();
  const displayName = userName || t('you.welcomeBack');
  const initial = userName ? userName.charAt(0).toLocaleUpperCase() : '';

  const [nameModalOpen, setNameModalOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState('');

  function openNameModal() {
    setNameDraft(userName);
    setNameModalOpen(true);
  }

  function saveName() {
    const trimmed = nameDraft.trim();
    updatePref('userName', trimmed);
    setNameModalOpen(false);
  }

  return (
    <div className="you screen-mount">
      <main className="you-main">
        <div className="you-profile">
          {initial && (
            <div className="you-avatar">
              <span className="you-avatar-letter">{initial}</span>
            </div>
          )}
          <h1 className={'you-name' + (userName ? '' : ' you-name-placeholder')}>
            {displayName}
          </h1>
          <p className="you-subtitle">{subtitle}</p>
        </div>

        <section className="you-section">
          <div className="you-section-eyebrow">{t('you.rhythmLabel').toUpperCase()}</div>
          <div className="you-card">
            <button type="button" className="you-row" onClick={() => navigate('/rhythm')}>
              <span className="you-row-label">{t('you.workingHoursLabel')}</span>
              <span className="you-row-right">
                <span className="you-row-value">
                  {t('you.workingHoursFormat', { start: rhythm.startTime, end: rhythm.endTime })}
                </span>
                <span className="you-row-chevron">
                  <Icon name="chevron-right" size={16} />
                </span>
              </span>
            </button>
            <button type="button" className="you-row" onClick={() => navigate('/rhythm')}>
              <span className="you-row-label">{t('you.pauseEveryLabel')}</span>
              <span className="you-row-right">
                <span className="you-row-value">
                  {t('you.pauseEveryFormat', { minutes: rhythm.frequencyMinutes })}
                </span>
                <span className="you-row-chevron">
                  <Icon name="chevron-right" size={16} />
                </span>
              </span>
            </button>
          </div>
        </section>

        <section className="you-section">
          <div className="you-section-eyebrow">{t('you.focusAreasLabel').toUpperCase()}</div>
          <div className="you-card">
            {focusSelected.length === 0 ? (
              <button type="button" className="you-row" onClick={() => navigate('/focus')}>
                <span className="you-row-label">{t('you.notSet')}</span>
                <span className="you-row-chevron">
                  <Icon name="chevron-right" size={16} />
                </span>
              </button>
            ) : (
              focusSelected.map((key) => (
                <button
                  key={key}
                  type="button"
                  className="you-row"
                  onClick={() => navigate('/focus')}
                >
                  <span className="you-row-label">{t(`focus.options.${key}`)}</span>
                  <span className="you-row-right">
                    <span className="you-row-value">{t('you.on')}</span>
                    <span className="you-row-chevron">
                      <Icon name="chevron-right" size={16} />
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
        </section>

        <section className="you-section">
          <div className="you-section-eyebrow">{t('you.preferencesLabel').toUpperCase()}</div>
          <div className="you-card">
            <button
              type="button"
              className="you-row"
              onClick={toggleNotifications}
            >
              <span className="you-row-label-stack">
                <span className="you-row-label">{t('you.gentleNotificationsLabel')}</span>
                {notifState.enabled && (
                  <span className="you-row-caption">{t('you.notificationsCaption')}</span>
                )}
              </span>
              <span
                className={
                  'you-row-value' +
                  (notifState.enabled ? ' you-row-value-accent' : '')
                }
              >
                {notificationsValueLabel()}
              </span>
            </button>
            <button
              type="button"
              className="you-row you-row-ghost"
              onClick={fireTestNotification}
            >
              <span className="you-row-label you-row-label-ghost">
                {t('you.trySample')}
              </span>
            </button>
            <button
              type="button"
              className="you-row"
              onClick={() => updatePref('guidedVoice', nextInCycle(VOICE_CYCLE, prefs.guidedVoice))}
            >
              <span className="you-row-label-stack">
                <span className="you-row-label">{t('you.guidedVoiceLabel')}</span>
                {/* Say plainly when the fallback device voice is what will be
                    heard, rather than implying studio quality we don't have. */}
                {prefs.guidedVoice === 'on' && !isVoiceActive() && (
                  <span className="you-row-caption">{t('you.guidedVoiceDeviceCaption')}</span>
                )}
              </span>
              <span className="you-row-value">{voiceLabel(prefs.guidedVoice)}</span>
            </button>
            <button
              type="button"
              className="you-row"
              onClick={() => updatePref('breathSounds', nextInCycle(SOUND_CYCLE, prefs.breathSounds))}
            >
              <span className="you-row-label">{t('you.breathSoundsLabel')}</span>
              <span className="you-row-value">{soundLabel(prefs.breathSounds)}</span>
            </button>
            <button
              type="button"
              className="you-row"
              onClick={() =>
                updatePref('darkRitualView', nextInCycle(DARK_CYCLE, prefs.darkRitualView))
              }
            >
              <span className="you-row-label">{t('you.ritualThemeLabel')}</span>
              <span className="you-row-value">{themeLabel(prefs.darkRitualView)}</span>
            </button>
            <button
              type="button"
              className="you-row"
              onClick={() => {
                const next = nextInCycle(LANGUAGE_CYCLE, prefs.language);
                updatePref('language', next);
                setLocale(next);
                window.location.reload();
              }}
            >
              <span className="you-row-label">{t('you.language')}</span>
              <span className="you-row-value">{t(`you.languages.${prefs.language}`)}</span>
            </button>
          </div>
        </section>

        <section className="you-section">
          <div className="you-section-eyebrow">{t('you.accountLabel').toUpperCase()}</div>
          <div className="you-card">
            <button
              type="button"
              className="you-row"
              onClick={openNameModal}
            >
              <span className="you-row-label">{t('you.yourNameLabel')}</span>
              <span className="you-row-right">
                <span className="you-row-value">
                  {userName || t('you.yourNamePlaceholder')}
                </span>
                <span className="you-row-chevron">
                  <Icon name="chevron-right" size={16} />
                </span>
              </span>
            </button>
            <button
              type="button"
              className="you-row"
              onClick={() => navigate('/about')}
            >
              <span className="you-row-label">{t('you.about')}</span>
              <span className="you-row-chevron">
                <Icon name="chevron-right" size={16} />
              </span>
            </button>
          </div>
        </section>
      </main>

      {nameModalOpen && (
        <div
          className="you-modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={() => setNameModalOpen(false)}
        >
          <div
            className="you-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="you-modal-title">{t('you.yourNameModalTitle')}</h2>
            <input
              type="text"
              className="you-modal-input"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              placeholder={t('name.placeholder')}
              autoFocus
              maxLength={40}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveName();
                if (e.key === 'Escape') setNameModalOpen(false);
              }}
            />
            <div className="you-modal-actions">
              <button
                type="button"
                className="you-modal-cancel"
                onClick={() => setNameModalOpen(false)}
              >
                {t('you.yourNameModalCancel')}
              </button>
              <button
                type="button"
                className="you-modal-save"
                onClick={saveName}
              >
                {t('you.yourNameModalSave')}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
