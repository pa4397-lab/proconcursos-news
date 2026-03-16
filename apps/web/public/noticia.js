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

const schemaScript = document.createElement("script")

schemaScript.type = "application/ld+json"

schemaScript.text = JSON.stringify(schema)

document.head.appendChild(schemaScript)

document.getElementById("app").innerHTML = `

<div class="text-sm text-gray-500 mb-4">

<a href="/">Home</a> ›
<span>${n.title}</span>

</div>

<h1 class="text-3xl font-bold mb-6">

${n.title}

</h1>

<img src="${n.image}" class="rounded mb-6">

<p class="text-lg text-gray-700 mb-6">

${n.summary}

</p>

<div class="mb-8">

<a href="https://proconcursos.pro"
class="bg-green-700 text-white px-4 py-2 rounded">

Estude para este concurso com IA

</a>

</div>

<h3 class="text-xl font-bold mb-4">

Notícias relacionadas

</h3>

<div id="related"></div>

`

loadRelated(n.categoria)

}

async function loadRelated(cat){

const res = await fetch(
`${SUPABASE_URL}/rest/v1/news?categoria=eq.${cat}&limit=5`,
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

<div class="mb-3">

<a href="/noticia.html?slug=${n.slug}"
class="text-green-700 font-bold">

${n.title}

</a>

</div>

`

})

}

loadNews()
