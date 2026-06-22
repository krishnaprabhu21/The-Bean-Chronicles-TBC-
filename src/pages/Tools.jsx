import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SEO } from '../components/ui/SEO'
import { BeanCatcherGame } from './BeanCatcher'

// ── SVG Icons ─────────────────────────────────────────────────────────────────

function IconTasting() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="28" r="12" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M20 22C20 18 24 14 24 14C24 14 28 18 28 22" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M17 32C17 32 18.5 36 24 36C29.5 36 31 32 31 32" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="24" cy="28" r="3" fill="rgba(201,168,76,0.25)" stroke="#C9A84C" strokeWidth="1.2"/>
      <path d="M24 8V11" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M36 14L34 16" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 14L14 16" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function IconCalculator() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="8" width="28" height="32" rx="3" stroke="#C9A84C" strokeWidth="1.5"/>
      <rect x="14" y="12" width="20" height="8" rx="1.5" stroke="#C9A84C" strokeWidth="1.2" fill="rgba(201,168,76,0.1)"/>
      <circle cx="17" cy="26" r="2" fill="rgba(201,168,76,0.25)" stroke="#C9A84C" strokeWidth="1.2"/>
      <circle cx="24" cy="26" r="2" fill="rgba(201,168,76,0.25)" stroke="#C9A84C" strokeWidth="1.2"/>
      <circle cx="31" cy="26" r="2" fill="rgba(201,168,76,0.25)" stroke="#C9A84C" strokeWidth="1.2"/>
      <circle cx="17" cy="33" r="2" fill="rgba(201,168,76,0.25)" stroke="#C9A84C" strokeWidth="1.2"/>
      <circle cx="24" cy="33" r="2" fill="rgba(201,168,76,0.25)" stroke="#C9A84C" strokeWidth="1.2"/>
      <rect x="29" y="31" width="4" height="4" rx="1" fill="rgba(201,168,76,0.3)" stroke="#C9A84C" strokeWidth="1.2"/>
    </svg>
  )
}

function IconGlossary() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 10H30C31.1 10 32 10.9 32 12V38C32 39.1 31.1 40 30 40H12C10.9 40 10 39.1 10 38V12C10 10.9 10.9 10 12 10Z" stroke="#C9A84C" strokeWidth="1.5"/>
      <path d="M32 14H36C37.1 14 38 14.9 38 16V38C38 39.1 37.1 40 36 40H32" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M15 18H27" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M15 23H27" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M15 28H22" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M19 8V12" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M23 8V12" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function IconCompare() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="12" width="16" height="26" rx="3" stroke="#C9A84C" strokeWidth="1.5" fill="rgba(201,168,76,0.05)"/>
      <rect x="26" y="12" width="16" height="26" rx="3" stroke="#C9A84C" strokeWidth="1.5" fill="rgba(201,168,76,0.05)"/>
      <path d="M14 20H16" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10 24H16" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 28H16" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M30 20H36" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M30 24H34" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M30 28H36" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M22 24H26" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 1"/>
    </svg>
  )
}

function IconJournal() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="8" width="28" height="34" rx="3" stroke="#C9A84C" strokeWidth="1.5"/>
      <path d="M10 16H38" stroke="#C9A84C" strokeWidth="1.2" strokeDasharray="2 2"/>
      <path d="M18 8V42" stroke="#C9A84C" strokeWidth="1.5"/>
      <path d="M22 22L26 22" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M22 27L30 27" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M22 32L28 32" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="15" cy="24" r="1.5" fill="#C9A84C"/>
      <circle cx="15" cy="29" r="1.5" fill="#C9A84C"/>
      <circle cx="15" cy="34" r="1.5" fill="#C9A84C"/>
    </svg>
  )
}

function IconSubmit() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 8V30" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M18 14L24 8L30 14" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 22V36C14 37.1 14.9 38 16 38H32C33.1 38 34 37.1 34 36V22" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

