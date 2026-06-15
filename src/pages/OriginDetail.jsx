import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { originsData } from '../data/originsData';
import { SEO } from '../components/ui/SEO';

// ── Process descriptions ──────────────────────────────────────────────────────
const PROCESS_INFO = {
  Washed: {
    icon: '💧',
    title: 'Washed Process',
    description:
      'The fruit pulp is removed mechanically before fermentation, leaving only the parchment around the bean. This method highlights the coffee\'s intrinsic varietal and terroir characteristics — expect clean, bright, and transparent cups with well-defined acidity.',
  },
  Natural: {
    icon: '☀️',
    title: 'Natural (Dry) Process',
    description:
      'Whole cherries are dried in the sun with the fruit intact, allowing sugars and fruit aromatics to slowly permeate the bean. The result is a fuller-bodied, more complex cup with pronounced fruit sweetness and lower perceived acidity.',
  },
  'Natural (Dry)': {
    icon: '☀️',
    title: 'Natural (Dry) Process',
    description:
      'Whole cherries are dried in the sun with the fruit intact, allowing sugars and fruit aromatics to slowly permeate the bean. The result is a fuller-bodied, more complex cup with pronounced fruit sweetness and lower perceived acidity.',
  },
  Honey: {
    icon: '🍯',
    title: 'Honey Process',
    description:
      'Part of the fruit mucilage is left on the parchment during drying — ranging from white (minimal mucilage) to black honey (maximum mucilage). The result sits between washed and natural: structured sweetness, silky body, and complexity without the wildness of a full natural.',
  },
  'Wet-Hulled': {
    icon: '🌿',
    title: 'Wet-Hulled (Giling Basah)',
    description:
      'Unique to Indonesia, the parchment is removed while the bean still carries high moisture content (20–30%), then dried again. This produces the characteristic dark green raw bean, low acidity, heavy body, and the earthy, cedar-like flavours synonymous with Sumatran coffee.',
  },
  'Wet-Hulled (Giling Basah)': {
    icon: '🌿',
    title: 'Wet-Hulled (Giling Basah)',
    description:
      'Unique to Indonesia, the parchment is removed while the bean still carries high moisture content (20–30%), then dried again. This produces the characteristic dark green raw bean, low acidity, heavy body, and the earthy, cedar-like flavours synonymous with Sumatran coffee.',
  },
  'Pulped Natural': {
    icon: '🫐',
    title: 'Pulped Natural Process',
    description:
      'The skin is removed but the sticky mucilage remains on the parchment, which is then dried without water fermentation. Popular in Brazil, this method preserves a natural sweetness and produces a full-bodied, chocolatey cup with minimal fruit fermentation character.',
  },
};

