import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { glossaryTerms, CATEGORIES } from '../data/glossaryData';
import { SEO } from '../components/ui/SEO';

const categoryPillStyles = {
  Processing: {
    background: 'rgba(107,138,94,0.2)',
    color: '#6B8A5E',
    border: '1px solid rgba(107,138,94,0.3)',
  },
  Brewing: {
    background: 'rgba(201,168,76,0.2)',
    color: '#C9A84C',
    border: '1px solid rgba(201,168,76,0.3)',
  },
  Tasting: {
    background: 'rgba(139,94,60,0.2)',
    color: '#C9845A',
    border: '1px solid rgba(139,94,60,0.3)',
  },
  Equipment: {
    background: 'rgba(74,103,65,0.2)',
    color: '#6B8A5E',
    border: '1px solid rgba(74,103,65,0.3)',
  },
  'Bean Science': {
    background: 'rgba(92,122,82,0.2)',
    color: '#7AAA6A',
    border: '1px solid rgba(92,122,82,0.3)',
  },
  Culture: {
    background: 'rgba(122,92,56,0.2)',
    color: '#C9845A',
    border: '1px solid rgba(122,92,56,0.3)',
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
      delay: i * 0.08,
    },
  }),
};

const sectionVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 12 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
      delay: i * 0.05,
    },
  }),
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

function CategoryPill({ category }) {
  const style = categoryPillStyles[category] || {};
  return (
    <span
      style={{
        ...style,
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: '999px',
        fontSize: '0.7rem',
        fontFamily: 'Space Mono, monospace',
        letterSpacing: '0.04em',
        fontWeight: 600,
        textTransform: 'uppercase',
      }}
    >
      {category}
    </span>
  );
}

