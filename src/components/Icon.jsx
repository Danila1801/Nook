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
  'sun': (
    <>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M 12 4 V 6" />
      <path d="M 12 18 V 20" />
      <path d="M 4 12 H 6" />
      <path d="M 18 12 H 20" />
      <path d="M 6.34 6.34 L 7.76 7.76" />
      <path d="M 16.24 16.24 L 17.66 17.66" />
      <path d="M 6.34 17.66 L 7.76 16.24" />
      <path d="M 16.24 7.76 L 17.66 6.34" />
    </>
  ),
  'library': (
    <>
      <path d="M 5 7 V 19 H 9 V 7 Z" />
      <path d="M 11 5 V 19 H 14 V 5 Z" />
      <path d="M 16 9 V 19 H 19 V 9 Z" />
    </>
  ),
  'chart': (
    <path d="M 4 16 L 9 11 L 13 14 L 19 7" />
  ),
  'person': (
    <>
      <circle cx="12" cy="9" r="3" />
      <path d="M 5 19 Q 5 14 12 14 Q 19 14 19 19" />
    </>
  ),
  'chevron-right': (
    <path d="M 9 6 L 15 12 L 9 18" />
  ),
  'check': (
    <path d="M 5 12 L 10 17 L 19 8" />
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
