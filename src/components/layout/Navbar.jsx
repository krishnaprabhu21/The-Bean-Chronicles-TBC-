import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { to: '/',               label: 'Home' },
  { to: '/recipes',        label: 'Recipes' },
  { to: '/brewing-guides', label: 'Guides' },
  { to: '/culture',        label: 'Culture' },
  { to: '/about',          label: 'About' },
  { to: '/play',           label: '☕ Play' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(13,24,16,0.94)' : 'transparent',
          backdropFilter: scrolled ? 'blur(14px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(80,120,60,0.2)' : '1px solid transparent',
        }}
      >
        <nav className="w-full max-w-[1600px] mx-auto px-8 sm:px-14 h-20 flex items-center justify-between">
          {/* Logo wordmark */}
          <Link to="/" className="flex items-center gap-1 leading-none select-none group">
            {/* Coffee mug with face */}
            <svg
              width="30"
              height="34"
              viewBox="0 0 30 34"
              fill="none"
              aria-hidden="true"
              className="flex-shrink-0"
            >
              {/* Steam */}
              <path d="M8 8 Q9.5 5 8 2" stroke="#C9A84C" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
              <path d="M15 8 Q16.5 5 15 2" stroke="#C9A84C" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
              {/* Mug body */}
              <rect x="2" y="10" width="20" height="18" rx="3" stroke="#C9A84C" strokeWidth="1.5" />
              {/* Handle */}
              <path d="M22 14 Q28 14 28 19 Q28 24 22 24" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              {/* Bottom rim */}
              <line x1="2" y1="28" x2="22" y2="28" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" />
              {/* Eyes */}
              <circle cx="9" cy="18" r="1.6" fill="#C9A84C" />
              <circle cx="15" cy="18" r="1.6" fill="#C9A84C" />
              {/* Moustache */}
              <path d="M7 22.5 Q9 24.5 12 22.5 Q15 24.5 17 22.5" stroke="#C9A84C" strokeWidth="1.3" strokeLinecap="round" fill="none" />
            </svg>

            <div className="flex flex-col leading-none">
              <span
                className="font-display font-bold text-lg sm:text-xl tracking-tight leading-none"
                style={{ color: '#C9A84C' }}
              >
                The Bean Chronicles
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-10">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `relative text-xs uppercase tracking-[0.18em] font-medium transition-colors duration-200 pb-0.5 ${
                      isActive ? 'text-ochre' : 'text-parchment/55 hover:text-parchment'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {label}
                      {isActive && (
                        <motion.span
                          layoutId="navUnderline"
                          className="absolute bottom-0 left-0 right-0 h-px"
                          style={{ background: '#C9A84C' }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={open ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="block w-6 h-px rounded-full origin-center"
              style={{ background: '#E8DFD0' }}
              transition={{ duration: 0.25 }}
            />
            <motion.span
              animate={open ? { opacity: 0 } : { opacity: 1 }}
              className="block w-6 h-px rounded-full"
              style={{ background: '#E8DFD0' }}
              transition={{ duration: 0.25 }}
            />
            <motion.span
              animate={open ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="block w-6 h-px rounded-full origin-center"
              style={{ background: '#E8DFD0' }}
              transition={{ duration: 0.25 }}
            />
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Blurred backdrop */}
            <div
              className="absolute inset-0"
              style={{ background: 'rgba(6,12,7,0.78)', backdropFilter: 'blur(6px)' }}
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              className="absolute right-0 top-0 h-full flex flex-col"
              style={{
                width: 'min(88vw, 340px)',
                background: 'linear-gradient(160deg, #111e0c 0%, #0D1810 100%)',
                borderLeft: '1px solid rgba(201,168,76,0.14)',
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-8 py-7"
                style={{ borderBottom: '1px solid rgba(201,168,76,0.1)' }}
              >
                <div className="flex flex-col leading-none">
                  <span
                    className="font-display font-bold tracking-tight"
                    style={{ color: '#C9A84C', fontSize: '1.05rem' }}
                  >
                    The Bean Chronicles
                  </span>
                  <span
                    style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.38)', marginTop: '4px' }}
                  >
                    Est. 2024
                  </span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200"
                  style={{ border: '1px solid rgba(201,168,76,0.2)', color: 'rgba(232,223,208,0.55)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.55)'; e.currentTarget.style.color = '#C9A84C' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'; e.currentTarget.style.color = 'rgba(232,223,208,0.55)' }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 px-8 py-4 overflow-y-auto">
                {navLinks.map(({ to, label }, i) => (
                  <motion.div
                    key={to}
                    initial={{ opacity: 0, x: 22 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.07, duration: 0.32 }}
                  >
                    <NavLink
                      to={to}
                      end={to === '/'}
                      onClick={() => setOpen(false)}
                      className="group flex items-center justify-between py-5"
                      style={{ borderBottom: '1px solid rgba(80,120,60,0.12)' }}
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-5">
                            <span
                              style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.12em', color: isActive ? 'rgba(201,168,76,0.7)' : 'rgba(201,168,76,0.28)', minWidth: '20px' }}
                            >
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <span
                              className="font-display italic transition-colors duration-200"
                              style={{ fontSize: '1.6rem', lineHeight: 1, color: isActive ? '#C9A84C' : 'rgba(232,223,208,0.62)' }}
                            >
                              {label}
                            </span>
                          </div>
                          <svg
                            width="13" height="13" viewBox="0 0 24 24" fill="none" strokeLinecap="round"
                            className="transition-all duration-200 group-hover:translate-x-1"
                            style={{ stroke: isActive ? '#C9A84C' : 'rgba(232,223,208,0.2)', strokeWidth: 2 }}
                          >
                            <line x1="5" y1="12" x2="19" y2="12"/>
                            <polyline points="12 5 19 12 12 19"/>
                          </svg>
                        </>
                      )}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>

              {/* Footer tagline */}
              <div className="px-8 py-7" style={{ borderTop: '1px solid rgba(201,168,76,0.1)' }}>
                <p
                  style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.28)', lineHeight: 1.9 }}
                >
                  From origin to cup —<br />stories &amp; rituals for the<br />discerning coffee mind.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
