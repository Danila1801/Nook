import { useNavigate } from 'react-router-dom';
import Orb from '../components/Orb.jsx';
import { t } from '../lib/i18n/index.js';
import './Welcome.css';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <main className="welcome">
      <Orb size={112} />
      <div className="welcome-headline">
        <span className="welcome-headline-line">{t('welcome.headingPrefix')}</span>
        <span className="welcome-headline-line welcome-headline-italic">{t('welcome.brand')}</span>
      </div>
      <p className="welcome-body">{t('welcome.body')}</p>
      <button
        type="button"
        className="welcome-cta"
        onClick={() => navigate('/focus')}
      >
        {t('welcome.beginCta')} →
      </button>
      <button type="button" className="welcome-secondary">
        {t('welcome.haveAccount')}
      </button>
    </main>
  );
}
