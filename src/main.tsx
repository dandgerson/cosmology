import { createRoot } from 'react-dom/client'
import { getStoredRevealTheme, setRevealTheme } from './lib/revealThemes'
import './index.css'
import App from './App.tsx'

setRevealTheme(getStoredRevealTheme())

createRoot(document.getElementById('root')!).render(<App />)
