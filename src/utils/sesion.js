// src/utils/sesion.js
import { supabase } from '../lib/supabase'

export const Session = {
  // Obtener usuario actual
  get() {
    try {
      // Primero intenta sessionStorage (más rápido)
      const stored = sessionStorage.getItem("user_session");
      if (stored) {
        return JSON.parse(stored);
      }
      return null;
    } catch (error) {
      console.error("Error obteniendo sesión:", error);
      return null;
    }
  },

  // Guardar usuario en sesión
  set(user) {
    try {
      sessionStorage.setItem("user_session", JSON.stringify(user));
    } catch (error) {
      console.error("Error guardando sesión:", error);
    }
  },

  // Limpiar sesión
  clear() {
    sessionStorage.removeItem("user_session");
    // También cerrar sesión en Supabase
    supabase.auth.signOut();
  },

  // Verificar si el usuario actual es admin
  isAdmin() {
    const user = Session.get();
    return user && (user.rol === "admin" || user.nombre === "admin");
  },

  // Verificar si hay sesión activa
  isAuthenticated() {
    return Session.get() !== null;
  },

  // Obtener usuario desde Supabase (para verificar sesión real)
  async refresh() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        Session.clear();
        return null;
      }

      // Cargar perfil del usuario
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        const userData = {
          id: user.id,
          email: user.email,
          nombre: profile.nombre,
          rol: profile.rol,
          ciudad: profile.ciudad
        };
        Session.set(userData);
        return userData;
      }

      return null;
    } catch (error) {
      console.error("Error refrescando sesión:", error);
      return null;
    }
  }
};