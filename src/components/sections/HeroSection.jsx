import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const headline = ['The Art of', 'the Perfect', 'Cup.']

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
}
const line = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-end overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-bg" />
      {/* Gradient overlay — green-tinted */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(160deg, rgba(13,24,16,0.72) 0%, rgba(13,24,16,0.55) 40%, rgba(13,24,16,0.92) 100%)',
        }}
      />
      {/* Grain (reinforced in hero) */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23g)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* Section number — top left */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute top-24 left-6 sm:left-10 section-num"
      >
        01 / Hero
      </motion.div>

      {/* Stamp badge — top right */}
      <motion.div
        initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ delay: 1.4, duration: 0.8, type: 'spring' }}
        className="absolute top-24 right-6 sm:right-10 stamp-badge hidden sm:flex"
      >
        <span style={{ fontSize: '6px', letterSpacing: '0.18em', color: 'rgba(201,168,76,0.5)', textTransform: 'uppercase' }}>Field</span>
        <span style={{ fontSize: '11px', color: 'rgba(201,168,76,0.8)' }}>✦</span>
        <span style={{ fontSize: '6px', letterSpacing: '0.18em', color: 'rgba(201,168,76,0.5)', textTransform: 'uppercase' }}>Notes</span>
      </motion.div>

      {/* Main content — bottom-left editorial alignment */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 pb-20 md:pb-28">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="label-ornate mb-8"
        >
          The Bean Chronicles
        </motion.p>

        <motion.h1
          variants={container}
          initial="hidden"
          animate="show"
          className="font-display font-black leading-none mb-8"
          style={{ fontSize: 'clamp(3.5rem, 9vw, 8.5rem)', color: '#E8DFD0' }}
        >
          {headline.map((lineText, i) => (
            <motion.span
              key={i}
              variants={line}
              className="block"
              style={i === 2 ? { color: '#C9A84C', fontStyle: 'italic' } : {}}
            >
              {lineText}
            </motion.span>
          ))}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="max-w-md mb-10"
        >
          <div className="w-12 h-px mb-6" style={{ background: 'rgba(201,168,76,0.5)' }} />
          <p className="text-parchment/65 text-base md:text-lg leading-loose">
            From origin to cup — stories, recipes and rituals for the discerning coffee mind.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link to="/recipes" className="btn-solid">
            Explore Recipes
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <Link to="/culture" className="btn-outline">
            Coffee Origins
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator — vertical line + text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-10 right-6 sm:right-10 flex flex-col items-center gap-3"
      >
        <span
          className="text-[9px] uppercase tracking-[0.25em] rotate-90 origin-center mb-2"
          style={{ color: 'rgba(201,168,76,0.45)', fontFamily: 'Space Mono, monospace' }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ scaleY: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-px h-12 origin-top"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.5))' }}
        />
      </motion.div>
    </section>
  )
}
