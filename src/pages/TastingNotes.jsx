import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BackButton } from '../components/ui/BackButton'
import { SEO } from '../components/ui/SEO'

// ── Data ─────────────────────────────────────────────────────────────────────

const ROAST_BASE = {
  light:  { body: 'Tea-like', acidity: 'Bright & sparkling', finish: 'Clean, lingering citrus' },
  medium: { body: 'Balanced', acidity: 'Medium, fruit-driven', finish: 'Smooth caramel fade' },
  dark:   { body: 'Full & bold', acidity: 'Low, rounded', finish: 'Dark chocolate & smoke' },
}

const ORIGIN_NOTES = {
  Ethiopia:   ['Blueberry', 'Jasmine', 'Bergamot', 'Stone fruit'],
  Colombia:   ['Red apple', 'Caramel', 'Hazelnut', 'Brown sugar'],
  Brazil:     ['Chocolate', 'Peanut', 'Walnut', 'Milk chocolate'],
  Guatemala:  ['Honey', 'Dark cherry', 'Toffee', 'Citrus peel'],
  Honduras:   ['Brown sugar', 'Stone fruit', 'Roasted almond', 'Orange zest'],
  'Costa Rica': ['Honey', 'Bright citrus', 'Red apple', 'Brown sugar'],
  Kenya:      ['Blackcurrant', 'Tomato', 'Grapefruit', 'Wine-like'],
  Uganda:     ['Dark chocolate', 'Black pepper', 'Red berries', 'Earthy'],
  Vietnam:    ['Dark chocolate', 'Earthy', 'Woody', 'Malt'],
  Sumatra:    ['Earthy', 'Cedar', 'Leather', 'Tobacco'],
  Yemen:      ['Raisin', 'Cardamom', 'Dried fig', 'Dark honey'],
  Peru:       ['Milk chocolate', 'Green apple', 'Almond', 'Light floral'],
  Panama:     ['Jasmine', 'Peach', 'Tropical fruit', 'Brown sugar'],
  India:      ['Cardamom', 'Dark chocolate', 'Earthy malt', 'Spice'],
  Jamaica:    ['Smooth almond', 'Light chocolate', 'Mild citrus', 'Clean finish'],
}

const METHOD_SUFFIX = {
  'Espresso':      'concentrated and intense, with a thick crema.',
  'Pour Over':     'clean and nuanced, allowing each note to sing.',
  'French Press':  'rich and full-bodied, with a velvety mouthfeel.',
  'AeroPress':     'smooth and versatile, bright with low bitterness.',
  'Cold Brew':     'silky and mellow, with chocolate undertones.',
  'Moka Pot':      'bold and robust, close to espresso in character.',
}

const ORIGINS = [
  'Ethiopia', 'Colombia', 'Brazil', 'Guatemala', 'Honduras', 'Costa Rica',
  'Kenya', 'Uganda', 'Vietnam', 'Sumatra', 'Yemen', 'Peru', 'Panama', 'India', 'Jamaica',
]
const METHODS = ['Espresso', 'Pour Over', 'French Press', 'AeroPress', 'Cold Brew', 'Moka Pot']

