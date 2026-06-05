import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PrivateRoute({ children, rol }) {
  const { auth } = useAuth()
  if (!auth) return <Navigate to="/" replace />
  if (rol && auth.rol !== `ROLE_${rol}`) return <Navigate to="/" replace />
  return children
}
