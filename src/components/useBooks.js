// src/hooks/useBooks.js
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useBooks() {
  const [libros, setLibros] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar libros desde Supabase
  const fetchLibros = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('titulo')
      
      if (error) throw error
      setLibros(data)
    } catch (err) {
      console.error('Error cargando libros:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLibros()
  }, [])

  // Actualizar un libro
  const updateLibro = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('books')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      
      // Actualizar estado local
      setLibros(prev => prev.map(l => l.id === id ? data : l))
      return { data, error: null }
    } catch (err) {
      console.error('Error actualizando libro:', err)
      return { data: null, error: err.message }
    }
  }

  // Eliminar un libro
  const deleteLibro = async (id) => {
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      // Actualizar estado local
      setLibros(prev => prev.filter(l => l.id !== id))
      return { error: null }
    } catch (err) {
      console.error('Error eliminando libro:', err)
      return { error: err.message }
    }
  }

  // Obtener un libro por ID
  const getLibroById = async (id) => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (err) {
      console.error('Error obteniendo libro:', err)
      return { data: null, error: err.message }
    }
  }

  return {
    libros,
    loading,
    error,
    updateLibro,
    deleteLibro,
    getLibroById,
    refetch: fetchLibros
  }
}