import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav.jsx';
import Icon from '../components/Icon.jsx';
import { load, save } from '../lib/storage/index.js';
import { t } from '../lib/i18n/index.js';
import './You.css';

const RHYTHM_DEFAULTS = { startTime: '09:00', endTime: '18:00', frequencyMinutes: 90 };
const PREFS_DEFAULTS = {
  notifications: true,
  breathSounds: 'bowl',
  darkRitualView: 'auto',
  language: 'en',
};
const LANGUAGE_CYCLE = ['en', 'ru', 'ro', 'nl'];
const SOUND_CYCLE = ['bowl', 'none'];
const DARK_CYCLE = ['auto', 'on', 'off'];

function nextInCycle(cycle, current) {
  const i = cycle.indexOf(current);
  return cycle[(i + 1) % cycle.length];
}

export default function You() {
  const navigate = useNavigate();
  const rhythm = load('rhythm.settings', RHYTHM_DEFAULTS);
  const focusSelected = load('focus.selected', []);
  const [prefs, setPrefs] = useState(() => ({ ...PREFS_DEFAULTS, ...load('prefs', {}) }));

  const updatePref = (key, value) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    save('prefs', next);
  };

  const onLabel = (b) => (b ? t('you.on') : t('you.off'));
  const soundLabel = (v) => (v === 'bowl' ? t('you.bowl') : t('you.none'));
  const darkLabel = (v) =>
    v === 'auto' ? t('you.auto') : v === 'on' ? t('you.on') : t('you.off');

  const onboardedAt = load('onboarded.at', null);
  const daysWithNook = onboardedAt
    ? Math.max(1, Math.floor((Date.now() - new Date(onboardedAt).getTime()) / 86400000))
    : 1;

  return (
    <div className="you">
      <main className="you-main">
        <div className="you-profile">
          <div className="you-avatar">
            <span className="you-avatar-letter">{t('you.placeholderInitial')}</span>
          </div>
          <h1 className="you-name">{t('you.placeholderName')}</h1>
          <p className="you-subtitle">{t('you.withNookFor', { days: daysWithNook })}</p>
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
              onClick={() => updatePref('notifications', !prefs.notifications)}
            >
              <span className="you-row-label">{t('you.gentleNotificationsLabel')}</span>
              <span className="you-row-value">{onLabel(prefs.notifications)}</span>
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
              <span className="you-row-label">{t('you.darkRitualViewLabel')}</span>
              <span className="you-row-value">{darkLabel(prefs.darkRitualView)}</span>
            </button>
            <button
              type="button"
              className="you-row"
              onClick={() => updatePref('language', nextInCycle(LANGUAGE_CYCLE, prefs.language))}
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
              onClick={() => console.log('about-nook')}
            >
              <span className="you-row-label">{t('you.about')}</span>
              <span className="you-row-chevron">
                <Icon name="chevron-right" size={16} />
              </span>
            </button>
            <button type="button" className="you-row" onClick={() => navigate('/')}>
              <span className="you-row-label">{t('you.signOut')}</span>
              <span className="you-row-chevron">
                <Icon name="chevron-right" size={16} />
              </span>
            </button>
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
