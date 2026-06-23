import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '../contexts/ToastContext'
import { BackButton } from '../components/ui/BackButton'
import { SEO } from '../components/ui/SEO'

// ── Email config ──────────────────────────────────────────────────────────────
// Get your free access key at https://web3forms.com — enter krishnaprabhu21@gmail.com
// and paste the key you receive below.
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || '3e71bb1e-8798-4f20-b50c-aa5782ccb52b'

async function sendRecipeEmail(data) {
  const ingredients = data.ingredients
    .filter(i => i.item.trim())
    .map((i, n) => `  ${n + 1}. ${[i.amount, i.item].filter(Boolean).join(' ')}`)
    .join('\n')

  const steps = data.steps
    .filter(s => s.instruction.trim())
    .map((s, n) => `  Step ${n + 1}: ${s.instruction}${s.tip ? `\n         Tip: ${s.tip}` : ''}`)
    .join('\n\n')

  const message = [
    `RECIPE: ${data.name}`,
    `Category: ${data.category}`,
    `Difficulty: ${'☕'.repeat(data.difficulty)} (${data.difficulty}/5)`,
    `Prep: ${data.prepTime || '—'} min  |  Brew: ${data.brewTime || '—'} min`,
    '',
    'INGREDIENTS:',
    ingredients || '  (none listed)',
    '',
    'METHOD:',
    steps || '  (none listed)',
    '',
    '──────────────────────────────',
    `From: ${data.submitterName || 'Anonymous'}`,
    `Email: ${data.submitterEmail || '(not provided)'}`,
    `Submitted: ${new Date().toLocaleString()}`,
  ].join('\n')

  const fd = new FormData()
  fd.append('access_key', WEB3FORMS_KEY)
  fd.append('subject', `[Bean Chronicles] New Recipe: ${data.name}`)
  fd.append('name', data.submitterName || 'Bean Chronicles User')
  fd.append('email', data.submitterEmail || 'noreply@beanchronicles.com')
  fd.append('message', message)

  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    body: fd,
  })

  const json = await response.json()
  if (!json.success) throw new Error(json.message || 'Submission failed')
}

// ── Constants ─────────────────────────────────────────────────────────────────

const CATEGORIES = ['Espresso', 'Cold Brew', 'Lattes', 'Pour Over', 'Culture', 'Guides']

const TOTAL_STEPS = 3

const emptyIngredient = () => ({ amount: '', item: '' })
const emptyStep = () => ({ instruction: '', tip: '' })

const inputStyle = {
  background: 'var(--color-surface)',
  border: '1px solid rgba(80,120,60,0.3)',
  borderRadius: '0.65rem',
  color: 'var(--color-text)',
  padding: '0.7rem 1rem',
  fontSize: '0.9rem',
  outline: 'none',
  width: '100%',
  fontFamily: 'Inter, sans-serif',
}

const labelStyle = {
  display: 'block',
  color: 'var(--color-text-muted)',
  fontSize: '0.68rem',
  fontFamily: '"Space Mono", monospace',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  marginBottom: '0.45rem',
}

// ── Step 1: Basics ────────────────────────────────────────────────────────────

