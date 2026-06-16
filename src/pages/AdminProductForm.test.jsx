import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import AdminProductForm from './AdminProductForm'

vi.mock('../api/admin', () => ({
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  updateVariantStock: vi.fn(),
}))

vi.mock('../api/catalog', () => ({
  getCategories: vi.fn(),
}))

import { createProduct, updateProduct, updateVariantStock } from '../api/admin'
import { getCategories } from '../api/catalog'

const MOCK_CATEGORIES = [
  { id: 1, name: 'Dresses', slug: 'dresses' },
  { id: 2, name: 'Tops', slug: 'tops' },
]

const MOCK_PRODUCT = {
  id: 7,
  name: 'Linen Midi Dress',
  description: 'Relaxed-fit midi dress.',
  category: { id: 1, name: 'Dresses', slug: 'dresses' },
  price_cents: 8900,
  active: true,
  variants: [
    { id: 12, size: 'XS', color: 'Ivory', stock_qty: 3, available: true },
    { id: 13, size: 'S', color: 'Ivory', stock_qty: 5, available: true },
  ],
  slug: 'linen-midi-dress',
}

function renderCreate() {
  return render(
    <MemoryRouter initialEntries={['/admin/products/new']}>
      <Routes>
        <Route path="/admin/products/new" element={<AdminProductForm />} />
        <Route path="/admin/products" element={<div>Products List</div>} />
      </Routes>
    </MemoryRouter>
  )
}

