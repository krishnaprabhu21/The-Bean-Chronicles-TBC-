import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { originsData } from '../../data/originsData';

const REGIONS = ['All', 'East Africa', 'Central America', 'South America', 'Southeast Asia', 'Middle East', 'Caribbean'];

function DotBar({ value, max = 5 }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: i < value ? 'var(--color-accent)' : 'var(--color-border)' }}
        />
      ))}
    </div>
  );
}

function OriginCard({ origin, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
      layout
    >
      <Link to={`/origins/${origin.id}`} className="block h-full">
        <motion.div
          className="h-full rounded-2xl overflow-hidden cursor-pointer flex flex-col"
          style={{ backgroundColor: 'var(--color-card)', border: '1px solid rgba(80,120,60,0.2)' }}
          whileHover={{ scale: 1.02, borderColor: 'rgba(201,168,76,0.45)', boxShadow: '0 0 24px rgba(201,168,76,0.12)' }}
          transition={{ duration: 0.25 }}
        >
          {/* Cover image */}
          <div className="relative h-44 overflow-hidden">
            <img src={origin.coverImage} alt={origin.country} className="w-full h-full object-cover" loading="lazy" />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(13,24,16,0.85) 0%, rgba(13,24,16,0.1) 60%, transparent 100%)' }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl leading-none">{origin.flag}</span>
                <span className="font-display text-cream leading-tight" style={{ fontSize: '1.2rem' }}>
                  {origin.country}
                </span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-col flex-1 p-5 gap-4">
            <p className="text-gold uppercase tracking-widest" style={{ fontSize: '0.62rem', fontFamily: 'Space Mono, monospace' }}>
              {origin.region}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {origin.flavourProfile.slice(0, 3).map((note) => (
                <span
                  key={note}
                  className="px-2.5 py-0.5 rounded-full"
                  style={{
                    background: 'rgba(201,168,76,0.1)',
                    border: '1px solid rgba(201,168,76,0.25)',
                    color: 'var(--color-accent)',
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '0.58rem',
                  }}
                >
                  {note}
                </span>
              ))}
            </div>
            <div className="mt-auto pt-3 flex flex-col gap-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--color-text-faint)', fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Acidity</span>
                <DotBar value={origin.acidity} />
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--color-text-faint)', fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Body</span>
                <DotBar value={origin.body} />
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export function OriginsEncyclopediaSection() {
  const [activeRegion, setActiveRegion] = useState('All');

  const filtered = useMemo(
    () => (activeRegion === 'All' ? originsData : originsData.filter((o) => o.region === activeRegion)),
    [activeRegion],
  );

  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 xl:px-16 py-20">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="mb-10"
      >
        <p className="label-ornate mb-5">The Origins Encyclopedia</p>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h2 className="font-display text-4xl md:text-5xl leading-tight" style={{ color: 'var(--color-text)' }}>
              Producing Countries
            </h2>
            <p className="mt-3 text-sm leading-loose" style={{ color: 'var(--color-text-muted)', maxWidth: '44ch' }}>
              Twelve countries, twelve stories. Filter by region to trace your cup back to its roots.
            </p>
          </div>
          {/* Region filter */}
          <div className="flex flex-wrap gap-2">
            {REGIONS.map((region) => {
              const active = activeRegion === region;
              return (
                <button
                  key={region}
                  onClick={() => setActiveRegion(region)}
                  className="px-3.5 py-1.5 rounded-full transition-all duration-200"
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '0.6rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    background: active ? 'var(--color-accent)' : 'rgba(201,168,76,0.08)',
                    color: active ? 'var(--color-bg)' : 'var(--color-accent)',
                    border: active ? '1px solid var(--color-accent)' : '1px solid rgba(201,168,76,0.3)',
                    fontWeight: active ? 700 : 400,
                    cursor: 'pointer',
                  }}
                >
                  {region}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Cards grid */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-20"
            style={{ color: 'var(--color-text-faint)' }}
          >
            No origins found for this region.
          </motion.p>
        ) : (
          <motion.div
            key={activeRegion}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {filtered.map((origin, i) => (
              <OriginCard key={origin.id} origin={origin} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer link to full page */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-12 flex justify-center"
      >
        <Link
          to="/origins"
          className="flex items-center gap-2.5 px-8 py-3 rounded-full transition-all duration-200 group"
          style={{
            border: '1px solid rgba(201,168,76,0.35)',
            color: 'var(--color-accent)',
            fontFamily: 'Space Mono, monospace',
            fontSize: '0.68rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201,168,76,0.08)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
        >
          Explore Full Encyclopedia
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>
      </motion.div>
    </section>
  );
}
