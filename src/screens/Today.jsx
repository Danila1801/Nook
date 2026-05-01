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
  eye: '/ritual/eye',
  movement: '/ritual/movement',
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

function isBeforeWork(now, startTimeHHMM) {
  const [h, m] = startTimeHHMM.split(':').map(Number);
  const start = new Date(now);
  start.setHours(h, m, 0, 0);
  return now < start;
}

export default function Today() {
  const navigate = useNavigate();
  const [now, setNow] = useState(() => new Date());
  const [pauses, setPauses] = useState([]);
  const [settings, setSettings] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loadedSettings = load('rhythm.settings', null);
    const focusAreas = load('focus.selected', null);
    if (!loadedSettings || !focusAreas) {
      navigate('/');
      return;
    }
    const initialNow = new Date();
    setNow(initialNow);
    setSettings(loadedSettings);
    setPauses(buildPausesForToday(loadedSettings, focusAreas, initialNow));
    setReady(true);

    const interval = setInterval(() => {
      const tick = new Date();
      setNow(tick);
      setPauses(buildPausesForToday(loadedSettings, focusAreas, tick));
    }, 60000);

    return () => clearInterval(interval);
  }, [navigate]);

  if (!ready) return null;

  const nextPause = pauses.find((p) => p.status === 'next');
  const doneCount = pauses.filter((p) => p.status === 'done').length;
  const total = pauses.length;

  const allDone = total > 0 && !nextPause;
  const beforeWork =
    settings && doneCount === 0 && nextPause && isBeforeWork(now, settings.startTime);

  let upNextEyebrow = null;
  let upNextName = null;
  let upNextLine = null;
  let upNextOnClick = null;
  let upNextChevron = false;

  if (allDone) {
    upNextEyebrow = t('today.allDoneEyebrow');
    upNextName = t('today.allDoneName');
    upNextLine = t('today.allDoneLine');
  } else if (beforeWork) {
    upNextEyebrow = t('today.beforeWorkEyebrow');
    upNextName = t('today.beforeWorkName');
    upNextLine = t('today.beforeWorkLine');
  } else if (nextPause) {
    const minsUntil = minutesUntil(nextPause.time, now);
    let tail;
    if (minsUntil <= 0) {
      tail = t('today.now');
    } else if (minsUntil >= 60) {
      const h = Math.floor(minsUntil / 60);
      const m = minsUntil % 60;
      const compact = m === 0 ? `${h}h` : `${h}h ${m}m`;
      tail = `${t('today.inMin')} ${compact}`;
    } else {
      tail = `${t('today.inMin')} ${minsUntil} ${t('today.minShort')}`;
    }
    upNextEyebrow = `${t('today.upNext')} · ${tail}`;
    upNextName = t(`rituals.${nextPause.ritualKey}.name`);
    upNextLine = t(`rituals.${nextPause.ritualKey}.line`);
    upNextChevron = true;
    upNextOnClick = () =>
      navigate(TYPE_TO_RITUAL_PATH[nextPause.ritualType] || '/ritual/breath', {
        state: { ritualKey: nextPause.ritualKey },
      });
  }

  const upNextCardContent = (
    <>
      <Orb size={56} />
      <span className="today-upnext-body">
        <span className="today-upnext-eyebrow">{upNextEyebrow}</span>
        <span className="today-upnext-name">{upNextName}</span>
        <span className="today-upnext-line">{upNextLine}</span>
      </span>
      {upNextChevron && (
        <Icon name="chevron-right" size={16} color="var(--soft-ink)" />
      )}
    </>
  );

  return (
    <div className="today screen-mount">
      <main className="today-main">
        <div className="today-header">
          <span className="today-date">{formatDateLabel(now)}</span>
          <h1 className="today-headline">
            <span className="today-headline-line">{t('today.defaultHeadingStart')}</span>
            <span className="today-headline-line today-headline-italic">{t('today.defaultHeadingEnd')}</span>
          </h1>
        </div>

        {upNextEyebrow && (
          upNextOnClick ? (
            <button
              type="button"
              className="today-upnext"
              onClick={upNextOnClick}
            >
              {upNextCardContent}
            </button>
          ) : (
            <div className="today-upnext today-upnext-passive">
              {upNextCardContent}
            </div>
          )
        )}

        <div className="today-rhythm">
          <span className="today-rhythm-eyebrow">
            {beforeWork && doneCount === 0
              ? t('today.readyWhenYouAre')
              : doneCount === 0
              ? `${t('today.ritualsLabel')} · ${total} ${t('today.planned')}`
              : `${t('today.ritualsLabel')} · ${doneCount} ${t('today.doneOf')} ${total} ${t('today.done')}`}
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
