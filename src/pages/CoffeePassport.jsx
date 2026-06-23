import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import { BackButton } from '../components/ui/BackButton'
import { SEO } from '../components/ui/SEO'
import { COFFEE_ORIGINS, COFFEE_ISO_SET } from '../data/coffeeOrigins'

const STORAGE_KEY = 'tbc-coffee-passport'
const loadVisited = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] } }
const saveVisited = (arr) => localStorage.setItem(STORAGE_KEY, JSON.stringify(arr))

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

function StampIcon({ stamped }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={stamped ? '#5A9E6A' : 'var(--color-border)'} strokeWidth="1.5" />
      {stamped ? (
        <path d="M7 12l3 3 7-7" stroke="#5A9E6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M12 8v4m0 4h.01" stroke="var(--color-text-faint)" strokeWidth="1.5" strokeLinecap="round" />
      )}
    </svg>
  )
}

function StampBadge({ origin }) {
  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <svg viewBox="0 0 80 80" className="absolute inset-0 w-full h-full">
        <circle cx="40" cy="40" r="36" fill={`${origin.color}18`} stroke={origin.color} strokeWidth="2" strokeDasharray="4 2" />
        <circle cx="40" cy="40" r="28" fill="none" stroke={origin.color} strokeWidth="1" opacity="0.4" />
      </svg>
      <span className="text-2xl relative z-10">{origin.flag}</span>
    </div>
  )
}

