import { useParams, Navigate, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { recipes, categories } from '../data'
import { RecipeCard } from '../components/ui/RecipeCard'
import { RecipeIcon } from '../components/ui/RecipeIcon'
import { SEO } from '../components/ui/SEO'
import { BrewTimer } from '../components/ui/BrewTimer'
import { useTheme } from '../contexts/ThemeContext'
import { useToast } from '../contexts/ToastContext'
import { useRecentlyViewed } from '../hooks/useRecentlyViewed'

function printRecipe(recipe) {
  const el = document.getElementById('recipe-print-root')
  if (!el) return

  el.innerHTML = `
    <h1>${recipe.title}</h1>
    <p class="print-meta">
      Prep: ${recipe.prepTime} min &nbsp;·&nbsp;
      Brew: ${recipe.brewTime} min &nbsp;·&nbsp;
      Difficulty: ${['', 'Easy', 'Moderate', 'Intermediate', 'Advanced', 'Expert'][recipe.difficulty]} &nbsp;·&nbsp;
      ${recipe.steps.length} steps · Serves 1
    </p>
    <div class="print-divider"></div>
    <h2>Ingredients</h2>
    <ul>
      ${recipe.ingredients.map(i => `<li><strong>${i.amount}</strong> — ${i.item}</li>`).join('')}
    </ul>
    <div class="print-divider"></div>
    <h2>Method</h2>
    <ol>
      ${recipe.steps.map(s => `
        <li>
          ${s.instruction}
          ${s.tip ? `<div class="print-tip">💡 ${s.tip}</div>` : ''}
        </li>
      `).join('')}
    </ol>
    <p class="print-footer">The Bean Chronicles &nbsp;·&nbsp; thebeachronicles.com</p>
  `

  window.print()
  el.innerHTML = ''
}

// ── Difficulty ───────────────────────────────────────────────────
const DIFF_LABEL = ['', 'Easy', 'Moderate', 'Intermediate', 'Advanced', 'Expert']

function BeanRating({ value }) {
  return (
    <div className="flex items-center gap-2 mt-0.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <svg key={n} width="13" height="13" viewBox="0 0 24 24"
            fill={n <= value ? '#C9A84C' : 'none'}
            stroke={n <= value ? '#C9A84C' : '#4A6741'} strokeWidth="2">
            <ellipse cx="12" cy="12" rx="8" ry="10"/>
            <path d="M12 2 C8 6 8 18 12 22" strokeLinecap="round"/>
          </svg>
        ))}
      </div>
      <span style={{ color: 'rgba(232,223,208,0.5)', fontSize: '11px' }}>{DIFF_LABEL[value]}</span>
    </div>
  )
}

// ── Ingredient icons ─────────────────────────────────────────────
const ico = { strokeLinecap: 'round', strokeLinejoin: 'round', stroke: '#C9A84C', fill: 'none', strokeWidth: 1.8 }

