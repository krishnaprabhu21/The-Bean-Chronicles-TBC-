import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { coffeeOrigins } from "../../data/coffeeOrigins";
import { useFocusTrap } from "../../hooks/useFocusTrap";


function FlagImage({ countryCode, name, size = "md", accentColor, selected }) {
  const sizes = {
    sm: { img: "w-10 h-7", w: 40 },
    md: { img: "w-14 h-[38px]", w: 80 },
    lg: { img: "w-20 h-14", w: 160 },
  };
  const s = sizes[size];
  return (
    <img
      src={`https://flagcdn.com/w${s.w}/${countryCode}.png`}
      srcSet={`https://flagcdn.com/w${s.w * 2}/${countryCode}.png 2x`}
      alt={`${name} flag`}
      className={`${s.img} object-cover rounded shadow-md flex-shrink-0`}
      style={{
        boxShadow: selected
          ? `0 3px 14px ${accentColor}60`
          : "0 2px 6px rgba(0,0,0,0.5)",
      }}
    />
  );
}

function CountryCard({ country, selected, onClick }) {
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
        background: selected ? "rgba(212,168,83,0.12)" : "var(--color-card)",
        borderColor: selected ? "#D4A853" : "var(--color-border-strong)",
        boxShadow: selected ? "0 0 24px rgba(212,168,83,0.22)" : "none",
        cursor: "pointer",
      }}
    >
      {selected && (
        <motion.div
          layoutId="selectedRing"
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ border: "2px solid #D4A853" }}
        />
      )}
      <FlagImage
        countryCode={country.countryCode}
        name={country.name}
        size="sm"
        accentColor={country.accentColor}
        selected={selected}
      />
      <span
        className="text-xs sm:text-sm font-semibold leading-snug"
        style={{ color: selected ? "var(--color-accent)" : "var(--color-text)" }}
      >
        {country.name}
      </span>
      <span
        className="text-[10px] uppercase tracking-widest"
        style={{ color: "var(--color-accent)" }}
      >
        {country.continent}
      </span>
    </motion.button>
  );
}