function TermCard({ term, index }) {
  return (
    <motion.div
      key={term.term}
      custom={index}
      variants={cardVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      style={{
        borderRadius: '0.75rem',
        padding: '1.25rem',
        border: '1px solid rgba(80,120,60,0.18)',
        background: 'var(--color-surface)',
        transition: 'border-color 0.2s',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
      }}
      whileHover={{
        borderColor: 'rgba(201,168,76,0.35)',
        transition: { duration: 0.15 },
      }}
    >
      <div>
        <CategoryPill category={term.category} />
      </div>
      <h3
        style={{
          fontFamily: 'Playfair Display, Georgia, serif',
          fontSize: '1.25rem',
          fontWeight: 600,
          color: 'var(--color-text)',
          margin: 0,
          lineHeight: 1.3,
        }}
      >
        {term.term}
      </h3>
      <p
        style={{
          fontSize: '0.875rem',
          color: 'rgba(232,223,208,0.65)',
          lineHeight: 1.7,
          margin: 0,
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {term.definition}
      </p>
    </motion.div>
  );
}

export default function Glossary() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = glossaryTerms.filter(
    (t) =>
      (activeCategory === 'All' || t.category === activeCategory) &&
      (t.term.toLowerCase().includes(search.toLowerCase()) ||
        t.definition.toLowerCase().includes(search.toLowerCase()))
  );

  const grouped = filtered.reduce((acc, t) => {
    const L = t.letter;
    if (!acc[L]) acc[L] = [];
    acc[L].push(t);
    return acc;
  }, {});

  const letters = Object.keys(grouped).sort();
  const allLetters = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );
  const availableLetters = new Set(letters);

  const scrollToLetter = (letter) => {
    document
      .getElementById(`letter-${letter}`)
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--color-bg)', paddingTop: '6rem' }}
    >
      <SEO title="Coffee Glossary" description="A complete A–Z dictionary of coffee terms — from extraction to varietals, processing methods, and tasting vocabulary." />
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '4rem 1.5rem 3rem',
          textAlign: 'center',
        }}
      >
        <motion.p
          custom={0}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '0.7rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
            marginBottom: '1.25rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '2rem',
              height: '1px',
              background: 'rgba(201,168,76,0.5)',
            }}
          />
          The Lexicon
          <span
            style={{
              display: 'inline-block',
              width: '2rem',
              height: '1px',
              background: 'rgba(201,168,76,0.5)',
            }}
          />
        </motion.p>

        <motion.h1
          custom={1}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: 'clamp(3rem, 8vw, 5.5rem)',
            fontWeight: 700,
            color: 'var(--color-text)',
            lineHeight: 1.08,
            margin: '0 0 1.5rem',
          }}
        >
          Coffee
          <br />
          <span style={{ color: 'var(--color-accent)' }}>Dictionary</span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '1.0625rem',
            color: 'var(--color-text-muted)',
            lineHeight: 1.75,
            maxWidth: '540px',
            margin: '0 auto',
          }}
        >
          From anaerobic processing to yield — every term a curious coffee mind
          needs to know.
        </motion.p>
      </section>

      {/* ── Sticky search + filter bar ────────────────────────────────── */}
      <div
        style={{
          position: 'sticky',
          top: '4rem',
          zIndex: 40,
          background: 'rgba(13,24,16,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(80,120,60,0.15)',
          padding: '1rem 0',
        }}
      >
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '0 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.875rem',
          }}
        >
          {/* Search input */}
          <div style={{ position: 'relative', maxWidth: '28rem' }}>
            <span
              style={{
                position: 'absolute',
                left: '0.875rem',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: 'rgba(201,168,76,0.5)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search terms or definitions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                background: 'var(--color-surface)',
                border: '1px solid rgba(80,120,60,0.3)',
                color: 'var(--color-text)',
                fontFamily: 'Inter, sans-serif',
                boxSizing: 'border-box',
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = 'rgba(201,168,76,0.45)')
              }
              onBlur={(e) =>
                (e.target.style.borderColor = 'rgba(80,120,60,0.3)')
              }
            />
          </div>

          {/* Category pills + count */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap',
            }}
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '0.3rem 0.875rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    cursor: 'pointer',
                    border: isActive
                      ? '1px solid rgba(201,168,76,0.6)'
                      : '1px solid rgba(80,120,60,0.25)',
                    background: isActive ? 'var(--color-accent)' : 'var(--color-surface)',
                    color: isActive ? 'var(--color-bg)' : 'rgba(232,223,208,0.7)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {cat}
                </button>
              );
            })}

            <span
              style={{
                marginLeft: 'auto',
                fontSize: '0.75rem',
                fontFamily: 'Space Mono, monospace',
                color: 'var(--color-text-faint)',
                whiteSpace: 'nowrap',
              }}
            >
              Showing {filtered.length} term{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* ── A–Z index bar ─────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '1.25rem 1.5rem 0',
          overflowX: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '0.25rem',
            minWidth: 'max-content',
          }}
        >
          {allLetters.map((letter) => {
            const hasTerms = availableLetters.has(letter);
            return (
              <button
                key={letter}
                onClick={() => hasTerms && scrollToLetter(letter)}
                disabled={!hasTerms}
                style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.8rem',
                  fontFamily: 'Space Mono, monospace',
                  fontWeight: 600,
                  cursor: hasTerms ? 'pointer' : 'default',
                  border: 'none',
                  background: 'transparent',
                  color: hasTerms ? 'var(--color-accent)' : 'rgba(232,223,208,0.18)',
                  opacity: hasTerms ? 1 : 0.5,
                  transition: 'background 0.15s, color 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (hasTerms) {
                    e.currentTarget.style.background = 'rgba(201,168,76,0.12)';
                    e.currentTarget.style.color = '#D4B563';
                  }
                }}
                onMouseLeave={(e) => {
                  if (hasTerms) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--color-accent)';
                  }
                }}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main glossary content ─────────────────────────────────────── */}
      <main
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '2rem 1.5rem 6rem',
        }}
      >
        <AnimatePresence mode="wait">
          {letters.length === 0 ? (
            /* ── Empty state ── */
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '5rem 1rem',
                gap: '1.25rem',
                textAlign: 'center',
              }}
            >
              <svg
                width="56"
                height="56"
                viewBox="0 0 56 56"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ opacity: 0.3 }}
              >
                <ellipse
                  cx="28"
                  cy="34"
                  rx="16"
                  ry="10"
                  stroke="#C9A84C"
                  strokeWidth="2"
                />
                <path
                  d="M44 34c3 0 6-2 6-5s-3-5-6-5"
                  stroke="#C9A84C"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <rect
                  x="14"
                  y="44"
                  width="28"
                  height="3"
                  rx="1.5"
                  fill="#C9A84C"
                  opacity="0.5"
                />
                <path
                  d="M22 24c0-4 4-8 6-12"
                  stroke="#C9A84C"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M28 22c0-3 2-6 2-9"
                  stroke="#C9A84C"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M34 24c0-4-3-7-4-11"
                  stroke="#C9A84C"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <div>
                <p
                  style={{
                    fontFamily: 'Playfair Display, Georgia, serif',
                    fontSize: '1.375rem',
                    color: 'rgba(232,223,208,0.5)',
                    margin: '0 0 0.5rem',
                  }}
                >
                  No terms found
                </p>
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.875rem',
                    color: 'rgba(232,223,208,0.3)',
                    margin: 0,
                  }}
                >
                  Try a different keyword or{' '}
                  <button
                    onClick={() => {
                      setSearch('');
                      setActiveCategory('All');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-accent)',
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.875rem',
                      textDecoration: 'underline',
                      padding: 0,
                    }}
                  >
                    clear the search
                  </button>
                  .
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}
            >
              {letters.map((letter) => (
                <motion.div
                  key={letter}
                  id={`letter-${letter}`}
                  data-letter={letter}
                  variants={sectionVariant}
                >
                  {/* Letter header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.25rem',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Playfair Display, Georgia, serif',
                        fontSize: '4.5rem',
                        fontWeight: 700,
                        color: 'var(--color-accent)',
                        lineHeight: 1,
                        flexShrink: 0,
                      }}
                    >
                      {letter}
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: '1px',
                        background:
                          'linear-gradient(to right, rgba(201,168,76,0.35), rgba(201,168,76,0))',
                      }}
                    />
                    <span
                      style={{
                        fontFamily: 'Space Mono, monospace',
                        fontSize: '0.65rem',
                        color: 'rgba(201,168,76,0.4)',
                        letterSpacing: '0.1em',
                        flexShrink: 0,
                      }}
                    >
                      {grouped[letter].length}{' '}
                      {grouped[letter].length === 1 ? 'term' : 'terms'}
                    </span>
                  </div>

                  {/* Cards grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fill, minmax(340px, 1fr))',
                      gap: '1rem',
                    }}
                  >
                    <AnimatePresence>
                      {grouped[letter].map((term, i) => (
                        <TermCard key={term.term} term={term} index={i} />
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
