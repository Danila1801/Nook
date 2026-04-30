// Nook — screens 1-5: Onboarding (3), Today, Library

function NookOnb1({ next }) {
  const t = nookT;
  return (
    <NookFrame>
      <div style={{ padding: '100px 32px 0', textAlign: 'center' }}>
        <div style={{
          width: 140, height: 140, borderRadius: '50%', margin: '0 auto 40px',
          background: `radial-gradient(circle at 35% 35%, ${t.clay}, ${t.terracotta})`,
          boxShadow: '0 20px 50px rgba(196,107,74,0.25)', position: 'relative',
        }}>
          <div style={{ position: 'absolute', inset: 14, borderRadius: '50%',
            border: '1.5px solid rgba(255,255,255,0.4)' }} />
          <div style={{ position: 'absolute', inset: 32, borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.3)' }} />
        </div>
        <div style={{ fontFamily: t.serif, fontSize: 44, lineHeight: 1.05,
          letterSpacing: -0.8, fontWeight: 400 }}>
          Welcome to<br/>
          <span style={{ fontStyle: 'italic', color: t.terracotta }}>Nook.</span>
        </div>
        <div style={{ fontSize: 15, color: t.ink2, marginTop: 20, lineHeight: 1.55, padding: '0 12px' }}>
          A quiet companion for people who work at a desk and want to feel better in their body.
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 56, left: 28, right: 28 }}>
        <button onClick={(e) => { e.stopPropagation(); next(); }} style={{
          width: '100%', height: 56, borderRadius: 16, border: 'none',
          background: t.terracotta, color: '#fff',
          fontSize: 16, fontWeight: 600, fontFamily: t.sans, cursor: 'pointer',
          boxShadow: '0 10px 24px rgba(196,107,74,0.25)',
        }}>Begin →</button>
        <div style={{ textAlign: 'center', fontSize: 13, color: t.ink3, marginTop: 14 }}>
          I already have an account
        </div>
      </div>
    </NookFrame>
  );
}