function StepBasics({ data, onChange, errors }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Submitter info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Your Name</label>
          <input
            type="text"
            placeholder="e.g. Alex"
            value={data.submitterName}
            onChange={e => onChange('submitterName', e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Your Email</label>
          <input
            type="email"
            placeholder="hello@example.com"
            value={data.submitterEmail}
            onChange={e => onChange('submitterEmail', e.target.value)}
            style={{
              ...inputStyle,
              borderColor: errors.submitterEmail ? 'rgba(248,113,113,0.5)' : 'rgba(80,120,60,0.3)',
            }}
          />
          {errors.submitterEmail && (
            <p style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '0.35rem' }}>{errors.submitterEmail}</p>
          )}
        </div>
      </div>

      {/* Recipe Name */}
      <div>
        <label style={labelStyle}>Recipe Name *</label>
        <input
          type="text"
          placeholder="e.g. Ethiopian Honey Pour Over"
          value={data.name}
          onChange={e => onChange('name', e.target.value)}
          style={{
            ...inputStyle,
            borderColor: errors.name ? 'rgba(248,113,113,0.5)' : 'rgba(80,120,60,0.3)',
          }}
        />
        {errors.name && (
          <p style={{ color: '#f87171', fontSize: '0.78rem', marginTop: '0.35rem' }}>{errors.name}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label style={labelStyle}>Category</label>
        <select
          value={data.category}
          onChange={e => onChange('category', e.target.value)}
          style={{
            ...inputStyle,
            cursor: 'pointer',
            appearance: 'none',
            WebkitAppearance: 'none',
          }}
        >
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Difficulty — bean rating */}
      <div>
        <label style={labelStyle}>Difficulty</label>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              type="button"
              onClick={() => onChange('difficulty', n)}
              style={{
                fontSize: '1.6rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.1rem',
                opacity: n <= data.difficulty ? 1 : 0.25,
                transition: 'opacity 0.15s',
                lineHeight: 1,
              }}
            >
              ☕
            </button>
          ))}
          <span style={{ color: 'rgba(232,223,208,0.5)', fontSize: '0.82rem', marginLeft: '0.35rem' }}>
            {data.difficulty}/5
          </span>
        </div>
      </div>

      {/* Prep + Brew time */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Prep Time (min)</label>
          <input
            type="number"
            min="0"
            placeholder="5"
            value={data.prepTime}
            onChange={e => onChange('prepTime', e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Brew Time (min)</label>
          <input
            type="number"
            min="0"
            placeholder="4"
            value={data.brewTime}
            onChange={e => onChange('brewTime', e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>
    </div>
  )
}

// ── Step 2: Ingredients ───────────────────────────────────────────────────────

function StepIngredients({ ingredients, onChange, errors }) {
  function updateIngredient(idx, field, value) {
    const next = ingredients.map((ing, i) => i === idx ? { ...ing, [field]: value } : ing)
    onChange(next)
  }

  function addIngredient() {
    onChange([...ingredients, emptyIngredient()])
  }

  function removeIngredient(idx) {
    if (ingredients.length <= 1) return
    onChange(ingredients.filter((_, i) => i !== idx))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: 0 }}>
        List every ingredient with its quantity. At least one ingredient is required.
      </p>

      {errors.ingredients && (
        <p style={{ color: '#f87171', fontSize: '0.78rem', margin: 0 }}>{errors.ingredients}</p>
      )}

      {ingredients.map((ing, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}
        >
          {/* Step number */}
          <div
            style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              background: 'rgba(201,168,76,0.12)',
              border: '1px solid rgba(201,168,76,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-accent)',
              fontSize: '0.78rem',
              fontFamily: '"Space Mono", monospace',
              flexShrink: 0,
              marginBottom: '0.1rem',
            }}
          >
            {idx + 1}
          </div>

          {/* Amount */}
          <div style={{ flex: '0 0 100px' }}>
            {idx === 0 && <label style={labelStyle}>Amount</label>}
            <input
              type="text"
              placeholder="30ml"
              value={ing.amount}
              onChange={e => updateIngredient(idx, 'amount', e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Item */}
          <div style={{ flex: 1 }}>
            {idx === 0 && <label style={labelStyle}>Ingredient</label>}
            <input
              type="text"
              placeholder="Freshly ground coffee"
              value={ing.item}
              onChange={e => updateIngredient(idx, 'item', e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Remove */}
          <button
            type="button"
            onClick={() => removeIngredient(idx)}
            disabled={ingredients.length <= 1}
            style={{
              background: 'none',
              border: '1px solid rgba(248,113,113,0.3)',
              borderRadius: '0.5rem',
              color: 'rgba(248,113,113,0.7)',
              cursor: ingredients.length <= 1 ? 'not-allowed' : 'pointer',
              opacity: ingredients.length <= 1 ? 0.3 : 1,
              padding: '0.55rem 0.75rem',
              fontSize: '0.82rem',
              flexShrink: 0,
              transition: 'all 0.15s',
              marginBottom: '0.1rem',
            }}
          >
            ✕
          </button>
        </motion.div>
      ))}

      <button
        type="button"
        onClick={addIngredient}
        style={{
          background: 'rgba(201,168,76,0.08)',
          border: '1px dashed rgba(201,168,76,0.35)',
          borderRadius: '0.75rem',
          color: 'var(--color-accent)',
          padding: '0.65rem 1.25rem',
          fontSize: '0.875rem',
          cursor: 'pointer',
          fontFamily: '"Space Mono", monospace',
          letterSpacing: '0.05em',
          transition: 'background 0.15s',
          alignSelf: 'flex-start',
        }}
      >
        + Add Ingredient
      </button>
    </div>
  )
}

// ── Step 3: Method ────────────────────────────────────────────────────────────

