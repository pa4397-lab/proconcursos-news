const params = new URLSearchParams(window.location.search)

const slug = params.get("slug")

const SUPABASE_URL = "https://svfrmghbnyzkaorpnlqq.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2ZnJtZ2hibnl6a2FvcnBubHFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxOTYzNDcsImV4cCI6MjA4ODc3MjM0N30.vGSYVkIkPrs3IlI4p9SnNZrguStafFLVFLU7qum9a3Y"

async function loadNews(){

const res = await fetch(
`${SUPABASE_URL}/rest/v1/news?slug=eq.${slug}&select=*`,
{
headers:{
apikey: SUPABASE_KEY,
Authorization:`Bearer ${SUPABASE_KEY}`
}
})

const data = await res.json()

if(!data.length){

document.getElementById("app").innerHTML = "Notícia não encontrada"

return

}

const n = data[0]

document.title = n.title

/* SCHEMA GOOGLE NEWS */

const schema = {

"@context":"https://schema.org",
"@type":"NewsArticle",
"headline":n.title,
"image":[n.image],
"datePublished":n.published_at,
"author":{
"@type":"Organization",
"name":"ProConcursos News"
}

}

const script = document.createElement("script")

script.type="application/ld+json"

script.text=JSON.stringify(schema)

document.head.appendChild(script)

/* HTML DA NOTÍCIA */

document.getElementById("app").innerHTML = `

<div style="font-size:14px;color:#666;margin-bottom:20px">

<a href="/">Home</a> ›
<span>${n.title}</span>

</div>

<h1 style="font-size:34px;margin-bottom:25px">

${n.title}

</h1>

<img src="${n.image}" style="border-radius:8px;margin-bottom:25px;width:100%">

<p style="font-size:20px;color:#555;margin-bottom:30px">

${n.summary || "Resumo automático"}

</p>

<div style="margin-bottom:30px">

<a href="https://proconcursos.pro"
style="
background:#0f6d36;
color:white;
padding:12px 18px;
border-radius:6px;
text-decoration:none;
font-weight:bold
">

Estude para este concurso com IA

</a>

</div>

<div style="font-size:18px;line-height:1.6;margin-bottom:40px">

${formatContent(n.article)}

</div>

<h3 style="font-size:24px;margin-bottom:15px">

Notícias relacionadas

</h3>

<div id="related"></div>

`

loadRelated()

}

/* FORMATA TEXTO */

function formatContent(text){

if(!text) return ""

return text
.split(". ")
.map(p => `<p style="margin-bottom:18px">${p}.</p>`)
.join("")

}

/* NOTÍCIAS RELACIONADAS */

async function loadRelated(){

const res = await fetch(
`${SUPABASE_URL}/rest/v1/news?select=*&order=published_at.desc&limit=5`,
{
headers:{
apikey: SUPABASE_KEY,
Authorization:`Bearer ${SUPABASE_KEY}`
}
})

const data = await res.json()

const container = document.getElementById("related")

data.forEach(n=>{

container.innerHTML += `

<div style="margin-bottom:12px">

<a href="/noticia.html?slug=${n.slug}"
style="color:#0f6d36;font-weight:bold">

${n.title}

</a>

</div>

`

})

}

loadNews()
