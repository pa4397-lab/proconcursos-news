import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import NewsPage from "./pages/NewsPage"

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<HomePage />} />

        <Route path="/noticia/:slug" element={<NewsPage />} />

      </Routes>

    </BrowserRouter>

  )

}

export default App
