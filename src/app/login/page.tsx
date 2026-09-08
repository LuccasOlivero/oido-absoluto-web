'use client'

import { useState } from 'react'
import { login } from '../actions'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-stone-950 border border-stone-800 p-6 sm:p-8 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.8)]">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 font-mono uppercase tracking-widest drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">
            CONEXIÓN GLOBAL
          </h1>
          <p className="text-stone-400 text-xs font-mono uppercase mt-2 tracking-widest">
            Inicia sesión para continuar
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/40 text-red-400 rounded-xl text-sm font-mono border border-red-900/50 shadow-[0_0_10px_rgba(220,38,38,0.2)]">
            {error}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-cyan-600 mb-1">
              Identificación (Apodo)
            </label>
            <input
              type="text"
              name="player_name"
              required
              className="w-full px-4 py-3 bg-black text-cyan-400 font-mono rounded-xl border border-cyan-900/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm placeholder-cyan-900/50 shadow-[inset_0_0_10px_rgba(34,211,238,0.1)]"
              placeholder="Ej: Melómano77"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-fuchsia-600 mb-1">
              Clave de Acceso
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-3 bg-black text-fuchsia-400 font-mono rounded-xl border border-fuchsia-900/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 text-sm placeholder-fuchsia-900/50 shadow-[inset_0_0_10px_rgba(217,70,239,0.1)]"
              placeholder="••••••••"
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
                <span>AUTENTICANDO...</span>
              </>
            ) : (
              'INICIAR SESIÓN'
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-xs font-bold text-stone-500 uppercase tracking-widest">
          ¿Sin identificar?{' '}
          <Link href="/register" className="text-cyan-400 hover:text-cyan-300 transition-colors drop-shadow-[0_0_5px_rgba(34,211,238,0.5)] ml-1">
            REGISTRARSE
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
