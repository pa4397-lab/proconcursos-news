export default function HeroNews({news}){

  if(!news) return null

  const image = news.image || "https://placehold.co/900x500"

  return(

    <a href={`/noticia/${news.slug}`}>

      <div className="grid md:grid-cols-2 gap-8 mb-10">

        <img
          src={image}
          className="w-full h-[360px] object-cover rounded-lg"
        />

        <div>

          <h1 className="text-4xl font-bold mb-4">
            {news.title}
          </h1>

          <p className="text-gray-600">
            {news.summary}
          </p>

        </div>

      </div>

    </a>
  )
}
