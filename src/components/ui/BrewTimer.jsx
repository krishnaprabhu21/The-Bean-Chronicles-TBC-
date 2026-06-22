import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '../../contexts/ToastContext'

const R = 54
const CIRCUMFERENCE = 2 * Math.PI * R

function pad(n) { return String(n).padStart(2, '0') }

export function BrewTimer({ minutes, label = 'Brew Timer' }) {
  const [open, setOpen] = useState(false)
  const [totalSeconds] = useState(minutes * 60)
  const [remaining, setRemaining] = useState(minutes * 60)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)
  const { addToast } = useToast()

  const done = remaining === 0
  const progress = remaining / totalSeconds

  const start = useCallback(() => setRunning(true), [])
  const pause = useCallback(() => setRunning(false), [])
  const reset = useCallback(() => { setRunning(false); setRemaining(totalSeconds) }, [totalSeconds])

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => setRemaining(s => s - 1), 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, remaining])

  useEffect(() => {
    if (remaining === 0 && running) {
      setRunning(false)
      addToast({ message: `${label} complete! Time to taste.`, type: 'success', duration: 5000 })
    }
  }, [remaining, running, label, addToast])

  useEffect(() => {
    if (!open) { reset() }
  }, [open, reset])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress)

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 transition-all duration-200"
        style={{
          background: 'var(--color-accent-dim)',
          border: '1px solid var(--color-accent-border)',
          borderRadius: '9999px',
          color: 'var(--color-accent)',
          padding: '0.5rem 1.1rem',
          fontFamily: 'Space Mono, monospace',
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--color-accent)'
          e.currentTarget.style.color = 'var(--color-bg)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--color-accent-dim)'
          e.currentTarget.style.color = 'var(--color-accent)'
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        Start Timer
      </button>

      {/* Modal */}
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              className="fixed inset-0 z-[400] flex items-center justify-center px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {/* Backdrop */}
              <div
                className="absolute inset-0 cursor-pointer"
                style={{ background: 'rgba(5,10,6,0.88)', backdropFilter: 'blur(8px)' }}
                onClick={() => setOpen(false)}
              />

              {/* Panel */}
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Brew Timer"
                className="relative flex flex-col items-center gap-6 px-10 py-10"
                style={{
                  background: 'var(--color-card)',
                  border: '1px solid var(--color-border-strong)',
                  borderRadius: '1.5rem',
                  boxShadow: '0 32px 80px rgba(0,0,0,0.55)',
                  minWidth: '280px',
                  maxWidth: '360px',
                  width: '100%',
                }}
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Close */}
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close timer"
                  className="absolute top-4 right-4"
                  style={{ color: 'var(--color-text-faint)', cursor: 'pointer', background: 'none', border: 'none', padding: 4 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>

                {/* Label */}
                <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.22em', color: 'var(--color-accent)' }}>
                  {label}
                </p>

                {/* Ring */}
                <div className="relative flex items-center justify-center">
                  <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
                    {/* Track */}
                    <circle cx="70" cy="70" r={R} fill="none" stroke="var(--color-border)" strokeWidth="6" />
                    {/* Progress */}
                    <motion.circle
                      cx="70"
                      cy="70"
                      r={R}
                      fill="none"
                      stroke={done ? '#4ade80' : 'var(--color-accent)'}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={CIRCUMFERENCE}
                      strokeDashoffset={strokeDashoffset}
                      style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span
                      style={{
                        fontFamily: 'Space Mono, monospace',
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: done ? '#4ade80' : 'var(--color-text)',
                        letterSpacing: '-0.02em',
                        transition: 'color 0.3s',
                      }}
                    >
                      {pad(mins)}:{pad(secs)}
                    </span>
                    <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--color-text-faint)' }}>
                      {done ? 'done!' : running ? 'brewing' : 'paused'}
                    </span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3">
                  {!done && (
                    <button
                      onClick={running ? pause : start}
                      style={{
                        background: 'var(--color-accent)',
                        color: 'var(--color-bg)',
                        border: 'none',
                        borderRadius: '9999px',
                        padding: '0.65rem 1.8rem',
                        fontFamily: 'Space Mono, monospace',
                        fontSize: '0.68rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.16em',
                        cursor: 'pointer',
                      }}
                    >
                      {running ? 'Pause' : remaining === totalSeconds ? 'Start' : 'Resume'}
                    </button>
                  )}
                  <button
                    onClick={reset}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--color-border-strong)',
                      borderRadius: '9999px',
                      padding: '0.65rem 1.2rem',
                      fontFamily: 'Space Mono, monospace',
                      fontSize: '0.68rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.16em',
                      color: 'var(--color-text-muted)',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--color-accent)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border-strong)'; e.currentTarget.style.color = 'var(--color-text-muted)' }}
                  >
                    Reset
                  </button>
                </div>

                <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--color-text-faint)', textAlign: 'center', lineHeight: 1.8 }}>
                  {minutes} minute brew &nbsp;·&nbsp; {totalSeconds}s total
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}
