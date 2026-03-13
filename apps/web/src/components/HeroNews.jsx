export default function HeroNews({ news }) {

  if (!news) return null

  const image = news.image || "https://placehold.co/800x500?text=ProConcursos"

  return (

    <a href={`/noticia/${news.slug}`}>

      <div className="grid md:grid-cols-2 gap-6 mb-10">

        <img
          src={image}
          className="rounded-xl object-cover w-full h-[320px]"
        />

        <div>

          <h2 className="text-3xl font-bold mb-4">
            {news.title}
          </h2>

          <p className="text-gray-600">
            {news.summary}
          </p>

        </div>

      </div>

    </a>
  )
}
