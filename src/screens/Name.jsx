import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from '../lib/i18n/index.js';
import { load, save } from '../lib/storage/index.js';
import './Name.css';

export default function Name() {
  const navigate = useNavigate();
  const [value, setValue] = useState('');

  function persist(name) {
    const prefs = load('prefs', {});
    save('prefs', { ...prefs, userName: name });
  }

  function handleContinue() {
    const trimmed = value.trim();
    if (trimmed) persist(trimmed);
    navigate('/today');
  }

  function handleSkip() {
    navigate('/today');
  }

  return (
    <main className="name screen-mount">
      <button
        type="button"
        className="name-back"
        onClick={() => navigate('/rhythm')}
      >
        {'‹ '}{t('name.back')}
      </button>
      <span className="name-step">{t('name.step')}</span>
      <h1 className="name-headline">
        <span className="name-headline-line">{t('name.heading')}</span>
        <span className="name-headline-line name-headline-italic">{t('name.headingItalic')}</span>
      </h1>
      <p className="name-body">{t('name.body')}</p>

      <input
        type="text"
        className="name-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t('name.placeholder')}
        autoComplete="given-name"
        maxLength={40}
      />

      <div className="name-actions">
        <button type="button" className="name-skip" onClick={handleSkip}>
          {t('name.skipCta')}
        </button>
        <button type="button" className="name-continue" onClick={handleContinue}>
          {t('name.continueCta')}
        </button>
      </div>
    </main>
  );
}
