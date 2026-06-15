import { motion } from "framer-motion";
import { RecipeCard } from "../components/ui/RecipeCard";
import { CategoryFilter } from "../components/ui/CategoryFilter";
import { recipes, categories } from "../data";
import { useFilter } from "../hooks/useFilter";

const recipeCategories = categories.filter((c) =>
  ["espresso", "cold-brew", "lattes", "pour-over"].includes(c.slug),
);

export default function Recipes() {
  const { filtered, active, setActive } = useFilter(recipes);

  return (
    <div className="min-h-screen pt-24">
      {/* Header */}
      <section
        className="py-24 px-8 text-center relative"
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
            Brew your own Coffee
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-cream mt-2 mb-4">
            Recipes
          </h1>
          <p className="text-cream/60 text-lg max-w-xl mx-auto">
            Travel the globe one cup at a time. Discover authentic coffee
            recipes from different cultures, regions, and traditions—from
            Italy's rich espresso classics and Turkey's centuries-old brewing
            methods to Vietnam's sweet iced coffee and Ethiopia's ceremonial
            brews. Each recipe includes ingredients, preparation steps, brewing
            tips, and the story behind the drink, helping you recreate iconic
            coffee experiences from around the world in your own kitchen.
          </p>
        </motion.div>
      </section>

      {/* Filter + Grid */}
      <div className="w-full max-w-[1600px] mx-auto px-8 sm:px-14 xl:px-20 pb-28">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <CategoryFilter
            categories={recipeCategories}
            active={active}
            onSelect={setActive}
          />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((recipe, i) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.45 }}
            >
              <RecipeCard recipe={recipe} />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-cream/30">
            <p className="font-display text-2xl">No recipes found</p>
          </div>
        )}
      </div>
    </div>
  );
}
