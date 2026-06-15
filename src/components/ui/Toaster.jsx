import { AnimatePresence, motion } from 'framer-motion'
import { useToast } from '../../contexts/ToastContext'

const TYPE_CONFIG = {
  success: {
    border: '#4ade80',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  error: {
    border: '#f87171',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M15 9l-6 6M9 9l6 6" />
      </svg>
    ),
  },
  info: {
    border: '#C9A84C',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8h.01M12 12v4" />
      </svg>
    ),
  },
}

function Toast({ id, message, type, duration }) {
  const { remove } = useToast()
  const config = TYPE_CONFIG[type] ?? TYPE_CONFIG.success

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.92 }}
      animate={{ opacity: 1, x: 0, scale: 1, transition: { type: 'spring', stiffness: 340, damping: 28 } }}
      exit={{ opacity: 0, x: 60, scale: 0.88, transition: { duration: 0.2 } }}
      style={{
        background: 'rgba(22,34,16,0.97)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(80,120,60,0.3)',
        borderLeft: `4px solid ${config.border}`,
        borderRadius: '0.75rem',
        minWidth: '260px',
        maxWidth: '340px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Body */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 14px',
          paddingRight: '36px',
        }}
      >
        <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          {config.icon}
        </span>
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '12px',
            color: 'var(--color-text-on-dark)',
            lineHeight: '1.5',
            flex: 1,
          }}
        >
          {message}
        </span>
      </div>

      {/* Dismiss button */}
      <button
        onClick={() => remove(id)}
        aria-label="Dismiss notification"
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '20px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--color-muted-on-dark)',
          fontSize: '14px',
          lineHeight: 1,
          padding: 0,
          borderRadius: '4px',
        }}
      >
        ×
      </button>

      {/* Progress bar */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '2px',
          width: '100%',
          background: config.border,
          transformOrigin: 'left center',
          opacity: 0.7,
        }}
      />
    </motion.div>
  )
}

export function Toaster() {
  const { toasts, remove } = useToast()
  const visible = toasts.slice(-5)

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column-reverse',
        gap: '10px',
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence initial={false}>
        {visible.map((toast) => (
          <div key={toast.id} style={{ pointerEvents: 'auto' }}>
            <Toast {...toast} remove={remove} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
