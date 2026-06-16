import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Constants ──────────────────────────────────────────────────────────────────
const CW = 800
const CH = 520
const CUP_W = 78
const CUP_H = 52
const BEAN_R = 13
const MAX_LIVES = 3
const CUP_SPEED = 7
const BASE_SPEED = 2.4
const BASE_INTERVAL = 920

// ── Bean types ─────────────────────────────────────────────────────────────────
const BEAN_TYPES = [
  { id: 'light',  color: '#D4A853', crease: '#9B6E28', points: 10,  bad: false, label: 'Light Roast'  },
  { id: 'medium', color: '#8B5E3C', crease: '#4A2810', points: 15,  bad: false, label: 'Medium Roast' },
  { id: 'dark',   color: '#3D2010', crease: '#1A0A04', points: 25,  bad: false, label: 'Dark Roast'   },
  { id: 'burnt',  color: '#110805', crease: '#060402', points: 0,   bad: true,  label: 'Burnt Bean'   },
]

function pickBean(level) {
  const burntChance = Math.min(0.08 + level * 0.025, 0.22)
  if (Math.random() < burntChance) return BEAN_TYPES[3]
  const r = Math.random()
  if (r < 0.42) return BEAN_TYPES[0]
  if (r < 0.74) return BEAN_TYPES[1]
  return BEAN_TYPES[2]
}

// ── Drawing ────────────────────────────────────────────────────────────────────
function drawBean(ctx, x, y, bt, r) {
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.5)'
  ctx.shadowBlur = 7
  ctx.shadowOffsetY = 3

  // Body
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fillStyle = bt.color
  ctx.fill()
  ctx.strokeStyle = bt.crease
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.shadowBlur = 0

  // Crease
  ctx.save()
  ctx.translate(x, y)
  ctx.beginPath()
  ctx.scale(0.24, 1)
  ctx.arc(0, 0, r - 1, 0, Math.PI * 2)
  ctx.restore()
  ctx.strokeStyle = bt.crease
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Highlight
  ctx.beginPath()
  ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.22, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255,255,255,0.1)'
  ctx.fill()

  // Burnt ✕
  if (bt.bad) {
    ctx.beginPath()
    ctx.moveTo(x - r * 0.4, y - r * 0.4)
    ctx.lineTo(x + r * 0.4, y + r * 0.4)
    ctx.moveTo(x + r * 0.4, y - r * 0.4)
    ctx.lineTo(x - r * 0.4, y + r * 0.4)
    ctx.strokeStyle = 'rgba(220,70,50,0.9)'
    ctx.lineWidth = 2.2
    ctx.stroke()
  }

  ctx.restore()
}

function drawCup(ctx, cx, y) {
  const tw = CUP_W
  const bw = CUP_W * 0.74
  const h  = CUP_H

  ctx.save()
  ctx.shadowColor = 'rgba(201,168,76,0.2)'
  ctx.shadowBlur = 14

  // Body
  ctx.beginPath()
  ctx.moveTo(cx - tw / 2, y)
  ctx.lineTo(cx - bw / 2, y + h)
  ctx.lineTo(cx + bw / 2, y + h)
  ctx.lineTo(cx + tw / 2, y)
  ctx.closePath()
  ctx.fillStyle = '#1C2B14'
  ctx.fill()
  ctx.strokeStyle = '#C9A84C'
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.shadowBlur = 0

  // Rim
  ctx.beginPath()
  ctx.moveTo(cx - tw / 2 - 4, y + 1.5)
  ctx.lineTo(cx + tw / 2 + 4, y + 1.5)
  ctx.strokeStyle = '#C9A84C'
  ctx.lineWidth = 3.5
  ctx.lineCap = 'round'
  ctx.stroke()

  // Handle
  ctx.beginPath()
  ctx.arc(cx + bw / 2 + 15, y + h / 2, 14, -Math.PI / 2, Math.PI / 2)
  ctx.strokeStyle = '#C9A84C'
  ctx.lineWidth = 2.5
  ctx.stroke()

  // Inner coffee glint
  ctx.beginPath()
  ctx.moveTo(cx - bw / 2 + 6, y + h - 6)
  ctx.lineTo(cx + bw / 2 - 6, y + h - 6)
  ctx.strokeStyle = 'rgba(201,168,76,0.28)'
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.restore()
}

