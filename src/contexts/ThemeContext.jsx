import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} })

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('tbc-theme')
    if (stored) return stored
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    // Native browser UI (scrollbars, form controls, date pickers) follow color-scheme
    root.style.colorScheme = theme === 'light' ? 'light' : 'dark'
    localStorage.setItem('tbc-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    document.documentElement.classList.add('theme-transitioning')
    setTimeout(() => document.documentElement.classList.remove('theme-transitioning'), 400)
    setTheme(t => (t === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
