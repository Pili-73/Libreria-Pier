// src/test-supabase.js (temporal, luego lo borras)
import { supabase } from './lib/supabase'

async function testConnection() {
  const { data, error } = await supabase
    .from('books')
    .select('count')
  
  if (error) {
    console.error('❌ Error conectando a Supabase:', error)
  } else {
    console.log('✅ Conexión exitosa a Supabase!')
    console.log('Datos:', data)
  }
}

testConnection()