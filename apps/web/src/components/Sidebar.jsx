export default function Sidebar({news}){

  return(

    <div>

      <h3 className="text-lg font-bold mb-4">
        Últimas notícias
      </h3>

      <div className="space-y-4">

        {news.slice(0,6).map(n => (

          <a
            key={n.id}
            href={`/noticia/${n.slug}`}
            className="block border-b pb-3 text-sm hover:text-green-700"
          >

            {n.title}

          </a>

        ))}

      </div>

    </div>

  )
}
