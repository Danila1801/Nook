import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Orb from '../components/Orb.jsx';
import RitualCanvas from '../components/RitualCanvas.jsx';
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
  const progressFraction = elapsedTotal / sequence.totalSeconds;
  const remainingInStep = Math.max(0, step.seconds - elapsedInStep);
  const totalMin = Math.max(1, Math.round(sequence.totalSeconds / 60));
  const eyebrow = `${t('ritualPlayer.typeLabels.eyes').toUpperCase()} · ${totalMin} ${t('ritualPlayer.minLabel').toUpperCase()}`;

  return (
    <RitualCanvas
      mode="light"
      eyebrow={eyebrow}
      onClose={() => navigate(-1)}
      bottomProgress={progressFraction}
    >
      <span
        key={stepIndex}
        className="ritual-eye-orb"
        style={{ '--eye-step-duration': `${step.seconds}s` }}
      >
        <Orb size={220} mode="light" />
      </span>
      <p className="ritual-eye-instruction">
        {t(`ritualPlayer.instructions.${step.instructionKey}`)}
      </p>
      <div className="ritual-eye-countdown">{remainingInStep}</div>
    </RitualCanvas>
  );
}
