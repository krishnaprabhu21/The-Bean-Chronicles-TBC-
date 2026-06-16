import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '../contexts/ToastContext'

const STORAGE_KEY = 'tbc-journal'

const BREW_METHODS = ['Espresso', 'Pour Over', 'French Press', 'AeroPress', 'Cold Brew', 'Moka Pot', 'Other']
const GRIND_SIZES = ['Extra Fine', 'Fine', 'Medium', 'Coarse', 'Extra Coarse']
const MOODS = ['☀️', '🌧️', '🌙', '⚡', '🧘']

const inputStyle = {
  background: 'var(--color-surface)',
  border: '1px solid rgba(80,120,60,0.3)',
  color: 'var(--color-text)',
  borderRadius: '0.75rem',
  padding: '0.6rem 0.9rem',
  fontSize: '0.875rem',
  width: '100%',
  outline: 'none',
  fontFamily: 'Inter, sans-serif',
}

const labelStyle = {
  display: 'block',
  fontSize: '0.65rem',
  textTransform: 'uppercase',
  letterSpacing: '0.2em',
  color: 'rgba(201,168,76,0.6)',
  fontFamily: 'Space Mono, monospace',
  marginBottom: '0.4rem',
}

function loadJournal() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveJournal(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '2px',
            fontSize: '1.25rem',
            lineHeight: 1,
            color: star <= (hovered || value) ? 'var(--color-accent)' : 'rgba(201,168,76,0.2)',
            transition: 'color 0.15s',
          }}
        >
          ★
        </button>
      ))}
    </div>
  )
}

function StarDisplay({ value, size = '0.9rem' }) {
  return (
    <span style={{ fontSize: size, letterSpacing: '0.05em' }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ color: s <= value ? 'var(--color-accent)' : 'rgba(201,168,76,0.18)' }}>
          ★
        </span>
      ))}
    </span>
  )
}

function NotebookIllustration() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="10" width="64" height="76" rx="6" fill="#1C2B14" stroke="rgba(201,168,76,0.25)" strokeWidth="1.5" />
      <rect x="12" y="10" width="14" height="76" rx="4" fill="#162210" stroke="rgba(201,168,76,0.18)" strokeWidth="1" />
      {[20, 34, 48, 62, 76].map((cy, i) => (
        <circle key={i} cx="19" cy={cy} r="3" fill="#0D1810" stroke="rgba(201,168,76,0.3)" strokeWidth="1" />
      ))}
      <line x1="34" y1="30" x2="68" y2="30" stroke="rgba(201,168,76,0.2)" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="34" y1="40" x2="68" y2="40" stroke="rgba(201,168,76,0.15)" strokeWidth="1" strokeLinecap="round" />
      <line x1="34" y1="50" x2="60" y2="50" stroke="rgba(201,168,76,0.15)" strokeWidth="1" strokeLinecap="round" />
      <line x1="34" y1="60" x2="65" y2="60" stroke="rgba(201,168,76,0.15)" strokeWidth="1" strokeLinecap="round" />
      <circle cx="52" cy="25" r="4" fill="rgba(201,168,76,0.15)" stroke="#C9A84C" strokeWidth="1" />
      <path d="M49 25 Q52 22 55 25 Q52 28 49 25Z" fill="#C9A84C" opacity="0.6" />
    </svg>
  )
}

function EmptyJournal() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center text-center py-20 px-6"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        className="mb-7 opacity-75"
      >
        <NotebookIllustration />
      </motion.div>
      <h3
        className="font-display text-2xl mb-3"
        style={{ color: 'var(--color-text)' }}
      >
        No brews logged yet
      </h3>
      <p
        className="text-sm leading-relaxed max-w-[36ch]"
        style={{ color: 'var(--color-text-muted)', fontFamily: 'Inter, sans-serif' }}
      >
        Start logging your first brew — track your beans, techniques, and tasting notes over time.
      </p>
    </motion.div>
  )
}

