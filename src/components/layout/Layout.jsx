import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { ScrollToTop } from '../ui/ScrollToTop'
import { Toaster } from '../ui/Toaster'

function GamepadIcon() {
  return (
    <svg width="20" height="14" viewBox="0 0 36 24" fill="none">
      <rect x="1" y="4" width="34" height="16" rx="8" stroke="currentColor" strokeWidth="1.8" />
      <path d="M11 9v7M8 12.5h7" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
      <circle cx="25" cy="10" r="2.2" fill="currentColor" opacity="0.85" />
      <circle cx="29" cy="14" r="2.2" fill="currentColor" opacity="0.5" />
      <circle cx="21" cy="14" r="2.2" fill="currentColor" opacity="0.5" />
    </svg>
  )
}

export function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="w-full">{children}</main>
      <Footer />
      <ScrollToTop />
      <Toaster />

      {/* Floating game button */}
      <motion.div
        className="fixed bottom-6 left-6 z-40"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.4, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.92 }}
      >
        <Link
          to="/tools#play"
          title="Play Bean Catcher"
          className="w-12 h-12 flex items-center justify-center rounded-full shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #2D1B14, #1A0F0A)',
            border: '1.5px solid rgba(201,168,76,0.4)',
            color: '#C9A84C',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4), 0 0 12px rgba(201,168,76,0.1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#C9A84C'
            e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.5), 0 0 20px rgba(201,168,76,0.28)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4), 0 0 12px rgba(201,168,76,0.1)'
          }}
        >
          <GamepadIcon />
        </Link>
      </motion.div>
    </>
  )
}
