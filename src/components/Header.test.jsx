import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Header from './Header'

vi.mock('../context/CartContext', () => ({
  useCart: () => ({ cartCount: 0 }),
}))

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ isAuthenticated: false, logout: vi.fn() }),
}))

describe('Header', () => {
  function renderHeader() {
    return render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    )
  }

  it('renders the brand logo', () => {
    renderHeader()
    expect(screen.getByText('ThreadCo')).toBeInTheDocument()
  })

  it('renders Shop nav link', () => {
    renderHeader()
    expect(screen.getByRole('link', { name: /shop/i })).toBeInTheDocument()
  })

  it('renders Sign In link when not authenticated', () => {
    renderHeader()
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument()
  })

  it('renders the cart action', () => {
    renderHeader()
    expect(screen.getByRole('link', { name: /cart/i })).toBeInTheDocument()
  })

  it('has a navigation landmark', () => {
    renderHeader()
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument()
  })
})
