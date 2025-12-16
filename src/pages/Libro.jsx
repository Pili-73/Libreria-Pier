import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Session } from "../utils/auth.js";
import { useBooks } from "../components/useBooks";
import { useCart } from "../components/useCart";
import "./Libro.css";

export default function Libro() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { getLibroById, updateLibro, deleteLibro } = useBooks();
  const { addToCart } = useCart();

  const [libro, setLibro] = useState(location.state?.libro ?? null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1); // Cantidad a añadir al carrito
  const [form, setForm] = useState({ 
    titulo: "", 
    autor: "", 
    descripcion: "", 
    precio: "" 
  });

  // Cargar datos del libro si no vienen del state
  useEffect(() => {
    if (!libro) {
      loadLibro();
    } else {
      setForm({
        titulo: libro.titulo,
        autor: libro.autor,
        descripcion: libro.descripcion,
        precio: libro.precio || ""
      });
    }
  }, [id]);

  const loadLibro = async () => {
    setLoading(true);
    const { data, error } = await getLibroById(id);
    
    if (error) {
      console.error("Error cargando libro:", error);
      alert("No se pudo cargar el libro");
      navigate("/");
      return;
    }

    if (data) {
      setLibro(data);
      setForm({
        titulo: data.titulo,
        autor: data.autor,
        descripcion: data.descripcion,
        precio: data.precio || ""
      });
    }
    setLoading(false);
  };

  // Actualizar form cuando cambia el libro
  useEffect(() => {
    if (libro) {
      setForm({
        titulo: libro.titulo,
        autor: libro.autor,
        descripcion: libro.descripcion,
        precio: libro.precio || ""
      });
    }
  }, [libro]);

  // Función para guardar cambios
  const guardarCambios = async () => {
    setLoading(true);
    
    const { data, error } = await updateLibro(libro.id, {
      titulo: form.titulo,
      autor: form.autor,
      descripcion: form.descripcion,
      precio: parseFloat(form.precio) || 0
    });

    if (error) {
      alert("Error al guardar los cambios: " + error);
    } else {
      setLibro(data);
      setEditMode(false);
      alert("Cambios guardados correctamente");
    }
    
    setLoading(false);
  };

  // Función para eliminar libro
  const eliminarLibro = async () => {
    if (!window.confirm("¿Seguro que quieres eliminar este libro?")) return;
    
    setLoading(true);
    const { error } = await deleteLibro(libro.id);

    if (error) {
      alert("Error al eliminar el libro: " + error);
      setLoading(false);
    } else {
      alert("Libro eliminado correctamente");
      navigate("/");
    }
  };

  // Función para añadir al carrito
  const handleAddToCart = async () => {
    if (!Session.get()) {
      alert("Debes iniciar sesión para añadir al carrito");
      navigate("/login");
      return;
    }

    setLoading(true);
    const { error } = await addToCart(libro.id, quantity);

    if (error) {
      alert("Error al añadir al carrito: " + error);
    } else {
      alert(`${quantity} unidad(es) de "${libro.titulo}" añadidas al carrito`);
      setQuantity(1); // Resetear cantidad
    }
    setLoading(false);
  };

  // Incrementar cantidad
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  // Decrementar cantidad
  const decrementQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  // Pantalla de carga
  if (loading || !libro) {
    return (
      <div className="libro-root">
        <header className="topbar">
          <h1 className="titulo">LIBRERÍA PIER</h1>
        </header>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  const isAdmin = Session.isAdmin();

  return (
    <div className="libro-root">
      <header className="topbar">
        <h1>LIBRERÍA PIER</h1>
        <div className="top-actions">
          <button className="linklike" onClick={() => navigate("/login")}>
            Iniciar sesión
          </button>
        </div>
      </header>

      <nav className="menu">
        <button onClick={() => navigate("/")}>Inicio</button>
        <div className="dropdown">
          <button>Categorías</button>
        </div>
        <button>Más populares</button>
        <button onClick={() => navigate("/carrito")}>Mis libros 🛒</button>
      </nav>

      <div className="detalle">
        <img 
          src={libro.imagen ? `/${libro.imagen}` : "/images/default.jpg"} 
          alt={libro.titulo} 
        />
        
        <div className="info">
          {editMode ? (
            <>
              <input 
                value={form.titulo} 
                onChange={e => setForm({...form, titulo: e.target.value})}
                placeholder="Título"
              />
              <input 
                value={form.autor} 
                onChange={e => setForm({...form, autor: e.target.value})}
                placeholder="Autor"
              />
              <textarea 
                value={form.descripcion} 
                onChange={e => setForm({...form, descripcion: e.target.value})}
                placeholder="Descripción"
                rows={5}
              />
              <input 
                value={form.precio} 
                onChange={e => setForm({...form, precio: e.target.value})}
                placeholder="Precio (ej: 19.90)"
                type="number"
                step="0.01"
              />
            </>
          ) : (
            <>
              <h2>{libro.titulo}</h2>
              <h4>{libro.autor}</h4>
              <p className="desc">{libro.descripcion}</p>
              <p className="precio">{libro.precio}€</p>
            </>
          )}

          <div className="acciones">
            {isAdmin ? (
              <>
                {!editMode && (
                  <button 
                    onClick={() => setEditMode(true)} 
                    className="btn"
                  >
                    Editar
                  </button>
                )}
                
                {editMode && (
                  <>
                    <button 
                      onClick={guardarCambios} 
                      className="btn guardar"
                      disabled={loading}
                    >
                      Guardar
                    </button>
                    <button 
                      onClick={() => setEditMode(false)} 
                      className="btn cancelar"
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                  </>
                )}
                
                <button 
                  onClick={eliminarLibro} 
                  className="btn eliminar"
                  disabled={loading}
                >
                  Eliminar
                </button>
              </>
            ) : (
              <div className="add-to-cart">
                <div className="quantity-selector">
                  <button 
                    onClick={decrementQuantity}
                    disabled={loading}
                    className="btn-quantity"
                  >
                    -
                  </button>
                  <span className="quantity-display">{quantity}</span>
                  <button 
                    onClick={incrementQuantity}
                    disabled={loading}
                    className="btn-quantity"
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  disabled={loading}
                  className="btn btn-add-cart"
                >
                  {loading ? "Añadiendo..." : "Añadir al carrito 🛒"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}