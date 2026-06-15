import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { ScrollToTop } from '../ui/ScrollToTop'
import { Toaster } from '../ui/Toaster'

export function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="w-full">{children}</main>
      <Footer />
      <ScrollToTop />
      <Toaster />
    </>
  )
}
