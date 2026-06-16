import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SEO } from '../components/ui/SEO'
import { BeanCatcherGame } from './BeanCatcher'

// ── SVG Icons ─────────────────────────────────────────────────────────────────

function IconTasting() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="28" r="12" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M20 22C20 18 24 14 24 14C24 14 28 18 28 22" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M17 32C17 32 18.5 36 24 36C29.5 36 31 32 31 32" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="24" cy="28" r="3" fill="rgba(201,168,76,0.25)" stroke="#C9A84C" strokeWidth="1.2"/>
      <path d="M24 8V11" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M36 14L34 16" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 14L14 16" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function IconCalculator() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="8" width="28" height="32" rx="3" stroke="#C9A84C" strokeWidth="1.5"/>
      <rect x="14" y="12" width="20" height="8" rx="1.5" stroke="#C9A84C" strokeWidth="1.2" fill="rgba(201,168,76,0.1)"/>
      <circle cx="17" cy="26" r="2" fill="rgba(201,168,76,0.25)" stroke="#C9A84C" strokeWidth="1.2"/>
      <circle cx="24" cy="26" r="2" fill="rgba(201,168,76,0.25)" stroke="#C9A84C" strokeWidth="1.2"/>
      <circle cx="31" cy="26" r="2" fill="rgba(201,168,76,0.25)" stroke="#C9A84C" strokeWidth="1.2"/>
      <circle cx="17" cy="33" r="2" fill="rgba(201,168,76,0.25)" stroke="#C9A84C" strokeWidth="1.2"/>
      <circle cx="24" cy="33" r="2" fill="rgba(201,168,76,0.25)" stroke="#C9A84C" strokeWidth="1.2"/>
      <rect x="29" y="31" width="4" height="4" rx="1" fill="rgba(201,168,76,0.3)" stroke="#C9A84C" strokeWidth="1.2"/>
    </svg>
  )
}

function IconGlossary() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 10H30C31.1 10 32 10.9 32 12V38C32 39.1 31.1 40 30 40H12C10.9 40 10 39.1 10 38V12C10 10.9 10.9 10 12 10Z" stroke="#C9A84C" strokeWidth="1.5"/>
      <path d="M32 14H36C37.1 14 38 14.9 38 16V38C38 39.1 37.1 40 36 40H32" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M15 18H27" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M15 23H27" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M15 28H22" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M19 8V12" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M23 8V12" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function IconCompare() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="12" width="16" height="26" rx="3" stroke="#C9A84C" strokeWidth="1.5" fill="rgba(201,168,76,0.05)"/>
      <rect x="26" y="12" width="16" height="26" rx="3" stroke="#C9A84C" strokeWidth="1.5" fill="rgba(201,168,76,0.05)"/>
      <path d="M14 20H16" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10 24H16" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 28H16" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M30 20H36" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M30 24H34" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M30 28H36" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M22 24H26" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 1"/>
    </svg>
  )
}

function IconJournal() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="8" width="28" height="34" rx="3" stroke="#C9A84C" strokeWidth="1.5"/>
      <path d="M10 16H38" stroke="#C9A84C" strokeWidth="1.2" strokeDasharray="2 2"/>
      <path d="M18 8V42" stroke="#C9A84C" strokeWidth="1.5"/>
      <path d="M22 22L26 22" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M22 27L30 27" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M22 32L28 32" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="15" cy="24" r="1.5" fill="#C9A84C"/>
      <circle cx="15" cy="29" r="1.5" fill="#C9A84C"/>
      <circle cx="15" cy="34" r="1.5" fill="#C9A84C"/>
    </svg>
  )
}

function IconSubmit() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 8V30" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M18 14L24 8L30 14" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 22V36C14 37.1 14.9 38 16 38H32C33.1 38 34 37.1 34 36V22" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

// ── Tool cards data ───────────────────────────────────────────────────────────

