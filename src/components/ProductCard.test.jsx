import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProductCard from './ProductCard'

const inStockProduct = {
  id: '1',
  slug: 'linen-shirt',
  name: 'Oversized Linen Shirt',
  price_cents: 8999,
  primary_image_url: null,
  in_stock: true,
}

const soldOutProduct = {
  id: '2',
  slug: 'ribbed-top',
  name: 'Ribbed Knit Top',
  price_cents: 5999,
  primary_image_url: null,
  in_stock: false,
}

function renderCard(product) {
  return render(
    <MemoryRouter>
      <ProductCard product={product} />
    </MemoryRouter>
  )
}

describe('ProductCard', () => {
  it('renders the product name', () => {
    renderCard(inStockProduct)
    expect(screen.getByText('Oversized Linen Shirt')).toBeInTheDocument()
  })

  it('formats price_cents as USD currency', () => {
    renderCard(inStockProduct)
    // 8999 cents -> $89.99
    expect(screen.getByText('$89.99')).toBeInTheDocument()
  })

  it('links to the product detail page using slug', () => {
    renderCard(inStockProduct)
    const link = screen.getByRole('link', { name: /oversized linen shirt/i })
    expect(link).toHaveAttribute('href', '/product/linen-shirt')
  })

  it('does not show sold-out badge for in-stock product', () => {
    renderCard(inStockProduct)
    expect(screen.queryByText(/sold out/i)).not.toBeInTheDocument()
  })

  it('shows a sold-out badge when in_stock is false', () => {
    renderCard(soldOutProduct)
    expect(screen.getByText(/sold out/i)).toBeInTheDocument()
  })

  it('still renders the name and price when sold out', () => {
    renderCard(soldOutProduct)
    expect(screen.getByText('Ribbed Knit Top')).toBeInTheDocument()
    expect(screen.getByText('$59.99')).toBeInTheDocument()
  })

  it('links to product detail using id when slug is absent', () => {
    const noSlug = { ...inStockProduct, slug: undefined }
    renderCard(noSlug)
    const link = screen.getByRole('link', { name: /oversized linen shirt/i })
    expect(link).toHaveAttribute('href', '/product/1')
  })
})
