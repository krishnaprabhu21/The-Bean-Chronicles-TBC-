import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { categories } from '../../data'
import { RecipeIcon } from './RecipeIcon'

function BeanIcon({ filled }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill={filled ? '#C9A84C' : 'none'} stroke={filled ? '#C9A84C' : '#4A6741'} strokeWidth="2">
      <ellipse cx="12" cy="12" rx="8" ry="10" />
      <path d="M12 2 C8 6 8 18 12 22" strokeLinecap="round" />
    </svg>
  )
}

export function RecipeCard({ recipe }) {
  const category = categories.find((c) => c.slug === recipe.category)
  const totalTime = recipe.prepTime + (recipe.brewTime > 60 ? Math.round(recipe.brewTime / 60) : recipe.brewTime)
  const timeLabel = recipe.brewTime >= 60 ? `${Math.round(recipe.brewTime / 60)}h` : `${totalTime} min`

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="group overflow-hidden"
      style={{ border: '1px solid rgba(80,120,60,0.2)', background: '#1C2B14' }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.35)' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(80,120,60,0.2)' }}
    >
      <Link to={`/recipe/${recipe.slug}`} className="block">
        <div
          className="aspect-[16/9] overflow-hidden relative flex items-center justify-center"
          style={{ background: 'linear-gradient(150deg, #162210 0%, #0D1810 100%)' }}
        >
          <motion.div
            className="transition-transform duration-700 group-hover:scale-110"
            style={{ width: '58%', height: '90%', display: 'flex', alignItems: 'center' }}
          >
            <RecipeIcon slug={recipe.slug} />
          </motion.div>
          {/* Time badge */}
          <div
            className="absolute bottom-3 right-3 backdrop-blur-sm flex items-center gap-1.5 px-3 py-1"
            style={{ background: 'rgba(13,24,16,0.82)', border: '1px solid rgba(201,168,76,0.3)' }}
          >
            <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="text-[10px] uppercase tracking-[0.15em]" style={{ color: '#C9A84C', fontFamily: 'Space Mono, monospace' }}>{timeLabel}</span>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {category && (
            <span className="inline-block text-[9px] uppercase tracking-[0.22em] font-medium mb-4" style={{ color: '#C9A84C' }}>
              {category.name}
            </span>
          )}
          <h3
            className="font-display text-lg leading-snug mb-4 line-clamp-2 transition-colors duration-200"
            style={{ color: '#E8DFD0' }}
          >
            {recipe.title}
          </h3>
          <div className="flex flex-col gap-2 pt-4" style={{ borderTop: '1px solid rgba(80,120,60,0.15)' }}>
            <div className="flex items-center gap-1">
              <span className="text-[10px] uppercase tracking-[0.15em] mr-2" style={{ color: 'rgba(232,223,208,0.4)' }}>Difficulty</span>
              {[1, 2, 3, 4, 5].map((n) => (
                <BeanIcon key={n} filled={n <= recipe.difficulty} />
              ))}
            </div>
            <span className="text-[10px] uppercase tracking-[0.12em]" style={{ color: 'rgba(232,223,208,0.35)' }}>
              {recipe.ingredients.length} Ingredients
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
