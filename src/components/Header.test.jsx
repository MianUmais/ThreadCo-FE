import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Header from './Header'

// Mock CartContext so Header tests don't need a full CartProvider + API stack
vi.mock('../context/CartContext', () => ({
  useCart: () => ({ cartCount: 0 }),
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

  it('renders navigation links', () => {
    renderHeader()
    expect(screen.getByRole('link', { name: /shop/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /account/i })).toBeInTheDocument()
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
