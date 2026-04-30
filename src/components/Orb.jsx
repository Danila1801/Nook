import { useId } from 'react';

export default function Orb({ size = 112 }) {
  const gradientId = useId();
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
          <stop offset="0%" stopColor="var(--canvas)" />
          <stop offset="100%" stopColor="var(--accent-sage)" />
        </radialGradient>
      </defs>
      <circle
        cx="56"
        cy="56"
        r="55"
        fill={`url(#${gradientId})`}
        stroke="var(--accent-sage)"
        strokeWidth="1"
      />
    </svg>
  );
}
