import { useParams, Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { useGuardianArticle } from '../hooks/useGuardianArticle'
import { useBookmarks } from '../hooks/useBookmarks'
import { SEO } from '../components/ui/SEO'
import { useToast } from '../contexts/ToastContext'
import { BlurImage } from '../components/ui/BlurImage'
import { useRecentlyViewed } from '../hooks/useRecentlyViewed'

function useReadAloud(text) {
  const [speaking, setSpeaking] = useState(false)
  const [paused, setPaused] = useState(false)
  const uttRef = useRef(null)

  useEffect(() => () => { window.speechSynthesis?.cancel() }, [])

  const start = () => {
    if (!text || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.rate = 0.95
    utt.onstart = () => { setSpeaking(true); setPaused(false) }
    utt.onend = () => { setSpeaking(false); setPaused(false) }
    utt.onerror = () => { setSpeaking(false); setPaused(false) }
    uttRef.current = utt
    window.speechSynthesis.speak(utt)
  }

  const pause = () => {
    window.speechSynthesis.pause()
    setPaused(true)
  }

  const resume = () => {
    window.speechSynthesis.resume()
    setPaused(false)
  }

  const stop = () => {
    window.speechSynthesis.cancel()
    setSpeaking(false)
    setPaused(false)
  }

  return { speaking, paused, start, pause, resume, stop }
}

export default function ArticleDetail() {
  const { '*': guardianId } = useParams()
  const { article, loading, error } = useGuardianArticle(guardianId)
  const { toggle, isBookmarked } = useBookmarks()
  const { addToast } = useToast()
  const { addItem } = useRecentlyViewed()

  useEffect(() => {
    if (article) addItem({ id: `article-${article.id}`, title: article.title, to: `/article/${article.id}`, type: 'article', coverImage: article.coverImage || null })
  }, [article?.id])

  const plainText = article?.content
    ? new DOMParser().parseFromString(article.content, 'text/html').body.innerText
    : article?.excerpt || ''
  const { speaking, paused, start, pause, resume, stop } = useReadAloud(plainText)
  const saved = article ? isBookmarked(article.id) : false

  return (
    <>
      <ProgressBar />
      <div className="pt-16 min-h-screen">

        {/* Loading skeleton */}
        {loading && (
          <div className="animate-pulse">
            <div className="w-full" style={{ height: '55vh', background: 'rgba(80,120,60,0.1)' }} />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 flex flex-col gap-5">
              <div className="h-3 w-24 rounded-full" style={{ background: 'rgba(80,120,60,0.15)' }} />
              <div className="h-10 w-full rounded" style={{ background: 'rgba(80,120,60,0.12)' }} />
              <div className="h-10 w-3/4 rounded" style={{ background: 'rgba(80,120,60,0.12)' }} />
              <div className="h-4 w-48 rounded-full" style={{ background: 'rgba(80,120,60,0.1)' }} />
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-3 rounded" style={{ background: 'rgba(80,120,60,0.08)', width: `${70 + Math.random() * 30}%` }} />
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center py-40 gap-5 text-center px-6">
            <p className="font-display text-3xl" style={{ color: 'var(--color-text-muted)' }}>Article not found</p>
            <p className="text-sm" style={{ color: 'var(--color-text-faint)' }}>{error}</p>
            <Link to="/" className="btn-outline mt-4">← Back to home</Link>
          </div>
        )}

        {/* Article */}
        {article && !loading && (
          <>
            <SEO
              title={article.title}
              description={article.excerpt}
              image={article.coverImage}
              type="article"
              schema={{
                '@context': 'https://schema.org',
                '@type': 'NewsArticle',
                headline: article.title,
                description: article.excerpt,
                image: article.coverImage,
                author: { '@type': 'Person', name: article.author },
                publisher: { '@type': 'Organization', name: 'The Bean Chronicles' },
                datePublished: article.publishDate,
                url: window.location.href,
              }}
            />
            {/* Cover image */}
            <BlurImage
              src={article.coverImage}
              alt={article.title}
              style={{ maxHeight: '62vh', minHeight: '40vh' }}
              imgStyle={{ filter: 'saturate(0.82) brightness(0.9)' }}
            />

            {/* Header */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 md:pt-14 pb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span
                  className="inline-block px-3 py-1 rounded-full text-[10px] font-medium mb-5 uppercase tracking-wider"
                  style={{ background: 'var(--color-accent-dim)', color: 'var(--color-accent)', border: '1px solid var(--color-accent-border)' }}
                >
                  {article.sectionName}
                </span>
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight" style={{ color: 'var(--color-text)' }}>
                  {article.title}
                </h1>
                <div className="flex items-center gap-4 pb-6" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                    style={{ background: 'var(--color-accent-dim)', color: 'var(--color-accent)', border: '1px solid var(--color-accent-border)' }}
                  >
                    {article.author?.[0] || 'G'}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{article.author}</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {article.publishDate} · {article.readTime} min read
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    {/* Bookmark button */}
                    <button
                      onClick={() => toggle(article)}
                      title={saved ? 'Remove bookmark' : 'Save to shelf'}
                      className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200"
                      style={{
                        background: saved ? 'var(--color-accent-dim)' : 'transparent',
                        border: '1px solid var(--color-accent-border)',
                        color: 'var(--color-accent)',
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                      </svg>
                    </button>

                    {/* Share button */}
                    <button
                      onClick={async () => {
                        const data = { title: article.title, text: article.excerpt, url: window.location.href }
                        if (navigator.share) {
                          try { await navigator.share(data) } catch (_) {}
                        } else {
                          await navigator.clipboard.writeText(window.location.href)
                          addToast({ message: 'Article link copied to clipboard', type: 'success' })
                        }
                      }}
                      title="Share article"
                      className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200"
                      style={{ background: 'transparent', border: '1px solid var(--color-accent-border)', color: 'var(--color-accent)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-accent-dim)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                      </svg>
                    </button>

                    {/* Read Aloud button */}
                    {window.speechSynthesis && (
                      <button
                        onClick={speaking ? (paused ? resume : pause) : start}
                        title={speaking ? (paused ? 'Resume reading' : 'Pause reading') : 'Read article aloud'}
                        className="flex items-center gap-1.5 px-3 h-9 rounded-full text-[10px] uppercase tracking-[0.14em] transition-all duration-200"
                        style={{
                          background: speaking ? 'var(--color-accent-dim)' : 'transparent',
                          border: '1px solid var(--color-accent-border)',
                          color: 'var(--color-accent)',
                          fontFamily: 'Space Mono, monospace',
                        }}
                      >
                        {speaking ? (
                          paused ? (
                            <><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> Resume</>
                          ) : (
                            <><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pause</>
                          )
                        ) : (
                          <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3v5z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3v5z"/></svg> Listen</>
                        )}
                      </button>
                    )}
                    {speaking && (
                      <button onClick={stop} className="w-7 h-7 flex items-center justify-center rounded-full transition-all duration-200" style={{ border: '1px solid var(--color-accent-border)', color: 'var(--color-accent-border)' }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
                      </button>
                    )}

                    {/* Guardian link */}
                    <a
                      href={article.webUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden sm:flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] transition-colors duration-200"
                      style={{ color: 'var(--color-accent-border)', fontFamily: 'Space Mono, monospace', textDecoration: 'none' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-accent)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-accent-border)' }}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      The Guardian
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Body */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="max-w-3xl mx-auto px-4 sm:px-6 pb-20"
            >
              {article.content ? (
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              ) : (
                <div className="flex flex-col items-center gap-5 py-16 text-center">
                  <p className="text-base leading-loose max-w-md" style={{ color: 'var(--color-text-muted)' }}>
                    Full article body is available on The Guardian. Click below to read the complete piece.
                  </p>
                  <a
                    href={article.webUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-solid"
                  >
                    Read on The Guardian
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </a>
                </div>
              )}

              {/* Guardian attribution */}
              <div
                className="mt-14 pt-8 flex items-center justify-between gap-4"
                style={{ borderTop: '1px solid var(--color-border)' }}
              >
                <p className="text-[10px] uppercase tracking-[0.18em]" style={{ color: 'var(--color-text-faint)', fontFamily: 'Space Mono, monospace' }}>
                  Content © The Guardian
                </p>
                <a
                  href={article.webUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] uppercase tracking-[0.18em] transition-colors duration-200"
                  style={{ color: 'var(--color-accent-border)', fontFamily: 'Space Mono, monospace', textDecoration: 'none' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-accent)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-accent-border)' }}
                >
                  View original →
                </a>
              </div>
            </motion.div>
          </>
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
