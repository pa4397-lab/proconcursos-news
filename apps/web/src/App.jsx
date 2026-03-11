
import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import HomePage from './pages/HomePage';
import NewsDetailPage from './pages/NewsDetailPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import { Toaster } from '@/components/ui/toaster';
import { useEffect, useState } from "react"
import { getNews } from "./api"

function App() {

  const [news, setNews] = useState([])

  useEffect(() => {

    async function loadNews() {
      const data = await getNews()
      setNews(data)
    }

    loadNews()

  }, [])

  return (

    <div>

      <h1>Últimas Notícias</h1>

      {news.map((item) => (
        <div key={item.id}>

          <h3>{item.title}</h3>

          <a href={item.url} target="_blank">
            Ler notícia
          </a>

        </div>
      ))}

    </div>

  )
}

export default App
function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/noticia/:id" element={<NewsDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
