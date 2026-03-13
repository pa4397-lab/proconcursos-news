import { useEffect, useState } from "react"

const SUPABASE_URL = "https://svfrmghbnyzkaorpnlqq.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2ZnJtZ2hibnl6a2FvcnBubHFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxOTYzNDcsImV4cCI6MjA4ODc3MjM0N30.vGSYVkIkPrs3IlI4p9SnNZrguStafFLVFLU7qum9a3Y"

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

    <div style={{fontFamily:"Arial",background:"#f4f4f4"}}>

      {/* HEADER */}

      <div style={{
        background:"#0b7a3b",
        color:"white",
        padding:"20px 40px",
        fontSize:28,
        fontWeight:"bold"
      }}>
        ProConcursos
      </div>

      {/* MENU */}

      <div style={{
        background:"white",
        borderBottom:"1px solid #ddd",
        padding:"10px 40px"
      }}>
        Concursos • Editais • Polícia • Tribunais • Educação • Saúde
      </div>

      <div style={{
        maxWidth:1200,
        margin:"40px auto",
        background:"white",
        padding:30
      }}>

        {/* NOTÍCIA PRINCIPAL */}

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

              <h1 style={{
                fontSize:32,
                marginBottom:20
              }}>
                {main.title}
              </h1>

              <p style={{color:"#666",marginBottom:20}}>
                {main.summary}
              </p>

              <a
                href={main.url}
                target="_blank"
                style={{
                  background:"#0b7a3b",
                  color:"white",
                  padding:"10px 15px",
                  borderRadius:5,
                  textDecoration:"none"
                }}
              >
                Ler notícia completa
              </a>

            </div>

          </div>

        )}

        {/* GRID + SIDEBAR */}

        <div style={{
          display:"grid",
          gridTemplateColumns:"2fr 1fr",
          gap:40
        }}>

          {/* GRID */}

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

                  <h3 style={{
                    fontSize:18,
                    marginBottom:10
                  }}>
                    {n.title}
                  </h3>

                  <a
                    href={n.url}
                    target="_blank"
                    style={{
                      color:"#0b7a3b",
                      fontWeight:"bold"
                    }}
                  >
                    Ler notícia
                  </a>

                </div>

              </div>

            ))}

          </div>

          {/* SIDEBAR */}

          <div>

            <h3 style={{
              marginBottom:20,
              borderBottom:"2px solid #0b7a3b",
              paddingBottom:10
            }}>
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

                <div style={{marginBottom:5}}>
                  {n.title}
                </div>

                <a
                  href={n.url}
                  target="_blank"
                  style={{color:"#0b7a3b"}}
                >
                  Ler
                </a>

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* FOOTER */}

      <div style={{
        marginTop:40,
        padding:30,
        background:"#111",
        color:"white",
        textAlign:"center"
      }}>
        © {new Date().getFullYear()} ProConcursos
      </div>

    </div>

  )

}
