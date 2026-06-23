import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { coffeeOrigins } from "../../data/coffeeOrigins";
import { useFocusTrap } from "../../hooks/useFocusTrap";

function flagEmojiToAlpha2(emoji) {
  return [...(emoji || '')].slice(0, 2)
    .map(c => String.fromCharCode(c.codePointAt(0) - 0x1F1E6 + 65))
    .join('')
    .toLowerCase()
}

function FlagImage({ flag, name, size = "sm", accentColor, selected }) {
  const code = flagEmojiToAlpha2(flag)
  const sizes = {
    sm: { img: "w-10 h-7", w: 40 },
    md: { img: "w-14 h-10", w: 80 },
    lg: { img: "w-20 h-14", w: 160 },
  };
  const s = sizes[size];
  return (
    <img
      src={`https://flagcdn.com/w${s.w}/${code}.png`}
      srcSet={`https://flagcdn.com/w${s.w * 2}/${code}.png 2x`}
      alt={`${name} flag`}
      className={`${s.img} object-cover rounded flex-shrink-0`}
      style={{
        boxShadow: selected
          ? `0 3px 14px ${accentColor}60`
          : "0 2px 6px rgba(0,0,0,0.5)",
      }}
    />
  );
}

function CountryCard({ country, selected, onClick }) {
  const accent = country.color || "#D4A853"
  return (
    <motion.button
      onClick={() => onClick(selected ? null : country.id)}
      whileHover={{ y: -5, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      aria-pressed={selected}
      aria-label={`Explore ${country.name} coffee origins`}
      className="relative flex flex-col items-center gap-3 px-5 py-5 rounded-2xl border text-center transition-all duration-200 w-full"
      style={{
        background: selected ? `${accent}18` : "var(--color-card)",
        borderColor: selected ? accent : "var(--color-border-strong)",
        boxShadow: selected ? `0 0 24px ${accent}30` : "none",
        cursor: "pointer",
      }}
    >
      {selected && (
        <motion.div
          layoutId="selectedRing"
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ border: `2px solid ${accent}` }}
        />
      )}
      <FlagImage flag={country.flag} name={country.name} size="sm" accentColor={accent} selected={selected} />
      <span
        className="text-xs sm:text-sm font-semibold leading-snug"
        style={{ color: selected ? accent : "var(--color-text)" }}
      >
        {country.name}
      </span>
      <span
        className="text-[10px] uppercase tracking-widest"
        style={{ color: accent, opacity: 0.7 }}
      >
        {country.roast || ""}
      </span>
    </motion.button>
  );
}