function NookOnb2({ next, back }) {
  const t = nookT;
  const [sel, setSel] = React.useState(['neck', 'eyes']);
  const goals = [
    { k: 'neck', label: 'Neck & shoulders', kind: 'stretch' },
    { k: 'back', label: 'Lower back', kind: 'stretch' },
    { k: 'eyes', label: 'Tired eyes', kind: 'eye' },
    { k: 'breath', label: 'Calmer breathing', kind: 'breath' },
    { k: 'move', label: 'More movement', kind: 'walk' },
    { k: 'focus', label: 'Steadier focus', kind: 'mind' },
  ];
  const toggle = (k) => setSel(s => s.includes(k) ? s.filter(x => x !== k) : [...s, k]);
  return (
    <NookFrame>
      <NookHeader back={back} over="Step 1 of 3"
        title="What feels"
        titleItal="heavy lately?" />
      <div style={{ fontSize: 14, color: t.ink2, padding: '12px 28px 0', lineHeight: 1.5 }}>
        Pick as many as you'd like. We'll build your day around them.
      </div>
      <div style={{ padding: '22px 20px' }}>
        {goals.map(g => {
          const on = sel.includes(g.k);
          return (
            <div key={g.k} onClick={(e) => { e.stopPropagation(); toggle(g.k); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 16px', margin: '0 0 10px',
                background: on ? t.terracotta : t.surface,
                border: `1px solid ${on ? t.terracotta : t.bg2}`,
                color: on ? '#fff' : t.ink,
                borderRadius: 14, cursor: 'pointer',
                boxShadow: on ? '0 6px 16px rgba(196,107,74,0.2)' : 'none',
              }}>
              <div style={{ width: 36, height: 36, borderRadius: 10,
                background: on ? 'rgba(255,255,255,0.2)' : t.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: on ? '#fff' : t.terracotta }}>
                <NookKindGlyph kind={g.kind} />
              </div>
              <div style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>{g.label}</div>
              {on && <NookCheck color="#fff" />}
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', bottom: 56, left: 28, right: 28 }}>
        <button onClick={(e) => { e.stopPropagation(); next(); }} style={{
          width: '100%', height: 56, borderRadius: 16, border: 'none',
          background: t.ink, color: '#fff',
          fontSize: 16, fontWeight: 600, fontFamily: t.sans, cursor: 'pointer',
        }}>Continue →</button>
      </div>
    </NookFrame>
  );
}

function NookOnb3({ next, back }) {
  const t = nookT;
  const [start, setStart] = React.useState('09:00');
  const [end, setEnd] = React.useState('18:00');
  const [freq, setFreq] = React.useState(90);
  return (
    <NookFrame>
      <NookHeader back={back} over="Step 2 of 3"
        title="When are you"
        titleItal="at your desk?" />
      <div style={{ padding: '28px 28px 0' }}>
        <div style={{ fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase',
          color: t.ink3, fontWeight: 600, marginBottom: 12 }}>Working hours</div>
        <div style={{ background: t.surface, borderRadius: 16, padding: '4px 18px',
          border: `1px solid ${t.bg2}` }}>
          <Row label="Start">
            <input type="time" value={start} onChange={e => setStart(e.target.value)}
              style={{ fontFamily: t.serif, fontSize: 22, border: 'none', background: 'transparent',
                color: t.terracotta, textAlign: 'right', width: 90, outline: 'none' }} />
          </Row>
          <div style={{ height: 1, background: t.bg2 }} />
          <Row label="End">
            <input type="time" value={end} onChange={e => setEnd(e.target.value)}
              style={{ fontFamily: t.serif, fontSize: 22, border: 'none', background: 'transparent',
                color: t.terracotta, textAlign: 'right', width: 90, outline: 'none' }} />
          </Row>
        </div>

        <div style={{ fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase',
          color: t.ink3, fontWeight: 600, margin: '28px 0 12px' }}>Pause rhythm</div>
        <div style={{ background: t.surface, borderRadius: 16, padding: '18px',
          border: `1px solid ${t.bg2}` }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 14, color: t.ink, fontWeight: 500 }}>Every</div>
            <div>
              <span style={{ fontFamily: t.serif, fontSize: 36, color: t.terracotta, fontStyle: 'italic' }}>{freq}</span>
              <span style={{ fontSize: 14, color: t.ink3, marginLeft: 4 }}>min</span>
            </div>
          </div>
          <input type="range" min={45} max={180} step={15} value={freq}
            onChange={e => setFreq(+e.target.value)}
            style={{ width: '100%', marginTop: 14, accentColor: t.terracotta }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: t.ink3, marginTop: 6 }}>
            <span>Gentle (45m)</span><span>Relaxed (3h)</span>
          </div>
        </div>

        <div style={{ fontSize: 12, color: t.ink3, lineHeight: 1.5, marginTop: 18, padding: '0 4px' }}>
          You can change this any time. Nook will nudge, never force.
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 56, left: 28, right: 28 }}>
        <button onClick={(e) => { e.stopPropagation(); next(); }} style={{
          width: '100%', height: 56, borderRadius: 16, border: 'none',
          background: t.ink, color: '#fff',
          fontSize: 16, fontWeight: 600, fontFamily: t.sans, cursor: 'pointer',
        }}>Set my rhythm →</button>
      </div>
    </NookFrame>
  );
}

function Row({ label, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
      <div style={{ fontSize: 15, color: nookT.ink, fontWeight: 500 }}>{label}</div>
      {children}
    </div>
  );
}

