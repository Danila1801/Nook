import { useNavigate } from 'react-router-dom';
import Orb from '../components/Orb.jsx';
import { t } from '../lib/i18n/index.js';
import './Completion.css';

export default function Completion({ type = 'breath', onClose }) {
  const navigate = useNavigate();
  const isDark = type === 'breath';
  const handleClick = () => {
    if (onClose) onClose();
    else navigate('/today');
  };
  return (
    <div className={`completion ${isDark ? 'completion-dark' : 'completion-light'}`}>
      <div className="completion-orb-wrap">
        <Orb size={80} mode={isDark ? 'dark' : 'light'} />
      </div>
      <h1 className="completion-heading">{t('completion.heading')}</h1>
      <p className="completion-body">{t(`completion.bodyByType.${type}`)}</p>
      <button type="button" className="completion-cta" onClick={handleClick}>
        {t('completion.cta')}
      </button>
    </div>
  );
}
