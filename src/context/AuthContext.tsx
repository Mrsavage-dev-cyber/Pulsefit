import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'

interface AuthContextValue {
  session: Session | null
  user: User | null
  loading: boolean
  justSignedUp: boolean
  clearJustSignedUp: () => void
  justSignedIn: boolean
  clearJustSignedIn: () => void
  justSignedOut: boolean
  clearJustSignedOut: () => void
  signUp: (email: string, password: string) => Promise<{ error: string | null; needsEmailConfirmation: boolean }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signInWithGoogle: () => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [justSignedUp, setJustSignedUp] = useState(false)
  const [justSignedIn, setJustSignedIn] = useState(false)
  const [justSignedOut, setJustSignedOut] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })

    return () => subscription.subscription.unsubscribe()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      justSignedUp,
      clearJustSignedUp() {
        setJustSignedUp(false)
      },
      justSignedIn,
      clearJustSignedIn() {
        setJustSignedIn(false)
      },
      justSignedOut,
      clearJustSignedOut() {
        setJustSignedOut(false)
      },
      async signUp(email, password) {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) return { error: error.message, needsEmailConfirmation: false }
        const needsEmailConfirmation = !data.session
        if (!needsEmailConfirmation) setJustSignedUp(true)
        return { error: null, needsEmailConfirmation }
      },
      async signIn(email, password) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (!error) setJustSignedIn(true)
        return { error: error?.message ?? null }
      },
      async signInWithGoogle() {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: window.location.origin },
        })
        return { error: error?.message ?? null }
      },
      async signOut() {
        setJustSignedOut(true)
        await supabase.auth.signOut()
      },
    }),
    [session, loading, justSignedUp, justSignedIn, justSignedOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
