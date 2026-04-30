// Tide — Pomodoro for the body
// Minimalist utility: near-black ink, off-white paper, one deep-blue accent.
// Feels like Things / Cal.com / Linear. Tabular numerics dominate.

const tideTokens = {
  bg: '#FAFAF7',
  surface: '#FFFFFF',
  ink: '#0E0E0C',
  ink2: '#52524D',
  ink3: '#9A9A92',
  line: 'rgba(14,14,12,0.08)',
  accent: '#1E5AE8',
  accentSoft: '#E8EEFE',
  rest: '#2D8F6F',
  sans: "'Inter', -apple-system, system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
};

function TideScreen({ children, dark = false }) {
  const t = tideTokens;
  return (
    <div style={{
      width: 390, height: 844, position: 'relative',
      background: dark ? '#0E0E0C' : t.bg,
      borderRadius: 48, overflow: 'hidden',
      fontFamily: t.sans, color: dark ? '#F5F5F0' : t.ink,
      boxShadow: '0 30px 60px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.08)',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 54,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 28px 0', zIndex: 10,
        fontSize: 15, fontWeight: 600,
        color: dark ? '#F5F5F0' : t.ink,
      }}>
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>9:41</span>
        <div style={{ position: 'absolute', top: 11, left: '50%',
          transform: 'translateX(-50%)', width: 126, height: 37, borderRadius: 24,
          background: dark ? '#000' : '#000' }} />
        <span style={{ fontSize: 12, letterSpacing: 1 }}>•••  ▲  ▮</span>
      </div>
      {children}
      <div style={{
        position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
        width: 134, height: 5, borderRadius: 3,
        background: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)',
      }} />
    </div>
  );
}

