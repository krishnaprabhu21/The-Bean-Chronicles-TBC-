import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Layout } from './components/layout/Layout'
import { PageTransition } from './components/layout/PageTransition'
import Home from './pages/Home'
import Recipes from './pages/Recipes'
import BrewingGuides from './pages/BrewingGuides'
import CultureArticles from './pages/CultureArticles'
import ArticleDetail from './pages/ArticleDetail'
import RecipeDetail from './pages/RecipeDetail'
import About from './pages/About'
import BeanCatcher from './pages/BeanCatcher'

export default function App() {
  const location = useLocation()

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/"               element={<PageTransition><Home /></PageTransition>} />
          <Route path="/recipes"        element={<PageTransition><Recipes /></PageTransition>} />
          <Route path="/brewing-guides" element={<PageTransition><BrewingGuides /></PageTransition>} />
          <Route path="/culture"        element={<PageTransition><CultureArticles /></PageTransition>} />
          <Route path="/article/:slug"  element={<PageTransition><ArticleDetail /></PageTransition>} />
          <Route path="/recipe/:slug"   element={<PageTransition><RecipeDetail /></PageTransition>} />
          <Route path="/about"          element={<PageTransition><About /></PageTransition>} />
          <Route path="/play"           element={<PageTransition><BeanCatcher /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </Layout>
  )
}
