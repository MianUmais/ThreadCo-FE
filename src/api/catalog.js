// Catalog API — tries the real backend, falls back to mock data transparently.
// All callers use these functions; swapping mock->real requires no caller changes.
import { api } from './client'
import { mockGetProducts, mockGetProduct, mockCategories } from './mock'

async function tryApi(fn, fallback) {
  try {
    return await fn()
  } catch {
    return fallback()
  }
}

export function getProducts(params = {}) {
  const { category, q, page = 1, page_size = 24 } = params
  const qs = new URLSearchParams()
  if (category) qs.set('category', category)
  if (q) qs.set('q', q)
  qs.set('page', String(page))
  qs.set('page_size', String(page_size))

  return tryApi(
    () => api.get(`/api/products?${qs}`),
    () => mockGetProducts({ category, q })
  )
}

export function getProduct(idOrSlug) {
  return tryApi(
    () => api.get(`/api/products/${idOrSlug}`),
    () => {
      const product = mockGetProduct(idOrSlug)
      if (!product) throw new NotFoundError(`Product not found: ${idOrSlug}`)
      return product
    }
  )
}

export function getCategories() {
  return tryApi(
    () => api.get('/api/categories'),
    () => mockCategories
  )
}

export class NotFoundError extends Error {
  constructor(message) {
    super(message)
    this.name = 'NotFoundError'
    this.status = 404
  }
}
