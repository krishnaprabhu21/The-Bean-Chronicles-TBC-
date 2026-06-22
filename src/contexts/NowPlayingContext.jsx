import { createContext, useContext, useState } from 'react'

const NowPlayingContext = createContext({ nowPlaying: null, setNowPlaying: () => {}, clearNowPlaying: () => {} })

export function NowPlayingProvider({ children }) {
  const [nowPlaying, setNowPlaying] = useState(null)
  const clearNowPlaying = () => setNowPlaying(null)
  return (
    <NowPlayingContext.Provider value={{ nowPlaying, setNowPlaying, clearNowPlaying }}>
      {children}
    </NowPlayingContext.Provider>
  )
}

export function useNowPlaying() {
  return useContext(NowPlayingContext)
}
