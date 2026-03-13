import { useEffect, useState } from "react"

const SUPABASE_URL = "https://svfrmghbnyzkaorpnlqq.supabase.co"
const SUPABASE_KEY = "COLE_AQUI_SUA_ANON_KEY"

export default function Home() {

  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function loadNews() {

      try {

        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/news?select=*&order=published_at.desc`,
          {
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`
            }
          }
        )

        const data = await res.json()

        setNews(data)

      } catch (err) {

        console.log(err)

      }

      setLoading(false)

    }

    loadNews()

  }, [])

  if (loading) {
    return <div style={{ padding: 40 }}>Carregando notícias...</div>
  }

  return (

    <div style={{ padding: 40 }}>

      <h1>ProConcursos News</h1>

      {news.slice(0,10).map(n => (

        <div key={n.id} style={{marginBottom:20}}>

          <h2>{n.title}</h2>

          <p>{n.summary}</p>

        </div>

      ))}

    </div>

  )

}
