import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CartLine from './CartLine'

const item = {
  variant_id: 'v1',
  product_name: 'Oversized Linen Shirt',
  size: 'M',
  color: 'White',
  unit_price_cents: 8999,
  quantity: 2,
  line_total_cents: 17998,
}

function renderLine(overrides = {}) {
  const onUpdate = vi.fn()
  const onRemove = vi.fn()
  render(
    <CartLine
      item={item}
      onUpdate={onUpdate}
      onRemove={onRemove}
      updating={false}
      error={null}
      {...overrides}
    />
  )
  return { onUpdate, onRemove }
}

describe('CartLine', () => {
  it('renders the product name', () => {
    renderLine()
    expect(screen.getByText('Oversized Linen Shirt')).toBeInTheDocument()
  })

  it('renders size and color', () => {
    renderLine()
    expect(screen.getByText(/M\s*\/\s*White/)).toBeInTheDocument()
  })

  it('formats unit_price_cents as USD', () => {
    renderLine()
    expect(screen.getByText('$89.99')).toBeInTheDocument()
  })

  it('formats line_total_cents as USD', () => {
    renderLine()
    expect(screen.getByText('$179.98')).toBeInTheDocument()
  })

  it('shows the current quantity', () => {
    renderLine()
    const input = screen.getByRole('spinbutton', { name: /item quantity/i })
    expect(input).toHaveValue(2)
  })

  it('calls onUpdate with incremented qty when + is clicked', async () => {
    const { onUpdate } = renderLine()
    await userEvent.click(screen.getByRole('button', { name: /increase quantity/i }))
    expect(onUpdate).toHaveBeenCalledWith('v1', 3)
  })

  it('calls onUpdate with decremented qty when - is clicked', async () => {
    const { onUpdate } = renderLine()
    await userEvent.click(screen.getByRole('button', { name: /decrease quantity/i }))
    expect(onUpdate).toHaveBeenCalledWith('v1', 1)
  })

  it('disables the decrement button when quantity is 1', () => {
    renderLine({ item: { ...item, quantity: 1, line_total_cents: 8999 } })
    expect(screen.getByRole('button', { name: /decrease quantity/i })).toBeDisabled()
  })

  it('calls onRemove when Remove is clicked', async () => {
    const { onRemove } = renderLine()
    await userEvent.click(screen.getByRole('button', { name: /remove oversized linen shirt/i }))
    expect(onRemove).toHaveBeenCalledWith('v1')
  })

  it('shows an error message when error prop is provided', () => {
    renderLine({ error: 'Only 1 unit available.' })
    expect(screen.getByText('Only 1 unit available.')).toBeInTheDocument()
  })

  it('disables all controls when updating is true', () => {
    renderLine({ updating: true })
    expect(screen.getByRole('button', { name: /increase quantity/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /remove/i })).toBeDisabled()
  })
})
