import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { CoffeeFlavoursSection } from "../components/sections/CoffeeFlavoursSection";

const CoffeeOriginsSection = lazy(() =>
  import("../components/sections/CoffeeOriginsSection").then((m) => ({
    default: m.CoffeeOriginsSection,
  })),
);

function OriginsLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{ borderColor: "#D4A853", borderTopColor: "transparent" }}
        />
        <span className="text-cream/40 text-xs uppercase tracking-widest">
          Loading map…
        </span>
      </div>
    </div>
  );
}

export default function CultureArticles() {
  return (
    <div className="min-h-screen pt-24">
      {/* Header */}
      <section
        className="py-20 md:py-28 px-6 text-center"
        style={{
          background: "linear-gradient(180deg, #2D1B14 0%, transparent 100%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-gold text-xs uppercase tracking-widest font-semibold">
            Around the World
          </span>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-cream mt-4 mb-6 leading-tight">
            Coffee Culture
          </h1>
          <p className="text-cream/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Explore coffee origins by country — their history, growing regions,
            and flavour identity.
          </p>
        </motion.div>
      </section>

      {/* Flavours section */}
      <div style={{ borderTop: "1px solid rgba(139,94,60,0.1)" }}>
        <CoffeeFlavoursSection />
      </div>

      {/* Origins map section */}
      <Suspense fallback={<OriginsLoader />}>
        <CoffeeOriginsSection />
      </Suspense>
    </div>
  );
}
