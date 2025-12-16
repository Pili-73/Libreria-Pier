// src/pages/Carrito.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../components/useCart";
import CarritoItem from "../components/CarritoItem";
import { Session } from "../utils/sesion";
import "./Carrito.css";

export default function Carrito() {
  const navigate = useNavigate();
  const { cart, loading, updateQuantity, removeFromCart, clearCart, getTotal } = useCart();
  const [processing, setProcessing] = useState(false);

  // Verificar si hay sesión
  const user = Session.get();
  if (!user && !loading) {
    return (
      <div className="carrito-container">
        <header className="topbar">
          <h1>LIBRERÍA PIER</h1>
          <div className="top-actions">
            <button className="linklike" onClick={() => navigate("/login")}>
              Iniciar sesión
            </button>
          </div>
        </header>
        <div className="empty-cart">
          <p>Debes iniciar sesión para ver tu carrito</p>
          <button className="btn" onClick={() => navigate("/login")}>
            Iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  const handleComprar = async () => {
    if (cart.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    const confirmar = window.confirm("¿Seguro que desea realizar la compra?");
    
    if (confirmar) {
      setProcessing(true);
      const { error } = await clearCart();
      
      if (error) {
        alert("Error al procesar la compra: " + error);
      } else {
        alert("¡Compra realizada con éxito!");
      }
      
      setProcessing(false);
    }
  };

  const total = getTotal();

  return (
    <div className="carrito-container">
      <header className="topbar">
        <h1>LIBRERÍA PIER</h1>
        <div className="top-actions">
          <button className="linklike" onClick={() => {
            Session.clear();
            navigate("/login");
          }}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <nav className="menu">
        <button onClick={() => navigate("/")}>Inicio</button>
        <button>Categorías</button>
        <button>Más populares</button>
        <button onClick={() => navigate("/carrito")}>Mis libros 🛒</button>
      </nav>

      <div className="carrito-content">
        <h2>Mi Carrito de Compras</h2>

        {loading ? (
          <div className="loading">
            <p>Cargando carrito...</p>
          </div>
        ) : cart.length === 0 ? (
          <div className="empty-cart">
            <p>Tu carrito está vacío</p>
            <button className="btn" onClick={() => navigate("/")}>
              Ir al catálogo
            </button>
          </div>
        ) : (
          <>
            <div className="carrito-items">
              {cart.map((item) => (
                <CarritoItem
                  key={item.cartItemId}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                  disabled={processing}
                />
              ))}
            </div>

            <div className="carrito-resumen">
              <div className="total-section">
                <h3>Total: {total.toFixed(2)}€</h3>
                <p className="items-count">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} artículos
                </p>
              </div>

              <div className="acciones-carrito">
                <button 
                  className="btn btn-comprar"
                  onClick={handleComprar}
                  disabled={processing || cart.length === 0}
                >
                  {processing ? "Procesando..." : "Comprar"}
                </button>
                
                <button 
                  className="btn btn-seguir"
                  onClick={() => navigate("/")}
                  disabled={processing}
                >
                  Seguir comprando
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <footer className="menu">
        <button>Contacto</button>
        <button>Ayuda</button>
        <button>Servicios</button>
        <button>Información legal</button>
      </footer>
    </div>
  );
}