function NookToday2({ goRitual, onNav }) {
  const t = nookT;
  const rituals = [
    { time: '09:30', title: 'Ease into the day', kind: 'breath', dur: '2 min', done: true },
    { time: '11:15', title: 'Shoulders & neck', kind: 'stretch', dur: '4 min', done: true },
    { time: '13:00', title: 'Look far away', kind: 'eye', dur: '1 min', done: true },
    { time: '14:45', title: 'Walk & water', kind: 'walk', dur: '5 min', now: true },
    { time: '16:30', title: 'Hip opener', kind: 'stretch', dur: '6 min' },
    { time: '18:00', title: 'Wind down breath', kind: 'breath', dur: '3 min' },
  ];
  return (
    <NookFrame>
      <div style={{ padding: '70px 28px 0' }}>
        <div style={{ fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase',
          color: t.ink3, fontWeight: 500, marginBottom: 8 }}>
          Sunday · April 19
        </div>
        <div style={{ fontFamily: t.serif, fontSize: 42, lineHeight: 1.05,
          letterSpacing: -0.5, fontWeight: 400 }}>
          A soft day.<br/>
          <span style={{ color: t.terracotta, fontStyle: 'italic' }}>Six small pauses.</span>
        </div>
      </div>

      <div style={{ padding: '22px 20px 0' }}>
        <div onClick={(e) => { e.stopPropagation(); goRitual(); }}
          style={{
            background: t.surface, borderRadius: 20, padding: '18px',
            border: `1px solid ${t.bg2}`, display: 'flex', gap: 16, alignItems: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
          }}>
          <div style={{
            width: 78, height: 78, borderRadius: '50%',
            background: `radial-gradient(circle at 35% 35%, ${t.clay}, ${t.terracotta})`,
            position: 'relative', flexShrink: 0,
            boxShadow: '0 8px 20px rgba(196,107,74,0.25)',
          }}>
            <div style={{ position: 'absolute', inset: 8, borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.4)' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              fontFamily: t.serif, fontSize: 16, color: '#fff', fontStyle: 'italic' }}>now</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
              color: t.terracotta, fontWeight: 600 }}>Up next · in 18 min</div>
            <div style={{ fontFamily: t.serif, fontSize: 22, lineHeight: 1.15, color: t.ink, marginTop: 4 }}>
              Walk & water
            </div>
            <div style={{ fontSize: 13, color: t.ink2, marginTop: 2 }}>
              Stand up, refill, 20 steps.
            </div>
          </div>
          <svg width="10" height="16" viewBox="0 0 10 16"><path d="M2 1 L8 8 L2 15" stroke={t.ink3} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>

      <div style={{ position: 'absolute', top: 340, left: 0, right: 0, bottom: 92,
        overflow: 'auto', padding: '18px 20px 0' }}>
        <div style={{ padding: '0 8px', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
          color: t.ink3, fontWeight: 600, marginBottom: 6 }}>
          Today's rituals · 3 of 6 done
        </div>
        {rituals.map((r, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '10px 8px', opacity: r.done ? 0.5 : 1,
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: r.now ? t.terracotta : (r.done ? t.sageSoft : t.surface),
              border: r.now ? 'none' : `1px solid ${r.done ? 'transparent' : t.bg2}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: r.now ? '#fff' : (r.done ? t.sage : t.ink2),
            }}>
              {r.done ? <NookCheck /> : <NookKindGlyph kind={r.kind} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 500, color: t.ink,
                textDecoration: r.done ? 'line-through' : 'none',
                textDecorationColor: t.ink3 }}>{r.title}</div>
              <div style={{ fontSize: 12, color: t.ink3, marginTop: 1 }}>
                {r.kind[0].toUpperCase() + r.kind.slice(1)} · {r.dur}
              </div>
            </div>
            <div style={{ fontFamily: t.serif, fontSize: 16,
              color: r.now ? t.terracotta : t.ink3,
              fontStyle: r.now ? 'italic' : 'normal',
              fontVariantNumeric: 'tabular-nums' }}>{r.time}</div>
          </div>
        ))}
      </div>

      <NookTabs active={0} onNav={onNav} />
    </NookFrame>
  );
}

function NookLibrary2({ onNav }) {
  const t = nookT;
  const cats = [
    { name: 'Breath', count: 8, tint: t.terracotta, desc: '1–5 min · reset the nervous system' },
    { name: 'Stretch', count: 14, tint: t.sage, desc: '2–8 min · for neck, hips, back' },
    { name: 'Eyes', count: 4, tint: t.sun, desc: '30s–2 min · relieve screen fatigue' },
    { name: 'Move', count: 9, tint: t.lavender, desc: '3–10 min · walk, water, light cardio' },
    { name: 'Mind', count: 6, tint: t.sky, desc: '2–5 min · attention, gratitude' },
  ];
  return (
    <NookFrame>
      <NookHeader title="A library" titleItal="of small pauses." />
      <div style={{ padding: '18px 20px' }}>
        {cats.map((c, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 16,
            padding: '16px 12px', borderBottom: `1px solid ${t.bg2}`,
            cursor: 'pointer',
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16,
              background: c.tint, flexShrink: 0, position: 'relative',
              boxShadow: `0 6px 16px ${c.tint}33`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff',
            }}>
              <NookKindGlyph kind={c.name.toLowerCase() === 'stretch' ? 'stretch' : c.name.toLowerCase() === 'eyes' ? 'eye' : c.name.toLowerCase() === 'move' ? 'walk' : c.name.toLowerCase() === 'mind' ? 'mind' : 'breath'} size={22} />
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
      <NookTabs active={1} onNav={onNav} />
    </NookFrame>
  );
}

Object.assign(window, { NookOnb1, NookOnb2, NookOnb3, NookToday2, NookLibrary2 });
