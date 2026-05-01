import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from '../lib/i18n/index.js';
import { load, save } from '../lib/storage/index.js';
import Icon from '../components/Icon.jsx';
import './FocusAreas.css';

const OPTION_KEYS = [
  'neckShoulders',
  'lowerBack',
  'tiredEyes',
  'calmerBreathing',
  'moreMovement',
  'steadierFocus',
];

const ICON_MAP = {
  neckShoulders: 'neck-shoulders',
  lowerBack: 'lower-back',
  tiredEyes: 'tired-eyes',
  calmerBreathing: 'calmer-breathing',
  moreMovement: 'more-movement',
  steadierFocus: 'steadier-focus',
};

const STORAGE_KEY = 'focus.selected';

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
  const [selected, setSelected] = useState(() => load(STORAGE_KEY, []));

  function toggle(key) {
    setSelected((prev) => {
      const next = prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key];
      save(STORAGE_KEY, next);
      return next;
    });
  }

  const canContinue = selected.length > 0;

  return (
    <main className="focus screen-mount">
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
                <span className="focus-option-icon" aria-hidden="true">
                  <Icon name={ICON_MAP[key]} size={18} color="var(--ink)" />
                </span>
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
