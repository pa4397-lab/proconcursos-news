import {useEffect,useState} from "react"
import {useParams} from "react-router-dom"
import {getNewsBySlug} from "../services/api"

export default function Noticia(){

const {slug} = useParams()
const [news,setNews] = useState(null)

useEffect(()=>{

getNewsBySlug(slug).then(setNews)

},[slug])

if(!news){
return <div>Carregando...</div>
}

return(

<div style={{maxWidth:800,margin:"40px auto"}}>

<h1>{news.title}</h1>

<img src={news.image} style={{width:"100%"}}/>

<div dangerouslySetInnerHTML={{__html:news.content}}/>

</div>

)

}
