const SUPABASE_URL = "https://svfrmghbnyzkaorpnlqq.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2ZnJtZ2hibnl6a2FvcnBubHFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxOTYzNDcsImV4cCI6MjA4ODc3MjM0N30.vGSYVkIkPrs3IlI4p9SnNZrguStafFLVFLU7qum9a3Y"

export async function getNews(limit = 20){

const res = await fetch(
`${SUPABASE_URL}/rest/v1/news?select=*&order=published_at.desc&limit=${limit}`,
{
headers:{
apikey:SUPABASE_KEY,
Authorization:`Bearer ${SUPABASE_KEY}`
}
}
)

return res.json()

}

export async function getNewsBySlug(slug){

const res = await fetch(
`${SUPABASE_URL}/rest/v1/news?slug=eq.${slug}&select=*`,
{
headers:{
apikey:SUPABASE_KEY,
Authorization:`Bearer ${SUPABASE_KEY}`
}
}
)

const data = await res.json()

return data[0]

}

export async function getByCategory(cat){

const res = await fetch(
`${SUPABASE_URL}/rest/v1/news?category=eq.${cat}&order=published_at.desc`,
{
headers:{
apikey:SUPABASE_KEY,
Authorization:`Bearer ${SUPABASE_KEY}`
}
}
)

return res.json()

}
