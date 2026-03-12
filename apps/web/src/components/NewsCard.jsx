export default function NewsCard({ news }) {

  return (

    <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg">

      <img
        src={news.image || "https://via.placeholder.com/400x200"}
        className="w-full h-40 object-cover"
      />

      <div className="p-4">

        <h3 className="font-bold text-lg mb-2">

          {news.title}

        </h3>

        <a
          href={`/noticia/${news.slug}`}
          className="text-blue-600"
        >
          Ler notícia
        </a>

      </div>

    </div>

  )

}
