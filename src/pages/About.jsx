import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { AuthorBio } from "../components/ui/AuthorBio";
import { authors } from "../data";
import missionImg from "../assets/images/1000089029.jpg";

const ROAST_OPTIONS = [
  { value: 'light',    label: 'Light Roast',  emoji: '☀️', desc: 'Just a quick question' },
  { value: 'medium',   label: 'Medium Roast', emoji: '☕', desc: 'A proper conversation' },
  { value: 'dark',     label: 'Dark Roast',   emoji: '🖤', desc: 'Something serious' },
  { value: 'espresso', label: 'Espresso Shot', emoji: '⚡', desc: 'Urgent — need it now' },
]

function ContactForm() {
  const [roast, setRoast] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [brewing, setBrewing] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!roast || !name || !email || !message) return
    setBrewing(true)
    setTimeout(() => {
      setBrewing(false)
      setSubmitted(true)
    }, 1800)
  }

  const inputStyle = {
    background: '#0D1810',
    border: '1px solid rgba(80,120,60,0.25)',
    color: '#E8DFD0',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    borderRadius: '12px',
    padding: '14px 16px',
    transition: 'border-color 0.2s',
  }

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center justify-center text-center py-16 gap-6"
        >
          {/* Animated steam cup */}
          <div className="relative">
            <svg width="72" height="72" viewBox="0 0 64 64" fill="none">
              <motion.path d="M16 8 Q18 4 16 1" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round"
                animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0 }} />
              <motion.path d="M32 8 Q34 4 32 1" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round"
                animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.3 }} />
              <motion.path d="M48 8 Q50 4 48 1" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round"
                animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.6 }} />
              <rect x="8" y="14" width="48" height="36" rx="6" fill="#1C2B14" stroke="#C9A84C" strokeWidth="1.5" />
              <path d="M56 24 Q66 24 66 32 Q66 40 56 40" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <ellipse cx="32" cy="50" rx="22" ry="4" fill="#1C2B14" stroke="#C9A84C" strokeWidth="1" />
              <circle cx="28" cy="31" r="3.5" fill="#C9A84C" opacity="0.7" />
              <circle cx="36" cy="31" r="3.5" fill="#C9A84C" opacity="0.7" />
              <path d="M26 37 Q29 40 32 40 Q35 40 38 37" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </svg>
          </div>
          <div>
            <h3 className="font-display text-2xl mb-2" style={{ color: '#C9A84C' }}>Message Brewed!</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(232,223,208,0.55)', maxWidth: '28ch', margin: '0 auto' }}>
              Your message is steeping nicely. We'll get back to you before your cup goes cold.
            </p>
          </div>
          <button
            onClick={() => { setSubmitted(false); setName(''); setEmail(''); setMessage(''); setRoast('') }}
            className="text-[10px] uppercase tracking-[0.18em] transition-colors duration-200"
            style={{ color: 'rgba(201,168,76,0.45)', fontFamily: 'Space Mono, monospace', background: 'none', border: 'none', cursor: 'pointer' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#C9A84C' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(201,168,76,0.45)' }}
          >
            Send another ↩
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="flex flex-col gap-7"
        >
          {/* Roast picker */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] mb-3" style={{ color: 'rgba(201,168,76,0.6)', fontFamily: 'Space Mono, monospace' }}>
              What kind of message is this? *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {ROAST_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRoast(opt.value)}
                  className="flex flex-col items-center gap-2 py-4 px-3 rounded-2xl transition-all duration-200 text-center"
                  style={{
                    background: roast === opt.value ? 'rgba(201,168,76,0.1)' : '#0D1810',
                    border: `1px solid ${roast === opt.value ? 'rgba(201,168,76,0.55)' : 'rgba(80,120,60,0.2)'}`,
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: '22px', lineHeight: 1 }}>{opt.emoji}</span>
                  <span className="font-display text-xs leading-snug" style={{ color: roast === opt.value ? '#C9A84C' : 'rgba(232,223,208,0.55)' }}>
                    {opt.label}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider" style={{ color: 'rgba(232,223,208,0.3)', fontFamily: 'Space Mono, monospace' }}>
                    {opt.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Name + email row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-[0.2em]" style={{ color: 'rgba(201,168,76,0.6)', fontFamily: 'Space Mono, monospace' }}>
                Your name *
              </label>
              <input
                type="text"
                placeholder="Barista Bob"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(201,168,76,0.5)' }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(80,120,60,0.25)' }}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-[0.2em]" style={{ color: 'rgba(201,168,76,0.6)', fontFamily: 'Space Mono, monospace' }}>
                Email *
              </label>
              <input
                type="email"
                placeholder="bob@the.cafe"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(201,168,76,0.5)' }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(80,120,60,0.25)' }}
                required
              />
            </div>
          </div>

          {/* Message */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-[0.2em]" style={{ color: 'rgba(201,168,76,0.6)', fontFamily: 'Space Mono, monospace' }}>
              Pour your thoughts *
            </label>
            <textarea
              placeholder="Tell us anything — a recipe you love, a brew tip, a collaboration idea, or just a coffee rant..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(201,168,76,0.5)' }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(80,120,60,0.25)' }}
              required
            />
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={brewing}
            whileHover={!brewing ? { scale: 1.015 } : {}}
            whileTap={!brewing ? { scale: 0.98 } : {}}
            className="self-start flex items-center gap-3 px-8 py-4 rounded-full font-medium uppercase tracking-[0.18em] transition-opacity duration-200"
            style={{
              background: brewing ? 'rgba(201,168,76,0.4)' : '#C9A84C',
              color: '#0D1810',
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              cursor: brewing ? 'not-allowed' : 'pointer',
              border: 'none',
            }}
          >
            {brewing ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
                  style={{ display: 'inline-block' }}
                >
                  ☕
                </motion.span>
                Brewing your message…
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                Send it over the counter
              </>
            )}
          </motion.button>
        </motion.form>
      )}
    </AnimatePresence>
  )
}

