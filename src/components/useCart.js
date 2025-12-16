import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Session } from '../utils/sesion'

export function useCart() {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar carrito del usuario actual
  const fetchCart = async () => {
    const user = Session.get()
    if (!user) {
      setCart([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          books (
            id,
            titulo,
            autor,
            precio,
            imagen,
            descripcion
          )
        `)
        .eq('user_id', user.id)
      
      if (error) throw error
      
      // Transformar datos para usar más fácil
      const cartItems = data.map(item => ({
        cartItemId: item.id,
        quantity: item.quantity,
        ...item.books
      }))
      
      setCart(cartItems)
    } catch (err) {
      console.error('Error cargando carrito:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  // Añadir o actualizar cantidad de un libro en el carrito
  const addToCart = async (bookId, quantity = 1) => {
    const user = Session.get()
    if (!user) {
      alert('Debes iniciar sesión para añadir al carrito')
      return { error: 'No hay sesión' }
    }

    try {
      // Verificar si el libro ya está en el carrito
      const { data: existing } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('book_id', bookId)
        .single()

      if (existing) {
        // Actualizar cantidad
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id)

        if (error) throw error
      } else {
        // Insertar nuevo item
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            book_id: bookId,
            quantity
          })

        if (error) throw error
      }

      // Recargar carrito
      await fetchCart()
      return { error: null }
    } catch (err) {
      console.error('Error añadiendo al carrito:', err)
      return { error: err.message }
    }
  }

  // Actualizar cantidad de un item específico
  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) {
      return removeFromCart(cartItemId)
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', cartItemId)

      if (error) throw error

      // Actualizar estado local
      setCart(prev => prev.map(item => 
        item.cartItemId === cartItemId 
          ? { ...item, quantity: newQuantity }
          : item
      ))

      return { error: null }
    } catch (err) {
      console.error('Error actualizando cantidad:', err)
      return { error: err.message }
    }
  }

  // Eliminar un item del carrito
  const removeFromCart = async (cartItemId) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId)

      if (error) throw error

      // Actualizar estado local
      setCart(prev => prev.filter(item => item.cartItemId !== cartItemId))
      return { error: null }
    } catch (err) {
      console.error('Error eliminando del carrito:', err)
      return { error: err.message }
    }
  }

  // Vaciar todo el carrito
  const clearCart = async () => {
    const user = Session.get()
    if (!user) return { error: 'No hay sesión' }

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)

      if (error) throw error

      setCart([])
      return { error: null }
    } catch (err) {
      console.error('Error vaciando carrito:', err)
      return { error: err.message }
    }
  }

  // Calcular total
  const getTotal = () => {
    return cart.reduce((sum, item) => {
      const precio = typeof item.precio === 'number' ? item.precio : parseFloat(item.precio) || 0
      return sum + (precio * item.quantity)
    }, 0)
  }

  // Contar items totales
  const getItemCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }

  return {
    cart,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotal,
    getItemCount,
    refetch: fetchCart
  }
}