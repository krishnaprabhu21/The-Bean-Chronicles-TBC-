import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useBookmarks } from '../hooks/useBookmarks'
import { useTheme } from '../contexts/ThemeContext'
import { SEO } from '../components/ui/SEO'

function BookmarkIcon({ size = 64 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}

function EmptyShelf() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center text-center py-24 px-6"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
        className="mb-8"
        style={{ opacity: 0.75, color: 'var(--color-accent)' }}
      >
        <BookmarkIcon size={72} />
      </motion.div>
      <h2
        className="font-display text-3xl mb-4"
        style={{ color: 'var(--color-text)' }}
      >
        Your shelf is empty
      </h2>
      <p
        className="text-sm leading-relaxed mb-10 max-w-[34ch]"
        style={{ color: 'var(--color-text-muted)', fontFamily: 'Inter, sans-serif' }}
      >
        Bookmark articles as you read — they'll live here for whenever you're ready.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link to="/culture" className="btn-solid">
          Browse Articles
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>
        <Link to="/recipes" className="btn-outline">
          Explore Recipes
        </Link>
      </div>
    </motion.div>
  )
}

function BookmarkCard({ bookmark, onRemove, index }) {
  const { theme } = useTheme()
  const isLight = theme === 'light'
  const fallbackImage = `https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=350&fit=crop&q=80`

  const cardBg = isLight ? '#FFFFFF' : 'var(--color-card)'
  const cardShadow = isLight
    ? '0 2px 16px rgba(80,40,0,0.09), 0 1px 4px rgba(80,40,0,0.05)'
    : '0 4px 24px rgba(0,0,0,0.45)'
  const cardBorder = isLight ? 'rgba(140,90,20,0.18)' : 'var(--color-border)'
  const coverGradient = isLight
    ? 'linear-gradient(to top, rgba(30,15,0,0.6) 0%, transparent 55%)'
    : 'linear-gradient(to top, rgba(28,43,20,0.85) 0%, transparent 55%)'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: cardBg,
        border: `1px solid ${cardBorder}`,
        boxShadow: cardShadow,
      }}
    >
      {/* Cover image */}
      <div className="relative overflow-hidden" style={{ height: '11rem' }}>
        <img
          src={bookmark.coverImage || fallbackImage}
          alt={bookmark.title}
          loading="lazy"
          decoding="async"
          onError={(e) => { e.currentTarget.src = fallbackImage }}
          className="w-full h-full object-cover"
          style={{ transition: 'transform 0.4s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.04)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
        />
        <div className="absolute inset-0" style={{ background: coverGradient }} />
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Section pill */}
        {bookmark.sectionName && (
          <span
            className="self-start text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full"
            style={{
              color: 'var(--color-accent)',
              background: 'var(--color-accent-dim)',
              border: '1px solid var(--color-accent-border)',
              fontFamily: 'Space Mono, monospace',
            }}
          >
            {bookmark.sectionName}
          </span>
        )}

        {/* Title */}
        <h3
          className="line-clamp-2 leading-snug"
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.05rem',
            color: 'var(--color-text)',
            fontWeight: 600,
          }}
        >
          {bookmark.title}
        </h3>

        {/* Meta */}
        <div
          className="flex items-center gap-2 text-[11px]"
          style={{ color: 'var(--color-text-muted)', fontFamily: 'Inter, sans-serif' }}
        >
          {bookmark.author && <span>{bookmark.author}</span>}
          {bookmark.author && bookmark.readTime && (
            <span style={{ color: 'var(--color-border-strong)' }}>·</span>
          )}
          {bookmark.readTime && <span>{bookmark.readTime} min read</span>}
        </div>

        <div className="flex-1" />

        {/* Actions row */}
        <div
          className="flex items-center gap-3 pt-2"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <Link
            to={`/article/${bookmark.id}`}
            className="btn-outline flex-1 justify-center text-center"
            style={{ borderRadius: '0.6rem', padding: '0.55rem 1rem', fontSize: '0.65rem' }}
          >
            Read Article
          </Link>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => onRemove(bookmark)}
            title="Remove bookmark"
            className="flex items-center justify-center rounded-lg transition-colors duration-200"
            style={{
              width: '36px',
              height: '36px',
              background: 'var(--color-accent-dim)',
              border: '1px solid var(--color-accent-border)',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(220,60,60,0.12)'
              e.currentTarget.style.borderColor = 'rgba(220,60,60,0.3)'
              e.currentTarget.style.color = '#e05555'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--color-accent-dim)'
              e.currentTarget.style.borderColor = 'var(--color-accent-border)'
              e.currentTarget.style.color = 'var(--color-text-muted)'
            }}
          >
            <TrashIcon />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default function Shelf() {
  const { bookmarks, toggle, count } = useBookmarks()
  const { theme } = useTheme()
  const isLight = theme === 'light'

  const clearAll = () => {
    if (window.confirm('Remove all saved articles?')) {
      bookmarks.forEach(b => toggle(b))
    }
  }

  const heroGradient = isLight
    ? 'linear-gradient(180deg, rgba(220,196,148,0.75) 0%, transparent 100%)'
    : 'linear-gradient(180deg, rgba(22,34,16,0.9) 0%, transparent 100%)'

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <SEO title="My Shelf" description="Your saved articles and bookmarks — all in one place." />
      {/* Hero section */}
      <section
        className="pt-24 pb-14 px-6 relative overflow-hidden"
        style={{ background: heroGradient }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, var(--color-accent-border) 1px, transparent 0)`,
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="label-ornate justify-center mb-5">
              Your Collection
            </div>

            <h1
              className="font-display mb-4 leading-tight"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', color: 'var(--color-text)' }}
            >
              Reading{' '}
              <span style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>/ Shelf</span>
            </h1>

            <p
              className="text-sm leading-relaxed mb-6 mx-auto"
              style={{
                color: 'var(--color-text-muted)',
                fontFamily: 'Inter, sans-serif',
                maxWidth: '40ch',
              }}
            >
              Articles you've saved for later. Your personal coffee reading list.
            </p>

            {/* Count badge */}
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
                  style={{
                    background: 'var(--color-accent-dim)',
                    border: '1px solid var(--color-accent-border)',
                    color: 'var(--color-accent)',
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '0.7rem',
                    letterSpacing: '0.12em',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                  {count} saved
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <div
        className="max-w-7xl mx-auto px-6 pb-24"
        style={{ paddingLeft: 'clamp(1rem, 4vw, 5rem)', paddingRight: 'clamp(1rem, 4vw, 5rem)' }}
      >
        <AnimatePresence mode="wait">
          {count === 0 ? (
            <EmptyShelf key="empty" />
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Grid header */}
              <div className="flex items-center justify-between mb-8">
                <span
                  className="text-xs uppercase tracking-widest"
                  style={{ color: 'var(--color-text-faint)', fontFamily: 'Space Mono, monospace' }}
                >
                  {count} {count === 1 ? 'article' : 'articles'} saved
                </span>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={clearAll}
                  className="flex items-center gap-2 text-xs uppercase tracking-widest transition-colors duration-200"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-faint)',
                    cursor: 'pointer',
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '0.65rem',
                    letterSpacing: '0.18em',
                    padding: '0.4rem 0.6rem',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(220,80,80,0.8)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-faint)' }}
                >
                  <TrashIcon />
                  Clear all
                </motion.button>
              </div>

              {/* Bookmark grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {bookmarks.map((bookmark, i) => (
                    <BookmarkCard
                      key={bookmark.id}
                      bookmark={bookmark}
                      index={i}
                      onRemove={toggle}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
