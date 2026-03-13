import { useParams } from "react-router-dom"
import { useEffect,useState } from "react"

const SUPABASE="https://svfrmghbnyzkaorpnlqq.supabase.co/rest/v1/news"

export default function NewsPage(){

  const {slug}=useParams()

  const [news,setNews]=useState(null)

  useEffect(()=>{

    fetch(`${SUPABASE}?slug=eq.${slug}&select=*`)
      .then(r=>r.json())
      .then(d=>setNews(d[0]))

  },[slug])

  if(!news) return <div className="p-10">Carregando...</div>

  const image=news.image||"https://placehold.co/900x500"

  return(

    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-4xl font-bold mb-6">
        {news.title}
      </h1>

      <img src={image} className="rounded-lg mb-6"/>

      <p className="text-gray-600 mb-4">
        {news.summary}
      </p>

      <div className="text-lg leading-relaxed">
        {news.content}
      </div>

    </div>

  )
}
