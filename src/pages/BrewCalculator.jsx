import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BackButton } from '../components/ui/BackButton'
import { SEO } from '../components/ui/SEO'

// ── Data ─────────────────────────────────────────────────────────────────────

const METHODS = ['Espresso', 'Pour Over', 'French Press', 'AeroPress', 'Cold Brew', 'Moka Pot']

const RATIOS = {
  'Espresso':     1 / 2.5,
  'Pour Over':    1 / 16,
  'French Press': 1 / 15,
  'AeroPress':    1 / 12,
  'Cold Brew':    1 / 8,
  'Moka Pot':     1 / 8,
}

const IDEAL_TEMP = {
  'Espresso':     92,
  'Pour Over':    94,
  'French Press': 95,
  'AeroPress':    85,
  'Cold Brew':    null,
  'Moka Pot':     null,
}

const IDEAL_GRIND = {
  'Espresso':     'Extra Fine',
  'Pour Over':    'Medium',
  'French Press': 'Coarse',
  'AeroPress':    'Fine',
  'Cold Brew':    'Extra Coarse',
  'Moka Pot':     'Fine',
}

const METHOD_INFO = {
  'Espresso':     { time: '25–30 seconds', tips: ['Pre-heat portafilter', 'Tamp at 30 lbs pressure', 'First drip in 8–10 seconds'] },
  'Pour Over':    { time: '3–4 minutes',   tips: ['Bloom 45s with 2× coffee weight water', 'Pour in concentric circles', 'Aim for flat coffee bed at end'] },
  'French Press': { time: '4 minutes',     tips: ['Steep exactly 4 minutes', 'Break crust at 4 mins before pressing', 'Press slowly over 20 seconds'] },
  'AeroPress':    { time: '1–2 minutes',   tips: ['Inverted method for fuller flavour', 'Stir 10 seconds before pressing', 'Press gently in 30 seconds'] },
  'Cold Brew':    { time: '12–24 hours',   tips: ['Steep in fridge for 16h for best results', 'Use coarser grind to reduce bitterness', 'Dilute 1:1 with water when serving'] },
  'Moka Pot':     { time: '5–6 minutes',   tips: ['Use pre-boiled water in the bottom chamber', 'Medium heat only — never high', 'Remove from heat when sputtering starts'] },
}

const GRIND_SIZES = ['Extra Fine', 'Fine', 'Medium', 'Coarse', 'Extra Coarse']

// ── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <p
      className="text-[10px] uppercase tracking-[0.22em] mb-3"
      style={{ color: 'rgba(201,168,76,0.6)', fontFamily: 'Space Mono, monospace' }}
    >
      {children}
    </p>
  )
}

function PillButton({ label, selected, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="rounded-full px-4 py-2 text-sm transition-all duration-200"
      style={{
        background: selected ? 'rgba(201,168,76,0.12)' : 'rgba(22,34,16,0.8)',
        border: `1px solid ${selected ? 'rgba(201,168,76,0.55)' : 'rgba(80,120,60,0.28)'}`,
        color: selected ? 'var(--color-accent)' : 'var(--color-text-muted)',
        fontFamily: 'Inter, sans-serif',
        fontWeight: selected ? 600 : 400,
        cursor: 'pointer',
      }}
    >
      {label}
    </motion.button>
  )
}

function RatioBar({ coffeeG, waterG }) {
  const total = coffeeG + waterG
  const coffeeW = (coffeeG / total) * 100
  const waterW  = (waterG  / total) * 100
  return (
    <div>
      <SectionLabel>Ratio Visualisation</SectionLabel>
      <div className="flex rounded-full overflow-hidden" style={{ height: 10, background: 'rgba(80,120,60,0.15)' }}>
        <motion.div
          layout
          className="rounded-l-full"
          style={{ width: `${coffeeW}%`, background: 'var(--color-accent)', transition: 'width 0.4s ease' }}
        />
        <motion.div
          layout
          className="rounded-r-full"
          style={{ width: `${waterW}%`, background: '#2D4A1E', transition: 'width 0.4s ease' }}
        />
      </div>
      <div className="flex items-center gap-5 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-accent)' }} />
          <span className="text-[11px]" style={{ color: 'var(--color-text-muted)', fontFamily: 'Space Mono, monospace' }}>
            Coffee {coffeeW.toFixed(0)}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: '#2D4A1E' }} />
          <span className="text-[11px]" style={{ color: 'var(--color-text-muted)', fontFamily: 'Space Mono, monospace' }}>
            Water {waterW.toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  )
}