export default function CoffeePassport() {
  const [visited, setVisited] = useState(loadVisited)
  const [selected, setSelected] = useState(null)
  const [position, setPosition] = useState({ coordinates: [20, 0], zoom: 1 })

  const toggle = (id) => {
    setVisited(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      saveVisited(next)
      return next
    })
  }

  const handleCountryClick = (geo) => {
    const iso = geo.properties.ISO_A3
    const origin = COFFEE_ORIGINS.find(o => o.iso === iso)
    if (origin) setSelected(origin)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <SEO title="Coffee Passport" description="Collect stamps from the world's great coffee origins. Track your coffee journey across 25 growing regions." />
      <BackButton to="/" label="Home" />

      {/* Hero header */}
      <section className="py-16 md:py-20 px-6 sm:px-10 xl:px-16 relative" style={{ background: 'linear-gradient(180deg, #2D1B14 0%, transparent 100%)' }}>
        <div className="max-w-[1600px] mx-auto">
          <p className="label-ornate mb-4">The Bean Chronicles</p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <h1 className="font-display text-5xl sm:text-7xl text-parchment leading-none">
                Coffee<br />
                <span className="font-display italic" style={{ color: 'var(--color-accent)' }}>Passport</span>
              </h1>
              <p className="text-parchment/50 mt-4 text-base max-w-md">
                Explore the world's great coffee origins. Click a country to read its story — mark the ones you've tasted.
              </p>
            </div>
            {/* Stamp counter */}
            <div className="flex items-center gap-4 px-6 py-4 rounded-2xl" style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}>
              <div className="text-center">
                <p className="font-display text-5xl" style={{ color: 'var(--color-accent)' }}>{visited.length}</p>
                <p className="text-[9px] uppercase tracking-[0.2em]" style={{ color: 'var(--color-text-faint)', fontFamily: 'Space Mono, monospace' }}>Stamped</p>
              </div>
              <div style={{ width: 1, height: 40, background: 'rgba(201,168,76,0.2)' }} />
              <div className="text-center">
                <p className="font-display text-5xl" style={{ color: 'var(--color-text-muted)' }}>{COFFEE_ORIGINS.length}</p>
                <p className="text-[9px] uppercase tracking-[0.2em]" style={{ color: 'var(--color-text-faint)', fontFamily: 'Space Mono, monospace' }}>Origins</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map + Detail panel */}
      <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 xl:px-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">

          {/* World map */}
          <div className="rounded-2xl overflow-hidden relative" style={{ background: '#1A2810', border: '1px solid var(--color-border)', minHeight: 420 }}>
            <ComposableMap
              projectionConfig={{ scale: 147, center: [20, 10] }}
              style={{ width: '100%', height: 'auto' }}
            >
              <ZoomableGroup zoom={position.zoom} center={position.coordinates} onMoveEnd={setPosition}>
                <Geographies geography={GEO_URL}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const iso = geo.properties.ISO_A3
                      const isCoffee = COFFEE_ISO_SET.has(iso)
                      const origin = COFFEE_ORIGINS.find(o => o.iso === iso)
                      const isVisited = origin && visited.includes(origin.id)
                      const isSelected = selected && origin && selected.id === origin.id
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onClick={() => handleCountryClick(geo)}
                          style={{
                            default: {
                              fill: isSelected ? '#C9A84C'
                                : isVisited ? '#5A9E6A'
                                : isCoffee ? '#4A6E38'
                                : '#1E2D16',
                              stroke: '#253818',
                              strokeWidth: 0.5,
                              outline: 'none',
                              cursor: isCoffee ? 'pointer' : 'default',
                              transition: 'fill 0.2s',
                            },
                            hover: {
                              fill: isCoffee ? (isVisited ? '#6AB57A' : '#C9A84C') : '#1E2D16',
                              stroke: '#253818',
                              strokeWidth: 0.5,
                              outline: 'none',
                              cursor: isCoffee ? 'pointer' : 'default',
                            },
                            pressed: { fill: '#C9A84C', outline: 'none' },
                          }}
                        />
                      )
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>

            {/* Map legend */}
            <div className="absolute bottom-4 left-4 flex items-center gap-4">
              {[
                { color: '#4A6E38', label: 'Origin' },
                { color: '#5A9E6A', label: 'Tried' },
                { color: '#C9A84C', label: 'Selected' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm" style={{ background: color }} />
                  <span className="text-[9px] uppercase tracking-[0.14em]" style={{ color: 'var(--color-text-faint)', fontFamily: 'Space Mono, monospace' }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Map hint */}
            {!selected && (
              <div className="absolute top-4 right-4 px-3 py-2 rounded-xl text-[10px]" style={{ background: 'rgba(0,0,0,0.5)', color: 'var(--color-text-faint)', fontFamily: 'Space Mono, monospace', backdropFilter: 'blur(8px)' }}>
                Click a highlighted country
              </div>
            )}
          </div>

          {/* Detail panel */}
          <div className="lg:sticky lg:top-24">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-2xl overflow-hidden"
                  style={{ background: 'var(--color-card)', border: `1.5px solid ${selected.color}40` }}
                >
                  {/* Header */}
                  <div className="p-6 pb-0" style={{ borderBottom: `1px solid ${selected.color}20`, background: `${selected.color}0D` }}>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <p className="text-3xl mb-1">{selected.flag}</p>
                        <h2 className="font-display text-3xl" style={{ color: 'var(--color-text)' }}>{selected.name}</h2>
                        <p className="text-[10px] uppercase tracking-[0.18em] mt-1" style={{ color: selected.color, fontFamily: 'Space Mono, monospace' }}>
                          {selected.roast} Roast · {selected.altitude}
                        </p>
                      </div>
                      {/* Stamp button */}
                      <motion.button
                        onClick={() => toggle(selected.id)}
                        whileTap={{ scale: 0.9 }}
                        className="flex-shrink-0 flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200"
                        style={{
                          background: visited.includes(selected.id) ? '#5A9E6A20' : 'var(--color-surface)',
                          border: `1.5px solid ${visited.includes(selected.id) ? '#5A9E6A60' : 'var(--color-border)'}`,
                        }}
                      >
                        <StampIcon stamped={visited.includes(selected.id)} />
                        <span className="text-[8px] uppercase tracking-[0.14em]" style={{ color: visited.includes(selected.id) ? '#5A9E6A' : 'var(--color-text-faint)', fontFamily: 'Space Mono, monospace' }}>
                          {visited.includes(selected.id) ? 'Tried' : 'Mark'}
                        </span>
                      </motion.button>
                    </div>
                    <p className="text-sm leading-relaxed pb-5" style={{ color: 'var(--color-text-muted)' }}>{selected.desc}</p>
                  </div>

                  {/* Details */}
                  <div className="p-6 space-y-5">
                    {/* Regions */}
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.18em] mb-2" style={{ fontFamily: 'Space Mono, monospace', color: 'var(--color-text-faint)' }}>Key Regions</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selected.regions.map(r => (
                          <span key={r} className="px-2.5 py-1 rounded-full text-[10px]" style={{ background: `${selected.color}15`, color: selected.color, border: `1px solid ${selected.color}30`, fontFamily: 'Inter, sans-serif' }}>{r}</span>
                        ))}
                      </div>
                    </div>

                    {/* Flavor notes */}
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.18em] mb-2" style={{ fontFamily: 'Space Mono, monospace', color: 'var(--color-text-faint)' }}>Flavour Notes</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selected.flavor.map(f => (
                          <span key={f} className="px-2.5 py-1 rounded-full text-[10px]" style={{ background: 'var(--color-surface)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)', fontFamily: 'Inter, sans-serif' }}>{f}</span>
                        ))}
                      </div>
                    </div>

                    {/* Process + Harvest */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.18em] mb-1.5" style={{ fontFamily: 'Space Mono, monospace', color: 'var(--color-text-faint)' }}>Process</p>
                        {selected.process.map(p => (
                          <p key={p} className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{p}</p>
                        ))}
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.18em] mb-1.5" style={{ fontFamily: 'Space Mono, monospace', color: 'var(--color-text-faint)' }}>Harvest</p>
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{selected.harvest}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl flex flex-col items-center justify-center p-12 text-center"
                  style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', minHeight: 320 }}
                >
                  <div className="text-5xl mb-4">🗺️</div>
                  <p className="font-display text-xl mb-2" style={{ color: 'var(--color-text-muted)' }}>Select an Origin</p>
                  <p className="text-sm" style={{ color: 'var(--color-text-faint)' }}>Click any highlighted country on the map to read its story and collect your stamp.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Stamps collection */}
      <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 xl:px-16 pb-20">
        <div className="mb-8">
          <p className="label-ornate mb-3">Your Collection</p>
          <h2 className="font-display text-3xl" style={{ color: 'var(--color-text)' }}>Passport Stamps</h2>
        </div>

        {visited.length === 0 ? (
          <div className="rounded-2xl py-16 flex flex-col items-center gap-3" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <p className="text-4xl">✈️</p>
            <p className="text-sm" style={{ color: 'var(--color-text-faint)' }}>No stamps yet — start exploring the map above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {COFFEE_ORIGINS.filter(o => visited.includes(o.id)).map((origin, i) => (
              <motion.button
                key={origin.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04, type: 'spring', stiffness: 400, damping: 20 }}
                onClick={() => setSelected(origin)}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200"
                style={{ background: 'var(--color-card)', border: `1.5px solid ${origin.color}40` }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <StampBadge origin={origin} />
                <span className="text-[10px] font-medium text-center" style={{ color: 'var(--color-text-muted)', fontFamily: 'Inter, sans-serif' }}>{origin.name}</span>
              </motion.button>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
