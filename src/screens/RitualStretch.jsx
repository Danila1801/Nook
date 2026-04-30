import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import Figure from '../components/Figure.jsx';
import Completion from './Completion.jsx';
import { getStretchSequence } from '../lib/rituals/stretchSequences.js';
import { t } from '../lib/i18n/index.js';
import './RitualStretch.css';

export default function RitualStretch() {
  const navigate = useNavigate();
  const location = useLocation();
  const ritualKey = location.state?.ritualKey || 'shouldersAndNeck';
  const sequence = useMemo(() => getStretchSequence(ritualKey), [ritualKey]);

  const [stepIndex, setStepIndex] = useState(0);
  const [elapsedInStep, setElapsedInStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const step = sequence.steps[stepIndex];
  const isLastStep = stepIndex === sequence.steps.length - 1;

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
    return <Completion type="stretch" onClose={() => navigate('/today')} />;
  }

  const totalMin = Math.round(sequence.totalSeconds / 60);
  const eyebrow = `${t('ritualPlayer.typeLabels.stretch').toUpperCase()} · ${totalMin} ${t('ritualPlayer.minLabel').toUpperCase()}`;
  const remainingInStep = Math.max(0, step.seconds - elapsedInStep);
  const stepProgressPct = Math.min(100, (elapsedInStep / step.seconds) * 100);
  const holdWord = t('ritualPlayer.holdLabel').toUpperCase();
  const secondsWord = (remainingInStep === 1
    ? t('ritualPlayer.secondLabel')
    : t('ritualPlayer.secondsLabel')
  ).toUpperCase();

  const handleNext = () => {
    if (isLastStep) {
      setIsComplete(true);
      return;
    }
    setStepIndex((s) => s + 1);
    setElapsedInStep(0);
  };

  return (
    <div className="ritual-stretch">
      <div className="ritual-stretch-top">
        <button
          type="button"
          className="ritual-stretch-close"
          aria-label={t('ritualPlayer.closeAria')}
          onClick={() => navigate('/today')}
        >
          <Icon name="x-close" size={20} />
        </button>
        <span className="ritual-stretch-eyebrow">{eyebrow}</span>
      </div>
      <div className="ritual-stretch-step-indicator">
        {t('ritualPlayer.step')} {stepIndex + 1} {t('ritualPlayer.of')} {sequence.steps.length}
      </div>
      <h1 className="ritual-stretch-name">{t(`ritualPlayer.stepNames.${step.nameKey}`)}</h1>
      <p className="ritual-stretch-instruction">
        {t(`ritualPlayer.instructions.${step.instructionKey}`)}
      </p>
      <div className="ritual-stretch-figure">
        <Figure figureKey={step.figureKey} size={240} />
      </div>
      <div className="ritual-stretch-hold">
        <div className="ritual-stretch-hold-bar">
          <div
            className="ritual-stretch-hold-bar-fill"
            style={{ width: `${stepProgressPct}%` }}
          />
        </div>
        <div className="ritual-stretch-hold-label">
          {holdWord} {remainingInStep} {secondsWord}
        </div>
      </div>
      <div className="ritual-stretch-bottom">
        <button
          type="button"
          className="ritual-stretch-pause"
          onClick={() => setIsPaused((p) => !p)}
        >
          {isPaused ? t('ritualPlayer.resume') : t('ritualPlayer.pause')}
        </button>
        <button type="button" className="ritual-stretch-next" onClick={handleNext}>
          {isLastStep ? t('ritualPlayer.finish') : t('ritualPlayer.nextStep')}
        </button>
      </div>
    </div>
  );
}
