import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { originsData } from '../data/originsData';
import { SEO } from '../components/ui/SEO';

const REGIONS = [
  'All',
  'East Africa',
  'Central America',
  'South America',
  'Southeast Asia',
  'Middle East',
  'Caribbean',
];

// ----- Dot-bar rating component -----
function DotBar({ value, max = 5 }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor: i < value ? 'var(--color-accent)' : 'rgba(232,223,208,0.15)',
          }}
        />
      ))}
    </div>
  );
}

// ----- Individual country card -----
function OriginCard({ origin, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 28 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: 'easeOut' }}
      layout
    >
      <Link to={`/origins/${origin.id}`} className="block h-full">
        <motion.div
          className="h-full rounded-2xl overflow-hidden cursor-pointer flex flex-col"
          style={{
            backgroundColor: 'var(--color-card)',
            border: '1px solid rgba(80,120,60,0.2)',
          }}
          whileHover={{
            scale: 1.02,
            borderColor: 'rgba(201,168,76,0.45)',
            boxShadow: '0 0 24px rgba(201,168,76,0.12)',
          }}
          transition={{ duration: 0.25 }}
        >
          {/* Cover image */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={origin.coverImage}
              alt={origin.country}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(13,24,16,0.85) 0%, rgba(13,24,16,0.1) 60%, transparent 100%)',
              }}
            />
            {/* Flag + country name overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl leading-none">{origin.flag}</span>
                <span
                  className="font-display text-cream leading-tight"
                  style={{ fontSize: '1.3rem', fontFamily: 'Playfair Display, serif' }}
                >
                  {origin.country}
                </span>
              </div>
            </div>
          </div>

          {/* Card body */}
          <div className="flex flex-col flex-1 p-5 gap-4">
            {/* Region label */}
            <p
              className="text-gold uppercase tracking-widest"
              style={{ fontSize: '0.65rem', fontFamily: 'Space Mono, monospace' }}
            >
              {origin.region}
            </p>

            {/* Flavour pills */}
            <div className="flex flex-wrap gap-1.5">
              {origin.flavourProfile.slice(0, 3).map((note) => (
                <span
                  key={note}
                  className="px-2.5 py-0.5 rounded-full text-xs"
                  style={{
                    background: 'rgba(201,168,76,0.1)',
                    border: '1px solid rgba(201,168,76,0.25)',
                    color: 'var(--color-accent)',
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '0.6rem',
                  }}
                >
                  {note}
                </span>
              ))}
            </div>

            {/* Acidity / Body stats */}
            <div className="mt-auto pt-2 flex flex-col gap-2 border-t" style={{ borderColor: 'rgba(232,223,208,0.08)' }}>
              <div className="flex items-center justify-between">
                <span
                  className="text-xs uppercase tracking-wider"
                  style={{ color: 'rgba(232,223,208,0.45)', fontFamily: 'Space Mono, monospace', fontSize: '0.6rem' }}
                >
                  Acidity
                </span>
                <DotBar value={origin.acidity} />
              </div>
              <div className="flex items-center justify-between">
                <span
                  className="text-xs uppercase tracking-wider"
                  style={{ color: 'rgba(232,223,208,0.45)', fontFamily: 'Space Mono, monospace', fontSize: '0.6rem' }}
                >
                  Body
                </span>
                <DotBar value={origin.body} />
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

// ----- Main page -----
export default function Origins() {
  const [activeRegion, setActiveRegion] = useState('All');

  const filtered = useMemo(() => {
    if (activeRegion === 'All') return originsData;
    return originsData.filter((o) => o.region === activeRegion);
  }, [activeRegion]);

  return (
    <div className="min-h-screen pt-24" style={{ background: 'var(--color-bg)' }}>
      <SEO title="Coffee Origins" description="Explore 12 coffee-producing countries — their regions, flavour profiles, altitude, and the stories behind each cup." />
      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-16">
        <motion.p
          className="label-ornate text-gold uppercase tracking-widest mb-4"
          style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.2em' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Around the Globe
        </motion.p>

        <div className="overflow-hidden">
          <motion.h1
            className="font-display"
            style={{
              fontFamily: 'Playfair Display, serif',
              color: 'var(--color-text)',
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              lineHeight: 1.05,
              fontWeight: 700,
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: 'easeOut' }}
          >
            Coffee
            <br />
            <span style={{ color: 'var(--color-accent)' }}>Origins</span>
          </motion.h1>
        </div>

        <motion.p
          className="mt-6 max-w-xl"
          style={{ color: 'rgba(232,223,208,0.65)', fontSize: '1.05rem', lineHeight: 1.7 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.25 }}
        >
          Trace your cup back to its roots — twelve countries, twelve stories, one shared obsession.
        </motion.p>
      </section>

      {/* ── Region filter pills ── */}
      <section className="max-w-6xl mx-auto px-6 pb-10">
        <motion.div
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.35 }}
        >
          {REGIONS.map((region) => {
            const active = activeRegion === region;
            return (
              <button
                key={region}
                onClick={() => setActiveRegion(region)}
                className="px-4 py-1.5 rounded-full text-xs uppercase tracking-wider transition-all duration-250 cursor-pointer"
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '0.65rem',
                  letterSpacing: '0.12em',
                  background: active ? 'var(--color-accent)' : 'rgba(201,168,76,0.08)',
                  color: active ? 'var(--color-bg)' : 'var(--color-accent)',
                  border: active ? '1px solid var(--color-accent)' : '1px solid rgba(201,168,76,0.3)',
                  fontWeight: active ? 700 : 400,
                }}
              >
                {region}
              </button>
            );
          })}
        </motion.div>
      </section>

      {/* ── Cards grid ── */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ color: 'rgba(232,223,208,0.45)', fontSize: '1rem' }}
              className="text-center py-20"
            >
              No origins found for this region.
            </motion.p>
          ) : (
            <motion.div
              key={activeRegion}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
            >
              {filtered.map((origin, i) => (
                <OriginCard key={origin.id} origin={origin} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── Bottom CTA ── */}
      <section
        className="border-t"
        style={{ borderColor: 'rgba(201,168,76,0.12)', background: 'var(--color-surface)' }}
      >
        <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2
              className="font-display mb-3"
              style={{
                fontFamily: 'Playfair Display, serif',
                color: 'var(--color-text)',
                fontSize: '1.6rem',
                fontWeight: 700,
              }}
            >
              Can't find your origin?
            </h2>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: '40ch', lineHeight: 1.7 }}>
              The world's coffee belt spans 60+ countries between the Tropics of Cancer and
              Capricorn. We're cataloguing new origins every season — check back soon.
            </p>
          </div>
          <Link
            to="/journal"
            className="btn-outline whitespace-nowrap"
            style={{
              border: '1px solid var(--color-accent-border)',
              color: 'var(--color-accent)',
              padding: '0.75rem 2rem',
              borderRadius: '9999px',
              fontFamily: 'Space Mono, monospace',
              fontSize: '0.7rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'all 0.25s',
            }}
          >
            Explore the Journal
          </Link>
        </div>
      </section>
    </div>
  );
}
