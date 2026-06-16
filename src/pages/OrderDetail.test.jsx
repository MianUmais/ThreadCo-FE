import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import OrderDetail from './OrderDetail'

vi.mock('../api/orders', () => ({
  getOrder: vi.fn(),
}))

import { getOrder } from '../api/orders'

const mockOrder = {
  order_number: 'TC-10042',
  status: 'Packed',
  email: 'jane@example.com',
  items: [
    {
      variant_id: 'v1',
      product_name: 'Oversized Linen Shirt',
      size: 'M',
      color: 'White',
      unit_price_cents: 8999,
      quantity: 2,
      line_total_cents: 17998,
    },
  ],
  subtotal_cents: 17998,
  total_cents: 17998,
  shipping_address: {
    name: 'Jane Doe',
    line1: '123 Main St',
    city: 'New York',
    region: 'NY',
    postal_code: '10001',
    country: 'US',
  },
  payment_method: 'mock',
  is_mock_payment: true,
  created_at: '2026-06-17T12:00:00Z',
  updated_at: '2026-06-17T14:00:00Z',
}

function renderDetail(orderNumber = 'TC-10042') {
  return render(
    <MemoryRouter initialEntries={[`/account/orders/${orderNumber}`]}>
      <Routes>
        <Route path="/account/orders/:orderNumber" element={<OrderDetail />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('OrderDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the order number as a heading', async () => {
    getOrder.mockResolvedValueOnce(mockOrder)
    renderDetail()
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'TC-10042' })).toBeInTheDocument()
    })
  })

  it('shows the order status', async () => {
    getOrder.mockResolvedValueOnce(mockOrder)
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText('Packed')).toBeInTheDocument()
    })
  })

  it('renders item name, size, and color', async () => {
    getOrder.mockResolvedValueOnce(mockOrder)
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText('Oversized Linen Shirt')).toBeInTheDocument()
      expect(screen.getByText(/M\s*\/\s*White/)).toBeInTheDocument()
    })
  })

  it('formats line_total_cents as USD', async () => {
    getOrder.mockResolvedValueOnce(mockOrder)
    renderDetail()
    // $179.98 appears in the item line, subtotal, and total — confirm it's present
    await waitFor(() => {
      expect(screen.getAllByText('$179.98').length).toBeGreaterThanOrEqual(1)
    })
  })

  it('shows the mock payment notice', async () => {
    getOrder.mockResolvedValueOnce(mockOrder)
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText(/no real charge/i)).toBeInTheDocument()
    })
  })

  it('shows shipping address', async () => {
    getOrder.mockResolvedValueOnce(mockOrder)
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText('Jane Doe')).toBeInTheDocument()
      expect(screen.getByText('123 Main St')).toBeInTheDocument()
    })
  })

  it('shows neutral "Order not found" message on 404', async () => {
    getOrder.mockRejectedValueOnce(
      Object.assign(new Error('Not found.'), { status: 404, code: 'not_found' })
    )
    renderDetail()
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Order not found.')
    })
  })
})
