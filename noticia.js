const urlParams = new URLSearchParams(window.location.search)

const slug = urlParams.get("slug")

const SUPABASE_URL = "https://svfrmghbnyzkaorpnlqq.supabase.co"
const SUPABASE_KEY = "COLE_SUA_ANON_KEY"

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

const news = data[0]

const image = news.image || "https://placehold.co/900x500"

document.getElementById("app").innerHTML = `

<h1 class="text-4xl font-bold mb-6">
${news.title}
</h1>

<img src="${image}" class="rounded-lg mb-6"/>

<p class="text-gray-600 mb-6">
${news.summary}
</p>

<div class="text-lg leading-relaxed">
${news.content}
</div>

`

}

loadNews()
