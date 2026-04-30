const glyphs = {
  'neck-shoulders': (
    <>
      <circle cx="12" cy="6" r="3" />
      <path d="M 12 9 V 12" />
      <path d="M 5 18 L 12 12 L 19 18" />
    </>
  ),
  'lower-back': (
    <path d="M 12 4 Q 16 8 12 12 Q 8 16 12 20" />
  ),
  'tired-eyes': (
    <>
      <path d="M 4 12 Q 12 6 20 12 Q 12 18 4 12 Z" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  'calmer-breathing': (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  'more-movement': (
    <>
      <path d="M 7 6 L 13 18" />
      <path d="M 14 6 L 20 18" />
    </>
  ),
  'steadier-focus': (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </>
  ),
  'clock': (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M 12 12 V 7" />
      <path d="M 12 12 L 16 12" />
    </>
  ),
  'slider': (
    <>
      <path d="M 4 12 H 20" />
      <circle cx="15" cy="12" r="2.5" />
    </>
  ),
};

export default function Icon({ name, size = 20, color = 'currentColor' }) {
  const glyph = glyphs[name];
  if (!glyph) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      style={{ color }}
      aria-hidden="true"
      focusable="false"
    >
      {glyph}
    </svg>
  );
}
