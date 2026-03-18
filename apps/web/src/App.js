import {BrowserRouter,Routes,Route} from "react-router-dom"

import Home from "./pages/Home"
import Noticia from "./pages/Noticia"
import Categoria from "./pages/Categoria"

export default function App(){

return(

<BrowserRouter>

<Routes>

<Route path="/" element={<Home/>}/>
<Route path="/noticia/:slug" element={<Noticia/>}/>
<Route path="/categoria/:cat" element={<Categoria/>}/>

</Routes>

</BrowserRouter>

)

}
