import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Orb from '../components/Orb.jsx';
import RitualCanvas from '../components/RitualCanvas.jsx';
import Completion from './Completion.jsx';
import { getBreathPattern } from '../lib/rituals/breathPatterns.js';
import { logCompletion } from '../lib/rituals/completions.js';
import { t } from '../lib/i18n/index.js';
import './RitualBreath.css';

function formatClock(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function getPhaseAt(elapsedSeconds, phases) {
  const cycle = phases.reduce((sum, p) => sum + p.seconds, 0);
  const within = elapsedSeconds % cycle;
  let acc = 0;
  for (let i = 0; i < phases.length; i++) {
    const p = phases[i];
    if (within < acc + p.seconds) {
      return { index: i, phase: p, secondsIntoPhase: within - acc };
    }
    acc += p.seconds;
  }
  const last = phases.length - 1;
  return { index: last, phase: phases[last], secondsIntoPhase: 0 };
}

export default function RitualBreath() {
  const navigate = useNavigate();
  const location = useLocation();
  const ritualKey = location.state?.ritualKey || 'boxBreathing';
  const pattern = useMemo(() => getBreathPattern(ritualKey), [ritualKey]);

  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const loggedRef = useRef(false);

  useEffect(() => {
    if (isComplete && !loggedRef.current) {
      loggedRef.current = true;
      logCompletion({
        ritualKey,
        ritualType: 'breath',
        durationMin: Math.round(pattern.totalSeconds / 60),
      });
    }
  }, [isComplete, ritualKey, pattern.totalSeconds]);

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed((prev) => {
        if (isPaused) return prev;
        const next = prev + 1;
        if (next >= pattern.totalSeconds) {
          clearInterval(id);
          setIsComplete(true);
          return pattern.totalSeconds;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isPaused, pattern.totalSeconds]);

  const { phase, secondsIntoPhase } = getPhaseAt(elapsed, pattern.phases);
  const secondsRemainingInPhase = Math.max(0, phase.seconds - Math.floor(secondsIntoPhase));

  const totalMin = Math.round(pattern.totalSeconds / 60);
  const eyebrow = `${t(`rituals.${ritualKey}.name`)} · ${totalMin} ${t('ritualPlayer.minLabel').toUpperCase()}`;

  if (isComplete) {
    return <Completion type="breath" onClose={() => navigate('/today')} />;
  }

  const orbStyle = {
    '--orb-scale': phase.orbScale,
    '--orb-duration': `${phase.seconds}s`,
  };

  const progressFraction = elapsed / pattern.totalSeconds;

  return (
    <RitualCanvas
      mode="dark"
      eyebrow={eyebrow}
      onClose={() => navigate(-1)}
      bottomProgress={progressFraction}
    >
      <div className="ritual-breath-orb-stack">
        <span
          className={`ritual-breath-orb-glow${isPaused ? ' ritual-breath-orb-glow-paused' : ''}`}
          aria-hidden="true"
        />
        <button
          type="button"
          className="ritual-breath-orb-button"
          onClick={() => setIsPaused((p) => !p)}
          aria-label={isPaused ? t('ritualPlayer.resume') : t('ritualPlayer.pause')}
        >
          <span
            className={`ritual-breath-orb${isPaused ? ' ritual-breath-orb-paused' : ''}`}
            style={orbStyle}
          >
            <Orb size={280} mode="dark" />
          </span>
        </button>
      </div>
      <div className={`ritual-breath-phase${isPaused ? ' ritual-breath-phase-paused' : ''}`}>
        {t(`ritualPlayer.phases.${phase.label}`)}
      </div>
      <div className="ritual-breath-phase-seconds">{secondsRemainingInPhase}</div>
      <div className="ritual-breath-time">
        {formatClock(elapsed)} / {formatClock(pattern.totalSeconds)}
      </div>
    </RitualCanvas>
  );
}
