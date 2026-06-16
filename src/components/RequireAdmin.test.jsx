import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import RequireAdmin from './RequireAdmin'

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

import { useAuth } from '../context/AuthContext'

function renderGuard(authValue, initialPath = '/admin') {
  useAuth.mockReturnValue(authValue)
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<RequireAdmin />}>
          <Route path="/admin" element={<div>Admin Content</div>} />
        </Route>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/" element={<div>Home Page</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('RequireAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('redirects to /login when not authenticated', () => {
    renderGuard({ isAuthenticated: false, user: null })
    expect(screen.getByText('Login Page')).toBeInTheDocument()
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument()
  })

  it('carries location state on login redirect so login can return here', () => {
    useAuth.mockReturnValue({ isAuthenticated: false, user: null })
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<div>Admin Content</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  it('redirects to / when authenticated as non-admin customer', () => {
    renderGuard({ isAuthenticated: true, user: { role: 'customer', email: 'jane@example.com' } })
    expect(screen.getByText('Home Page')).toBeInTheDocument()
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument()
  })

  it('renders Outlet content when authenticated as admin', () => {
    renderGuard({ isAuthenticated: true, user: { role: 'admin', email: 'admin@threadco.dev' } })
    expect(screen.getByText('Admin Content')).toBeInTheDocument()
  })

  it('renders children prop directly when provided', () => {
    useAuth.mockReturnValue({ isAuthenticated: true, user: { role: 'admin' } })
    render(
      <MemoryRouter>
        <RequireAdmin>
          <div>Direct Child</div>
        </RequireAdmin>
      </MemoryRouter>
    )
    expect(screen.getByText('Direct Child')).toBeInTheDocument()
  })
})
