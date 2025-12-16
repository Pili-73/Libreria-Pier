// src/utils/auth.js
import { supabase } from '../lib/supabase'

export const Auth = {
  // Iniciar sesión con NOMBRE DE USUARIO
  async signIn(nombre, password) {
    try {
      // 1. Buscar usuario por nombre en user_profiles
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('nombre', nombre)
        .single()

      if (profileError || !profile) {
        return { user: null, profile: null, error: 'Usuario o contraseña incorrectos' }
      }

      // 2. Obtener el email asociado a este usuario desde auth.users
      const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()
      
      if (usersError) {
        // Si no podemos usar admin, intentar con el email construido
        // Asumimos que el email es nombre@libreria.com
        const email = `${nombre}@libreria.com`
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (error) {
          return { user: null, profile: null, error: 'Usuario o contraseña incorrectos' }
        }

        // Guardar en sessionStorage
        sessionStorage.setItem('user_session', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          nombre: profile.nombre,
          rol: profile.rol,
          ciudad: profile.ciudad
        }))

        return { user: data.user, profile, error: null }
      }

      // 3. Encontrar el usuario por ID
      const authUser = users.find(u => u.id === profile.id)
      
      if (!authUser) {
        return { user: null, profile: null, error: 'Usuario o contraseña incorrectos' }
      }

      // 4. Intentar login con el email del usuario
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authUser.email,
        password
      })

      if (error) {
        return { user: null, profile: null, error: 'Usuario o contraseña incorrectos' }
      }

      // 5. Guardar en sessionStorage
      sessionStorage.setItem('user_session', JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        nombre: profile.nombre,
        rol: profile.rol,
        ciudad: profile.ciudad
      }))

      return { user: data.user, profile, error: null }
    } catch (err) {
      console.error('Error en signIn:', err)
      return { user: null, profile: null, error: 'Error al iniciar sesión' }
    }
  },

  // Crear cuenta con NOMBRE DE USUARIO
  async signUp(nombre, password, ciudad) {
    try {
      // Verificar que el nombre no exista
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('nombre')
        .eq('nombre', nombre)
        .single()

      if (existingProfile) {
        return { user: null, error: 'El nombre de usuario ya existe' }
      }

      // Crear email automático: nombre@libreria.com
      const email = `${nombre}@libreria.com`

      // 1. Crear usuario en auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nombre, ciudad }
        }
      })

      if (authError) {
        if (authError.message.includes('already registered')) {
          return { user: null, error: 'El usuario ya existe' }
        }
        return { user: null, error: authError.message }
      }

      // 2. Crear perfil
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          nombre,
          ciudad,
          rol: 'user'
        })

      if (profileError) {
        return { user: null, error: 'Error al crear el perfil: ' + profileError.message }
      }

      return { user: authData.user, error: null }
    } catch (err) {
      console.error('Error en signUp:', err)
      return { user: null, error: 'Error al crear la cuenta' }
    }
  },

  // Cerrar sesión
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      sessionStorage.removeItem('user_session')
      
      if (error) throw error
      return { error: null }
    } catch (err) {
      return { error: err.message }
    }
  },

  // Obtener usuario actual
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        // Intentar recuperar de sessionStorage
        const stored = sessionStorage.getItem('user_session')
        if (stored) {
          return { user: JSON.parse(stored), error: null }
        }
        return { user: null, error: 'No hay sesión activa' }
      }

      // Cargar perfil
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      return { 
        user: {
          ...user,
          nombre: profile?.nombre,
          rol: profile?.rol,
          ciudad: profile?.ciudad
        }, 
        error: null 
      }
    } catch (err) {
      return { user: null, error: err.message }
    }
  },

  // Verificar si es admin
  isAdmin() {
    const stored = sessionStorage.getItem('user_session')
    if (stored) {
      const user = JSON.parse(stored)
      return user.rol === 'admin'
    }
    return false
  }
}

// Mantener compatibilidad con Session antiguo
export const Session = {
  set(user) {
    sessionStorage.setItem('user_session', JSON.stringify(user))
  },
  
  get() {
    const stored = sessionStorage.getItem('user_session')
    return stored ? JSON.parse(stored) : null
  },
  
  isAdmin() {
    return Auth.isAdmin()
  },
  
  clear() {
    sessionStorage.removeItem('user_session')
    Auth.signOut()
  }
}