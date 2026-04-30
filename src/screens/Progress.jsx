import { useMemo, useState } from 'react';
import BottomNav from '../components/BottomNav.jsx';
import {
  getCompletions,
  getCompletionsForWeek,
  getCompletionsByDay,
  seedSampleCompletions,
} from '../lib/rituals/completions.js';
import { t } from '../lib/i18n/index.js';
import './Progress.css';

function formatTimeCaredFor(totalMinutes) {
  if (totalMinutes < 60) return `${totalMinutes}m`;
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function uniqueDays(completions) {
  const days = new Set();
  for (const c of completions) {
    const d = new Date(c.completedAt);
    const k = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    days.add(k);
  }
  return days.size;
}

function generateObservations(weekCompletions) {
  const observations = [];

  const morningBreathDays = new Set();
  for (const c of weekCompletions) {
    const d = new Date(c.completedAt);
    if (c.ritualType === 'breath' && d.getHours() < 11) {
      morningBreathDays.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
    }
  }
  if (morningBreathDays.size >= 5) {
    observations.push({
      label: t('progress.obsLabels.kindToYourself'),
      text: t('progress.obs.consistentMorning', { days: morningBreathDays.size }),
    });
  }

  const afternoonByWeekday = {};
  const weekdayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  for (const c of weekCompletions) {
    const d = new Date(c.completedAt);
    const wk = weekdayKeys[d.getDay()];
    if (!afternoonByWeekday[wk]) afternoonByWeekday[wk] = 0;
    if (d.getHours() >= 14) afternoonByWeekday[wk] += 1;
  }
  const lowDay = Object.entries(afternoonByWeekday)
    .filter(([, count]) => count <= 1)
    .sort((a, b) => a[1] - b[1])[0];
  if (lowDay && weekCompletions.length >= 7) {
    observations.push({
      label: t('progress.obsLabels.somethingToNotice'),
      text: t('progress.obs.afternoonGap', {
        weekday: t(`progress.weekdayNames.${lowDay[0]}`),
      }),
    });
  }

  const longest = weekCompletions.reduce((max, c) => Math.max(max, c.durationMin || 0), 0);
  if (longest >= 5) {
    observations.push({
      label: t('progress.obsLabels.aQuietWin'),
      text: t('progress.obs.longestSession', { minutes: longest }),
    });
  }

  if (observations.length < 3) {
    const counts = {};
    for (const c of weekCompletions) {
      counts[c.ritualType] = (counts[c.ritualType] || 0) + 1;
    }
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (entries.length && weekCompletions.length > 0) {
      const [topType, topCount] = entries[0];
      if (topCount / weekCompletions.length > 0.4) {
        observations.push({
          label: t('progress.obsLabels.kindToYourself'),
          text: t('progress.obs.favoriteCategory', {
            category: t(`progress.typeNames.${topType}`),
          }),
        });
      }
    }
  }

  if (weekCompletions.length > 0 && weekCompletions.length < 10 && observations.length < 2) {
    observations.push({
      label: t('progress.obsLabels.somethingToNotice'),
      text: t('progress.obs.quietWeek'),
    });
  }

  return observations.slice(0, 3);
}

export default function Progress() {
  const [version, setVersion] = useState(0);

  const all = useMemo(() => getCompletions(), [version]);
  const week = useMemo(() => getCompletionsForWeek(), [version]);
  const byDay = useMemo(() => getCompletionsByDay(), [version]);

  const isEmpty = all.length === 0;

  const handleSeed = () => {
    seedSampleCompletions();
    setVersion((v) => v + 1);
  };

  if (isEmpty) {
    return (
      <div className="progress">
        <main className="progress-main">
          <div className="progress-eyebrow">{t('progress.thisWeek').toUpperCase()}</div>
          <div className="progress-empty">
            <h1 className="progress-empty-heading">{t('progress.emptyStateHeading')}</h1>
            <p className="progress-empty-body">{t('progress.emptyStateBody')}</p>
            <button type="button" className="progress-seed-button" onClick={handleSeed}>
              {t('progress.emptyStateCta')}
            </button>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  const totalCount = week.length;
  const totalMinutes = week.reduce((sum, c) => sum + (c.durationMin || 0), 0);
  const daysActive = uniqueDays(week);
  const maxDayCount = byDay.reduce((max, b) => Math.max(max, b.count), 0) || 1;
  const observations = generateObservations(week);

  return (
    <div className="progress">
      <main className="progress-main">
        <div className="progress-eyebrow">{t('progress.thisWeek').toUpperCase()}</div>
        <h1 className="progress-headline">
          <span className="progress-headline-line">{t('progress.heading')}</span>
          <span className="progress-headline-line progress-headline-italic">
            {t('progress.headingItalic', { count: totalCount })}
          </span>
        </h1>
        <div className="progress-chart-card">
          <div className="progress-chart-bars">
            {byDay.map((b) => {
              const heightPct = (b.count / maxDayCount) * 100;
              return (
                <div key={b.date} className="progress-chart-bar-col">
                  <div
                    className="progress-chart-bar"
                    style={{ height: `${Math.max(heightPct, b.count > 0 ? 8 : 4)}%` }}
                    aria-label={`${b.count} pauses`}
                  />
                </div>
              );
            })}
          </div>
          <div className="progress-chart-labels">
            {byDay.map((b) => (
              <div
                key={b.date}
                className={`progress-chart-label${b.isToday ? ' progress-chart-label-today' : ''}`}
              >
                {t(`progress.weekdayLabels.${b.weekdayKey}`)}
              </div>
            ))}
          </div>
        </div>
        <div className="progress-stats">
          <div className="progress-stat">
            <span className="progress-stat-value">{totalCount}</span>
            <span className="progress-stat-label">{t('progress.pausesLabel').toUpperCase()}</span>
          </div>
          <div className="progress-stat">
            <span className="progress-stat-value">{formatTimeCaredFor(totalMinutes)}</span>
            <span className="progress-stat-label">
              {t('progress.timeCaredForLabel').toUpperCase()}
            </span>
          </div>
          <div className="progress-stat">
            <span className="progress-stat-value">{daysActive}</span>
            <span className="progress-stat-label">
              {t('progress.daysActiveLabel').toUpperCase()}
            </span>
          </div>
        </div>
        {observations.length > 0 && (
          <section className="progress-observations">
            <div className="progress-observations-eyebrow">
              {t('progress.observationsLabel').toUpperCase()}
            </div>
            <div className="progress-observation-list">
              {observations.map((obs, i) => (
                <div key={i} className="progress-observation">
                  <div className="progress-observation-label">{obs.label.toUpperCase()}</div>
                  <p className="progress-observation-text">{obs.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
