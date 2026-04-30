export default function App() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--canvas)',
        color: 'var(--ink)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: 'clamp(4rem, 12vw, 8rem)',
          margin: 0,
          letterSpacing: '-0.02em',
        }}
      >
        Nook.
      </h1>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          color: 'var(--muted-ink)',
          fontSize: '1rem',
          marginTop: '0.5rem',
          letterSpacing: '0.01em',
        }}
      >
        rebuilding gently.
      </p>
    </main>
  );
}
