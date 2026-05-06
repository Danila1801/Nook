import { useNavigate } from 'react-router-dom';
import { t } from '../lib/i18n/index.js';
import './About.css';

export default function About() {
  const navigate = useNavigate();

  return (
    <main className="about screen-mount">
      <button
        type="button"
        className="about-back"
        onClick={() => navigate('/you')}
      >
        {'‹ '}{t('about.back')}
      </button>
      <span className="about-eyebrow">{t('about.eyebrow').toUpperCase()}</span>

      <h1 className="about-heading">{t('about.heading')}</h1>
      <p className="about-tagline">{t('about.tagline')}</p>

      <div className="about-body">
        <p className="about-paragraph">{t('about.p1')}</p>
        <p className="about-paragraph">{t('about.p2')}</p>
        <p className="about-paragraph">{t('about.p3')}</p>
      </div>

      <div className="about-footer">{t('about.footer')}</div>
    </main>
  );
}
