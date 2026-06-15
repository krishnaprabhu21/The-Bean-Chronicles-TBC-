import { motion } from 'framer-motion'

export function CategoryFilter({ categories, active, onSelect }) {
  const allCategories = [{ id: 'all', name: 'All', slug: 'all' }, ...categories]

  return (
    <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
      {allCategories.map((cat) => {
        const isActive = active === cat.slug
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.slug)}
            className="relative flex-shrink-0 px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.18em] transition-colors duration-200 focus:outline-none rounded-full"
            style={{
              color: isActive ? '#0D1810' : 'rgba(232,223,208,0.5)',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {isActive && (
              <motion.span
                layoutId="activePill"
                className="absolute inset-0"
                style={{ background: '#C9A84C' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{cat.name}</span>
          </button>
        )
      })}
    </div>
  )
}
