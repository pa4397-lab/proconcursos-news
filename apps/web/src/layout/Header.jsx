export default function Header() {

  return (

    <header className="bg-blue-600 text-white">

      <div className="max-w-6xl mx-auto flex justify-between p-4">

        <h1 className="text-xl font-bold">
          ProConcursos News
        </h1>

        <nav className="flex gap-6">

          <a href="/" className="hover:underline">
            Início
          </a>

          <a href="/concursos-abertos">
            Concursos Abertos
          </a>

          <a href="/concursos-previstos">
            Concursos Previstos
          </a>

          <a href="https://proconcursos.pro">
            Simulados
          </a>

        </nav>

      </div>

    </header>

  )
}