function IcoEspresso() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" {...ico}>
      <path d="M5 13 Q5 20 12 20 Q19 20 19 13"/>
      <rect x="4" y="11" width="16" height="3" rx="1.5"/>
      <line x1="3" y1="21" x2="21" y2="21"/>
      <path d="M10 10 Q9 7.5 10 5.5" opacity="0.65"/>
      <path d="M14 10 Q15 7.5 14 5.5" opacity="0.65"/>
    </svg>
  )
}
function IcoMilk() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" {...ico}>
      <path d="M8 8 Q7 20 12 20 Q17 20 16 8 Z"/>
      <rect x="9" y="4" width="6" height="5" rx="2"/>
      <line x1="8" y1="14" x2="16" y2="14" opacity="0.45"/>
    </svg>
  )
}
function IcoIce() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" {...ico}>
      <rect x="4" y="7" width="16" height="12" rx="3"/>
      <line x1="12" y1="7" x2="12" y2="19" opacity="0.45"/>
      <line x1="4" y1="13" x2="20" y2="13" opacity="0.45"/>
    </svg>
  )
}
function IcoWhippedCream() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" {...ico}>
      <path d="M12 20 Q8 16 9 12 Q10 8 12 6 Q14 8 15 12 Q16 16 12 20"/>
      <ellipse cx="12" cy="20" rx="5" ry="2"/>
    </svg>
  )
}
function IcoYogurt() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" {...ico}>
      <path d="M7 9 Q6 20 12 20 Q18 20 17 9 Z"/>
      <rect x="8" y="5" width="8" height="5" rx="2"/>
      <line x1="9" y1="15" x2="15" y2="15" opacity="0.45"/>
    </svg>
  )
}
function IcoCheese() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" {...ico}>
      <path d="M4 17 L12 5 L20 17 Z"/>
      <line x1="4" y1="17" x2="20" y2="17"/>
      <circle cx="10" cy="13" r="1.5" fill="#C9A84C" opacity="0.45"/>
      <circle cx="15" cy="11" r="1.2" fill="#C9A84C" opacity="0.45"/>
    </svg>
  )
}
function IcoIceCream() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" {...ico}>
      <path d="M9 22 L12 14 L15 22 Z"/>
      <circle cx="12" cy="10" r="5"/>
      <path d="M9 11 Q11.5 9 14 11" opacity="0.5"/>
    </svg>
  )
}
function IcoSyrup() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" {...ico}>
      <rect x="9" y="9" width="6" height="12" rx="3"/>
      <rect x="10" y="5" width="4" height="5" rx="2"/>
      <rect x="10" y="3" width="4" height="3" rx="1"/>
      <path d="M15 14 Q18 13 18 17" opacity="0.55"/>
    </svg>
  )
}
function IcoEgg() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" {...ico}>
      <path d="M12 3 Q5 3 5 13 Q5 21 12 21 Q19 21 19 13 Q19 3 12 3"/>
    </svg>
  )
}
function IcoAvocado() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" {...ico}>
      <path d="M12 3 Q5 3 5 13 Q5 22 12 22 Q19 22 19 13 Q19 3 12 3"/>
      <circle cx="12" cy="16" r="3.5"/>
    </svg>
  )
}
function IcoApple() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" {...ico}>
      <path d="M12 7 Q6 7 6 15 Q6 21 12 21 Q18 21 18 15 Q18 7 12 7"/>
      <path d="M12 7 Q13 4 15 3"/>
      <path d="M12 5 Q14 3 16 4" opacity="0.5"/>
    </svg>
  )
}
function IcoLemon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" {...ico}>
      <circle cx="12" cy="12" r="7"/>
      <line x1="12" y1="5" x2="12" y2="19" opacity="0.45"/>
      <line x1="5" y1="12" x2="19" y2="12" opacity="0.45"/>
      <path d="M7.5 7.5 L16.5 16.5" opacity="0.25"/>
      <path d="M16.5 7.5 L7.5 16.5" opacity="0.25"/>
    </svg>
  )
}
function IcoFlower() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" {...ico}>
      <line x1="12" y1="21" x2="12" y2="13"/>
      <circle cx="12" cy="8" r="2.5"/>
      <circle cx="7" cy="7" r="2.5"/>
      <circle cx="17" cy="7" r="2.5"/>
      <circle cx="7" cy="13" r="2.5"/>
      <circle cx="17" cy="13" r="2.5"/>
      <circle cx="12" cy="10" r="1.5" fill="#C9A84C" opacity="0.3"/>
    </svg>
  )
}
function IcoSpice() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" {...ico}>
      <rect x="8" y="8" width="8" height="12" rx="4"/>
      <rect x="10" y="4" width="4" height="5" rx="2"/>
      <circle cx="12" cy="14" r="1.5" fill="#C9A84C" opacity="0.45"/>
      <circle cx="10" cy="17" r="1" fill="#C9A84C" opacity="0.38"/>
      <circle cx="14" cy="16" r="1" fill="#C9A84C" opacity="0.38"/>
    </svg>
  )
}
function IcoWater() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" {...ico}>
      <path d="M12 3 Q6 10 6 15 Q6 21 12 21 Q18 21 18 15 Q18 10 12 3"/>
      <path d="M9 17 Q12 15 15 17" opacity="0.5"/>
    </svg>
  )
}
function IcoChocolate() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" {...ico}>
      <rect x="4" y="8" width="16" height="11" rx="2"/>
      <line x1="4" y1="13" x2="20" y2="13" opacity="0.45"/>
      <line x1="9" y1="8" x2="9" y2="19" opacity="0.45"/>
      <line x1="15" y1="8" x2="15" y2="19" opacity="0.45"/>
    </svg>
  )
}
function IcoCoconut() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" {...ico}>
      <circle cx="12" cy="14" r="7"/>
      <path d="M5 14 Q12 11 19 14" opacity="0.45"/>
      <path d="M12 7 Q11 4 9 3" opacity="0.6"/>
      <path d="M12 6 Q14 3 16 4" opacity="0.5"/>
    </svg>
  )
}
function IcoFilter() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" {...ico}>
      <path d="M5 5 L19 5 L13 15 L13 21 L11 21 L11 15 Z"/>
    </svg>
  )
}
function IcoBottle() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" {...ico}>
      <rect x="9" y="7" width="6" height="14" rx="3"/>
      <rect x="10" y="4" width="4" height="4" rx="1"/>
      <rect x="10" y="2" width="4" height="3" rx="1"/>
      <rect x="9" y="12" width="6" height="4" rx="1" fill="#C9A84C" opacity="0.2"/>
    </svg>
  )
}
function IcoSpoon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" {...ico}>
      <circle cx="12" cy="8" r="4"/>
      <line x1="12" y1="12" x2="12" y2="22"/>
    </svg>
  )
}

