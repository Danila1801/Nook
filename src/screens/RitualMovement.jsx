import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RitualCanvas from '../components/RitualCanvas.jsx';
import Completion from './Completion.jsx';
import { getMovementSequence } from '../lib/rituals/movementSequences.js';
import { logCompletion } from '../lib/rituals/completions.js';
import { t } from '../lib/i18n/index.js';
import './RitualMovement.css';

function SpineMotif() {
  return (
    <svg
      width="40"
      height="200"
      viewBox="0 0 40 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="20" cy="14" r="4" fill="currentColor" stroke="none" />
      <path d="M 20 22 V 178" />
      <circle cx="20" cy="186" r="4" fill="currentColor" stroke="none" />
    </svg>
  );
}

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

  const elapsedTotal =
    sequence.steps.slice(0, stepIndex).reduce((s, x) => s + x.seconds, 0) + elapsedInStep;
  const topFraction = elapsedTotal / sequence.totalSeconds;

  const handleNext = () => {
    if (isLastStep) {
      setIsComplete(true);
      return;
    }
    setStepIndex((s) => s + 1);
    setElapsedInStep(0);
  };

  const bottomBar = (
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
  );

  return (
    <RitualCanvas
      mode="light"
      eyebrow={eyebrow}
      onClose={() => navigate(-1)}
      topProgress={topFraction}
      bottomBar={bottomBar}
    >
      <span className="ritual-movement-step-indicator">
        {t('ritualPlayer.step')} {stepIndex + 1} {t('ritualPlayer.of')} {sequence.steps.length}
      </span>
      <span className="ritual-movement-spine">
        <SpineMotif />
      </span>
      <p className="ritual-movement-instruction">
        {t(`ritualPlayer.instructions.${step.instructionKey}`)}
      </p>
      <div className="ritual-movement-countdown">{remainingInStep}</div>
    </RitualCanvas>
  );
}
