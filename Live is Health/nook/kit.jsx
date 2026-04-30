// Nook — shared tokens + primitives for all 10 screens
// Warm wellness palette. Light theme only. Comfortable density.

const nookT = {
  bg: '#F4EEE3',
  bg2: '#EBE3D3',
  surface: '#FFFFFF',
  ink: '#2A2A24',
  ink2: '#5B5950',
  ink3: '#8E8A7C',
  terracotta: '#C46B4A',
  terracottaDeep: '#A85638',
  sage: '#7A8C6E',
  sageSoft: '#D6DECC',
  clay: '#E8D4BE',
  sun: '#E8B557',
  lavender: '#8B6FB8',
  sky: '#6B8CB8',
  serif: "'Instrument Serif', Georgia, serif",
  sans: "'Inter', -apple-system, system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
};

function NookFrame({ children, dark = false, onTap }) {
  const t = nookT;
  return (
    <div onClick={onTap} style={{
      width: 390, height: 844, position: 'relative',
      background: dark ? '#1F1C15' : t.bg,
      borderRadius: 48, overflow: 'hidden',
      fontFamily: t.sans, color: dark ? '#EEE6D3' : t.ink,
      boxShadow: '0 30px 60px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.08)',
      cursor: onTap ? 'default' : 'default',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 54,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 28px 0', zIndex: 10,
        fontSize: 15, fontWeight: 600,
        color: dark ? '#EEE6D3' : t.ink,
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

function NookTabs({ active = 0, onNav }) {
  const t = nookT;
  const items = [
    { key: 'today', label: 'Today', glyph: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="4" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M11 2v2M11 18v2M2 11h2M18 11h2M4.5 4.5l1.4 1.4M16.1 16.1l1.4 1.4M4.5 17.5l1.4-1.4M16.1 5.9l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )},
    { key: 'library', label: 'Library', glyph: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="4" width="4" height="14" stroke="currentColor" strokeWidth="1.5" rx="1"/>
        <rect x="9" y="4" width="4" height="14" stroke="currentColor" strokeWidth="1.5" rx="1"/>
        <rect x="15" y="6" width="4" height="12" stroke="currentColor" strokeWidth="1.5" rx="1" transform="rotate(-8 17 12)"/>
      </svg>
    )},
    { key: 'progress', label: 'Progress', glyph: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M3 17L8 12L12 15L19 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )},
    { key: 'you', label: 'You', glyph: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M4 19c0-3.5 3-6 7-6s7 2.5 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )},
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 92,
      background: 'rgba(244,238,227,0.92)',
      backdropFilter: 'blur(20px)',
      borderTop: `1px solid ${t.bg2}`,
      display: 'flex', padding: '12px 20px 30px',
      zIndex: 5,
    }}>
      {items.map((it, i) => (
        <div key={it.key}
          onClick={(e) => { e.stopPropagation(); onNav && onNav(it.key); }}
          style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
          color: i === active ? t.terracotta : t.ink3,
          cursor: 'pointer',
        }}>
          {it.glyph}
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: 0.3 }}>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

function NookKindGlyph({ kind, size = 20 }) {
  const p = { width: size, height: size, viewBox: `0 0 20 20`, fill: 'none' };
  if (kind === 'breath') return (
    <svg {...p}><circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1.4"/><circle cx="10" cy="10" r="2" fill="currentColor"/></svg>
  );
  if (kind === 'stretch') return (
    <svg {...p}><path d="M4 10 Q10 4, 16 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="4" cy="10" r="1.5" fill="currentColor"/><circle cx="16" cy="10" r="1.5" fill="currentColor"/></svg>
  );
  if (kind === 'eye') return (
    <svg {...p}><path d="M2 10 Q10 4, 18 10 Q10 16, 2 10Z" stroke="currentColor" strokeWidth="1.4"/><circle cx="10" cy="10" r="2" fill="currentColor"/></svg>
  );
  if (kind === 'walk') return (
    <svg {...p}><circle cx="11" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M8 17 L11 11 L14 14 L14 17 M11 11 L14 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
  );
  if (kind === 'mind') return (
    <svg {...p}><path d="M10 3 C6 3, 4 7, 6 10 C4 13, 6 17, 10 17 C14 17, 16 13, 14 10 C16 7, 14 3, 10 3Z" stroke="currentColor" strokeWidth="1.4"/></svg>
  );
  return null;
}

function NookCheck({ size = 16, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 8l3 3 7-7" stroke={color || 'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function NookHeader({ over, title, titleItal, sub, close, back }) {
  const t = nookT;
  return (
    <div style={{ padding: '70px 28px 0' }}>
      {(close || back) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          {back ? (
            <div onClick={(e) => { e.stopPropagation(); back(); }}
              style={{ display: 'flex', alignItems: 'center', gap: 4,
              color: t.ink2, fontSize: 14, cursor: 'pointer' }}>
              <svg width="8" height="14" viewBox="0 0 8 14"><path d="M7 1 L1 7 L7 13" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Back
            </div>
          ) : <span />}
          {close && (
            <div onClick={(e) => { e.stopPropagation(); close(); }}
              style={{ width: 32, height: 32, borderRadius: '50%',
              border: `1px solid ${t.bg2}`, background: t.surface,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 2L10 10M10 2L2 10" stroke={t.ink2} strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
          )}
        </div>
      )}
      {over && <div style={{ fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase',
        color: t.ink3, fontWeight: 500, marginBottom: 8 }}>{over}</div>}
      {title && (
        <div style={{ fontFamily: t.serif, fontSize: 40, lineHeight: 1.08,
          letterSpacing: -0.6, fontWeight: 400, color: t.ink }}>
          {title}
          {titleItal && <><br/><span style={{ color: t.terracotta, fontStyle: 'italic' }}>{titleItal}</span></>}
        </div>
      )}
      {sub && <div style={{ fontSize: 14, color: t.ink2, marginTop: 10, lineHeight: 1.5 }}>{sub}</div>}
    </div>
  );
}

Object.assign(window, { nookT, NookFrame, NookTabs, NookKindGlyph, NookCheck, NookHeader });
