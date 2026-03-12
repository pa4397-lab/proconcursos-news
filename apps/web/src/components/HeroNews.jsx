export default function HeroNews({ news }) {

  if (!news) return null

  return (
    <div className="grid md:grid-cols-2 gap-6 mb-10">

      {news.image && (
        <img
          src={news.image}
          className="rounded-xl object-cover w-full h-[320px]"
        />
      )}

      <div>

        <h2 className="text-3xl font-bold mb-4">
          {news.title}
        </h2>

        <p className="text-gray-600">
          {news.summary}
        </p>

      </div>

    </div>
  )
}
