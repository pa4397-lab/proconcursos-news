export default function NewsCard({ news }) {

  const image = news.image || "https://placehold.co/600x400?text=ProConcursos"

  return (
    <a href={`/noticia/${news.slug}`}>

      <div className="border rounded-xl overflow-hidden hover:shadow-lg transition">

        <img
          src={image}
          className="w-full h-[160px] object-cover"
        />

        <div className="p-4">

          <h3 className="font-semibold mb-2">
            {news.title}
          </h3>

          <p className="text-sm text-gray-600">
            {news.summary}
          </p>

        </div>

      </div>

    </a>
  )
}
