// src/components/CarritoItem.jsx
import React from "react";

export default function CarritoItem({ item, onUpdateQuantity, onRemove, disabled }) {
  const precio = typeof item.precio === 'number' ? item.precio : parseFloat(item.precio) || 0;
  const subtotal = (precio * item.quantity).toFixed(2);

  const incrementQuantity = () => {
    onUpdateQuantity(item.cartItemId, item.quantity + 1);
  };

  const decrementQuantity = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.cartItemId, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    if (window.confirm(`¿Eliminar "${item.titulo}" del carrito?`)) {
      onRemove(item.cartItemId);
    }
  };

  return (
    <div className="carrito-item">
      <img 
        src={item.imagen ? `/${item.imagen}` : "/images/default.jpg"} 
        alt={item.titulo}
        onError={(e) => {
          e.target.src = "/images/default.jpg";
        }}
      />
      
      <div className="carrito-item-info">
        <h3>{item.titulo}</h3>
        <p className="autor">{item.autor}</p>
        <p className="precio">{precio.toFixed(2)}€ / unidad</p>
      </div>

      <div className="carrito-item-controls">
        <div className="quantity-control">
          <button 
            onClick={decrementQuantity}
            disabled={disabled}
            className="btn-qty"
          >
            -
          </button>
          <span className="quantity">{item.quantity}</span>
          <button 
            onClick={incrementQuantity}
            disabled={disabled}
            className="btn-qty"
          >
            +
          </button>
        </div>

        <p className="subtotal">Subtotal: {subtotal}€</p>

        <button 
          onClick={handleRemove}
          disabled={disabled}
          className="btn-remove"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}