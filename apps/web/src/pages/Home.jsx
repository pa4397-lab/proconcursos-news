import { useEffect,useState } from "react"

import Header from "../components/Header"
import BreakingNews from "../components/BreakingNews"
import HeroNews from "../components/HeroNews"
import NewsCard from "../components/NewsCard"
import Sidebar from "../components/Sidebar"
import Footer from "../components/Footer"

const API="https://svfrmghbnyzkaorpnlqq.supabase.co/rest/v1/news?select=*"

export default function Home(){

  const [news,setNews]=useState([])

  useEffect(()=>{

    fetch(API)
      .then(r=>r.json())
      .then(setNews)

  },[])

  if(news.length===0) return <div className="p-10">Carregando...</div>

  return(

    <div>

      <Header/>

      <BreakingNews news={news}/>

      <main className="max-w-7xl mx-auto px-4 py-10">

        <HeroNews news={news[0]}/>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="md:col-span-2 grid md:grid-cols-2 gap-6">

            {news.slice(1,9).map(n=>(
              <NewsCard key={n.id} news={n}/>
            ))}

          </div>

          <Sidebar news={news}/>

        </div>

      </main>

      <Footer/>

    </div>

  )
}
