import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useRecentlyViewed } from '../../hooks/useRecentlyViewed'

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
              {item.coverImage ? (
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ filter: 'saturate(0.75) brightness(0.82)' }}
                />
              ) : (
                <div className="w-full h-full skeleton-shimmer" />
              )}
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
