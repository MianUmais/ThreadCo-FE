import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import AdminProducts from './AdminProducts'

vi.mock('../api/admin', () => ({
  getAdminProducts: vi.fn(),
  deleteProduct: vi.fn(),
}))

import { getAdminProducts, deleteProduct } from '../api/admin'

const ACTIVE_PRODUCT = {
  id: 1,
  name: 'Linen Midi Dress',
  category: { id: 1, name: 'Dresses', slug: 'dresses' },
  price_cents: 8900,
  active: true,
  variants: [
    { id: 10, size: 'XS', color: 'Ivory', stock_qty: 3, available: true },
    { id: 11, size: 'S', color: 'Ivory', stock_qty: 5, available: true },
  ],
  slug: 'linen-midi-dress',
}

const INACTIVE_PRODUCT = {
  id: 2,
  name: 'Floral Wrap Dress',
  category: { id: 1, name: 'Dresses', slug: 'dresses' },
  price_cents: 11200,
  active: false,
  variants: [
    { id: 12, size: 'S', color: 'Blue', stock_qty: 0, available: false },
  ],
  slug: 'floral-wrap-dress',
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/admin/products']}>
      <Routes>
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/:id/edit" element={<div>Edit Form</div>} />
        <Route path="/admin/products/new" element={<div>Create Form</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('AdminProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.confirm = vi.fn(() => true)
  })

  it('renders product names from the admin endpoint', async () => {
    getAdminProducts.mockResolvedValueOnce({ items: [ACTIVE_PRODUCT, INACTIVE_PRODUCT] })
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Linen Midi Dress')).toBeInTheDocument()
      expect(screen.getByText('Floral Wrap Dress')).toBeInTheDocument()
    })
  })

  it('formats price as USD', async () => {
    getAdminProducts.mockResolvedValueOnce({ items: [ACTIVE_PRODUCT] })
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('$89.00')).toBeInTheDocument()
    })
  })

  it('shows Active badge for active product and Inactive badge for inactive', async () => {
    getAdminProducts.mockResolvedValueOnce({ items: [ACTIVE_PRODUCT, INACTIVE_PRODUCT] })
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Active')).toBeInTheDocument()
      expect(screen.getByText('Inactive')).toBeInTheDocument()
    })
  })

  it('includes inactive products in the list (incl inactive per AC)', async () => {
    getAdminProducts.mockResolvedValueOnce({ items: [INACTIVE_PRODUCT] })
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Floral Wrap Dress')).toBeInTheDocument()
      expect(screen.getByText('Inactive')).toBeInTheDocument()
    })
  })

  it('Delete button is visible for active products only', async () => {
    getAdminProducts.mockResolvedValueOnce({ items: [ACTIVE_PRODUCT, INACTIVE_PRODUCT] })
    renderPage()
    await waitFor(() => expect(screen.getByText('Linen Midi Dress')).toBeInTheDocument())
    const deleteButtons = screen.getAllByText('Delete')
    expect(deleteButtons).toHaveLength(1)
  })

  it('calls deleteProduct after confirm and updates status to Inactive', async () => {
    getAdminProducts.mockResolvedValueOnce({ items: [ACTIVE_PRODUCT] })
    deleteProduct.mockResolvedValueOnce({ id: 1, active: false })
    renderPage()
    await waitFor(() => expect(screen.getByText('Delete')).toBeInTheDocument())

    fireEvent.click(screen.getByText('Delete'))
    expect(window.confirm).toHaveBeenCalled()

    await waitFor(() => {
      expect(deleteProduct).toHaveBeenCalledWith(1)
      expect(screen.getByText('Inactive')).toBeInTheDocument()
    })
  })

  it('does not call deleteProduct when user cancels confirm', async () => {
    window.confirm = vi.fn(() => false)
    getAdminProducts.mockResolvedValueOnce({ items: [ACTIVE_PRODUCT] })
    renderPage()
    await waitFor(() => expect(screen.getByText('Delete')).toBeInTheDocument())

    fireEvent.click(screen.getByText('Delete'))
    expect(deleteProduct).not.toHaveBeenCalled()
  })

  it('shows an error alert when loading fails', async () => {
    getAdminProducts.mockRejectedValueOnce(new Error('Network error'))
    renderPage()
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Network error')
    })
  })

  it('shows empty state when there are no products', async () => {
    getAdminProducts.mockResolvedValueOnce({ items: [] })
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('No products found.')).toBeInTheDocument()
    })
  })

  it('renders variant count per product', async () => {
    getAdminProducts.mockResolvedValueOnce({ items: [ACTIVE_PRODUCT] })
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument()
    })
  })

  it('renders Add Product link pointing to /admin/products/new', async () => {
    getAdminProducts.mockResolvedValueOnce({ items: [] })
    renderPage()
    await waitFor(() => {
      const link = screen.getByRole('link', { name: /add product/i })
      expect(link).toHaveAttribute('href', '/admin/products/new')
    })
  })
})
