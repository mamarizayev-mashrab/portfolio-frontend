import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider } from './context/AuthContext'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <HelmetProvider>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <ThemeProvider>
                    <LanguageProvider>
                        <AuthProvider>
                            <App />
                        </AuthProvider>
                    </LanguageProvider>
                </ThemeProvider>
            </BrowserRouter>
        </HelmetProvider>
    </React.StrictMode>,
)
