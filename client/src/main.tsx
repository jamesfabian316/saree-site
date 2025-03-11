import React from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import App from './App.tsx'
import './index.css'
import { config } from './config'

// Set default base URL for all axios requests
axios.defaults.baseURL = config.API_URL

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
