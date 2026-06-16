import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import AdminOrders from './AdminOrders'

vi.mock('../api/admin', () => ({
  getAdminOrders: vi.fn(),
}))

import { getAdminOrders } from '../api/admin'

const MOCK_ORDERS = [
  {
    order_number: 'TC-10001',
    status: 'Paid',
    email: 'jane@example.com',
    total_cents: 8900,
    item_count: 1,
    is_mock_payment: true,
    created_at: '2026-06-17T10:00:00Z',
    updated_at: '2026-06-17T10:00:00Z',
  },
  {
    order_number: 'TC-10002',
    status: 'Packed',
    email: 'bob@example.com',
    total_cents: 17800,
    item_count: 2,
    is_mock_payment: false,
    created_at: '2026-06-16T09:00:00Z',
    updated_at: '2026-06-16T12:00:00Z',
  },
  {
    order_number: 'TC-10003',
    status: 'Shipped',
    email: 'alice@example.com',
    total_cents: 11200,
    item_count: 1,
    is_mock_payment: false,
    created_at: '2026-06-15T08:00:00Z',
    updated_at: '2026-06-15T14:00:00Z',
  },
]

function renderPage(initialPath = '/admin/orders') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/orders/:orderNumber" element={<div>Order Detail</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('AdminOrders', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders order numbers from the paginated API response', async () => {
    getAdminOrders.mockResolvedValueOnce({ items: MOCK_ORDERS })
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('TC-10001')).toBeInTheDocument()
      expect(screen.getByText('TC-10002')).toBeInTheDocument()
      expect(screen.getByText('TC-10003')).toBeInTheDocument()
    })
  })

  it('formats total_cents as USD', async () => {
    getAdminOrders.mockResolvedValueOnce({ items: [MOCK_ORDERS[0]] })
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('$89.00')).toBeInTheDocument()
    })
  })

  it('shows status badge for each order', async () => {
    getAdminOrders.mockResolvedValueOnce({ items: MOCK_ORDERS })
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Paid')).toBeInTheDocument()
      expect(screen.getByText('Packed')).toBeInTheDocument()
      expect(screen.getByText('Shipped')).toBeInTheDocument()
    })
  })

  it('shows item_count for each order', async () => {
    getAdminOrders.mockResolvedValueOnce({ items: [MOCK_ORDERS[1]] })
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument()
    })
  })

  it('shows MOCK badge for is_mock_payment orders', async () => {
    getAdminOrders.mockResolvedValueOnce({ items: [MOCK_ORDERS[0]] })
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('MOCK')).toBeInTheDocument()
    })
  })

  it('does not show MOCK badge for real payment orders', async () => {
    getAdminOrders.mockResolvedValueOnce({ items: [MOCK_ORDERS[1]] })
    renderPage()
    await waitFor(() => expect(screen.getByText('TC-10002')).toBeInTheDocument())
    expect(screen.queryByText('MOCK')).not.toBeInTheDocument()
  })

  it('links order numbers to /admin/orders/:orderNumber', async () => {
    getAdminOrders.mockResolvedValueOnce({ items: [MOCK_ORDERS[0]] })
    renderPage()
    await waitFor(() => {
      const link = screen.getByRole('link', { name: 'TC-10001' })
      expect(link).toHaveAttribute('href', '/admin/orders/TC-10001')
    })
  })

  it('shows empty state when no orders', async () => {
    getAdminOrders.mockResolvedValueOnce({ items: [] })
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('No orders found.')).toBeInTheDocument()
    })
  })

  it('shows an error alert when loading fails', async () => {
    getAdminOrders.mockRejectedValueOnce(new Error('Server error'))
    renderPage()
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Server error')
    })
  })

  it('renders status filter buttons', async () => {
    getAdminOrders.mockResolvedValueOnce({ items: [] })
    renderPage()
    await waitFor(() => expect(screen.getByText('No orders found.')).toBeInTheDocument())
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Paid')).toBeInTheDocument()
    expect(screen.getByText('Packed')).toBeInTheDocument()
    expect(screen.getByText('Shipped')).toBeInTheDocument()
  })

  it('calls getAdminOrders with status param when filter clicked', async () => {
    getAdminOrders.mockResolvedValue({ items: [] })
    renderPage()
    await waitFor(() => expect(getAdminOrders).toHaveBeenCalledWith({}))

    fireEvent.click(screen.getByText('Paid'))
    await waitFor(() => {
      expect(getAdminOrders).toHaveBeenCalledWith({ status: 'Paid' })
    })
  })

  it('calls getAdminOrders with no filter when All is clicked', async () => {
    getAdminOrders.mockResolvedValue({ items: [] })
    renderPage('/admin/orders?status=Packed')
    await waitFor(() => expect(getAdminOrders).toHaveBeenCalledWith({ status: 'Packed' }))

    fireEvent.click(screen.getByText('All'))
    await waitFor(() => {
      expect(getAdminOrders).toHaveBeenCalledWith({})
    })
  })
})
