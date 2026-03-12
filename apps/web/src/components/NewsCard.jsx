export default function NewsCard({ news }) {

  return (
    <div className="border rounded-xl overflow-hidden hover:shadow-lg transition">

      <img
        src={news.image}
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
  )
}
