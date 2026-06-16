import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SEO } from "../components/ui/SEO";
import { RecipeCard } from "../components/ui/RecipeCard";
import { CategoryFilter } from "../components/ui/CategoryFilter";
import { recipes, categories } from "../data";
import { useFilter } from "../hooks/useFilter";

const recipeCategories = categories.filter((c) =>
  ["espresso", "cold-brew", "lattes", "pour-over"].includes(c.slug),
);

export default function Recipes() {
  const { filtered: categoryFiltered, active, setActive } = useFilter(recipes);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categoryFiltered;
    return categoryFiltered.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
    );
  }, [search, categoryFiltered]);

  return (
    <div className="min-h-screen pt-24">
      <SEO title="Recipes" description="Explore our collection of handcrafted coffee recipes — espresso, cold brew, lattes, pour over, and more." />
      {/* Header */}
      <section
        className="py-24 px-8 text-center relative"
        style={{ background: "var(--gradient-section)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-gold text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--color-accent)' }}>
            Brew your own Coffee
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl mt-2 mb-4" style={{ color: 'var(--color-text)' }}>
            Recipes
          </h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--color-text-muted)' }}>
            Travel the globe one cup at a time. Discover authentic coffee
            recipes from different cultures, regions, and traditions.
          </p>
        </motion.div>
      </section>

      {/* Filter + Search + Grid */}
      <div className="w-full max-w-[1600px] mx-auto px-8 sm:px-14 xl:px-20 pb-28">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <CategoryFilter
            categories={recipeCategories}
            active={active}
            onSelect={setActive}
          />
        </motion.div>

        {/* Search input */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-10 max-w-sm"
        >
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round"
              style={{ opacity: 0.55 }}
            >
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search recipes…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-10 py-3 text-sm outline-none rounded-xl"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border-strong)',
                color: 'var(--color-text)',
                fontFamily: 'Inter, sans-serif',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--color-accent)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--color-border-strong)')}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--color-text-faint)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-faint)')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={search + active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
          >
            {filtered.map((recipe, i) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <RecipeCard recipe={recipe} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col items-center justify-center py-28 text-center"
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
              stroke="var(--color-accent)" strokeWidth="1.2" strokeLinecap="round"
              style={{ opacity: 0.35, marginBottom: '1.5rem' }}
            >
              <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
              <line x1="6" y1="1" x2="6" y2="4" />
              <line x1="10" y1="1" x2="10" y2="4" />
              <line x1="14" y1="1" x2="14" y2="4" />
            </svg>
            <p className="font-display text-2xl mb-3" style={{ color: 'var(--color-text)' }}>
              No recipes found
            </p>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-faint)' }}>
              {search ? `Nothing matched "${search}"` : 'No recipes in this category yet'}
            </p>
            <button
              onClick={() => { setSearch(''); setActive('all') }}
              className="text-xs uppercase tracking-widest px-5 py-2.5 transition-all duration-200"
              style={{
                border: '1px solid var(--color-accent-border)',
                color: 'var(--color-accent)',
                fontFamily: 'Space Mono, monospace',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-accent-dim)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
