import { createContext, useContext, useCallback, useState } from 'react'

const ToastContext = createContext({ addToast: () => {} })

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(({ message, type = 'success', duration = 3000 }) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type, duration }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
  }, [])

  const remove = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), [])

  return (
    <ToastContext.Provider value={{ addToast, toasts, remove }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() { return useContext(ToastContext) }
