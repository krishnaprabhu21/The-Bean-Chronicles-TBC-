import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { ScrollToTop } from '../ui/ScrollToTop'

export function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="w-full">{children}</main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