const TOOLS = [
  {
    id: 'tasting',
    to: '/tasting',
    eyebrow: 'The Flavour Lab',
    name: 'Tasting Notes',
    description: 'Generate your personalised coffee tasting profile',
    Icon: IconTasting,
  },
  {
    id: 'calculator',
    to: '/calculator',
    eyebrow: "The Brewmaster's Workshop",
    name: 'Brew Calculator',
    description: 'Dial in your perfect dose and ratio',
    Icon: IconCalculator,
  },
  {
    id: 'glossary',
    to: '/glossary',
    eyebrow: 'The Lexicon',
    name: 'Glossary',
    description: 'A–Z of every coffee term you\'ll ever need',
    Icon: IconGlossary,
  },
  {
    id: 'compare',
    to: '/compare',
    eyebrow: 'The Tasting Room',
    name: 'Compare Methods',
    description: 'Head-to-head comparisons of any two brew methods',
    Icon: IconCompare,
  },
  {
    id: 'journal',
    to: '/journal',
    eyebrow: "The Barista's Notebook",
    name: 'Brew Journal',
    description: 'Log and track every brew you make',
    Icon: IconJournal,
  },
  {
    id: 'submit-recipe',
    to: '/submit-recipe',
    eyebrow: 'Community Brews',
    name: 'Submit Recipe',
    description: 'Share your signature recipe with the community',
    Icon: IconSubmit,
  },
]

// ── ToolCard ──────────────────────────────────────────────────────────────────

