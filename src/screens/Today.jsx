import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from '../lib/i18n/index.js';
import { load } from '../lib/storage/index.js';
import { buildPausesForToday } from '../lib/rhythm/engine.js';
import Orb from '../components/Orb.jsx';
import Icon from '../components/Icon.jsx';
import BottomNav from '../components/BottomNav.jsx';
import './Today.css';

const TYPE_TO_ICON = {
  breath: 'calmer-breathing',
  stretch: 'neck-shoulders',
  eye: 'tired-eyes',
  movement: 'more-movement',
};

const TYPE_TO_RITUAL_PATH = {
  breath: '/ritual/breath',
  stretch: '/ritual/stretch',
  eye: '/ritual/breath',
  movement: '/ritual/breath',
};

const WEEKDAYS = [
  'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY',
];
const MONTHS = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
];

function formatDateLabel(date) {
  return `${WEEKDAYS[date.getDay()]} · ${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

function minutesUntil(timeHHMM, now) {
  const [h, m] = timeHHMM.split(':').map(Number);
  const target = new Date(now);
  target.setHours(h, m, 0, 0);
  return Math.round((target - now) / 60000);
}

export default function Today() {
  const navigate = useNavigate();
  const [now, setNow] = useState(() => new Date());
  const [pauses, setPauses] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const settings = load('rhythm.settings', null);
    const focusAreas = load('focus.selected', null);
    if (!settings || !focusAreas) {
      navigate('/');
      return;
    }
    const initialNow = new Date();
    setNow(initialNow);
    setPauses(buildPausesForToday(settings, focusAreas, initialNow));
    setReady(true);

    const interval = setInterval(() => {
      const tick = new Date();
      setNow(tick);
      setPauses(buildPausesForToday(settings, focusAreas, tick));
    }, 60000);

    return () => clearInterval(interval);
  }, [navigate]);

  if (!ready) return null;

  const nextPause = pauses.find((p) => p.status === 'next');
  const doneCount = pauses.filter((p) => p.status === 'done').length;
  const total = pauses.length;

  return (
    <div className="today">
      <main className="today-main">
        <div className="today-header">
          <span className="today-date">{formatDateLabel(now)}</span>
          <h1 className="today-headline">
            <span className="today-headline-line">{t('today.defaultHeadingStart')}</span>
            <span className="today-headline-line today-headline-italic">{t('today.defaultHeadingEnd')}</span>
          </h1>
        </div>

        {nextPause && (
          <button
            type="button"
            className="today-upnext"
            onClick={() => navigate(TYPE_TO_RITUAL_PATH[nextPause.ritualType])}
          >
            <Orb size={56} />
            <span className="today-upnext-body">
              <span className="today-upnext-eyebrow">
                {t('today.upNext')}
                {' · '}
                {minutesUntil(nextPause.time, now) <= 0
                  ? t('today.now')
                  : `${t('today.inMin')} ${minutesUntil(nextPause.time, now)} ${t('today.minShort')}`}
              </span>
              <span className="today-upnext-name">{t(`rituals.${nextPause.ritualKey}.name`)}</span>
              <span className="today-upnext-line">{t(`rituals.${nextPause.ritualKey}.line`)}</span>
            </span>
            <Icon name="chevron-right" size={16} color="var(--soft-ink)" />
          </button>
        )}

        <div className="today-rhythm">
          <span className="today-rhythm-eyebrow">
            {t('today.ritualsLabel')}
            {' · '}
            {doneCount} {t('today.doneOf')} {total} {t('today.done')}
          </span>
          <ul className="today-pauses">
            {pauses.map((p, i) => {
              const isLast = i === pauses.length - 1;
              return (
                <li
                  key={p.id}
                  className={`today-pause today-pause-${p.status}${isLast ? ' today-pause-last' : ''}`}
                >
                  <span className="today-pause-icon">
                    {p.status === 'done' ? (
                      <Icon name="check" size={18} color="var(--soft-ink)" />
                    ) : (
                      <Icon
                        name={TYPE_TO_ICON[p.ritualType]}
                        size={18}
                        color={p.status === 'next' ? '#ffffff' : 'var(--soft-ink)'}
                      />
                    )}
                  </span>
                  <span className="today-pause-body">
                    <span className="today-pause-name">{t(`rituals.${p.ritualKey}.name`)}</span>
                    <span className="today-pause-meta">
                      {t(`today.ritualTypes.${p.ritualType}`)}
                      {' · '}
                      {p.durationMin} {t('today.minShort')}
                    </span>
                  </span>
                  <span className="today-pause-time">{p.timeDisplay}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
