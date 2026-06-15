import { useState } from 'react'
import { motion } from 'framer-motion'

export function NewsletterCTA() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative overflow-hidden my-16"
      style={{ background: 'linear-gradient(135deg, #1C2B14 0%, #0D1810 50%, #1E3020 100%)', border: '1px solid rgba(80,120,60,0.25)' }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #C9A84C 1px, transparent 0)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Ornament top */}
      <div className="ornament-divider px-10 pt-8">✦</div>

      <div className="relative z-10 px-8 py-10 pb-14 text-center max-w-xl mx-auto">
        <p className="label-ornate justify-center mb-6">Field Notes</p>
        <h2 className="font-display text-3xl md:text-4xl text-parchment mb-4 leading-tight">
          Stay in the Loop
        </h2>
        <p className="text-parchment/50 mb-10 leading-loose text-sm">
          Weekly dispatches on origin stories, brewing science, and the pursuit of the perfect cup.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 px-5 py-3.5 text-parchment placeholder-parchment/25 focus:outline-none text-sm bg-transparent"
              style={{ border: '1px solid rgba(201,168,76,0.3)', borderRight: 'none' }}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(201,168,76,0.65)')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(201,168,76,0.3)')}
            />
            <button
              type="submit"
              className="px-7 py-3.5 text-[10px] font-semibold uppercase tracking-[0.2em] transition-all duration-200"
              style={{ background: 'var(--color-accent)', color: 'var(--color-bg)', border: '1px solid var(--color-accent)', fontFamily: 'Inter, sans-serif' }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Subscribe
            </button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-display text-xl italic"
            style={{ color: 'var(--color-accent)' }}
          >
            Welcome to the field notes. ✦
          </motion.div>
        )}
        <p className="text-parchment/25 text-[10px] mt-5 uppercase tracking-[0.15em]">No spam. Unsubscribe any time.</p>
      </div>
    </motion.section>
  )
}
