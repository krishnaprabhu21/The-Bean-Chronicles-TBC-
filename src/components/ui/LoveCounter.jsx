import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'

const LOVE_BASE = 247
const BURST_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]
const STEAM_HEARTS = [
  { left: 28, delay: 0,    size: 11 },
  { left: 46, delay: 0.6,  size: 15 },
  { left: 64, delay: 1.25, size: 10 },
]

export function getLoveCount() {
  const seed = parseInt(localStorage.getItem('tbc-love-seed') || '4', 10)
  return LOVE_BASE + seed + (localStorage.getItem('tbc-loved') === '1' ? 1 : 0)
}

export function getHasUpvoted() {
  return localStorage.getItem('tbc-loved') === '1'
}

export function LoveCounter() {
  const [hasUpvoted, setHasUpvoted] = useState(() =>
    localStorage.getItem('tbc-loved') === '1'
  )
  const [loveOffset] = useState(() => {
    const stored = localStorage.getItem('tbc-love-seed')
    if (stored !== null) return parseInt(stored, 10)
    const seed = Math.floor(Math.random() * 14) + 4
    localStorage.setItem('tbc-love-seed', seed.toString())
    return seed
  })
  const [burst, setBurst] = useState(false)

  const count = LOVE_BASE + loveOffset + (hasUpvoted ? 1 : 0)

  const toggle = () => {
    if (hasUpvoted) {
      localStorage.setItem('tbc-loved', '0')
      setHasUpvoted(false)
    } else {
      localStorage.setItem('tbc-loved', '1')
      setHasUpvoted(true)
      setBurst(true)
      setTimeout(() => setBurst(false), 1400)
    }
  }

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      {/* Animated coffee cup */}
      <div
        className="relative cursor-pointer select-none"
        style={{ width: 112, height: 112 }}
        onClick={toggle}
        title={hasUpvoted ? 'Remove love' : 'Show some love'}
      >
        <svg width="112" height="112" viewBox="0 0 80 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Saucer */}
          <ellipse cx="40" cy="84" rx="28" ry="5" fill="var(--color-surface)" />
          {/* Cup body */}
          <rect x="12" y="42" width="48" height="40" rx="7" fill="var(--color-card)" stroke="var(--color-accent-border)" strokeWidth="1.5" />
          {/* Coffee fill */}
          <rect x="16" y="55" width="40" height="23" rx="4" fill={hasUpvoted ? 'var(--color-accent-dim)' : 'rgba(70,38,12,0.4)'} />
          {/* Rim */}
          <rect x="10" y="36" width="52" height="10" rx="5" fill="var(--color-surface)" stroke="var(--color-accent-border)" strokeWidth="1.5" />
          {/* Handle */}
          <path d="M60 51 Q73 51 73 62 Q73 73 60 73" stroke="var(--color-accent-border)" strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Rim shimmer */}
          <rect x="15" y="38" width="16" height="4" rx="2" fill="white" opacity="0.07" />
        </svg>

        {/* Floating steam hearts */}
        {STEAM_HEARTS.map((h, i) => (
          <motion.span
            key={i}
            style={{
              position: 'absolute',
              left: h.left,
              top: 14,
              fontSize: h.size,
              color: hasUpvoted ? 'var(--color-accent)' : 'rgba(201,168,76,0.5)',
              pointerEvents: 'none',
              lineHeight: 1,
            }}
            animate={{ y: [0, -26, -52], opacity: [0, 1, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2.2 + i * 0.25,
              delay: h.delay,
              ease: 'easeOut',
            }}
          >
            ♥
          </motion.span>
        ))}

        {/* Burst hearts on upvote */}
        <AnimatePresence>
          {burst && BURST_ANGLES.map((angle, i) => (
            <motion.span
              key={`burst-${i}`}
              style={{
                position: 'absolute',
                left: 56,
                top: 44,
                fontSize: 13,
                color: 'var(--color-accent)',
                pointerEvents: 'none',
                lineHeight: 1,
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos((angle * Math.PI) / 180) * 58,
                y: Math.sin((angle * Math.PI) / 180) * 58,
                opacity: 0,
                scale: 0.2,
              }}
              exit={{}}
              transition={{ duration: 0.9, ease: 'easeOut', delay: i * 0.03 }}
            >
              ♥
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      {/* Animated count */}
      <AnimatePresence mode="wait">
        <motion.p
          key={count}
          initial={{ y: -14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="font-display font-bold leading-none"
          style={{
            fontSize: 'clamp(3.2rem, 9vw, 5.5rem)',
            color: hasUpvoted ? 'var(--color-accent)' : 'var(--color-text)',
            letterSpacing: '-0.02em',
          }}
        >
          {count.toLocaleString()}
        </motion.p>
      </AnimatePresence>

      <p
        className="text-[10px] uppercase tracking-[0.24em] -mt-1"
        style={{ color: 'var(--color-text-muted)', fontFamily: 'Space Mono, monospace' }}
      >
        coffee lovers
      </p>

      {/* Toggle button */}
      <motion.button
        onClick={toggle}
        whileTap={{ scale: 0.91 }}
        whileHover={{ scale: 1.04 }}
        className="flex items-center gap-2 px-6 py-3 rounded-full text-[11px] uppercase tracking-[0.16em] transition-colors duration-200 mt-1"
        style={{
          fontFamily: 'Space Mono, monospace',
          background: hasUpvoted ? 'var(--color-accent-dim)' : 'transparent',
          border: `1px solid ${hasUpvoted ? 'var(--color-accent-border)' : 'rgba(80,120,60,0.28)'}`,
          color: hasUpvoted ? 'var(--color-accent)' : 'var(--color-text-muted)',
        }}
      >
        <span style={{ fontSize: 14 }}>{hasUpvoted ? '♥' : '♡'}</span>
        <span>{hasUpvoted ? "You're part of the brew" : 'Show some love'}</span>
      </motion.button>

      <p
        style={{
          color: 'var(--color-text-faint)',
          fontFamily: 'Space Mono, monospace',
          fontSize: '0.6rem',
          letterSpacing: '0.07em',
          maxWidth: '32ch',
        }}
      >
        {hasUpvoted
          ? 'Thank you for being part of the community ♥'
          : 'Click the cup to add your love to the count'}
      </p>
    </div>
  )
}

export function LoveModal({ isOpen, onClose }) {
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(6,12,7,0.88)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
            onClick={onClose}
          />

          {/* Card */}
          <motion.div
            className="relative z-10 w-full rounded-3xl overflow-hidden"
            style={{
              maxWidth: 420,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-accent-border)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.55), 0 0 60px rgba(201,168,76,0.06)',
            }}
            initial={{ opacity: 0, y: 28, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <div
              className="flex items-start justify-between px-8 pt-8 pb-0"
            >
              <div>
                <p className="label-ornate" style={{ marginBottom: 6 }}>Community Love</p>
                <h2
                  className="font-display font-bold"
                  style={{ color: 'var(--color-text)', fontSize: '1.6rem', lineHeight: 1.1 }}
                >
                  Brewed with Love
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 flex-shrink-0 mt-1"
                style={{ border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent-border)'; e.currentTarget.style.color = 'var(--color-accent)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)' }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Divider */}
            <div className="mx-8 mt-5 mb-0" style={{ height: 1, background: 'var(--color-border)' }} />

            {/* Content */}
            <div className="px-8 py-8">
              <LoveCounter />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