function renderEdit(product = MOCK_PRODUCT) {
  return render(
    <MemoryRouter
      initialEntries={[{ pathname: `/admin/products/${product.id}/edit`, state: { product } }]}
    >
      <Routes>
        <Route path="/admin/products/:id/edit" element={<AdminProductForm />} />
        <Route path="/admin/products" element={<div>Products List</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('AdminProductForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getCategories.mockResolvedValue(MOCK_CATEGORIES)
  })

  // -------------------------------------------------------------------------
  // Create mode
  // -------------------------------------------------------------------------

  describe('create mode', () => {
    it('renders form fields and category select', async () => {
      renderCreate()
      await waitFor(() => expect(screen.getByLabelText('Name')).toBeInTheDocument())
      expect(screen.getByLabelText('Price (USD)')).toBeInTheDocument()
      expect(screen.getByLabelText('Category')).toBeInTheDocument()
      expect(screen.getByText('Create Product')).toBeInTheDocument()
    })

    it('populates category dropdown from getCategories', async () => {
      renderCreate()
      await waitFor(() => expect(screen.getByText('Dresses')).toBeInTheDocument())
      expect(screen.getByText('Tops')).toBeInTheDocument()
    })

    it('shows name-required error when submitting with empty name', async () => {
      renderCreate()
      await waitFor(() => expect(screen.getByText('Create Product')).toBeInTheDocument())
      fireEvent.click(screen.getByText('Create Product'))
      // Multiple field errors appear at once; check for the specific name error text
      await waitFor(() => {
        expect(screen.getByText('Product name is required.')).toBeInTheDocument()
      })
      expect(createProduct).not.toHaveBeenCalled()
    })

    it('shows price-required error when price is zero', async () => {
      renderCreate()
      await waitFor(() => expect(screen.getByLabelText('Name')).toBeInTheDocument())
      fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test Dress' } })
      fireEvent.change(screen.getByLabelText('Price (USD)'), { target: { value: '0' } })
      // Fill variant to avoid that error
      fireEvent.change(screen.getByLabelText('Size'), { target: { value: 'S' } })
      fireEvent.change(screen.getByLabelText('Color'), { target: { value: 'Black' } })
      fireEvent.click(screen.getByText('Create Product'))
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Price must be greater than')
      })
      expect(createProduct).not.toHaveBeenCalled()
    })

    it('shows price-required error when price is negative', async () => {
      renderCreate()
      await waitFor(() => expect(screen.getByLabelText('Name')).toBeInTheDocument())
      fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test Dress' } })
      fireEvent.change(screen.getByLabelText('Price (USD)'), { target: { value: '-5' } })
      fireEvent.change(screen.getByLabelText('Size'), { target: { value: 'S' } })
      fireEvent.change(screen.getByLabelText('Color'), { target: { value: 'Black' } })
      fireEvent.click(screen.getByText('Create Product'))
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Price must be greater than')
      })
    })

    it('shows variants-required error when all variant rows removed', async () => {
      renderCreate()
      await waitFor(() => expect(screen.getByLabelText('Name')).toBeInTheDocument())
      fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test Dress' } })
      fireEvent.change(screen.getByLabelText('Price (USD)'), { target: { value: '49.99' } })
      // Remove the initial variant
      fireEvent.click(screen.getByText('Remove'))
      fireEvent.click(screen.getByText('Create Product'))
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('At least one variant is required.')
      })
      expect(createProduct).not.toHaveBeenCalled()
    })

    it('shows duplicate-variant error when two rows share the same size+color', async () => {
      renderCreate()
      await waitFor(() => expect(screen.getByLabelText('Name')).toBeInTheDocument())
      fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test Dress' } })
      fireEvent.change(screen.getByLabelText('Price (USD)'), { target: { value: '49.99' } })
      // Fill variant 0
      fireEvent.change(screen.getByLabelText('Size'), { target: { value: 'S' } })
      fireEvent.change(screen.getByLabelText('Color'), { target: { value: 'Black' } })
      // Add variant 1
      fireEvent.click(screen.getByText('+ Add Variant'))
      // Now two variants exist; fill second with same size+color
      const sizeInputs = screen.getAllByLabelText('Size')
      const colorInputs = screen.getAllByLabelText('Color')
      fireEvent.change(sizeInputs[1], { target: { value: 'S' } })
      fireEvent.change(colorInputs[1], { target: { value: 'Black' } })
      fireEvent.click(screen.getByText('Create Product'))
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Duplicate size + color')
      })
      expect(createProduct).not.toHaveBeenCalled()
    })

    it('sends price_cents as integer cents and navigates to list on success', async () => {
      createProduct.mockResolvedValueOnce({ id: 99, name: 'New Dress', active: true })
      renderCreate()
      await waitFor(() => expect(screen.getByLabelText('Name')).toBeInTheDocument())
      fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'New Dress' } })
      fireEvent.change(screen.getByLabelText('Price (USD)'), { target: { value: '89.99' } })
      fireEvent.change(screen.getByLabelText('Size'), { target: { value: 'M' } })
      fireEvent.change(screen.getByLabelText('Color'), { target: { value: 'Ivory' } })
      fireEvent.click(screen.getByText('Create Product'))
      await waitFor(() => {
        expect(createProduct).toHaveBeenCalledWith(
          expect.objectContaining({ price_cents: 8999 })
        )
        expect(screen.getByText('Products List')).toBeInTheDocument()
      })
    })

    it('surfaces 409 conflict error from server as variant error', async () => {
      const conflictErr = new Error('Duplicate variant')
      conflictErr.code = 'conflict'
      createProduct.mockRejectedValueOnce(conflictErr)
      renderCreate()
      await waitFor(() => expect(screen.getByLabelText('Name')).toBeInTheDocument())
      fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'New Dress' } })
      fireEvent.change(screen.getByLabelText('Price (USD)'), { target: { value: '49.99' } })
      fireEvent.change(screen.getByLabelText('Size'), { target: { value: 'S' } })
      fireEvent.change(screen.getByLabelText('Color'), { target: { value: 'Blue' } })
      fireEvent.click(screen.getByText('Create Product'))
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Duplicate size + color combination')
      })
    })

    it('surfaces generic server error message', async () => {
      createProduct.mockRejectedValueOnce(new Error('Internal server error'))
      renderCreate()
      await waitFor(() => expect(screen.getByLabelText('Name')).toBeInTheDocument())
      fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'New Dress' } })
      fireEvent.change(screen.getByLabelText('Price (USD)'), { target: { value: '49.99' } })
      fireEvent.change(screen.getByLabelText('Size'), { target: { value: 'S' } })
      fireEvent.change(screen.getByLabelText('Color'), { target: { value: 'Blue' } })
      fireEvent.click(screen.getByText('Create Product'))
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Internal server error')
      })
    })
  })

  // -------------------------------------------------------------------------
  // Edit mode
  // -------------------------------------------------------------------------

  describe('edit mode', () => {
    it('pre-populates form fields from location state', async () => {
      renderEdit()
      await waitFor(() => expect(screen.getByLabelText('Name')).toBeInTheDocument())
      expect(screen.getByLabelText('Name')).toHaveValue('Linen Midi Dress')
      expect(screen.getByLabelText('Price (USD)')).toHaveValue(89)
    })

    it('shows variant stock section for each variant', async () => {
      renderEdit()
      await waitFor(() => expect(screen.getByText('XS / Ivory')).toBeInTheDocument())
      expect(screen.getByText('S / Ivory')).toBeInTheDocument()
    })

    it('shows current stock_qty for each variant', async () => {
      renderEdit()
      await waitFor(() => {
        // Stock: 3 and Stock: 5
        expect(screen.getAllByText(/Stock:\s*3|3/)[0]).toBeInTheDocument()
      })
    })

    it('calls updateProduct with price_cents on save', async () => {
      updateProduct.mockResolvedValueOnce({ ...MOCK_PRODUCT, name: 'Updated Name' })
      renderEdit()
      await waitFor(() => expect(screen.getByLabelText('Name')).toBeInTheDocument())
      fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Updated Name' } })
      fireEvent.click(screen.getByText('Save Changes'))
      await waitFor(() => {
        expect(updateProduct).toHaveBeenCalledWith(
          7,
          expect.objectContaining({ name: 'Updated Name', price_cents: 8900 })
        )
      })
    })

    it('shows Changes saved message on success', async () => {
      updateProduct.mockResolvedValueOnce(MOCK_PRODUCT)
      renderEdit()
      await waitFor(() => expect(screen.getByText('Save Changes')).toBeInTheDocument())
      fireEvent.click(screen.getByText('Save Changes'))
      await waitFor(() => {
        expect(screen.getByRole('status')).toHaveTextContent('Changes saved.')
      })
    })

    it('calls updateVariantStock with stock_qty for absolute set', async () => {
      updateVariantStock.mockResolvedValueOnce({ variant_id: 12, stock_qty: 20 })
      renderEdit()
      // Wait for stock controls to appear (two variants → two "Set to:" labels)
      await waitFor(() => expect(screen.getAllByLabelText('Set to:').length).toBeGreaterThan(0))
      const setToInputs = screen.getAllByLabelText('Set to:')
      // Change the first variant's (id=12, XS/Ivory) absolute-set input
      await act(async () => {
        fireEvent.change(setToInputs[0], { target: { value: '20' } })
      })
      const setButtons = screen.getAllByText('Set')
      fireEvent.click(setButtons[0])
      await waitFor(() => {
        expect(updateVariantStock).toHaveBeenCalledWith(12, { stock_qty: 20 })
      })
    })

    it('calls updateVariantStock with delta for relative adjustment', async () => {
      updateVariantStock.mockResolvedValueOnce({ variant_id: 12, stock_qty: 1 })
      renderEdit()
      // Wait for stock controls to appear (two variants → two "Adjust by:" labels)
      await waitFor(() => expect(screen.getAllByLabelText('Adjust by:').length).toBeGreaterThan(0))
      const adjustInputs = screen.getAllByLabelText('Adjust by:')
      // Change the first variant's (id=12, XS/Ivory) delta input
      await act(async () => {
        fireEvent.change(adjustInputs[0], { target: { value: '-2' } })
      })
      const adjustButtons = screen.getAllByText('Adjust')
      fireEvent.click(adjustButtons[0])
      await waitFor(() => {
        expect(updateVariantStock).toHaveBeenCalledWith(12, { delta: -2 })
      })
    })

    it('shows server 400 error when negative delta would result in negative stock', async () => {
      const negativeErr = new Error('Adjustment would result in negative stock.')
      negativeErr.status = 400
      updateVariantStock.mockRejectedValueOnce(negativeErr)
      renderEdit()
      await waitFor(() => expect(screen.getAllByLabelText('Adjust by:').length).toBeGreaterThan(0))
      const adjustInputs = screen.getAllByLabelText('Adjust by:')
      // Flush state between change and click so handleStockDelta sees deltaValue = '-999'
      await act(async () => {
        fireEvent.change(adjustInputs[0], { target: { value: '-999' } })
      })
      const adjustButtons = screen.getAllByText('Adjust')
      fireEvent.click(adjustButtons[0])
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('negative stock')
      })
    })

    it('shows name-required error when saving with empty name in edit mode', async () => {
      renderEdit()
      await waitFor(() => expect(screen.getByLabelText('Name')).toBeInTheDocument())
      fireEvent.change(screen.getByLabelText('Name'), { target: { value: '' } })
      fireEvent.click(screen.getByText('Save Changes'))
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Product name is required.')
      })
      expect(updateProduct).not.toHaveBeenCalled()
    })

    it('shows fallback message when no product state is available', () => {
      render(
        <MemoryRouter initialEntries={['/admin/products/7/edit']}>
          <Routes>
            <Route path="/admin/products/:id/edit" element={<AdminProductForm />} />
            <Route path="/admin/products" element={<div>Products List</div>} />
          </Routes>
        </MemoryRouter>
      )
      expect(screen.getByText(/return to product list/i)).toBeInTheDocument()
    })
  })
})
