// Poise — wellbeing journal with gentle analytics
// Analytical, soft-clinical: off-white with slate ink, one muted plum accent.
// Feels like Oura / Gentler Streak. Data-forward but kind.

const poiseTokens = {
  bg: '#F5F4F0',
  surface: '#FFFFFF',
  ink: '#1B1D24',
  ink2: '#55596A',
  ink3: '#9094A3',
  line: 'rgba(27,29,36,0.08)',
  plum: '#6F4C7A',
  plumSoft: '#EADEF0',
  mint: '#6FB39A',
  amber: '#D49A3A',
  coral: '#D4756B',
  sans: "'Inter', -apple-system, system-ui, sans-serif",
  serif: "'Fraunces', 'Cormorant Garamond', Georgia, serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
};

function PoiseScreen({ children, dark = false }) {
  const t = poiseTokens;
  return (
    <div style={{
      width: 390, height: 844, position: 'relative',
      background: dark ? '#15161C' : t.bg,
      borderRadius: 48, overflow: 'hidden',
      fontFamily: t.sans, color: dark ? '#EDEEF2' : t.ink,
      boxShadow: '0 30px 60px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.08)',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 54,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 28px 0', zIndex: 10,
        fontSize: 15, fontWeight: 600,
        color: dark ? '#EDEEF2' : t.ink,
      }}>
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>9:41</span>
        <div style={{ position: 'absolute', top: 11, left: '50%',
          transform: 'translateX(-50%)', width: 126, height: 37, borderRadius: 24,
          background: '#000' }} />
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

// Main — daily check-in + poise score
function PoiseHome() {
  const t = poiseTokens;
  const metrics = [
    { label: 'Neck', val: 2, scale: 5, color: t.coral, note: 'tight' },
    { label: 'Back', val: 3, scale: 5, color: t.amber, note: 'ok' },
    { label: 'Energy', val: 4, scale: 5, color: t.mint, note: 'good' },
    { label: 'Focus', val: 4, scale: 5, color: t.mint, note: 'steady' },
  ];
  return (
    <PoiseScreen>
      <div style={{ padding: '70px 28px 0' }}>
        <div style={{ fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase',
          color: t.ink3, fontWeight: 600 }}>Sunday · April 19 · 14:30</div>
        <div style={{ fontFamily: t.serif, fontSize: 34, lineHeight: 1.1,
          letterSpacing: -0.8, marginTop: 8, fontWeight: 400 }}>
          How is your body<br/>right now?
        </div>
      </div>

      {/* Poise score ring */}
      <div style={{ padding: '24px 28px', display: 'flex', gap: 18, alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 104, height: 104 }}>
          <svg width="104" height="104" viewBox="0 0 104 104">
            <circle cx="52" cy="52" r="46" stroke={t.plumSoft} strokeWidth="8" fill="none"/>
            <circle cx="52" cy="52" r="46" stroke={t.plum} strokeWidth="8" fill="none"
              strokeDasharray="289.0" strokeDashoffset="101.2" strokeLinecap="round"
              transform="rotate(-90 52 52)"/>
          </svg>
          <div style={{ position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
            <div style={{ fontFamily: t.serif, fontSize: 34, fontWeight: 500,
              color: t.ink, lineHeight: 1 }}>65</div>
            <div style={{ fontSize: 10, color: t.ink3, letterSpacing: 1.5,
              textTransform: 'uppercase', marginTop: 1 }}>poise</div>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: t.ink, marginBottom: 3 }}>
            Fair · trending down
          </div>
          <div style={{ fontSize: 13, color: t.ink2, lineHeight: 1.4 }}>
            Your neck tension is higher than usual for a Sunday afternoon.
            A 4-minute stretch would help.
          </div>
        </div>
      </div>

      {/* Four-quadrant check-in */}
      <div style={{ padding: '8px 28px' }}>
        <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
          color: t.ink3, fontWeight: 600, marginBottom: 10 }}>Check-in · last at 11:00</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {metrics.map((m, i) => (
            <div key={i} style={{
              background: t.surface, borderRadius: 14, padding: '14px 16px',
              border: `1px solid ${t.line}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.ink }}>{m.label}</div>
                <div style={{ fontSize: 11, color: m.color, fontWeight: 600 }}>{m.note}</div>
              </div>
              <div style={{ display: 'flex', gap: 3, marginTop: 10 }}>
                {Array.from({length: m.scale}).map((_, k) => (
                  <div key={k} style={{
                    flex: 1, height: 5, borderRadius: 3,
                    background: k < m.val ? m.color : t.line,
                  }}/>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended pause */}
      <div style={{ padding: '14px 28px 0' }}>
        <div style={{
          background: t.plum, borderRadius: 18, padding: '18px 20px',
          color: '#fff', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
            opacity: 0.7, fontWeight: 600 }}>Recommended for you · 4 min</div>
          <div style={{ fontFamily: t.serif, fontSize: 24, marginTop: 6, lineHeight: 1.15,
            fontWeight: 400 }}>
            Upper back & neck release
          </div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 6, lineHeight: 1.4 }}>
            Chosen because neck tension is ≥ 2 of 5 and you've been sitting 1h 40m.
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button style={{
              padding: '10px 16px', borderRadius: 10, border: 'none',
              background: '#fff', color: t.plum, fontSize: 13, fontWeight: 600,
              fontFamily: t.sans, cursor: 'pointer',
            }}>Start →</button>
            <button style={{
              padding: '10px 14px', borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.3)', background: 'transparent',
              color: '#fff', fontSize: 13, fontWeight: 500,
              fontFamily: t.sans, cursor: 'pointer',
            }}>Not now</button>
          </div>
        </div>
      </div>

      <PoiseTabBar active={0} />
    </PoiseScreen>
  );
}

// Trends — insight view
function PoiseTrends() {
  const t = poiseTokens;
  const days = [62, 48, 71, 55, 42, 68, 65];
  const labels = ['M','T','W','T','F','S','S'];
  return (
    <PoiseScreen>
      <div style={{ padding: '70px 28px 0' }}>
        <div style={{ fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase',
          color: t.ink3, fontWeight: 600 }}>Week of April 13</div>
        <div style={{ fontFamily: t.serif, fontSize: 34, lineHeight: 1.1,
          letterSpacing: -0.8, marginTop: 8, fontWeight: 400 }}>
          You feel worse<br/>
          <span style={{ fontStyle: 'italic', color: t.plum }}>on Thursdays.</span>
        </div>
        <div style={{ fontSize: 13, color: t.ink2, marginTop: 10, lineHeight: 1.5 }}>
          Your poise score averaged 42 on Thursdays this month — the lowest of any day.
          It correlates with long afternoon meetings.
        </div>
      </div>

      {/* Bar chart */}
      <div style={{ padding: '28px 28px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 160 }}>
          {days.map((v, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 8 }}>
              <div style={{ fontFamily: t.mono, fontSize: 11, color: t.ink3,
                fontVariantNumeric: 'tabular-nums' }}>{v}</div>
              <div style={{
                width: '100%', height: v * 1.4, borderRadius: 6,
                background: i === 4 ? t.coral : (i === 6 ? t.plum : t.plumSoft),
                border: i === 6 ? 'none' : 'none',
                position: 'relative',
              }}>
                {i === 6 && <div style={{
                  position: 'absolute', inset: 0, borderRadius: 6,
                  border: `2px solid ${t.ink}`,
                }}/>}
              </div>
              <div style={{ fontSize: 11, color: i === 6 ? t.ink : t.ink3,
                fontWeight: i === 6 ? 700 : 500 }}>{labels[i]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Insight cards */}
      <div style={{ padding: '24px 28px 0' }}>
        <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
          color: t.ink3, fontWeight: 600, marginBottom: 10 }}>Patterns we noticed</div>
        <InsightCard
          title="Long calls tighten your neck"
          body="On days with 3+ video calls, neck tension averages 3.8 vs 2.1 otherwise."
          tag="STRONG" color={t.coral} />
        <InsightCard
          title="Morning walks help focus"
          body="When you log a morning walk, focus score is +28% for the whole day."
          tag="HELPFUL" color={t.mint} />
        <InsightCard
          title="You skip breaks after 16:00"
          body="Only 34% of scheduled afternoon pauses get done."
          tag="HABIT" color={t.amber} />
      </div>

      <PoiseTabBar active={1} />
    </PoiseScreen>
  );
}

function InsightCard({ title, body, tag, color }) {
  const t = poiseTokens;
  return (
    <div style={{
      background: t.surface, borderRadius: 14, padding: '14px 16px',
      border: `1px solid ${t.line}`, marginBottom: 8,
    }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 9, letterSpacing: 1.5, fontWeight: 700,
          padding: '3px 7px', borderRadius: 4, background: color, color: '#fff' }}>{tag}</span>
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: t.ink, marginBottom: 3 }}>{title}</div>
      <div style={{ fontSize: 12, color: t.ink2, lineHeight: 1.4 }}>{body}</div>
    </div>
  );
}

// Journal — check-in form
function PoiseCheckin() {
  const t = poiseTokens;
  const scales = [
    { label: 'Neck & shoulders', low: 'tight', high: 'loose', val: 2 },
    { label: 'Lower back', low: 'sore', high: 'easy', val: 3 },
    { label: 'Eyes', low: 'strained', high: 'rested', val: 2 },
    { label: 'Energy', low: 'low', high: 'bright', val: 4 },
    { label: 'Mood', low: 'heavy', high: 'light', val: 4 },
  ];
  return (
    <PoiseScreen>
      <div style={{ padding: '70px 28px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 13, color: t.plum, fontWeight: 600 }}>← Back</div>
          <div style={{ fontSize: 12, letterSpacing: 1.5, color: t.ink3 }}>2/3</div>
        </div>
        <div style={{ fontFamily: t.serif, fontSize: 30, lineHeight: 1.15,
          letterSpacing: -0.6, marginTop: 24, fontWeight: 400 }}>
          A quick<br/>body scan.
        </div>
        <div style={{ fontSize: 13, color: t.ink2, marginTop: 8, lineHeight: 1.4 }}>
          Takes about 30 seconds. No wrong answers.
        </div>
      </div>

      <div style={{ padding: '28px 28px 0' }}>
        {scales.map((s, i) => (
          <div key={i} style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between',
              alignItems: 'baseline', marginBottom: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: t.ink }}>{s.label}</div>
              <div style={{ fontSize: 11, color: t.ink3 }}>{s.low} ↔ {s.high}</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[1,2,3,4,5].map(n => (
                <div key={n} style={{
                  flex: 1, height: 36, borderRadius: 10,
                  background: n === s.val ? t.plum : t.surface,
                  color: n === s.val ? '#fff' : t.ink3,
                  border: n === s.val ? 'none' : `1px solid ${t.line}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 600,
                  fontFamily: t.mono, fontVariantNumeric: 'tabular-nums',
                }}>{n}</div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: 120, left: 28, right: 28 }}>
        <button style={{
          width: '100%', height: 54, borderRadius: 14, border: 'none',
          background: t.ink, color: '#fff',
          fontSize: 15, fontWeight: 600, fontFamily: t.sans, cursor: 'pointer',
        }}>Continue →</button>
      </div>

      <PoiseTabBar active={2} />
    </PoiseScreen>
  );
}

function PoiseTabBar({ active = 0 }) {
  const t = poiseTokens;
  const items = [
    { label: 'Today', glyph: <PHomeGlyph/> },
    { label: 'Trends', glyph: <PTrendGlyph/> },
    { label: 'Journal', glyph: <PJournalGlyph/> },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 92,
      background: 'rgba(245,244,240,0.9)', backdropFilter: 'blur(20px)',
      borderTop: `1px solid ${t.line}`,
      display: 'flex', padding: '12px 20px 30px',
    }}>
      {items.map((it, i) => (
        <div key={i} style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
          color: i === active ? t.plum : t.ink3,
        }}>
          {it.glyph}
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: 0.3 }}>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

function PHomeGlyph() { return (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.6"/>
    <circle cx="11" cy="11" r="3" stroke="currentColor" strokeWidth="1.6"/>
  </svg>
);}
function PTrendGlyph() { return (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M3 16 L8 11 L12 14 L19 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 5H19V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);}
function PJournalGlyph() { return (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <rect x="4" y="3" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M7 8h8M7 11h8M7 14h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);}

Object.assign(window, { PoiseHome, PoiseTrends, PoiseCheckin });
