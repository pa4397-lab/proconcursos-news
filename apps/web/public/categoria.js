const cat = urlParams.get("cat")

const SUPABASE_URL = "https://svfrmghbnyzkaorpnlqq.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2ZnJtZ2hibnl6a2FvcnBubHFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxOTYzNDcsImV4cCI6MjA4ODc3MjM0N30.vGSYVkIkPrs3IlI4p9SnNZrguStafFLVFLU7qum9a3Y"

async function loadNews(){

const res = await fetch(
`${SUPABASE_URL}/rest/v1/news?select=*&order=published_at.desc&limit=200`,
{
headers:{
apikey: SUPABASE_KEY,
Authorization:`Bearer ${SUPABASE_KEY}`
}
})

const data = await res.json()

const container = document.getElementById("app")

container.innerHTML = `<h1 style="font-size:32px;margin-bottom:30px">Categoria: ${cat}</h1>`

const filtered = data.filter(n => {

if(!cat) return true

return n.title.toLowerCase().includes(cat.toLowerCase())

})

filtered.forEach(n=>{

container.innerHTML += `

<div style="margin-bottom:40px;border-bottom:1px solid #eee;padding-bottom:20px">

<img src="${n.image}" style="width:100%;border-radius:8px;margin-bottom:10px">

<h2 style="font-size:22px;margin-bottom:10px">${n.title}</h2>

<p style="color:#666;margin-bottom:10px">${n.summary}</p>

<a href="${n.url}" target="_blank" style="color:#0f6d36;font-weight:bold">
Leia mais...
</a>

</div>

`

})

}
loadNews()
