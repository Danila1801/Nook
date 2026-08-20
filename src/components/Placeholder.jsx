import BottomNav from './BottomNav.jsx';

export default function Placeholder({ name, showNav = false }) {
  return (
    <>
      <main
        style={{
          minHeight: '100dvh',
          background: 'var(--canvas)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: showNav ? '24px 24px var(--scroll-bottom)' : '24px',
          boxSizing: 'border-box',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            fontSize: '15px',
            color: 'var(--muted-ink)',
          }}
        >
          {name}
        </span>
      </main>
      {showNav && <BottomNav />}
    </>
  );
}
