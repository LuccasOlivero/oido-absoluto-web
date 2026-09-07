'use client'

import React, { useState, useEffect } from 'react'
import { LogOut, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function UserMenu() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (profile) {
          setProfile(profile)
        }
      }
      setLoading(false)
    }
    fetchUser()
  }, [])

  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-stone-800 animate-pulse" />
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center justify-center sm:gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-black/60 backdrop-blur-sm hover:bg-purple-950/50 text-purple-400 border border-purple-900/50 font-bold uppercase tracking-wider text-[10px] sm:text-xs transition-all cursor-pointer shadow-[0_0_10px_rgba(168,85,247,0.15)] hover:shadow-[0_0_15px_rgba(168,85,247,0.25)] active:scale-95"
      >
        <User className="w-5 h-5 sm:w-3.5 sm:h-3.5" />
        <span className="hidden sm:inline">INGRESAR</span>
      </Link>
    )
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3 bg-black/60 backdrop-blur-sm p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-stone-800 shadow-[0_0_8px_rgba(0,0,0,0.3)]">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center text-xs sm:text-[10px] font-black text-white shadow-[0_0_5px_rgba(217,70,239,0.5)]">
          {profile?.player_name?.substring(0, 2).toUpperCase() || 'U'}
        </div>
        <span className="text-xs font-bold text-stone-300 hidden sm:block">
          {profile?.player_name || 'Usuario'}
        </span>
      </div>
      <div className="w-px h-4 bg-stone-800 hidden sm:block" />
      <button
        onClick={handleLogout}
        className="text-stone-500 hover:text-red-400 transition-colors px-1 sm:px-0"
        title="Cerrar sesión"
      >
        <LogOut className="w-5 h-5 sm:w-4 sm:h-4" />
      </button>
    </div>
  )
}
