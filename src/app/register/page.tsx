'use client'

import { useState } from 'react'
import { signup } from '../actions'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    const formData = new FormData(e.currentTarget)
    const result = await signup(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else if (result?.success) {
      setSuccess(result.success)
      setLoading(false)
      // Opcionalmente podemos resetear el formulario aquí
      e.currentTarget.reset()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-stone-950 border border-stone-800 p-6 sm:p-8 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.8)]">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-amber-500 font-mono uppercase tracking-widest drop-shadow-[0_0_8px_rgba(217,70,239,0.3)]">
            NUEVO PERFIL
          </h1>
          <p className="text-stone-400 text-xs font-mono uppercase mt-2 tracking-widest">
            Sincroniza con la red global
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/40 text-red-400 rounded-xl text-sm font-mono border border-red-900/50 shadow-[0_0_10px_rgba(220,38,38,0.2)]">
            {error}
          </div>
        )}

        {success ? (
          <div className="mb-6 p-5 bg-emerald-950/40 text-emerald-400 rounded-xl text-sm font-mono border border-emerald-900/50 shadow-[0_0_15px_rgba(16,185,129,0.2)] text-center">
            <p className="font-bold text-lg mb-2">¡Misión Cumplida!</p>
            {success}
            <div className="mt-6">
              <Link href="/login" className="px-6 py-2 bg-emerald-900/50 text-emerald-300 rounded-lg hover:bg-emerald-800/50 transition-colors border border-emerald-700/50 font-bold uppercase tracking-widest text-xs">
                Ir a Ingresar
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-cyan-600 mb-1">
                Frecuencia (Email)
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 bg-black text-cyan-400 font-mono rounded-xl border border-cyan-900/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm placeholder-cyan-900/50 shadow-[inset_0_0_10px_rgba(34,211,238,0.1)]"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-fuchsia-600 mb-1">
                Identificación (Apodo)
              </label>
              <input
                type="text"
                name="player_name"
                required
                maxLength={24}
                className="w-full px-4 py-3 bg-black text-fuchsia-400 font-mono rounded-xl border border-fuchsia-900/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 text-sm placeholder-fuchsia-900/50 shadow-[inset_0_0_10px_rgba(217,70,239,0.1)]"
                placeholder="Ej: Melómano77"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-amber-600 mb-1">
                Clave de Acceso
              </label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                className="w-full px-4 py-3 bg-black text-amber-400 font-mono rounded-xl border border-amber-900/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm placeholder-amber-900/50 shadow-[inset_0_0_10px_rgba(245,158,11,0.1)]"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 mt-2 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-black uppercase tracking-widest text-sm shadow-[0_0_15px_rgba(245,158,11,0.4)] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border border-amber-400/50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  <span>SINCRONIZANDO...</span>
                </>
              ) : (
                'REGISTRARSE'
              )}
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-xs font-bold text-stone-500 uppercase tracking-widest">
          ¿Ya registrado?{' '}
          <Link href="/login" className="text-amber-400 hover:text-amber-300 transition-colors drop-shadow-[0_0_5px_rgba(245,158,11,0.5)] ml-1">
            INGRESAR
          </Link>
        </p>
        <div className="mt-4 text-center">
          <Link href="/" className="text-stone-600 hover:text-stone-400 text-[10px] font-mono uppercase tracking-widest transition-colors">
            VOLVER A LA TERMINAL
          </Link>
        </div>
      </div>
    </div>
  )
}