// ── Tool cards data ───────────────────────────────────────────────────────────

const TOOLS = [
  {
    id: 'tasting',
    to: '/tasting',
    eyebrow: 'The Flavour Lab',
    name: 'Tasting Notes',
    description: 'Generate your personalised coffee tasting profile',
    Icon: IconTasting,
  },
  {
    id: 'calculator',
    to: '/calculator',
    eyebrow: "The Brewmaster's Workshop",
    name: 'Brew Calculator',
    description: 'Dial in your perfect dose and ratio',
    Icon: IconCalculator,
  },
  {
    id: 'glossary',
    to: '/glossary',
    eyebrow: 'The Lexicon',
    name: 'Glossary',
    description: 'A–Z of every coffee term you\'ll ever need',
    Icon: IconGlossary,
  },
  {
    id: 'compare',
    to: '/compare',
    eyebrow: 'The Tasting Room',
    name: 'Compare Methods',
    description: 'Head-to-head comparisons of any two brew methods',
    Icon: IconCompare,
  },
  {
    id: 'journal',
    to: '/journal',
    eyebrow: "The Barista's Notebook",
    name: 'Brew Journal',
    description: 'Log and track every brew you make',
    Icon: IconJournal,
  },
  {
    id: 'submit-recipe',
    to: '/submit-recipe',
    eyebrow: 'Community Brews',
    name: 'Submit Recipe',
    description: 'Share your signature recipe with the community',
    Icon: IconSubmit,
  },
]

// ── ToolCard ──────────────────────────────────────────────────────────────────

function ToolCard({ tool, index }) {
  const [hovered, setHovered] = useState(false)
  const { to, eyebrow, name, description, Icon } = tool

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: 'easeOut' }}
    >
      <Link
        to={to}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '1.75rem',
          background: 'var(--color-surface)',
          border: `1px solid ${hovered ? 'rgba(201,168,76,0.4)' : 'rgba(80,120,60,0.2)'}`,
          borderRadius: '1.25rem',
          textDecoration: 'none',
          height: '100%',
          transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
          transform: hovered ? 'scale(1.03)' : 'scale(1)',
          boxShadow: hovered ? '0 8px 40px rgba(201,168,76,0.08)' : 'none',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle glow on hover */}
        {hovered && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)',
            }}
          />
        )}

        {/* Icon */}
        <div
          style={{
            width: '3.5rem',
            height: '3.5rem',
            borderRadius: '0.875rem',
            background: 'rgba(201,168,76,0.08)',
            border: '1px solid rgba(201,168,76,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
            transition: 'background 0.25s',
            ...(hovered ? { background: 'rgba(201,168,76,0.14)' } : {}),
          }}
        >
          <Icon />
        </div>

        {/* Eyebrow */}
        <p
          style={{
            fontFamily: '"Space Mono", monospace',
            fontSize: '0.62rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
            marginBottom: '0.4rem',
            margin: '0 0 0.4rem',
          }}
        >
          {eyebrow}
        </p>

        {/* Name */}
        <h3
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '1.4rem',
            color: 'var(--color-text)',
            lineHeight: 1.2,
            marginBottom: '0.6rem',
            margin: '0 0 0.6rem',
          }}
        >
          {name}
        </h3>

        {/* Description */}
        <p
          style={{
            color: 'var(--color-text-muted)',
            fontSize: '0.875rem',
            lineHeight: 1.6,
            margin: '0',
            flex: 1,
          }}
        >
          {description}
        </p>

        {/* Arrow */}
        <div
          style={{
            marginTop: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            overflow: 'hidden',
          }}
        >
          <motion.span
            animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            style={{
              color: 'var(--color-accent)',
              fontSize: '0.8rem',
              fontFamily: '"Space Mono", monospace',
              letterSpacing: '0.06em',
            }}
          >
            Explore →
          </motion.span>
        </div>
      </Link>
    </motion.div>
  )
}

