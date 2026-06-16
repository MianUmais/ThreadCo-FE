// Auth API module — wraps /api/auth/* endpoints.
// Falls back to mock data only when VITE_API_URL is absent (NoBackendError).
// Real 401/409/400 responses propagate unchanged to callers.
import { api, NoBackendError } from './client'
import { mockRegister, mockLogin, mockRefresh, mockMe } from './mock'

function isMock(err) {
  return err instanceof NoBackendError
}

export async function authRegister({ email, password, name }) {
  try {
    return await api.post('/api/auth/register', { email, password, name })
  } catch (err) {
    if (isMock(err)) return mockRegister({ email, password, name })
    throw err
  }
}

export async function authLogin({ email, password }) {
  try {
    return await api.post('/api/auth/login', { email, password })
  } catch (err) {
    if (isMock(err)) return mockLogin({ email, password })
    throw err
  }
}

export async function authRefresh({ refreshToken }) {
  try {
    return await api.post('/api/auth/refresh', { refresh_token: refreshToken })
  } catch (err) {
    if (isMock(err)) return mockRefresh({ refreshToken })
    throw err
  }
}

// storedUser is passed so mock mode can return it without a server round-trip.
export async function authMe(storedUser) {
  try {
    return await api.get('/api/auth/me')
  } catch (err) {
    if (isMock(err)) return mockMe(storedUser)
    throw err
  }
}
