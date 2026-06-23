import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import { COFFEE_ORIGINS, COFFEE_GEO_NAMES, findOriginByGeoName } from '../../data/coffeeOrigins'

function flagToISO(emoji) {
  return [...emoji].slice(0, 2)
    .map(c => String.fromCharCode(c.codePointAt(0) - 0x1F1E6 + 65))
    .join('')
    .toLowerCase()
}

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
const STORAGE_KEY = 'tbc-coffee-passport'
const loadVisited = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] } }
const saveVisited = (arr) => localStorage.setItem(STORAGE_KEY, JSON.stringify(arr))

function StampIcon({ stamped }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={stamped ? '#5A9E6A' : 'var(--color-border)'} strokeWidth="1.5" />
      {stamped
        ? <path d="M7 12l3 3 7-7" stroke="#5A9E6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        : <path d="M12 8v4m0 4h.01" stroke="var(--color-text-faint)" strokeWidth="1.5" strokeLinecap="round" />}
    </svg>
  )
}

export function PassportMapSection() {
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

  const handleZoomIn  = () => setPosition(p => ({ ...p, zoom: Math.min(p.zoom * 1.6, 8) }))
  const handleZoomOut = () => setPosition(p => ({ ...p, zoom: Math.max(p.zoom / 1.6, 1) }))

  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 xl:px-16 py-16">
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="label-ornate mb-3">Your Journey</p>
          <h2 className="font-display text-4xl md:text-5xl" style={{ color: 'var(--color-text)' }}>
            Coffee Passport
          </h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Click a highlighted country to explore its profile — then mark the ones you've tasted.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Stamp counter */}
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl" style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}>
            <span className="font-display text-3xl" style={{ color: 'var(--color-accent)' }}>{visited.length}</span>
            <span className="text-[9px] uppercase tracking-[0.2em]" style={{ color: 'var(--color-text-faint)', fontFamily: 'Space Mono, monospace' }}>/ {COFFEE_ORIGINS.length} Stamped</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
        {/* Map */}
        <div className="rounded-2xl overflow-hidden relative" style={{ background: '#1A2810', border: '1px solid var(--color-border)', minHeight: 380 }}>
          <ComposableMap projectionConfig={{ scale: 147, center: [20, 10] }} style={{ width: '100%', height: 'auto' }}>
            <ZoomableGroup zoom={position.zoom} center={position.coordinates} onMoveEnd={setPosition}>
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const isCoffee = COFFEE_GEO_NAMES.has(geo.properties.name)
                    const origin = findOriginByGeoName(geo.properties.name)
                    const isVisited = origin && visited.includes(origin.id)
                    const isSelected = selected && origin && selected.id === origin.id
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onClick={() => { const o = findOriginByGeoName(geo.properties.name); if (o) setSelected(o) }}
                        style={{
                          default: {
                            fill: isSelected ? '#C9A84C' : isVisited ? '#5A9E6A' : isCoffee ? '#4A6E38' : '#1E2D16',
                            stroke: '#253818', strokeWidth: 0.5, outline: 'none',
                            cursor: isCoffee ? 'pointer' : 'default', transition: 'fill 0.2s',
                          },
                          hover: {
                            fill: isCoffee ? (isVisited ? '#6AB57A' : '#C9A84C') : '#1E2D16',
                            stroke: '#253818', strokeWidth: 0.5, outline: 'none',
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

          {/* Zoom buttons */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            <button onClick={handleZoomIn} className="w-8 h-8 flex items-center justify-center rounded-lg text-base font-bold" style={{ background: 'rgba(0,0,0,0.55)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)', backdropFilter: 'blur(8px)' }} title="Zoom in">+</button>
            <button onClick={handleZoomOut} className="w-8 h-8 flex items-center justify-center rounded-lg text-base font-bold" style={{ background: 'rgba(0,0,0,0.55)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)', backdropFilter: 'blur(8px)' }} title="Zoom out">−</button>
          </div>

          {/* Hint */}
          <div className="absolute top-3 right-3 px-3 py-2 rounded-xl text-[9px] flex flex-col gap-0.5" style={{ background: 'rgba(0,0,0,0.55)', color: 'var(--color-text-faint)', fontFamily: 'Space Mono, monospace', backdropFilter: 'blur(8px)' }}>
            <span>Scroll or +/− to zoom</span>
            <span>Click a <span style={{ color: '#4A6E38' }}>highlighted</span> country</span>
          </div>

          {/* Legend */}
          <div className="absolute bottom-3 left-3 flex items-center gap-3">
            {[{ color: '#4A6E38', label: 'Origin' }, { color: '#5A9E6A', label: 'Tried' }, { color: '#C9A84C', label: 'Selected' }].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
                <span className="text-[8px] uppercase tracking-[0.12em]" style={{ color: 'var(--color-text-faint)', fontFamily: 'Space Mono, monospace' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl overflow-hidden"
              style={{ background: 'var(--color-card)', border: `1.5px solid ${selected.color}40` }}
            >
              <div className="p-5" style={{ background: `${selected.color}0D`, borderBottom: `1px solid ${selected.color}20` }}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <img
                      src={`https://flagcdn.com/32x24/${flagToISO(selected.flag)}.png`}
                      srcSet={`https://flagcdn.com/64x48/${flagToISO(selected.flag)}.png 2x`}
                      width={32} height={24} alt={selected.name}
                      style={{ borderRadius: 3, objectFit: 'cover', marginBottom: 4 }}
                    />
                    <h3 className="font-display text-2xl" style={{ color: 'var(--color-text)' }}>{selected.name}</h3>
                    <p className="text-[9px] uppercase tracking-[0.16em] mt-0.5" style={{ color: selected.color, fontFamily: 'Space Mono, monospace' }}>
                      {selected.roast} · {selected.altitude}
                    </p>
                  </div>
                  <motion.button
                    onClick={() => toggle(selected.id)}
                    whileTap={{ scale: 0.88 }}
                    className="flex-shrink-0 flex flex-col items-center gap-1 p-2.5 rounded-xl"
                    style={{
                      background: visited.includes(selected.id) ? '#5A9E6A18' : 'var(--color-surface)',
                      border: `1.5px solid ${visited.includes(selected.id) ? '#5A9E6A50' : 'var(--color-border)'}`,
                    }}
                  >
                    <StampIcon stamped={visited.includes(selected.id)} />
                    <span className="text-[7px] uppercase tracking-[0.12em]" style={{ color: visited.includes(selected.id) ? '#5A9E6A' : 'var(--color-text-faint)', fontFamily: 'Space Mono, monospace' }}>
                      {visited.includes(selected.id) ? 'Tried ✓' : 'Mark'}
                    </span>
                  </motion.button>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{selected.desc}</p>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <p className="text-[8px] uppercase tracking-[0.16em] mb-2" style={{ fontFamily: 'Space Mono, monospace', color: 'var(--color-text-faint)' }}>Flavour Notes</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.flavor.map(f => (
                      <span key={f} className="px-2 py-1 rounded-full text-[9px]" style={{ background: `${selected.color}15`, color: selected.color, border: `1px solid ${selected.color}25` }}>{f}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[8px] uppercase tracking-[0.16em] mb-2" style={{ fontFamily: 'Space Mono, monospace', color: 'var(--color-text-faint)' }}>Key Regions</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.regions.map(r => (
                      <span key={r} className="px-2 py-1 rounded-full text-[9px]" style={{ background: 'var(--color-surface)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>{r}</span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.16em] mb-1" style={{ fontFamily: 'Space Mono, monospace', color: 'var(--color-text-faint)' }}>Process</p>
                    {selected.process.map(p => <p key={p} className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{p}</p>)}
                  </div>
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.16em] mb-1" style={{ fontFamily: 'Space Mono, monospace', color: 'var(--color-text-faint)' }}>Harvest</p>
                    <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{selected.harvest}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl flex flex-col items-center justify-center p-10 text-center"
              style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', minHeight: 280 }}
            >
              <div className="text-4xl mb-3">🗺️</div>
              <p className="font-display text-lg mb-1" style={{ color: 'var(--color-text-muted)' }}>Select an Origin</p>
              <p className="text-xs" style={{ color: 'var(--color-text-faint)' }}>Click any highlighted country on the map to read its story and collect your stamp.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
