import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { fetchMe } from '../features/auth/api'
import type { MeResponse } from '../types'

interface AuthUser {
  id: number
  nome: string
  email: string
  role: string
}

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isAdmin: boolean
  isMember: boolean
  login: (token: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [initialized, setInitialized] = useState(false)

  // On mount: restore session from stored token
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setInitialized(true)
      return
    }
    fetchMe()
      .then((data: MeResponse) => setUser(data))
      .catch(() => {
        localStorage.removeItem('token')
      })
      .finally(() => setInitialized(true))
  }, [])

  const login = useCallback(async (token: string) => {
    localStorage.setItem('token', token)
    try {
      const data = await fetchMe()
      setUser(data)
    } catch {
      localStorage.removeItem('token')
      setUser(null)
    }
  }, [])

  function logout() {
    localStorage.removeItem('token')
    setUser(null)
  }

  const isAdmin  = user?.role === 'ROLE_ADMINISTRATOR'
  const isMember = user?.role === 'ROLE_MEMBER' || isAdmin

  if (!initialized) return null

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: user !== null, isAdmin, isMember, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext deve ser usado dentro de AuthProvider')
  return ctx
}
