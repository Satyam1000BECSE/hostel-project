import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

window.global = window;   // ✅ IMPORTANT FIX

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
