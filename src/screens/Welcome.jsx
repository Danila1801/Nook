import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Orb from '../components/Orb.jsx';
import { load, save } from '../lib/storage/index.js';
import { t } from '../lib/i18n/index.js';
import './Welcome.css';

export default function Welcome() {
  const navigate = useNavigate();

  useEffect(() => {
    const focus = load('focus.selected', null);
    const rhythm = load('rhythm.settings', null);
    const onboarded = load('onboarded.at', null);
    if (focus && rhythm && onboarded) {
      navigate('/today', { replace: true });
    }
  }, [navigate]);

  const handleBegin = () => {
    if (load('onboarded.at', null) === null) {
      save('onboarded.at', new Date().toISOString());
    }
    navigate('/focus');
  };

  return (
    <main className="welcome screen-mount">
      <Orb size={112} />
      <div className="welcome-headline">
        <span className="welcome-headline-line">{t('welcome.headingPrefix')}</span>
        <span className="welcome-headline-line welcome-headline-italic">{t('welcome.brand')}</span>
      </div>
      <p className="welcome-body">{t('welcome.body')}</p>
      <button
        type="button"
        className="welcome-cta"
        onClick={handleBegin}
      >
        {t('welcome.beginCta')} →
      </button>
      <button type="button" className="welcome-secondary">
        {t('welcome.haveAccount')}
      </button>
    </main>
  );
}
