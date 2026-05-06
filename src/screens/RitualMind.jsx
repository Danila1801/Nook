import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RitualCanvas from '../components/RitualCanvas.jsx';
import Completion from './Completion.jsx';
import { getMindSequence } from '../lib/rituals/mindSequences.js';
import { logCompletion } from '../lib/rituals/completions.js';
import { t } from '../lib/i18n/index.js';
import './RitualMind.css';

function formatClock(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function RitualMind() {
  const navigate = useNavigate();
  const location = useLocation();
  const ritualKey = location.state?.ritualKey || 'oneBreathReset';
  const sequence = useMemo(() => getMindSequence(ritualKey), [ritualKey]);

  const [elapsed, setElapsed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const loggedRef = useRef(false);

  useEffect(() => {
    if (isComplete && !loggedRef.current) {
      loggedRef.current = true;
      logCompletion({
        ritualKey,
        ritualType: 'mind',
        durationMin: Math.max(1, Math.round(sequence.totalSeconds / 60)),
      });
    }
  }, [isComplete, ritualKey, sequence.totalSeconds]);

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        if (next >= sequence.totalSeconds) {
          clearInterval(id);
          setIsComplete(true);
          return sequence.totalSeconds;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [sequence.totalSeconds]);

  if (isComplete) {
    return <Completion type="mind" onClose={() => navigate('/today')} />;
  }

  let acc = 0;
  let currentStep = sequence.steps[0];
  for (const s of sequence.steps) {
    if (elapsed < acc + s.seconds) {
      currentStep = s;
      break;
    }
    acc += s.seconds;
  }

  const totalMin = Math.max(1, Math.round(sequence.totalSeconds / 60));
  const eyebrow = `${t(`rituals.${ritualKey}.name`)} · ${totalMin} ${t('ritualPlayer.minLabel').toUpperCase()}`;
  const remainingTotal = Math.max(0, sequence.totalSeconds - elapsed);
  const progressFraction = elapsed / sequence.totalSeconds;

  return (
    <RitualCanvas
      mode="light"
      eyebrow={eyebrow}
      onClose={() => navigate(-1)}
      bottomProgress={progressFraction}
    >
      <p key={currentStep.instructionKey} className="ritual-mind-prompt">
        {t(`ritualPlayer.instructions.${currentStep.instructionKey}`)}
      </p>
      <div className="ritual-mind-time">{formatClock(remainingTotal)}</div>
    </RitualCanvas>
  );
}
