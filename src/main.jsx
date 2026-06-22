import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import App from './App.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import { ToastProvider } from './contexts/ToastContext.jsx'
import { NowPlayingProvider } from './contexts/NowPlayingContext.jsx'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/The-Bean-Chronicles-TBC-">
      <MotionConfig reducedMotion="user">
        <ToastProvider>
          <ThemeProvider>
            <NowPlayingProvider>
              <App />
            </NowPlayingProvider>
          </ThemeProvider>
        </ToastProvider>
      </MotionConfig>
    </BrowserRouter>
  </React.StrictMode>
)
