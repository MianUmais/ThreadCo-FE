// Orders / checkout API — real backend first, fallback to mock.
import { api, NoBackendError } from './client'
import { mockCheckout } from './mock'

function isMock(err) {
  return err instanceof NoBackendError
}

export async function checkout({ cartToken, email, shippingAddress }) {
  const payload = {
    email,
    shipping_address: shippingAddress,
    payment: { method: 'mock' },
    ...(cartToken ? { cart_token: cartToken } : {}),
  }
  try {
    return await api.post('/api/checkout', payload)
  } catch (err) {
    if (isMock(err)) return mockCheckout({ email, shippingAddress })
    throw err
  }
}

export async function getOrder(orderNumber) {
  try {
    return await api.get(`/api/orders/${orderNumber}`)
  } catch (err) {
    if (isMock(err)) return null
    throw err
  }
}
