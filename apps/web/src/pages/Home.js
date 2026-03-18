import {useEffect,useState} from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import NewsCard from "../components/NewsCard"
import {getNews} from "../services/api"

export default function Home(){

const [news,setNews] = useState([])

useEffect(()=>{

getNews(30).then(setNews)

},[])

if(!news.length){
return <div>Carregando...</div>
}

const hero = news[0]
const grid = news.slice(1,9)

return(

<div style={{background:"#f1f5f9"}}>

<Header/>

<div style={{
maxWidth:1200,
margin:"30px auto",
padding:"0 15px"
}}>

<a
href={`/noticia/${hero.slug}`}
style={{
display:"block",
background:"white",
borderRadius:10,
overflow:"hidden",
marginBottom:30
}}
>

<img src={hero.image} style={{width:"100%"}}/>

<div style={{padding:20}}>

<h1>{hero.title}</h1>

<p>{hero.summary}</p>

</div>

</a>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",
gap:20
}}>

{grid.map(n=>(
<NewsCard key={n.id} news={n}/>
))}

</div>

</div>

<Footer/>

</div>

)

}
