import { useState, useEffect } from "react";
import "./Catalogo.css";
import LibroCard from "../components/LibroCard.jsx";
import { useNavigate } from "react-router-dom";
import { useBooks } from "../components/useBooks";

function Catalogo() {
  const navigate = useNavigate();
  const { libros, loading, error } = useBooks();

  const [librosFiltrados, setLibrosFiltrados] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");
  const [showCategorias, setShowCategorias] = useState(false);

  // Filtrar libros cuando cambia la categoría o se cargan los libros
  useEffect(() => {
    if (categoriaSeleccionada === "Todas") {
      setLibrosFiltrados(libros);
    } else if (categoriaSeleccionada === "Más populares") {
      // Ordenar por popularidad si existe ese campo, o por id descendente
      setLibrosFiltrados(
        [...libros].sort((a, b) => (b.popularidad || b.id) - (a.popularidad || a.id))
      );
    } else {
      setLibrosFiltrados(
        libros.filter((l) => l.genero === categoriaSeleccionada)
      );
    }
  }, [categoriaSeleccionada, libros]);

  if (loading) {
    return (
      <div className="catalogo-container">
        <header className="topbar">
          <h1>LIBRERÍA PIER</h1>
        </header>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Cargando catálogo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="catalogo-container">
        <header className="topbar">
          <h1>LIBRERÍA PIER</h1>
        </header>
        <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
          <p>Error al cargar los libros: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="catalogo-container">

      <header className="topbar">
        <h1>LIBRERÍA PIER</h1>

        <div className="top-actions">
          <button className="linklike" onClick={() => navigate("/login")}>
            Iniciar sesión
          </button>
        </div>
      </header>

      <nav className="menu">

        <button onClick={() => {
          setCategoriaSeleccionada("Todas");
          setShowCategorias(false);
        }}>
          Inicio
        </button>

        <div className="dropdown">
          <button onClick={() => setShowCategorias(!showCategorias)}>
            Categorías
          </button>

          {showCategorias && (
            <div className="dropdown-content">
              <button onClick={() => {
                setCategoriaSeleccionada("Todas");
                setShowCategorias(false);
              }}>
                Todas
              </button>
              <button onClick={() => {
                setCategoriaSeleccionada("Fantasía");
                setShowCategorias(false);
              }}>
                Fantasía
              </button>
              <button onClick={() => {
                setCategoriaSeleccionada("Terror");
                setShowCategorias(false);
              }}>
                Terror
              </button>
              <button onClick={() => {
                setCategoriaSeleccionada("Ciencia");
                setShowCategorias(false);
              }}>
                Ciencia
              </button>
              <button onClick={() => {
                setCategoriaSeleccionada("Infantil");
                setShowCategorias(false);
              }}>
                Infantil
              </button>
            </div>
          )}
        </div>

        <button onClick={() => {
          setCategoriaSeleccionada("Más populares");
          setShowCategorias(false);
        }}>
          Más populares
        </button>

        <button onClick={() => navigate("/carrito")}>Mis libros 🛒</button>

      </nav>

      <section className="ofertas">
        <h3>
          {categoriaSeleccionada === "Todas"
            ? "Ofertas"
            : categoriaSeleccionada === "Más populares"
            ? "Libros más vendidos"
            : `Categoría: ${categoriaSeleccionada}`}
        </h3>
        <hr/>

        <div className="libros-scroll">
          {librosFiltrados.length > 0 ? (
            librosFiltrados.map((libro) => (
              <LibroCard key={libro.id} libro={libro} />
            ))
          ) : (
            <p>No hay libros en esta categoría</p>
          )}
        </div>
      </section>

      <footer className="menu">
        <button>Contacto</button>
        <button>Ayuda</button>
        <button>Servicios</button>
        <button>Información legal</button>
      </footer>
    </div>
  );
}

export default Catalogo;