function StepMethod({ steps, onChange, errors }) {
  function updateStep(idx, field, value) {
    const next = steps.map((s, i) => i === idx ? { ...s, [field]: value } : s)
    onChange(next)
  }

  function addStep() {
    onChange([...steps, emptyStep()])
  }

  function removeStep(idx) {
    if (steps.length <= 1) return
    onChange(steps.filter((_, i) => i !== idx))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: 0 }}>
        Describe each step of your brew process. Minimum 2 steps required.
      </p>

      {errors.steps && (
        <p style={{ color: '#f87171', fontSize: '0.78rem', margin: 0 }}>{errors.steps}</p>
      )}

      {steps.map((step, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            background: 'var(--color-card)',
            border: '1px solid rgba(80,120,60,0.2)',
            borderRadius: '1rem',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}
        >
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '50%',
                  background: 'var(--color-accent-dim)',
                  border: '1px solid rgba(201,168,76,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-accent)',
                  fontSize: '0.82rem',
                  fontFamily: '"Space Mono", monospace',
                  flexShrink: 0,
                }}
              >
                {idx + 1}
              </div>
              <span
                style={{
                  color: 'rgba(232,223,208,0.45)',
                  fontSize: '0.68rem',
                  fontFamily: '"Space Mono", monospace',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                Step {idx + 1}
              </span>
            </div>
            <button
              type="button"
              onClick={() => removeStep(idx)}
              disabled={steps.length <= 1}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(248,113,113,0.55)',
                cursor: steps.length <= 1 ? 'not-allowed' : 'pointer',
                opacity: steps.length <= 1 ? 0.3 : 1,
                fontSize: '0.82rem',
                padding: '0.25rem 0.5rem',
              }}
            >
              Remove
            </button>
          </div>

          {/* Instruction */}
          <div>
            <label style={labelStyle}>Instruction *</label>
            <textarea
              rows={3}
              placeholder="Describe this step in detail..."
              value={step.instruction}
              onChange={e => updateStep(idx, 'instruction', e.target.value)}
              style={{
                ...inputStyle,
                resize: 'vertical',
                minHeight: '80px',
                fontFamily: 'Inter, sans-serif',
              }}
            />
          </div>

          {/* Tip */}
          <div>
            <label style={labelStyle}>Pro Tip (optional)</label>
            <input
              type="text"
              placeholder="e.g. Use a thermometer to maintain 93°C"
              value={step.tip}
              onChange={e => updateStep(idx, 'tip', e.target.value)}
              style={inputStyle}
            />
          </div>
        </motion.div>
      ))}

      <button
        type="button"
        onClick={addStep}
        style={{
          background: 'rgba(201,168,76,0.08)',
          border: '1px dashed rgba(201,168,76,0.35)',
          borderRadius: '0.75rem',
          color: 'var(--color-accent)',
          padding: '0.65rem 1.25rem',
          fontSize: '0.875rem',
          cursor: 'pointer',
          fontFamily: '"Space Mono", monospace',
          letterSpacing: '0.05em',
          transition: 'background 0.15s',
          alignSelf: 'flex-start',
        }}
      >
        + Add Step
      </button>
    </div>
  )
}

// ── Progress bar ──────────────────────────────────────────────────────────────

