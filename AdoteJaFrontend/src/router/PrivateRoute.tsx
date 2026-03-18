import { Navigate, Outlet } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'

export function PrivateRoute() {
  const { isAuthenticated } = useAuthContext()
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export function AdminRoute() {
  const { isMember } = useAuthContext()
  return isMember ? <Outlet /> : <Navigate to="/" replace />
}
