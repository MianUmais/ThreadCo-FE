// Catalog API — real backend first, mock fallback ONLY when no backend is configured.
// Callers see real 404/4xx from the backend; only a missing VITE_API_URL falls back to mock.
import { api, NoBackendError } from './client'
import { mockGetProducts, mockGetProduct, mockCategories } from './mock'

function isMock(err) {
  return err instanceof NoBackendError
}

export async function getProducts(params = {}) {
  const { category, q, page = 1, page_size = 24 } = params
  const qs = new URLSearchParams()
  if (category) qs.set('category', category)
  if (q) qs.set('q', q)
  qs.set('page', String(page))
  qs.set('page_size', String(page_size))

  try {
    return await api.get(`/api/products?${qs}`)
  } catch (err) {
    if (isMock(err)) return mockGetProducts({ category, q })
    throw err
  }
}

export async function getProduct(idOrSlug) {
  try {
    return await api.get(`/api/products/${idOrSlug}`)
  } catch (err) {
    if (isMock(err)) {
      const product = mockGetProduct(idOrSlug)
      if (!product) throw new NotFoundError(`Product not found: ${idOrSlug}`)
      return product
    }
    throw err
  }
}

export async function getCategories() {
  try {
    return await api.get('/api/categories')
  } catch (err) {
    if (isMock(err)) return mockCategories
    throw err
  }
}

export class NotFoundError extends Error {
  constructor(message) {
    super(message)
    this.name = 'NotFoundError'
    this.status = 404
  }
}
