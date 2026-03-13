import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"

const SUPABASE_URL = "https://svfrmghbnyzkaorpnlqq.supabase.co"
const SUPABASE_ANON_KEY = "SUA_KEY"

export default function NewsPage(){

  const { slug } = useParams()

  const [news,setNews] = useState(null)

  useEffect(()=>{

    async function load(){

      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/news?slug=eq.${slug}&select=*`,
        {
          headers:{
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`
          }
        }
      )

      const data = await res.json()

      setNews(data[0])

    }

    load()

  },[slug])

  if(!news){
    return <div className="p-10">Carregando...</div>
  }

  const image = news.image || "https://placehold.co/900x500?text=ProConcursos"

  return (

    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-4xl font-bold mb-6">
        {news.title}
      </h1>

      <img
        src={image}
        className="w-full rounded-lg mb-6"
      />

      <p className="text-gray-600 mb-4">
        {news.summary}
      </p>

      <div className="text-lg leading-relaxed">
        {news.content}
      </div>

    </div>
  )
}
