// VITE_API_URL acts as a backend-present signal and as the Vite dev-proxy target
// (set in vite.config.js). API requests always use relative /api/* paths so the
// Vite proxy can forward them without CORS issues. When VITE_API_URL is unset,
// NoBackendError is thrown and callers fall back to mock data.
const BACKEND_CONFIGURED = !!import.meta.env.VITE_API_URL

let authToken = null

export function setAuthToken(token) {
  authToken = token
}

export function clearAuthToken() {
  authToken = null
}

// Thrown for non-2xx responses from the real API.
// status: HTTP status code; code: API error slug; body: parsed JSON or null; fields: per-field validation errors or null
export class ApiError extends Error {
  constructor(status, rawBody) {
    let parsed = null
    try { parsed = JSON.parse(rawBody) } catch {}
    super(parsed?.message || rawBody || `HTTP ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.code = parsed?.error ?? null
    this.body = parsed
    this.fields = parsed?.fields ?? null
    this.unavailable = parsed?.unavailable ?? null
  }
}

// Thrown when VITE_API_URL is not configured (no backend to talk to).
export class NoBackendError extends Error {
  constructor() {
    super('No backend configured (VITE_API_URL unset) — using mock data')
    this.name = 'NoBackendError'
  }
}

// Called on 401: should refresh the access token and return the new token string,
// or return null (and handle logout) if refresh fails.
let _refreshCallback = null
let _isRefreshing = false

export function setRefreshCallback(fn) {
  _refreshCallback = fn
}

export function clearRefreshCallback() {
  _refreshCallback = null
}

async function request(path, options = {}, _isRetry = false) {
  if (!BACKEND_CONFIGURED) {
    throw new NoBackendError()
  }

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }

  // Relative path — the Vite dev proxy routes /api/* to the Flask backend.
  const res = await fetch(path, { ...options, headers })

  if (res.status === 401 && _refreshCallback && !_isRefreshing && !_isRetry) {
    _isRefreshing = true
    let newToken = null
    try {
      newToken = await _refreshCallback()
    } finally {
      _isRefreshing = false
    }
    if (newToken) {
      return request(path, options, true)
    }
    // Refresh failed — fall through to throw the 401
  }

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
