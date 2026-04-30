export default function Placeholder({ name }) {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--canvas)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
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
  );
}
