import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useRecentlyViewed } from '../../hooks/useRecentlyViewed'

function Thumbnail({ src, alt }) {
  const [broken, setBroken] = useState(false)
  if (!src || broken) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        style={{ background: 'var(--color-surface)' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="rgba(201,168,76,0.3)" strokeWidth="1.5" strokeLinecap="round">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
          <line x1="6" y1="1" x2="6" y2="4"/>
          <line x1="10" y1="1" x2="10" y2="4"/>
          <line x1="14" y1="1" x2="14" y2="4"/>
        </svg>
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      style={{ filter: 'saturate(0.75) brightness(0.82)' }}
      onError={() => setBroken(true)}
    />
  )
}

export function RecentlyViewedStrip({ type }) {
  const { items } = useRecentlyViewed()
  const filtered = items.filter(i => i.type === type)
  if (filtered.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-[1600px] mx-auto px-8 sm:px-14 xl:px-20 pt-10 pb-2"
    >
      <p
        className="text-[9px] uppercase tracking-[0.28em] mb-4"
        style={{ color: 'var(--color-text-faint)', fontFamily: 'Space Mono, monospace' }}
      >
        ✦ Recently Viewed
      </p>

      <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {filtered.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="flex-shrink-0"
          >
            <Link
              to={item.to}
              className="group relative block overflow-hidden"
              style={{
                width: 152,
                height: 88,
                border: '1px solid var(--color-border-strong)',
                background: 'var(--color-card)',
              }}
            >
              <Thumbnail src={item.coverImage} alt={item.title} />
              {/* Gradient + title overlay */}
              <div
                className="absolute inset-0 flex items-end p-2.5 transition-opacity duration-200"
                style={{
                  background: 'linear-gradient(to top, rgba(6,12,7,0.88) 0%, rgba(6,12,7,0.2) 60%, transparent 100%)',
                }}
              >
                <p
                  className="text-[10px] leading-snug line-clamp-2"
                  style={{ color: 'var(--color-text)', fontFamily: 'Inter, sans-serif' }}
                >
                  {item.title}
                </p>
              </div>
              {/* Hover gold border */}
              <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ border: '1px solid var(--color-accent-border)' }}
              />
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
