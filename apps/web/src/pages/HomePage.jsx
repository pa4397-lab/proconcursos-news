import { useEffect, useState } from "react"
import { getNews } from "../api"
import NewsCard from "../components/NewsCard"
import Header from "../layout/Header"

export default function HomePage() {

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

      <Header />

      <div className="max-w-6xl mx-auto p-6">

        <h2 className="text-3xl font-bold mb-6">

          Últimas Notícias de Concursos

        </h2>

        <div className="grid grid-cols-3 gap-6">

          {news.map(n => (
            <NewsCard key={n.id} news={n} />
          ))}

        </div>

      </div>

    </div>

  )

}
