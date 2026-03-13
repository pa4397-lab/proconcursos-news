export default function Header(){

  return(

    <header className="border-b bg-white">

      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        <div className="text-2xl font-bold text-green-700">
          proconcursos
        </div>

        <input
          placeholder="Buscar notícias"
          className="border rounded-lg px-4 py-2 w-[300px]"
        />

        <div className="text-sm text-gray-600">
          Entrar
        </div>

      </div>

      <div className="border-t">

        <div className="max-w-7xl mx-auto px-4 py-2 flex gap-6 text-sm font-semibold">

          <a href="/">INÍCIO</a>
          <a href="#">EDITAIS ABERTOS</a>
          <a href="#">PREVISTOS</a>
          <a href="#">TRIBUNAIS</a>
          <a href="#">POLICIAL</a>
          <a href="#">FISCAL</a>
          <a href="#">SAÚDE</a>
          <a href="#">EDUCAÇÃO</a>

        </div>

      </div>

    </header>

  )
}
