import { useEffect, useState } from "react"
import Header from "../components/Header"
import NewsCard from "../components/NewsCard"
import HeroNews from "../components/HeroNews"
import Sidebar from "../components/Sidebar"

const SUPABASE_URL = "https://svfrmghbnyzkaorpnlqq.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2ZnJtZ2hibnl6a2FvcnBubHFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxOTYzNDcsImV4cCI6MjA4ODc3MjM0N30.vGSYVkIkPrs3IlI4p9SnNZrguStafFLVFLU7qum9a3Y"

export default function Home() {

  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function loadNews() {

      try {

        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/news?select=*&order=published_at.desc`,
          {
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`
            }
          }
        )

        const data = await response.json()

        setNews(data)

      } catch (error) {

        console.log("Erro ao carregar notícias:", error)

      } finally {

        setLoading(false)

      }
    }

    loadNews()

  }, [])

  if (loading) {
    return (
      <div className="p-10 text-center text-lg">
        Carregando notícias...
      </div>
    )
  }

  if (!news || news.length === 0) {
    return (
      <div className="p-10 text-center text-lg">
        Nenhuma notícia encontrada
      </div>
    )
  }

  return (
    <div>

      <Header />

      <main className="max-w-6xl mx-auto px-4 py-10">

        <HeroNews news={news[0]} />

        <div className="grid md:grid-cols-3 gap-8">

          <div className="md:col-span-2 grid md:grid-cols-2 gap-6">

            {news.slice(1).map((n, i) => (
              <NewsCard key={i} news={n} />
            ))}

          </div>

          <Sidebar news={news} />

        </div>

      </main>

    </div>
  )
}
