import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Layout } from './components/layout/Layout'
import { PageTransition } from './components/layout/PageTransition'
import { PageLoader } from './components/ui/Loader'
import Home from './pages/Home'
import Recipes from './pages/Recipes'
import BrewingGuides from './pages/BrewingGuides'
import CultureArticles from './pages/CultureArticles'
import ArticleDetail from './pages/ArticleDetail'
import RecipeDetail from './pages/RecipeDetail'
import About from './pages/About'
import BeanCatcher from './pages/BeanCatcher'
import TastingNotes from './pages/TastingNotes'
import BrewCalculator from './pages/BrewCalculator'
import Shelf from './pages/Shelf'
import BrewJournal from './pages/BrewJournal'
import Origins from './pages/Origins'
import OriginDetail from './pages/OriginDetail'
import ComparisonTool from './pages/ComparisonTool'
import SubmitRecipe from './pages/SubmitRecipe'
import Tools from './pages/Tools'
import Glossary from './pages/Glossary'
import CommunityRecipes from './pages/CommunityRecipes'

export default function App() {
  const location = useLocation()
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 1100)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <PageLoader visible={booting} />
      <Layout>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/"               element={<PageTransition><Home /></PageTransition>} />
            <Route path="/recipes"        element={<PageTransition><Recipes /></PageTransition>} />
            <Route path="/brewing-guides" element={<PageTransition><BrewingGuides /></PageTransition>} />
            <Route path="/culture"        element={<PageTransition><CultureArticles /></PageTransition>} />
            <Route path="/article/*"      element={<PageTransition><ArticleDetail /></PageTransition>} />
            <Route path="/recipe/:slug"   element={<PageTransition><RecipeDetail /></PageTransition>} />
            <Route path="/about"          element={<PageTransition><About /></PageTransition>} />
            <Route path="/play"           element={<PageTransition><BeanCatcher /></PageTransition>} />
            <Route path="/tasting"        element={<PageTransition><TastingNotes /></PageTransition>} />
            <Route path="/calculator"     element={<PageTransition><BrewCalculator /></PageTransition>} />
            <Route path="/shelf"          element={<PageTransition><Shelf /></PageTransition>} />
            <Route path="/journal"        element={<PageTransition><BrewJournal /></PageTransition>} />
            <Route path="/origins"        element={<PageTransition><Origins /></PageTransition>} />
            <Route path="/origins/:id"    element={<PageTransition><OriginDetail /></PageTransition>} />
            <Route path="/compare"        element={<PageTransition><ComparisonTool /></PageTransition>} />
            <Route path="/submit-recipe"  element={<PageTransition><SubmitRecipe /></PageTransition>} />
            <Route path="/tools"          element={<PageTransition><Tools /></PageTransition>} />
            <Route path="/glossary"       element={<PageTransition><Glossary /></PageTransition>} />
            <Route path="/community"      element={<PageTransition><CommunityRecipes /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </>
  )
}
