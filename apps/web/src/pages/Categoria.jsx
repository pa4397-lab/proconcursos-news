import { useEffect, useState } from "react"

const SUPABASE_URL = "https://svfrmghbnyzkaorpnlqq.supabase.co"
const SUPABASE_KEY = "SUA_ANON_KEY"

export default function Categoria(){

  const [news,setNews] = useState([])

  const categoria = window.location.pathname.split("/").pop()

  useEffect(()=>{

    async function loadNews(){

      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/news?title=ilike.%${categoria}%&order=published_at.desc&limit=100`,
        {
          headers:{
            apikey: SUPABASE_KEY,
            Authorization:`Bearer ${SUPABASE_KEY}`
          }
        }
      )

      const data = await res.json()

      setNews(data)

    }

    loadNews()

  },[])

  return(

    <div style={{maxWidth:900,margin:"40px auto"}}>

      <h1>Categoria: {categoria}</h1>

      {news.map(n=>(
        <div key={n.id} style={{marginBottom:20}}>
          <h3>{n.title}</h3>
          <p>{n.summary}</p>
          <a href={n.url} target="_blank">Ler notícia</a>
        </div>
      ))}

    </div>

  )

}
