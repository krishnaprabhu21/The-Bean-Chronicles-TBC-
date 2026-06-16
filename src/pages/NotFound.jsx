import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SEO } from '../components/ui/SEO'
import { useTheme } from '../contexts/ThemeContext'

function EmptyCupIllustration() {
  return (
    <svg
      width="160" height="180"
      viewBox="0 0 160 180"
      fill="none"
      style={{ color: 'var(--color-accent)' }}
    >
      {/* Saucer */}
      <ellipse cx="80" cy="158" rx="58" ry="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
      {/* Cup body */}
      <path
        d="M32 68 L40 148 Q40 154 80 154 Q120 154 120 148 L128 68 Z"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Cup rim ellipse */}
      <ellipse cx="80" cy="68" rx="48" ry="10" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.7" />
      {/* Handle */}
      <path
        d="M120 88 Q148 88 148 108 Q148 128 120 128"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"
      />
      {/* Empty interior indicator — just a faint ellipse inside */}
      <ellipse cx="80" cy="80" rx="34" ry="6" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.2" />
      {/* Tipped/spilled beans outside cup */}
      <ellipse cx="28" cy="145" rx="7" ry="4.5" transform="rotate(-25 28 145)" stroke="currentColor" strokeWidth="1.8" strokeOpacity="0.55" />
      <path d="M28 141 Q31 145 28 149" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.45" strokeLinecap="round" />
      <ellipse cx="14" cy="158" rx="6" ry="4" transform="rotate(15 14 158)" stroke="currentColor" strokeWidth="1.8" strokeOpacity="0.45" />
      <path d="M14 154 Q17 158 14 162" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.35" strokeLinecap="round" />
      <ellipse cx="136" cy="148" rx="6.5" ry="4" transform="rotate(-10 136 148)" stroke="currentColor" strokeWidth="1.8" strokeOpacity="0.5" />
      <path d="M136 144 Q139 148 136 152" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.4" strokeLinecap="round" />
      {/* Steam lines — but ghosted/faded since cup is empty */}
      <path d="M60 52 Q57 44 60 36" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.18" />
      <path d="M80 48 Q77 40 80 32" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.12" />
      <path d="M100 52 Q97 44 100 36" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.18" />
    </svg>
  )
}

export default function NotFound() {
  const { theme } = useTheme()
  const isLight = theme === 'light'

  const heroBg = isLight
    ? 'radial-gradient(ellipse 70% 55% at 50% 30%, rgba(220,196,148,0.6) 0%, var(--color-bg) 100%)'
    : 'radial-gradient(ellipse 70% 55% at 50% 30%, rgba(45,27,20,0.8) 0%, var(--color-bg) 100%)'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center" style={{ background: heroBg }}>
      <SEO title="Page Not Found" description="This page has gone cold — but there's plenty more brewing at The Bean Chronicles." />

      {/* Animated cup illustration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="mb-10"
      >
        <motion.div
          animate={{ rotate: [-1.5, 1.5, -1.5] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        >
          <EmptyCupIllustration />
        </motion.div>
      </motion.div>

      {/* 404 label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <p
          className="font-mono text-sm uppercase tracking-[0.3em] mb-4"
          style={{ color: 'var(--color-accent)', fontFamily: 'Space Mono, monospace' }}
        >
          Error 404 &nbsp;·&nbsp; Cup Empty
        </p>

        <h1
          className="font-display leading-tight mb-5"
          style={{ color: 'var(--color-text)', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}
        >
          This page has gone cold
        </h1>

        {/* Gold rule */}
        <div style={{ width: 48, height: 2, background: 'linear-gradient(90deg, var(--color-accent), transparent)', margin: '0 auto 1.5rem' }} />

        <p
          className="text-base leading-relaxed mb-10 max-w-[38ch] mx-auto"
          style={{ color: 'var(--color-text-muted)', fontFamily: 'Inter, sans-serif' }}
        >
          Looks like we spilled the beans. The page you're looking for doesn't exist — but there's plenty more brewing.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/" className="btn-solid">
            Back to Home
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <Link to="/recipes" className="btn-outline">
            Explore Recipes
          </Link>
        </div>
      </motion.div>

      {/* Decorative beans scattered below */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-16 flex items-center gap-3"
        style={{ color: 'var(--color-accent)' }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.svg
            key={i}
            width="10" height="13" viewBox="0 0 24 32" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            style={{ opacity: 0.15 + i * 0.07, transform: `rotate(${(i - 2) * 18}deg)` }}
          >
            <ellipse cx="12" cy="16" rx="8" ry="12" />
            <path d="M12 4 C8 10 8 22 12 28" />
          </motion.svg>
        ))}
      </motion.div>
    </div>
  )
}
