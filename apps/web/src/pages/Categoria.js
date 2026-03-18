import {useParams} from "react-router-dom"
import {useEffect,useState} from "react"
import {getByCategory} from "../services/api"
import NewsCard from "../components/NewsCard"

export default function Categoria(){

const {cat} = useParams()
const [news,setNews] = useState([])

useEffect(()=>{

getByCategory(cat).then(setNews)

},[cat])

return(

<div style={{
maxWidth:1200,
margin:"30px auto"
}}>

<h1>Categoria: {cat}</h1>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",
gap:20
}}>

{news.map(n=>(
<NewsCard key={n.id} news={n}/>
))}

</div>

</div>

)

}
