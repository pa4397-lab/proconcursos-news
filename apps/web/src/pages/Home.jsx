import { useEffect, useState } from "react"

const SUPABASE_URL = "https://svfrmghbnyzkaorpnlqq.supabase.co"
const SUPABASE_KEY = "COLE_SUA_ANON_KEY"

export default function Home(){

  const [news,setNews] = useState([])
  const [loading,setLoading] = useState(true)

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

        const data = await res.json()

        setNews(data || [])

      }catch(err){

        console.log(err)

      }

      setLoading(false)

    }

    loadNews()

  },[])

  if(loading){
    return <div style={{padding:40}}>Carregando...</div>
  }

  if(!news.length){
    return <div style={{padding:40}}>Nenhuma notícia encontrada</div>
  }

  const main = news[0]
  const grid = news.slice(1,9)
  const sidebar = news.slice(9,20)

  return(

    <div style={{fontFamily:"Arial"}}>

      <div style={{
        borderBottom:"1px solid #ddd",
        padding:"20px 40px",
        fontWeight:"bold",
        fontSize:28
      }}>
        ProConcursos
      </div>

      <div style={{maxWidth:1200,margin:"40px auto"}}>

        {main && (

          <div style={{
            display:"grid",
            gridTemplateColumns:"1fr 1fr",
            gap:30,
            marginBottom:40
          }}>

            <img
              src={main.image || "https://placehold.co/600x400"}
              style={{width:"100%",borderRadius:8}}
            />

            <div>

              <h1 style={{fontSize:32}}>
                {main.title}
              </h1>

              <p style={{marginTop:20,color:"#666"}}>
                {main.summary}
              </p>

              <a
                href={main.url}
                target="_blank"
                style={{color:"blue"}}
              >
                Ler notícia original
              </a>

            </div>

          </div>

        )}

        <div style={{
          display:"grid",
          gridTemplateColumns:"2fr 1fr",
          gap:40
        }}>

          <div style={{
            display:"grid",
            gridTemplateColumns:"1fr 1fr",
            gap:20
          }}>

            {grid.map(n => (

              <div
                key={n.id}
                style={{
                  border:"1px solid #eee",
                  borderRadius:8,
                  overflow:"hidden"
                }}
              >

                <img
                  src={n.image || "https://placehold.co/400x250"}
                  style={{width:"100%"}}
                />

                <div style={{padding:15}}>

                  <h3 style={{fontSize:18}}>
                    {n.title}
                  </h3>

                  <a
                    href={n.url}
                    target="_blank"
                    style={{color:"blue"}}
                  >
                    Ver notícia
                  </a>

                </div>

              </div>

            ))}

          </div>

          <div>

            <h3 style={{marginBottom:20}}>
              Últimas notícias
            </h3>

            {sidebar.map(n => (

              <div
                key={n.id}
                style={{
                  marginBottom:15,
                  borderBottom:"1px solid #eee",
                  paddingBottom:10
                }}
              >

                {n.title}

                <div>

                  <a
                    href={n.url}
                    target="_blank"
                    style={{color:"blue"}}
                  >
                    Ver notícia
                  </a>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  )

}
