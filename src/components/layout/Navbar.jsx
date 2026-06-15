import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'
import { useBookmarks } from '../../hooks/useBookmarks'
import { SearchModal } from '../ui/SearchModal'
import { LoveModal, getLoveCount, getHasUpvoted } from '../ui/LoveCounter'

const navLinks = [
  { to: '/',               label: 'Home' },
  { to: '/recipes',        label: 'Recipes' },
  {
    to: '/brewing-guides',
    label: 'Guides',
    children: [
      { to: '/brewing-guides', label: 'Brewing Devices' },
      { to: '/brewing-guides', label: 'Brands' },
      { to: '/brewing-guides', label: 'Coffee Types' },
      { to: '/brewing-guides', label: 'Coffee Nerds' },
    ],
  },
  {
    to: '/culture',
    label: 'Culture',
    children: [
      { to: '/culture',  label: 'Articles' },
      { to: '/origins',  label: 'Origins Encyclopedia' },
    ],
  },
  {
    to: '/tools',
    label: 'Tools',
    children: [
      { to: '/tasting',       label: 'Tasting Notes' },
      { to: '/calculator',    label: 'Brew Calculator' },
      { to: '/glossary',      label: 'Glossary' },
      { to: '/compare',       label: 'Compare Methods' },
      { to: '/journal',       label: 'Brew Journal' },
      { to: '/submit-recipe', label: 'Submit Recipe' },
    ],
  },
  { to: '/about', label: 'About' },
  { to: '/play',  label: 'Play' },
]

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { count } = useBookmarks()
  const isLight = theme === 'light'
  const [loveOpen, setLoveOpen] = useState(false)
  const [displayLoveCount, setDisplayLoveCount] = useState(getLoveCount)
  const [hasLoved, setHasLoved] = useState(getHasUpvoted)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(o => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const headerBg = scrolled ? 'var(--color-nav-glass)' : 'transparent'

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: headerBg,
          backdropFilter: scrolled ? 'blur(14px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
        }}
      >
        <nav className="w-full max-w-[1600px] mx-auto px-8 sm:px-14 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 leading-none select-none group">
            <svg width="30" height="34" viewBox="0 0 30 34" fill="none" aria-hidden="true" className="flex-shrink-0">
              <path d="M8 8 Q9.5 5 8 2"  stroke="#C9A84C" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
              <path d="M15 8 Q16.5 5 15 2" stroke="#C9A84C" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
              <rect x="2" y="10" width="20" height="18" rx="3" stroke="#C9A84C" strokeWidth="1.5" />
              <path d="M22 14 Q28 14 28 19 Q28 24 22 24" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <line x1="2" y1="28" x2="22" y2="28" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="9" cy="18" r="1.6" fill="#C9A84C" />
              <circle cx="15" cy="18" r="1.6" fill="#C9A84C" />
              <path d="M7 22.5 Q9 24.5 12 22.5 Q15 24.5 17 22.5" stroke="#C9A84C" strokeWidth="1.3" strokeLinecap="round" fill="none" />
            </svg>
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-lg sm:text-xl tracking-tight leading-none" style={{ color: 'var(--color-accent)' }}>
                The Bean Chronicles
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className="relative text-xs uppercase tracking-[0.18em] font-medium transition-colors duration-200 pb-0.5"
                  style={({ isActive }) => ({
                    color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  })}
                >
                  {({ isActive }) => (
                    <>
                      {label}
                      {isActive && (
                        <motion.span layoutId="navUnderline" className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'var(--color-accent)' }} />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right-side icon buttons */}
          <div className="flex items-center gap-2">
            {/* Search button */}
            <button
              onClick={() => setSearchOpen(true)}
              title="Search (⌘K)"
              className="hidden md:flex items-center gap-2 px-3 h-9 rounded-full transition-all duration-200"
              style={{ border: '1px solid rgba(201,168,76,0.3)', color: 'rgba(201,168,76,0.6)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201,168,76,0.08)'; e.currentTarget.style.color = '#C9A84C' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(201,168,76,0.6)' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <kbd style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.06em', color: 'var(--color-accent-border)', background: 'rgba(80,120,60,0.2)', padding: '1px 5px', borderRadius: '4px', border: '1px solid rgba(80,120,60,0.3)' }}>
                ⌘K
              </kbd>
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
              className="w-9 h-9 hidden md:flex items-center justify-center rounded-full transition-all duration-200"
              style={{
                border: '1px solid rgba(201,168,76,0.3)',
                color: '#C9A84C',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201,168,76,0.1)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              {isLight ? <MoonIcon /> : <SunIcon />}
            </button>

            {/* Brewed with Love button */}
            <button
              onClick={() => setLoveOpen(true)}
              title="Brewed with Love"
              className="w-9 h-9 hidden md:flex items-center justify-center rounded-full relative transition-all duration-200"
              style={{
                border: `1px solid ${hasLoved ? 'var(--color-accent)' : 'rgba(201,168,76,0.3)'}`,
                color: hasLoved ? 'var(--color-accent)' : 'rgba(201,168,76,0.6)',
                background: hasLoved ? 'var(--color-accent-dim)' : 'transparent',
              }}
              onMouseEnter={(e) => { if (!hasLoved) { e.currentTarget.style.background = 'rgba(201,168,76,0.08)'; e.currentTarget.style.color = '#C9A84C' } }}
              onMouseLeave={(e) => { if (!hasLoved) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(201,168,76,0.6)' } }}
            >
              <svg width="14" height="15" viewBox="0 0 28 30" fill="none">
                <path d="M14 9 C14 7,12 6,10.5 6 C9 6,7.5 7,7.5 8.5 C7.5 11.5,14 14,14 14 C14 14,20.5 11.5,20.5 8.5 C20.5 7,19 6,17.5 6 C16 6,14 7,14 9Z" fill="currentColor" />
                <rect x="2" y="15" width="18" height="4.5" rx="2" stroke="currentColor" strokeWidth="1.7" fill="none" />
                <rect x="3" y="18" width="16" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.7" fill="none" />
                <path d="M19 20 Q24 20 24 24 Q24 28 19 28" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
              </svg>
              <span
                className="absolute -top-1.5 -right-1.5 flex items-center justify-center rounded-full font-bold pointer-events-none"
                style={{
                  background: 'var(--color-accent)',
                  color: 'var(--color-bg)',
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '7px',
                  minWidth: 16,
                  height: 16,
                  paddingLeft: 3,
                  paddingRight: 3,
                }}
              >
                {displayLoveCount > 999 ? '1k+' : displayLoveCount}
              </span>
            </button>

            {/* Bookmarks icon */}
            <Link
              to="/shelf"
              title="Your reading shelf"
              className="w-9 h-9 hidden md:flex items-center justify-center rounded-full relative transition-all duration-200"
              style={{ border: '1px solid rgba(201,168,76,0.3)', color: 'var(--color-accent)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201,168,76,0.1)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              {count > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full text-[9px] font-bold"
                  style={{ background: 'var(--color-accent)', color: 'var(--color-bg)' }}
                >
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen((o) => !o)}
              className="md:hidden flex flex-col gap-1.5 p-2 ml-1"
              aria-label="Toggle menu"
            >
              <motion.span animate={open ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} className="block w-6 h-px rounded-full origin-center" style={{ background: 'var(--color-text)' }} transition={{ duration: 0.25 }} />
              <motion.span animate={open ? { opacity: 0 } : { opacity: 1 }} className="block w-6 h-px rounded-full" style={{ background: 'var(--color-text)' }} transition={{ duration: 0.25 }} />
              <motion.span animate={open ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} className="block w-6 h-px rounded-full origin-center" style={{ background: 'var(--color-text)' }} transition={{ duration: 0.25 }} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0"
              style={{ background: 'rgba(6,12,7,0.78)', backdropFilter: 'blur(6px)' }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              className="absolute right-0 top-0 h-full flex flex-col"
              style={{ width: 'min(88vw, 340px)', background: 'linear-gradient(160deg, var(--color-drawer-bg) 0%, var(--color-bg) 100%)', borderLeft: '1px solid var(--color-accent-border)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-7" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <div className="flex flex-col leading-none">
                  <span className="font-display font-bold tracking-tight" style={{ color: 'var(--color-accent)', fontSize: '1.05rem' }}>
                    The Bean Chronicles
                  </span>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-accent-border)', marginTop: '4px' }}>
                    Est. 2024
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Mobile theme toggle */}
                  <button
                    onClick={toggleTheme}
                    className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200"
                    style={{ border: '1px solid rgba(201,168,76,0.2)', color: 'var(--color-accent)' }}
                  >
                    {isLight ? <MoonIcon /> : <SunIcon />}
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Close menu"
                    className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200"
                    style={{ border: '1px solid rgba(201,168,76,0.2)', color: 'var(--color-text-muted)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--color-accent)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent-border)'; e.currentTarget.style.color = 'var(--color-text-muted)' }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Nav links */}
              <nav className="flex-1 px-8 py-4 overflow-y-auto">
                {navLinks.map(({ to, label, children }, i) => {
                  const isExpanded = openSubmenu === label
                  return (
                    <motion.div key={to} initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.07, duration: 0.32 }}>
                      {children ? (
                        /* ── Parent row with accordion toggle ── */
                        <div style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <button
                            onClick={() => setOpenSubmenu(isExpanded ? null : label)}
                            className="group w-full flex items-center justify-between py-5"
                          >
                            <div className="flex items-center gap-5">
                              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.12em', color: isExpanded ? 'var(--color-accent)' : 'var(--color-accent-border)', minWidth: '20px' }}>
                                {String(i + 1).padStart(2, '0')}
                              </span>
                              <span className="font-display italic transition-colors duration-200" style={{ fontSize: '1.6rem', lineHeight: 1, color: isExpanded ? 'var(--color-accent)' : 'var(--color-text-muted)' }}>
                                {label}
                              </span>
                            </div>
                            {/* Chevron rotates when open */}
                            <motion.svg
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.25 }}
                              width="13" height="13" viewBox="0 0 24 24" fill="none" strokeLinecap="round"
                              style={{ stroke: isExpanded ? 'var(--color-accent)' : 'var(--color-text-faint)', strokeWidth: 2, flexShrink: 0 }}
                            >
                              <polyline points="6 9 12 15 18 9"/>
                            </motion.svg>
                          </button>

                          {/* Submenu */}
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                key="sub"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                style={{ overflow: 'hidden' }}
                              >
                                <div
                                  className="mb-3 ml-9 flex flex-col gap-0.5 rounded-xl overflow-hidden"
                                  style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.1)' }}
                                >
                                  {children.map((child, ci) => (
                                    <NavLink
                                      key={child.to + child.label}
                                      to={child.to}
                                      end
                                      onClick={() => { setOpen(false); setOpenSubmenu(null) }}
                                      className="flex items-center gap-3 px-4 py-3 transition-colors duration-150"
                                      style={({ isActive }) => ({
                                        background: isActive ? 'rgba(201,168,76,0.1)' : 'transparent',
                                        borderBottom: ci < children.length - 1 ? '1px solid rgba(201,168,76,0.08)' : 'none',
                                      })}
                                    >
                                      {({ isActive }) => (
                                        <>
                                          <span
                                            className="w-1 h-1 rounded-full flex-shrink-0"
                                            style={{ background: isActive ? 'var(--color-accent)' : 'rgba(201,168,76,0.3)' }}
                                          />
                                          <span
                                            style={{
                                              fontFamily: 'Space Mono, monospace',
                                              fontSize: '0.68rem',
                                              letterSpacing: '0.08em',
                                              textTransform: 'uppercase',
                                              color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
                                            }}
                                          >
                                            {child.label}
                                          </span>
                                        </>
                                      )}
                                    </NavLink>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        /* ── Regular nav link ── */
                        <NavLink
                          to={to}
                          end={to === '/'}
                          onClick={() => { setOpen(false); setOpenSubmenu(null) }}
                          className="group flex items-center justify-between py-5"
                          style={{ borderBottom: '1px solid var(--color-border)' }}
                        >
                          {({ isActive }) => (
                            <>
                              <div className="flex items-center gap-5">
                                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.12em', color: isActive ? 'rgba(201,168,76,0.7)' : 'rgba(201,168,76,0.28)', minWidth: '20px' }}>
                                  {String(i + 1).padStart(2, '0')}
                                </span>
                                <span className="font-display italic transition-colors duration-200" style={{ fontSize: '1.6rem', lineHeight: 1, color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)' }}>
                                  {label}
                                </span>
                              </div>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" strokeLinecap="round" className="transition-all duration-200 group-hover:translate-x-1" style={{ stroke: isActive ? 'var(--color-accent)' : 'var(--color-text-faint)', strokeWidth: 2 }}>
                                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                              </svg>
                            </>
                          )}
                        </NavLink>
                      )}
                    </motion.div>
                  )
                })}
                {/* Bookmarks link */}
                <motion.div initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + navLinks.length * 0.07, duration: 0.32 }}>
                  <Link to="/shelf" onClick={() => setOpen(false)} className="flex items-center gap-5 py-5" style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.12em', color: 'var(--color-accent-border)', minWidth: '20px' }}>
                      {String(navLinks.length + 1).padStart(2, '0')}
                    </span>
                    <span className="font-display italic" style={{ fontSize: '1.6rem', lineHeight: 1, color: 'var(--color-text-muted)' }}>
                      Shelf {count > 0 && <span className="text-base" style={{ color: 'var(--color-accent)' }}>({count})</span>}
                    </span>
                  </Link>
                </motion.div>
              </nav>

              {/* Footer: search + tagline */}
              <div className="px-8 py-6 flex flex-col gap-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                <button
                  onClick={() => { setOpen(false); setSearchOpen(true) }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200"
                  style={{ background: 'var(--color-accent-dim)', border: '1px solid var(--color-accent-border)', color: 'var(--color-accent)' }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                    Search
                  </span>
                  <kbd style={{ marginLeft: 'auto', fontFamily: 'Space Mono, monospace', fontSize: '9px', color: 'var(--color-accent-border)', background: 'var(--color-border)', padding: '1px 5px', borderRadius: '4px', border: '1px solid var(--color-border-strong)' }}>⌘K</kbd>
                </button>
                <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-accent-border)', lineHeight: 1.9 }}>
                  From origin to cup —<br />stories &amp; rituals for the<br />discerning coffee mind.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <LoveModal
        isOpen={loveOpen}
        onClose={() => {
          setDisplayLoveCount(getLoveCount())
          setHasLoved(getHasUpvoted())
          setLoveOpen(false)
        }}
      />
    </>
  )
}
