import { useEffect, useState } from "react"

const SUPABASE_URL = "https://svfrmghbnyzkaorpnlqq.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2ZnJtZ2hibnl6a2FvcnBubHFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxOTYzNDcsImV4cCI6MjA4ODc3MjM0N30.vGSYVkIkPrs3IlI4p9SnNZrguStafFLVFLU7qum9a3Y"

export default function Home(){

  const [news,setNews] = useState([])
  const [loading,setLoading] = useState(true)

  useEffect(()=>{

    async function loadNews(){

      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/news?select=*&order=published_at.desc&limit=50`,
        {
          headers:{
            apikey: SUPABASE_KEY,
            Authorization:`Bearer ${SUPABASE_KEY}`
          }
        }
      )

      const data = await res.json()

      setNews(data || [])

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

    <div style={{fontFamily:"Arial",background:"#f2f2f2"}}>

      {/* HEADER */}

      <div style={{
        background:"#0f6d36",
        color:"white",
        padding:"16px",
        fontSize:"22px",
        fontWeight:"bold",
        textAlign:"center"
      }}>
        ProConcursos News
      </div>

      {/* MENU */}

      <div style={{
        background:"white",
        borderBottom:"1px solid #ddd",
        padding:"10px",
        fontSize:"14px",
        display:"flex",
        flexWrap:"wrap",
        justifyContent:"center",
        gap:"12px"
      }}>

        <a href="/categoria.html?cat=concurso">Concursos</a>
        <a href="/categoria.html?cat=edital">Editais</a>
        <a href="/categoria.html?cat=policia">Polícia</a>
        <a href="/categoria.html?cat=tribunal">Tribunais</a>
        <a href="/categoria.html?cat=educacao">Educação</a>
        <a href="/categoria.html?cat=saude">Saúde</a>

      </div>

      {/* CONTEÚDO */}

      <div style={{
        maxWidth:1200,
        margin:"20px auto",
        padding:"15px"
      }}>

        {/* NOTÍCIA PRINCIPAL */}

        <div style={{
          display:"flex",
          flexDirection:"column",
          gap:"15px",
          marginBottom:"30px",
          background:"white",
          padding:"15px",
          borderRadius:"8px"
        }}>

          <img
            src={main.image || "https://placehold.co/600x400"}
            style={{width:"100%",borderRadius:"6px"}}
          />

          <h1 style={{
            fontSize:"22px",
            lineHeight:"1.3"
          }}>
            {main.title}
          </h1>

          <p style={{color:"#666"}}>
            {main.summary}
          </p>

          <a
            href={`/noticia.html?slug=${main.slug}`}
            style={{
              color:"#0f6d36",
              fontWeight:"bold"
            }}
          >
            Leia mais...
          </a>

        </div>

        {/* GRID */}

        <div style={{
          display:"grid",
          gridTemplateColumns:"1fr",
          gap:"20px"
        }}>

          {grid.map(n => (

            <div
              key={n.id}
              style={{
                background:"white",
                borderRadius:"8px",
                overflow:"hidden",
                boxShadow:"0 2px 6px rgba(0,0,0,0.08)"
              }}
            >

              <img
                src={n.image || "https://placehold.co/400x250"}
                style={{width:"100%"}}
              />

              <div style={{padding:"15px"}}>

                <h3 style={{
                  fontSize:"18px",
                  marginBottom:"10px"
                }}>
                  {n.title}
                </h3>

                <a
                  href={`/noticia.html?slug=${n.slug}`}
                  style={{
                    color:"#0f6d36",
                    fontWeight:"bold"
                  }}
                >
                  Leia mais...
                </a>

              </div>

            </div>

          ))}

        </div>

        {/* BOTÃO */}

        <div style={{
          textAlign:"center",
          marginTop:"30px"
        }}>

          <a
            href="/categoria.html?cat=concurso"
            style={{
              background:"#0f6d36",
              color:"white",
              padding:"12px 18px",
              borderRadius:"6px",
              textDecoration:"none",
              fontWeight:"bold"
            }}
          >
            Ver todas as notícias
          </a>

        </div>

      </div>

      {/* FOOTER */}

      <div style={{
        marginTop:"30px",
        padding:"20px",
        background:"#111",
        color:"white",
        textAlign:"center",
        fontSize:"14px"
      }}>
        © {new Date().getFullYear()} ProConcursos News
      </div>

    </div>

  )

}
