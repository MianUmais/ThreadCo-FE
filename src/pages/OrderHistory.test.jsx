import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import OrderHistory from './OrderHistory'

vi.mock('../api/orders', () => ({
  getOrders: vi.fn(),
}))

import { getOrders } from '../api/orders'

function renderHistory() {
  return render(
    <MemoryRouter>
      <OrderHistory />
    </MemoryRouter>
  )
}

describe('OrderHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows empty state when there are no orders', async () => {
    getOrders.mockResolvedValueOnce([])
    renderHistory()
    await waitFor(() => {
      expect(screen.getByText(/haven't placed any orders/i)).toBeInTheDocument()
    })
  })

  it('renders each order in the list', async () => {
    getOrders.mockResolvedValueOnce([
      {
        order_number: 'TC-10042',
        status: 'Paid',
        total_cents: 8999,
        created_at: '2026-06-17T12:00:00Z',
        updated_at: '2026-06-17T12:00:00Z',
      },
      {
        order_number: 'TC-10043',
        status: 'Shipped',
        total_cents: 17800,
        created_at: '2026-06-18T09:00:00Z',
        updated_at: '2026-06-18T09:00:00Z',
      },
    ])
    renderHistory()
    await waitFor(() => {
      expect(screen.getByText('TC-10042')).toBeInTheDocument()
      expect(screen.getByText('TC-10043')).toBeInTheDocument()
    })
  })

  it('renders the status badge for each order', async () => {
    getOrders.mockResolvedValueOnce([
      {
        order_number: 'TC-10001',
        status: 'Packed',
        total_cents: 5000,
        created_at: '2026-06-15T00:00:00Z',
        updated_at: '2026-06-15T00:00:00Z',
      },
    ])
    renderHistory()
    await waitFor(() => {
      expect(screen.getByText('Packed')).toBeInTheDocument()
    })
  })

  it('formats total_cents as USD', async () => {
    getOrders.mockResolvedValueOnce([
      {
        order_number: 'TC-10001',
        status: 'Paid',
        total_cents: 8999,
        created_at: '2026-06-17T00:00:00Z',
        updated_at: '2026-06-17T00:00:00Z',
      },
    ])
    renderHistory()
    await waitFor(() => {
      expect(screen.getByText('$89.99')).toBeInTheDocument()
    })
  })

  it('links each order number to its detail page', async () => {
    getOrders.mockResolvedValueOnce([
      {
        order_number: 'TC-10055',
        status: 'Paid',
        total_cents: 9900,
        created_at: '2026-06-17T00:00:00Z',
        updated_at: '2026-06-17T00:00:00Z',
      },
    ])
    renderHistory()
    await waitFor(() => {
      const link = screen.getByRole('link', { name: 'TC-10055' })
      expect(link).toHaveAttribute('href', '/account/orders/TC-10055')
    })
  })

  it('shows an error message when the API fails', async () => {
    getOrders.mockRejectedValueOnce(new Error('Network error'))
    renderHistory()
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Network error')
    })
  })
})
