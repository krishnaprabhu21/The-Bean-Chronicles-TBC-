import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SEO } from '../components/ui/SEO'
import { BackButton } from '../components/ui/BackButton'

const STORAGE_KEY = 'tbc-submissions'
const CATEGORIES = ['All', 'Espresso', 'Cold Brew', 'Lattes', 'Pour Over', 'Culture', 'Guides']

const DIFF_LABELS = ['', 'Beginner', 'Easy', 'Intermediate', 'Advanced', 'Expert']

const CATEGORY_COLORS = {
  Espresso:  '#C9A84C',
  'Cold Brew': '#4A7A8A',
  Lattes:    '#A07A5A',
  'Pour Over': '#6B8A5E',
  Culture:   '#7A6A9A',
  Guides:    '#8A6A4A',
}

function loadSubmissions() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') }
  catch { return [] }
}

function BeanIcons({ value, max = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={i < value ? '#C9A84C' : 'rgba(201,168,76,0.18)'}>
          <ellipse cx="12" cy="12" rx="5" ry="9" />
          <path d="M12 3 Q16 8 12 12 Q8 16 12 21" stroke={i < value ? '#C9A84C' : 'rgba(201,168,76,0.18)'} strokeWidth="1.5" fill="none" />
        </svg>
      ))}
    </div>
  )
}

