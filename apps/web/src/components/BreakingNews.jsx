export default function BreakingNews({news}){

  if(!news) return null

  return(

    <div className="bg-gray-100 border-y">

      <div className="max-w-7xl mx-auto px-4 py-2 text-sm overflow-x-auto whitespace-nowrap">

        {news.slice(0,8).map(n => (
          <span key={n.id} className="mr-6">
            • {n.title}
          </span>
        ))}

      </div>

    </div>

  )
}
