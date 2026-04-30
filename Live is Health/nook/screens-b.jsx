// Nook — screens 6-10: Library detail, Ritual (breath), Ritual (stretch), Progress, Profile/Settings

function NookLibDetail({ back, goRitual }) {
  const t = nookT;
  const items = [
    { title: 'Box breathing', dur: '2 min', desc: 'Equal in, hold, out, hold. Grounding.' },
    { title: '4-7-8 breath', dur: '2 min', desc: 'Inhale 4, hold 7, exhale 8. Calming.' },
    { title: 'Physiological sigh', dur: '1 min', desc: 'Two inhales, one long exhale.' },
    { title: 'Coherent breathing', dur: '5 min', desc: 'Slow even breathing at 6/min.' },
    { title: 'Lion breath', dur: '2 min', desc: 'Release jaw tension with a long exhale.' },
    { title: 'Alternate nostril', dur: '4 min', desc: 'Balance the nervous system.' },
  ];
  return (
    <NookFrame>
      <NookHeader back={back} over="Category · Breath"
        title="Breath" titleItal="pauses." />
      <div style={{ fontSize: 14, color: t.ink2, padding: '10px 28px 0', lineHeight: 1.5 }}>
        Eight short guided breaths. Use any of them when you notice your shoulders rising.
      </div>
      <div style={{ padding: '20px 20px 0' }}>
        {items.map((it, i) => (
          <div key={i} onClick={(e) => { e.stopPropagation(); goRitual(); }}
            style={{
              background: t.surface, borderRadius: 14, padding: '14px 16px',
              border: `1px solid ${t.bg2}`, marginBottom: 8, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
            <div style={{ width: 40, height: 40, borderRadius: 12,
              background: t.bg, display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: t.terracotta }}>
              <NookKindGlyph kind="breath" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: t.serif, fontSize: 19, color: t.ink, lineHeight: 1.1 }}>
                {it.title}
              </div>
              <div style={{ fontSize: 12, color: t.ink3, marginTop: 3 }}>{it.desc}</div>
            </div>
            <div style={{ fontFamily: t.mono, fontSize: 11, color: t.ink3 }}>{it.dur}</div>
          </div>
        ))}
      </div>
    </NookFrame>
  );
}