function drawScene(ctx, g) {
  // Background
  const grad = ctx.createLinearGradient(0, 0, 0, CH)
  grad.addColorStop(0, '#0D1810')
  grad.addColorStop(1, '#162210')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, CW, CH)

  // Dot grid
  ctx.fillStyle = 'rgba(80,120,60,0.055)'
  for (let gx = 28; gx < CW; gx += 32) {
    for (let gy = 28; gy < CH; gy += 32) {
      ctx.beginPath()
      ctx.arc(gx, gy, 1, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // Ground rule
  ctx.beginPath()
  ctx.moveTo(0, CH - 26)
  ctx.lineTo(CW, CH - 26)
  ctx.strokeStyle = 'rgba(201,168,76,0.1)'
  ctx.lineWidth = 1
  ctx.stroke()

  // Beans
  for (const b of g.beans) {
    drawBean(ctx, b.x, b.y, b.bt, BEAN_R)
  }

  // Cup
  drawCup(ctx, g.cupX, CH - CUP_H - 26)

  // Particles
  for (const p of g.particles) {
    ctx.save()
    ctx.globalAlpha = Math.max(0, p.life / 500)
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fillStyle = p.color
    ctx.fill()
    ctx.restore()
  }

  // Popup labels
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  for (const p of g.popups) {
    ctx.save()
    ctx.globalAlpha = Math.min(1, p.life / 280)
    ctx.font = `bold 17px "Space Mono", monospace`
    ctx.fillStyle = p.color
    ctx.fillText(p.text, p.x, p.y)
    ctx.restore()
  }

  // Red flash
  if (g.flashTimer > 0) {
    ctx.save()
    ctx.globalAlpha = (g.flashTimer / 280) * 0.28
    ctx.fillStyle = '#C0392B'
    ctx.fillRect(0, 0, CW, CH)
    ctx.restore()
  }
}

// ── Component ──────────────────────────────────────────────────────────────────
export function BeanCatcherGame() {
  const canvasRef = useRef(null)

  // All mutable game state lives here — no re-renders per frame
  const gs = useRef({
    cupX: CW / 2,
    beans: [],
    particles: [],
    popups: [],
    lives: MAX_LIVES,
    score: 0,
    level: 1,
    speed: BASE_SPEED,
    spawnInterval: BASE_INTERVAL,
    nextSpawn: 0,
    keys: { left: false, right: false },
    mouse: null,
    running: false,
    rafId: null,
    lastTime: 0,
    flashTimer: 0,
  })

  const [phase, setPhase] = useState('idle') // idle | playing | dead
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(MAX_LIVES)
  const [level, setLevel] = useState(1)
  const [hiScore, setHiScore] = useState(() => parseInt(localStorage.getItem('bc-hi') || '0'))

  // Stable loop ref avoids stale closures
  const loopRef = useRef(null)

  function addParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
      const spd = 2 + Math.random() * 3.5
      gs.current.particles.push({
        x, y, color,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd - 2.5,
        life: 380 + Math.random() * 220,
        r: 2.5 + Math.random() * 3,
      })
    }
  }

  function addPopup(x, y, text, color) {
    gs.current.popups.push({ x, y: y - 10, text, color, life: 700 })
  }

  function levelUp(g) {
    const newLevel = Math.floor(g.score / 100) + 1
    if (newLevel > g.level) {
      g.level = newLevel
      g.speed = Math.min(BASE_SPEED + (newLevel - 1) * 0.38, 6.8)
      g.spawnInterval = Math.max(BASE_INTERVAL - (newLevel - 1) * 65, 300)
      setLevel(newLevel)
    }
  }

  function spawnBean(now) {
    const g = gs.current
    const margin = BEAN_R + 22
    g.beans.push({
      x: margin + Math.random() * (CW - margin * 2),
      y: -BEAN_R - 4,
      bt: pickBean(g.level),
      speed: g.speed + (Math.random() - 0.5) * 0.9,
      drift: (Math.random() - 0.5) * 0.55,
    })
    g.nextSpawn = now + g.spawnInterval - Math.random() * 180
  }

  useEffect(() => {
    loopRef.current = function loop(ts) {
      const g = gs.current
      if (!g.running) return

      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')

      const dt = Math.min(ts - g.lastTime, 50)
      g.lastTime = ts

      // Cup movement
      if (g.mouse !== null) {
        g.cupX += (g.mouse - g.cupX) * 0.18
      } else {
        if (g.keys.left)  g.cupX -= CUP_SPEED
        if (g.keys.right) g.cupX += CUP_SPEED
      }
      g.cupX = Math.max(CUP_W / 2 + 8, Math.min(CW - CUP_W / 2 - 8, g.cupX))

      // Spawn
      if (ts >= g.nextSpawn) spawnBean(ts)

      // Update beans
      const cupTop = CH - CUP_H - 26
      const survived = []
      for (const b of g.beans) {
        b.y += b.speed * (dt / 16)
        b.x += b.drift

        // Catch zone
        if (b.y + BEAN_R >= cupTop && b.y - BEAN_R < cupTop + 14) {
          const inCup = b.x > g.cupX - CUP_W / 2 + 6 && b.x < g.cupX + CUP_W / 2 - 6
          if (inCup) {
            if (b.bt.bad) {
              g.lives = Math.max(0, g.lives - 1)
              g.flashTimer = 280
              addPopup(b.x, cupTop, '☠ −1', '#E74C3C')
              addParticles(b.x, cupTop, '#C0392B', 7)
            } else {
              g.score += b.bt.points
              addPopup(b.x, cupTop, `+${b.bt.points}`, b.bt.color)
              addParticles(b.x, cupTop, b.bt.color, 9)
              levelUp(g)
            }
            setScore(g.score)
            setLives(g.lives)
            continue
          }
        }

        // Off bottom
        if (b.y - BEAN_R > CH) {
          if (!b.bt.bad) {
            g.lives = Math.max(0, g.lives - 1)
            g.flashTimer = 280
            addPopup(CW / 2, CH - 40, '− ♥', '#E74C3C')
            setLives(g.lives)
          }
          continue
        }

        survived.push(b)
      }
      g.beans = survived

      // Particles
      for (const p of g.particles) {
        p.x += p.vx * dt / 16
        p.y += p.vy * dt / 16
        p.vy += 0.18
        p.life -= dt
      }
      g.particles = g.particles.filter(p => p.life > 0)

      // Popups
      for (const p of g.popups) {
        p.y -= 1.1 * dt / 16
        p.life -= dt
      }
      g.popups = g.popups.filter(p => p.life > 0)

      // Flash
      if (g.flashTimer > 0) g.flashTimer -= dt

      drawScene(ctx, g)

      // Game over
      if (g.lives <= 0) {
        g.running = false
        const stored = parseInt(localStorage.getItem('bc-hi') || '0')
        const newHi = Math.max(g.score, stored)
        localStorage.setItem('bc-hi', String(newHi))
        setHiScore(newHi)
        setPhase('dead')
        return
      }

      g.rafId = requestAnimationFrame(loopRef.current)
    }
  })

  function startGame() {
    const g = gs.current
    if (g.rafId) cancelAnimationFrame(g.rafId)

    g.cupX = CW / 2
    g.beans = []
    g.particles = []
    g.popups = []
    g.lives = MAX_LIVES
    g.score = 0
    g.level = 1
    g.speed = BASE_SPEED
    g.spawnInterval = BASE_INTERVAL
    g.nextSpawn = 0
    g.keys = { left: false, right: false }
    g.mouse = null
    g.running = true
    g.flashTimer = 0
    g.lastTime = performance.now()

    setScore(0)
    setLives(MAX_LIVES)
    setLevel(1)
    setPhase('playing')

    g.rafId = requestAnimationFrame(loopRef.current)
  }

  // Draw idle background once on mount
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    drawScene(ctx, gs.current)
  }, [])

  // Keyboard
  useEffect(() => {
    const down = (e) => {
      if (['ArrowLeft', 'ArrowRight', 'a', 'd'].includes(e.key)) e.preventDefault()
      if (e.key === 'ArrowLeft'  || e.key === 'a') gs.current.keys.left  = true
      if (e.key === 'ArrowRight' || e.key === 'd') gs.current.keys.right = true
    }
    const up = (e) => {
      if (e.key === 'ArrowLeft'  || e.key === 'a') gs.current.keys.left  = false
      if (e.key === 'ArrowRight' || e.key === 'd') gs.current.keys.right = false
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      if (gs.current.rafId) cancelAnimationFrame(gs.current.rafId)
    }
  }, [])

  // Non-passive touch listener so preventDefault() actually suppresses scroll
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const handler = (e) => {
      e.preventDefault()
      const rect = canvas.getBoundingClientRect()
      gs.current.mouse = ((e.touches[0].clientX - rect.left) / rect.width) * CW
    }
    canvas.addEventListener('touchmove', handler, { passive: false })
    return () => canvas.removeEventListener('touchmove', handler)
  }, [])

  function onMouseMove(e) {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    gs.current.mouse = ((e.clientX - rect.left) / rect.width) * CW
  }

  function onMouseLeave() { gs.current.mouse = null }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-8 pb-8">
        {/* HUD */}
        <div className="flex items-center justify-between mb-3 px-1">
          {/* Lives */}
          <div className="flex items-center gap-1">
            {Array.from({ length: MAX_LIVES }).map((_, i) => (
              <motion.span
                key={i}
                animate={{ scale: i < lives ? 1 : 0.7, opacity: i < lives ? 1 : 0.18 }}
                transition={{ type: 'spring', stiffness: 300 }}
                style={{ fontSize: 20, color: '#C9A84C', display: 'inline-block' }}
              >
                ♥
              </motion.span>
            ))}
          </div>

          {/* Score */}
          <div className="text-center">
            <span className="font-display text-3xl" style={{ color: '#C9A84C' }}>
              {score}
            </span>
            <span
              className="text-[9px] uppercase tracking-[0.2em] ml-2"
              style={{ color: 'rgba(201,168,76,0.38)', fontFamily: 'Space Mono, monospace' }}
            >
              pts
            </span>
          </div>

          {/* Level */}
          <div>
            <span
              className="text-[10px] uppercase tracking-[0.2em]"
              style={{ color: 'rgba(201,168,76,0.5)', fontFamily: 'Space Mono, monospace' }}
            >
              Lvl {level}
            </span>
          </div>
        </div>

        {/* Canvas */}
        <div
          className="relative w-full rounded-2xl overflow-hidden"
          style={{
            aspectRatio: `${CW} / ${CH}`,
            border: '1px solid rgba(80,120,60,0.25)',
          }}
        >
          <canvas
            ref={canvasRef}
            width={CW}
            height={CH}
            className="w-full h-full block"
            style={{ touchAction: 'none' }}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
          />

          {/* Start overlay */}
          <AnimatePresence>
            {phase === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-center px-8"
                style={{ background: 'rgba(13,24,16,0.9)', backdropFilter: 'blur(4px)' }}
              >
                <div className="text-5xl select-none">☕</div>
                <div>
                  <h2 className="font-display text-3xl text-cream mb-4">Ready to brew?</h2>
                  <div className="flex flex-col gap-2 text-sm mb-2" style={{ color: 'rgba(232,223,208,0.52)' }}>
                    <p>
                      <span style={{ color: '#D4A853' }}>●</span>{' '}
                      <span style={{ color: '#8B5E3C' }}>●</span>{' '}
                      <span style={{ color: '#3D2010' }}>●</span>{' '}
                      Good beans — catch for points
                    </p>
                    <p>
                      <span style={{ color: '#E74C3C' }}>●</span> Burnt beans — dodge! Costs a life if caught
                    </p>
                    <p style={{ color: 'rgba(232,223,208,0.35)', fontSize: 12 }}>
                      Missing a good bean also costs a life
                    </p>
                  </div>
                </div>
                {hiScore > 0 && (
                  <p
                    className="text-[10px] uppercase tracking-[0.2em] -mt-2"
                    style={{ color: 'rgba(201,168,76,0.45)', fontFamily: 'Space Mono, monospace' }}
                  >
                    Best: {hiScore}
                  </p>
                )}
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={startGame}
                  className="px-10 py-4 rounded-full text-sm font-medium uppercase tracking-[0.2em]"
                  style={{
                    background: '#C9A84C',
                    color: '#0D1810',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Start Brewing
                </motion.button>
                <p
                  className="text-[10px] uppercase tracking-[0.18em] -mt-3"
                  style={{ color: 'rgba(232,223,208,0.22)', fontFamily: 'Space Mono, monospace' }}
                >
                  ← → keys · mouse · or drag/tap to move
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Game over overlay */}
          <AnimatePresence>
            {phase === 'dead' && (
              <motion.div
                key="dead"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-5 text-center px-8"
                style={{ background: 'rgba(13,24,16,0.93)', backdropFilter: 'blur(6px)' }}
              >
                <div className="text-5xl select-none">☕</div>
                <div>
                  <p
                    className="text-[10px] uppercase tracking-[0.26em] mb-3"
                    style={{ color: 'rgba(201,168,76,0.45)', fontFamily: 'Space Mono, monospace' }}
                  >
                    Beans gone cold
                  </p>
                  <h2 className="font-display text-4xl text-cream mb-2">Game Over</h2>
                  <p className="font-display text-3xl italic mb-2" style={{ color: '#C9A84C' }}>
                    {score} pts
                  </p>
                  {score > 0 && score >= hiScore ? (
                    <motion.p
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-[10px] uppercase tracking-[0.22em]"
                      style={{ color: '#C9A84C', fontFamily: 'Space Mono, monospace' }}
                    >
                      ✦ New High Score ✦
                    </motion.p>
                  ) : (
                    <p
                      className="text-[10px]"
                      style={{ color: 'rgba(201,168,76,0.38)', fontFamily: 'Space Mono, monospace' }}
                    >
                      Best: {hiScore}
                    </p>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={startGame}
                  className="px-10 py-4 rounded-full text-sm font-medium uppercase tracking-[0.2em]"
                  style={{
                    background: '#C9A84C',
                    color: '#0D1810',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Brew Again
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile directional buttons */}
        <div className="flex gap-3 mt-3 sm:hidden">
          {[
            { label: '←', dir: 'left' },
            { label: '→', dir: 'right' },
          ].map(({ label, dir }) => (
            <button
              key={dir}
              onPointerDown={() => { gs.current.keys[dir] = true }}
              onPointerUp={() => { gs.current.keys[dir] = false }}
              onPointerLeave={() => { gs.current.keys[dir] = false }}
              className="flex-1 h-14 rounded-xl flex items-center justify-center select-none text-2xl"
              style={{
                background: 'rgba(201,168,76,0.08)',
                border: '1px solid rgba(201,168,76,0.22)',
                color: '#C9A84C',
                cursor: 'pointer',
                touchAction: 'none',
                WebkitUserSelect: 'none',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-5 mt-5 flex-wrap">
          {BEAN_TYPES.map((bt) => (
            <div key={bt.id} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ background: bt.color, border: `1.5px solid ${bt.crease}` }}
              />
              <span
                className="text-[10px] uppercase tracking-[0.13em]"
                style={{ color: 'rgba(232,223,208,0.38)', fontFamily: 'Space Mono, monospace' }}
              >
                {bt.bad ? `${bt.label} — dodge` : `${bt.label} +${bt.points}`}
              </span>
            </div>
          ))}
        </div>
      </div>
  )
}

export default function BeanCatcher() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <section
        className="py-12 px-6 text-center"
        style={{ background: 'linear-gradient(180deg, #2D1B14 0%, transparent 100%)' }}
      >
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span
            className="text-[10px] uppercase tracking-[0.24em]"
            style={{ color: '#C9A84C', fontFamily: 'Space Mono, monospace' }}
          >
            The Arcade
          </span>
          <h1 className="font-display text-4xl sm:text-5xl text-cream mt-2 mb-3">
            Bean Catcher
          </h1>
          <p className="text-cream/50 text-sm max-w-xs mx-auto">
            Catch the good beans. Dodge the burnt ones.
          </p>
        </motion.div>
      </section>
      <BeanCatcherGame />
    </div>
  )
}
