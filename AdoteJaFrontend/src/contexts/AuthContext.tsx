import { createContext, useContext, useState, type ReactNode } from 'react'

interface JwtPayload {
  sub: string   // email
  iss: string
  iat: number
  exp: number
}

interface AuthUser {
  email: string
}

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function decodeToken(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
  } catch {
    return null
  }
}

function tokenToUser(token: string): AuthUser | null {
  const payload = decodeToken(token)
  if (!payload) return null
  if (payload.exp * 1000 < Date.now()) return null   // reject expired tokens
  return { email: payload.sub }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const token = localStorage.getItem('token')
    return token ? tokenToUser(token) : null
  })

  function login(token: string) {
    localStorage.setItem('token', token)
    setUser(tokenToUser(token))
  }

  function logout() {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: user !== null, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext deve ser usado dentro de AuthProvider')
  return ctx
}
