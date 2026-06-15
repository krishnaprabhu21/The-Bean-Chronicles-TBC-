import { useState, useEffect } from 'react'
import { fetchArticleById } from '../api/guardian'

export function useGuardianArticle(guardianId) {
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!guardianId) return
    let cancelled = false
    setLoading(true)
    setError(null)
    setArticle(null)

    fetchArticleById(guardianId)
      .then((data) => {
        if (!cancelled) {
          setArticle(data)
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
  }, [guardianId])

  return { article, loading, error }
}
