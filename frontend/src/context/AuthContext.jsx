import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const token = sessionStorage.getItem('token')
    const rol   = sessionStorage.getItem('rol')
    const userId = sessionStorage.getItem('userId')
    const nombre = sessionStorage.getItem('nombre')
    return token ? { token, rol, userId, nombre } : null
  })

  const login = (data) => {
    sessionStorage.setItem('token',  data.token)
    sessionStorage.setItem('rol',    data.rol)
    sessionStorage.setItem('userId', data.userId)
    sessionStorage.setItem('nombre', data.nombre ?? data.userId)
    setAuth({ token: data.token, rol: data.rol, userId: data.userId, nombre: data.nombre ?? data.userId })
  }

  const logout = () => {
    sessionStorage.clear()
    setAuth(null)
  }

  return <AuthContext.Provider value={{ auth, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
