'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { detectCountryCode } from '@/lib/geo'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const playerName = formData.get('player_name') as string
  const password = formData.get('password') as string

  // Get email by username via secure RPC
  const { data: email, error: rpcError } = await supabase.rpc('get_email_by_username', { p_username: playerName })

  if (rpcError || !email) {
    return { error: 'Apodo o contraseña incorrectos.' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Apodo o contraseña incorrectos.' }
    }
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const playerName = formData.get('player_name') as string
  const password = formData.get('password') as string

  if (playerName.trim().length < 3) {
    return { error: 'El apodo debe tener al menos 3 caracteres.' }
  }

  // Comprobar si el apodo ya existe antes de crear la cuenta
  const { data: existingProfile } = await supabase.from('profiles').select('id').eq('player_name', playerName).single()
  if (existingProfile) {
    return { error: 'Ese apodo ya está en uso. Por favor, elige otro.' }
  }

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    if (error.message.includes('User already registered')) {
      return { error: 'Este correo ya está registrado.' }
    }
    return { error: error.message }
  }

  // Detect country
  let countryCode = 'AR'
  try {
    countryCode = await detectCountryCode()
  } catch (err) {
    // fallback
  }

  if (authData.user) {
    // Insert profile
    const { error: profileError } = await supabase.from('profiles').insert({
      id: authData.user.id,
      player_name: playerName,
      country_code: countryCode
    })

    if (profileError) {
      console.error('Error creating profile', profileError)
      // Non-blocking for now
    }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
