// Cart API — real backend first, silent fallback to mock when no backend configured.
// 409/400 errors from the real API propagate to callers unchanged.
import { api, NoBackendError } from './client'
import { mockGetCart, mockAddToCart, mockUpdateCartItem, mockRemoveCartItem } from './mock'

function isMock(err) {
  return err instanceof NoBackendError
}

export async function getCart(cartToken) {
  try {
    const qs = cartToken ? `?cart_token=${encodeURIComponent(cartToken)}` : ''
    return await api.get(`/api/cart${qs}`)
  } catch (err) {
    if (isMock(err)) return mockGetCart(cartToken)
    throw err
  }
}

export async function addToCart({ variantId, quantity, cartToken }) {
  try {
    return await api.post('/api/cart/items', {
      variant_id: variantId,
      quantity,
      ...(cartToken ? { cart_token: cartToken } : {}),
    })
  } catch (err) {
    if (isMock(err)) return mockAddToCart({ variantId, quantity })
    throw err
  }
}

export async function updateCartItem({ variantId, quantity, cartToken }) {
  try {
    return await api.patch(`/api/cart/items/${variantId}`, {
      quantity,
      ...(cartToken ? { cart_token: cartToken } : {}),
    })
  } catch (err) {
    if (isMock(err)) return mockUpdateCartItem({ variantId, quantity })
    throw err
  }
}

export async function removeCartItem({ variantId, cartToken }) {
  try {
    const qs = cartToken ? `?cart_token=${encodeURIComponent(cartToken)}` : ''
    return await api.delete(`/api/cart/items/${variantId}${qs}`)
  } catch (err) {
    if (isMock(err)) return mockRemoveCartItem({ variantId })
    throw err
  }
}