function NookRitualBreath({ close }) {
  const t = nookT;
  return (
    <NookFrame dark>
      <div style={{ padding: '70px 28px 0', color: '#EEE6D3' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div onClick={(e) => { e.stopPropagation(); close(); }}
            style={{ width: 32, height: 32, borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, cursor: 'pointer' }}>×</div>
          <div style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase',
            color: 'rgba(238,230,211,0.6)' }}>Breath · 2 min</div>
          <div style={{ width: 32 }} />
        </div>
        <div style={{
          fontFamily: t.serif, fontSize: 32, lineHeight: 1.15,
          marginTop: 30, fontWeight: 400, letterSpacing: -0.3,
        }}>
          Breathe in for four.<br/>
          <span style={{ fontStyle: 'italic', color: t.sun }}>Hold for seven.</span><br/>
          Out for eight.
        </div>
      </div>
      <div style={{
        position: 'absolute', top: 310, left: '50%', transform: 'translateX(-50%)',
        width: 280, height: 280,
      }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, rgba(232,181,87,0.5), rgba(196,107,74,0.2))`,
          animation: 'nookBreath 19s ease-in-out infinite',
        }} />
        <div style={{ position: 'absolute', inset: 30, borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.2)' }} />
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
          <div style={{ width: '32%', height: '100%', background: t.sun }}/>
        </div>
        <div style={{ fontFamily: t.mono, fontSize: 12, color: 'rgba(238,230,211,0.6)',
          fontVariantNumeric: 'tabular-nums' }}>0:38 / 2:00</div>
      </div>
    </NookFrame>
  );
}

function NookRitualStretch({ close }) {
  const t = nookT;
  const steps = [
    { name: 'Neck rolls', dur: '30s', done: true },
    { name: 'Shoulder shrug & release', dur: '45s', done: true },
    { name: 'Chest opener', dur: '1 min', active: true },
    { name: 'Cat-cow in chair', dur: '1 min' },
    { name: 'Gentle side bend', dur: '45s' },
  ];
  return (
    <NookFrame>
      <div style={{ padding: '70px 28px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div onClick={(e) => { e.stopPropagation(); close(); }}
            style={{ width: 32, height: 32, borderRadius: '50%',
            border: `1px solid ${t.bg2}`, background: t.surface,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer' }}>
            <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 2L10 10M10 2L2 10" stroke={t.ink2} strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
          <div style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase',
            color: t.ink3 }}>Stretch · 4 min</div>
          <div style={{ fontFamily: t.mono, fontSize: 13, color: t.ink3 }}>2:14</div>
        </div>

        <div style={{
          fontFamily: t.serif, fontSize: 30, lineHeight: 1.15,
          marginTop: 26, fontWeight: 400, letterSpacing: -0.4,
        }}>
          <span style={{ fontStyle: 'italic', color: t.terracotta }}>Chest opener.</span><br/>
          Hands behind back, lift.
        </div>
      </div>

      {/* illustration placeholder */}
      <div style={{ padding: '20px 28px 0' }}>
        <div style={{
          height: 180, borderRadius: 20,
          background: `linear-gradient(135deg, ${t.clay}, ${t.terracotta})`,
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 12px 30px rgba(196,107,74,0.2)',
        }}>
          {/* abstract figure */}
          <svg viewBox="0 0 200 120" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <circle cx="100" cy="35" r="14" stroke="rgba(255,255,255,0.85)" strokeWidth="2" fill="none"/>
            <path d="M100 50 Q 100 68, 100 90 M 100 65 Q 70 80, 60 95 M 100 65 Q 130 80, 140 95 M 100 90 L 88 118 M 100 90 L 112 118"
              stroke="rgba(255,255,255,0.85)" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </svg>
          <div style={{ position: 'absolute', bottom: 14, left: 18, color: 'rgba(255,255,255,0.9)',
            fontFamily: t.mono, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' }}>
            hold 10 seconds · breathe
          </div>
        </div>
      </div>

      {/* steps */}
      <div style={{ padding: '20px 20px 0' }}>
        {steps.map((s, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '9px 8px',
            opacity: s.done ? 0.45 : 1,
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              background: s.done ? t.sage : (s.active ? t.terracotta : 'transparent'),
              border: s.active || s.done ? 'none' : `1.5px solid ${t.bg2}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff',
            }}>
              {s.done && <NookCheck size={12} color="#fff" />}
              {s.active && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }}/>}
            </div>
            <div style={{ flex: 1, fontSize: 14, fontWeight: s.active ? 600 : 500,
              color: t.ink, textDecoration: s.done ? 'line-through' : 'none' }}>
              {s.name}
            </div>
            <div style={{ fontFamily: t.mono, fontSize: 11, color: t.ink3 }}>{s.dur}</div>
          </div>
        ))}
      </div>

      <div style={{
        position: 'absolute', bottom: 40, left: 28, right: 28, display: 'flex', gap: 10,
      }}>
        <button style={{
          flex: 1, height: 52, borderRadius: 14, border: `1px solid ${t.bg2}`,
          background: t.surface, color: t.ink,
          fontSize: 14, fontWeight: 500, fontFamily: t.sans, cursor: 'pointer',
        }}>Pause</button>
        <button style={{
          flex: 2, height: 52, borderRadius: 14, border: 'none',
          background: t.terracotta, color: '#fff',
          fontSize: 14, fontWeight: 600, fontFamily: t.sans, cursor: 'pointer',
          boxShadow: '0 8px 20px rgba(196,107,74,0.25)',
        }}>Next step →</button>
      </div>
    </NookFrame>
  );
}

function NookProgress({ onNav }) {
  const t = nookT;
  const week = [
    { d: 'M', v: 5, goal: 6 }, { d: 'T', v: 6, goal: 6 },
    { d: 'W', v: 4, goal: 6 }, { d: 'T', v: 6, goal: 6 },
    { d: 'F', v: 3, goal: 6 }, { d: 'S', v: 2, goal: 4 },
    { d: 'S', v: 3, goal: 6, today: true },
  ];
  return (
    <NookFrame>
      <NookHeader over="This week"
        title="You've made space"
        titleItal="for 29 pauses." />
      <div style={{ padding: '22px 28px 0' }}>
        {/* bar chart */}
        <div style={{ background: t.surface, borderRadius: 18, padding: '20px',
          border: `1px solid ${t.bg2}` }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 120 }}>
            {week.map((w, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: '100%', height: (w.v / 6) * 90, borderRadius: 6,
                  background: w.today ? t.terracotta : t.sageSoft,
                  border: w.today ? 'none' : `1px solid ${t.sage}22`,
                }}/>
                <div style={{ fontSize: 11, color: w.today ? t.ink : t.ink3,
                  fontWeight: w.today ? 700 : 500 }}>{w.d}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between',
            paddingTop: 14, borderTop: `1px solid ${t.bg2}`, marginTop: 14 }}>
            <Stat2 big="29" small="pauses" />
            <Stat2 big="78m" small="time cared for" />
            <Stat2 big="5" small="day streak" />
          </div>
        </div>

        <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
          color: t.ink3, fontWeight: 600, margin: '24px 0 10px' }}>Gentle observations</div>
        <InsightCard2 color={t.sage} tag="Kind to yourself"
          title="You haven't missed a morning breath in 12 days"
          body="It's becoming a real habit." />
        <InsightCard2 color={t.terracotta} tag="Something to notice"
          title="Afternoon pauses get skipped on Fridays"
          body="Maybe try a shorter one, like a 1-min eye rest?" />
      </div>
      <NookTabs active={2} onNav={onNav} />
    </NookFrame>
  );
}

