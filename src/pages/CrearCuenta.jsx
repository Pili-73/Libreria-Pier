import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CrearCuenta.css";
import { Auth } from "../utils/auth.js";

export default function CrearCuenta() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [repite, setRepite] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const registrarUsuario = async () => {
    setError("");

    // Validaciones
    if (!usuario || !contrasena || !repite || !ciudad) {
      setError("Rellena todos los campos");
      return;
    }

    if (contrasena !== repite) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (contrasena.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (usuario.length < 3) {
      setError("El usuario debe tener al menos 3 caracteres");
      return;
    }

    setLoading(true);

    try {
      const { user, error: authError } = await Auth.signUp(
        usuario,
        contrasena,
        ciudad
      );

      if (authError) {
        if (authError.includes("ya existe")) {
          setError("El nombre de usuario ya existe");
        } else {
          setError(authError);
        }
        return;
      }

      if (user) {
        alert("Cuenta creada exitosamente.");
        navigate("/login");
      }
    } catch (err) {
      setError("Error al crear la cuenta");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crear-root">
      <h2>CREAR CUENTA</h2>
      
      {error && <div className="error">{error}</div>}
      
      <div className="form">
        <input 
          placeholder="Nombre de usuario" 
          value={usuario} 
          onChange={e => setUsuario(e.target.value)}
          disabled={loading}
        />
        
        <select 
          value={ciudad} 
          onChange={e => setCiudad(e.target.value)}
          disabled={loading}
        >
          <option value="">Selecciona ciudad</option>
          <option>Madrid</option>
          <option>Barcelona</option>
          <option>Valencia</option>
          <option>Sevilla</option>
          <option>Zaragoza</option>
        </select>
        
        <input 
          placeholder="Contraseña (mín 6 caract.)" 
          type="password" 
          value={contrasena} 
          onChange={e => setContrasena(e.target.value)}
          disabled={loading}
        />
        
        <input 
          placeholder="Repite contraseña" 
          type="password" 
          value={repite} 
          onChange={e => setRepite(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="actions">
        <button 
          className="btn" 
          onClick={registrarUsuario}
          disabled={loading}
        >
          {loading ? "Creando..." : "Crear Cuenta"}
        </button>
        
        <button 
          className="btn cancelar" 
          onClick={() => navigate("/login")}
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}