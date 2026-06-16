import { api, NoBackendError } from './client'

function isMock(err) {
  return err instanceof NoBackendError
}

export async function getAdminProducts(params = {}) {
  const { page = 1, page_size = 100 } = params
  const qs = new URLSearchParams()
  qs.set('page', String(page))
  qs.set('page_size', String(page_size))
  try {
    return await api.get(`/api/admin/products?${qs}`)
  } catch (err) {
    if (isMock(err)) return { items: [], page: 1, page_size: 100, total: 0 }
    throw err
  }
}

export async function createProduct(data) {
  return api.post('/api/admin/products', data)
}

export async function updateProduct(id, data) {
  return api.patch(`/api/admin/products/${id}`, data)
}

export async function deleteProduct(id) {
  return api.delete(`/api/admin/products/${id}`)
}

export async function updateVariantStock(variantId, data) {
  return api.patch(`/api/admin/variants/${variantId}/stock`, data)
}
