// Nook — micro-rituals of self-care
// Warm wellness: cream paper, terracotta, sage green, deep forest ink.
// Type: Fraktion-ish via system serif + Inter for UI.

const nookTokens = {
  bg: '#F4EEE3',          // warm cream
  bg2: '#EBE3D3',
  surface: '#FFFFFF',
  ink: '#2A2A24',         // near-black with warmth
  ink2: '#5B5950',
  ink3: '#8E8A7C',
  terracotta: '#C46B4A',
  sage: '#7A8C6E',
  sageSoft: '#D6DECC',
  clay: '#E8D4BE',
  sun: '#E8B557',
  serif: "'Instrument Serif', 'Cormorant Garamond', Georgia, serif",
  sans: "'Inter', -apple-system, system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
};

function NookScreen({ children, dark = false }) {
  const t = nookTokens;
  return (
    <div style={{
      width: 390, height: 844, position: 'relative',
      background: dark ? '#1F1C15' : t.bg,
      borderRadius: 48, overflow: 'hidden',
      fontFamily: t.sans, color: dark ? '#EEE6D3' : t.ink,
      boxShadow: '0 30px 60px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.08)',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 54,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 28px 0', zIndex: 10,
        fontSize: 15, fontWeight: 600,
        color: dark ? '#EEE6D3' : t.ink,
      }}>
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>9:41</span>
        <div style={{
          position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
          width: 126, height: 37, borderRadius: 24, background: '#000',
        }} />
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

function NookToday() {
  const t = nookTokens;
  const rituals = [
    { time: '09:30', title: 'Ease into the day', kind: 'Breath', dur: '2 min', icon: 'breath', done: true },
    { time: '11:15', title: 'Shoulders & neck', kind: 'Stretch', dur: '4 min', icon: 'stretch', done: true },
    { time: '13:00', title: 'Look far away', kind: 'Eyes', dur: '1 min', icon: 'eye', done: true },
    { time: '14:45', title: 'Walk & water', kind: 'Move', dur: '5 min', icon: 'walk', now: true },
    { time: '16:30', title: 'Hip opener', kind: 'Stretch', dur: '6 min', icon: 'stretch' },
    { time: '18:00', title: 'Wind down breath', kind: 'Breath', dur: '3 min', icon: 'breath' },
  ];
  return (
    <NookScreen>
      <div style={{ padding: '72px 28px 0' }}>
        <div style={{ fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase',
          color: t.ink3, fontWeight: 500, marginBottom: 8 }}>
          Sunday · April 19
        </div>
        <div style={{
          fontFamily: t.serif, fontSize: 44, lineHeight: 1.05,
          color: t.ink, letterSpacing: -0.5, fontWeight: 400,
        }}>
          A soft day.<br/>
          <span style={{ color: t.terracotta, fontStyle: 'italic' }}>Six small pauses.</span>
        </div>
      </div>

      <div style={{ padding: '28px 28px 16px', display: 'flex', gap: 16, alignItems: 'center' }}>
        <div style={{
          width: 96, height: 96, borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, ${t.clay}, ${t.terracotta})`,
          position: 'relative', flexShrink: 0,
          boxShadow: '0 8px 24px rgba(196,107,74,0.3)',
        }}>
          <div style={{ position: 'absolute', inset: 8, borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.4)' }} />
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            fontFamily: t.serif, fontSize: 18, color: '#fff', fontStyle: 'italic',
          }}>now</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
            color: t.terracotta, fontWeight: 600, marginBottom: 4 }}>Up next · in 18 min</div>
          <div style={{ fontFamily: t.serif, fontSize: 22, lineHeight: 1.2, color: t.ink }}>
            Walk & water
          </div>
          <div style={{ fontSize: 13, color: t.ink2, marginTop: 2 }}>
            Stand up, refill, 20 steps.
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', top: 340, left: 0, right: 0, bottom: 92,
        overflow: 'hidden', padding: '12px 20px 0' }}>
        <div style={{ padding: '0 8px', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
          color: t.ink3, fontWeight: 600, marginBottom: 10 }}>
          Today's rituals
        </div>
        {rituals.map((r, i) => <NookRitualRow key={i} {...r} />)}
      </div>

      <NookTabBar active={0} />
    </NookScreen>
  );
}

function NookRitualRow({ time, title, kind, dur, icon, done, now }) {
  const t = nookTokens;
  const iconMap = { breath: <BreathGlyph/>, stretch: <StretchGlyph/>,
    eye: <EyeGlyph/>, walk: <WalkGlyph/> };
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '10px 8px', opacity: done ? 0.5 : 1,
    }}>
      <div style={{
        width: 42, height: 42, borderRadius: 12,
        background: now ? t.terracotta : (done ? t.sageSoft : t.surface),
        border: now ? 'none' : `1px solid ${done ? 'transparent' : 'rgba(0,0,0,0.08)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: now ? '#fff' : (done ? t.sage : t.ink2),
      }}>
        {done ? <CheckGlyph/> : iconMap[icon]}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 500, color: t.ink,
          textDecoration: done ? 'line-through' : 'none',
          textDecorationColor: t.ink3, textDecorationThickness: 1 }}>
          {title}
        </div>
        <div style={{ fontSize: 12, color: t.ink3, marginTop: 1 }}>
          {kind} · {dur}
        </div>
      </div>
      <div style={{
        fontFamily: t.serif, fontSize: 16, color: now ? t.terracotta : t.ink3,
        fontStyle: now ? 'italic' : 'normal', fontVariantNumeric: 'tabular-nums',
      }}>{time}</div>
    </div>
  );
}

