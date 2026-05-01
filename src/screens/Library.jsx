import { useNavigate } from 'react-router-dom';
import { CATEGORIES, accentVar } from '../lib/rituals/catalog.js';
import { t } from '../lib/i18n/index.js';
import Icon from '../components/Icon.jsx';
import BottomNav from '../components/BottomNav.jsx';
import './Library.css';

export default function Library() {
  const navigate = useNavigate();

  return (
    <div className="library">
      <main className="library-main">
        <h1 className="library-headline">
          <span className="library-headline-line">{t('library.heading')}</span>
          <span className="library-headline-line library-headline-italic">{t('library.headingItalic')}</span>
        </h1>
        <ul className="library-categories">
          {CATEGORIES.map((cat) => (
            <li key={cat.key} className="library-category">
              <button
                type="button"
                className="library-category-button"
                onClick={() => navigate(`/library/${cat.key}`)}
              >
                <span
                  className="library-category-icon"
                  style={{ background: accentVar(cat.accent) }}
                >
                  <Icon name={cat.iconKey} size={24} color="#ffffff" strokeWidth={2} />
                </span>
                <span className="library-category-body">
                  <span className="library-category-name">
                    {t(`categoryDetail.ritualTypeLabel.${cat.key}`)}
                  </span>
                  <span className="library-category-tagline">
                    {t(`library.taglines.${cat.key}`)}
                  </span>
                </span>
                <span className="library-category-count">
                  {cat.rituals.length}{t('library.countSuffix')}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </main>
      <BottomNav />
    </div>
  );
}