const values = [
  { icon: "☕", title: "Value Title", desc: "Value description goes here." },
  { icon: "🌍", title: "Value Title", desc: "Value description goes here." },
  { icon: "📖", title: "Value Title", desc: "Value description goes here." },
  { icon: "🤝", title: "Value Title", desc: "Value description goes here." },
];

export default function About() {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section
        className="py-20 px-6 text-center relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #2D1B14 0%, transparent 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #D4A853 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <span className="text-gold text-xs uppercase tracking-widest font-semibold">
            Our Story
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl text-cream mt-3 mb-6 leading-tight">
            The Bean Chronicles
          </h1>
        </motion.div>
      </section>

      {/* Mission */}
      <section className="max-w-8xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <img
              src={missionImg}
              alt="Mission image"
              className="rounded-3xl w-full object-cover aspect-[4/3] md:aspect-auto"
              style={{ height: "auto", maxHeight: "420px" }}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-gold text-xs uppercase tracking-widest font-semibold">
              Explore. Brew. Discover. Repeat.
            </span>
            <h2 className="font-display text-4xl text-cream mt-2 mb-6">
              Because every great conversation starts with coffee.
            </h2>
            <p className="text-cream/65 leading-relaxed mb-4">
              Ever wondered where your coffee comes from, why different beans
              taste different, or whether that fancy brewing gadget is actually
              worth it? So did I.
            </p>
            <br />
            <p className="text-cream/65 leading-relaxed mb-4">
              This little corner of the internet is dedicated to exploring
              everything coffee—from brands and brewing guides to equipment,
              origins, recipes, and coffee stories. Grab your favorite cup and
              join the journey.
            </p>
            <br />
            <p className="text-cream/65 leading-relaxed mb-4">
              What started as a love for coffee slowly turned into endless
              curiosity about beans, brews, equipment, cafés, origins, and
              everything in between. Instead of keeping that curiosity to
              myself, I decided to build a place where coffee lovers can explore
              it all together. Whether you're searching for your next favorite
              coffee, learning a new brewing method, comparing equipment, or
              simply enjoying a coffee-filled read, this space is for anyone who
              believes life is a little better with a cup of coffee in hand. ☕
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="w-full max-w-[1600px] mx-auto px-8 sm:px-14 xl:px-20 py-16 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span
            className="inline-block text-[10px] uppercase tracking-[0.22em] font-medium mb-4"
            style={{ color: '#C9A84C', fontFamily: 'Space Mono, monospace' }}
          >
            The People Behind the Brew
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-cream mt-1">
            Meet the Team
          </h2>
        </motion.div>
        <div className="flex flex-wrap justify-center gap-6">
          {authors.map((author, i) => (
            <motion.div
              key={author.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="w-full max-w-lg"
            >
              <AuthorBio author={author} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="w-full max-w-[1600px] mx-auto px-8 sm:px-14 xl:px-20 py-16 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span
            className="inline-block text-[10px] uppercase tracking-[0.22em] font-medium mb-4"
            style={{ color: '#C9A84C', fontFamily: 'Space Mono, monospace' }}
          >
            Drop us a line
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-cream mt-1">
            Let's Talk Coffee
          </h2>
        </motion.div>
        <div
          className="max-w-2xl mx-auto rounded-3xl p-8 sm:p-10"
          style={{ background: '#1C2B14', border: '1px solid rgba(80,120,60,0.2)' }}
        >
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
