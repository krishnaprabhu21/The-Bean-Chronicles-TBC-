import { useState, useMemo } from 'react'

export function useFilter(items, key = 'category') {
  const [active, setActive] = useState('all')

  const filtered = useMemo(
    () => (active === 'all' ? items : items.filter((i) => i[key] === active)),
    [items, active, key]
  )

  return { filtered, active, setActive }
}
