import { useNavigate, useLocation } from 'react-router-dom';
import Icon from './Icon.jsx';
import { t } from '../lib/i18n/index.js';
import './BottomNav.css';

const TABS = [
  { key: 'today', path: '/today', icon: 'sun', labelKey: 'nav.today' },
  { key: 'library', path: '/library', icon: 'library', labelKey: 'nav.library' },
  { key: 'progress', path: '/progress', icon: 'chart', labelKey: 'nav.progress' },
  { key: 'you', path: '/you', icon: 'person', labelKey: 'nav.you' },
];

function isTabActive(tab, pathname) {
  if (pathname.startsWith('/ritual/')) return false;
  if (tab.key === 'library') return pathname.startsWith('/library');
  return pathname === tab.path;
}

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="bottom-nav">
      {TABS.map((tab) => {
        const active = isTabActive(tab, pathname);
        return (
          <button
            key={tab.key}
            type="button"
            className={`bottom-nav-tab${active ? ' bottom-nav-tab-active' : ''}`}
            onClick={() => navigate(tab.path)}
            aria-current={active ? 'page' : undefined}
          >
            <Icon name={tab.icon} size={24} />
            <span className="bottom-nav-label">{t(tab.labelKey)}</span>
          </button>
        );
      })}
    </nav>
  );
}