const ROAST_CARDS = [
  {
    id: 'light',
    label: 'Light',
    sub: 'Bright & Floral',
    temp: '196–205 °F',
  },
  {
    id: 'medium',
    label: 'Medium',
    sub: 'Balanced & Sweet',
    temp: '210–220 °F',
  },
  {
    id: 'dark',
    label: 'Dark',
    sub: 'Bold & Smoky',
    temp: '225–230 °F',
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function generateNote(roast, origin, method) {
  const base = ROAST_BASE[roast]
  const notes = ORIGIN_NOTES[origin]
  const suffix = METHOD_SUFFIX[method]
  return `A ${base.body} cup from ${origin}, opening with notes of ${notes[0]} and ${notes[1]}, edging into ${notes[2]}. The acidity is ${base.acidity}. Brewed as ${method}, this coffee is ${suffix} Finish: ${base.finish}.`
}

// ── SVG Decorations ──────────────────────────────────────────────────────────

function BeanIcon({ size = 36, color = '#C9A84C', opacity = 0.9 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <ellipse cx="18" cy="18" rx="10" ry="15" stroke={color} strokeWidth="1.6" strokeOpacity={opacity} fill="none" />
      <path d="M18 3 Q26 18 18 33" stroke={color} strokeWidth="1.4" strokeOpacity={opacity} strokeLinecap="round" fill="none" />
    </svg>
  )
}

function CuppingWheelDecoration() {
  const arcs = [0, 40, 80, 120, 160, 200, 240, 280, 320]
  return (
    <svg
      width="180"
      height="180"
      viewBox="0 0 180 180"
      fill="none"
      aria-hidden="true"
      className="absolute -top-8 -right-8 opacity-[0.12] pointer-events-none"
    >
      <circle cx="90" cy="90" r="80" stroke="#C9A84C" strokeWidth="0.8" />
      <circle cx="90" cy="90" r="60" stroke="#C9A84C" strokeWidth="0.6" />
      <circle cx="90" cy="90" r="40" stroke="#C9A84C" strokeWidth="0.5" />
      {arcs.map((deg) => {
        const rad = (deg * Math.PI) / 180
        const x1 = 90 + 40 * Math.cos(rad)
        const y1 = 90 + 40 * Math.sin(rad)
        const x2 = 90 + 80 * Math.cos(rad)
        const y2 = 90 + 80 * Math.sin(rad)
        return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C9A84C" strokeWidth="0.6" />
      })}
    </svg>
  )
}

// ── Step Progress Indicator ──────────────────────────────────────────────────

function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div
            className="transition-all duration-300"
            style={{
              width: i < current ? 28 : 8,
              height: 8,
              borderRadius: 4,
              background: i < current ? 'var(--color-accent)' : i === current ? 'var(--color-accent-border)' : 'rgba(201,168,76,0.15)',
            }}
          />
        </div>
      ))}
      <span
        className="ml-2 text-[10px] uppercase tracking-[0.2em]"
        style={{ color: 'rgba(201,168,76,0.6)', fontFamily: 'Space Mono, monospace' }}
      >
        Step {current + 1} of {total}
      </span>
    </div>
  )
}

// ── Tasting Note Card ────────────────────────────────────────────────────────

