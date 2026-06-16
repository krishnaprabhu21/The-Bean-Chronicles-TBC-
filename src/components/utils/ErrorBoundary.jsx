import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-bg)',
            gap: '1.5rem',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: '3.5rem', lineHeight: 1 }}>☕</span>
          <h2
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
              color: 'var(--color-text)',
              margin: 0,
            }}
          >
            Something went cold
          </h2>
          <p
            style={{
              color: 'var(--color-text-muted)',
              maxWidth: '38ch',
              lineHeight: 1.75,
              margin: 0,
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.95rem',
            }}
          >
            This page failed to load. A refresh usually fixes it — if not, try coming back in a moment.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'var(--color-accent)',
                color: 'var(--color-bg)',
                border: 'none',
                borderRadius: '0.75rem',
                padding: '0.75rem 2rem',
                fontSize: '0.75rem',
                fontFamily: 'Space Mono, monospace',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Reload Page
            </button>
            <button
              onClick={() => { window.location.href = '/' }}
              style={{
                background: 'transparent',
                color: 'var(--color-text-muted)',
                border: '1px solid var(--color-border-strong)',
                borderRadius: '0.75rem',
                padding: '0.75rem 2rem',
                fontSize: '0.75rem',
                fontFamily: 'Space Mono, monospace',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Go Home
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
