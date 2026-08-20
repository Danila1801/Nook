import { useState } from 'react';
import './Figure.css';

/**
 * A ritual pose illustration.
 *
 * Decorative by design — the pose is always described in adjacent text, so
 * alt="" is correct here rather than a duplicate description that screen
 * readers would read twice.
 */
export default function Figure({ figureKey, size = 240 }) {
  const [errored, setErrored] = useState(false);

  if (errored || !figureKey) {
    return (
      <span
        className="figure-fallback"
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
    );
  }

  return (
    <span className="figure" style={{ width: size, height: size }}>
      <img
        className="figure-image"
        src={`/illustrations/${figureKey}.webp`}
        alt=""
        width={size}
        height={size}
        /* Explicit dimensions + aspect-ratio on the wrapper reserve the box
           before decode, so the ritual layout never jumps mid-step. */
        loading="lazy"
        decoding="async"
        onError={() => setErrored(true)}
        draggable={false}
      />
    </span>
  );
}
