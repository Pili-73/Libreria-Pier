import React from "react";
import { useNavigate } from "react-router-dom";

export default function LibroCard({ libro }) {
  const navigate = useNavigate();

  // Función para abrir el libro cuando haces click en él
  const abrirLibro = () => {
    navigate(`/libro/${libro.id}`, { state: { libro } });
  };

  // Formatear precio: si viene como número, añadir el símbolo €
  const formatearPrecio = (precio) => {
    if (typeof precio === 'number') {
      return `${precio.toFixed(2)} €`;
    }
    // Si ya viene como string con €, devolverlo tal cual
    if (typeof precio === 'string' && precio.includes('€')) {
      return precio;
    }
    // Si es string sin €, añadirlo
    return `${precio} €`;
  };

  return (
    <div className="libro-card" onClick={abrirLibro}>
      <img 
        src={libro.imagen ? `/${libro.imagen}` : "/images/default.jpg"} 
        alt={libro.titulo}
        onError={(e) => {
          e.target.src = "/images/default.jpg";
        }}
      />
      <h3>{libro.titulo}</h3>
      <p>{libro.autor}</p>
      <p>{formatearPrecio(libro.precio)}</p>
    </div>
  );
}