import { useId } from 'react';

export default function Orb({ size = 112, mode = 'light' }) {
  const gradientId = useId();
  const isDark = mode === 'dark';
  const innerStop = isDark ? 'rgba(184, 194, 168, 0.55)' : 'var(--canvas)';
  const outerStop = isDark ? 'rgba(122, 140, 110, 0.15)' : 'var(--accent-sage)';
  const stroke = isDark ? 'rgba(184, 194, 168, 0.45)' : 'var(--accent-sage)';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 112 112"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor={innerStop} />
          <stop offset="100%" stopColor={outerStop} />
        </radialGradient>
      </defs>
      <circle
        cx="56"
        cy="56"
        r="55"
        fill={`url(#${gradientId})`}
        stroke={stroke}
        strokeWidth="1"
      />
    </svg>
  );
}
