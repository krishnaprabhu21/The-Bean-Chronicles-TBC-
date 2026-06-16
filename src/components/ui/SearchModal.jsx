import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { recipes } from '../../data/recipes'
import { originsData } from '../../data/originsData'
import { glossaryTerms } from '../../data/glossaryData'

// ── Build static search index once ───────────────────────────────────────────

const STATIC_INDEX = [
  ...recipes.map(r => ({
    id: `recipe-${r.id}`,
    label: r.title,
    sub: `${r.category} · ${r.prepTime + r.brewTime} min`,
    type: 'Recipe',
    to: `/recipe/${r.slug}`,
    keywords: r.title.toLowerCase(),
  })),
  ...originsData.map(o => ({
    id: `origin-${o.id}`,
    label: o.country,
    sub: `${o.region} · ${o.flavourProfile.slice(0, 2).join(', ')}`,
    type: 'Origin',
    to: `/origins/${o.id}`,
    keywords: `${o.country} ${o.region} ${o.flavourProfile.join(' ')}`.toLowerCase(),
  })),
  ...glossaryTerms.map(g => ({
    id: `glossary-${g.term}`,
    label: g.term,
    sub: g.category,
    type: 'Glossary',
    to: `/glossary`,
    keywords: `${g.term} ${g.definition.slice(0, 80)}`.toLowerCase(),
  })),
]

const TYPE_COLORS = {
  Recipe:  '#C9A84C',
  Origin:  '#6B9E6B',
  Glossary:'#7A8ABE',
  Community: '#9A7A9A',
}

const TYPE_ICONS = {
  Recipe: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
      <path d="M8 12h8M12 8v8"/>
    </svg>
  ),
  Origin: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  Glossary: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  Community: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
}

function highlight(text, query) {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: 'var(--color-accent-border)', color: 'var(--color-accent)', borderRadius: '2px', padding: '0 1px' }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  )
}

function loadCommunity() {
  try {
    return JSON.parse(localStorage.getItem('tbc-submissions') || '[]').map(r => ({
      id: `community-${r.id}`,
      label: r.name,
      sub: `Community · ${r.category}`,
      type: 'Community',
      to: '/community',
      keywords: r.name.toLowerCase(),
    }))
  } catch { return [] }
}

// ── Modal ────────────────────────────────────────────────────────────────────

