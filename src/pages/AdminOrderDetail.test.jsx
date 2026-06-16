import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import AdminOrderDetail from './AdminOrderDetail'

vi.mock('../api/admin', () => ({
  getAdminOrder: vi.fn(),
  transitionOrder: vi.fn(),
}))

import { getAdminOrder, transitionOrder } from '../api/admin'

const PAID_ORDER = {
  order_number: 'TC-10001',
  status: 'Paid',
  email: 'jane@example.com',
  items: [
    {
      variant_id: 12,
      product_name: 'Linen Midi Dress',
      size: 'S',
      color: 'Ivory',
      unit_price_cents: 8900,
      quantity: 1,
      line_total_cents: 8900,
    },
  ],
  subtotal_cents: 8900,
  total_cents: 8900,
  shipping_address: {
    name: 'Jane Doe',
    line1: '123 Main St',
    line2: null,
    city: 'Springfield',
    region: 'IL',
    postal_code: '62701',
    country: 'US',
  },
  payment_method: 'mock',
  is_mock_payment: true,
  created_at: '2026-06-17T10:00:00Z',
  updated_at: '2026-06-17T10:00:00Z',
  status_history: [],
}

const PACKED_ORDER = {
  ...PAID_ORDER,
  order_number: 'TC-10002',
  status: 'Packed',
  is_mock_payment: false,
  status_history: [
    { from_status: 'Paid', to_status: 'Packed', at: '2026-06-17T11:00:00Z', by_admin_id: 1 },
  ],
}

const SHIPPED_ORDER = {
  ...PAID_ORDER,
  order_number: 'TC-10003',
  status: 'Shipped',
  is_mock_payment: false,
  status_history: [
    { from_status: 'Paid', to_status: 'Packed', at: '2026-06-17T11:00:00Z', by_admin_id: 1 },
    { from_status: 'Packed', to_status: 'Shipped', at: '2026-06-17T12:00:00Z', by_admin_id: 1 },
  ],
}

