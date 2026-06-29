import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // Gọi thợ xây Router
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Nhét App vào Lồng */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