function ToolCard({ tool, index }) {
  const [hovered, setHovered] = useState(false)
  const { to, eyebrow, name, description, Icon } = tool

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: 'easeOut' }}
    >
      <Link
        to={to}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '1.75rem',
          background: 'var(--color-surface)',
          border: `1px solid ${hovered ? 'rgba(201,168,76,0.4)' : 'rgba(80,120,60,0.2)'}`,
          borderRadius: '1.25rem',
          textDecoration: 'none',
          height: '100%',
          transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
          transform: hovered ? 'scale(1.03)' : 'scale(1)',
          boxShadow: hovered ? '0 8px 40px rgba(201,168,76,0.08)' : 'none',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle glow on hover */}
        {hovered && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)',
            }}
          />
        )}

        {/* Icon */}
        <div
          style={{
            width: '3.5rem',
            height: '3.5rem',
            borderRadius: '0.875rem',
            background: 'rgba(201,168,76,0.08)',
            border: '1px solid rgba(201,168,76,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
            transition: 'background 0.25s',
            ...(hovered ? { background: 'rgba(201,168,76,0.14)' } : {}),
          }}
        >
          <Icon />
        </div>

        {/* Eyebrow */}
        <p
          style={{
            fontFamily: '"Space Mono", monospace',
            fontSize: '0.62rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
            marginBottom: '0.4rem',
            margin: '0 0 0.4rem',
          }}
        >
          {eyebrow}
        </p>

        {/* Name */}
        <h3
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '1.4rem',
            color: 'var(--color-text)',
            lineHeight: 1.2,
            marginBottom: '0.6rem',
            margin: '0 0 0.6rem',
          }}
        >
          {name}
        </h3>

        {/* Description */}
        <p
          style={{
            color: 'var(--color-text-muted)',
            fontSize: '0.875rem',
            lineHeight: 1.6,
            margin: '0',
            flex: 1,
          }}
        >
          {description}
        </p>

        {/* Arrow */}
        <div
          style={{
            marginTop: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            overflow: 'hidden',
          }}
        >
          <motion.span
            animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            style={{
              color: 'var(--color-accent)',
              fontSize: '0.8rem',
              fontFamily: '"Space Mono", monospace',
              letterSpacing: '0.06em',
            }}
          >
            Explore →
          </motion.span>
        </div>
      </Link>
    </motion.div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Tools() {
  const [email, setEmail] = useState('')
  const [ctaSubmitted, setCtaSubmitted] = useState(false)

  useEffect(() => {
    if (window.location.hash === '#play') {
      const el = document.getElementById('play')
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
    }
  }, [])

  function handleCta(e) {
    e.preventDefault()
    if (email.trim()) setCtaSubmitted(true)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <SEO title="Coffee Tools" description="Interactive coffee tools — tasting notes generator, brew calculator, glossary, comparison tool, and brew journal." />
      <div style={{ paddingTop: '6rem' }}>
        {/* Hero */}
        <section style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem 2.5rem', textAlign: 'center' }}>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              fontFamily: '"Space Mono", monospace',
              fontSize: '0.72rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
              marginBottom: '1rem',
            }}
          >
            ✦ The Workshop ✦
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              color: 'var(--color-text)',
              lineHeight: 1.1,
              marginBottom: '1.25rem',
            }}
          >
            Coffee{' '}
            <span style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>/ Tools</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{
              color: 'rgba(232,223,208,0.65)',
              fontSize: '1.05rem',
              maxWidth: '540px',
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            Interactive tools for the curious coffee mind — from dialling in ratios to building your brew journal.
          </motion.p>
        </section>

        {/* Divider */}
        <div style={{ maxWidth: '900px', margin: '0 auto 3rem', padding: '0 1.5rem' }}>
          <div
            style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(80,120,60,0.4), transparent)',
            }}
          />
        </div>

        {/* Tool cards grid */}
        <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
              gap: '1.25rem',
            }}
          >
            {TOOLS.map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} index={i} />
            ))}
          </div>
        </section>

        {/* ── Bean Catcher: The Arcade ── */}
        <section
          id="play"
          style={{ scrollMarginTop: '5.5rem', maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem 2rem' }}
        >
          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(80,120,60,0.4), transparent)', marginBottom: '3rem' }} />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: '2rem' }}
          >
            <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.75rem' }}>
              ✦ The Arcade ✦
            </p>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--color-text)', lineHeight: 1.1, marginBottom: '0.75rem' }}>
              Bean{' '}
              <span style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>Catcher</span>
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', maxWidth: '400px', margin: '0 auto', lineHeight: 1.6 }}>
              A quick coffee break — catch the good beans, dodge the burnt ones.
            </p>
          </motion.div>
          <BeanCatcherGame />
        </section>

        {/* More coming soon + CTA */}
        <section style={{ maxWidth: '700px', margin: '0 auto', padding: '0 1.5rem 6rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid rgba(201,168,76,0.18)',
              borderRadius: '1.5rem',
              padding: '2.5rem 2rem',
              textAlign: 'center',
            }}
          >
            {/* Ornament */}
            <div
              style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '50%',
                background: 'rgba(201,168,76,0.1)',
                border: '1px solid rgba(201,168,76,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                margin: '0 auto 1.25rem',
              }}
            >
              ☕
            </div>

            <p
              style={{
                fontFamily: '"Space Mono", monospace',
                fontSize: '0.68rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-accent)',
                marginBottom: '0.75rem',
              }}
            >
              More Coming Soon
            </p>

            <h2
              style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: '1.8rem',
                color: 'var(--color-text)',
                lineHeight: 1.2,
                marginBottom: '0.75rem',
              }}
            >
              Stay in the loop
            </h2>

            <p
              style={{
                color: 'var(--color-text-muted)',
                fontSize: '0.95rem',
                lineHeight: 1.7,
                maxWidth: '400px',
                margin: '0 auto 1.75rem',
              }}
            >
              New tools drop regularly. Be the first to know when we launch the next one — from AI roast profiling to origin deep dives.
            </p>

            {ctaSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  color: '#4ade80',
                  fontSize: '0.95rem',
                }}
              >
                <span>✓</span>
                <span>You're on the list!</span>
              </motion.div>
            ) : (
              <form
                onSubmit={handleCta}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  maxWidth: '440px',
                  margin: '0 auto',
                  flexWrap: 'wrap',
                }}
              >
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: '200px',
                    background: 'var(--color-card)',
                    border: '1px solid rgba(80,120,60,0.3)',
                    borderRadius: '0.75rem',
                    color: 'var(--color-text)',
                    padding: '0.7rem 1rem',
                    fontSize: '0.9rem',
                    outline: 'none',
                    fontFamily: 'Inter, sans-serif',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: 'var(--color-accent)',
                    border: 'none',
                    borderRadius: '0.75rem',
                    color: 'var(--color-bg)',
                    padding: '0.7rem 1.5rem',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    fontFamily: '"Space Mono", monospace',
                    letterSpacing: '0.05em',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    transition: 'opacity 0.15s',
                  }}
                >
                  Notify Me
                </button>
              </form>
            )}

            <p
              style={{
                color: 'var(--color-text-faint)',
                fontSize: '0.72rem',
                marginTop: '1rem',
                fontFamily: '"Space Mono", monospace',
              }}
            >
              No spam. Unsubscribe any time.
            </p>
          </motion.div>
        </section>
      </div>
    </div>
  )
}
