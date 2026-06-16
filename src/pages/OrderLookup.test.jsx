import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import OrderLookup from './OrderLookup'

vi.mock('../api/orders', () => ({
  ordersLookup: vi.fn(),
}))

import { ordersLookup } from '../api/orders'

const mockOrder = {
  order_number: 'TC-10042',
  status: 'Shipped',
  email: 'jane@example.com',
  items: [
    {
      variant_id: 'v1',
      product_name: 'Oversized Linen Shirt',
      size: 'M',
      color: 'White',
      unit_price_cents: 8999,
      quantity: 1,
      line_total_cents: 8999,
    },
  ],
  subtotal_cents: 8999,
  total_cents: 8999,
  shipping_address: {
    name: 'Jane Doe',
    line1: '123 Main St',
    city: 'New York',
    region: 'NY',
    postal_code: '10001',
    country: 'US',
  },
  is_mock_payment: false,
  created_at: '2026-06-17T12:00:00Z',
  updated_at: '2026-06-17T16:00:00Z',
}

function renderLookup() {
  return render(
    <MemoryRouter>
      <OrderLookup />
    </MemoryRouter>
  )
}

describe('OrderLookup', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the order number and email fields', () => {
    renderLookup()
    expect(screen.getByLabelText(/order number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
  })

  it('shows a neutral not-found message on 404 — does not reveal order existence', async () => {
    ordersLookup.mockRejectedValueOnce(
      Object.assign(new Error('No matching order found.'), { status: 404, code: 'not_found' })
    )
    renderLookup()

    await userEvent.type(screen.getByLabelText(/order number/i), 'TC-99999')
    await userEvent.type(screen.getByLabelText(/email address/i), 'wrong@example.com')
    await userEvent.click(screen.getByRole('button', { name: /look up order/i }))

    await waitFor(() => {
      const alert = screen.getByRole('alert')
      expect(alert).toHaveTextContent(/couldn't find an order matching/i)
      // Must NOT say "order number does not exist" or "email does not match"
      expect(alert.textContent).not.toMatch(/does not exist/i)
      expect(alert.textContent).not.toMatch(/email.*not match/i)
    })
  })

  it('shows order details on successful lookup', async () => {
    ordersLookup.mockResolvedValueOnce(mockOrder)

    renderLookup()
    await userEvent.type(screen.getByLabelText(/order number/i), 'TC-10042')
    await userEvent.type(screen.getByLabelText(/email address/i), 'jane@example.com')
    await userEvent.click(screen.getByRole('button', { name: /look up order/i }))

    await waitFor(() => {
      expect(screen.getByText('TC-10042')).toBeInTheDocument()
      expect(screen.getByText('Oversized Linen Shirt')).toBeInTheDocument()
      // $89.99 appears in the item line and in the total — confirm it's present
      expect(screen.getAllByText('$89.99').length).toBeGreaterThanOrEqual(1)
    })
  })

  it('shows shipping address on successful lookup', async () => {
    ordersLookup.mockResolvedValueOnce(mockOrder)

    renderLookup()
    await userEvent.type(screen.getByLabelText(/order number/i), 'TC-10042')
    await userEvent.type(screen.getByLabelText(/email address/i), 'jane@example.com')
    await userEvent.click(screen.getByRole('button', { name: /look up order/i }))

    await waitFor(() => {
      expect(screen.getByText('Jane Doe')).toBeInTheDocument()
      expect(screen.getByText('123 Main St')).toBeInTheDocument()
    })
  })

  it('shows a generic error for non-404 failures', async () => {
    ordersLookup.mockRejectedValueOnce(
      Object.assign(new Error('Service unavailable.'), { status: 503 })
    )
    renderLookup()
    await userEvent.type(screen.getByLabelText(/order number/i), 'TC-10042')
    await userEvent.type(screen.getByLabelText(/email address/i), 'jane@example.com')
    await userEvent.click(screen.getByRole('button', { name: /look up order/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Service unavailable.')
    })
  })
})
