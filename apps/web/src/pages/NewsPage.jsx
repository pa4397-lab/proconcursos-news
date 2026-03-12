import { useParams } from "react-router-dom"

export default function NewsPage() {

  const { slug } = useParams()

  return (

    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-4">

        {slug}

      </h1>

      <p>

        Conteúdo da notícia aqui.

      </p>

      <div className="mt-8">

        <a
          href="https://proconcursos.pro"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >

          Estudar para este concurso

        </a>

      </div>

    </div>

  )

}