function CountryModal({ country, onClose }) {
  const modalRef = useRef(null);
  useFocusTrap(modalRef, true);
  const accent = country.color || "#D4A853"

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6 md:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 cursor-pointer"
        style={{ background: "rgba(8,16,10,0.9)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Card */}
      <motion.div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${country.name} coffee origins`}
        className="relative z-10 w-full overflow-hidden flex flex-col sm:flex-row"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-strong)",
          maxWidth: "64rem",
          maxHeight: "92vh",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
        }}
        initial={{ opacity: 0, y: 48, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 32, scale: 0.96 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Left: Regions panel */}
        <div
          className="flex-shrink-0 flex flex-col sm:w-[42%]"
          style={{ borderRight: "1px solid var(--color-border)", background: "var(--color-bg)" }}
        >
          {/* Panel header */}
          <div
            className="px-6 py-4 flex items-center gap-2.5"
            style={{ borderBottom: "1px solid var(--color-border)" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span
              className="text-[9px] uppercase tracking-[0.22em]"
              style={{ color: accent, opacity: 0.7, fontFamily: "Space Mono, monospace" }}
            >
              Growing Regions
            </span>
          </div>

          {/* Large flag + quick stats */}
          <div className="flex flex-col items-center justify-center flex-1 gap-6 p-8">
            <FlagImage flag={country.flag} name={country.name} size="lg" accentColor={accent} selected />
            <div className="w-full grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg text-center" style={{ background: `${accent}10`, border: `1px solid ${accent}25` }}>
                <p className="text-[8px] uppercase tracking-[0.16em] mb-1" style={{ color: accent, fontFamily: "Space Mono, monospace" }}>Altitude</p>
                <p className="text-xs font-medium" style={{ color: "var(--color-text)" }}>{country.altitude || "—"}</p>
              </div>
              <div className="p-3 rounded-lg text-center" style={{ background: `${accent}10`, border: `1px solid ${accent}25` }}>
                <p className="text-[8px] uppercase tracking-[0.16em] mb-1" style={{ color: accent, fontFamily: "Space Mono, monospace" }}>Harvest</p>
                <p className="text-xs font-medium" style={{ color: "var(--color-text)" }}>{country.harvest || "—"}</p>
              </div>
            </div>
          </div>

          {/* Region tags */}
          <div
            className="px-5 py-4 flex flex-wrap gap-2"
            style={{ borderTop: "1px solid var(--color-border)" }}
          >
            {(country.regions || []).map((r) => (
              <span
                key={r}
                className="flex items-center gap-2 px-3 py-1.5 text-[9px] rounded"
                style={{
                  border: "1px solid var(--color-border-strong)",
                  color: "var(--color-text-muted)",
                  background: "var(--color-card)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accent }} />
                {r}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Scrollable content */}
        <div className="flex-1 overflow-y-auto flex flex-col" style={{ borderLeft: "1px solid var(--color-border)" }}>
          {/* Sticky top bar */}
          <div
            className="sticky top-0 z-10 flex items-center justify-between px-8 py-5 flex-shrink-0"
            style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)", backdropFilter: "blur(6px)" }}
          >
            <span
              className="text-[9px] uppercase tracking-[0.22em]"
              style={{ color: accent, opacity: 0.55, fontFamily: "Space Mono, monospace" }}
            >
              {country.roast || "Origin Profile"}
            </span>
            <button
              onClick={onClose}
              aria-label="Close"
              className="flex items-center gap-2 transition-opacity duration-150 opacity-45 hover:opacity-100"
              style={{ color: "var(--color-text)", fontFamily: "Space Mono, monospace", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", background: "none", border: "none", cursor: "pointer" }}
            >
              Close
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="px-8 py-9 sm:px-10 sm:py-10 flex flex-col gap-8">
            {/* Flag + country name */}
            <div>
              <div className="flex items-center gap-4 mb-1">
                <FlagImage flag={country.flag} name={country.name} size="sm" accentColor={accent} selected />
                <h2 className="font-display text-3xl sm:text-4xl leading-tight" style={{ color: "var(--color-text)" }}>
                  {country.name}
                </h2>
              </div>
              <p className="text-[9px] uppercase tracking-[0.2em] mt-2 ml-14" style={{ color: accent, opacity: 0.6, fontFamily: "Space Mono, monospace" }}>
                {(country.process || []).join(" · ")}
              </p>
            </div>

            {/* Description */}
            <div>
              <p className="text-[9px] uppercase tracking-[0.24em] mb-4" style={{ color: `${accent}80`, fontFamily: "Space Mono, monospace" }}>— About</p>
              <p className="text-sm sm:text-base leading-[2.05]" style={{ color: "var(--color-text-muted)" }}>
                {country.desc || ""}
              </p>
            </div>

            {/* Flavour profile */}
            {(country.flavor || []).length > 0 && (
              <div>
                <p className="text-[9px] uppercase tracking-[0.24em] mb-4" style={{ color: `${accent}80`, fontFamily: "Space Mono, monospace" }}>— Flavour Profile</p>
                <div className="flex flex-wrap gap-2.5">
                  {(country.flavor || []).map((f) => (
                    <span
                      key={f}
                      className="px-4 py-2 text-[10px] font-medium tracking-[0.14em] uppercase rounded"
                      style={{ border: `1px solid ${accent}40`, color: accent, background: `${accent}0C` }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function CoffeeOriginsSection() {
  const [selectedId, setSelectedId] = useState(null);
  const selectedCountry = coffeeOrigins.find((c) => c.id === selectedId);
  const triggerRef = useRef(null);

  const handleOpen = (id) => {
    if (id) triggerRef.current = document.activeElement;
    setSelectedId(id);
  };

  const handleClose = () => {
    setSelectedId(null);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 xl:px-16 py-20">
      <AnimatePresence>
        {selectedCountry && (
          <CountryModal key={selectedCountry.id} country={selectedCountry} onClose={handleClose} />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <span className="text-gold text-xs uppercase tracking-widest font-semibold">Around the World</span>
        <h2 className="font-display text-4xl md:text-5xl text-cream mt-3 mb-4 leading-tight">Coffee Origins</h2>
        <p className="text-cream/50 text-base leading-relaxed max-w-lg">
          Click a country to explore its growing regions, history, and flavour identity.
        </p>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center mt-8 text-[10px] uppercase tracking-[0.25em]"
        style={{ color: "rgba(201,168,76,0.28)", fontFamily: "Space Mono, monospace", marginBottom: "50px" }}
      >
        ✦ Click any country to explore ✦
      </motion.p>

      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
        {coffeeOrigins.map((country, i) => (
          <motion.div
            key={country.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
          >
            <CountryCard country={country} selected={selectedId === country.id} onClick={handleOpen} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
