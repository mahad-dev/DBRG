import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { UploadDetailsProvider } from './context/UploadDetailsContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UploadDetailsProvider>
          <App />
        </UploadDetailsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
