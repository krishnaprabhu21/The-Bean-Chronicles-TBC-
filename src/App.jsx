import { lazy, Suspense, useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Layout } from './components/layout/Layout'
import { PageTransition } from './components/layout/PageTransition'
import { PageLoader } from './components/ui/Loader'
import { ScrollToTop } from './components/utils/ScrollToTop'
import { ErrorBoundary } from './components/utils/ErrorBoundary'

// Eagerly loaded — small, always needed
import Home from './pages/Home'
import Recipes from './pages/Recipes'
import CultureArticles from './pages/CultureArticles'
import Shelf from './pages/Shelf'
import About from './pages/About'
import NotFound from './pages/NotFound'

// Lazily loaded — heavy pages that don't need to block initial render
const BrewingGuides   = lazy(() => import('./pages/BrewingGuides'))
const ArticleDetail   = lazy(() => import('./pages/ArticleDetail'))
const RecipeDetail    = lazy(() => import('./pages/RecipeDetail'))
const TastingNotes    = lazy(() => import('./pages/TastingNotes'))
const BrewCalculator  = lazy(() => import('./pages/BrewCalculator'))
const BrewJournal     = lazy(() => import('./pages/BrewJournal'))
const Origins         = lazy(() => import('./pages/Origins'))
const OriginDetail    = lazy(() => import('./pages/OriginDetail'))
const ComparisonTool  = lazy(() => import('./pages/ComparisonTool'))
const SubmitRecipe    = lazy(() => import('./pages/SubmitRecipe'))
const Tools           = lazy(() => import('./pages/Tools'))
const Glossary        = lazy(() => import('./pages/Glossary'))
const CommunityRecipes = lazy(() => import('./pages/CommunityRecipes'))
const Shop            = lazy(() => import('./pages/Shop'))
const BeanCatcher     = lazy(() => import('./pages/BeanCatcher'))
const CoffeeReference = lazy(() => import('./pages/CoffeeReference'))

function LazyPage({ children }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--color-bg)' }} />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}

export default function App() {
  const location = useLocation()
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 1100)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <ScrollToTop />
      <PageLoader visible={booting} />
      <Layout>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/"               element={<PageTransition><Home /></PageTransition>} />
            <Route path="/recipes"        element={<PageTransition><Recipes /></PageTransition>} />
            <Route path="/brewing-guides" element={<LazyPage><PageTransition><BrewingGuides /></PageTransition></LazyPage>} />
            <Route path="/culture"        element={<PageTransition><CultureArticles /></PageTransition>} />
            <Route path="/article/*"      element={<LazyPage><PageTransition><ArticleDetail /></PageTransition></LazyPage>} />
            <Route path="/recipe/:slug"   element={<LazyPage><PageTransition><RecipeDetail /></PageTransition></LazyPage>} />
            <Route path="/about"          element={<PageTransition><About /></PageTransition>} />
            <Route path="/play"           element={<Navigate to="/tools" replace />} />
            <Route path="/tasting"        element={<LazyPage><PageTransition><TastingNotes /></PageTransition></LazyPage>} />
            <Route path="/calculator"     element={<LazyPage><PageTransition><BrewCalculator /></PageTransition></LazyPage>} />
            <Route path="/shelf"          element={<PageTransition><Shelf /></PageTransition>} />
            <Route path="/journal"        element={<LazyPage><PageTransition><BrewJournal /></PageTransition></LazyPage>} />
            <Route path="/origins"        element={<LazyPage><PageTransition><Origins /></PageTransition></LazyPage>} />
            <Route path="/origins/:id"    element={<LazyPage><PageTransition><OriginDetail /></PageTransition></LazyPage>} />
            <Route path="/compare"        element={<LazyPage><PageTransition><ComparisonTool /></PageTransition></LazyPage>} />
            <Route path="/submit-recipe"  element={<LazyPage><PageTransition><SubmitRecipe /></PageTransition></LazyPage>} />
            <Route path="/tools"          element={<LazyPage><PageTransition><Tools /></PageTransition></LazyPage>} />
            <Route path="/glossary"       element={<LazyPage><PageTransition><Glossary /></PageTransition></LazyPage>} />
            <Route path="/community"      element={<LazyPage><PageTransition><CommunityRecipes /></PageTransition></LazyPage>} />
            <Route path="/shop"           element={<LazyPage><PageTransition><Shop /></PageTransition></LazyPage>} />
            <Route path="/reference"      element={<LazyPage><PageTransition><CoffeeReference /></PageTransition></LazyPage>} />
            <Route path="*"               element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </>
  )
}
