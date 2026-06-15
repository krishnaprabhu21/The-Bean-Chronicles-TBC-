import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { categories } from '../../data'

export function FeaturedArticle({ article, author }) {
  const category = categories.find((c) => c.slug === article.category)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative overflow-hidden group"
      style={{ border: '1px solid rgba(80,120,60,0.2)' }}
    >
      <Link to={`/article/${article.slug}`} className="block">
        {/* Mobile: stacked layout */}
        <div className="md:hidden">
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ filter: 'saturate(0.8) brightness(0.88)' }}
            />
          </div>
          <div className="p-6" style={{ background: '#1C2B14' }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[9px] uppercase tracking-[0.22em] font-medium" style={{ color: '#C9A84C' }}>Featured</span>
              {category && (
                <>
                  <span style={{ color: 'rgba(201,168,76,0.35)', fontSize: '10px' }}>✦</span>
                  <span className="text-[9px] uppercase tracking-[0.18em] font-medium" style={{ color: category.color }}>
                    {category.name}
                  </span>
                </>
              )}
            </div>
            <h2
              className="font-display text-2xl mb-3 leading-snug line-clamp-2 transition-colors duration-300"
              style={{ color: '#E8DFD0' }}
            >
              {article.title}
            </h2>
            <p className="text-sm leading-loose mb-5 line-clamp-3" style={{ color: 'rgba(232,223,208,0.55)' }}>
              {article.excerpt}
            </p>
            {author && (
              <div className="flex items-center gap-2.5 pt-4" style={{ borderTop: '1px solid rgba(80,120,60,0.15)' }}>
                <img src={author.avatar} alt={author.name} className="w-7 h-7 rounded-full object-cover" style={{ filter: 'saturate(0.6)', border: '1px solid rgba(201,168,76,0.4)' }} />
                <div>
                  <p className="text-xs text-parchment font-medium">{author.name}</p>
                  <p className="text-[10px]" style={{ color: 'rgba(232,223,208,0.4)' }}>{article.readTime} min read</p>
                </div>
              </div>
            )}
            <div className="mt-5 btn-outline inline-flex" style={{ padding: '0.5rem 0', border: 'none', borderBottom: '1px solid rgba(201,168,76,0.4)', borderRadius: 0, fontSize: '0.65rem' }}>
              Read Article →
            </div>
          </div>
        </div>

        {/* Desktop: overlay layout */}
        <div className="hidden md:block relative" style={{ minHeight: '440px' }}>
          <div className="absolute inset-0">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ filter: 'saturate(0.75) brightness(0.85)' }}
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(90deg, rgba(13,24,16,0.97) 0%, rgba(13,24,16,0.88) 40%, rgba(13,24,16,0.35) 70%, transparent 100%)' }}
            />
          </div>
          <div className="relative z-10 flex items-center h-full min-h-[440px]">
            <div className="p-12 max-w-lg">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[9px] uppercase tracking-[0.22em] font-medium" style={{ color: '#C9A84C' }}>Featured</span>
                {category && (
                  <>
                    <span style={{ color: 'rgba(201,168,76,0.35)', fontSize: '10px' }}>✦</span>
                    <span className="text-[9px] uppercase tracking-[0.18em] font-medium" style={{ color: category.color }}>
                      {category.name}
                    </span>
                  </>
                )}
              </div>
              <h2
                className="font-display text-3xl md:text-4xl mb-5 leading-tight line-clamp-3 transition-colors duration-300"
                style={{ color: '#E8DFD0' }}
              >
                {article.title}
              </h2>
              <p className="text-base leading-loose mb-7 line-clamp-3" style={{ color: 'rgba(232,223,208,0.6)' }}>
                {article.excerpt}
              </p>
              {author && (
                <div className="flex items-center gap-3 mb-7">
                  <img src={author.avatar} alt={author.name} className="w-9 h-9 rounded-full object-cover" style={{ filter: 'saturate(0.6)', border: '1px solid rgba(201,168,76,0.45)' }} />
                  <div>
                    <p className="text-sm text-parchment font-medium">{author.name}</p>
                    <p className="text-xs" style={{ color: 'rgba(232,223,208,0.45)' }}>{article.readTime} min · {article.publishDate}</p>
                  </div>
                </div>
              )}
              <span className="text-[10px] uppercase tracking-[0.22em] font-medium flex items-center gap-2 transition-all duration-200 group-hover:gap-4" style={{ color: '#C9A84C', fontFamily: 'Inter, sans-serif' }}>
                Read Article
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
