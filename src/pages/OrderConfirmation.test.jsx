import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import OrderConfirmation from './OrderConfirmation'

const mockOrder = {
  order_number: 'TC-10042',
  status: 'Paid',
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
  payment_method: 'mock',
  is_mock_payment: true,
  created_at: '2026-06-17T00:00:00Z',
}

function renderConfirmation(order = mockOrder) {
  return render(
    <MemoryRouter
      initialEntries={[{ pathname: '/order-confirmation', state: { order } }]}
    >
      <Routes>
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('OrderConfirmation', () => {
  it('displays the order number prominently as a heading', () => {
    renderConfirmation()
    expect(screen.getByRole('heading', { name: 'TC-10042' })).toBeInTheDocument()
  })

  it('shows status as Paid', () => {
    renderConfirmation()
    expect(screen.getByText('Paid')).toBeInTheDocument()
  })

  it('renders each line item with product name and size/color', () => {
    renderConfirmation()
    expect(screen.getByText('Oversized Linen Shirt')).toBeInTheDocument()
    expect(screen.getByText(/M\s*\/\s*White/)).toBeInTheDocument()
  })

  it('formats line_total_cents as USD', () => {
    renderConfirmation()
    // $89.99 appears at least once in items and in total
    expect(screen.getAllByText('$89.99').length).toBeGreaterThanOrEqual(1)
  })

  it('shows total_cents formatted', () => {
    renderConfirmation()
    const totals = screen.getAllByText('$89.99')
    expect(totals.length).toBeGreaterThanOrEqual(1)
  })

  it('shows the mock payment disclaimer', () => {
    renderConfirmation()
    expect(screen.getByText(/no real charge/i)).toBeInTheDocument()
  })

  it('prompts user to save the order number', () => {
    renderConfirmation()
    expect(screen.getByText(/save your order number/i)).toBeInTheDocument()
  })

  it('shows shipping address', () => {
    renderConfirmation()
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText('123 Main St')).toBeInTheDocument()
  })

  it('shows fallback when no order state is passed', () => {
    render(
      <MemoryRouter initialEntries={['/order-confirmation']}>
        <Routes>
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText(/no order details found/i)).toBeInTheDocument()
  })
})