function CoffeeMap({ country }) {
  return (
    <div style={{ height: "100%", width: "100%", borderRadius: "14px", overflow: "hidden" }}>
      <MapContainer
        key={country.id}
        center={[country.mapCenter[0], country.mapCenter[1]]}
        zoom={country.mapZoom}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
        keyboard={false}
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {country.regions.map((region) => (
          <CircleMarker
            key={region.name}
            center={[region.lat, region.lng]}
            radius={9}
            pathOptions={{
              fillColor: country.accentColor || "#D4A853",
              fillOpacity: 1,
              color: "#fff",
              weight: 2.5,
            }}
          >
            <Popup>
              <div style={{ fontFamily: "Inter, sans-serif", padding: "4px 2px" }}>
                <p style={{ fontWeight: 700, color: "#1A0F0A", fontSize: "14px", margin: "0 0 3px" }}>
                  {region.name}
                </p>
                <p style={{ color: "#8B5E3C", fontSize: "11px", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {country.name}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}

function CountryModal({ country, onClose }) {
  const modalRef = useRef(null);
  useFocusTrap(modalRef, true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
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
        style={{
          background: "rgba(8,16,10,0.9)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
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
        {/* ── Left: Map panel ──────────────────────────────────── */}
        <div
          className="flex-shrink-0 flex flex-col sm:w-[52%] relative"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          {/* Map label */}
          <div
            className="px-6 py-4 flex items-center gap-2.5 flex-shrink-0"
            style={{
              borderBottom: "1px solid var(--color-border)",
              background: "var(--color-bg)",
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span
              className="text-[9px] uppercase tracking-[0.22em]"
              style={{
                color: "var(--color-accent)",
                opacity: 0.6,
                fontFamily: "Space Mono, monospace",
              }}
            >
              Growing Regions
            </span>
          </div>

          {/* Map */}
          <div
            className="flex-1 min-h-[280px] sm:min-h-0"
            style={{ height: "100%" }}
          >
            <CoffeeMap country={country} />
          </div>

          {/* Region legend strip */}
          <div
            className="px-5 py-4 flex flex-wrap gap-2 flex-shrink-0"
            style={{
              borderTop: "1px solid var(--color-border)",
              background: "var(--color-bg)",
            }}
          >
            {country.regions.map((r) => (
              <span
                key={r.name}
                className="flex items-center gap-2 px-3 py-1.5 text-[9px]"
                style={{
                  border: "1px solid var(--color-border-strong)",
                  color: "var(--color-text-muted)",
                  background: "var(--color-card)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: country.accentColor }}
                />
                {r.name}
              </span>
            ))}
          </div>
        </div>

        {/* ── Right: Scrollable content ─────────────────────────── */}
        <div
          className="flex-1 overflow-y-auto flex flex-col"
          style={{ borderLeft: "1px solid var(--color-border)" }}
        >
          {/* Sticky top bar */}
          <div
            className="sticky top-0 z-10 flex items-center justify-between px-8 py-5 flex-shrink-0"
            style={{
              background: "var(--color-surface)",
              borderBottom: "1px solid var(--color-border)",
              backdropFilter: "blur(6px)",
            }}
          >
            <span
              className="text-[9px] uppercase tracking-[0.22em]"
              style={{
                color: "var(--color-accent)",
                opacity: 0.55,
                fontFamily: "Space Mono, monospace",
              }}
            >
              {country.continent}
            </span>
            <button
              onClick={onClose}
              aria-label="Close"
              className="flex items-center gap-2 transition-opacity duration-150 opacity-45 hover:opacity-100"
              style={{
                color: "var(--color-text)",
                fontFamily: "Space Mono, monospace",
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Close
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="px-8 py-9 sm:px-10 sm:py-10 flex flex-col">
            {/* Flag + country name */}
            <div className="flex items-center gap-4 mb-2">
              <FlagImage
                countryCode={country.countryCode}
                name={country.name}
                size="sm"
                accentColor={country.accentColor}
                selected
              />
              <h2
                className="font-display text-3xl sm:text-4xl leading-tight"
                style={{ color: "var(--color-text)" }}
              >
                {country.name}
              </h2>
            </div>
            <p
              className="font-elegant italic text-base sm:text-lg mb-9 ml-[3.5rem]"
              style={{ color: "var(--color-text-muted)" }}
            >
              {country.name} Coffee Origins
            </p>

            {/* Stats row */}
            <div
              className="grid grid-cols-2 gap-6 py-6 mb-9"
              style={{
                borderTop: "1px solid var(--color-border)",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              <div>
                <p
                  className="text-[9px] uppercase tracking-[0.2em] mb-2"
                  style={{
                    color: "var(--color-text-faint)",
                    fontFamily: "Space Mono, monospace",
                  }}
                >
                  Elevation
                </p>
                <p
                  className="text-sm font-medium"
                  style={{ color: country.accentColor }}
                >
                  {country.elevation}
                </p>
              </div>
              <div>
                <p
                  className="text-[9px] uppercase tracking-[0.2em] mb-2"
                  style={{
                    color: "var(--color-text-faint)",
                    fontFamily: "Space Mono, monospace",
                  }}
                >
                  Annual Output
                </p>
                <p
                  className="text-sm font-medium"
                  style={{ color: country.accentColor }}
                >
                  {country.annualProduction}
                </p>
              </div>
            </div>

            {/* History */}
            <div className="mb-9">
              <p
                className="text-[9px] uppercase tracking-[0.24em] mb-5"
                style={{
                  color: "rgba(201,168,76,0.5)",
                  fontFamily: "Space Mono, monospace",
                }}
              >
                — History
              </p>
              <p
                className="text-sm sm:text-base leading-[2.05]"
                style={{ color: "var(--color-text-muted)" }}
              >
                {country.history}
              </p>
            </div>

            {/* Global standing */}
            {country.globalStanding && (
              <div className="mb-9">
                <p
                  className="text-[9px] uppercase tracking-[0.24em] mb-5"
                  style={{
                    color: "rgba(201,168,76,0.5)",
                    fontFamily: "Space Mono, monospace",
                  }}
                >
                  — Global Standing
                </p>
                <p
                  className="text-sm sm:text-base leading-[2.05]"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {country.globalStanding}
                </p>
              </div>
            )}

            {/* Flavour profile */}
            <div className="pb-4">
              <p
                className="text-[9px] uppercase tracking-[0.24em] mb-5"
                style={{
                  color: "rgba(201,168,76,0.5)",
                  fontFamily: "Space Mono, monospace",
                }}
              >
                — Flavour Profile
              </p>
              <div className="flex flex-wrap gap-2.5">
                {country.flavorProfile.map((f) => (
                  <span
                    key={f}
                    className="px-4 py-2 text-[10px] font-medium tracking-[0.14em] uppercase"
                    style={{
                      border: `1px solid ${country.accentColor}40`,
                      color: country.accentColor,
                      background: `${country.accentColor}0C`,
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
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
        {/* Modal overlay */}
        <AnimatePresence>
          {selectedCountry && (
            <CountryModal
              key={selectedCountry.id}
              country={selectedCountry}
              onClose={handleClose}
            />
          )}
        </AnimatePresence>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="text-gold text-xs uppercase tracking-widest font-semibold">
            Around the World
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-cream mt-3 mb-4 leading-tight">
            Coffee Origins
          </h2>
          <p className="text-cream/50 text-base leading-relaxed max-w-lg">
            Click a country to explore its growing regions, history, and flavour
            identity.
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-8 text-[10px] uppercase tracking-[0.25em]"
          style={{
            color: "rgba(201,168,76,0.28)",
            fontFamily: "Space Mono, monospace",
            marginBottom: "50px",
          }}
        >
          ✦ Click any country to explore ✦
        </motion.p>

        {/* Country card grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
          {coffeeOrigins.map((country, i) => (
            <motion.div
              key={country.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              <CountryCard
                country={country}
                selected={selectedId === country.id}
                onClick={handleOpen}
              />
            </motion.div>
          ))}
        </div>
      </section>
  );
}
