export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">

        <h1 className="text-2xl font-bold text-blue-700">
          ProConcursos News
        </h1>

        <nav className="flex gap-6 text-sm font-medium">

          <a href="/" className="hover:text-blue-600">
            Início
          </a>

          <a href="/concursos" className="hover:text-blue-600">
            Concursos
          </a>

          <a href="/editais" className="hover:text-blue-600">
            Editais
          </a>

          <a href="/guias" className="hover:text-blue-600">
            Guias
          </a>

        </nav>

      </div>
    </header>
  )
}
