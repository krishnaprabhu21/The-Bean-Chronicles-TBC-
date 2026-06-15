const BASE = 'https://content.guardianapis.com'
const KEY = import.meta.env.VITE_GUARDIAN_API_KEY || 'test'
const FIELDS = 'thumbnail,trailText,byline,wordcount,body,headline'

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=700&fit=crop',
  'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=1200&h=700&fit=crop',
  'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=1200&h=700&fit=crop',
  'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&h=700&fit=crop',
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&h=700&fit=crop',
  'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=1200&h=700&fit=crop',
  'https://images.unsplash.com/photo-1485808191679-5f86510bd652?w=1200&h=700&fit=crop',
]

function stripHtml(html) {
  return html?.replace(/<[^>]*>/g, '') || ''
}

export function mapArticle(raw, index = 0) {
  const wordcount = parseInt(raw.fields?.wordcount || '500')
  const trailText = stripHtml(raw.fields?.trailText || '')
  return {
    id: raw.id,
    title: raw.webTitle,
    excerpt: trailText,
    content: raw.fields?.body || '',
    sectionName: raw.sectionName || 'Coffee',
    author: raw.fields?.byline || 'The Guardian',
    publishDate: raw.webPublicationDate
      ? new Date(raw.webPublicationDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      : '',
    readTime: Math.max(1, Math.ceil(wordcount / 220)),
    coverImage: raw.fields?.thumbnail || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
    webUrl: raw.webUrl,
    featured: index < 2,
  }
}

export async function fetchCoffeeArticles({ page = 1, pageSize = 20 } = {}) {
  const params = new URLSearchParams({
    q: 'coffee',
    section: 'food',
    'show-fields': FIELDS,
    'order-by': 'newest',
    'page-size': String(pageSize),
    page: String(page),
    'api-key': KEY,
  })
  const res = await fetch(`${BASE}/search?${params}`)
  if (!res.ok) throw new Error(`Guardian API ${res.status}`)
  const data = await res.json()
  return {
    articles: data.response.results.map(mapArticle),
    total: data.response.total,
    pages: data.response.pages,
    currentPage: data.response.currentPage,
  }
}

export async function fetchArticleById(guardianId) {
  const params = new URLSearchParams({
    'show-fields': FIELDS,
    'api-key': KEY,
  })
  const res = await fetch(`${BASE}/${guardianId}?${params}`)
  if (!res.ok) throw new Error(`Guardian API ${res.status}`)
  const data = await res.json()
  return mapArticle(data.response.content)
}
