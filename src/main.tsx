import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { getStoredRevealTheme, setRevealTheme } from './lib/revealThemes'
import { router } from './router'
import './index.css'

setRevealTheme(getStoredRevealTheme())

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />,
)
