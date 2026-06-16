// Orders / checkout API — real backend first, fallback to mock.
import { api, NoBackendError } from './client'
import { mockCheckout, mockGetOrders, mockGetOrder, mockLookup } from './mock'

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

export async function getOrders() {
  try {
    const data = await api.get('/api/orders')
    return data.items  // GET /api/orders returns paginated envelope {items, page, total}
  } catch (err) {
    if (isMock(err)) return mockGetOrders()
    throw err
  }
}

export async function getOrder(orderNumber) {
  try {
    return await api.get(`/api/orders/${orderNumber}`)
  } catch (err) {
    if (isMock(err)) return mockGetOrder(orderNumber)
    throw err
  }
}

export async function ordersLookup({ orderNumber, email }) {
  const params = new URLSearchParams({ order_number: orderNumber, email })
  try {
    return await api.get(`/api/orders/lookup?${params}`)
  } catch (err) {
    if (isMock(err)) return mockLookup({ orderNumber, email })
    throw err
  }
}
