import { motion } from 'framer-motion'
import { SEO } from '../components/ui/SEO'
import { HeroSection } from '../components/sections/HeroSection'
import { FeaturedArticle } from '../components/sections/FeaturedArticle'
import { ArticleCard, ArticleCardSkeleton } from '../components/ui/ArticleCard'
import { RecipeCard } from '../components/ui/RecipeCard'
import { NewsletterCTA } from '../components/ui/NewsletterCTA'
import { recipes } from '../data'
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
