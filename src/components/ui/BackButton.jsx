import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export function BackButton({ to = '/', label = 'Back' }) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1)
    } else {
      navigate(to)
    }
  }

  return (
    <motion.button
      onClick={handleClick}
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.04, x: -2 }}
      whileTap={{ scale: 0.96 }}
      className="fixed flex items-center gap-2"
      style={{
        top: '4.5rem',
        left: '1.25rem',
        zIndex: 39,
        border: '1px solid var(--color-accent-border)',
        background: 'var(--color-accent-dim)',
        color: 'var(--color-accent)',
        borderRadius: '9999px',
        padding: '0.5rem 1.1rem',
        fontFamily: 'Space Mono, monospace',
        fontSize: '0.68rem',
        textTransform: 'uppercase',
        letterSpacing: '0.16em',
        cursor: 'pointer',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 2px 16px rgba(0,0,0,0.22)',
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
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
      </svg>
      {label}
    </motion.button>
  )
}
