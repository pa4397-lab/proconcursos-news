import { useEffect, useState } from "react"

const SUPABASE_URL = "https://svfrmghbnyzkaorpnlqq.supabase.co"
const SUPABASE_KEY = "COLE_SUA_ANON_KEY"

export default function Home(){

  const [news,setNews] = useState([])
  const [loading,setLoading] = useState(true)
  const [error,setError] = useState(null)

  useEffect(()=>{

    async function loadNews(){

      try{

        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/news?select=*&order=published_at.desc&limit=20`,
          {
            headers:{
              apikey: SUPABASE_KEY,
              Authorization:`Bearer ${SUPABASE_KEY}`
            }
          }
        )

        if(!res.ok){
          throw new Error("Erro na API")
        }

        const data = await res.json()

        setNews(data || [])

      }catch(err){

        console.error("Erro carregando notícias:",err)
        setError(err.message)

      }finally{

        setLoading(false)

      }

    }

    loadNews()

  },[])

  if(loading){
    return <div style={{padding:40}}>Carregando notícias...</div>
  }

  if(error){
    return <div style={{padding:40}}>Erro: {error}</div>
  }

  if(!news.length){
    return <div style={{padding:40}}>Nenhuma notícia encontrada</div>
  }

  return(

    <div style={{padding:40}}>

      <h1>ProConcursos News</h1>

      {news.map(n=>(
        <div key={n.id} style={{marginBottom:20}}>

          <h2>{n.title}</h2>

          <p>{n.summary}</p>

        </div>
      ))}

    </div>

  )

}