function Stat2({ big, small }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: nookT.serif, fontSize: 26, color: nookT.ink, letterSpacing: -0.5, lineHeight: 1 }}>{big}</div>
      <div style={{ fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase',
        color: nookT.ink3, fontWeight: 600, marginTop: 4 }}>{small}</div>
    </div>
  );
}

function InsightCard2({ color, tag, title, body }) {
  const t = nookT;
  return (
    <div style={{ background: t.surface, borderRadius: 14, padding: '14px 16px',
      border: `1px solid ${t.bg2}`, marginBottom: 8 }}>
      <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase',
        color, fontWeight: 700, marginBottom: 4 }}>{tag}</div>
      <div style={{ fontFamily: t.serif, fontSize: 18, color: t.ink, lineHeight: 1.2 }}>{title}</div>
      <div style={{ fontSize: 12, color: t.ink2, marginTop: 4, lineHeight: 1.45 }}>{body}</div>
    </div>
  );
}

function NookYou({ onNav }) {
  const t = nookT;
  return (
    <NookFrame>
      <div style={{ padding: '70px 28px 24px', textAlign: 'center' }}>
        <div style={{ width: 76, height: 76, margin: '0 auto 14px',
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, ${t.clay}, ${t.terracotta})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: t.serif, fontSize: 28, color: '#fff', fontStyle: 'italic',
          boxShadow: '0 10px 24px rgba(196,107,74,0.25)' }}>a</div>
        <div style={{ fontFamily: t.serif, fontSize: 28, lineHeight: 1.1, letterSpacing: -0.4 }}>Anna</div>
        <div style={{ fontSize: 13, color: t.ink3, marginTop: 4 }}>with Nook for 42 days</div>
      </div>

      <div style={{ padding: '0 20px' }}>
        <Section title="Rhythm">
          <RowItem label="Working hours" value="09:00 — 18:00" />
          <RowItem label="Pause every" value="90 min" last />
        </Section>
        <Section title="Focus areas">
          <RowItem label="Neck & shoulders" value="On" />
          <RowItem label="Tired eyes" value="On" />
          <RowItem label="Lower back" value="Off" last />
        </Section>
        <Section title="Preferences">
          <RowItem label="Gentle notifications" value="On" />
          <RowItem label="Breath sounds" value="Bowl" />
          <RowItem label="Dark ritual view" value="Auto" last />
        </Section>
        <Section title="Account">
          <RowItem label="Subscription" value="Free" />
          <RowItem label="Export history" value="" chev last />
        </Section>
      </div>
      <NookTabs active={3} onNav={onNav} />
    </NookFrame>
  );
}

function Section({ title, children }) {
  const t = nookT;
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ padding: '0 12px 8px', fontSize: 11, letterSpacing: 1.5,
        textTransform: 'uppercase', color: t.ink3, fontWeight: 600 }}>{title}</div>
      <div style={{ background: t.surface, borderRadius: 16, padding: '0 16px',
        border: `1px solid ${t.bg2}` }}>
        {children}
      </div>
    </div>
  );
}

function RowItem({ label, value, last, chev }) {
  const t = nookT;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '13px 0', borderBottom: last ? 'none' : `1px solid ${t.bg2}`,
    }}>
      <div style={{ fontSize: 14, color: t.ink, fontWeight: 500 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: t.ink3, fontSize: 13 }}>
        {value}
        {chev && <svg width="7" height="12" viewBox="0 0 7 12"><path d="M1 1L6 6L1 11" stroke={t.ink3} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>
    </div>
  );
}

Object.assign(window, { NookLibDetail, NookRitualBreath, NookRitualStretch, NookProgress, NookYou });