function ProgressBar({ current }) {
  const STEP_LABELS = ['Basics', 'Ingredients', 'Method']
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      {/* Labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        {STEP_LABELS.map((label, i) => (
          <span
            key={label}
            style={{
              fontSize: '0.68rem',
              fontFamily: '"Space Mono", monospace',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: i + 1 <= current ? 'var(--color-accent)' : 'var(--color-text-faint)',
              transition: 'color 0.3s',
            }}
          >
            {label}
          </span>
        ))}
      </div>
      {/* Bar */}
      <div
        style={{
          height: '3px',
          background: 'rgba(80,120,60,0.25)',
          borderRadius: '999px',
          overflow: 'hidden',
        }}
      >
        <motion.div
          animate={{ width: `${((current - 1) / (TOTAL_STEPS - 1)) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #C9A84C, #E8C870)',
            borderRadius: '999px',
          }}
        />
      </div>
      {/* Step dots */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '-7px' }}>
        {STEP_LABELS.map((_, i) => (
          <div
            key={i}
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: i + 1 <= current ? 'var(--color-accent)' : 'var(--color-surface)',
              border: `2px solid ${i + 1 <= current ? 'var(--color-accent)' : 'rgba(80,120,60,0.3)'}`,
              transition: 'all 0.3s',
              zIndex: 1,
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ── Success screen ────────────────────────────────────────────────────────────

function SuccessScreen({ onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        textAlign: 'center',
        padding: '3rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
      }}
    >
      {/* Animated checkmark */}
      <motion.div
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, delay: 0.15, type: 'spring', stiffness: 180 }}
        style={{
          width: '5rem',
          height: '5rem',
          borderRadius: '50%',
          background: 'rgba(74,222,128,0.12)',
          border: '2px solid rgba(74,222,128,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.2rem',
        }}
      >
        ✓
      </motion.div>

      <div>
        <h2
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '2rem',
            color: 'var(--color-text)',
            marginBottom: '0.75rem',
          }}
        >
          Your recipe has been submitted!
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.975rem', lineHeight: 1.7, maxWidth: '440px' }}>
          Your recipe has been emailed to the team for review. Thank you for contributing to the Bean Chronicles community.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={onReset}
          style={{
            background: 'rgba(201,168,76,0.12)',
            border: '1px solid rgba(201,168,76,0.35)',
            borderRadius: '0.75rem',
            color: 'var(--color-accent)',
            padding: '0.7rem 1.5rem',
            fontSize: '0.875rem',
            cursor: 'pointer',
            fontFamily: '"Space Mono", monospace',
            letterSpacing: '0.05em',
            transition: 'background 0.15s',
          }}
        >
          Submit Another
        </button>
        <Link
          to="/recipes"
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
            textDecoration: 'none',
            display: 'inline-block',
            fontWeight: 600,
          }}
        >
          Browse Recipes
        </Link>
      </div>
    </motion.div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

function defaultFormData() {
  return {
    submitterName: '',
    submitterEmail: '',
    name: '',
    category: 'Espresso',
    difficulty: 3,
    prepTime: '',
    brewTime: '',
    ingredients: [emptyIngredient(), emptyIngredient(), emptyIngredient()],
    steps: [emptyStep(), emptyStep()],
  }
}

export default function SubmitRecipe() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState(defaultFormData())
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const { addToast } = useToast()

  function updateBasics(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  function updateIngredients(next) {
    setFormData(prev => ({ ...prev, ingredients: next }))
    if (errors.ingredients) setErrors(prev => ({ ...prev, ingredients: undefined }))
  }

  function updateSteps(next) {
    setFormData(prev => ({ ...prev, steps: next }))
    if (errors.steps) setErrors(prev => ({ ...prev, steps: undefined }))
  }

  function validateStep(step) {
    const newErrors = {}
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Recipe name is required.'
    }
    if (step === 2) {
      const hasItem = formData.ingredients.some(i => i.item.trim() !== '')
      if (!hasItem) newErrors.ingredients = 'At least one ingredient is required.'
    }
    if (step === 3) {
      const filledSteps = formData.steps.filter(s => s.instruction.trim() !== '')
      if (filledSteps.length < 2) newErrors.steps = 'At least 2 steps with instructions are required.'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleNext() {
    if (!validateStep(currentStep)) return
    setCurrentStep(s => Math.min(s + 1, TOTAL_STEPS))
  }

  function handleBack() {
    setErrors({})
    setCurrentStep(s => Math.max(s - 1, 1))
  }

  async function handleSubmit() {
    if (!validateStep(currentStep)) return
    setSending(true)

    const submission = {
      id: Date.now(),
      submittedAt: new Date().toISOString(),
      submitterName: formData.submitterName,
      submitterEmail: formData.submitterEmail,
      name: formData.name,
      category: formData.category,
      difficulty: formData.difficulty,
      prepTime: formData.prepTime,
      brewTime: formData.brewTime,
      ingredients: formData.ingredients.filter(i => i.item.trim() !== ''),
      steps: formData.steps.filter(s => s.instruction.trim() !== ''),
    }

    // Save to localStorage regardless of email outcome
    const existing = JSON.parse(localStorage.getItem('tbc-submissions') || '[]')
    localStorage.setItem('tbc-submissions', JSON.stringify([...existing, submission]))

    try {
      await sendRecipeEmail(submission)
      setSubmitted(true)
      addToast({ message: 'Recipe sent! We\'ll review it soon.', type: 'success', duration: 4000 })
    } catch (err) {
      console.error('Email send failed:', err)
      // Still mark as submitted locally — don't block the user
      setSubmitted(true)
      addToast({ message: 'Saved locally. Email delivery may have failed — check your Web3Forms key.', type: 'warning', duration: 6000 })
    } finally {
      setSending(false)
    }
  }

  function handleReset() {
    setFormData(defaultFormData())
    setCurrentStep(1)
    setErrors({})
    setSubmitted(false)
  }

  const STEP_TITLES = ['The Basics', 'Ingredients', 'Brew Method']

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <SEO title="Submit a Recipe" description="Share your coffee recipe with The Bean Chronicles community — espresso, cold brew, lattes, and more welcome." />
      <BackButton to="/community" label="Community" />
      <div style={{ paddingTop: '6rem' }}>
        {/* Hero */}
        <section style={{ maxWidth: '700px', margin: '0 auto', padding: '3rem 1.5rem 2rem', textAlign: 'center' }}>
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
            ✦ Community Brews ✦
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 'clamp(2.2rem, 5.5vw, 3.5rem)',
              color: 'var(--color-text)',
              lineHeight: 1.1,
              marginBottom: '1.25rem',
            }}
          >
            Submit Your{' '}
            <span style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>/ Recipe</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{
              color: 'rgba(232,223,208,0.65)',
              fontSize: '1rem',
              maxWidth: '460px',
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            Share your signature brew with the Bean Chronicles community.
          </motion.p>
        </section>

        {/* Form card */}
        <section style={{ maxWidth: '700px', margin: '0 auto', padding: '0 1.5rem 5rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '1.5rem',
              overflow: 'hidden',
            }}
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div key="success">
                  <SuccessScreen onReset={handleReset} />
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ padding: '2.5rem 2rem' }}
                >
                  {/* Progress bar */}
                  <ProgressBar current={currentStep} />

                  {/* Step heading */}
                  <div style={{ marginBottom: '2rem' }}>
                    <p
                      style={{
                        color: 'rgba(232,223,208,0.4)',
                        fontSize: '0.68rem',
                        fontFamily: '"Space Mono", monospace',
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        marginBottom: '0.35rem',
                      }}
                    >
                      Step {currentStep} of {TOTAL_STEPS}
                    </p>
                    <h2
                      style={{
                        fontFamily: '"Playfair Display", serif',
                        fontSize: '1.75rem',
                        color: 'var(--color-text)',
                        margin: 0,
                      }}
                    >
                      {STEP_TITLES[currentStep - 1]}
                    </h2>
                  </div>

                  {/* Step content with AnimatePresence */}
                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <StepBasics data={formData} onChange={updateBasics} errors={errors} />
                      </motion.div>
                    )}
                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <StepIngredients
                          ingredients={formData.ingredients}
                          onChange={updateIngredients}
                          errors={errors}
                        />
                      </motion.div>
                    )}
                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <StepMethod
                          steps={formData.steps}
                          onChange={updateSteps}
                          errors={errors}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation buttons */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '2.5rem',
                      paddingTop: '1.5rem',
                      borderTop: '1px solid rgba(80,120,60,0.18)',
                    }}
                  >
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={currentStep === 1}
                      style={{
                        background: 'none',
                        border: '1px solid rgba(80,120,60,0.3)',
                        borderRadius: '0.75rem',
                        color: currentStep === 1 ? 'rgba(232,223,208,0.2)' : 'rgba(232,223,208,0.7)',
                        padding: '0.7rem 1.5rem',
                        fontSize: '0.875rem',
                        cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                        fontFamily: '"Space Mono", monospace',
                        letterSpacing: '0.05em',
                        transition: 'all 0.15s',
                      }}
                    >
                      ← Back
                    </button>

                    {currentStep < TOTAL_STEPS ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        style={{
                          background: 'var(--color-accent)',
                          border: 'none',
                          borderRadius: '0.75rem',
                          color: 'var(--color-bg)',
                          padding: '0.7rem 1.75rem',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          fontFamily: '"Space Mono", monospace',
                          letterSpacing: '0.05em',
                          fontWeight: 600,
                          transition: 'opacity 0.15s',
                        }}
                      >
                        Next →
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={sending}
                        style={{
                          background: sending ? 'rgba(201,168,76,0.6)' : 'var(--color-accent)',
                          border: 'none',
                          borderRadius: '0.75rem',
                          color: 'var(--color-bg)',
                          padding: '0.7rem 1.75rem',
                          fontSize: '0.875rem',
                          cursor: sending ? 'not-allowed' : 'pointer',
                          fontFamily: '"Space Mono", monospace',
                          letterSpacing: '0.05em',
                          fontWeight: 600,
                          transition: 'opacity 0.15s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        {sending ? (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
                              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                            </svg>
                            Sending…
                          </>
                        ) : 'Submit Recipe ✓'}
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </section>
      </div>
    </div>
  )
}