function getIngredientIcon(item) {
  const t = item.toLowerCase()
  if (/kahlua|bourbon|schnapps|brandy|\bgin\b|liqueur|strega|bitters/.test(t)) return <IcoBottle />
  if (/whipped cream|whipped/.test(t)) return <IcoWhippedCream />
  if (/ice cream|scoop of ice/.test(t)) return <IcoIceCream />
  if (/yogurt/.test(t)) return <IcoYogurt />
  if (/cheese|rennet|cheesecloth/.test(t)) return <IcoCheese />
  if (/espresso|coffee|brew|phin|kopi|oliang|qahwa|kahv|cold brew/.test(t)) return <IcoEspresso />
  if (/coconut/.test(t)) return <IcoCoconut />
  if (/milk|condensed|half.*half|half &|cream/.test(t)) return <IcoMilk />
  if (/sugar|honey|dulce|syrup|caramel/.test(t)) return <IcoSyrup />
  if (/\bice\b|ice cube|crushed ice/.test(t)) return <IcoIce />
  if (/egg|yolk/.test(t)) return <IcoEgg />
  if (/avocado/.test(t)) return <IcoAvocado />
  if (/apple/.test(t)) return <IcoApple />
  if (/lemon|orange|citrus/.test(t)) return <IcoLemon />
  if (/lavender|flower|sprig|blackberr/.test(t)) return <IcoFlower />
  if (/chocolate|cocoa/.test(t)) return <IcoChocolate />
  if (/cardamom|clove|cinnamon|saffron|vanilla|spice|nutmeg|rosewater/.test(t)) return <IcoSpice />
  if (/water|soda/.test(t)) return <IcoWater />
  if (/filter|paper/.test(t)) return <IcoFilter />
  return <IcoSpoon />
}

