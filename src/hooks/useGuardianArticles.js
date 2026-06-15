import { useState, useEffect } from 'react'
import { fetchCoffeeArticles } from '../api/guardian'

export function useGuardianArticles({ pageSize = 20 } = {}) {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [meta, setMeta] = useState({ total: 0, pages: 0, currentPage: 1 })

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetchCoffeeArticles({ pageSize })
      .then(({ articles: data, ...rest }) => {
        if (!cancelled) {
          setArticles(data)
          setMeta(rest)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [pageSize])

  return { articles, loading, error, meta }
}
