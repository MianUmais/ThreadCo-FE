import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import VariantSelector from './VariantSelector'

// Product with two sizes, two colors, one sold-out combo (M/White)
const variants = [
  { id: 'v1', size: 'S',  color: 'White', stock_qty: 3, available: true },
  { id: 'v2', size: 'M',  color: 'White', stock_qty: 0, available: false },
  { id: 'v3', size: 'S',  color: 'Black', stock_qty: 2, available: true },
  { id: 'v4', size: 'M',  color: 'Black', stock_qty: 5, available: true },
]

// All variants sold out
const soldOutVariants = [
  { id: 'u1', size: 'XS', color: 'Cream', stock_qty: 0, available: false },
  { id: 'u2', size: 'S',  color: 'Cream', stock_qty: 0, available: false },
  { id: 'u3', size: 'M',  color: 'Cream', stock_qty: 0, available: false },
]

function renderSelector(overrides = {}) {
  const onSelect = vi.fn()
  const props = { variants, selectedVariantId: null, onSelect, ...overrides }
  render(<VariantSelector {...props} />)
  return { onSelect }
}

describe('VariantSelector', () => {
  it('renders a button for each unique size', () => {
    renderSelector()
    expect(screen.getByRole('button', { name: /size s/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /size m/i })).toBeInTheDocument()
  })

  it('renders a button for each unique color', () => {
    renderSelector()
    expect(screen.getByRole('button', { name: /color white/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /color black/i })).toBeInTheDocument()
  })

  it('size button is enabled when at least one variant for that size is available', () => {
    renderSelector()
    const sBtn = screen.getByRole('button', { name: /size s/i })
    expect(sBtn).not.toBeDisabled()
    const mBtn = screen.getByRole('button', { name: /size m/i })
    expect(mBtn).not.toBeDisabled() // M/Black is available
  })

  it('size button is disabled when ALL variants for that size are sold out', () => {
    renderSelector({ variants: soldOutVariants })
    const xs = screen.getByRole('button', { name: /size xs/i })
    expect(xs).toBeDisabled()
    const s = screen.getByRole('button', { name: /size s/i })
    expect(s).toBeDisabled()
  })

  it('color button for a sold-out size+color combo is disabled when that size is selected', () => {
    // When size M is selected, M/White (available=false) should be disabled
    renderSelector({ selectedVariantId: 'v4' }) // v4 = M/Black
    const whiteBtn = screen.getByRole('button', { name: /color white/i })
    expect(whiteBtn).toBeDisabled()
  })

  it('color button is enabled for an available size+color combo', () => {
    renderSelector({ selectedVariantId: 'v4' }) // M selected
    const blackBtn = screen.getByRole('button', { name: /color black/i })
    expect(blackBtn).not.toBeDisabled()
  })

  it('clicking an available size calls onSelect with the first available variant id', async () => {
    const { onSelect } = renderSelector()
    await userEvent.click(screen.getByRole('button', { name: /size s/i }))
    // S/White (v1) is available and comes first
    expect(onSelect).toHaveBeenCalledWith('v1')
  })

  it('clicking a disabled size button does not call onSelect', async () => {
    const { onSelect } = renderSelector({ variants: soldOutVariants })
    await userEvent.click(screen.getByRole('button', { name: /size xs/i }))
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('size button has aria-pressed=true when selected', () => {
    renderSelector({ selectedVariantId: 'v3' }) // S/Black
    expect(screen.getByRole('button', { name: /size s/i })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /size m/i })).toHaveAttribute('aria-pressed', 'false')
  })

  it('sold-out combo button includes "sold out" in accessible label', () => {
    renderSelector({ selectedVariantId: 'v4' }) // M selected; M/White sold out
    const whiteBtn = screen.getByRole('button', { name: /color white.*sold out/i })
    expect(whiteBtn).toBeInTheDocument()
  })
})
