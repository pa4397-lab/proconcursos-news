export default function Header(){

return(

<header style={{
background:"#0f6d36",
color:"white",
padding:"14px 20px",
display:"flex",
justifyContent:"space-between",
alignItems:"center",
flexWrap:"wrap"
}}>

<div style={{
fontSize:22,
fontWeight:"bold"
}}>
ProConcursos News
</div>

<nav style={{
display:"flex",
gap:18,
fontSize:14
}}>

<a href="/" style={{color:"white"}}>Home</a>
<a href="/categoria/concurso">Concursos</a>
<a href="/categoria/policia">Polícia</a>
<a href="/categoria/tribunal">Tribunais</a>
<a href="/categoria/educacao">Educação</a>

</nav>

</header>

)

}
