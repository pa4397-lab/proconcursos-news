import { useEffect, useState } from "react"
import Header from "../components/Header"
import NewsCard from "../components/NewsCard"
import HeroNews from "../components/HeroNews"
import Sidebar from "../components/Sidebar"

export default function Home() {

  const [news, setNews] = useState([])

  useEffect(() => {

    fetch("https://svfrmghbnyzkaorpnlqq.supabase.co/rest/v1/news?select=*")
      .then(res => res.json())
      .then(data => setNews(data))
      .catch(err => console.log(err))

  }, [])

  if (!news || news.length === 0) {
    return (
      <div className="p-10 text-center">
        Carregando notícias...
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
