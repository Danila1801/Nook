import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import Completion from './Completion.jsx';
import { getMovementSequence } from '../lib/rituals/movementSequences.js';
import { logCompletion } from '../lib/rituals/completions.js';
import { t } from '../lib/i18n/index.js';
import './RitualMovement.css';

export default function RitualMovement() {
  const navigate = useNavigate();
  const location = useLocation();
  const ritualKey = location.state?.ritualKey || 'walkAndWater';
  const sequence = useMemo(() => getMovementSequence(ritualKey), [ritualKey]);

  const [stepIndex, setStepIndex] = useState(0);
  const [elapsedInStep, setElapsedInStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const loggedRef = useRef(false);

  const step = sequence.steps[stepIndex];
  const isLastStep = stepIndex === sequence.steps.length - 1;

  useEffect(() => {
    if (isComplete && !loggedRef.current) {
      loggedRef.current = true;
      logCompletion({
        ritualKey,
        ritualType: 'movement',
        durationMin: Math.max(1, Math.round(sequence.totalSeconds / 60)),
      });
    }
  }, [isComplete, ritualKey, sequence.totalSeconds]);

  useEffect(() => {
    if (isComplete) return undefined;
    const id = setInterval(() => {
      setElapsedInStep((prev) => {
        if (isPaused) return prev;
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
  }, [isPaused, step.seconds, isLastStep, isComplete]);

  if (isComplete) {
    return <Completion type="movement" onClose={() => navigate('/today')} />;
  }

  const totalMin = Math.max(1, Math.round(sequence.totalSeconds / 60));
  const eyebrow = `${t('ritualPlayer.typeLabels.move').toUpperCase()} · ${totalMin} ${t('ritualPlayer.minLabel').toUpperCase()}`;
  const remainingInStep = Math.max(0, step.seconds - elapsedInStep);

  const handleNext = () => {
    if (isLastStep) {
      setIsComplete(true);
      return;
    }
    setStepIndex((s) => s + 1);
    setElapsedInStep(0);
  };

  return (
    <div className="ritual-movement">
      <div className="ritual-movement-top">
        <button
          type="button"
          className="ritual-movement-close"
          aria-label={t('ritualPlayer.closeAria')}
          onClick={() => navigate(-1)}
        >
          <Icon name="x-close" size={20} />
        </button>
        <span className="ritual-movement-eyebrow">{eyebrow}</span>
      </div>
      <div className="ritual-movement-center">
        <span className="ritual-movement-step-indicator">
          {t('ritualPlayer.step')} {stepIndex + 1} {t('ritualPlayer.of')} {sequence.steps.length}
        </span>
        <p className="ritual-movement-instruction">
          {t(`ritualPlayer.instructions.${step.instructionKey}`)}
        </p>
        <div className="ritual-movement-countdown">{remainingInStep}</div>
      </div>
      <div className="ritual-movement-bottom">
        <button
          type="button"
          className="ritual-movement-pause"
          onClick={() => setIsPaused((p) => !p)}
        >
          {isPaused ? t('ritualPlayer.resume') : t('ritualPlayer.pause')}
        </button>
        <button type="button" className="ritual-movement-next" onClick={handleNext}>
          {isLastStep ? t('ritualPlayer.finish') : t('ritualPlayer.nextStep')}
        </button>
      </div>
    </div>
  );
}
