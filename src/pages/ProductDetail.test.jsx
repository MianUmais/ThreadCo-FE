import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProductDetail from './ProductDetail'

vi.mock('../api/catalog', () => ({
  getProduct: vi.fn(),
  NotFoundError: class NotFoundError extends Error {},
}))

vi.mock('../context/CartContext', () => ({
  useCart: () => ({ addItem: vi.fn() }),
}))

import { getProduct } from '../api/catalog'

// Product with S/White (available), M/White (sold out), S/Black and M/Black (available)
const PRODUCT = {
  id: 1,
  name: 'Test Shirt',
  price_cents: 5000,
  description: 'A comfortable shirt',
  category: { name: 'Tops' },
  images: [],
  variants: [
    { id: 'v1', size: 'S', color: 'White', stock_qty: 3, available: true },
    { id: 'v2', size: 'M', color: 'White', stock_qty: 0, available: false },
    { id: 'v3', size: 'S', color: 'Black', stock_qty: 2, available: true },
    { id: 'v4', size: 'M', color: 'Black', stock_qty: 5, available: true },
  ],
}

function renderDetail() {
  return render(
    <MemoryRouter initialEntries={['/product/1']}>
      <Routes>
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('ProductDetail — add-to-cart button label', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows "Select a size" when no variant is selected', async () => {
    getProduct.mockResolvedValueOnce(PRODUCT)
    renderDetail()
    await waitFor(() => expect(screen.getByText('Test Shirt')).toBeInTheDocument())
    expect(screen.getByText('Select a size')).toBeInTheDocument()
  })

  it('shows "Add to Cart" when an available variant is selected', async () => {
    getProduct.mockResolvedValueOnce(PRODUCT)
    renderDetail()
    await waitFor(() => expect(screen.getByText('Test Shirt')).toBeInTheDocument())
    await userEvent.click(screen.getByRole('button', { name: /size s/i }))
    expect(screen.getByText('Add to Cart')).toBeInTheDocument()
  })

  // Regression: ini-v7m — selecting S then M lands on M/White (unavailable);
  // button must say "Unavailable" not "Select a size"
  it('shows "Unavailable" when selected size+color combo is sold out', async () => {
    getProduct.mockResolvedValueOnce(PRODUCT)
    renderDetail()
    await waitFor(() => expect(screen.getByText('Test Shirt')).toBeInTheDocument())
    await userEvent.click(screen.getByRole('button', { name: /size s/i }))
    await userEvent.click(screen.getByRole('button', { name: /size m/i }))
    expect(screen.getByText('Unavailable')).toBeInTheDocument()
  })

  it('restores "Add to Cart" after switching from unavailable to available combo', async () => {
    getProduct.mockResolvedValueOnce(PRODUCT)
    renderDetail()
    await waitFor(() => expect(screen.getByText('Test Shirt')).toBeInTheDocument())
    // S → M/White (sold out) → pick Black → M/Black (available)
    await userEvent.click(screen.getByRole('button', { name: /size s/i }))
    await userEvent.click(screen.getByRole('button', { name: /size m/i }))
    await waitFor(() => expect(screen.getByText('Unavailable')).toBeInTheDocument())
    await userEvent.click(screen.getByRole('button', { name: /color black/i }))
    expect(screen.getByText('Add to Cart')).toBeInTheDocument()
  })
})
