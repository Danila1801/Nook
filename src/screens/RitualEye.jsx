import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Orb from '../components/Orb.jsx';
import Icon from '../components/Icon.jsx';
import Completion from './Completion.jsx';
import { getEyeSequence } from '../lib/rituals/eyeSequences.js';
import { logCompletion } from '../lib/rituals/completions.js';
import { t } from '../lib/i18n/index.js';
import './RitualEye.css';

export default function RitualEye() {
  const navigate = useNavigate();
  const location = useLocation();
  const ritualKey = location.state?.ritualKey || 'lookFarAway';
  const sequence = useMemo(() => getEyeSequence(ritualKey), [ritualKey]);

  const [stepIndex, setStepIndex] = useState(0);
  const [elapsedInStep, setElapsedInStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const loggedRef = useRef(false);

  const step = sequence.steps[stepIndex];
  const isLastStep = stepIndex === sequence.steps.length - 1;

  useEffect(() => {
    if (isComplete && !loggedRef.current) {
      loggedRef.current = true;
      logCompletion({
        ritualKey,
        ritualType: 'eye',
        durationMin: Math.max(1, Math.round(sequence.totalSeconds / 60)),
      });
    }
  }, [isComplete, ritualKey, sequence.totalSeconds]);

  useEffect(() => {
    if (isComplete) return undefined;
    const id = setInterval(() => {
      setElapsedInStep((prev) => {
        const next = prev + 1;
        if (next >= step.seconds) {
          if (isLastStep) {
            clearInterval(id);
            setIsComplete(true);
            return step.seconds;
          }
          setStepIndex((s) => s + 1);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [step.seconds, isLastStep, isComplete]);

  if (isComplete) {
    return <Completion type="eye" onClose={() => navigate('/today')} />;
  }

  const elapsedTotal =
    sequence.steps.slice(0, stepIndex).reduce((s, x) => s + x.seconds, 0) + elapsedInStep;
  const progressPct = Math.min(100, (elapsedTotal / sequence.totalSeconds) * 100);
  const remainingInStep = Math.max(0, step.seconds - elapsedInStep);
  const totalMin = Math.max(1, Math.round(sequence.totalSeconds / 60));
  const eyebrow = `${t('ritualPlayer.typeLabels.eyes').toUpperCase()} · ${totalMin} ${t('ritualPlayer.minLabel').toUpperCase()}`;

  return (
    <div className="ritual-eye">
      <div className="ritual-eye-top">
        <button
          type="button"
          className="ritual-eye-close"
          aria-label={t('ritualPlayer.closeAria')}
          onClick={() => navigate(-1)}
        >
          <Icon name="x-close" size={20} />
        </button>
        <span className="ritual-eye-eyebrow">{eyebrow}</span>
      </div>
      <div className="ritual-eye-center">
        <Orb size={200} mode="light" />
        <p className="ritual-eye-instruction">
          {t(`ritualPlayer.instructions.${step.instructionKey}`)}
        </p>
        <div className="ritual-eye-countdown">{remainingInStep}</div>
      </div>
      <div className="ritual-eye-bottom">
        <div className="ritual-eye-progress">
          <div className="ritual-eye-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>
    </div>
  );
}
