import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

// IMPORTA TUS COMPONENTES
import Login from "./pages/Login.jsx";
import Registro from "./pages/CrearCuenta.jsx";
import Catalogo from "./pages/Catalogo.jsx";
import Libro from "./pages/Libro.jsx";
import Carrito from './pages/Carrito'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Catalogo />} />
        <Route path="/libro/:id" element={<Libro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/carrito" element={<Carrito />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
