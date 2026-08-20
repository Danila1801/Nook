import { useEffect, useId, useMemo, useState } from 'react';
import './Orb.css';

/**
 * Orb — the living presence at the center of Nook.
 *
 * Backward compatible with the old flat-gradient circle: <Orb size mode />
 * still renders correctly with no other props. New optional props let a
 * ritual screen synchronize the orb to an actual breath cycle.
 *
 * @param {number} size - pixel size of the square bounding box (default 112)
 * @param {'light'|'dark'} mode - color scheme (default 'light')
 * @param {'inhale'|'hold'|'exhale'|'holdEmpty'|null} phase - current breath
 *   phase. When provided, the concentric rings are driven precisely by
 *   `progress` instead of looping on an ambient timer.
 * @param {number} progress - 0..1, how far through the current `phase` we are.
 * @param {number} intensity - 0..1, overall amplitude of motion + glow.
 * @param {boolean} paused - force all animation off (also auto-pauses when
 *   the tab is hidden, regardless of this prop).
 */
export default function Orb({
  size = 112,
  mode = 'light',
  phase = null,
  progress = 0,
  intensity = 0.6,
  paused = false,
}) {
  const rawId = useId();
  const uid = rawId.replace(/[:]/g, '');
  const id = (name) => `orb-${uid}-${name}`;

  const isDark = mode === 'dark';
  const clampedIntensity = Math.min(1, Math.max(0, intensity));
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const controlled = phase === 'inhale' || phase === 'exhale' || phase === 'hold' || phase === 'holdEmpty';

  const [tabHidden, setTabHidden] = useState(
    typeof document !== 'undefined' ? document.hidden : false
  );

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const isPaused = paused || tabHidden;

  const rings = useMemo(() => {
    if (!controlled) return [null, null, null];
    return [0, 1, 2].map((index) => getRingState(phase, clampedProgress, index, clampedIntensity));
  }, [controlled, phase, clampedProgress, clampedIntensity]);

  const rootStyle = {
    '--orb-size': `${size}px`,
    '--orb-intensity': clampedIntensity,
  };

  const clipId = id('clip');

  return (
    <div
      className={`orb orb--${isDark ? 'dark' : 'light'}${isPaused ? ' orb--paused' : ''}`}
      style={rootStyle}
      aria-hidden="true"
    >
      <span className="orb-halo" />
      <svg
        className="orb-svg"
        width={size}
        height={size}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
      >
        <defs>
          <clipPath id={clipId}>
            <circle cx="100" cy="100" r="87" />
          </clipPath>

          {/* Both modes are centered now — no offset "light source" cue, no
              terminator. First cut of this fix just centered the old
              sage-soft -> sage -> sage-deep -> ink-deep stops in place and
              that wasn't enough: a circle with a centered light-to-dark
              radial gradient is *the* standard flat-design trick for faking
              a shaded sphere (limb darkening reads as "ball" even with
              perfectly even, ambient lighting — see a beginner "how to
              shade a circle into a 3D ball" tutorial, or for that matter a
              photo of an actual planet). Removing the off-axis highlight
              wasn't enough while that value ramp was still doing the same
              job the highlight used to do. So the dark stops below now stay
              in a narrow, mid-to-light value band (sage-soft <-> sage only —
              never reaching sage-deep or ink-deep) with a gentle *alpha*
              taper at the very edge instead: density thinning into the halo,
              not a lightness ramp implying a lit surface. The "volume" read
              now comes from the halo (external, unchanged) and the drifting
              blobs (interior, unchanged), not from the body fill's own
              shading. Light mode stays centered and low-contrast, just
              denser than the previous pass so it doesn't dissolve into the
              paper. */}
          <radialGradient
            id={id('body')}
            cx="50%"
            cy="50%"
            r={isDark ? '80%' : '70%'}
          >
            {isDark ? (
              <>
                <stop offset="0%" stopColor="var(--orb-sage-soft)" stopOpacity="0.82" />
                <stop offset="55%" stopColor="var(--orb-sage)" stopOpacity="0.8" />
                <stop offset="80%" stopColor="var(--orb-sage)" stopOpacity="0.6" />
                <stop offset="100%" stopColor="var(--orb-sage)" stopOpacity="0.16" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="var(--orb-sage-soft)" stopOpacity="0.58" />
                <stop offset="55%" stopColor="var(--orb-sage-soft)" stopOpacity="0.68" />
                <stop offset="100%" stopColor="var(--orb-sage)" stopOpacity="0.8" />
              </>
            )}
          </radialGradient>

          <radialGradient id={id('blobAmber')} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--orb-amber)" stopOpacity={isDark ? 0.55 : 0.74} />
            <stop offset="100%" stopColor="var(--orb-amber)" stopOpacity="0" />
          </radialGradient>

          {/* Sage blob: dark keeps its original single-hue falloff (untouched
              — it already read well). Light mode gets a second, deeper stop
              (--orb-sage instead of --orb-sage-soft at the core) so the blob
              has real color depth instead of one flat hue thinning out —
              part of giving light mode more presence without adding an
              object cue. */}
          <radialGradient id={id('blobSage')} cx="50%" cy="50%" r="50%">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="var(--orb-sage-soft)" stopOpacity="0.6" />
                <stop offset="100%" stopColor="var(--orb-sage-soft)" stopOpacity="0" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="var(--orb-sage)" stopOpacity="0.72" />
                <stop offset="62%" stopColor="var(--orb-sage-soft)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="var(--orb-sage-soft)" stopOpacity="0" />
              </>
            )}
          </radialGradient>

          <radialGradient id={id('blobTerra')} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--orb-terracotta)" stopOpacity={isDark ? 0.4 : 0.62} />
            <stop offset="100%" stopColor="var(--orb-terracotta)" stopOpacity="0" />
          </radialGradient>

          {/* Rim glow's color, not a caustic gradient anymore — see the
              rim-bleed filter and the rim element below for why the caustic
              (a defined point highlight — the clearest "lit sphere" cue of
              all) was removed outright instead of adjusted. Tinted the same
              sage-soft as the halo rather than white: a bright *white* glint
              is how a renderer signals "glass catching a light source";
              ambient light bleeding through a colored lantern picks up the
              lantern's own hue instead. */}
          <linearGradient id={id('rim')} x1="15%" y1="0%" x2="75%" y2="85%">
            <stop offset="0%" stopColor="var(--orb-sage-soft)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--orb-sage-soft)" stopOpacity="0" />
          </linearGradient>

          {/* Baked, static turbulence: displaces the body edge into an organic,
              non-circular wobble. Never animated itself — see Orb.variants.md.
              Light mode pushes this harder and blurs the result: the edge
              should read as indeterminate, closer to breath fogging glass
              than a crisp vector boundary. Dark mode's wobble+blur used to be
              much tighter, on the theory that softness would look muddy
              against near-black — true for the *edge itself*, but that same
              tightness was also part of why dark mode read as an object with
              a locatable surface. Loosened enough that you can't quite say
              where the boundary is, while staying crisper than light mode
              since it's read against much higher contrast. */}
          <filter id={id('edgeWobble')} x="-55%" y="-55%" width="210%" height="210%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={isDark ? '0.006 0.009' : '0.009 0.014'}
              numOctaves="2"
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={isDark ? 20 : 12}
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feGaussianBlur in="displaced" stdDeviation={isDark ? 4.4 : 1.8} />
          </filter>

          {/* Same turbulence family as edgeWobble, applied to the rim glow
              (below) with a heavier blur. The point is that the rim's bright
              patch shares the body's own uneven, blurred boundary instead of
              drawing a second, crisper, perfect-circle edge on top of it —
              that mismatch (soft indeterminate body + a hard-edged bright arc
              stacked on it) was what made the old rim read as an independent
              specular highlight rather than part of the same glow. */}
          <filter id={id('rimBleed')} x="-60%" y="-60%" width="220%" height="220%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.02"
              numOctaves="2"
              seed="11"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="10"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feGaussianBlur in="displaced" stdDeviation="3.6" />
          </filter>

          {/* Baked grain texture, painted once, never re-evaluated per frame. */}
          <filter id={id('grain')} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="2"
              seed="3"
              stitchTiles="stitch"
              result="grainNoise"
            />
            <feColorMatrix
              in="grainNoise"
              type="matrix"
              values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0"
            />
          </filter>
        </defs>

        {/* Concentric breathing rings — ambient loop by default, precisely
            driven by phase/progress when the caller opts in. */}
        <g className="orb-rings">
          {[0, 1, 2].map((index) => (
            <circle
              key={index}
              className={`orb-ring orb-ring-${index + 1}${controlled ? ' orb-ring--controlled' : ' orb-ring--ambient'}`}
              cx="100"
              cy="100"
              r="92"
              fill="none"
              stroke="var(--orb-sage-soft)"
              strokeWidth="1"
              style={
                controlled && rings[index]
                  ? { transform: rings[index].transform, opacity: rings[index].opacity }
                  : undefined
              }
            />
          ))}
        </g>

        {/* The body: baked edge wobble on a slowly rotating/breathing group. */}
        <g className="orb-body-wrap">
          <circle
            className="orb-body"
            cx="100"
            cy="100"
            r="90"
            fill={`url(#${id('body')})`}
            filter={`url(#${id('edgeWobble')})`}
          />
        </g>

        {/* Interior light — parallax blobs drifting at different speeds,
            clipped so they read as light moving inside the sphere. This is
            the primary read in light mode: colour moving under a surface,
            not a lit ball, so the blobs are large enough to overlap and
            blended with the surface rather than stacked on top of it. */}
        <g clipPath={`url(#${clipId})`} className={isDark ? undefined : 'orb-interior--soft'}>
          <g className="orb-blob orb-blob-1">
            <ellipse cx="130" cy="76" rx={isDark ? 46 : 60} ry={isDark ? 40 : 52} fill={`url(#${id('blobAmber')})`} />
          </g>
          <g className="orb-blob orb-blob-2">
            <ellipse cx="126" cy="120" rx={isDark ? 50 : 64} ry={isDark ? 44 : 56} fill={`url(#${id('blobSage')})`} />
          </g>
          <g className="orb-blob orb-blob-3">
            <ellipse cx="96" cy="138" rx={isDark ? 44 : 58} ry={isDark ? 34 : 46} fill={`url(#${id('blobTerra')})`} />
          </g>
          {/* Grain, baked once, gently shimmering via opacity only. */}
          <rect
            className="orb-grain"
            x="13"
            y="13"
            width="174"
            height="174"
            filter={`url(#${id('grain')})`}
          />
        </g>

        {/* Rim glow — kept from the earlier pass, but reworked, not just
            carried over. It used to be a crisp, bright-white specular arc:
            the single clearest "glass sphere" cue left once the caustic and
            the terminator were gone. Now it's wide, low-opacity, tinted
            sage-soft instead of white, and run through the rimBleed filter
            (same turbulence family as the body's edge, heavier blur) so the
            brighter patch reads as light bleeding through an uneven boundary
            that slowly drifts, not a reflection sliding across a defined
            surface. Dark-mode only, same as before — light mode has no
            analogous element. */}
        {isDark && (
          <g className="orb-rim-spin">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke={`url(#${id('rim')})`}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="150 430"
              filter={`url(#${id('rimBleed')})`}
            />
          </g>
        )}
      </svg>
    </div>
  );
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function getRingState(phase, progress, index, intensity) {
  const stagger = index * 0.16;
  const span = 1 - stagger || 1;
  const local = Math.min(1, Math.max(0, (progress - stagger) / span));
  const eased = easeInOut(local);
  const amp = 0.14 + intensity * 0.12;
  const peakOpacity = 0.2 + intensity * 0.22;

  if (phase === 'inhale') {
    return {
      transform: `scale(${(1 + eased * amp).toFixed(4)})`,
      opacity: Number((Math.sin(eased * Math.PI) * peakOpacity).toFixed(3)),
    };
  }
  if (phase === 'exhale') {
    return {
      transform: `scale(${(1 + amp - eased * amp).toFixed(4)})`,
      opacity: Number((Math.sin(eased * Math.PI) * peakOpacity).toFixed(3)),
    };
  }
  if (phase === 'hold') {
    return { transform: `scale(${(1 + amp).toFixed(4)})`, opacity: Number((0.08 + intensity * 0.06).toFixed(3)) };
  }
  // holdEmpty
  return { transform: 'scale(1)', opacity: Number((0.05 + intensity * 0.04).toFixed(3)) };
}
