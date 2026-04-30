import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from '../lib/i18n/index.js';
import './FocusAreas.css';

const OPTION_KEYS = [
  'neckShoulders',
  'lowerBack',
  'tiredEyes',
  'calmerBreathing',
  'moreMovement',
  'steadierFocus',
];

function Checkmark() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M3.5 8.5L6.5 11.5L12.5 5"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FocusAreas() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  function toggle(key) {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  const canContinue = selected.length > 0;

  return (
    <main className="focus">
      <button
        type="button"
        className="focus-back"
        onClick={() => navigate('/')}
      >
        {'‹ '}{t('focus.back')}
      </button>
      <span className="focus-step">{t('focus.step')}</span>
      <h1 className="focus-headline">
        <span className="focus-headline-line">{t('focus.heading')}</span>
        <span className="focus-headline-line focus-headline-italic">{t('focus.headingItalic')}</span>
      </h1>
      <p className="focus-body">{t('focus.body')}</p>
      <ul className="focus-options">
        {OPTION_KEYS.map((key) => {
          const isSelected = selected.includes(key);
          return (
            <li key={key}>
              <button
                type="button"
                className={`focus-option${isSelected ? ' focus-option-selected' : ''}`}
                onClick={() => toggle(key)}
                aria-pressed={isSelected}
              >
                <span className="focus-option-icon" aria-hidden="true" />
                <span className="focus-option-label">{t(`focus.options.${key}`)}</span>
                <span className="focus-option-check">
                  <Checkmark />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        className="focus-continue"
        onClick={() => navigate('/rhythm')}
        disabled={!canContinue}
      >
        {t('focus.continueCta')}
      </button>
    </main>
  );
}