function TastingCard({ roast, origin, method, onRegenerate }) {
  const [copied, setCopied] = useState(false)
  const noteText = generateNote(roast, origin, method)
  const tags = ORIGIN_NOTES[origin].slice(0, 3)

  const handleCopy = () => {
    navigator.clipboard.writeText(noteText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl overflow-hidden p-8"
      style={{
        border: '1px solid rgba(201,168,76,0.35)',
        background: 'var(--color-card)',
      }}
    >
      <CuppingWheelDecoration />

      {/* Header row */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: 48,
            height: 48,
            background: 'rgba(201,168,76,0.08)',
            border: '1px solid rgba(201,168,76,0.25)',
          }}
        >
          <BeanIcon size={24} />
        </div>
        <div>
          <p
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ color: 'rgba(201,168,76,0.6)', fontFamily: 'Space Mono, monospace' }}
          >
            Tasting Profile
          </p>
          <p className="font-display text-base" style={{ color: 'var(--color-text)' }}>
            {roast.charAt(0).toUpperCase() + roast.slice(1)} · {origin} · {method}
          </p>
        </div>
      </div>

      {/* Generated note */}
      <blockquote
        className="font-display italic text-xl leading-relaxed mb-7 relative z-10"
        style={{ color: 'var(--color-text)' }}
      >
        &ldquo;{noteText}&rdquo;
      </blockquote>

      {/* Flavour tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full px-3 py-1 text-xs"
            style={{
              background: 'rgba(201,168,76,0.1)',
              color: 'var(--color-accent)',
              border: '1px solid rgba(201,168,76,0.25)',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(201,168,76,0.12)', marginBottom: '1.5rem' }} />

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <button className="btn-outline" onClick={onRegenerate}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          Regenerate
        </button>
        <button className="btn-solid" onClick={handleCopy}>
          {copied ? (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy to Clipboard
            </>
          )}
        </button>
      </div>
    </motion.div>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function TastingNotes() {
  const [roast, setRoast]   = useState(null)
  const [origin, setOrigin] = useState(null)
  const [method, setMethod] = useState(null)

  // Determine how many steps are "unlocked"
  const currentStep = roast === null ? 0 : origin === null ? 1 : method === null ? 2 : 3
  const allSelected = roast && origin && method

  const handleReset = () => {
    setRoast(null)
    setOrigin(null)
    setMethod(null)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <SEO title="Tasting Notes Generator" description="Generate professional tasting notes for any coffee — pick a roast, origin, and brew method to describe your cup." />
      <BackButton to="/tools" label="Tools" />
      <style>{`input[type=range] { accent-color: #C9A84C; }`}</style>

      {/* ── Page hero ──────────────────────────────────────────────── */}
      <section className="pt-24 pb-16 px-6 text-center relative overflow-hidden">
        {/* Dot-grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #C9A84C 1px, transparent 0)`,
            backgroundSize: '28px 28px',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <p
            className="text-[10px] uppercase tracking-[0.28em] mb-3"
            style={{ color: 'rgba(201,168,76,0.7)', fontFamily: 'Space Mono, monospace' }}
          >
            The Flavour Lab
          </p>
          <div className="label-ornate justify-center mb-5">
            Sensory Profiling
          </div>
          <h1 className="font-display text-5xl sm:text-6xl leading-none mb-5" style={{ color: 'var(--color-text)' }}>
            Tasting<br />Notes
          </h1>
          <p className="text-sm leading-relaxed max-w-xl mx-auto" style={{ color: 'var(--color-text-muted)' }}>
            Describe what's in your cup. Pick your roast, origin, and brew method — we'll craft your tasting profile.
          </p>
        </motion.div>
      </section>

      {/* ── Wizard ─────────────────────────────────────────────────── */}
      <section className="w-full max-w-3xl mx-auto px-6 pb-28">

        <StepIndicator current={currentStep > 2 ? 2 : currentStep} total={3} />

        {/* ── Step 1: Roast ── */}
        <AnimatePresence mode="wait">
          {currentStep >= 0 && (
            <motion.div
              key="step-roast"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <p
                className="text-[10px] uppercase tracking-[0.22em] mb-4"
                style={{ color: 'rgba(201,168,76,0.6)', fontFamily: 'Space Mono, monospace' }}
              >
                01 — Choose Your Roast
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {ROAST_CARDS.map((card) => {
                  const selected = roast === card.id
                  return (
                    <motion.button
                      key={card.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setRoast(card.id)}
                      className="flex flex-col items-center gap-4 py-8 px-4 rounded-2xl text-center transition-all duration-200"
                      style={{
                        background: selected ? 'rgba(201,168,76,0.08)' : 'var(--color-surface)',
                        border: `1px solid ${selected ? 'rgba(201,168,76,0.6)' : 'var(--color-border)'}`,
                        boxShadow: selected ? '0 0 24px rgba(201,168,76,0.12)' : 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        className="flex items-center justify-center rounded-full"
                        style={{
                          width: 56,
                          height: 56,
                          background: selected ? 'rgba(201,168,76,0.12)' : 'rgba(201,168,76,0.05)',
                          border: `1px solid ${selected ? 'rgba(201,168,76,0.4)' : 'rgba(201,168,76,0.1)'}`,
                          transition: 'all 0.2s',
                        }}
                      >
                        <BeanIcon size={28} opacity={selected ? 1 : 0.5} />
                      </div>
                      <div>
                        <p
                          className="font-display text-lg mb-1"
                          style={{ color: selected ? 'var(--color-accent)' : 'var(--color-text)' }}
                        >
                          {card.label}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: selected ? 'rgba(201,168,76,0.7)' : 'var(--color-text-faint)', fontFamily: 'Inter, sans-serif' }}
                        >
                          {card.sub}
                        </p>
                        <p
                          className="text-[10px] mt-2 uppercase tracking-wider"
                          style={{ color: 'rgba(201,168,76,0.35)', fontFamily: 'Space Mono, monospace' }}
                        >
                          {card.temp}
                        </p>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Step 2: Origin ── */}
        <AnimatePresence>
          {roast && (
            <motion.div
              key="step-origin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              {/* Section divider */}
              <div style={{ height: 1, background: 'rgba(80,120,60,0.18)', marginBottom: '2rem' }} />
              <p
                className="text-[10px] uppercase tracking-[0.22em] mb-4"
                style={{ color: 'rgba(201,168,76,0.6)', fontFamily: 'Space Mono, monospace' }}
              >
                02 — Select Origin
              </p>
              <div className="flex flex-wrap gap-2">
                {ORIGINS.map((o) => {
                  const selected = origin === o
                  return (
                    <motion.button
                      key={o}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setOrigin(o)}
                      className="rounded-full px-4 py-2 text-sm transition-all duration-200"
                      style={{
                        background: selected ? 'rgba(201,168,76,0.12)' : 'rgba(22,34,16,0.8)',
                        border: `1px solid ${selected ? 'rgba(201,168,76,0.55)' : 'rgba(80,120,60,0.28)'}`,
                        color: selected ? 'var(--color-accent)' : 'var(--color-text-muted)',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: selected ? 600 : 400,
                        cursor: 'pointer',
                      }}
                    >
                      {o}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Step 3: Brew Method ── */}
        <AnimatePresence>
          {origin && (
            <motion.div
              key="step-method"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <div style={{ height: 1, background: 'rgba(80,120,60,0.18)', marginBottom: '2rem' }} />
              <p
                className="text-[10px] uppercase tracking-[0.22em] mb-4"
                style={{ color: 'rgba(201,168,76,0.6)', fontFamily: 'Space Mono, monospace' }}
              >
                03 — Brew Method
              </p>
              <div className="flex flex-wrap gap-2">
                {METHODS.map((m) => {
                  const selected = method === m
                  return (
                    <motion.button
                      key={m}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setMethod(m)}
                      className="rounded-full px-4 py-2 text-sm transition-all duration-200"
                      style={{
                        background: selected ? 'rgba(201,168,76,0.12)' : 'rgba(22,34,16,0.8)',
                        border: `1px solid ${selected ? 'rgba(201,168,76,0.55)' : 'rgba(80,120,60,0.28)'}`,
                        color: selected ? 'var(--color-accent)' : 'var(--color-text-muted)',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: selected ? 600 : 400,
                        cursor: 'pointer',
                      }}
                    >
                      {m}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Result Card ── */}
        <AnimatePresence>
          {allSelected && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.6 }}
            >
              <div style={{ height: 1, background: 'rgba(201,168,76,0.18)', marginBottom: '2rem' }} />
              <div className="label-ornate justify-center mb-6">
                Your Tasting Profile
              </div>
              <TastingCard
                roast={roast}
                origin={origin}
                method={method}
                onRegenerate={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reset link — only visible after first selection */}
        <AnimatePresence>
          {roast && !allSelected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6 text-center"
            >
              <button
                onClick={handleReset}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(201,168,76,0.4)',
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '10px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-accent)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(201,168,76,0.4)' }}
              >
                ↩ Start over
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  )
}
