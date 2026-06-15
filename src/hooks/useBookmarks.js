import { useState, useEffect, useCallback } from 'react'
import { useToast } from '../contexts/ToastContext'

const KEY = 'tbc-bookmarks'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') }
  catch { return [] }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(load)
  const { addToast } = useToast()

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(bookmarks))
  }, [bookmarks])

  const toggle = useCallback((article) => {
    setBookmarks(prev => {
      const has = prev.some(b => b.id === article.id)
      if (has) {
        addToast({ message: 'Removed from shelf', type: 'info' })
        return prev.filter(b => b.id !== article.id)
      } else {
        addToast({ message: 'Saved to your shelf', type: 'success' })
        return [...prev, { id: article.id, title: article.title, excerpt: article.excerpt,
            coverImage: article.coverImage, author: article.author,
            readTime: article.readTime, publishDate: article.publishDate,
            sectionName: article.sectionName }]
      }
    })
  }, [addToast])

  const isBookmarked = useCallback((id) => bookmarks.some(b => b.id === id), [bookmarks])

  return { bookmarks, toggle, isBookmarked, count: bookmarks.length }
}
