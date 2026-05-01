import Icon from './Icon.jsx';
import { t } from '../lib/i18n/index.js';
import './RitualCanvas.css';

export default function RitualCanvas({
  mode = 'light',
  eyebrow,
  onClose,
  topProgress,
  bottomProgress,
  bottomBar,
  children,
}) {
  const modeClass = mode === 'dark' ? 'ritual-canvas-dark' : 'ritual-canvas-light';
  const hasTopProgress = typeof topProgress === 'number';
  const hasBottomProgress = typeof bottomProgress === 'number';
  const topPct = hasTopProgress ? Math.min(100, Math.max(0, topProgress * 100)) : 0;
  const bottomPct = hasBottomProgress ? Math.min(100, Math.max(0, bottomProgress * 100)) : 0;

  return (
    <div className={`ritual-canvas ${modeClass}`}>
      <div className="ritual-canvas-top">
        {onClose ? (
          <button
            type="button"
            className="ritual-canvas-close"
            aria-label={t('ritualPlayer.closeAria')}
            onClick={onClose}
          >
            <Icon name="x-close" size={20} />
          </button>
        ) : (
          <span className="ritual-canvas-close" aria-hidden="true" />
        )}
        {eyebrow && <span className="ritual-canvas-eyebrow">{eyebrow}</span>}
      </div>

      {hasTopProgress && (
        <div
          className={`ritual-canvas-top-progress${topPct > 0 ? ' ritual-canvas-top-progress-active' : ''}`}
        >
          <div
            className="ritual-canvas-top-progress-fill"
            style={{ width: `${topPct}%` }}
          />
        </div>
      )}

      <div className="ritual-canvas-center">{children}</div>

      {bottomBar && <div className="ritual-canvas-bottom-bar">{bottomBar}</div>}

      {hasBottomProgress && (
        <div className="ritual-canvas-bottom-progress">
          <div
            className="ritual-canvas-bottom-progress-fill"
            style={{ width: `${bottomPct}%` }}
          />
        </div>
      )}
    </div>
  );
}
