import { useEffect } from 'react'

const DEFAULT_DESC = 'Coffee stories, recipes, and rituals for the discerning coffee mind. Origins, brewing guides, tasting notes and more.'
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&fit=crop'

function setMeta(nameOrProp, content) {
  const isOg = nameOrProp.startsWith('og:') || nameOrProp.startsWith('twitter:')
  const attr = isOg ? 'property' : 'name'
  let el = document.querySelector(`meta[${attr}="${nameOrProp}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, nameOrProp)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function SEO({ title, description, image, type = 'website' }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | The Bean Chronicles` : 'The Bean Chronicles'
    const desc = description || DEFAULT_DESC
    const img = image || DEFAULT_IMAGE

    document.title = fullTitle

    setMeta('description', desc)
    setMeta('og:title', fullTitle)
    setMeta('og:description', desc)
    setMeta('og:image', img)
    setMeta('og:type', type)
    setMeta('og:site_name', 'The Bean Chronicles')
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', fullTitle)
    setMeta('twitter:description', desc)
    setMeta('twitter:image', img)

    return () => {
      document.title = 'The Bean Chronicles'
    }
  }, [title, description, image, type])

  return null
}
