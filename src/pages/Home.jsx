import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { SEO } from '../components/ui/SEO'
import { HeroSection } from '../components/sections/HeroSection'
import { FeaturedArticle } from '../components/sections/FeaturedArticle'
import { ArticleCard, ArticleCardSkeleton } from '../components/ui/ArticleCard'
import { RecipeCard } from '../components/ui/RecipeCard'
import { NewsletterCTA } from '../components/ui/NewsletterCTA'
import { recipes } from '../data'
import { getDailyEntry } from '../data/dailyCoffee'
import { useGuardianArticles } from '../hooks/useGuardianArticles'

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: 'easeOut' },
}

function FeaturedSkeleton() {
  return (
    <div
      className="animate-pulse overflow-hidden"
      style={{ border: '1px solid var(--color-border)', background: 'var(--color-card)', minHeight: 360 }}
    />
  )
}

function DailyCoffeeCard() {
  const entry = getDailyEntry()
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <motion.div
      {...fadeUp}
      className="rounded-3xl overflow-hidden relative"
      style={{
        background: `linear-gradient(135deg, #1C2E14 0%, #0D1810 60%, ${entry.color}12 100%)`,
        border: `1px solid ${entry.color}25`,
      }}
    >
      {/* Accent bar top */}
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${entry.color}, transparent)` }} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
        {/* Left panel — date + name */}
        <div
          className="lg:col-span-2 p-8 sm:p-10 flex flex-col justify-between gap-6"
          style={{ borderRight: `1px solid ${entry.color}15` }}
        >
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span
                className="text-[9px] uppercase tracking-[0.24em] px-2.5 py-1 rounded-full"
                style={{
                  background: `${entry.color}20`,
                  color: entry.color,
                  fontFamily: 'Space Mono, monospace',
                  border: `1px solid ${entry.color}35`,
                }}
              >
                Coffee of the Day
              </span>
              <span
                className="text-[9px] uppercase tracking-[0.14em]"
                style={{ color: 'var(--color-text-faint)', fontFamily: 'Space Mono, monospace' }}
              >
                {today}
              </span>
            </div>

            <h2
              className="font-display text-4xl sm:text-5xl leading-none mb-3"
              style={{ color: 'var(--color-text)' }}
            >
              {entry.name}
            </h2>
            <p
              className="font-display italic text-lg"
              style={{ color: entry.color }}
            >
              {entry.tagline}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className="px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.14em]"
              style={{
                background: `${entry.color}18`,
                color: entry.color,
                fontFamily: 'Space Mono, monospace',
                border: `1px solid ${entry.color}30`,
              }}
            >
              {entry.category}
            </span>
            <span
              className="text-[10px] uppercase tracking-[0.14em]"
              style={{ color: 'var(--color-text-faint)', fontFamily: 'Space Mono, monospace' }}
            >
              {entry.stat.label}: {entry.stat.value}
            </span>
          </div>
        </div>

        {/* Right panel — description + tip + link */}
        <div className="lg:col-span-3 p-8 sm:p-10 flex flex-col justify-between gap-6">
          <div className="flex flex-col gap-5">
            <p
              className="text-base leading-loose"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {entry.description}
            </p>

            {/* Tip callout */}
            <div
              className="flex gap-3 p-4 rounded-xl"
              style={{
                background: `${entry.color}0D`,
                border: `1px solid ${entry.color}20`,
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke={entry.color}
                strokeWidth="2"
                strokeLinecap="round"
                className="flex-shrink-0 mt-0.5"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}
              >
                {entry.tip}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link
              to="/brewing-guides"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] transition-colors duration-200"
              style={{ color: entry.color, fontFamily: 'Space Mono, monospace', textDecoration: 'none' }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7' }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
            >
              Explore Brewing Guides
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <span
              className="text-[9px] uppercase tracking-[0.16em]"
              style={{ color: 'var(--color-text-faint)', fontFamily: 'Space Mono, monospace' }}
            >
              Refreshes daily
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Home() {
  const { articles, loading, error } = useGuardianArticles({ pageSize: 20 })
  const featured = articles.slice(0, 2)
  const trending  = articles.slice(2, 8)
  const brewOfTheDay = recipes[0]

  return (
    <div>
      <SEO title="Home" description="Coffee stories, brewing guides, recipes, and rituals for the discerning coffee mind. Explore origins, tasting notes, and more." />
      <HeroSection />

      {/* Featured Articles — Editor's Picks */}
      <section className="w-full max-w-[1600px] mx-auto px-8 sm:px-14 xl:px-20 py-20 sm:py-24">
        <motion.div {...fadeUp} className="mb-12">
          <p className="label-ornate mb-5">Featured Stories</p>
          <h2 className="font-display text-4xl md:text-5xl leading-tight" style={{ color: 'var(--color-text)' }}>Editor's Picks</h2>
        </motion.div>
        {error ? (
          <p className="text-sm py-12 text-center" style={{ color: 'var(--color-text-faint)' }}>Could not load articles. Check your connection.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {loading
              ? [0, 1].map((i) => <FeaturedSkeleton key={i} />)
              : featured.map((article) => (
                  <FeaturedArticle key={article.id} article={article} />
                ))}
          </div>
        )}
      </section>

      {/* Daily Coffee Card */}
      <section className="w-full max-w-[1600px] mx-auto px-8 sm:px-14 xl:px-20 pb-4">
        <motion.div {...fadeUp} className="mb-10">
          <p className="label-ornate mb-5">Today's Feature</p>
          <h2 className="font-display text-4xl md:text-5xl leading-tight" style={{ color: 'var(--color-text)' }}>Daily Coffee</h2>
        </motion.div>
        <DailyCoffeeCard />
      </section>

      {/* Trending Now */}
      <section className="w-full max-w-[1600px] mx-auto px-8 sm:px-14 xl:px-20 py-16 sm:py-20">
        <motion.div {...fadeUp} className="mb-12">
          <p className="label-ornate mb-5">What's Brewing</p>
          <h2 className="font-display text-4xl md:text-5xl leading-tight" style={{ color: 'var(--color-text)' }}>Trending Now</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <ArticleCardSkeleton key={i} />)
            : trending.map((article, i) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                >
                  <ArticleCard article={article} />
                </motion.div>
              ))}
        </div>
      </section>

      {/* Brew of the Day */}
      <section className="w-full max-w-[1600px] mx-auto px-8 sm:px-14 xl:px-20 py-16 sm:py-20">
        <motion.div
          {...fadeUp}
          className="rounded-3xl overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, #253E18, #0D1810)' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="p-6 sm:p-10 md:p-14 flex flex-col justify-center">
              <span className="text-[9px] uppercase tracking-[0.22em] font-medium mb-3" style={{ color: '#C9A84C', fontFamily: 'Space Mono, monospace', display: 'block' }}>
                Brew of the Day
              </span>
              <h2 className="font-display text-3xl md:text-4xl text-cream mb-4">{brewOfTheDay.title}</h2>
              <p className="text-cream/60 mb-6">
                {brewOfTheDay.steps[0]?.instruction}
              </p>
              <div className="flex items-center gap-6 mb-8">
                <div>
                  <p className="text-xs text-cream/40 uppercase tracking-wider mb-1">Total Time</p>
                  <p className="text-lg font-display text-gold">
                    {brewOfTheDay.brewTime >= 60
                      ? `${Math.round(brewOfTheDay.brewTime / 60)}h`
                      : `${brewOfTheDay.prepTime + brewOfTheDay.brewTime} min`}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-cream/40 uppercase tracking-wider mb-1">Difficulty</p>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((n) => (
                      <div
                        key={n}
                        className="w-2 h-2 rounded-full"
                        style={{ background: n <= brewOfTheDay.difficulty ? '#C9A84C' : '#2A3D20' }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <a
                href={`/recipe/${brewOfTheDay.slug}`}
                className="btn-solid self-start mt-2"
              >
                See Full Recipe
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </div>
            <div className="hidden md:block">
              <img
                src={brewOfTheDay.coverImage}
                alt={brewOfTheDay.title}
                className="w-full h-full object-cover"
                style={{ minHeight: '380px' }}
              />
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
