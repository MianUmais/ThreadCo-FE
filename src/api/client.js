const BASE_URL = import.meta.env.VITE_API_URL || ''

let authToken = null

export function setAuthToken(token) {
  authToken = token
}

export function clearAuthToken() {
  authToken = null
}

// Thrown for non-2xx responses from the real API.
// status: HTTP status code; code: API error slug; body: parsed JSON or null
export class ApiError extends Error {
  constructor(status, rawBody) {
    let parsed = null
    try { parsed = JSON.parse(rawBody) } catch {}
    super(parsed?.message || rawBody || `HTTP ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.code = parsed?.error ?? null
    this.body = parsed
    this.unavailable = parsed?.unavailable ?? null
  }
}

// Thrown when VITE_API_URL is not configured.
export class NoBackendError extends Error {
  constructor() {
    super('VITE_API_URL not set — using mock data')
    this.name = 'NoBackendError'
  }
}

async function request(path, options = {}) {
  if (!BASE_URL) {
    throw new NoBackendError()
  }

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new ApiError(res.status, body)
  }

  return res.json()
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
}
