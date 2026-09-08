'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { detectCountryCode } from '@/lib/geo'
import { z } from 'zod'

const signupSchema = z.object({
  email: z.string({ message: 'El correo es requerido.' }).email('Correo inválido.'),
  player_name: z.string({ message: 'El apodo es requerido.' })
    .min(3, 'El apodo debe tener al menos 3 caracteres.')
    .max(20, 'El apodo no puede tener más de 20 caracteres.')
    .regex(/^[a-zA-Z0-9_]+$/, 'El apodo solo puede contener letras, números y guiones bajos.'),
  password: z.string({ message: 'La contraseña es requerida.' }).min(6, 'La contraseña debe tener al menos 6 caracteres.'),
})

const loginSchema = z.object({
  player_name: z.string({ message: 'El apodo es requerido.' }).min(1, 'El apodo es requerido.').max(20, 'El apodo no puede tener más de 20 caracteres.'),
  password: z.string({ message: 'La contraseña es requerida.' }).min(1, 'La contraseña es requerida.'),
})

export async function login(formData: FormData) {
  const playerName = formData.get('player_name') as string
  const password = formData.get('password') as string

  const parsed = loginSchema.safeParse({ player_name: playerName, password })
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  // Use service role key to create admin client for RPC
  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Get email by username via secure RPC
  const { data: email, error: rpcError } = await adminSupabase.rpc('get_email_by_username', { p_username: playerName })

  if (rpcError || !email) {
    return { error: 'Apodo o contraseña incorrectos.' }
  }

  const supabase = await createClient()

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
  const email = formData.get('email') as string
  const playerName = formData.get('player_name') as string
  const password = formData.get('password') as string

  const parsed = signupSchema.safeParse({ email, player_name: playerName, password })
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()

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
    // Insert profile using admin client to bypass RLS
    const adminSupabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { error: profileError } = await adminSupabase.from('profiles').insert({
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
