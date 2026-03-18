import { useEffect, useState } from "react"

const SUPABASE_URL = "https://svfrmghbnyzkaorpnlqq.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2ZnJtZ2hibnl6a2FvcnBubHFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxOTYzNDcsImV4cCI6MjA4ODc3MjM0N30.vGSYVkIkPrs3IlI4p9SnNZrguStafFLVFLU7qum9a3Y"

export default function Home(){

const [news,setNews] = useState([])

useEffect(()=>{

async function loadNews(){

const res = await fetch(
`${SUPABASE_URL}/rest/v1/news?select=*&order=published_at.desc&limit=30`,
{
headers:{
apikey:SUPABASE_KEY,
Authorization:`Bearer ${SUPABASE_KEY}`
}
}
)

const data = await res.json()
setNews(data)

}

loadNews()

},[])

if(!news.length){
return <div style={{padding:40}}>Carregando notícias...</div>
}

const hero = news[0]
const grid = news.slice(1,9)
const sidebar = news.slice(9,20)

return(

<div style={{fontFamily:"Arial",background:"#f1f5f9"}}>

{/* HEADER */}

<header style={{
background:"#0f6d36",
color:"white",
padding:"14px 20px",
display:"flex",
justifyContent:"space-between",
alignItems:"center",
flexWrap:"wrap"
}}>

<div style={{fontSize:22,fontWeight:"bold"}}>
ProConcursos News
</div>

<nav style={{
display:"flex",
gap:18,
fontSize:14,
flexWrap:"wrap"
}}>

<a href="/" style={{color:"white",textDecoration:"none"}}>Home</a>
<a href="/categoria.html?cat=concurso" style={{color:"white"}}>Concursos</a>
<a href="/categoria.html?cat=policia" style={{color:"white"}}>Polícia</a>
<a href="/categoria.html?cat=tribunal" style={{color:"white"}}>Tribunais</a>
<a href="/categoria.html?cat=educacao" style={{color:"white"}}>Educação</a>

</nav>

</header>

{/* CONTAINER */}

<div style={{
maxWidth:1200,
margin:"30px auto",
padding:"0 15px"
}}>

{/* HERO */}

<div style={{
display:"grid",
gridTemplateColumns:"2fr 1fr",
gap:20,
marginBottom:30
}}>

{/* HERO NEWS */}

<a
href={`/noticia.html?slug=${hero.slug}`}
style={{
background:"white",
borderRadius:10,
overflow:"hidden",
boxShadow:"0 4px 10px rgba(0,0,0,0.08)",
textDecoration:"none",
color:"inherit"
}}
>

<img
src={hero.image || "https://placehold.co/800x400"}
style={{width:"100%"}}
/>

<div style={{padding:20}}>

<h1 style={{
fontSize:26,
marginBottom:12,
lineHeight:1.3
}}>
{hero.title}
</h1>

<p style={{color:"#555"}}>
{hero.summary}
</p>

</div>

</a>

{/* SIDEBAR */}

<div style={{
background:"white",
borderRadius:10,
padding:20,
boxShadow:"0 4px 10px rgba(0,0,0,0.08)"
}}>

<h3 style={{
marginBottom:15,
borderBottom:"2px solid #0f6d36",
paddingBottom:6
}}>
Últimas notícias
</h3>

{sidebar.map(n=>(

<div key={n.id} style={{marginBottom:15}}>

<a
href={`/noticia.html?slug=${n.slug}`}
style={{
fontSize:15,
color:"#0f6d36",
fontWeight:"bold",
textDecoration:"none"
}}
>

{n.title}

</a>

</div>

))}

</div>

</div>

{/* GRID */}

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",
gap:20
}}>

{grid.map(n=>(

<a
key={n.id}
href={`/noticia.html?slug=${n.slug}`}
style={{
background:"white",
borderRadius:10,
overflow:"hidden",
boxShadow:"0 4px 10px rgba(0,0,0,0.08)",
transition:"all .25s",
textDecoration:"none",
color:"inherit"
}}

onMouseEnter={e=>{
e.currentTarget.style.transform="translateY(-6px)"
e.currentTarget.style.boxShadow="0 12px 25px rgba(0,0,0,0.15)"
}}

onMouseLeave={e=>{
e.currentTarget.style.transform="translateY(0)"
e.currentTarget.style.boxShadow="0 4px 10px rgba(0,0,0,0.08)"
}}

>

<img
src={n.image || "https://placehold.co/400x250"}
style={{width:"100%",height:180,objectFit:"cover"}}
/>

<div style={{padding:15}}>

<h3 style={{
fontSize:18,
marginBottom:8,
lineHeight:1.4
}}>
{n.title}
</h3>

<div style={{
color:"#0f6d36",
fontWeight:"bold"
}}>
Leia mais →
</div>

</div>

</a>

))}

</div>

</div>

{/* FOOTER */}

<footer style={{
marginTop:40,
background:"#111",
color:"white",
textAlign:"center",
padding:25
}}>

© {new Date().getFullYear()} ProConcursos News

</footer>

</div>

)

}
