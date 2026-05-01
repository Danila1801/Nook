import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCategory, accentVar } from '../lib/rituals/catalog.js';
import { t } from '../lib/i18n/index.js';
import Icon from '../components/Icon.jsx';
import './CategoryDetail.css';

const CATEGORY_TO_RITUAL_PATH = {
  breath: '/ritual/breath',
  stretch: '/ritual/stretch',
  eyes: '/ritual/eye',
  move: '/ritual/movement',
  mind: '/ritual/breath',
};

export default function CategoryDetail() {
  const navigate = useNavigate();
  const { categoryKey } = useParams();
  const category = getCategory(categoryKey);

  useEffect(() => {
    if (!category) navigate('/library');
  }, [category, navigate]);

  if (!category) return null;

  const accentColor = accentVar(category.accent);
  const ritualPath = CATEGORY_TO_RITUAL_PATH[category.key] || '/ritual/breath';

  return (
    <div className="category-detail screen-mount">
      <main className="category-detail-main">
        <button
          type="button"
          className="category-detail-back"
          onClick={() => navigate(-1)}
        >
          {'‹ '}{t('categoryDetail.back')}
        </button>
        <span className="category-detail-eyebrow">
          {t('categoryDetail.eyebrow')}
          {' · '}
          {t(`categoryDetail.ritualTypeLabel.${category.key}`)}
        </span>
        <h1 className="category-detail-headline">
          <span className="category-detail-headline-line">
            {t(`categoryDetail.headingByCategory.${category.key}.main`)}
          </span>
          <span className="category-detail-headline-line category-detail-headline-italic">
            {t(`categoryDetail.headingByCategory.${category.key}.italic`)}
          </span>
        </h1>
        <p className="category-detail-body">
          {t(`categoryDetail.bodyByCategory.${category.key}`)}
        </p>
        <ul className="category-detail-rituals">
          {category.rituals.map((ritual) => (
            <li key={ritual.key} className="category-detail-ritual">
              <button
                type="button"
                className="category-detail-ritual-button"
                onClick={() =>
                  navigate(ritualPath, {
                    state: { categoryKey: category.key, ritualKey: ritual.key },
                  })
                }
              >
                <span className="category-detail-ritual-icon">
                  <Icon name={category.iconKey} size={16} color={accentColor} />
                </span>
                <span className="category-detail-ritual-body">
                  <span className="category-detail-ritual-name">
                    {t(`rituals.${ritual.key}.name`)}
                  </span>
                  <span className="category-detail-ritual-line">
                    {t(`rituals.${ritual.key}.line`)}
                  </span>
                </span>
                <span className="category-detail-ritual-duration">
                  {ritual.durationMin}{t('today.minShort')}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
