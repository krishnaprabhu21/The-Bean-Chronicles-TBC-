import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { categories } from '../../data'

export function ArticleCard({ article, author }) {
  const category = categories.find((c) => c.slug === article.category)

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="group overflow-hidden"
      style={{ border: '1px solid rgba(80,120,60,0.2)', background: '#1C2B14' }}
    >
      <Link to={`/article/${article.slug}`} className="block">
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ filter: 'saturate(0.85) brightness(0.92)' }}
          />
        </div>
        <div className="p-7 sm:p-8">
          {category && (
            <span
              className="inline-block text-[9px] uppercase tracking-[0.22em] font-medium mb-5"
              style={{ color: '#C9A84C' }}
            >
              {category.name}
            </span>
          )}
          <h3
            className="font-display text-lg leading-snug mb-4 line-clamp-2 transition-colors duration-200"
            style={{ color: '#E8DFD0' }}
          >
            {article.title}
          </h3>
          <p className="text-sm line-clamp-2 mb-7 leading-loose" style={{ color: 'rgba(232,223,208,0.52)' }}>
            {article.excerpt}
          </p>
          <div className="flex items-center gap-3 pt-5" style={{ borderTop: '1px solid rgba(80,120,60,0.15)' }}>
            {author && (
              <>
                <img src={author.avatar} alt={author.name} className="w-6 h-6 rounded-full object-cover" style={{ filter: 'saturate(0.7)' }} />
                <span className="text-[11px] uppercase tracking-wider" style={{ color: 'rgba(232,223,208,0.45)', letterSpacing: '0.12em' }}>{author.name}</span>
                <span style={{ color: 'rgba(201,168,76,0.4)', fontSize: '10px' }}>✦</span>
              </>
            )}
            <span className="text-[11px]" style={{ color: 'rgba(232,223,208,0.35)' }}>{article.readTime} min</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
