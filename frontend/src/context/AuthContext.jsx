import { createContext, useContext, useEffect, useState } from 'react'

import api from '../api/api.js'

const AuthContext = createContext(null)

const storageKeys = {
  token: 'taskflow-token',
  user: 'taskflow-user',
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(storageKeys.token))
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(storageKeys.user)
    return storedUser ? JSON.parse(storedUser) : null
  })
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(localStorage.getItem(storageKeys.token)))

  useEffect(() => {
    async function bootstrapUser() {
      if (!token) {
        setIsBootstrapping(false)
        return
      }

      try {
        const { data } = await api.get('/auth/me')
        setUser(data)
        localStorage.setItem(storageKeys.user, JSON.stringify(data))
      } catch {
        localStorage.removeItem(storageKeys.token)
        localStorage.removeItem(storageKeys.user)
        setToken(null)
        setUser(null)
      } finally {
        setIsBootstrapping(false)
      }
    }

    bootstrapUser()
  }, [token])

  async function authenticate(endpoint, payload) {
    const { data } = await api.post(`/auth/${endpoint}`, payload)

    localStorage.setItem(storageKeys.token, data.token)
    localStorage.setItem(storageKeys.user, JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
    return data.user
  }

  function logout() {
    localStorage.removeItem(storageKeys.token)
    localStorage.removeItem(storageKeys.user)
    setToken(null)
    setUser(null)
  }

  const value = {
    isAuthenticated: Boolean(token),
    isBootstrapping,
    token,
    user,
    login: (payload) => authenticate('login', payload),
    register: (payload) => authenticate('register', payload),
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}