function AnimatedNumber({ value, suffix = '' }) {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={value}
        initial={{ opacity: 0, scale: 0.8, y: -6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 1.1, y: 6 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: 'inline-block' }}
      >
        {value}{suffix}
      </motion.span>
    </AnimatePresence>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function BrewCalculator() {
  const [activeMethod, setActiveMethod] = useState('Pour Over')
  const [coffeeG, setCoffeeG]           = useState(20)
  const [tempC, setTempC]               = useState(IDEAL_TEMP['Pour Over'] ?? 93)
  const [grind, setGrind]               = useState(IDEAL_GRIND['Pour Over'])
  const [copied, setCopied]             = useState(false)

  const ratio = RATIOS[activeMethod]
  const waterG = Math.round(coffeeG / ratio)
  const info   = METHOD_INFO[activeMethod]
  const isRoomTemp = IDEAL_TEMP[activeMethod] === null

  const handleMethodChange = (m) => {
    setActiveMethod(m)
    if (IDEAL_TEMP[m] !== null) setTempC(IDEAL_TEMP[m])
    setGrind(IDEAL_GRIND[m])
  }

  const copyRatio = async () => {
    const tempStr = isRoomTemp ? 'room temp' : `${tempC}°C`
    const text = `${activeMethod} — Coffee: ${coffeeG}g | Water: ${waterG}g | Ratio: 1:${Math.round(1 / ratio)} | Grind: ${grind} | Temp: ${tempStr}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <SEO title="Brew Calculator" description="Calculate your perfect coffee-to-water ratio for any brewing method — pour over, espresso, French press, and more." />
      <BackButton to="/tools" label="Tools" />
      <style>{`
        input[type=range] { accent-color: #C9A84C; width: 100%; cursor: pointer; }
        input[type=range]::-webkit-slider-thumb { background: #C9A84C; }
      `}</style>

      {/* ── Page hero ──────────────────────────────────────────────── */}
      <section className="pt-24 pb-16 px-6 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #C9A84C 1px, transparent 0)`,
            backgroundSize: '28px 28px',
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <p
            className="text-[10px] uppercase tracking-[0.28em] mb-3"
            style={{ color: 'rgba(201,168,76,0.7)', fontFamily: 'Space Mono, monospace' }}
          >
            The Brewmaster's Workshop
          </p>
          <div className="label-ornate justify-center mb-5">
            Precision Dialling
          </div>
          <h1 className="font-display text-5xl sm:text-6xl leading-none mb-5" style={{ color: 'var(--color-text)' }}>
            Brew<br />Calculator
          </h1>
          <p className="text-sm leading-relaxed max-w-xl mx-auto" style={{ color: 'var(--color-text-muted)' }}>
            Dial in the perfect cup. Adjust your dose, ratio, and temperature for any brew method.
          </p>
        </motion.div>
      </section>

      {/* ── Two-panel layout ───────────────────────────────────────── */}
      <section className="w-full max-w-6xl mx-auto px-6 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ── LEFT PANEL: Inputs ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-8 rounded-2xl p-8"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
            }}
          >
            {/* Brew Method */}
            <div>
              <SectionLabel>01 — Brew Method</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {METHODS.map((m) => (
                  <PillButton
                    key={m}
                    label={m}
                    selected={activeMethod === m}
                    onClick={() => handleMethodChange(m)}
                  />
                ))}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(80,120,60,0.18)' }} />

            {/* Coffee Amount slider */}
            <div>
              <div className="flex items-baseline justify-between mb-4">
                <SectionLabel>02 — Coffee Dose</SectionLabel>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-4xl" style={{ color: 'var(--color-accent)' }}>{coffeeG}</span>
                  <span className="text-sm" style={{ color: 'rgba(201,168,76,0.6)', fontFamily: 'Space Mono, monospace' }}>g</span>
                </div>
              </div>
              <input
                type="range"
                min={8}
                max={60}
                step={1}
                value={coffeeG}
                onChange={(e) => setCoffeeG(Number(e.target.value))}
                className="w-full"
                style={{ height: 4 }}
              />
              <div className="flex justify-between mt-1">
                <span className="text-[10px]" style={{ color: 'var(--color-text-faint)', fontFamily: 'Space Mono, monospace' }}>8 g</span>
                <span className="text-[10px]" style={{ color: 'var(--color-text-faint)', fontFamily: 'Space Mono, monospace' }}>60 g</span>
              </div>
            </div>

            <div style={{ height: 1, background: 'rgba(80,120,60,0.18)' }} />

            {/* Temperature slider */}
            <div>
              <div className="flex items-baseline justify-between mb-4">
                <SectionLabel>03 — Water Temperature</SectionLabel>
                {isRoomTemp ? (
                  <span
                    className="text-xs rounded-full px-3 py-1"
                    style={{
                      background: 'rgba(80,120,60,0.15)',
                      color: 'var(--color-text-faint)',
                      fontFamily: 'Space Mono, monospace',
                      border: '1px solid rgba(80,120,60,0.25)',
                    }}
                  >
                    Room temp / N/A
                  </span>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-4xl" style={{ color: 'var(--color-accent)' }}>{tempC}</span>
                    <span className="text-sm" style={{ color: 'rgba(201,168,76,0.6)', fontFamily: 'Space Mono, monospace' }}>°C</span>
                  </div>
                )}
              </div>
              <input
                type="range"
                min={85}
                max={100}
                step={1}
                value={isRoomTemp ? 93 : tempC}
                onChange={(e) => setTempC(Number(e.target.value))}
                disabled={isRoomTemp}
                className="w-full"
                style={{ height: 4, opacity: isRoomTemp ? 0.3 : 1 }}
              />
              <div className="flex justify-between mt-1">
                <span className="text-[10px]" style={{ color: 'var(--color-text-faint)', fontFamily: 'Space Mono, monospace' }}>85 °C</span>
                <span className="text-[10px]" style={{ color: 'var(--color-text-faint)', fontFamily: 'Space Mono, monospace' }}>100 °C</span>
              </div>
            </div>

            <div style={{ height: 1, background: 'rgba(80,120,60,0.18)' }} />

            {/* Grind Size */}
            <div>
              <SectionLabel>04 — Grind Size</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {GRIND_SIZES.map((g) => (
                  <PillButton
                    key={g}
                    label={g}
                    selected={grind === g}
                    onClick={() => setGrind(g)}
                  />
                ))}
              </div>
              {grind !== IDEAL_GRIND[activeMethod] && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-xs"
                  style={{ color: 'rgba(201,168,76,0.55)', fontFamily: 'Inter, sans-serif' }}
                >
                  Recommended for {activeMethod}: <strong style={{ color: 'var(--color-accent)' }}>{IDEAL_GRIND[activeMethod]}</strong>
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* ── RIGHT PANEL: Output card ───────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="flex flex-col gap-6"
          >
            {/* Water amount hero */}
            <div
              className="rounded-2xl p-8 text-center relative overflow-hidden"
              style={{
                background: 'var(--color-card)',
                border: '1px solid rgba(201,168,76,0.22)',
              }}
            >
              {/* Decorative arcs */}
              <svg
                className="absolute top-0 right-0 opacity-[0.06] pointer-events-none"
                width="160" height="160" viewBox="0 0 160 160" fill="none"
                aria-hidden="true"
              >
                <circle cx="160" cy="0" r="100" stroke="#C9A84C" strokeWidth="1" />
                <circle cx="160" cy="0" r="70" stroke="#C9A84C" strokeWidth="0.8" />
                <circle cx="160" cy="0" r="40" stroke="#C9A84C" strokeWidth="0.6" />
              </svg>

              <p
                className="text-[10px] uppercase tracking-[0.22em] mb-2"
                style={{ color: 'rgba(201,168,76,0.5)', fontFamily: 'Space Mono, monospace' }}
              >
                Water Required
              </p>

              <div className="flex items-baseline justify-center gap-2 my-4">
                <span className="font-display text-7xl sm:text-8xl leading-none" style={{ color: 'var(--color-accent)' }}>
                  <AnimatedNumber value={waterG} />
                </span>
                <span className="font-display text-2xl" style={{ color: 'rgba(201,168,76,0.5)' }}>g</span>
              </div>

              <p className="text-sm" style={{ color: 'var(--color-text-faint)', fontFamily: 'Inter, sans-serif' }}>
                for <span style={{ color: 'var(--color-text)' }}>{coffeeG}g</span> of coffee at{' '}
                {isRoomTemp
                  ? <span style={{ color: 'var(--color-text)' }}>room temperature</span>
                  : <><span style={{ color: 'var(--color-text)' }}>{tempC}°C</span></>
                }
              </p>

              <div
                className="mt-6 rounded-xl px-5 py-3 inline-flex items-center gap-3"
                style={{ background: 'rgba(80,120,60,0.12)', border: '1px solid rgba(80,120,60,0.2)' }}
              >
                <span
                  className="text-[10px] uppercase tracking-wider"
                  style={{ color: 'var(--color-text-faint)', fontFamily: 'Space Mono, monospace' }}
                >
                  Ratio
                </span>
                <span className="font-display text-base" style={{ color: 'var(--color-accent)' }}>
                  1 : {Math.round(1 / ratio)}
                </span>
                <span
                  className="text-[10px] uppercase tracking-wider"
                  style={{ color: 'var(--color-text-faint)', fontFamily: 'Space Mono, monospace' }}
                >
                  · {grind} grind
                </span>
              </div>

              {/* Copy result button */}
              <div className="mt-5">
                <button
                  onClick={copyRatio}
                  className="flex items-center gap-2 mx-auto transition-all duration-200"
                  style={{
                    background: copied ? 'var(--color-accent-dim)' : 'transparent',
                    border: '1px solid var(--color-border-strong)',
                    borderColor: copied ? 'var(--color-accent-border)' : undefined,
                    borderRadius: '9999px',
                    color: copied ? 'var(--color-accent)' : 'var(--color-text-muted)',
                    padding: '0.4rem 1rem',
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.16em',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => { if (!copied) { e.currentTarget.style.borderColor = 'var(--color-accent-border)'; e.currentTarget.style.color = 'var(--color-accent)' } }}
                  onMouseLeave={(e) => { if (!copied) { e.currentTarget.style.borderColor = 'var(--color-border-strong)'; e.currentTarget.style.color = 'var(--color-text-muted)' } }}
                >
                  {copied ? (
                    <>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                      Copy Result
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Brew time + tips */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMethod}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="rounded-2xl p-7"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                }}
              >
                {/* Brew time */}
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="flex items-center justify-center rounded-full flex-shrink-0"
                    style={{
                      width: 44,
                      height: 44,
                      background: 'rgba(201,168,76,0.08)',
                      border: '1px solid rgba(201,168,76,0.2)',
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <p
                      className="text-[10px] uppercase tracking-[0.18em]"
                      style={{ color: 'rgba(201,168,76,0.5)', fontFamily: 'Space Mono, monospace' }}
                    >
                      Brew Time
                    </p>
                    <p className="font-display text-xl mt-0.5" style={{ color: 'var(--color-text)' }}>{info.time}</p>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: 'rgba(80,120,60,0.18)', marginBottom: '1.25rem' }} />

                {/* Tips */}
                <p
                  className="text-[10px] uppercase tracking-[0.18em] mb-4"
                  style={{ color: 'rgba(201,168,76,0.5)', fontFamily: 'Space Mono, monospace' }}
                >
                  Barista Tips
                </p>
                <ul className="flex flex-col gap-3">
                  {info.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        className="flex-shrink-0 mt-1 font-mono text-[10px]"
                        style={{ color: 'rgba(201,168,76,0.4)' }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        className="text-sm leading-relaxed"
                        style={{ color: 'var(--color-text-muted)', fontFamily: 'Inter, sans-serif' }}
                      >
                        {tip}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>

            {/* Ratio bar */}
            <div
              className="rounded-2xl p-7"
              style={{
                background: 'var(--color-card)',
                border: '1px solid rgba(80,120,60,0.18)',
              }}
            >
              <RatioBar coffeeG={coffeeG} waterG={waterG} />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
