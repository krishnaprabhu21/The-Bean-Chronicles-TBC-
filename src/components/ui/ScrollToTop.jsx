import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function CoffeeCupIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Steam wisps */}
      <path
        d="M13 8 Q11 5 13 2"
        stroke="#D4A853"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M20 8 Q18 4 20 1"
        stroke="#D4A853"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      <path
        d="M27 8 Q29 5 27 2"
        stroke="#D4A853"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      {/* Cup body */}
      <path
        d="M8 12 L10 30 Q10.5 33 14 33 L26 33 Q29.5 33 30 30 L32 12 Z"
        fill="currentColor"
        opacity="0.95"
      />
      {/* Cup handle */}
      <path
        d="M32 16 Q38 16 38 22 Q38 28 32 28"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Saucer */}
      <ellipse cx="20" cy="35" rx="14" ry="3" fill="currentColor" opacity="0.6" />
      {/* Liquid surface highlight */}
      <ellipse cx="20" cy="14" rx="10" ry="2.5" fill="#D4A853" opacity="0.3" />
    </svg>
  )
}

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 16 }}
          whileHover={{ scale: 1.5, y: -2 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #2D1B14, #1A0F0A)',
            border: '1.5px solid rgba(212,168,83,0.5)',
            color: '#D4A853',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4), 0 0 12px rgba(212,168,83,0.15)',
            cursor: "pointer"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#D4A853'
            e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.5), 0 0 20px rgba(212,168,83,0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(212,168,83,0.5)'
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4), 0 0 12px rgba(212,168,83,0.15)'
          }}
        >
          <CoffeeCupIcon />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
