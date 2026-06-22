import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { ScrollToTop } from '../ui/ScrollToTop'
import { Toaster } from '../ui/Toaster'
import { MiniPlayer } from '../ui/MiniPlayer'
import { useNowPlaying } from '../../contexts/NowPlayingContext'

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
  const { nowPlaying } = useNowPlaying()

  return (
    <>
      {/* Skip-to-content for keyboard / screen-reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium focus:no-underline"
        style={{ background: 'var(--color-accent)', color: 'var(--color-bg)', fontFamily: 'Inter, sans-serif' }}
      >
        Skip to main content
      </a>
      <Navbar />
      <main
        id="main-content"
        className="w-full"
        style={{ paddingBottom: nowPlaying ? 76 : 0, transition: 'padding-bottom 0.3s ease' }}
      >
        {children}
      </main>
      <Footer />
      <ScrollToTop />
      <Toaster />
      <MiniPlayer />

      {/* Floating game button — rises above mini-bar when active */}
      <motion.div
        className="fixed left-6 z-40"
        style={{
          bottom: nowPlaying ? 'calc(76px + 1.5rem)' : '1.5rem',
          transition: 'bottom 0.35s cubic-bezier(0.22,1,0.36,1)',
        }}
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