export function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const panelRef = useRef(null)
  const navigate = useNavigate()

  useFocusTrap(panelRef, isOpen)

  const communityIndex = useMemo(loadCommunity, [isOpen])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const full = [...STATIC_INDEX, ...communityIndex]
    return full.filter(item => item.keywords.includes(q)).slice(0, 12)
  }, [query, communityIndex])

  useEffect(() => { setCursor(0) }, [results])

  useEffect(() => {
    if (isOpen) { setTimeout(() => inputRef.current?.focus(), 50) }
    else { setQuery('') }
  }, [isOpen])

  const go = useCallback((item) => {
    navigate(item.to)
    onClose()
  }, [navigate, onClose])

  useEffect(() => {
    if (!isOpen) return
    function onKey(e) {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(c => Math.min(c + 1, results.length - 1)) }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)) }
      if (e.key === 'Enter' && results[cursor]) { go(results[cursor]) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, results, cursor, go, onClose])

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.children[cursor]
    el?.scrollIntoView({ block: 'nearest' })
  }, [cursor])

  const grouped = useMemo(() => {
    const map = {}
    results.forEach(r => { if (!map[r.type]) map[r.type] = []; map[r.type].push(r) })
    return map
  }, [results])

  const flatResults = results

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-start justify-center pt-[12vh] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 cursor-pointer"
            style={{ background: 'rgba(5,10,6,0.85)', backdropFilter: 'blur(8px)' }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="relative w-full overflow-hidden flex flex-col"
            style={{
              maxWidth: '620px',
              background: 'rgba(32,56,24,0.99)',
              border: '1px solid rgba(201,168,76,0.38)',
              borderRadius: '1.25rem',
              boxShadow: '0 32px 80px rgba(0,0,0,0.75), inset 0 1px 0 rgba(201,168,76,0.12)',
              maxHeight: '72vh',
            }}
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid rgba(80,120,60,0.35)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.7)" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search recipes, origins, glossary…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: 'var(--color-text-on-dark)', fontFamily: 'Inter, sans-serif', fontSize: '0.95rem' }}
              />
              {query && (
                <button aria-label="Clear search" onClick={() => setQuery('')} style={{ color: 'rgba(232,223,208,0.7)', lineHeight: 1 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
              <kbd
                className="hidden sm:flex items-center gap-0.5 px-2 py-0.5 rounded text-[9px]"
                style={{ background: 'rgba(80,120,60,0.3)', color: 'rgba(232,223,208,0.72)', fontFamily: 'Space Mono, monospace', border: '1px solid rgba(80,120,60,0.45)' }}
              >
                Esc
              </kbd>
            </div>

            {/* Results */}
            <div className="overflow-y-auto flex-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(80,120,60,0.3) transparent' }}>
              {!query && (
                <div className="flex flex-col items-center justify-center py-14 gap-3">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.4)" strokeWidth="1.5" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <p style={{ color: 'rgba(232,223,208,0.72)', fontFamily: 'Space Mono, monospace', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    Start typing to search
                  </p>
                </div>
              )}

              {query && results.length === 0 && (
                <div className="flex flex-col items-center justify-center py-14 gap-3">
                  <p style={{ color: 'rgba(232,223,208,0.72)', fontFamily: 'Space Mono, monospace', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    No results for "{query}"
                  </p>
                </div>
              )}

              {results.length > 0 && (
                <div ref={listRef} className="py-2">
                  {Object.entries(grouped).map(([type, items]) => (
                    <div key={type}>
                      {/* Type header */}
                      <div
                        className="px-5 py-2 flex items-center gap-2"
                        style={{ borderBottom: '1px solid rgba(80,120,60,0.28)' }}
                      >
                        <span style={{ color: TYPE_COLORS[type], opacity: 0.85 }}>{TYPE_ICONS[type]}</span>
                        <span style={{ color: 'rgba(232,223,208,0.65)', fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                          {type}s
                        </span>
                      </div>
                      {/* Items */}
                      {items.map(item => {
                        const globalIdx = flatResults.indexOf(item)
                        const isActive = cursor === globalIdx
                        return (
                          <button
                            key={item.id}
                            onClick={() => go(item)}
                            onMouseEnter={() => setCursor(globalIdx)}
                            className="w-full flex items-center gap-4 px-5 py-3 text-left transition-colors duration-100"
                            style={{ background: isActive ? 'rgba(201,168,76,0.12)' : 'transparent', borderLeft: isActive ? `2px solid ${TYPE_COLORS[item.type]}` : '2px solid transparent' }}
                          >
                            <span style={{ color: TYPE_COLORS[item.type], opacity: isActive ? 1 : 0.7, flexShrink: 0 }}>
                              {TYPE_ICONS[item.type]}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm truncate" style={{ color: isActive ? '#F0E8D8' : 'rgba(232,223,208,0.9)', fontFamily: 'Inter, sans-serif' }}>
                                {highlight(item.label, query)}
                              </p>
                              <p className="text-xs truncate mt-0.5" style={{ color: 'rgba(232,223,208,0.6)', fontFamily: 'Space Mono, monospace', fontSize: '10px' }}>
                                {item.sub}
                              </p>
                            </div>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={isActive ? TYPE_COLORS[item.type] : 'rgba(232,223,208,0.3)'} strokeWidth="2.5" strokeLinecap="round">
                              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                            </svg>
                          </button>
                        )
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer hints */}
            <div
              className="flex items-center gap-5 px-5 py-3"
              style={{ borderTop: '1px solid rgba(80,120,60,0.3)', background: 'rgba(16,30,12,0.9)' }}
            >
              {[
                ['↑↓', 'Navigate'],
                ['↵', 'Open'],
                ['Esc', 'Close'],
              ].map(([key, hint]) => (
                <span key={key} className="flex items-center gap-1.5">
                  <kbd style={{ background: 'rgba(80,120,60,0.35)', color: 'rgba(232,223,208,0.72)', fontFamily: 'Space Mono, monospace', fontSize: '9px', padding: '1px 5px', borderRadius: '4px', border: '1px solid rgba(80,120,60,0.5)' }}>
                    {key}
                  </kbd>
                  <span style={{ color: 'rgba(232,223,208,0.58)', fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {hint}
                  </span>
                </span>
              ))}
              <span className="ml-auto" style={{ color: 'rgba(201,168,76,0.65)', fontFamily: 'Space Mono, monospace', fontSize: '9px' }}>
                {results.length > 0 ? `${results.length} result${results.length !== 1 ? 's' : ''}` : ''}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