// ── BloomTimer ────────────────────────────────────────────────────────────────

const SNAP_DURATIONS = [30, 45, 60]

function durToAngle(s) {
  return (s / 60) * 360
}

function angleToDur(deg) {
  const clamped = Math.max(0, Math.min(360, deg))
  const raw = Math.round((clamped / 360) * 60)
  return SNAP_DURATIONS.reduce((prev, curr) =>
    Math.abs(curr - raw) < Math.abs(prev - raw) ? curr : prev
  )
}

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function arcPath(cx, cy, r, startDeg, endDeg) {
  if (Math.abs(endDeg - startDeg) < 0.01) return ''
  const full = endDeg - startDeg >= 360
  const effectiveEnd = full ? startDeg + 359.99 : endDeg
  const start = polarToCartesian(cx, cy, r, startDeg)
  const end = polarToCartesian(cx, cy, r, effectiveEnd)
  const largeArc = effectiveEnd - startDeg > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`
}

function annularArcPath(cx, cy, r1, r2, startDeg, endDeg) {
  if (Math.abs(endDeg - startDeg) < 0.01) return ''
  const full = endDeg - startDeg >= 360
  const effectiveEnd = full ? startDeg + 359.99 : endDeg
  const outerStart = polarToCartesian(cx, cy, r2, startDeg)
  const outerEnd = polarToCartesian(cx, cy, r2, effectiveEnd)
  const innerEnd = polarToCartesian(cx, cy, r1, effectiveEnd)
  const innerStart = polarToCartesian(cx, cy, r1, startDeg)
  const largeArc = effectiveEnd - startDeg > 180 ? 1 : 0
  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${r2} ${r2} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${r1} ${r1} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ')
}

function BloomTimer() {
  const [duration, setDuration] = useState(45)
  const [remaining, setRemaining] = useState(45)
  const [running, setRunning] = useState(false)
  const [liveAngle, setLiveAngle] = useState(durToAngle(45))
  const [flash, setFlash] = useState(false)
  const dragging = useRef(false)
  const svgRef = useRef(null)

  // Drag handlers
  function getAngleFromEvent(e, svg) {
    const rect = svg.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const dx = clientX - cx
    const dy = clientY - cy
    let angle = (Math.atan2(dx, -dy) * 180) / Math.PI
    if (angle < 0) angle += 360
    return angle
  }

  function handleDialStart(e) {
    if (running) return
    e.preventDefault()
    dragging.current = true
    const angle = getAngleFromEvent(e, svgRef.current)
    const snapped = angleToDur(angle)
    setLiveAngle(durToAngle(snapped))
    setDuration(snapped)
    setRemaining(snapped)
  }

  useEffect(() => {
    function onMove(e) {
      if (!dragging.current || !svgRef.current) return
      const angle = getAngleFromEvent(e, svgRef.current)
      const clamped = Math.max(0, Math.min(360, angle))
      const snapped = angleToDur(clamped)
      setLiveAngle(durToAngle(snapped))
      setDuration(snapped)
      setRemaining(snapped)
    }
    function onEnd() {
      dragging.current = false
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onEnd)
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onEnd)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onEnd)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onEnd)
    }
  }, [])

  // Countdown logic
  useEffect(() => {
    if (!running) return
    if (remaining <= 0) {
      setRunning(false)
      setLiveAngle(0)
      setRemaining(duration)
      setFlash(true)
      setTimeout(() => setFlash(false), 600)
      return
    }
    const id = setInterval(() => {
      setRemaining((r) => {
        const next = r - 1
        setLiveAngle((next / 60) * 360)
        return next
      })
    }, 1000)
    return () => clearInterval(id)
  }, [running, remaining])

  function handleReset() {
    setRunning(false)
    setRemaining(duration)
    setLiveAngle(durToAngle(duration))
  }

  const CX = 140, CY = 140

  // Tick marks
  const ticks = []
  for (let i = 0; i < 60; i++) {
    const isMajor = i % 15 === 0
    const r1 = isMajor ? 110 : 115
    const r2 = isMajor ? 125 : 122
    const angle = (i / 60) * 360
    const p1 = polarToCartesian(CX, CY, r1, angle)
    const p2 = polarToCartesian(CX, CY, r2, angle)
    ticks.push(
      <line
        key={i}
        x1={p1.x} y1={p1.y}
        x2={p2.x} y2={p2.y}
        stroke={isMajor ? 'var(--color-text-faint)' : 'var(--color-border)'}
        strokeWidth={isMajor ? 2 : 0.8}
      />
    )
  }

  // Quadrant labels: 15s at 90°, 30s at 180°, 45s at 270°, 60s at 0°
  const LABELS = [
    { label: '60s', deg: 0 },
    { label: '15s', deg: 90 },
    { label: '30s', deg: 180 },
    { label: '45s', deg: 270 },
  ]

  const labelEls = LABELS.map(({ label, deg }) => {
    const pos = polarToCartesian(CX, CY, 100, deg)
    return (
      <text
        key={label}
        x={pos.x} y={pos.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="var(--color-text-faint)"
        fontSize="9"
        fontFamily='"Space Mono", monospace'
      >
        {label}
      </text>
    )
  })

  const trackPath = annularArcPath(CX, CY, 118, 130, 0, liveAngle || 0.01)
  const progressPath = running ? annularArcPath(CX, CY, 118, 130, 0, (remaining / 60) * 360 || 0.01) : null

  const handColor = running ? '#5A9E6A' : 'var(--color-accent)'

  const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
  }

  return (
    <section className="w-full max-w-[1600px] mx-auto px-8 sm:px-14 xl:px-20 py-16">
      {/* Divider */}
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(80,120,60,0.4), transparent)', marginBottom: '4rem' }} />

      <motion.div {...fadeUp} style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.75rem' }}>
          ✦ Brew Ritual ✦
        </p>
        <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--color-text)', lineHeight: 1.1 }}>
          Bloom{' '}
          <span style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>Timer</span>
        </h2>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '3rem', alignItems: 'center' }}>
        {/* Left: SVG Dial */}
        <motion.div {...fadeUp} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', position: 'relative' }}>
          {/* Flash overlay */}
          {flash && (
            <motion.div
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 1.08, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: 'rgba(90,158,106,0.35)',
                zIndex: 10,
                pointerEvents: 'none',
                width: 280,
                height: 280,
                margin: '0 auto',
              }}
            />
          )}

          <svg
            ref={svgRef}
            viewBox="0 0 280 280"
            width="280"
            height="280"
            style={{ cursor: running ? 'default' : 'grab', userSelect: 'none', touchAction: 'none' }}
            onMouseDown={handleDialStart}
            onTouchStart={handleDialStart}
          >
            {/* Outer ring */}
            <circle cx={CX} cy={CY} r={130} fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth={1} />

            {/* Track arc (set duration indicator) */}
            {liveAngle > 0.5 && (
              <path d={trackPath} fill="rgba(201,168,76,0.25)" />
            )}

            {/* Active progress arc */}
            {running && progressPath && (
              <path d={progressPath} fill="var(--color-accent)" opacity={0.9} />
            )}

            {/* Tick marks */}
            {ticks}

            {/* Quadrant labels */}
            {labelEls}

            {/* Clock hand */}
            <g
              style={{
                transform: `rotate(${liveAngle}deg)`,
                transformOrigin: `${CX}px ${CY}px`,
                transition: dragging.current || running ? 'none' : 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
              }}
            >
              <line
                x1={CX} y1={CY + 10}
                x2={CX} y2={CY - 100}
                stroke={handColor}
                strokeWidth={2.5}
                strokeLinecap="round"
              />
              <circle cx={CX} cy={CY - 100} r={6} fill={handColor} />
            </g>

            {/* Center hub */}
            <circle cx={CX} cy={CY} r={14} fill="var(--color-card)" stroke="var(--color-accent)" strokeWidth={1.5} />
            <text
              x={CX} y={CY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="var(--color-text-faint)"
              fontSize="7"
              fontFamily='"Space Mono", monospace'
              letterSpacing="0.05em"
            >
              BLOOM
            </text>
          </svg>

          {/* Countdown display */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: '"Space Mono", monospace',
              fontSize: '3rem',
              fontWeight: 700,
              color: running ? '#5A9E6A' : 'var(--color-accent)',
              lineHeight: 1,
              marginBottom: '0.4rem',
              transition: 'color 0.3s',
            }}>
              {remaining}s
            </div>
            <p style={{ color: 'var(--color-text-faint)', fontSize: '0.8rem', fontFamily: '"Space Mono", monospace', letterSpacing: '0.08em' }}>
              {running ? 'Brewing...' : 'Bloom phase — set your duration'}
            </p>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => setRunning((r) => !r)}
              style={{
                background: '#5A9E6A',
                border: 'none',
                borderRadius: '0.75rem',
                color: '#fff',
                padding: '0.65rem 1.75rem',
                fontSize: '0.875rem',
                cursor: 'pointer',
                fontFamily: '"Space Mono", monospace',
                letterSpacing: '0.05em',
                fontWeight: 600,
                transition: 'opacity 0.15s, transform 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
            >
              {running ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={handleReset}
              style={{
                background: 'transparent',
                border: '1px solid rgba(90,158,106,0.5)',
                borderRadius: '0.75rem',
                color: '#5A9E6A',
                padding: '0.65rem 1.75rem',
                fontSize: '0.875rem',
                cursor: 'pointer',
                fontFamily: '"Space Mono", monospace',
                letterSpacing: '0.05em',
                fontWeight: 600,
                transition: 'border-color 0.15s, opacity 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(90,158,106,0.9)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(90,158,106,0.5)' }}
            >
              Reset
            </button>
          </div>
        </motion.div>

        {/* Right: explanation */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.12 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
        >
          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid rgba(201,168,76,0.15)',
              borderRadius: '1.25rem',
              padding: '2rem',
            }}
          >
            <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.6rem' }}>
              The Bloom
            </p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.75, margin: 0 }}>
              The first 30–60 seconds of any pour-over brew. Hot water saturates the grounds, releasing CO₂ trapped during roasting. Fresh beans bloom vigorously — stale beans barely move.
            </p>
          </div>

          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid rgba(80,120,60,0.15)',
              borderRadius: '1.25rem',
              padding: '2rem',
            }}
          >
            <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.6rem' }}>
              How to use
            </p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.75, margin: 0 }}>
              Drag the hand to set your bloom time (30, 45, or 60s), then hit Start. Pour just enough water to saturate the grounds — roughly 2× the coffee weight.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Tools() {
  const [email, setEmail] = useState('')
  const [ctaSubmitted, setCtaSubmitted] = useState(false)

  useEffect(() => {
    if (window.location.hash === '#play') {
      const el = document.getElementById('play')
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
    }
  }, [])

  function handleCta(e) {
    e.preventDefault()
    if (email.trim()) setCtaSubmitted(true)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <SEO title="Coffee Tools" description="Interactive coffee tools — tasting notes generator, brew calculator, glossary, comparison tool, and brew journal." />
      <div style={{ paddingTop: '6rem' }}>
        {/* Hero */}
        <section style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem 2.5rem', textAlign: 'center' }}>
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
            ✦ The Workshop ✦
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
            Coffee{' '}
            <span style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>/ Tools</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{
              color: 'var(--color-text-muted)',
              fontSize: '1.05rem',
              maxWidth: '540px',
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            Interactive tools for the curious coffee mind — from dialling in ratios to building your brew journal.
          </motion.p>
        </section>

        {/* Divider */}
        <div style={{ maxWidth: '900px', margin: '0 auto 3rem', padding: '0 1.5rem' }}>
          <div
            style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(80,120,60,0.4), transparent)',
            }}
          />
        </div>

        {/* Tool cards grid */}
        <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
              gap: '1.25rem',
            }}
          >
            {TOOLS.map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} index={i} />
            ))}
          </div>
        </section>

        {/* ── Bean Catcher: The Arcade ── */}
        <section
          id="play"
          style={{ scrollMarginTop: '5.5rem', maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem 2rem' }}
        >
          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(80,120,60,0.4), transparent)', marginBottom: '3rem' }} />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', marginBottom: '2rem' }}
          >
            <p style={{ fontFamily: '"Space Mono", monospace', fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.75rem' }}>
              ✦ The Arcade ✦
            </p>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--color-text)', lineHeight: 1.1, marginBottom: '0.75rem' }}>
              Bean{' '}
              <span style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>Catcher</span>
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', maxWidth: '400px', margin: '0 auto', lineHeight: 1.6 }}>
              A quick coffee break — catch the good beans, dodge the burnt ones.
            </p>
          </motion.div>
          <BeanCatcherGame />
        </section>

        {/* Bloom Timer */}
        <BloomTimer />

        {/* More coming soon + CTA */}
        <section style={{ maxWidth: '700px', margin: '0 auto', padding: '0 1.5rem 6rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid rgba(201,168,76,0.18)',
              borderRadius: '1.5rem',
              padding: '2.5rem 2rem',
              textAlign: 'center',
            }}
          >
            {/* Ornament */}
            <div
              style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '50%',
                background: 'rgba(201,168,76,0.1)',
                border: '1px solid rgba(201,168,76,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                margin: '0 auto 1.25rem',
              }}
            >
              ☕
            </div>

            <p
              style={{
                fontFamily: '"Space Mono", monospace',
                fontSize: '0.68rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-accent)',
                marginBottom: '0.75rem',
              }}
            >
              More Coming Soon
            </p>

            <h2
              style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: '1.8rem',
                color: 'var(--color-text)',
                lineHeight: 1.2,
                marginBottom: '0.75rem',
              }}
            >
              Stay in the loop
            </h2>

            <p
              style={{
                color: 'var(--color-text-muted)',
                fontSize: '0.95rem',
                lineHeight: 1.7,
                maxWidth: '400px',
                margin: '0 auto 1.75rem',
              }}
            >
              New tools drop regularly. Be the first to know when we launch the next one — from AI roast profiling to origin deep dives.
            </p>

            {ctaSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  color: '#4ade80',
                  fontSize: '0.95rem',
                }}
              >
                <span>✓</span>
                <span>You're on the list!</span>
              </motion.div>
            ) : (
              <form
                onSubmit={handleCta}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  maxWidth: '440px',
                  margin: '0 auto',
                  flexWrap: 'wrap',
                }}
              >
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: '200px',
                    background: 'var(--color-card)',
                    border: '1px solid rgba(80,120,60,0.3)',
                    borderRadius: '0.75rem',
                    color: 'var(--color-text)',
                    padding: '0.7rem 1rem',
                    fontSize: '0.9rem',
                    outline: 'none',
                    fontFamily: 'Inter, sans-serif',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: 'var(--color-accent)',
                    border: 'none',
                    borderRadius: '0.75rem',
                    color: 'var(--color-bg)',
                    padding: '0.7rem 1.5rem',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    fontFamily: '"Space Mono", monospace',
                    letterSpacing: '0.05em',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    transition: 'opacity 0.15s',
                  }}
                >
                  Notify Me
                </button>
              </form>
            )}

            <p
              style={{
                color: 'var(--color-text-faint)',
                fontSize: '0.72rem',
                marginTop: '1rem',
                fontFamily: '"Space Mono", monospace',
              }}
            >
              No spam. Unsubscribe any time.
            </p>
          </motion.div>
        </section>
      </div>
    </div>
  )
}