// Main — big timer, current focus session
function TideTimer() {
  const t = tideTokens;
  return (
    <TideScreen>
      <div style={{ padding: '72px 28px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase',
            color: t.ink3, fontWeight: 600 }}>Session 3 of 6</div>
          <div style={{ display: 'flex', gap: 3 }}>
            {[1,1,1,0,0,0].map((f, i) => (
              <div key={i} style={{
                width: 18, height: 4, borderRadius: 2,
                background: f ? t.accent : t.line,
              }}/>
            ))}
          </div>
        </div>

        <div style={{
          fontSize: 15, color: t.ink2, marginTop: 26, fontWeight: 500,
        }}>Focus</div>

        {/* giant timer */}
        <div style={{
          fontFamily: t.mono, fontSize: 112, lineHeight: 1, letterSpacing: -5,
          color: t.ink, fontVariantNumeric: 'tabular-nums', fontWeight: 300,
          marginTop: 8,
        }}>
          32<span style={{ color: t.ink3 }}>:</span>14
        </div>
        <div style={{ fontSize: 14, color: t.ink3, marginTop: 4, fontFamily: t.mono }}>
          left in this session · ends 15:17
        </div>
      </div>

      {/* progress ring around "what's next" */}
      <div style={{
        position: 'absolute', top: 400, left: 28, right: 28,
        borderTop: `1px solid ${t.line}`, paddingTop: 24,
      }}>
        <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
          color: t.rest, fontWeight: 600, marginBottom: 8 }}>Next break · in 32 min</div>
        <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: -0.5, color: t.ink }}>
          Stand, shoulders, water.
        </div>
        <div style={{ fontSize: 14, color: t.ink2, marginTop: 6, lineHeight: 1.4 }}>
          A 5-minute block. Neck rolls, refill, look out a window — no screen.
        </div>
      </div>

      {/* Control bar */}
      <div style={{
        position: 'absolute', bottom: 120, left: 28, right: 28,
        display: 'flex', gap: 10,
      }}>
        <button style={{
          flex: 1, height: 56, borderRadius: 14, border: 'none',
          background: t.ink, color: '#fff',
          fontSize: 15, fontWeight: 600, fontFamily: t.sans,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          cursor: 'pointer',
        }}>
          <svg width="12" height="14" viewBox="0 0 12 14"><rect x="1" y="1" width="3" height="12" fill="#fff"/><rect x="8" y="1" width="3" height="12" fill="#fff"/></svg>
          Pause
        </button>
        <button style={{
          width: 56, height: 56, borderRadius: 14,
          border: `1px solid ${t.line}`, background: t.surface,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: t.ink2,
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M14 4L4 14M14 14L4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
        <button style={{
          width: 56, height: 56, borderRadius: 14,
          border: `1px solid ${t.line}`, background: t.surface,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: t.ink2,
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 14L14 4M14 4H8M14 4V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <TideTabBar active={0} />
    </TideScreen>
  );
}

// Break — minimal full-screen cue
function TideBreak() {
  const t = tideTokens;
  return (
    <TideScreen>
      <div style={{ padding: '72px 28px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase',
            color: t.rest, fontWeight: 600 }}>Break · 5 min</div>
          <div style={{ fontFamily: t.mono, fontSize: 13, color: t.ink3 }}>
            skip →
          </div>
        </div>

        <div style={{
          fontSize: 44, lineHeight: 1.05, letterSpacing: -1.2,
          marginTop: 40, fontWeight: 500, color: t.ink,
        }}>
          Away from the screen.
        </div>
        <div style={{ fontSize: 16, color: t.ink2, marginTop: 14, lineHeight: 1.4 }}>
          Stand up. Refill water. Roll shoulders back three times, forward three.
          Look at something at least six meters away.
        </div>
      </div>

      {/* Countdown ring */}
      <div style={{
        position: 'absolute', top: 380, left: '50%', transform: 'translateX(-50%)',
      }}>
        <svg width="240" height="240" viewBox="0 0 240 240">
          <circle cx="120" cy="120" r="112" stroke={t.line} strokeWidth="2" fill="none"/>
          <circle cx="120" cy="120" r="112" stroke={t.rest} strokeWidth="4" fill="none"
            strokeDasharray="703.7" strokeDashoffset="281.5"
            strokeLinecap="round" transform="rotate(-90 120 120)"/>
        </svg>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}>
          <div style={{ fontFamily: t.mono, fontSize: 68, letterSpacing: -2,
            fontWeight: 300, color: t.ink, fontVariantNumeric: 'tabular-nums' }}>3:12</div>
          <div style={{ fontSize: 12, color: t.ink3, letterSpacing: 2, textTransform: 'uppercase',
            marginTop: 6 }}>remaining</div>
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: 120, left: 28, right: 28,
        display: 'flex', gap: 8, justifyContent: 'space-between',
      }}>
        {['Stand', 'Water', 'Neck', 'Eyes', 'Shoulders'].map((c, i) => (
          <div key={i} style={{
            padding: '8px 12px', borderRadius: 20, fontSize: 12,
            background: i < 2 ? t.rest : t.surface,
            color: i < 2 ? '#fff' : t.ink2,
            border: i < 2 ? 'none' : `1px solid ${t.line}`,
            fontWeight: 500, textDecoration: i < 2 ? 'line-through' : 'none',
            textDecorationColor: 'rgba(255,255,255,0.6)',
          }}>{c}</div>
        ))}
      </div>

      <TideTabBar active={0} />
    </TideScreen>
  );
}

