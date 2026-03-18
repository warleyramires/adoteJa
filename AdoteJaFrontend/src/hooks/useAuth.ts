import { useState } from 'react'

export function useAuth() {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('token')
  )

  const isAuthenticated = token !== null

  function saveToken(newToken: string) {
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }

  function clearToken() {
    localStorage.removeItem('token')
    setToken(null)
  }

  return { token, isAuthenticated, saveToken, clearToken }
}
