import { AnimatePresence, motion } from 'framer-motion'
import { useNowPlaying } from '../../contexts/NowPlayingContext'

const MOOD_COLORS = {
  Focus:   '#7A9E6A',
  Chill:   '#6B8FAB',
  Jazz:    '#C9A84C',
  Ambient: '#A08040',
  Indie:   '#9E7A6A',
}

function YouTubeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="4" fill="#FF0000" />
      <path d="M10 8.5L16 12L10 15.5V8.5Z" fill="white" />
    </svg>
  )
}

export function MiniPlayer() {
  const { nowPlaying, clearNowPlaying } = useNowPlaying()

  return (
    <AnimatePresence>
      {nowPlaying && (
        <motion.div
          initial={{ y: 96, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 96, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 36 }}
          className="fixed bottom-0 left-0 right-0 z-50 flex items-center gap-3 sm:gap-4 px-3 sm:px-6"
          style={{
            height: 76,
            background: 'linear-gradient(135deg, #1A2D12 0%, #0D1810 100%)',
            borderTop: '1px solid rgba(201,168,76,0.22)',
            boxShadow: '0 -6px 40px rgba(0,0,0,0.55)',
          }}
        >
          {/* Mood colour strip on left edge */}
          <div
            className="absolute left-0 top-0 bottom-0 w-0.5"
            style={{ background: MOOD_COLORS[nowPlaying.mood] || '#C9A84C' }}
          />

          {/* Small iframe player */}
          <div
            className="flex-shrink-0 overflow-hidden rounded-lg"
            style={{
              width: 118,
              height: 66,
              border: '1px solid rgba(201,168,76,0.18)',
            }}
          >
            <iframe
              key={nowPlaying.id}
              src={`https://www.youtube.com/embed/${nowPlaying.id}?autoplay=1&rel=0&modestbranding=1`}
              title={nowPlaying.title}
              allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
              style={{ border: 'none' }}
            />
          </div>

          {/* Animated bars + title + channel */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            {/* Animated equalizer bars */}
            <div className="hidden sm:flex items-end gap-px flex-shrink-0" style={{ height: 16 }}>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-0.5 rounded-full"
                  style={{ background: MOOD_COLORS[nowPlaying.mood] || '#C9A84C' }}
                  animate={{ height: ['6px', '14px', '6px'] }}
                  transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
                />
              ))}
            </div>

            <div className="min-w-0">
              <p
                className="text-xs font-medium leading-tight truncate"
                style={{ color: 'var(--color-text)', fontFamily: 'Inter, sans-serif' }}
              >
                {nowPlaying.title}
              </p>
              <p
                className="text-[10px] truncate mt-0.5 uppercase tracking-[0.12em]"
                style={{ color: 'var(--color-text-faint)', fontFamily: 'Space Mono, monospace' }}
              >
                {nowPlaying.channel}
              </p>
            </div>
          </div>

          {/* "Now Playing" label — desktop only */}
          <span
            className="hidden lg:block flex-shrink-0 text-[9px] uppercase tracking-[0.22em]"
            style={{ color: 'rgba(201,168,76,0.38)', fontFamily: 'Space Mono, monospace' }}
          >
            Now Playing
          </span>

          {/* Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={`https://www.youtube.com/watch?v=${nowPlaying.id}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Open on YouTube"
              className="transition-transform duration-150 hover:scale-110"
            >
              <YouTubeIcon />
            </a>
            <button
              onClick={clearNowPlaying}
              title="Close player"
              className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-150"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(201,168,76,0.15)',
                color: 'var(--color-text-faint)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(201,168,76,0.15)'
                e.currentTarget.style.color = '#C9A84C'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                e.currentTarget.style.color = 'var(--color-text-faint)'
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