function StatsBar({ entries }) {
  const methodCounts = {}
  const originCounts = {}
  let totalRating = 0

  entries.forEach((e) => {
    if (e.method) methodCounts[e.method] = (methodCounts[e.method] || 0) + 1
    if (e.origin) originCounts[e.origin] = (originCounts[e.origin] || 0) + 1
    if (e.rating) totalRating += e.rating
  })

  const topMethod = Object.entries(methodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'
  const topOrigin = Object.entries(originCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'
  const avgRating = entries.length ? (totalRating / entries.length).toFixed(1) : '—'

  const stats = [
    { label: 'Total Brews', value: entries.length },
    { label: 'Top Method', value: topMethod },
    { label: 'Avg Rating', value: avgRating === '—' ? avgRating : `${avgRating} ★` },
    { label: 'Top Origin', value: topOrigin },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
    >
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl p-4 text-center"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid rgba(80,120,60,0.2)',
          }}
        >
          <div
            className="font-display text-xl mb-0.5"
            style={{ color: 'var(--color-accent)' }}
          >
            {s.value}
          </div>
          <div
            className="text-[9px] uppercase tracking-widest"
            style={{ color: 'var(--color-text-faint)', fontFamily: 'Space Mono, monospace' }}
          >
            {s.label}
          </div>
        </div>
      ))}
    </motion.div>
  )
}

function JournalCard({ entry, onDelete }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl p-6 mb-4"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid rgba(80,120,60,0.2)',
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className="text-[10px] uppercase tracking-widest"
            style={{ color: 'var(--color-text-faint)', fontFamily: 'Space Mono, monospace' }}
          >
            {entry.date}
          </span>
          {entry.time && (
            <span
              className="text-[10px]"
              style={{ color: 'var(--color-text-faint)', fontFamily: 'Space Mono, monospace' }}
            >
              {entry.time}
            </span>
          )}
          {entry.mood && (
            <span style={{ fontSize: '1rem', lineHeight: 1 }}>{entry.mood}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {entry.rating > 0 && <StarDisplay value={entry.rating} />}
          <button
            onClick={() => {
              if (window.confirm('Delete this brew entry?')) onDelete(entry.id)
            }}
            title="Delete entry"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-faint)',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#e05555' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-faint)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Title row */}
      <div className="mb-2">
        <span
          className="font-display text-lg leading-tight"
          style={{ color: 'var(--color-text)' }}
        >
          {entry.bean || 'Unnamed Bean'}
        </span>
        {entry.method && (
          <>
            <span style={{ color: 'rgba(201,168,76,0.4)', margin: '0 0.5rem' }}>—</span>
            <span
              className="text-sm"
              style={{ color: 'rgba(201,168,76,0.75)', fontFamily: 'Inter, sans-serif' }}
            >
              {entry.method}
            </span>
          </>
        )}
      </div>

      {/* Meta row */}
      <div
        className="flex flex-wrap gap-x-3 gap-y-1 text-xs mb-4"
        style={{ color: 'var(--color-text-muted)', fontFamily: 'Inter, sans-serif' }}
      >
        {entry.origin && <span>{entry.origin}</span>}
        {entry.dose && (
          <>
            {entry.origin && <span style={{ color: 'rgba(201,168,76,0.2)' }}>|</span>}
            <span>Dose: {entry.dose}g</span>
          </>
        )}
        {entry.water && (
          <>
            <span style={{ color: 'rgba(201,168,76,0.2)' }}>|</span>
            <span>Water: {entry.water}g</span>
          </>
        )}
        {entry.temp && (
          <>
            <span style={{ color: 'rgba(201,168,76,0.2)' }}>|</span>
            <span>Temp: {entry.temp}°C</span>
          </>
        )}
        {entry.brewTime && (
          <>
            <span style={{ color: 'rgba(201,168,76,0.2)' }}>|</span>
            <span>Brew: {entry.brewTime}</span>
          </>
        )}
        {entry.grind && (
          <>
            <span style={{ color: 'rgba(201,168,76,0.2)' }}>|</span>
            <span>Grind: {entry.grind}</span>
          </>
        )}
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(80,120,60,0.15)', marginBottom: '0.85rem' }} />

      {/* Notes */}
      {entry.notes ? (
        <p
          className="text-sm leading-relaxed italic"
          style={{ color: 'var(--color-text-muted)', fontFamily: 'Inter, sans-serif' }}
        >
          {entry.notes}
        </p>
      ) : (
        <p
          className="text-xs italic"
          style={{ color: 'var(--color-border-strong)', fontFamily: 'Inter, sans-serif' }}
        >
          No tasting notes recorded.
        </p>
      )}
    </motion.div>
  )
}

const defaultForm = {
  bean: '',
  origin: '',
  method: '',
  dose: '',
  water: '',
  temp: '',
  brewTime: '',
  grind: '',
  rating: 0,
  mood: '',
  notes: '',
}