function renderDetail(orderNumber = 'TC-10001') {
  return render(
    <MemoryRouter initialEntries={[`/admin/orders/${orderNumber}`]}>
      <Routes>
        <Route path="/admin/orders/:orderNumber" element={<AdminOrderDetail />} />
        <Route path="/admin/orders" element={<div>Orders List</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('AdminOrderDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the order number as a heading', async () => {
    getAdminOrder.mockResolvedValueOnce(PAID_ORDER)
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText('TC-10001')).toBeInTheDocument()
    })
  })

  it('shows the current status badge', async () => {
    getAdminOrder.mockResolvedValueOnce(PAID_ORDER)
    renderDetail()
    await waitFor(() => {
      // 'Paid' appears in the topbar badge and the fulfillment section
      expect(screen.getAllByText('Paid').length).toBeGreaterThan(0)
    })
  })

  it('renders line items with product name, size, color, and formatted prices', async () => {
    getAdminOrder.mockResolvedValueOnce(PAID_ORDER)
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText('Linen Midi Dress')).toBeInTheDocument()
      expect(screen.getByText('S')).toBeInTheDocument()
      expect(screen.getByText('Ivory')).toBeInTheDocument()
      expect(screen.getAllByText('$89.00').length).toBeGreaterThanOrEqual(1)
    })
  })

  it('shows grand total formatted as USD', async () => {
    getAdminOrder.mockResolvedValueOnce(PAID_ORDER)
    renderDetail()
    await waitFor(() => {
      expect(screen.getAllByText('$89.00').length).toBeGreaterThanOrEqual(1)
    })
  })

  it('renders shipping address fields', async () => {
    getAdminOrder.mockResolvedValueOnce(PAID_ORDER)
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText('Jane Doe')).toBeInTheDocument()
      expect(screen.getByText('123 Main St')).toBeInTheDocument()
      expect(screen.getByText(/Springfield/)).toBeInTheDocument()
    })
  })

  it('shows MOCK PAYMENT label when is_mock_payment is true', async () => {
    getAdminOrder.mockResolvedValueOnce(PAID_ORDER)
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText('MOCK PAYMENT')).toBeInTheDocument()
    })
  })

  it('does not show MOCK PAYMENT label when is_mock_payment is false', async () => {
    getAdminOrder.mockResolvedValueOnce(PACKED_ORDER)
    renderDetail('TC-10002')
    await waitFor(() => expect(screen.getByText('TC-10002')).toBeInTheDocument())
    expect(screen.queryByText('MOCK PAYMENT')).not.toBeInTheDocument()
  })

  it('shows status history entries', async () => {
    getAdminOrder.mockResolvedValueOnce(PACKED_ORDER)
    renderDetail('TC-10002')
    await waitFor(() => {
      // Status History section heading and column headers confirm the table rendered
      expect(screen.getByText('Status History')).toBeInTheDocument()
      // The history row cells From/To are present (table headers)
      expect(screen.getByRole('columnheader', { name: 'From' })).toBeInTheDocument()
      expect(screen.getByRole('columnheader', { name: 'To' })).toBeInTheDocument()
    })
  })

  it('shows history row with admin id', async () => {
    getAdminOrder.mockResolvedValueOnce(PACKED_ORDER)
    renderDetail('TC-10002')
    await waitFor(() => {
      expect(screen.getByText('#1')).toBeInTheDocument()
    })
  })

  // Fulfillment controls

  it('shows "Mark as Packed" button for Paid orders', async () => {
    getAdminOrder.mockResolvedValueOnce(PAID_ORDER)
    renderDetail()
    await waitFor(() => {
      expect(screen.getByText('Mark as Packed')).toBeInTheDocument()
    })
  })

  it('shows "Mark as Shipped" button for Packed orders', async () => {
    getAdminOrder.mockResolvedValueOnce(PACKED_ORDER)
    renderDetail('TC-10002')
    await waitFor(() => {
      expect(screen.getByText('Mark as Shipped')).toBeInTheDocument()
    })
  })

  it('shows no transition button for Shipped orders', async () => {
    getAdminOrder.mockResolvedValueOnce(SHIPPED_ORDER)
    renderDetail('TC-10003')
    await waitFor(() => expect(screen.getByText('TC-10003')).toBeInTheDocument())
    expect(screen.queryByText(/Mark as/)).not.toBeInTheDocument()
  })

  it('shows fulfilled notice for Shipped orders', async () => {
    getAdminOrder.mockResolvedValueOnce(SHIPPED_ORDER)
    renderDetail('TC-10003')
    await waitFor(() => {
      expect(screen.getByText(/no further transitions available/i)).toBeInTheDocument()
    })
  })

  it('calls transitionOrder with Packed when Mark as Packed is clicked', async () => {
    getAdminOrder
      .mockResolvedValueOnce(PAID_ORDER)
      .mockResolvedValueOnce(PACKED_ORDER)
    transitionOrder.mockResolvedValueOnce({
      order_number: 'TC-10001',
      status: 'Packed',
      updated_at: '2026-06-17T11:00:00Z',
      status_history: [{ from_status: 'Paid', to_status: 'Packed', at: '2026-06-17T11:00:00Z', by_admin_id: 1 }],
    })
    renderDetail()
    await waitFor(() => expect(screen.getByText('Mark as Packed')).toBeInTheDocument())

    fireEvent.click(screen.getByText('Mark as Packed'))
    await waitFor(() => {
      expect(transitionOrder).toHaveBeenCalledWith('TC-10001', 'Packed')
    })
  })

  it('refetches order and updates status after successful transition', async () => {
    getAdminOrder
      .mockResolvedValueOnce(PAID_ORDER)
      .mockResolvedValueOnce(PACKED_ORDER)
    transitionOrder.mockResolvedValueOnce({
      order_number: 'TC-10001',
      status: 'Packed',
      updated_at: '2026-06-17T11:00:00Z',
      status_history: [],
    })
    renderDetail()
    await waitFor(() => expect(screen.getByText('Mark as Packed')).toBeInTheDocument())

    fireEvent.click(screen.getByText('Mark as Packed'))
    await waitFor(() => {
      // After refetch the button changes to "Mark as Shipped"
      expect(screen.getByText('Mark as Shipped')).toBeInTheDocument()
    })
  })

  it('surfaces 409 invalid_transition error gracefully', async () => {
    getAdminOrder.mockResolvedValueOnce(PAID_ORDER)
    const conflictErr = new Error('Cannot transition from Paid to Shipped.')
    conflictErr.status = 409
    conflictErr.code = 'invalid_transition'
    transitionOrder.mockRejectedValueOnce(conflictErr)
    renderDetail()
    await waitFor(() => expect(screen.getByText('Mark as Packed')).toBeInTheDocument())

    fireEvent.click(screen.getByText('Mark as Packed'))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Cannot transition')
    })
  })

  it('shows an error alert when loading fails', async () => {
    getAdminOrder.mockRejectedValueOnce(new Error('Not found'))
    renderDetail()
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Not found')
    })
  })
})