// Schedule — rhythm / day view
function TideRhythm() {
  const t = tideTokens;
  const blocks = [
    { start: '09:00', kind: 'focus', len: 50 },
    { start: '09:50', kind: 'break', len: 10 },
    { start: '10:00', kind: 'focus', len: 50 },
    { start: '10:50', kind: 'break', len: 10 },
    { start: '11:00', kind: 'focus', len: 50, now: true },
    { start: '11:50', kind: 'break', len: 10 },
    { start: '12:00', kind: 'focus', len: 50 },
    { start: '12:50', kind: 'lunch', len: 45 },
    { start: '13:35', kind: 'focus', len: 50 },
    { start: '14:25', kind: 'break', len: 10 },
    { start: '14:35', kind: 'focus', len: 50 },
  ];
  return (
    <TideScreen>
      <div style={{ padding: '72px 28px 20px' }}>
        <div style={{ fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase',
          color: t.ink3, fontWeight: 600 }}>Sunday · April 19</div>
        <div style={{ fontSize: 34, fontWeight: 500, letterSpacing: -0.8, marginTop: 8 }}>
          Today's rhythm
        </div>

        {/* stats row */}
        <div style={{ display: 'flex', gap: 28, marginTop: 20,
          paddingBottom: 20, borderBottom: `1px solid ${t.line}` }}>
          <Stat big="6" small="focus blocks" />
          <Stat big="5h" small="deep work" />
          <Stat big="7" small="breaks" />
          <Stat big="55m" small="away" />
        </div>
      </div>

      <div style={{
        padding: '0 28px', position: 'absolute', top: 280, left: 0, right: 0, bottom: 92,
        overflow: 'hidden',
      }}>
        {blocks.slice(0, 9).map((b, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '8px 0',
          }}>
            <div style={{
              fontFamily: t.mono, fontSize: 12, color: t.ink3,
              width: 40, fontVariantNumeric: 'tabular-nums',
            }}>{b.start}</div>
            <div style={{
              flex: 1, height: b.kind === 'focus' ? 28 : 16, borderRadius: 6,
              background: b.kind === 'focus' ? (b.now ? t.accent : t.ink)
                         : b.kind === 'lunch' ? '#E8B557' : t.accentSoft,
              opacity: b.kind === 'focus' && !b.now ? 0.85 : 1,
              position: 'relative', display: 'flex', alignItems: 'center',
              paddingLeft: 10,
              color: b.kind === 'focus' ? '#fff' : t.ink2,
              fontSize: 12, fontWeight: 500,
            }}>
              {b.now && <div style={{
                position: 'absolute', left: -4, top: '50%', transform: 'translateY(-50%)',
                width: 8, height: 8, borderRadius: 4, background: t.accent,
                boxShadow: '0 0 0 3px rgba(30,90,232,0.25)',
              }}/>}
              {b.kind === 'focus' && (b.now ? 'Now · focus' : 'Focus')}
              {b.kind === 'break' && 'Break'}
              {b.kind === 'lunch' && 'Lunch'}
            </div>
            <div style={{ fontFamily: t.mono, fontSize: 11, color: t.ink3,
              width: 26, textAlign: 'right' }}>{b.len}m</div>
          </div>
        ))}
      </div>

      <TideTabBar active={1} />
    </TideScreen>
  );
}

function Stat({ big, small }) {
  const t = tideTokens;
  return (
    <div>
      <div style={{ fontFamily: t.mono, fontSize: 28, fontWeight: 400,
        letterSpacing: -1, color: t.ink, fontVariantNumeric: 'tabular-nums' }}>{big}</div>
      <div style={{ fontSize: 11, color: t.ink3, letterSpacing: 1,
        textTransform: 'uppercase', marginTop: 2, fontWeight: 500 }}>{small}</div>
    </div>
  );
}

function TideTabBar({ active = 0 }) {
  const t = tideTokens;
  const items = [
    { label: 'Timer', glyph: <TimerGlyph/> },
    { label: 'Rhythm', glyph: <RhythmGlyph/> },
    { label: 'Settings', glyph: <SetGlyph/> },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 92,
      background: 'rgba(250,250,247,0.9)', backdropFilter: 'blur(20px)',
      borderTop: `1px solid ${t.line}`,
      display: 'flex', padding: '12px 20px 30px',
    }}>
      {items.map((it, i) => (
        <div key={i} style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
          color: i === active ? t.accent : t.ink3,
        }}>
          {it.glyph}
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: 0.3 }}>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

function TimerGlyph() { return (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="12" r="8" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M11 8v4l3 2M8 2h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);}
function RhythmGlyph() { return (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M2 11 Q6 5, 10 11 T18 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);}
function SetGlyph() { return (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="11" r="3" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M11 2v3M11 17v3M2 11h3M17 11h3M4.5 4.5l2 2M15.5 15.5l2 2M4.5 17.5l2-2M15.5 6.5l2-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);}

Object.assign(window, { TideTimer, TideBreak, TideRhythm });
