import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "./styles/tema.css"
import "./styles/auth.css"
import App from './App.tsx'
import { ProvedorTema } from '@/hooks/useTema'
import { AppToaster } from "@/components/Toast/Toast"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProvedorTema>
      <App />
      <AppToaster />
    </ProvedorTema>
  </StrictMode>,
)