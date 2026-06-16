import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Checkout from './Checkout'

// Mock CartContext
vi.mock('../context/CartContext', () => ({
  useCart: () => ({
    cart: {
      cart_token: 'test-token',
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
    },
    cartCount: 1,
    refreshCart: vi.fn(),
  }),
}))

// Mock orders API
vi.mock('../api/orders', () => ({
  checkout: vi.fn(),
}))

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useNavigate: () => mockNavigate }
})

import { checkout } from '../api/orders'

function renderCheckout() {
  return render(
    <MemoryRouter>
      <Checkout />
    </MemoryRouter>
  )
}

describe('Checkout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the email field', () => {
    renderCheckout()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })

  it('renders all required shipping address fields', () => {
    renderCheckout()
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/address line 1/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/state/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/postal code/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument()
  })

  it('shows the mock payment / no real charge notice', () => {
    renderCheckout()
    expect(screen.getByText(/no real charge/i)).toBeInTheDocument()
  })

  it('shows the order summary with item details', () => {
    renderCheckout()
    expect(screen.getByText('Oversized Linen Shirt')).toBeInTheDocument()
    // $89.99 appears for line total and for the subtotal — just confirm it's there
    expect(screen.getAllByText('$89.99').length).toBeGreaterThanOrEqual(1)
  })

  it('shows field validation errors when submitted empty', async () => {
    renderCheckout()
    await userEvent.click(screen.getByRole('button', { name: /place order/i }))
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument()
  })

  it('shows out_of_stock error inline and does not navigate', async () => {
    checkout.mockRejectedValueOnce(
      Object.assign(new Error("Sorry, 'Linen Shirt M/White' just sold out."), {
        code: 'out_of_stock',
        status: 409,
      })
    )

    renderCheckout()

    await userEvent.type(screen.getByLabelText(/email/i), 'jane@example.com')
    await userEvent.type(screen.getByLabelText(/full name/i), 'Jane Doe')
    await userEvent.type(screen.getByLabelText(/address line 1/i), '123 Main St')
    await userEvent.type(screen.getByLabelText(/city/i), 'New York')
    await userEvent.type(screen.getByLabelText(/state/i), 'NY')
    await userEvent.type(screen.getByLabelText(/postal code/i), '10001')

    await userEvent.click(screen.getByRole('button', { name: /place order/i }))

    await waitFor(() => {
      expect(screen.getByText(/some items sold out/i)).toBeInTheDocument()
    })
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('shows empty_cart error inline when returned from API', async () => {
    checkout.mockRejectedValueOnce(
      Object.assign(new Error('Your cart is empty.'), {
        code: 'empty_cart',
        status: 400,
      })
    )

    renderCheckout()

    await userEvent.type(screen.getByLabelText(/email/i), 'jane@example.com')
    await userEvent.type(screen.getByLabelText(/full name/i), 'Jane Doe')
    await userEvent.type(screen.getByLabelText(/address line 1/i), '123 Main St')
    await userEvent.type(screen.getByLabelText(/city/i), 'New York')
    await userEvent.type(screen.getByLabelText(/state/i), 'NY')
    await userEvent.type(screen.getByLabelText(/postal code/i), '10001')

    await userEvent.click(screen.getByRole('button', { name: /place order/i }))

    await waitFor(() => {
      expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument()
    })
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('navigates to order-confirmation on successful checkout', async () => {
    const mockOrder = {
      order_number: 'TC-10001',
      status: 'Paid',
      items: [],
      subtotal_cents: 8999,
      total_cents: 8999,
      is_mock_payment: true,
      created_at: '2026-06-17T00:00:00Z',
    }
    checkout.mockResolvedValueOnce(mockOrder)

    renderCheckout()

    await userEvent.type(screen.getByLabelText(/email/i), 'jane@example.com')
    await userEvent.type(screen.getByLabelText(/full name/i), 'Jane Doe')
    await userEvent.type(screen.getByLabelText(/address line 1/i), '123 Main St')
    await userEvent.type(screen.getByLabelText(/city/i), 'New York')
    await userEvent.type(screen.getByLabelText(/state/i), 'NY')
    await userEvent.type(screen.getByLabelText(/postal code/i), '10001')

    await userEvent.click(screen.getByRole('button', { name: /place order/i }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        '/order-confirmation',
        expect.objectContaining({ state: { order: mockOrder } })
      )
    })
  })
})
