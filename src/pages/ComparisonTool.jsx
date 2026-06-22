import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { BackButton } from '../components/ui/BackButton'
import { SEO } from '../components/ui/SEO'

// ── Data ──────────────────────────────────────────────────────────────────────

const DEVICES = [
  {
    id: 'espresso-machine',
    name: 'Espresso Machine',
    category: 'Pressure Brewing',
    difficulty: 4,
    cost: '$$$$',
    brewTime: '25–35 sec',
    yield: '25–35ml',
    grind: 'Extra Fine',
    pressure: '9 bar',
    bestFor: 'Espresso, Lattes, Cappuccinos',
    pros: ['Fastest brew time', 'Produces crema', 'Versatile espresso base'],
    cons: ['High cost', 'Steep learning curve', 'Maintenance required'],
    flavourProfile: ['Intense', 'Concentrated', 'Complex', 'Thick body'],
    icon: '☕',
  },
  {
    id: 'v60',
    name: 'Hario V60',
    category: 'Pour Over',
    difficulty: 3,
    cost: '$',
    brewTime: '3–4 min',
    yield: '250–500ml',
    grind: 'Medium-Fine',
    pressure: 'Gravity',
    bestFor: 'Single origin, light roasts',
    pros: ['Exceptional clarity', 'Low cost', 'Portable', 'Showcases terroir'],
    cons: ['Requires skill and practice', 'Needs gooseneck kettle', 'One cup at a time'],
    flavourProfile: ['Clean', 'Bright', 'Nuanced', 'Tea-like'],
    icon: '🫖',
  },
  {
    id: 'french-press',
    name: 'French Press',
    category: 'Immersion',
    difficulty: 1,
    cost: '$',
    brewTime: '4 min',
    yield: '300–800ml',
    grind: 'Coarse',
    pressure: 'Immersion',
    bestFor: 'Medium/dark roasts, full body lovers',
    pros: ['Simple and forgiving', 'Full body', 'No paper filters', 'Makes large batches'],
    cons: ['Sediment in cup', 'Over-extraction risk', 'Not portable'],
    flavourProfile: ['Full body', 'Rich', 'Earthy', 'Textured'],
    icon: '🍵',
  },
  {
    id: 'aeropress',
    name: 'AeroPress',
    category: 'Pressure + Immersion',
    difficulty: 2,
    cost: '$',
    brewTime: '1–2 min',
    yield: '30–300ml',
    grind: 'Fine to Medium',
    pressure: '0.35 bar',
    bestFor: 'Travel, experimentation, versatility',
    pros: ['Incredibly versatile', 'Fast brew', 'Easy cleanup', 'Portable', 'Forgiving'],
    cons: ['Makes only 1 cup', 'Plastic construction', 'Many variables to learn'],
    flavourProfile: ['Smooth', 'Low acid', 'Concentrated', 'Versatile'],
    icon: '💉',
  },
  {
    id: 'moka-pot',
    name: 'Moka Pot',
    category: 'Stovetop',
    difficulty: 2,
    cost: '$',
    brewTime: '5–6 min',
    yield: '50–300ml',
    grind: 'Fine',
    pressure: '1.5 bar',
    bestFor: 'Bold coffee without an espresso machine',
    pros: ['Strong espresso-like brew', 'Low cost', 'Durable', 'No electricity'],
    cons: ['Easy to burn coffee', 'Not true espresso', 'Requires practice'],
    flavourProfile: ['Bold', 'Robust', 'Bitter notes', 'Espresso-adjacent'],
    icon: '⚗️',
  },
  {
    id: 'cold-brew',
    name: 'Cold Brew Tower',
    category: 'Cold Extraction',
    difficulty: 1,
    cost: '$$',
    brewTime: '12–24 hours',
    yield: '500–1000ml',
    grind: 'Extra Coarse',
    pressure: 'Gravity/Immersion',
    bestFor: 'Hot weather, concentrate, low-acid needs',
    pros: ['Very low acidity', 'Smooth and sweet', 'Makes large batches', 'Shelf stable for weeks'],
    cons: ['Requires planning ahead', 'Uses a lot of coffee', 'Long brew time'],
    flavourProfile: ['Smooth', 'Sweet', 'Chocolate', 'Low acid'],
    icon: '🧊',
  },
  {
    id: 'siphon',
    name: 'Siphon / Vacuum Pot',
    category: 'Vacuum Brewing',
    difficulty: 5,
    cost: '$$$',
    brewTime: '6–8 min',
    yield: '200–400ml',
    grind: 'Medium',
    pressure: 'Vacuum pressure',
    bestFor: 'Theatre, special occasions, delicate coffees',
    pros: ['Spectacular visual experience', 'Clean cup', 'Consistent temperature', 'Unique flavour extraction'],
    cons: ['Very fragile', 'Difficult to master', 'High cost', 'Slow cleanup'],
    flavourProfile: ['Clean', 'Delicate', 'Complex', 'Aromatic'],
    icon: '🔬',
  },
  {
    id: 'channi',
    name: 'Channi / Indian Filter',
    category: 'Strainer Brewing',
    difficulty: 1,
    cost: '$',
    brewTime: '5–10 min',
    yield: '100–150ml decoction',
    grind: 'Fine-Medium',
    pressure: 'Gravity drip',
    bestFor: 'South Indian Filter Coffee, chai-style brewing',
    pros: ['Centuries-old tradition', 'Produces thick decoction', 'Very low cost', 'Milk-friendly'],
    cons: ['Regional technique', 'Limited international visibility', 'Best with specific chicory blends'],
    flavourProfile: ['Bold', 'Earthy', 'Full body', 'Rustic', 'Milk-friendly'],
    icon: '🫙',
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

const CLARITY_WORDS = ['clean', 'clear', 'bright', 'nuanced', 'delicate', 'aromatic', 'tea-like']

function clarityScore(device) {
  return device.flavourProfile.filter(w =>
    CLARITY_WORDS.includes(w.toLowerCase())
  ).length
}

// parse cost string to a number for comparison
function costNum(cost) {
  return cost.length // '$' = 1, '$$' = 2, etc.
}

// very rough speed rank: lower = faster
const SPEED_MAP = {
  'espresso-machine': 1,
  'aeropress': 2,
  'v60': 3,
  'french-press': 4,
  'moka-pot': 5,
  'channi': 6,
  'siphon': 7,
  'cold-brew': 8,
}

function speedRank(device) {
  return SPEED_MAP[device.id] ?? 5
}

function generateVerdict(left, right) {
  const lines = []

  // Speed
  const leftSpeed = speedRank(left)
  const rightSpeed = speedRank(right)
  if (leftSpeed !== rightSpeed) {
    const faster = leftSpeed < rightSpeed ? left : right
    lines.push({ label: 'speed', text: `go with the **${faster.name}** — it's the quicker brew.` })
  } else {
    lines.push({ label: 'speed', text: `both methods take a similar amount of time.` })
  }

  // Cost
  const lc = costNum(left.cost)
  const rc = costNum(right.cost)
  if (lc === rc) {
    lines.push({ label: 'low cost', text: `both options are equally affordable (${left.cost}).` })
  } else {
    const cheaper = lc < rc ? left : right
    lines.push({ label: 'low cost', text: `go with the **${cheaper.name}** — it costs ${cheaper.cost} vs ${lc < rc ? right.cost : left.cost}.` })
  }

  // Effort / difficulty
  if (left.difficulty !== right.difficulty) {
    const easier = left.difficulty < right.difficulty ? left : right
    lines.push({ label: 'minimal effort', text: `**${easier.name}** wins with a difficulty of ${easier.difficulty}/5.` })
  } else {
    lines.push({ label: 'minimal effort', text: `both require the same level of skill (${left.difficulty}/5).` })
  }

  // Flavour clarity
  const lClarity = clarityScore(left)
  const rClarity = clarityScore(right)
  if (lClarity !== rClarity) {
    const clearer = lClarity > rClarity ? left : right
    lines.push({ label: 'flavour clarity', text: `**${clearer.name}** is the choice — its profile (${clearer.flavourProfile.join(', ')}) is notably cleaner.` })
  } else {
    lines.push({ label: 'flavour clarity', text: `both offer comparable flavour transparency.` })
  }

  return lines
}

// ── Sub-components ────────────────────────────────────────────────────────────

const selectStyle = {
  background: 'var(--color-surface)',
  border: '1px solid rgba(80,120,60,0.3)',
  color: 'var(--color-text)',
  borderRadius: '0.75rem',
  padding: '0.65rem 1rem',
  fontSize: '0.875rem',
  cursor: 'pointer',
  outline: 'none',
  width: '100%',
}

function BeanDifficulty({ value }) {
  return (
    <div className="flex gap-1 items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          style={{ fontSize: '1rem', opacity: i < value ? 1 : 0.2 }}
        >
          ☕
        </span>
      ))}
    </div>
  )
}

