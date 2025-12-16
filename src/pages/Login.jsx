import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { Auth } from "../utils/auth.js";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onLogin = async () => {
    setError("");
    
    if (!usuario || !password) {
      setError("Rellena todos los campos");
      return;
    }

    setLoading(true);

    try {
      const { user, profile, error: authError } = await Auth.signIn(usuario, password);
      
      if (authError) {
        setError("Usuario o contraseña incorrectos");
        return;
      }

      if (user && profile) {
        navigate("/");
      }
    } catch (err) {
      setError("Error al iniciar sesión");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onLogin();
    }
  };

  return (
    <div className="login-container">
      <h1>LIBRERÍA PIER</h1>
      <h2 className="subtitulo">INICIO</h2>

      <div className="form">
        <input 
          placeholder="Usuario" 
          value={usuario} 
          onChange={(e) => setUsuario(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        <input 
          placeholder="Contraseña" 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
      </div>

      <button 
        className="btn" 
        onClick={onLogin}
        disabled={loading}
      >
        {loading ? "Iniciando..." : "Iniciar sesión"}
      </button>
      
      <button 
        className="btn volver" 
        onClick={() => navigate("/")}
        disabled={loading}
      >
        Volver
      </button>

      <a className="crear" onClick={() => navigate("/registro")}>
        ¿No tienes cuenta? Pincha aquí
      </a>

      {error && <p className="error">{error}</p>}

      <div className="footer">
        <button>Contacto</button>
        <button>Ayuda</button>
        <button>Servicios</button>
        <button>Información legal</button>
      </div>
    </div>
  );
}