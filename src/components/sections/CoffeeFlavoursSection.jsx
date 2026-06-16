import { motion } from 'framer-motion'
import { coffeeFlavours } from '../../data/coffeeOrigins'

const flavourIcons = {
  floral: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="4" fill="currentColor" />
      <ellipse cx="20" cy="10" rx="3.5" ry="6" fill="currentColor" opacity="0.8" />
      <ellipse cx="20" cy="30" rx="3.5" ry="6" fill="currentColor" opacity="0.8" />
      <ellipse cx="10" cy="20" rx="6" ry="3.5" fill="currentColor" opacity="0.8" />
      <ellipse cx="30" cy="20" rx="6" ry="3.5" fill="currentColor" opacity="0.8" />
      <ellipse cx="12.9" cy="12.9" rx="3.5" ry="6" fill="currentColor" opacity="0.6" transform="rotate(45 12.9 12.9)" />
      <ellipse cx="27.1" cy="27.1" rx="3.5" ry="6" fill="currentColor" opacity="0.6" transform="rotate(45 27.1 27.1)" />
      <ellipse cx="27.1" cy="12.9" rx="3.5" ry="6" fill="currentColor" opacity="0.6" transform="rotate(-45 27.1 12.9)" />
      <ellipse cx="12.9" cy="27.1" rx="3.5" ry="6" fill="currentColor" opacity="0.6" transform="rotate(-45 12.9 27.1)" />
    </svg>
  ),
  fruity: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15" cy="24" r="9" fill="currentColor" opacity="0.9" />
      <circle cx="25" cy="24" r="9" fill="currentColor" opacity="0.7" />
      <path d="M20 14 Q22 8 27 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  chocolatey: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="10" width="28" height="20" rx="3" fill="currentColor" opacity="0.9" />
      <line x1="6" y1="17" x2="34" y2="17" stroke="#1A0F0A" strokeWidth="1.5" />
      <line x1="6" y1="23" x2="34" y2="23" stroke="#1A0F0A" strokeWidth="1.5" />
      <line x1="16" y1="10" x2="16" y2="30" stroke="#1A0F0A" strokeWidth="1.5" />
      <line x1="24" y1="10" x2="24" y2="30" stroke="#1A0F0A" strokeWidth="1.5" />
    </svg>
  ),
  nutty: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20" cy="22" rx="11" ry="13" fill="currentColor" opacity="0.85" />
      <path d="M20 9 Q20 6 23 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 18 Q20 13 26 18" stroke="#1A0F0A" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  caramel: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 8 C24 12 28 16 26 22 C24 28 16 30 14 24 C12 18 16 14 20 8Z" fill="currentColor" opacity="0.9" />
      <path d="M20 8 C20 14 16 18 18 24" stroke="#1A0F0A" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  citrus: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="21" r="13" fill="currentColor" opacity="0.85" />
      <circle cx="20" cy="21" r="9" fill="none" stroke="#1A0F0A" strokeWidth="1" />
      <line x1="20" y1="8" x2="20" y2="34" stroke="#1A0F0A" strokeWidth="1.5" />
      <line x1="7" y1="21" x2="33" y2="21" stroke="#1A0F0A" strokeWidth="1.5" />
      <path d="M10 13 Q20 10 30 13" stroke="#1A0F0A" strokeWidth="1" />
      <path d="M10 29 Q20 32 30 29" stroke="#1A0F0A" strokeWidth="1" />
      <path d="M20 6 Q22 4 24 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  earthy: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 28 Q10 18 20 16 Q30 18 34 28 Z" fill="currentColor" opacity="0.9" />
      <circle cx="13" cy="22" r="2" fill="currentColor" opacity="0.6" />
      <circle cx="20" cy="19" r="2.5" fill="currentColor" opacity="0.7" />
      <circle cx="27" cy="22" r="2" fill="currentColor" opacity="0.6" />
      <path d="M8 30 Q20 26 32 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  ),
  spicy: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 8 C26 10 30 18 26 26 C24 30 20 32 18 30 C14 28 12 22 16 16 C18 12 22 8 22 8Z" fill="currentColor" opacity="0.9" />
      <path d="M22 8 C22 12 20 16 20 22" stroke="#1A0F0A" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M20 8 Q22 5 24 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  bright: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="7" fill="currentColor" />
      <line x1="20" y1="6" x2="20" y2="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="20" y1="30" x2="20" y2="34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="6" y1="20" x2="10" y2="20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="30" y1="20" x2="34" y2="20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="10.1" y1="10.1" x2="12.9" y2="12.9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      <line x1="27.1" y1="27.1" x2="29.9" y2="29.9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      <line x1="29.9" y1="10.1" x2="27.1" y2="12.9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      <line x1="12.9" y1="27.1" x2="10.1" y2="29.9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
    </svg>
  ),
  sweet: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 8 L22.5 15 L30 15 L24 19.5 L26.5 27 L20 22.5 L13.5 27 L16 19.5 L10 15 L17.5 15 Z" fill="currentColor" opacity="0.9" />
    </svg>
  ),
  smoky: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 32 Q14 26 16 20 Q18 14 16 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M20 32 Q18 24 20 18 Q22 12 20 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9" />
      <path d="M24 32 Q26 26 24 20 Q22 14 24 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
    </svg>
  ),
  herbal: (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 32 Q20 20 20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 22 Q13 18 10 10 Q18 12 20 22Z" fill="currentColor" opacity="0.85" />
      <path d="M20 18 Q27 14 30 8 Q22 10 20 18Z" fill="currentColor" opacity="0.7" />
      <path d="M20 26 Q14 24 12 18 Q19 20 20 26Z" fill="currentColor" opacity="0.65" />
    </svg>
  ),
}

export function CoffeeFlavoursSection() {
  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 xl:px-16 py-20 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-14"
      >
        <p className="label-ornate mb-6">The Tasting Wheel</p>
        <h2 className="font-display text-4xl md:text-5xl leading-tight mb-4" style={{ color: 'var(--color-text)' }}>
          Coffee Flavours
        </h2>
        <p className="text-base max-w-md leading-loose" style={{ color: 'var(--color-text-muted)' }}>
          The full spectrum of tastes found across the world's coffee-growing regions.
        </p>
      </motion.div>

      {/* Flavour grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
        {coffeeFlavours.map((flavour, i) => (
          <motion.div
            key={flavour.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className="group flex flex-col items-center gap-3 p-4 sm:p-5 cursor-default transition-all duration-300"
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = `${flavour.color}55`
              e.currentTarget.style.background = `${flavour.color}0F`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(80,120,60,0.18)'
              e.currentTarget.style.background = '#1C2B14'
            }}
            title={flavour.description}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0" style={{ color: flavour.color }}>
              {flavourIcons[flavour.icon]}
            </div>
            <span className="text-[10px] sm:text-xs font-medium text-center leading-tight uppercase tracking-[0.15em]" style={{ color: flavour.color }}>
              {flavour.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
