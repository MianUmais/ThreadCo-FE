import { createContext, useContext, useEffect, useState } from 'react'
import { setAuthToken, clearAuthToken, setRefreshCallback, clearRefreshCallback } from '../api/client'
import { authLogin, authRegister, authRefresh } from '../api/auth'

const KEYS = {
  accessToken: 'tc_access_token',
  refreshToken: 'tc_refresh_token',
  user: 'tc_user',
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Restores session from localStorage on mount.
  useEffect(() => {
    const token = localStorage.getItem(KEYS.accessToken)
    const stored = localStorage.getItem(KEYS.user)
    if (token && stored) {
      try {
        const parsedUser = JSON.parse(stored)
        setUser(parsedUser)
        setIsAuthenticated(true)
        setAuthToken(token)
        setRefreshCallback(doRefresh)
      } catch {
        clearSession()
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function persistSession(userData, accessToken, refreshToken) {
    localStorage.setItem(KEYS.accessToken, accessToken)
    localStorage.setItem(KEYS.refreshToken, refreshToken)
    localStorage.setItem(KEYS.user, JSON.stringify(userData))
    setAuthToken(accessToken)
    setRefreshCallback(doRefresh)
    setUser(userData)
    setIsAuthenticated(true)
  }

  function clearSession() {
    localStorage.removeItem(KEYS.accessToken)
    localStorage.removeItem(KEYS.refreshToken)
    localStorage.removeItem(KEYS.user)
    clearAuthToken()
    clearRefreshCallback()
    setUser(null)
    setIsAuthenticated(false)
  }

  // Called by client.js on 401 — returns new access token or null.
  async function doRefresh() {
    const rt = localStorage.getItem(KEYS.refreshToken)
    if (!rt) { clearSession(); return null }
    try {
      const data = await authRefresh({ refreshToken: rt })
      const newToken = data.access_token
      setAuthToken(newToken)
      localStorage.setItem(KEYS.accessToken, newToken)
      return newToken
    } catch {
      clearSession()
      return null
    }
  }

  // Returns the API response on success; throws ApiError/mock errors for callers to handle.
  async function login({ email, password }) {
    const data = await authLogin({ email, password })
    persistSession(data.user, data.access_token, data.refresh_token)
    return data
  }

  async function register({ email, password, name }) {
    const data = await authRegister({ email, password, name })
    persistSession(data.user, data.access_token, data.refresh_token)
    return data
  }

  function logout() {
    clearSession()
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