// ── Method step (timeline style) ─────────────────────────────────
function MethodStep({ step, stepIndex, totalSteps, isLast }) {
  const num = String(stepIndex + 1).padStart(2, '0')
  return (
    <motion.div
      initial={{ opacity: 0, x: -14 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: stepIndex * 0.07 }}
      className="flex gap-5 sm:gap-7"
    >
      {/* Left: badge + connector */}
      <div className="flex flex-col items-center flex-shrink-0" style={{ width: 48 }}>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-base flex-shrink-0"
          style={{
            background: 'var(--color-surface)',
            border: '1.5px solid rgba(201,168,76,0.55)',
            color: 'var(--color-accent)',
            boxShadow: '0 0 0 4px rgba(201,168,76,0.06)',
          }}
        >
          {num}
        </div>
        {!isLast && (
          <div
            className="flex-1 w-px mt-2"
            style={{
              background: 'linear-gradient(to bottom, rgba(201,168,76,0.28), rgba(201,168,76,0.04))',
              minHeight: 40,
            }}
          />
        )}
      </div>

      {/* Right: content */}
      <div className="flex-1 pb-10">
        <p
          className="mb-2 uppercase tracking-[0.18em]"
          style={{ color: 'var(--color-accent)', fontSize: '10px', opacity: 0.55 }}
        >
          Step {stepIndex + 1} of {totalSteps}
        </p>
        <p
          className="leading-relaxed mb-4"
          style={{ color: 'var(--color-text)', fontSize: '1.05rem', lineHeight: 1.75 }}
        >
          {step.instruction}
        </p>
        {step.tip && (
          <div
            className="flex gap-3 rounded-2xl px-4 py-4"
            style={{
              background: 'rgba(201,168,76,0.055)',
              border: '1px solid rgba(201,168,76,0.18)',
            }}
          >
            <svg
              className="flex-shrink-0 mt-0.5"
              width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7c0 2.5-1.5 4.5-3 6H8c-1.5-1.5-3-3.5-3-6a7 7 0 0 1 7-7z"/>
            </svg>
            <div>
              <p className="font-semibold uppercase tracking-[0.16em] mb-1" style={{ color: 'var(--color-accent)', fontSize: '10px' }}>
                Pro Tip
              </p>
              <p className="text-sm italic leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                {step.tip}
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ── Stat pill ────────────────────────────────────────────────────
function StatPill({ label, value, accent = false }) {
  return (
    <div className="flex flex-col gap-1">
      <span style={{ color: 'var(--color-text-faint)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
        {label}
      </span>
      {typeof value === 'string' || typeof value === 'number' ? (
        <span className="font-display text-2xl" style={{ color: accent ? 'var(--color-accent)' : 'var(--color-text)' }}>{value}</span>
      ) : value}
    </div>
  )
}

function scaleAmount(amount, factor) {
  if (factor === 1) return amount
  return amount.replace(/\d+\/\d+|\d+\.?\d*/g, (m) => {
    const n = m.includes('/')
      ? m.split('/').reduce((a, b) => Number(a) / Number(b))
      : parseFloat(m)
    if (isNaN(n) || n === 0) return m
    const result = n * factor
    return Number.isInteger(result) ? String(result) : (Math.round(result * 10) / 10).toString()
  })
}

function shareRecipe(recipe, addToast) {
  const difficulty = recipe.difficulty <= 1 ? 'Easy' : recipe.difficulty <= 3 ? 'Intermediate' : 'Advanced'
  const ingredientsList = recipe.ingredients.map(i => `  • ${i.amount} ${i.item}`).join('\n')
  const text = [
    `☕ ${recipe.title}`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `Prep: ${recipe.prepTime} min  |  Brew: ${recipe.brewTime} min  |  ${difficulty}`,
    ``,
    `Ingredients:`,
    ingredientsList,
    ``,
    `Full recipe with step-by-step instructions 👇`,
  ].join('\n')

  if (navigator.share) {
    navigator.share({ title: recipe.title, text, url: window.location.href }).catch(() => {})
  } else {
    navigator.clipboard?.writeText(`${text}\n${window.location.href}`).then(() => {
      addToast?.({ message: 'Recipe link copied to clipboard', type: 'success' })
    })
  }
}

// ────────────────────────────────────────────────────────────────
export default function RecipeDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isLight = theme === 'light'
  const { addToast } = useToast()
  const { addItem } = useRecentlyViewed()
  const recipe = recipes.find((r) => r.slug === slug)
  const [scale, setScale] = useState(1)
  if (!recipe) return <Navigate to="/recipes" replace />

  // Track this visit for Recently Viewed strip
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    addItem({ id: `recipe-${recipe.id}`, title: recipe.title, to: `/recipe/${recipe.slug}`, type: 'recipe', coverImage: recipe.coverImage || null })
  }, [recipe.id])

  const category = categories.find((c) => c.slug === recipe.category)
  const related = recipes.filter((r) => r.category === recipe.category && r.id !== recipe.id).slice(0, 4)
  const brewLabel = recipe.brewTime >= 60
    ? `${Math.round(recipe.brewTime / 60)}h`
    : `${recipe.brewTime} min`

  const heroBg = isLight
    ? 'radial-gradient(ellipse at 50% 55%, rgba(210,185,130,0.7) 0%, var(--color-surface) 100%)'
    : 'radial-gradient(ellipse at 50% 55%, #1C2B14 0%, #0D1810 100%)'
  const infoSectionBg = isLight
    ? 'linear-gradient(140deg, var(--color-surface) 0%, var(--color-bg) 100%)'
    : 'linear-gradient(140deg, #162210 0%, #0D1810 100%)'
  const methodSectionBg = isLight
    ? 'var(--color-surface)'
    : 'linear-gradient(to bottom, #0D1810 0%, #111e0c 40%, #0D1810 100%)'

  const recipeSchema = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    description: `How to make ${recipe.title} — a ${recipe.steps.length}-step recipe from The Bean Chronicles.`,
    image: recipe.coverImage,
    prepTime: `PT${recipe.prepTime}M`,
    cookTime: `PT${recipe.brewTime}M`,
    totalTime: `PT${recipe.prepTime + recipe.brewTime}M`,
    recipeYield: '1 serving',
    recipeCategory: recipe.category,
    recipeIngredient: recipe.ingredients.map(i => `${i.amount} ${i.item}`),
    recipeInstructions: recipe.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text: s.instruction,
    })),
    author: { '@type': 'Organization', name: 'The Bean Chronicles' },
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <SEO title={recipe.title} description={`How to make ${recipe.title} — a ${recipe.steps.length}-step recipe from The Bean Chronicles.`} schema={recipeSchema} />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <div className="relative flex flex-col md:flex-row" style={{ minHeight: '55vh', paddingTop: '4rem' }}>

        {/* Back button — floating pill */}
        <motion.button
          onClick={() => navigate(-1)}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.04, x: -2 }}
          whileTap={{ scale: 0.96 }}
          className="absolute z-10 flex items-center gap-2.5"
          style={{
            top: '5rem',
            left: '1.75rem',
            border: '1px solid var(--color-accent-border)',
            background: 'var(--color-accent-dim)',
            color: 'var(--color-accent)',
            borderRadius: '9999px',
            padding: '0.55rem 1.25rem',
            fontFamily: 'Space Mono, monospace',
            fontSize: '0.68rem',
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            boxShadow: '0 2px 16px rgba(0,0,0,0.18)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-accent)'
            e.currentTarget.style.color = 'var(--color-bg)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--color-accent-dim)'
            e.currentTarget.style.color = 'var(--color-accent)'
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Recipes
        </motion.button>

        {/* Left: Illustrated icon — hidden on small screens to save space */}
        <div
          className="hidden sm:flex w-full md:w-[44%] items-center justify-center relative overflow-hidden py-10 md:py-0"
          style={{ background: heroBg }}
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div style={{ width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)' }}/>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            style={{ width: 240, height: 240, position: 'relative', zIndex: 1 }}
          >
            <RecipeIcon slug={recipe.slug} />
          </motion.div>
        </div>

        {/* Right: Recipe info */}
        <div
          className="w-full md:w-[56%] flex items-center px-8 md:px-12 lg:px-16 py-12"
          style={{ background: infoSectionBg }}
        >
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="w-full max-w-xl"
          >
            {/* Category chip */}
            {category && (
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-5 uppercase tracking-widest"
                style={{ background: category.color + '18', color: category.color, border: `1px solid ${category.color}30` }}
              >
                {category.name}
              </span>
            )}

            {/* Title */}
            <h1
              className="font-display leading-tight mb-5"
              style={{ color: 'var(--color-text)', fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}
            >
              {recipe.title}
            </h1>

            {/* Gold rule */}
            <div style={{ width: 52, height: 2, background: 'linear-gradient(90deg, #C9A84C, transparent)', marginBottom: '1.75rem' }}/>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={() => printRecipe(recipe)}
                className="btn-solid"
                style={{ fontSize: '0.75rem', padding: '0.85rem 2rem', letterSpacing: '0.18em' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                  <rect x="6" y="14" width="12" height="8"/>
                </svg>
                Print Recipe
              </button>
              <button
                onClick={() => shareRecipe(recipe, addToast)}
                className="btn-outline"
                style={{ fontSize: '0.75rem', padding: '0.85rem 2rem', letterSpacing: '0.18em' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                Share
              </button>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              <StatPill label="Prep Time"  value={`${recipe.prepTime} min`} accent />
              <StatPill label="Brew Time"  value={brewLabel} accent />
              <StatPill
                label="Difficulty"
                value={<BeanRating value={recipe.difficulty} />}
              />
              <StatPill label="Steps" value={recipe.steps.length} />
            </div>

            {/* Brew timer */}
            <div className="mt-6">
              <BrewTimer minutes={recipe.brewTime} label={recipe.title} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── INGREDIENTS ───────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          {/* Section heading + serving scale */}
          <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
            <div className="flex items-baseline gap-3">
              <h2 className="font-display text-3xl" style={{ color: 'var(--color-accent)' }}>What You'll Need</h2>
              <span style={{ color: 'var(--color-text-faint)', fontSize: '13px' }}>
                {recipe.ingredients.length} ingredient{recipe.ingredients.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span style={{ color: 'var(--color-text-faint)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.18em', marginRight: 4, fontFamily: 'Space Mono, monospace' }}>
                Serves
              </span>
              {[1, 2, 3].map(n => (
                <button
                  key={n}
                  onClick={() => setScale(n)}
                  className="w-9 h-9 rounded-full transition-all duration-200"
                  style={{
                    background: scale === n ? 'var(--color-accent)' : 'var(--color-surface)',
                    color: scale === n ? 'var(--color-bg)' : 'var(--color-text-muted)',
                    border: `1px solid ${scale === n ? 'var(--color-accent)' : 'var(--color-border-strong)'}`,
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '11px',
                    cursor: 'pointer',
                  }}
                >
                  ×{n}
                </button>
              ))}
            </div>
          </div>

          {/* Ingredient tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {recipe.ingredients.map((ing, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.045 }}
                className="flex flex-col items-center text-center gap-3 px-3 py-5 rounded-2xl"
              >
                {/* Icon badge */}
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-xl"
                  style={{ background: 'var(--color-bg)', border: '1px solid rgba(201,168,76,0.15)' }}
                >
                  {getIngredientIcon(ing.item)}
                </div>
                {/* Amount + name */}
                <div>
                  <p className="text-xs font-bold mb-0.5" style={{ color: 'var(--color-accent)' }}>
                    {scaleAmount(ing.amount, scale)}
                  </p>
                  <p className="text-xs leading-snug" style={{ color: 'var(--color-text-muted)' }}>
                    {ing.item}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)' }}/>
      </div>

      {/* ── METHOD ────────────────────────────────────────────── */}
      <section style={{ background: methodSectionBg }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 pb-24">

          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <div style={{ width: 32, height: 1, background: 'rgba(201,168,76,0.5)' }}/>
              <span style={{ color: 'rgba(201,168,76,0.65)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.22em' }}>
                Brewing Method
              </span>
            </div>
            <h2 className="font-display text-4xl mb-4" style={{ color: 'var(--color-text)' }}>
              How to Make It
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.8, maxWidth: '46ch' }}>
              Read through once before you start — each step builds on the last and the process moves quickly once you're set up.
            </p>
          </motion.div>

          {/* Timeline steps */}
          <div>
            {recipe.steps.map((step, i) => (
              <MethodStep
                key={i}
                step={step}
                stepIndex={i}
                totalSteps={recipe.steps.length}
                isLast={i === recipe.steps.length - 1}
              />
            ))}
          </div>

          {/* Completion card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="mt-2 rounded-2xl px-6 py-5 flex items-center gap-5"
            style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.18)' }}
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(201,168,76,0.14)', border: '1px solid rgba(201,168,76,0.25)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div>
              <p className="font-semibold mb-0.5" style={{ color: 'var(--color-accent)', fontSize: '0.875rem' }}>Ready to serve</p>
              <p style={{ color: 'rgba(232,223,208,0.45)', fontSize: '12px' }}>
                Total time: {recipe.prepTime + recipe.brewTime >= 60
                  ? `${Math.floor((recipe.prepTime + recipe.brewTime) / 60)}h ${(recipe.prepTime + recipe.brewTime) % 60 ? `${(recipe.prepTime + recipe.brewTime) % 60}min` : ''}`
                  : `${recipe.prepTime + recipe.brewTime} min`
                } · {recipe.steps.length} steps · Serves 1
              </p>
            </div>
          </motion.div>

          {/* Bottom print CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-8 flex flex-col items-center gap-3 text-center"
          >
            <p style={{ color: 'rgba(232,223,208,0.4)', fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
              Keep it offline
            </p>
            <button
              onClick={() => printRecipe(recipe)}
              className="btn-outline"
              style={{ fontSize: '0.75rem', padding: '0.85rem 2.5rem', letterSpacing: '0.18em' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-accent)'
                e.currentTarget.style.color = 'var(--color-bg)'
                e.currentTarget.style.borderColor = 'var(--color-accent)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'var(--color-text)'
                e.currentTarget.style.borderColor = 'var(--color-accent-border)'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                <rect x="6" y="14" width="12" height="8"/>
              </svg>
              Save &amp; Print This Recipe
            </button>
          </motion.div>

        </div>
      </section>

      {/* ── RELATED ───────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.18), transparent)', marginBottom: '3.5rem' }}/>
          <div className="mb-9">
            <span style={{ color: 'var(--color-accent)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.22em', fontWeight: 600 }}>
              More Recipes
            </span>
            <h2 className="font-display text-2xl mt-1.5" style={{ color: 'var(--color-text)' }}>You Might Also Like</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((r) => <RecipeCard key={r.id} recipe={r} />)}
          </div>
        </section>
      )}
    </div>
  )
}
