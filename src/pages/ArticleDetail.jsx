import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { articles, authors, categories } from '../data'
import { AuthorBio } from '../components/ui/AuthorBio'
import { ArticleCard } from '../components/ui/ArticleCard'
import { useScrollProgress } from '../hooks/useScrollProgress'

export default function ArticleDetail() {
  const { slug } = useParams()
  const article = articles.find((a) => a.slug === slug)

  if (!article) return <Navigate to="/" replace />

  const author = authors.find((a) => a.id === article.authorId)
  const category = categories.find((c) => c.slug === article.category)
  const related = articles.filter((a) => a.category === article.category && a.id !== article.id).slice(0, 3)

  return (
    <>
      <ProgressBar />
      <div className="pt-16">
        {/* Cover image */}
        <div className="w-full aspect-[16/9] md:aspect-auto overflow-hidden" style={{ maxHeight: '65vh' }}>
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article header */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 md:pt-12 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {category && (
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-5 uppercase tracking-wider"
                style={{ background: category.color + '22', color: category.color, border: `1px solid ${category.color}44` }}
              >
                {category.name}
              </span>
            )}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-cream mb-6 leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 pb-8 border-b" style={{ borderColor: 'rgba(139,94,60,0.2)' }}>
              {author && (
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-10 h-10 rounded-full object-cover border"
                  style={{ borderColor: '#D4A853' }}
                />
              )}
              <div>
                {author && <p className="text-sm font-medium text-cream">{author.name}</p>}
                <p className="text-xs text-cream/50">
                  {article.publishDate} · {article.readTime} min read
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Article body */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="max-w-3xl mx-auto px-4 sm:px-6 pb-16"
        >
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </motion.div>

        {/* Tags */}
        {article.tags?.length > 0 && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-10 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full"
                style={{ background: 'rgba(139,94,60,0.15)', color: '#8B5E3C', border: '1px solid rgba(139,94,60,0.25)' }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Author bio */}
        {author && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
            <AuthorBio author={author} />
          </div>
        )}

        {/* Related articles */}
        {related.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 pb-20">
            <div className="mb-8 border-t pt-12" style={{ borderColor: 'rgba(139,94,60,0.2)' }}>
              <span className="text-gold text-xs uppercase tracking-widest font-semibold">More Like This</span>
              <h2 className="font-display text-2xl text-cream mt-1">Related Articles</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((rel) => {
                const relAuthor = authors.find((a) => a.id === rel.authorId)
                return <ArticleCard key={rel.id} article={rel} author={relAuthor} />
              })}
            </div>
          </section>
        )}
      </div>
    </>
  )
}

function ProgressBar() {
  const progress = useScrollProgress()
  return (
    <div
      className="fixed top-0 left-0 z-[60] h-1 transition-all duration-100"
      style={{ width: `${progress * 100}%`, background: '#D4A853' }}
    />
  )
}
