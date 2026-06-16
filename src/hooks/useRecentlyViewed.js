import { useState, useCallback } from 'react'

const KEY = 'tbc-recently-viewed'
const MAX = 6

function getStored() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') }
  catch { return [] }
}

export function useRecentlyViewed() {
  const [items] = useState(getStored)

  const addItem = useCallback((item) => {
    const prev = getStored().filter(i => i.id !== item.id)
    const updated = [{ ...item, timestamp: Date.now() }, ...prev].slice(0, MAX)
    localStorage.setItem(KEY, JSON.stringify(updated))
  }, [])

  return { items, addItem }
}
