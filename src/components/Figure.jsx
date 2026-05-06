import { useState } from 'react';
import './Figure.css';

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
    <img
      className="figure-image"
      src={`/illustrations/${figureKey}.webp`}
      alt=""
      width={size}
      height={size}
      onError={() => setErrored(true)}
      draggable={false}
    />
  );
}
