import { useState } from 'react'

function CoffeePlaceholder() {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-2"
      style={{ background: 'linear-gradient(135deg, var(--color-card) 0%, var(--color-surface) 100%)' }}
    >
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-border-strong)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    </div>
  )
}

export function ImageWithFallback({ src, alt, className, style, ...props }) {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  return (
    <div className="relative w-full h-full">
      {/* Skeleton shimmer shown until image loads */}
      {!loaded && !errored && (
        <div className="absolute inset-0 skeleton-shimmer" />
      )}

      {errored ? (
        <CoffeePlaceholder />
      ) : (
        <img
          src={src}
          alt={alt}
          className={className}
          style={{ ...style, opacity: loaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          {...props}
        />
      )}
    </div>
  )
}
