import { Navigate, Outlet } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'

export function PrivateRoute() {
  const { isAuthenticated } = useAuthContext()
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export function AdminRoute() {
  const { isAuthenticated, isMember } = useAuthContext()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return isMember ? <Outlet /> : <Navigate to="/" replace />
}
