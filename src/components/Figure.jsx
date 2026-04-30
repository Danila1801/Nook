const FIGURES = {
  neckRolls: (
    <>
      <circle cx="100" cy="70" r="18" />
      <path d="M 100 88 V 140" />
      <path d="M 76 110 H 124" />
      <path d="M 100 140 L 84 180" />
      <path d="M 100 140 L 116 180" />
      <path d="M 122 50 Q 138 60 132 78" />
      <path d="M 132 78 L 128 72 M 132 78 L 138 76" />
    </>
  ),
  shoulderShrug: (
    <>
      <circle cx="100" cy="78" r="18" />
      <path d="M 100 96 V 150" />
      <path d="M 70 102 Q 100 84 130 102" />
      <path d="M 70 102 V 130" />
      <path d="M 130 102 V 130" />
      <path d="M 100 150 L 84 188" />
      <path d="M 100 150 L 116 188" />
    </>
  ),
  chestOpener: (
    <>
      <circle cx="100" cy="64" r="16" />
      <path d="M 100 80 Q 92 110 100 150" />
      <path d="M 76 96 Q 60 130 88 152" />
      <path d="M 124 96 Q 140 130 112 152" />
      <path d="M 100 150 L 84 188" />
      <path d="M 100 150 L 116 188" />
    </>
  ),
  catCow: (
    <>
      <circle cx="56" cy="100" r="14" />
      <path d="M 70 100 Q 110 80 150 100" />
      <path d="M 78 110 V 150" />
      <path d="M 142 110 V 150" />
      <path d="M 78 150 V 168" />
      <path d="M 142 150 V 168" />
      <path d="M 56 100 L 44 110" />
    </>
  ),
  sideBend: (
    <>
      <circle cx="124" cy="56" r="14" />
      <path d="M 124 70 Q 116 110 92 150" />
      <path d="M 124 70 Q 140 90 144 110" />
      <path d="M 92 150 L 80 188" />
      <path d="M 92 150 L 104 188" />
    </>
  ),
  figureFour: (
    <>
      <circle cx="100" cy="56" r="14" />
      <path d="M 100 70 V 110" />
      <path d="M 80 110 H 124" />
      <path d="M 80 110 L 60 150" />
      <path d="M 124 110 Q 144 130 130 158" />
      <path d="M 130 158 L 100 144" />
      <path d="M 100 144 L 60 150" />
    </>
  ),
  forwardFold: (
    <>
      <circle cx="100" cy="160" r="14" />
      <path d="M 100 146 Q 88 110 100 80" />
      <path d="M 92 156 L 76 178" />
      <path d="M 108 156 L 124 178" />
      <path d="M 100 80 V 60" />
      <path d="M 100 80 L 86 70" />
      <path d="M 100 80 L 114 70" />
    </>
  ),
  spinalTwist: (
    <>
      <circle cx="100" cy="64" r="14" />
      <path d="M 100 78 Q 84 110 110 140" />
      <path d="M 80 110 H 130" />
      <path d="M 80 140 H 130" />
      <path d="M 130 110 L 142 96" />
      <path d="M 80 110 L 70 124" />
    </>
  ),
};

export default function Figure({ figureKey, size = 200 }) {
  const glyph = FIGURES[figureKey] || FIGURES.catCow;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      {glyph}
    </svg>
  );
}
