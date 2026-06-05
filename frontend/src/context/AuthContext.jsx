import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token')
    const rol   = localStorage.getItem('rol')
    const userId = localStorage.getItem('userId')
    return token ? { token, rol, userId } : null
  })

  const login = (data) => {
    localStorage.setItem('token',  data.token)
    localStorage.setItem('rol',    data.rol)
    localStorage.setItem('userId', data.userId)
    setAuth({ token: data.token, rol: data.rol, userId: data.userId })
  }

  const logout = () => {
    localStorage.clear()
    setAuth(null)
  }

  return <AuthContext.Provider value={{ auth, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