function DeviceColumn({ device }) {
  return (
    <motion.div
      key={device.id}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        background: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: '1.25rem',
        padding: '2rem 1.5rem',
        flex: 1,
        minWidth: 0,
      }}
    >
      {/* Icon */}
      <div style={{ fontSize: '3.5rem', textAlign: 'center', marginBottom: '1rem' }}>
        {device.icon}
      </div>

      {/* Name */}
      <h2
        style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: '1.6rem',
          color: 'var(--color-text)',
          textAlign: 'center',
          marginBottom: '0.5rem',
          lineHeight: 1.2,
        }}
      >
        {device.name}
      </h2>

      {/* Category chip */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <span
          style={{
            display: 'inline-block',
            border: '1px solid var(--color-accent-border)',
            color: 'var(--color-accent)',
            fontSize: '0.72rem',
            fontFamily: '"Space Mono", monospace',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '0.25rem 0.75rem',
            borderRadius: '999px',
          }}
        >
          {device.category}
        </span>
      </div>

      {/* Specs table */}
      <div
        style={{
          borderTop: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
          paddingTop: '1rem',
          paddingBottom: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {[
          { label: 'Difficulty', value: <BeanDifficulty value={device.difficulty} /> },
          { label: 'Cost', value: <span style={{ color: 'var(--color-accent)', fontFamily: '"Space Mono", monospace' }}>{device.cost}</span> },
          { label: 'Brew Time', value: device.brewTime },
          { label: 'Yield', value: device.yield },
          { label: 'Grind', value: device.grind },
          { label: 'Pressure', value: device.pressure },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.45rem 0',
              borderBottom: '1px solid rgba(80,120,60,0.1)',
              gap: '0.5rem',
            }}
          >
            <span
              style={{
                color: 'var(--color-text-muted)',
                fontSize: '0.72rem',
                fontFamily: '"Space Mono", monospace',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                flexShrink: 0,
              }}
            >
              {label}
            </span>
            <span style={{ color: 'var(--color-text)', fontSize: '0.875rem', textAlign: 'right' }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Flavour profile pills */}
      <div style={{ marginBottom: '1.25rem' }}>
        <p
          style={{
            color: 'var(--color-text-muted)',
            fontSize: '0.7rem',
            fontFamily: '"Space Mono", monospace',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '0.6rem',
          }}
        >
          Flavour Profile
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {device.flavourProfile.map(f => (
            <span
              key={f}
              style={{
                background: 'rgba(201,168,76,0.1)',
                border: '1px solid var(--color-accent-border)',
                color: 'var(--color-accent)',
                fontSize: '0.75rem',
                padding: '0.2rem 0.65rem',
                borderRadius: '999px',
              }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Best For */}
      <div style={{ marginBottom: '1.25rem' }}>
        <p
          style={{
            color: 'var(--color-text-muted)',
            fontSize: '0.7rem',
            fontFamily: '"Space Mono", monospace',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '0.4rem',
          }}
        >
          Best For
        </p>
        <p style={{ color: 'var(--color-text)', fontSize: '0.875rem', lineHeight: 1.5 }}>{device.bestFor}</p>
      </div>

      {/* Pros */}
      <div style={{ marginBottom: '1rem' }}>
        <p
          style={{
            color: 'var(--color-text-muted)',
            fontSize: '0.7rem',
            fontFamily: '"Space Mono", monospace',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '0.6rem',
          }}
        >
          Pros
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {device.pros.map(p => (
            <li key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <span style={{ color: '#4ade80', flexShrink: 0, fontSize: '0.9rem', marginTop: '0.05rem' }}>✓</span>
              <span style={{ color: 'var(--color-text)', fontSize: '0.875rem', lineHeight: 1.4 }}>{p}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Cons */}
      <div>
        <p
          style={{
            color: 'var(--color-text-muted)',
            fontSize: '0.7rem',
            fontFamily: '"Space Mono", monospace',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '0.6rem',
          }}
        >
          Cons
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {device.cons.map(c => (
            <li key={c} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <span style={{ color: '#f87171', flexShrink: 0, fontSize: '0.9rem', marginTop: '0.05rem' }}>✕</span>
              <span style={{ color: 'var(--color-text)', fontSize: '0.875rem', lineHeight: 1.4 }}>{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

// Render verdict text with **bold** markdown-like syntax
function VerdictText({ text }) {
  const parts = text.split(/\*\*(.+?)\*\*/)
  return (
    <span>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} style={{ color: 'var(--color-accent)' }}>{part}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ComparisonTool() {
  const [leftId, setLeftId] = useState('v60')
  const [rightId, setRightId] = useState('french-press')

  const leftDevice = DEVICES.find(d => d.id === leftId)
  const rightDevice = DEVICES.find(d => d.id === rightId)
  const verdict = generateVerdict(leftDevice, rightDevice)

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <SEO title="Brewing Device Comparison" description="Compare any two coffee brewing devices side-by-side — flavour, technique, difficulty, and which to choose." />
      <BackButton to="/tools" label="Tools" />
      <div style={{ paddingTop: '6rem' }}>
        {/* Hero */}
        <section style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem 2rem', textAlign: 'center' }}>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              fontFamily: '"Space Mono", monospace',
              fontSize: '0.72rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
              marginBottom: '1rem',
            }}
          >
            ✦ The Tasting Room ✦
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              color: 'var(--color-text)',
              lineHeight: 1.1,
              marginBottom: '1.25rem',
            }}
          >
            Compare{' '}
            <span style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>/ Methods</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{
              color: 'var(--color-text-muted)',
              fontSize: '1.05rem',
              maxWidth: '520px',
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            Put any two brew methods head to head. Find the right tool for your cup.
          </motion.p>
        </section>

        {/* Selector panel */}
        <section style={{ maxWidth: '860px', margin: '0 auto', padding: '0 1.5rem 2.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '1.25rem',
              padding: '1.25rem 1.5rem',
            }}
          >
            {/* Left select */}
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: 'block',
                  color: 'var(--color-text-muted)',
                  fontSize: '0.68rem',
                  fontFamily: '"Space Mono", monospace',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem',
                }}
              >
                Method A
              </label>
              <select
                value={leftId}
                onChange={e => setLeftId(e.target.value)}
                style={selectStyle}
              >
                {DEVICES.map(d => (
                  <option key={d.id} value={d.id}>{d.icon} {d.name}</option>
                ))}
              </select>
            </div>

            {/* VS badge */}
            <div
              style={{
                width: '2.75rem',
                height: '2.75rem',
                borderRadius: '50%',
                background: 'rgba(201,168,76,0.12)',
                border: '1px solid rgba(201,168,76,0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: '1rem',
                  color: 'var(--color-accent)',
                  fontWeight: 700,
                }}
              >
                VS
              </span>
            </div>

            {/* Right select */}
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: 'block',
                  color: 'var(--color-text-muted)',
                  fontSize: '0.68rem',
                  fontFamily: '"Space Mono", monospace',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem',
                }}
              >
                Method B
              </label>
              <select
                value={rightId}
                onChange={e => setRightId(e.target.value)}
                style={selectStyle}
              >
                {DEVICES.map(d => (
                  <option key={d.id} value={d.id}>{d.icon} {d.name}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Comparison columns */}
        <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem 3rem' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={leftId + '-' + rightId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}
            >
              <DeviceColumn device={leftDevice} />
              <DeviceColumn device={rightDevice} />
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Head-to-head verdict */}
        <section style={{ maxWidth: '860px', margin: '0 auto', padding: '0 1.5rem 5rem' }}>
          <motion.div
            key={leftId + rightId + '-verdict'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid rgba(201,168,76,0.18)',
              borderRadius: '1.25rem',
              padding: '2rem 2rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '50%',
                  background: 'var(--color-accent-dim)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                }}
              >
                ⚖️
              </div>
              <h3
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: '1.4rem',
                  color: 'var(--color-text)',
                  margin: 0,
                }}
              >
                Head-to-Head Verdict
              </h3>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {verdict.map(({ label, text }) => (
                <li
                  key={label}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    paddingBottom: '0.85rem',
                    borderBottom: '1px solid rgba(80,120,60,0.15)',
                  }}
                >
                  <span
                    style={{
                      background: 'rgba(201,168,76,0.1)',
                      border: '1px solid rgba(201,168,76,0.3)',
                      color: 'var(--color-accent)',
                      fontSize: '0.68rem',
                      fontFamily: '"Space Mono", monospace',
                      textTransform: 'uppercase',
                      letterSpacing: '0.07em',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '999px',
                      whiteSpace: 'nowrap',
                      marginTop: '0.15rem',
                      flexShrink: 0,
                    }}
                  >
                    {label}
                  </span>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                    If you value this —{' '}
                    <VerdictText text={text} />
                  </p>
                </li>
              ))}
            </ul>
          </motion.div>
        </section>
      </div>
    </div>
  )
}
