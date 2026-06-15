import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { CoffeeFlavoursSection } from "../components/sections/CoffeeFlavoursSection";
import { OriginsEncyclopediaSection } from "../components/sections/OriginsEncyclopediaSection";
import { ArticleCard, ArticleCardSkeleton } from "../components/ui/ArticleCard";
import { useGuardianArticles } from "../hooks/useGuardianArticles";
import { Loader } from "../components/ui/Loader";

const CoffeeOriginsSection = lazy(() =>
  import("../components/sections/CoffeeOriginsSection").then((m) => ({
    default: m.CoffeeOriginsSection,
  })),
);

function OriginsLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader size={60} label="Loading map…" />
    </div>
  );
}

export default function CultureArticles() {
  const { articles, loading, error } = useGuardianArticles({ pageSize: 12 })

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

      {/* Origins encyclopedia — filterable country cards */}
      <div style={{ borderTop: "1px solid rgba(139,94,60,0.1)" }}>
        <OriginsEncyclopediaSection />
      </div>

      {/* Live articles from The Guardian */}
      <section className="w-full max-w-[1600px] mx-auto px-8 sm:px-14 xl:px-20 py-16 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="label-ornate mb-5">Real-Time Coffee Journalism</p>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <h2 className="font-display text-4xl md:text-5xl text-parchment leading-tight">
              Latest Articles
            </h2>
            <span
              className="text-[10px] uppercase tracking-[0.2em] flex items-center gap-2"
              style={{ color: 'rgba(201,168,76,0.5)', fontFamily: 'Space Mono, monospace' }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: '#C9A84C' }}
              />
              Live via The Guardian
            </span>
          </div>
        </motion.div>

        {error ? (
          <p className="text-cream/40 text-sm py-12 text-center">Could not load articles. Check your connection.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <ArticleCardSkeleton key={i} />)
              : articles.map((article, i) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                  >
                    <ArticleCard article={article} />
                  </motion.div>
                ))}
          </div>
        )}
      </section>
    </div>
  );
}
