import { useState } from 'react'

export function ShareButton({ title, text, url }) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const shareUrl = url || window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl })
        return
      } catch {
        // user cancelled or browser denied — fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <button
      onClick={handleShare}
      title={copied ? 'Link copied!' : 'Share'}
      className="flex items-center gap-2 transition-all duration-200"
      style={{
        background: copied ? 'var(--color-accent-dim)' : 'transparent',
        border: '1px solid var(--color-border-strong)',
        borderColor: copied ? 'var(--color-accent-border)' : undefined,
        borderRadius: '9999px',
        color: copied ? 'var(--color-accent)' : 'var(--color-text-muted)',
        padding: '0.45rem 1rem',
        fontFamily: 'Space Mono, monospace',
        fontSize: '0.68rem',
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => {
        if (!copied) {
          e.currentTarget.style.borderColor = 'var(--color-accent-border)'
          e.currentTarget.style.color = 'var(--color-accent)'
        }
      }}
      onMouseLeave={(e) => {
        if (!copied) {
          e.currentTarget.style.borderColor = 'var(--color-border-strong)'
          e.currentTarget.style.color = 'var(--color-text-muted)'
        }
      }}
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
          Share
        </>
      )}
    </button>
  )
}