function NookRitual() {
  const t = nookTokens;
  return (
    <NookScreen dark>
      <div style={{ padding: '72px 28px 0', color: '#EEE6D3' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>×</div>
          <div style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase',
            color: 'rgba(238,230,211,0.6)' }}>Breath · 2 min</div>
          <div style={{ width: 32 }} />
        </div>

        <div style={{
          fontFamily: t.serif, fontSize: 32, lineHeight: 1.15,
          marginTop: 32, fontWeight: 400, letterSpacing: -0.3,
        }}>
          Breathe in for four.<br/>
          <span style={{ fontStyle: 'italic', color: '#E8B557' }}>Hold for seven.</span><br/>
          Out for eight.
        </div>
      </div>

      <div style={{
        position: 'absolute', top: 320, left: '50%', transform: 'translateX(-50%)',
        width: 280, height: 280,
      }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, rgba(232,181,87,0.5), rgba(196,107,74,0.2))`,
          animation: 'nookBreath 19s ease-in-out infinite',
        }} />
        <div style={{ position: 'absolute', inset: 30, borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.2)' }} />
        <div style={{ position: 'absolute', inset: 60, borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.15)' }} />
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          textAlign: 'center', color: '#EEE6D3',
        }}>
          <div style={{ fontFamily: t.serif, fontSize: 48, fontStyle: 'italic' }}>in</div>
          <div style={{ fontSize: 13, letterSpacing: 2, opacity: 0.6, marginTop: 4 }}>4 · 7 · 8</div>
        </div>
      </div>
      <style>{`@keyframes nookBreath {
        0%, 100% { transform: scale(0.7); }
        21%, 58% { transform: scale(1); }
      }`}</style>

      <div style={{
        position: 'absolute', bottom: 50, left: 28, right: 28,
        display: 'flex', gap: 12, alignItems: 'center',
      }}>
        <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.15)',
          borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ width: '32%', height: '100%', background: '#E8B557' }}/>
        </div>
        <div style={{ fontFamily: t.mono, fontSize: 12, color: 'rgba(238,230,211,0.6)',
          fontVariantNumeric: 'tabular-nums' }}>0:38 / 2:00</div>
      </div>
    </NookScreen>
  );
}

function NookLibrary() {
  const t = nookTokens;
  const cats = [
    { name: 'Breath', count: 8, tint: t.terracotta, desc: '1–5 min · reset the nervous system' },
    { name: 'Stretch', count: 14, tint: t.sage, desc: '2–8 min · for neck, hips, back' },
    { name: 'Eyes', count: 4, tint: t.sun, desc: '30s–2 min · relieve screen fatigue' },
    { name: 'Move', count: 9, tint: '#8B6FB8', desc: '3–10 min · walk, water, light cardio' },
    { name: 'Mind', count: 6, tint: '#6B8CB8', desc: '2–5 min · attention, gratitude' },
  ];
  return (
    <NookScreen>
      <div style={{ padding: '72px 28px 18px' }}>
        <div style={{ fontFamily: t.serif, fontSize: 40, lineHeight: 1.1, letterSpacing: -0.5 }}>
          A library<br/>
          <span style={{ fontStyle: 'italic', color: t.terracotta }}>of small pauses.</span>
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        {cats.map((c, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 16,
            padding: '18px 12px', borderBottom: `1px solid ${t.bg2}`,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 18,
              background: c.tint, flexShrink: 0, position: 'relative',
              boxShadow: `0 6px 18px ${c.tint}33`,
            }}>
              <div style={{ position: 'absolute', inset: 4, borderRadius: 14,
                border: '1px solid rgba(255,255,255,0.25)' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: t.serif, fontSize: 24, lineHeight: 1,
                color: t.ink, letterSpacing: -0.3 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: t.ink3, marginTop: 4 }}>{c.desc}</div>
            </div>
            <div style={{ fontFamily: t.mono, fontSize: 13, color: t.ink3 }}>{c.count}</div>
          </div>
        ))}
      </div>

      <NookTabBar active={1} />
    </NookScreen>
  );
}

function NookTabBar({ active = 0 }) {
  const t = nookTokens;
  const items = [
    { label: 'Today', glyph: <SunGlyph/> },
    { label: 'Library', glyph: <LibGlyph/> },
    { label: 'You', glyph: <YouGlyph/> },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 92,
      background: 'rgba(244,238,227,0.9)', backdropFilter: 'blur(20px)',
      borderTop: `1px solid ${t.bg2}`,
      display: 'flex', padding: '12px 20px 30px',
    }}>
      {items.map((it, i) => (
        <div key={i} style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
          color: i === active ? t.terracotta : t.ink3,
        }}>
          {it.glyph}
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: 0.3 }}>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

function BreathGlyph() { return (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1.4"/>
    <circle cx="10" cy="10" r="2" fill="currentColor"/>
  </svg>
);}
function StretchGlyph() { return (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M4 10 Q10 4, 16 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <circle cx="4" cy="10" r="1.5" fill="currentColor"/>
    <circle cx="16" cy="10" r="1.5" fill="currentColor"/>
  </svg>
);}
function EyeGlyph() { return (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M2 10 Q10 4, 18 10 Q10 16, 2 10Z" stroke="currentColor" strokeWidth="1.4"/>
    <circle cx="10" cy="10" r="2" fill="currentColor"/>
  </svg>
);}
function WalkGlyph() { return (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="11" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M8 17 L11 11 L14 14 L14 17 M11 11 L14 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);}
function CheckGlyph() { return (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);}
function SunGlyph() { return (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="11" r="4" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M11 2v2M11 18v2M2 11h2M18 11h2M4.5 4.5l1.4 1.4M16.1 16.1l1.4 1.4M4.5 17.5l1.4-1.4M16.1 5.9l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);}
function LibGlyph() { return (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <rect x="3" y="4" width="4" height="14" stroke="currentColor" strokeWidth="1.5" rx="1"/>
    <rect x="9" y="4" width="4" height="14" stroke="currentColor" strokeWidth="1.5" rx="1"/>
    <rect x="15" y="6" width="4" height="12" stroke="currentColor" strokeWidth="1.5" rx="1" transform="rotate(-8 17 12)"/>
  </svg>
);}
function YouGlyph() { return (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M4 19c0-3.5 3-6 7-6s7 2.5 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);}

Object.assign(window, { NookToday, NookRitual, NookLibrary });
