import { motion, AnimatePresence } from 'framer-motion'
import { useId } from 'react'

// ── Steam wisp ────────────────────────────────────────────────────────────────
function SteamWisp({ x, delay }) {
  return (
    <motion.path
      d={`M${x} 26 Q${x + 2.5} 20 ${x} 14 Q${x - 2.5} 8 ${x} 2`}
      stroke="#C9A84C"
      strokeWidth="1.6"
      strokeLinecap="round"
      fill="none"
      initial={{ opacity: 0, y: 0 }}
      animate={{
        opacity: [0, 0.75, 0.75, 0],
        y:       [0, -6,  -12, -18],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        delay,
        ease: 'easeOut',
      }}
    />
  )
}

// ── Core loader SVG ───────────────────────────────────────────────────────────
export function Loader({ size = 72, label = 'Brewing…' }) {
  const uid = useId().replace(/:/g, '')

  return (
    <div className="flex flex-col items-center gap-5 select-none">
      {/* Cup animation */}
      <svg
        width={size}
        height={Math.round(size * 1.22)}
        viewBox="0 0 64 78"
        fill="none"
        aria-hidden="true"
      >
        {/* ── Clip path: interior of cup ─────────────── */}
        <defs>
          <clipPath id={`cup-${uid}`}>
            <path d="M13 30 L18 68 Q18 71 32 71 Q46 71 46 68 L51 30 Z" />
          </clipPath>
        </defs>

        {/* ── Steam wisps ─────────────────────────────── */}
        <SteamWisp x={20} delay={0} />
        <SteamWisp x={32} delay={0.45} />
        <SteamWisp x={44} delay={0.9} />

        {/* ── Liquid fill (rises from bottom) ─────────── */}
        <motion.rect
          x="10"
          y={71}
          width="44"
          height={0}
          fill="rgba(201,168,76,0.22)"
          clipPath={`url(#cup-${uid})`}
          animate={{
            y:      [71, 30, 71],
            height: [0,  41, 0],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: [0.4, 0, 0.2, 1],
          }}
        />

        {/* ── Liquid surface shimmer ───────────────────── */}
        <motion.rect
          x="10"
          y={68}
          height={3}
          rx="1.5"
          fill="rgba(201,168,76,0.45)"
          clipPath={`url(#cup-${uid})`}
          animate={{
            y: [68, 28, 68],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: [0.4, 0, 0.2, 1],
          }}
        />

        {/* ── Cup body outline ─────────────────────────── */}
        <path
          d="M11 30 L16 68 Q16 73 32 73 Q48 73 48 68 L53 30 Z"
          stroke="#C9A84C"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* ── Rim ─────────────────────────────────────── */}
        <line
          x1="9"  y1="30"
          x2="55" y2="30"
          stroke="#C9A84C"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* ── Handle ──────────────────────────────────── */}
        <path
          d="M53 38 Q62 38 62 48 Q62 58 53 58"
          stroke="#C9A84C"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* ── Saucer ──────────────────────────────────── */}
        <ellipse
          cx="32" cy="76"
          rx="22" ry="3"
          stroke="#C9A84C"
          strokeWidth="1.2"
          opacity="0.35"
        />
      </svg>

      {/* Label */}
      {label && (
        <div className="flex flex-col items-center gap-2.5">
          <p
            style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '10px',
              letterSpacing: '0.26em',
              color: 'rgba(201,168,76,0.55)',
              textTransform: 'uppercase',
            }}
          >
            {label}
          </p>
          {/* Pulsing dots */}
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="block rounded-full"
                style={{ width: 4, height: 4, background: '#C9A84C' }}
                animate={{ opacity: [0.15, 1, 0.15] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.28 }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Full-page loader (initial app load / route suspension) ─────────────────────
export function PageLoader({ visible = true }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="page-loader"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-8"
          style={{ background: '#0D1810' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
        >
          {/* Wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            {/* Inline logo */}
            <svg width="22" height="26" viewBox="0 0 30 34" fill="none">
              <path d="M8 8 Q9.5 5 8 2"  stroke="#C9A84C" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
              <path d="M15 8 Q16.5 5 15 2" stroke="#C9A84C" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
              <rect x="2" y="10" width="20" height="18" rx="3" stroke="#C9A84C" strokeWidth="1.5" />
              <path d="M22 14 Q28 14 28 19 Q28 24 22 24" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <line x1="2" y1="28" x2="22" y2="28" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="9"  cy="18" r="1.6" fill="#C9A84C" />
              <circle cx="15" cy="18" r="1.6" fill="#C9A84C" />
              <path d="M7 22.5 Q9 24.5 12 22.5 Q15 24.5 17 22.5" stroke="#C9A84C" strokeWidth="1.3" strokeLinecap="round" fill="none" />
            </svg>
            <span
              className="font-display text-lg tracking-tight"
              style={{ color: '#C9A84C' }}
            >
              The Bean Chronicles
            </span>
          </motion.div>

          {/* Loader */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            <Loader size={80} label="Brewing…" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
