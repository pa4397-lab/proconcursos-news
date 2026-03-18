export default function NewsCard({news}){

return(

<a
href={`/noticia/${news.slug}`}
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
src={news.image}
style={{
width:"100%",
height:180,
objectFit:"cover"
}}
/>

<div style={{padding:15}}>

<h3 style={{
fontSize:18,
lineHeight:1.4
}}>
{news.title}
</h3>

<div style={{
color:"#0f6d36",
fontWeight:"bold"
}}>
Leia mais →
</div>

</div>

</a>

)

}
