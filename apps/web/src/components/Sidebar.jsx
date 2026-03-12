export default function Sidebar({ news }) {

  return (
    <div>

      <h3 className="font-bold text-lg mb-4">
        Últimas notícias
      </h3>

      <div className="flex flex-col gap-4">

        {news.slice(0,5).map(n => (

          <div key={n.id} className="text-sm border-b pb-2">

            {n.title}

          </div>

        ))}

      </div>

    </div>
  )
}
