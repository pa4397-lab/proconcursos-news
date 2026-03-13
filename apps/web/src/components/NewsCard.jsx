export default function NewsCard({news}){

  const image = news.image || "https://placehold.co/600x400"

  return(

    <a href={`/noticia/${news.slug}`}>

      <div className="hover:shadow-lg transition rounded-lg overflow-hidden border">

        <img
          src={image}
          className="w-full h-[180px] object-cover"
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