function SubmissionCard({ recipe, index }) {
  const catColor = CATEGORY_COLORS[recipe.category] || '#C9A84C'
  const date = new Date(recipe.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  const totalTime = (parseInt(recipe.prepTime) || 0) + (parseInt(recipe.brewTime) || 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="flex flex-col rounded-2xl overflow-hidden group"
      style={{ background: 'var(--color-card)', border: '1px solid rgba(80,120,60,0.2)', transition: 'border-color 0.2s, box-shadow 0.2s' }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${catColor}40`; e.currentTarget.style.boxShadow = `0 0 24px ${catColor}10` }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(80,120,60,0.2)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      {/* Color bar */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${catColor}, ${catColor}60)` }} />

      <div className="flex flex-col flex-1 p-6 gap-4">
        {/* Category + date */}
        <div className="flex items-center justify-between">
          <span
            className="px-2.5 py-1 rounded-full text-[9px] uppercase tracking-[0.14em]"
            style={{ background: `${catColor}12`, color: catColor, border: `1px solid ${catColor}30`, fontFamily: 'Space Mono, monospace' }}
          >
            {recipe.category}
          </span>
          <span style={{ color: 'var(--color-text-faint)', fontFamily: 'Space Mono, monospace', fontSize: '9px' }}>{date}</span>
        </div>

        {/* Title */}
        <h3 className="font-display text-xl leading-snug" style={{ color: 'var(--color-text)' }}>
          {recipe.name}
        </h3>

        {/* Stats */}
        <div className="flex items-center gap-5 mt-auto">
          <div className="flex flex-col gap-1">
            <span style={{ color: 'var(--color-text-faint)', fontFamily: 'Space Mono, monospace', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              Difficulty
            </span>
            <BeanIcons value={recipe.difficulty} />
          </div>
          <div className="flex flex-col gap-1">
            <span style={{ color: 'var(--color-text-faint)', fontFamily: 'Space Mono, monospace', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              Total Time
            </span>
            <span style={{ color: 'var(--color-accent)', fontFamily: 'Space Mono, monospace', fontSize: '11px' }}>
              {totalTime ? `${totalTime} min` : '—'}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span style={{ color: 'var(--color-text-faint)', fontFamily: 'Space Mono, monospace', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              Ingredients
            </span>
            <span style={{ color: 'var(--color-accent)', fontFamily: 'Space Mono, monospace', fontSize: '11px' }}>
              {recipe.ingredients?.length || 0}
            </span>
          </div>
        </div>

        {/* Steps preview */}
        {recipe.steps?.length > 0 && (
          <div className="pt-4 border-t" style={{ borderColor: 'rgba(80,120,60,0.15)' }}>
            <p style={{ color: 'var(--color-text-faint)', fontSize: '11px', lineHeight: 1.7 }}>
              {recipe.steps[0].instruction.slice(0, 90)}{recipe.steps[0].instruction.length > 90 ? '…' : ''}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-28 gap-6 text-center"
    >
      <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)' }}>
        <svg width="36" height="36" viewBox="0 0 48 48" fill="none" stroke="rgba(201,168,76,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M24 8V30"/><path d="M18 14L24 8L30 14"/>
          <path d="M14 22V36C14 37.1 14.9 38 16 38H32C33.1 38 34 37.1 34 36V22" />
        </svg>
      </div>
      <div>
        <h3 className="font-display text-2xl mb-2" style={{ color: 'var(--color-text-muted)' }}>No recipes yet</h3>
        <p style={{ color: 'var(--color-text-faint)', fontFamily: 'Space Mono, monospace', fontSize: '11px', letterSpacing: '0.12em' }}>
          Be the first to share your signature brew
        </p>
      </div>
      <Link
        to="/submit-recipe"
        className="px-8 py-3 rounded-full text-xs uppercase tracking-[0.16em] transition-all duration-200"
        style={{ background: 'var(--color-accent)', color: 'var(--color-bg)', fontFamily: 'Space Mono, monospace', textDecoration: 'none', fontWeight: 700 }}
      >
        Submit Your Recipe
      </Link>
    </motion.div>
  )
}

export default function CommunityRecipes() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState('newest')

  const allRecipes = useMemo(loadSubmissions, [])

  const filtered = useMemo(() => {
    let list = activeCategory === 'All' ? allRecipes : allRecipes.filter(r => r.category === activeCategory)
    if (sortBy === 'newest') list = [...list].sort((a, b) => b.id - a.id)
    if (sortBy === 'oldest') list = [...list].sort((a, b) => a.id - b.id)
    if (sortBy === 'difficulty') list = [...list].sort((a, b) => (b.difficulty || 0) - (a.difficulty || 0))
    return list
  }, [allRecipes, activeCategory, sortBy])

  return (
    <div className="min-h-screen pt-24" style={{ background: 'var(--color-bg)' }}>
      <BackButton to="/" label="Home" />
      <SEO
        title="Community Recipes"
        description="Recipes submitted by The Bean Chronicles community — original brews shared by coffee lovers around the world."
      />

      {/* Hero */}
      <section className="max-w-[1600px] mx-auto px-6 sm:px-10 xl:px-16 py-16 md:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="label-ornate mb-5">Community Brews</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-parchment leading-tight">
                Your <span className="font-display italic" style={{ color: 'var(--color-accent)' }}>Recipes</span>
              </h1>
              <p className="mt-4 text-base leading-loose" style={{ color: 'var(--color-text-muted)', maxWidth: '44ch' }}>
                Original brews submitted by the community. Every recipe here started with someone's curiosity and a great cup of coffee.
              </p>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <div
                className="px-5 py-3 rounded-xl text-center"
                style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}
              >
                <p className="font-display text-3xl" style={{ color: 'var(--color-accent)' }}>{allRecipes.length}</p>
                <p style={{ color: 'rgba(201,168,76,0.5)', fontFamily: 'Space Mono, monospace', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
                  Recipes
                </p>
              </div>
              <Link
                to="/submit-recipe"
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs uppercase tracking-[0.14em] transition-all duration-200"
                style={{ background: 'var(--color-accent)', color: 'var(--color-bg)', fontFamily: 'Space Mono, monospace', textDecoration: 'none', fontWeight: 700 }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#B8973B' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-accent)' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Submit
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Filters */}
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 xl:px-16 pb-8" style={{ borderTop: '1px solid rgba(80,120,60,0.12)' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => {
              const active = activeCategory === cat
              const c = CATEGORY_COLORS[cat] || '#C9A84C'
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="px-3.5 py-1.5 rounded-full transition-all duration-200"
                  style={{
                    fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                    background: active ? (cat === 'All' ? 'var(--color-accent)' : c) : 'transparent',
                    color: active ? 'var(--color-bg)' : 'var(--color-text-muted)',
                    border: `1px solid ${active ? (cat === 'All' ? 'var(--color-accent)' : c) : 'rgba(80,120,60,0.25)'}`,
                  }}
                >
                  {cat}
                </button>
              )
            })}
          </div>
          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="rounded-xl px-3 py-2 text-xs outline-none"
            style={{ background: 'var(--color-surface)', border: '1px solid rgba(80,120,60,0.3)', color: 'var(--color-text-muted)', fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.08em' }}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="difficulty">Most difficult</option>
          </select>
        </div>
        {filtered.length > 0 && (
          <p className="mt-4 text-[10px] uppercase tracking-[0.2em]" style={{ color: 'rgba(201,168,76,0.3)', fontFamily: 'Space Mono, monospace' }}>
            {filtered.length} recipe{filtered.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Grid */}
      <section className="max-w-[1600px] mx-auto px-6 sm:px-10 xl:px-16 pb-28">
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + sortBy}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {filtered.map((recipe, i) => (
                <SubmissionCard key={recipe.id} recipe={recipe} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </section>
    </div>
  )
}
