import {BrowserRouter,Routes,Route} from "react-router-dom"

import Home from "./pages/Home"
import NewsPage from "./pages/NewsPage"

export default function App(){

  return(

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home/>}/>
        <Route path="/noticia/:slug" element={<NewsPage/>}/>

      </Routes>

    </BrowserRouter>

  )
}
