import React, { useEffect, useState } from 'react'
import { AuthProvider } from '@/contexts/AuthContext.jsx'
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
    <AuthProvider>
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
    </AuthProvider>
  )
}

export default App