// ── Rating bar component ──────────────────────────────────────────────────────
function RatingBar({ label, value, max = 5, delay = 0 }) {
  const pct = `${(value / max) * 100}%`;
  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <span
          className="uppercase tracking-widest"
          style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '0.62rem',
            color: 'var(--color-text-muted)',
            letterSpacing: '0.16em',
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '0.7rem',
            color: 'var(--color-accent)',
          }}
        >
          {value} / {max}
        </span>
      </div>
      <div
        className="relative h-1.5 rounded-full overflow-hidden"
        style={{ background: 'var(--color-border)' }}
      >
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, var(--color-accent-border), var(--color-accent))' }}
          initial={{ width: '0%' }}
          whileInView={{ width: pct }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

// ── Stat item for the stats bar ───────────────────────────────────────────────
function StatItem({ label, value }) {
  return (
    <div className="flex flex-col items-center text-center px-6 py-4 min-w-max">
      <span
        className="uppercase tracking-widest mb-1.5"
        style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '0.55rem',
          color: 'rgba(232,223,208,0.4)',
          letterSpacing: '0.18em',
        }}
      >
        {label}
      </span>
      <span
        className="font-display font-semibold"
        style={{ fontFamily: 'Playfair Display, serif', color: 'var(--color-text)', fontSize: '0.95rem' }}
      >
        {value}
      </span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function OriginDetail() {
  const { id } = useParams();
  const origin = originsData.find((o) => o.id === id);

  // Not found state
  if (!origin) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center pt-24 text-center px-6"
        style={{ background: 'var(--color-bg)' }}
      >
        <p
          className="font-display mb-4"
          style={{
            fontFamily: 'Playfair Display, serif',
            color: 'var(--color-text)',
            fontSize: '2.5rem',
            fontWeight: 700,
          }}
        >
          Origin Not Found
        </p>
        <p className="mb-8" style={{ color: 'rgba(232,223,208,0.5)' }}>
          We couldn't locate an origin with the id "{id}".
        </p>
        <Link
          to="/origins"
          style={{
            border: '1px solid var(--color-accent-border)',
            color: 'var(--color-accent)',
            padding: '0.65rem 1.75rem',
            borderRadius: '9999px',
            fontFamily: 'Space Mono, monospace',
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}
        >
          ← Back to Origins
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24" style={{ background: 'var(--color-bg)' }}>
      <SEO title={`${origin.country} Coffee`} description={origin.description?.slice(0, 155)} image={origin.coverImage} />
      {/* ── 1. Hero ── */}
      <section className="relative w-full overflow-hidden" style={{ maxHeight: '55vh', height: '55vh' }}>
        <img
          src={origin.coverImage}
          alt={origin.country}
          className="w-full h-full object-cover"
          style={{ minHeight: '100%' }}
        />
        {/* Gradient overlays */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(13,24,16,0.92) 0%, rgba(13,24,16,0.4) 50%, rgba(13,24,16,0.15) 100%)',
          }}
        />
        {/* Country name overlay */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 px-8 pb-10 md:px-16"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        >
          <div className="max-w-6xl mx-auto">
            <p
              className="uppercase tracking-widest mb-2"
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '0.65rem',
                color: 'var(--color-accent)',
                letterSpacing: '0.2em',
              }}
            >
              {origin.region}
            </p>
            <div className="flex items-center gap-4">
              <span className="text-5xl md:text-6xl leading-none">{origin.flag}</span>
              <h1
                className="font-display leading-tight"
                style={{
                  fontFamily: 'Playfair Display, serif',
                  color: 'var(--color-text-on-dark)',
                  fontSize: 'clamp(2.5rem, 7vw, 5rem)',
                  fontWeight: 700,
                }}
              >
                {origin.country}
              </h1>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── 2. Stats bar ── */}
      <section
        className="border-y"
        style={{
          background: 'var(--color-surface)',
          borderColor: 'rgba(201,168,76,0.12)',
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex overflow-x-auto divide-x" style={{ divideColor: 'rgba(232,223,208,0.08)' }}>
            <div style={{ borderRight: '1px solid rgba(232,223,208,0.08)' }}>
              <StatItem label="Altitude" value={origin.altitude} />
            </div>
            <div style={{ borderRight: '1px solid rgba(232,223,208,0.08)' }}>
              <StatItem label="Harvest Season" value={origin.harvest} />
            </div>
            <div style={{ borderRight: '1px solid rgba(232,223,208,0.08)' }}>
              <StatItem label="Process Methods" value={origin.process.join(' · ')} />
            </div>
            <div style={{ borderRight: '1px solid rgba(232,223,208,0.08)' }}>
              <StatItem label="Varieties" value={`${origin.varieties.length} known`} />
            </div>
            <div>
              <StatItem label="Region" value={origin.region} />
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Flavour wheel section ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55 }}
        >
          <p
            className="uppercase tracking-widest mb-2"
            style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '0.62rem',
              color: 'rgba(232,223,208,0.4)',
              letterSpacing: '0.18em',
            }}
          >
            Tasting Notes
          </p>
          <h2
            className="font-display mb-8"
            style={{
              fontFamily: 'Playfair Display, serif',
              color: 'var(--color-text)',
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
              fontWeight: 700,
            }}
          >
            Flavour Profile
          </h2>

          {/* Flavour pills */}
          <div className="flex flex-wrap gap-3 mb-12">
            {origin.flavourProfile.map((note, i) => (
              <motion.span
                key={note}
                className="px-5 py-2 rounded-full"
                style={{
                  border: '1px solid var(--color-accent-border)',
                  color: 'var(--color-accent)',
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '0.72rem',
                  letterSpacing: '0.08em',
                  background: 'rgba(201,168,76,0.06)',
                }}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.07 }}
              >
                {note}
              </motion.span>
            ))}
          </div>

          {/* Rating bars */}
          <div className="max-w-md">
            <RatingBar label="Acidity" value={origin.acidity} delay={0} />
            <RatingBar label="Body" value={origin.body} delay={0.12} />
            <RatingBar label="Sweetness" value={origin.sweetness} delay={0.24} />
          </div>
        </motion.div>
      </section>

      {/* ── 4. About section ── */}
      <section
        className="border-t"
        style={{ borderColor: 'rgba(201,168,76,0.1)', background: 'var(--color-surface)' }}
      >
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55 }}
          >
            <p
              className="uppercase tracking-widest mb-4"
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '0.62rem',
                color: 'rgba(232,223,208,0.4)',
                letterSpacing: '0.18em',
              }}
            >
              The Story
            </p>
            <p
              className="mb-8 italic"
              style={{
                fontFamily: 'Playfair Display, serif',
                color: 'var(--color-text)',
                fontSize: '1.15rem',
                lineHeight: 1.8,
              }}
            >
              {origin.description}
            </p>

            {/* Fun fact callout */}
            <div
              className="rounded-xl p-5"
              style={{
                border: '1px solid rgba(201,168,76,0.3)',
                background: 'rgba(201,168,76,0.04)',
              }}
            >
              <p
                className="uppercase tracking-widest mb-2"
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '0.58rem',
                  color: 'var(--color-accent)',
                  letterSpacing: '0.2em',
                }}
              >
                Did you know?
              </p>
              <p
                style={{
                  color: 'rgba(232,223,208,0.75)',
                  fontSize: '0.92rem',
                  lineHeight: 1.75,
                }}
              >
                {origin.funFact}
              </p>
            </div>
          </motion.div>

          {/* Right column — Notable regions */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <p
              className="uppercase tracking-widest mb-6"
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '0.62rem',
                color: 'rgba(232,223,208,0.4)',
                letterSpacing: '0.18em',
              }}
            >
              Notable Growing Regions
            </p>
            <div className="flex flex-col gap-4">
              {origin.notableRegions.map((region, i) => (
                <motion.div
                  key={region}
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.08 }}
                >
                  <span
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
                    style={{
                      background: 'rgba(201,168,76,0.12)',
                      border: '1px solid rgba(201,168,76,0.3)',
                      color: 'var(--color-accent)',
                      fontFamily: 'Space Mono, monospace',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div
                    className="flex-1 pb-3 border-b"
                    style={{ borderColor: 'rgba(232,223,208,0.08)' }}
                  >
                    <p
                      className="font-display"
                      style={{
                        fontFamily: 'Playfair Display, serif',
                        color: 'var(--color-text)',
                        fontSize: '1.05rem',
                        fontWeight: 600,
                      }}
                    >
                      {region}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Varieties list */}
            <div className="mt-10">
              <p
                className="uppercase tracking-widest mb-4"
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '0.62rem',
                  color: 'rgba(232,223,208,0.4)',
                  letterSpacing: '0.18em',
                }}
              >
                Key Varieties
              </p>
              <div className="flex flex-wrap gap-2">
                {origin.varieties.map((v) => (
                  <span
                    key={v}
                    className="px-3 py-1 rounded-full text-xs"
                    style={{
                      background: 'rgba(232,223,208,0.06)',
                      border: '1px solid rgba(232,223,208,0.15)',
                      color: 'rgba(232,223,208,0.7)',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.72rem',
                    }}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 5. Process methods section ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <p
            className="uppercase tracking-widest mb-2"
            style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '0.62rem',
              color: 'rgba(232,223,208,0.4)',
              letterSpacing: '0.18em',
            }}
          >
            How It's Made
          </p>
          <h2
            className="font-display mb-10"
            style={{
              fontFamily: 'Playfair Display, serif',
              color: 'var(--color-text)',
              fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
              fontWeight: 700,
            }}
          >
            Processing Methods
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {origin.process.map((p, i) => {
              const info = PROCESS_INFO[p] || {
                icon: '☕',
                title: p,
                description:
                  'A processing method used to prepare coffee cherries for roasting, influencing the final cup profile.',
              };
              return (
                <motion.div
                  key={p}
                  className="rounded-2xl p-6"
                  style={{
                    background: 'var(--color-card)',
                    border: '1px solid rgba(80,120,60,0.2)',
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  whileHover={{
                    borderColor: 'rgba(201,168,76,0.35)',
                    boxShadow: '0 4px 20px rgba(201,168,76,0.07)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{info.icon}</span>
                    <h3
                      className="font-display font-semibold"
                      style={{
                        fontFamily: 'Playfair Display, serif',
                        color: 'var(--color-accent)',
                        fontSize: '1rem',
                      }}
                    >
                      {info.title}
                    </h3>
                  </div>
                  <p
                    style={{
                      color: 'rgba(232,223,208,0.65)',
                      fontSize: '0.875rem',
                      lineHeight: 1.75,
                    }}
                  >
                    {info.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ── 6. Back link ── */}
      <section
        className="border-t"
        style={{ borderColor: 'rgba(201,168,76,0.1)', background: 'var(--color-surface)' }}
      >
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link
            to="/origins"
            className="flex items-center gap-2 group transition-all duration-250"
            style={{
              color: 'var(--color-text-muted)',
              textDecoration: 'none',
              fontFamily: 'Space Mono, monospace',
              fontSize: '0.7rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            <motion.span
              className="inline-block"
              whileHover={{ x: -4 }}
              transition={{ duration: 0.2 }}
            >
              ←
            </motion.span>
            <span
              style={{
                borderBottom: '1px solid rgba(232,223,208,0.2)',
                paddingBottom: '1px',
                transition: 'color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-accent)';
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-text-muted)';
                e.currentTarget.style.borderColor = 'rgba(232,223,208,0.2)';
              }}
            >
              Back to Origins
            </span>
          </Link>

          {/* Next origin teaser */}
          {(() => {
            const currentIndex = originsData.findIndex((o) => o.id === id);
            const nextOrigin = originsData[(currentIndex + 1) % originsData.length];
            return (
              <Link
                to={`/origins/${nextOrigin.id}`}
                style={{ textDecoration: 'none' }}
              >
                <motion.div
                  className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{
                    border: '1px solid rgba(80,120,60,0.2)',
                    background: 'var(--color-card)',
                  }}
                  whileHover={{
                    borderColor: 'rgba(201,168,76,0.4)',
                    scale: 1.02,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-right">
                    <p
                      className="uppercase tracking-widest mb-0.5"
                      style={{
                        fontFamily: 'Space Mono, monospace',
                        fontSize: '0.55rem',
                        color: 'var(--color-text-faint)',
                        letterSpacing: '0.18em',
                      }}
                    >
                      Next Origin
                    </p>
                    <p
                      className="font-display"
                      style={{
                        fontFamily: 'Playfair Display, serif',
                        color: 'var(--color-text)',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                      }}
                    >
                      {nextOrigin.flag} {nextOrigin.country}
                    </p>
                  </div>
                  <span style={{ color: 'var(--color-accent)', fontSize: '1.1rem' }}>→</span>
                </motion.div>
              </Link>
            );
          })()}
        </div>
      </section>
    </div>
  );
}