function NewEntryForm({ onSave, onCancel }) {
  const [form, setForm] = useState(defaultForm)
  const [error, setError] = useState('')

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.bean.trim()) {
      setError('Bean name is required.')
      return
    }
    setError('')

    const entry = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-GB'),
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      bean: form.bean.trim(),
      origin: form.origin.trim(),
      method: form.method,
      dose: form.dose ? Number(form.dose) : null,
      water: form.water ? Number(form.water) : null,
      temp: form.temp ? Number(form.temp) : null,
      brewTime: form.brewTime.trim(),
      grind: form.grind,
      rating: form.rating,
      notes: form.notes.trim(),
      mood: form.mood,
    }
    onSave(entry)
  }

  const focusBorder = (e) => { e.target.style.borderColor = 'rgba(201,168,76,0.5)' }
  const blurBorder = (e) => { e.target.style.borderColor = 'rgba(80,120,60,0.3)' }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{ overflow: 'hidden' }}
    >
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl p-6 sm:p-8 mb-8"
        style={{
          background: 'var(--color-card)',
          border: '1px solid rgba(201,168,76,0.18)',
        }}
      >
        <div className="flex items-center gap-3 mb-7">
          <span
            className="font-display text-lg"
            style={{ color: 'var(--color-text)' }}
          >
            New Brew Entry
          </span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(201,168,76,0.12)' }} />
        </div>

        {/* Field grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
          {/* Bean Name */}
          <div>
            <label style={labelStyle}>Bean Name *</label>
            <input
              type="text"
              placeholder="e.g. Yirgacheffe Natural"
              value={form.bean}
              onChange={(e) => set('bean', e.target.value)}
              style={inputStyle}
              onFocus={focusBorder}
              onBlur={blurBorder}
            />
          </div>

          {/* Origin */}
          <div>
            <label style={labelStyle}>Origin</label>
            <input
              type="text"
              placeholder="e.g. Ethiopia"
              value={form.origin}
              onChange={(e) => set('origin', e.target.value)}
              style={inputStyle}
              onFocus={focusBorder}
              onBlur={blurBorder}
            />
          </div>

          {/* Brew Method */}
          <div>
            <label style={labelStyle}>Brew Method</label>
            <select
              value={form.method}
              onChange={(e) => set('method', e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
              onFocus={focusBorder}
              onBlur={blurBorder}
            >
              <option value="">Select method…</option>
              {BREW_METHODS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Dose */}
          <div>
            <label style={labelStyle}>Dose (g)</label>
            <input
              type="number"
              placeholder="18"
              min="0"
              step="0.1"
              value={form.dose}
              onChange={(e) => set('dose', e.target.value)}
              style={inputStyle}
              onFocus={focusBorder}
              onBlur={blurBorder}
            />
          </div>

          {/* Water */}
          <div>
            <label style={labelStyle}>Water (g)</label>
            <input
              type="number"
              placeholder="300"
              min="0"
              step="1"
              value={form.water}
              onChange={(e) => set('water', e.target.value)}
              style={inputStyle}
              onFocus={focusBorder}
              onBlur={blurBorder}
            />
          </div>

          {/* Temperature */}
          <div>
            <label style={labelStyle}>Temperature (°C)</label>
            <input
              type="number"
              placeholder="93"
              min="0"
              max="100"
              value={form.temp}
              onChange={(e) => set('temp', e.target.value)}
              style={inputStyle}
              onFocus={focusBorder}
              onBlur={blurBorder}
            />
          </div>

          {/* Brew Time */}
          <div>
            <label style={labelStyle}>Brew Time</label>
            <input
              type="text"
              placeholder="3:45"
              value={form.brewTime}
              onChange={(e) => set('brewTime', e.target.value)}
              style={inputStyle}
              onFocus={focusBorder}
              onBlur={blurBorder}
            />
          </div>

          {/* Grind */}
          <div>
            <label style={labelStyle}>Grind Size</label>
            <select
              value={form.grind}
              onChange={(e) => set('grind', e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
              onFocus={focusBorder}
              onBlur={blurBorder}
            >
              <option value="">Select grind…</option>
              {GRIND_SIZES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Rating */}
          <div>
            <label style={labelStyle}>Rating</label>
            <div
              className="flex items-center"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid rgba(80,120,60,0.3)',
                borderRadius: '0.75rem',
                padding: '0.45rem 0.9rem',
                minHeight: '2.4rem',
              }}
            >
              <StarRating value={form.rating} onChange={(v) => set('rating', v)} />
            </div>
          </div>
        </div>

        {/* Mood picker — full width row */}
        <div className="mb-5">
          <label style={labelStyle}>Mood</label>
          <div className="flex gap-3 flex-wrap">
            {MOODS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => set('mood', form.mood === emoji ? '' : emoji)}
                style={{
                  fontSize: '1.5rem',
                  lineHeight: 1,
                  background: form.mood === emoji ? 'rgba(201,168,76,0.1)' : 'rgba(22,34,16,0.8)',
                  border: `2px solid ${form.mood === emoji ? 'rgba(201,168,76,0.55)' : 'rgba(80,120,60,0.25)'}`,
                  borderRadius: '0.75rem',
                  padding: '0.5rem 0.75rem',
                  cursor: 'pointer',
                  transition: 'border-color 0.18s, background 0.18s',
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Tasting Notes */}
        <div className="mb-6">
          <label style={labelStyle}>Tasting Notes</label>
          <textarea
            rows={3}
            placeholder="Describe the flavours, aromas, body, finish… anything that stood out."
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.65 }}
            onFocus={focusBorder}
            onBlur={blurBorder}
          />
        </div>

        {/* Error */}
        {error && (
          <p
            className="text-xs mb-4"
            style={{ color: '#e05555', fontFamily: 'Inter, sans-serif' }}
          >
            {error}
          </p>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="btn-solid flex-1 justify-center rounded-xl"
            style={{ borderRadius: '0.85rem' }}
          >
            Log This Brew
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCancel}
            className="btn-outline justify-center rounded-xl"
            style={{ borderRadius: '0.85rem', minWidth: '120px' }}
          >
            Cancel
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
}

export default function BrewJournal() {
  const [entries, setEntries] = useState(loadJournal)
  const [showForm, setShowForm] = useState(false)
  const { addToast } = useToast()

  // Persist whenever entries change
  useEffect(() => {
    saveJournal(entries)
  }, [entries])

  const handleSave = useCallback((entry) => {
    setEntries((prev) => [entry, ...prev])
    setShowForm(false)
    addToast({ message: 'Brew logged successfully!', type: 'success' })
  }, [addToast])

  const handleDelete = useCallback((id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
    addToast({ message: 'Entry removed.', type: 'info' })
  }, [addToast])

  const sortedEntries = [...entries].sort((a, b) => b.id - a.id)

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* Hero */}
      <section
        className="pt-24 pb-14 px-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(22,34,16,0.9) 0%, transparent 100%)',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(201,168,76,0.06) 1px, transparent 0)`,
            backgroundSize: '30px 30px',
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <div className="label-ornate justify-center mb-5">
              The Barista's Notebook
            </div>
            <h1
              className="font-display mb-4 leading-tight"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', color: 'var(--color-text)' }}
            >
              Brew{' '}
              <span style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>/ Journal</span>
            </h1>
            <p
              className="text-sm leading-relaxed mx-auto"
              style={{
                color: 'var(--color-text-muted)',
                fontFamily: 'Inter, sans-serif',
                maxWidth: '44ch',
              }}
            >
              Track every brew. Dial in your technique. Build your taste memory.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <div
        className="max-w-4xl mx-auto pb-24"
        style={{ paddingLeft: 'clamp(1rem, 4vw, 2rem)', paddingRight: 'clamp(1rem, 4vw, 2rem)' }}
      >
        {/* New Entry button */}
        <div className="flex items-center justify-between mb-6">
          <span
            className="text-xs uppercase tracking-widest"
            style={{ color: 'var(--color-text-faint)', fontFamily: 'Space Mono, monospace' }}
          >
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </span>
          <AnimatePresence mode="wait">
            {!showForm ? (
              <motion.button
                key="open"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowForm(true)}
                className="btn-solid rounded-full flex items-center gap-2"
                style={{ borderRadius: '9999px', fontSize: '0.7rem' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                New Entry
              </motion.button>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Collapsible form */}
        <AnimatePresence>
          {showForm && (
            <NewEntryForm
              key="form"
              onSave={handleSave}
              onCancel={() => setShowForm(false)}
            />
          )}
        </AnimatePresence>

        {/* Stats bar — shown when 3+ entries */}
        {entries.length >= 3 && (
          <StatsBar entries={entries} />
        )}

        {/* Entry list */}
        {sortedEntries.length === 0 ? (
          <EmptyJournal />
        ) : (
          <AnimatePresence>
            {sortedEntries.map((entry) => (
              <JournalCard
                key={entry.id}
                entry={entry}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

    </div>
  )
}
