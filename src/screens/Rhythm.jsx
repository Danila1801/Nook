import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from '../lib/i18n/index.js';
import { load, save } from '../lib/storage/index.js';
import './Rhythm.css';

const STORAGE_KEY = 'rhythm.settings';
const DEFAULTS = { startTime: '09:00', endTime: '18:00', frequencyMinutes: 90 };
const MIN_FREQ = 30;
const MAX_FREQ = 180;
const FREQ_STEP = 5;

function formatTime12h(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  const paddedH = String(displayH).padStart(2, '0');
  const paddedM = String(m).padStart(2, '0');
  return `${paddedH}:${paddedM} ${period}`;
}

function TimeRow({ label, value, onChange }) {
  const inputRef = useRef(null);

  function openPicker() {
    const input = inputRef.current;
    if (!input) return;
    if (typeof input.showPicker === 'function') {
      try {
        input.showPicker();
        return;
      } catch {
        // showPicker may throw without user activation; fall through to focus.
      }
    }
    input.focus();
  }

  return (
    <div
      className="rhythm-time-row"
      role="button"
      tabIndex={0}
      onClick={openPicker}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openPicker();
        }
      }}
    >
      <span className="rhythm-time-label">{label}</span>
      <span className="rhythm-time-display">{formatTime12h(value)}</span>
      <input
        ref={inputRef}
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rhythm-time-input-hidden"
        aria-label={label}
        tabIndex={-1}
      />
    </div>
  );
}

export default function Rhythm() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(() => load(STORAGE_KEY, DEFAULTS));

  function update(patch) {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      save(STORAGE_KEY, next);
      return next;
    });
  }

  const fillPercent =
    ((settings.frequencyMinutes - MIN_FREQ) / (MAX_FREQ - MIN_FREQ)) * 100;
  const sliderBackground = `linear-gradient(to right, var(--accent-sage) 0%, var(--accent-sage) ${fillPercent}%, var(--border) ${fillPercent}%, var(--border) 100%)`;

  return (
    <main className="rhythm">
      <button
        type="button"
        className="rhythm-back"
        onClick={() => navigate('/focus')}
      >
        {'‹ '}{t('rhythm.back')}
      </button>
      <span className="rhythm-step">{t('rhythm.step')}</span>
      <h1 className="rhythm-headline">
        <span className="rhythm-headline-line">{t('rhythm.heading')}</span>
        <span className="rhythm-headline-line rhythm-headline-italic">{t('rhythm.headingItalic')}</span>
      </h1>

      <span className="rhythm-section-label">{t('rhythm.workingHoursLabel')}</span>
      <div className="rhythm-card rhythm-card-times">
        <TimeRow
          label={t('rhythm.startLabel')}
          value={settings.startTime}
          onChange={(v) => update({ startTime: v })}
        />
        <div className="rhythm-divider" />
        <TimeRow
          label={t('rhythm.endLabel')}
          value={settings.endTime}
          onChange={(v) => update({ endTime: v })}
        />
      </div>

      <span className="rhythm-section-label rhythm-section-label-spaced">
        {t('rhythm.pauseRhythmLabel')}
      </span>
      <div className="rhythm-card rhythm-card-pause">
        <div className="rhythm-pause-row">
          <span className="rhythm-pause-label">{t('rhythm.every')}</span>
          <span className="rhythm-pause-value">
            <span className="rhythm-pause-number">{settings.frequencyMinutes}</span>
            <span className="rhythm-pause-unit">{' '}{t('rhythm.minutesUnit')}</span>
          </span>
        </div>
        <input
          type="range"
          className="rhythm-slider"
          min={MIN_FREQ}
          max={MAX_FREQ}
          step={FREQ_STEP}
          value={settings.frequencyMinutes}
          onChange={(e) => update({ frequencyMinutes: Number(e.target.value) })}
          style={{ background: sliderBackground }}
          aria-label={t('rhythm.pauseRhythmLabel')}
        />
        <div className="rhythm-hint-row">
          <span className="rhythm-hint">{t('rhythm.gentleHint')}</span>
          <span className="rhythm-hint">{t('rhythm.relaxedHint')}</span>
        </div>
      </div>

      <p className="rhythm-reassurance">{t('rhythm.reassurance')}</p>

      <button
        type="button"
        className="rhythm-continue"
        onClick={() => {
          save(STORAGE_KEY, settings);
          navigate('/today');
        }}
      >
        {t('rhythm.continueCta')}
      </button>
    </main>
  );
}
