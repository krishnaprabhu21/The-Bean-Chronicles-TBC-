import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useBookmarks } from '../../hooks/useBookmarks'

export function ArticleCard({ article }) {
  const { toggle, isBookmarked } = useBookmarks()
  const saved = isBookmarked(article.id)

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="group overflow-hidden relative"
      style={{
        border: '1px solid var(--color-border-strong)',
        background: 'var(--color-card)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* Bookmark button */}
      <button
        onClick={(e) => { e.stopPropagation(); toggle(article) }}
        title={saved ? 'Remove bookmark' : 'Save to shelf'}
        className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200"
        style={{
          background: saved ? 'rgba(201,168,76,0.9)' : 'rgba(13,24,16,0.72)',
          border: '1px solid var(--color-accent-border)',
          backdropFilter: 'blur(6px)',
        }}
        onMouseEnter={(e) => { if (!saved) e.currentTarget.style.background = 'rgba(201,168,76,0.2)' }}
        onMouseLeave={(e) => { if (!saved) e.currentTarget.style.background = 'rgba(13,24,16,0.72)' }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill={saved ? 'var(--color-bg)' : 'none'}
          stroke={saved ? 'var(--color-bg)' : 'var(--color-accent)'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      <Link to={`/article/${article.id}`} className="block">
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={article.coverImage}
            alt={article.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ filter: 'saturate(0.85) brightness(0.92)' }}
          />
        </div>
        <div className="p-7 sm:p-8">
          <span className="inline-block text-[9px] uppercase tracking-[0.22em] font-medium mb-5" style={{ color: 'var(--color-accent)' }}>
            {article.sectionName}
          </span>
          <h3 className="font-display text-lg leading-snug mb-4 line-clamp-2 transition-colors duration-200" style={{ color: 'var(--color-text)' }}>
            {article.title}
          </h3>
          <p className="text-sm line-clamp-2 mb-7 leading-loose" style={{ color: 'var(--color-text-muted)' }}>
            {article.excerpt}
          </p>
          <div className="flex items-center gap-3 pt-5" style={{ borderTop: '1px solid var(--color-border)' }}>
            <span className="text-[11px] uppercase tracking-wider flex-1 truncate" style={{ color: 'var(--color-text-muted)', letterSpacing: '0.12em' }}>
              {article.author}
            </span>
            <span style={{ color: 'var(--color-accent-border)', fontSize: '10px' }}>✦</span>
            <span className="text-[11px] flex-shrink-0" style={{ color: 'var(--color-text-faint)' }}>
              {article.readTime} min
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function ArticleCardSkeleton() {
  return (
    <div className="overflow-hidden animate-pulse" style={{ border: '1px solid var(--color-border)', background: 'var(--color-card)', boxShadow: 'var(--shadow-card)' }}>
      <div className="aspect-[16/9]" style={{ background: 'rgba(80,120,60,0.1)' }} />
      <div className="p-7 sm:p-8 flex flex-col gap-4">
        <div className="h-2 w-16 rounded-full" style={{ background: 'rgba(80,120,60,0.15)' }} />
        <div className="h-5 w-full rounded" style={{ background: 'rgba(80,120,60,0.12)' }} />
        <div className="h-5 w-3/4 rounded" style={{ background: 'rgba(80,120,60,0.12)' }} />
        <div className="h-3 w-full rounded" style={{ background: 'rgba(80,120,60,0.08)' }} />
        <div className="h-3 w-5/6 rounded" style={{ background: 'rgba(80,120,60,0.08)' }} />
        <div className="h-2 w-1/2 rounded-full mt-2" style={{ background: 'rgba(80,120,60,0.08)' }} />
      </div>
    </div>
  )
}
