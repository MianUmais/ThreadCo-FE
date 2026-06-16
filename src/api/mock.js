// Mock data shaped exactly to spec §3.1 / §4.1 field names.
// Used as fallback when VITE_API_URL is absent or backend is unreachable.

export const mockCategories = [
  { id: 1, name: 'Tops', slug: 'tops' },
  { id: 2, name: 'Bottoms', slug: 'bottoms' },
  { id: 3, name: 'Outerwear', slug: 'outerwear' },
  { id: 4, name: 'Dresses', slug: 'dresses' },
]

// Full product detail shapes (spec §3.1.2)
export const mockProductDetails = [
  {
    id: '1',
    name: 'Oversized Linen Shirt',
    slug: 'oversized-linen-shirt',
    description: 'Relaxed-fit linen shirt with a dropped shoulder silhouette and single-button cuff.',
    category: { id: 1, name: 'Tops', slug: 'tops' },
    price_cents: 8999,
    images: [
      { url: null, position: 0 },
    ],
    variants: [
      { id: 'v1-1', size: 'XS', color: 'White', stock_qty: 5, available: true },
      { id: 'v1-2', size: 'S',  color: 'White', stock_qty: 3, available: true },
      { id: 'v1-3', size: 'M',  color: 'White', stock_qty: 0, available: false },
      { id: 'v1-4', size: 'L',  color: 'White', stock_qty: 2, available: true },
      { id: 'v1-5', size: 'XL', color: 'White', stock_qty: 0, available: false },
      { id: 'v1-6', size: 'XS', color: 'Black', stock_qty: 4, available: true },
      { id: 'v1-7', size: 'S',  color: 'Black', stock_qty: 0, available: false },
      { id: 'v1-8', size: 'M',  color: 'Black', stock_qty: 6, available: true },
      { id: 'v1-9', size: 'L',  color: 'Black', stock_qty: 1, available: true },
      { id: 'v1-10', size: 'XL', color: 'Black', stock_qty: 3, available: true },
    ],
  },
  {
    id: '2',
    name: 'Wide-Leg Trousers',
    slug: 'wide-leg-trousers',
    description: 'Fluid wide-leg trousers in a soft crepe fabric with a mid-rise waist and side pockets.',
    category: { id: 2, name: 'Bottoms', slug: 'bottoms' },
    price_cents: 11500,
    images: [
      { url: null, position: 0 },
    ],
    variants: [
      { id: 'v2-1', size: 'XS', color: 'Ecru',  stock_qty: 3, available: true },
      { id: 'v2-2', size: 'S',  color: 'Ecru',  stock_qty: 0, available: false },
      { id: 'v2-3', size: 'M',  color: 'Ecru',  stock_qty: 2, available: true },
      { id: 'v2-4', size: 'L',  color: 'Ecru',  stock_qty: 0, available: false },
      { id: 'v2-5', size: 'XS', color: 'Navy',  stock_qty: 0, available: false },
      { id: 'v2-6', size: 'S',  color: 'Navy',  stock_qty: 4, available: true },
      { id: 'v2-7', size: 'M',  color: 'Navy',  stock_qty: 5, available: true },
      { id: 'v2-8', size: 'L',  color: 'Navy',  stock_qty: 2, available: true },
    ],
  },
  {
    id: '3',
    name: 'Structured Blazer',
    slug: 'structured-blazer',
    description: 'Tailored single-breasted blazer with welt pockets and a clean back vent.',
    category: { id: 3, name: 'Outerwear', slug: 'outerwear' },
    price_cents: 19900,
    images: [
      { url: null, position: 0 },
    ],
    variants: [
      { id: 'v3-1', size: 'S',  color: 'Black', stock_qty: 4, available: true },
      { id: 'v3-2', size: 'M',  color: 'Black', stock_qty: 6, available: true },
      { id: 'v3-3', size: 'L',  color: 'Black', stock_qty: 3, available: true },
      { id: 'v3-4', size: 'XL', color: 'Black', stock_qty: 2, available: true },
    ],
  },
  {
    id: '4',
    name: 'Ribbed Knit Top',
    slug: 'ribbed-knit-top',
    description: 'Fine-ribbed knit top with a square neckline and slim fit. All sizes sold out.',
    category: { id: 1, name: 'Tops', slug: 'tops' },
    price_cents: 5999,
    images: [
      { url: null, position: 0 },
    ],
    variants: [
      { id: 'v4-1', size: 'XS', color: 'Cream', stock_qty: 0, available: false },
      { id: 'v4-2', size: 'S',  color: 'Cream', stock_qty: 0, available: false },
      { id: 'v4-3', size: 'M',  color: 'Cream', stock_qty: 0, available: false },
      { id: 'v4-4', size: 'L',  color: 'Cream', stock_qty: 0, available: false },
    ],
  },
  {
    id: '5',
    name: 'Straight-Cut Jeans',
    slug: 'straight-cut-jeans',
    description: 'Classic straight-cut jeans in a mid-rise silhouette. Rigid denim, five-pocket construction.',
    category: { id: 2, name: 'Bottoms', slug: 'bottoms' },
    price_cents: 9500,
    images: [
      { url: null, position: 0 },
    ],
    variants: [
      { id: 'v5-1', size: '24', color: 'Indigo', stock_qty: 0, available: false },
      { id: 'v5-2', size: '26', color: 'Indigo', stock_qty: 3, available: true },
      { id: 'v5-3', size: '28', color: 'Indigo', stock_qty: 5, available: true },
      { id: 'v5-4', size: '30', color: 'Indigo', stock_qty: 0, available: false },
    ],
  },
  {
    id: '6',
    name: 'Draped Midi Dress',
    slug: 'draped-midi-dress',
    description: 'Fluid draped midi dress with an asymmetric hemline and cross-body drape detail.',
    category: { id: 4, name: 'Dresses', slug: 'dresses' },
    price_cents: 14500,
    images: [
      { url: null, position: 0 },
    ],
    variants: [
      { id: 'v6-1', size: 'XS', color: 'Sand',  stock_qty: 2, available: true },
      { id: 'v6-2', size: 'S',  color: 'Sand',  stock_qty: 0, available: false },
      { id: 'v6-3', size: 'M',  color: 'Sand',  stock_qty: 3, available: true },
      { id: 'v6-4', size: 'L',  color: 'Sand',  stock_qty: 1, available: true },
      { id: 'v6-5', size: 'XS', color: 'Black', stock_qty: 4, available: true },
      { id: 'v6-6', size: 'S',  color: 'Black', stock_qty: 2, available: true },
      { id: 'v6-7', size: 'M',  color: 'Black', stock_qty: 0, available: false },
      { id: 'v6-8', size: 'L',  color: 'Black', stock_qty: 5, available: true },
    ],
  },
]

// ProductCard list shapes (spec §3.1.1): derived from detail data
export const mockProductCards = mockProductDetails.map((p) => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  category: p.category,
  price_cents: p.price_cents,
  primary_image_url: p.images[0]?.url ?? null,
  in_stock: p.variants.some((v) => v.available),
}))

export const mockUser = null

export function mockGetProduct(idOrSlug) {
  return (
    mockProductDetails.find((p) => p.id === idOrSlug || p.slug === idOrSlug) ?? null
  )
}

export function mockGetProducts({ category } = {}) {
  const cards = category
    ? mockProductCards.filter((p) => p.category.slug === category)
    : mockProductCards
  return { items: cards, page: 1, page_size: 24, total: cards.length }
}

// ---------------------------------------------------------------------------
// Mock cart (in-memory; resets on page reload — acceptable for mock-only mode)
// ---------------------------------------------------------------------------

// Index: variantId -> { size, color, stock_qty, available, product_name, unit_price_cents }
const variantIndex = new Map()
mockProductDetails.forEach((p) => {
  p.variants.forEach((v) => {
    variantIndex.set(v.id, {
      ...v,
      product_name: p.name,
      unit_price_cents: p.price_cents,
    })
  })
})

function mockCartError(status, code, message, extra) {
  const err = new Error(message)
  err.status = status
  err.code = code
  if (extra) Object.assign(err, extra)
  return err
}

const _cart = {
  token: 'mock-cart-token',
  items: new Map(), // variantId -> CartItem
}

function buildCartResponse() {
  const items = [..._cart.items.values()]
  const subtotal_cents = items.reduce((sum, i) => sum + i.line_total_cents, 0)
  return { cart_token: _cart.token, items, subtotal_cents }
}

export function mockGetCart() {
  return buildCartResponse()
}

export function mockAddToCart({ variantId, quantity }) {
  const info = variantIndex.get(variantId)
  if (!info) throw mockCartError(404, 'not_found', 'Variant not found')
  if (!info.available) {
    throw mockCartError(409, 'out_of_stock', 'Sorry, that size just sold out.')
  }

  const existing = _cart.items.get(variantId)
  const newQty = (existing?.quantity ?? 0) + quantity
  if (newQty > info.stock_qty) {
    const have = existing?.quantity ?? 0
    const msg = have > 0
      ? `Only ${info.stock_qty} units available; you already have ${have} in your cart.`
      : `Only ${info.stock_qty} units available.`
    throw mockCartError(409, 'out_of_stock', msg)
  }

  _cart.items.set(variantId, {
    variant_id: variantId,
    product_name: info.product_name,
    size: info.size,
    color: info.color,
    unit_price_cents: info.unit_price_cents,
    quantity: newQty,
    line_total_cents: info.unit_price_cents * newQty,
  })
  return buildCartResponse()
}

export function mockUpdateCartItem({ variantId, quantity }) {
  if (!_cart.items.has(variantId)) {
    throw mockCartError(404, 'not_found', 'Item not in cart')
  }
  if (quantity === 0) {
    _cart.items.delete(variantId)
  } else {
    const item = _cart.items.get(variantId)
    const info = variantIndex.get(variantId)
    if (info && quantity > info.stock_qty) {
      throw mockCartError(409, 'out_of_stock', `Only ${info.stock_qty} units available.`)
    }
    _cart.items.set(variantId, {
      ...item,
      quantity,
      line_total_cents: item.unit_price_cents * quantity,
    })
  }
  return buildCartResponse()
}

export function mockRemoveCartItem({ variantId }) {
  _cart.items.delete(variantId)
  return buildCartResponse()
}

// ---------------------------------------------------------------------------
// Mock auth (in-memory; resets on page reload — acceptable for mock-only mode)
// ---------------------------------------------------------------------------

const _mockUsers = new Map()       // id -> { id, email, name, role, password }
const _mockEmailIndex = new Map()  // email.toLowerCase() -> id
const _mockAccessTokens = new Map()  // token -> userId
const _mockRefreshTokens = new Map() // token -> userId
let _mockUserSeq = 100

function createMockTokens(userId) {
  const access_token = `mock-at-${userId}-${Date.now()}`
  const refresh_token = `mock-rt-${userId}-${Date.now()}`
  _mockAccessTokens.set(access_token, userId)
  _mockRefreshTokens.set(refresh_token, userId)
  return { access_token, refresh_token }
}

function mockAuthErr(status, code, message, fields) {
  const err = new Error(message)
  err.status = status
  err.code = code
  err.fields = fields ?? null
  err.body = { error: code, message, ...(fields ? { fields } : {}) }
  return err
}

export function mockRegister({ email, password, name }) {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw mockAuthErr(400, 'invalid_input', 'Validation failed.', { email: 'Invalid email address.' })
  }
  if (!password || password.length < 8) {
    throw mockAuthErr(400, 'invalid_input', 'Validation failed.', { password: 'Must be at least 8 characters.' })
  }
  const key = email.toLowerCase()
  if (_mockEmailIndex.has(key)) {
    throw mockAuthErr(409, 'conflict', 'An account with that email already exists.')
  }
  const id = _mockUserSeq++
  const user = { id, email, name: name || '', role: 'customer' }
  _mockUsers.set(id, { ...user, password })
  _mockEmailIndex.set(key, id)
  const tokens = createMockTokens(id)
  return { user, ...tokens }
}

export function mockLogin({ email, password }) {
  const id = _mockEmailIndex.get(email.toLowerCase())
  const stored = id !== undefined ? _mockUsers.get(id) : null
  if (!stored || stored.password !== password) {
    throw mockAuthErr(401, 'unauthorized', 'Invalid email or password.')
  }
  const { password: _pw, ...user } = stored
  const tokens = createMockTokens(id)
  return { user, ...tokens }
}

export function mockRefresh({ refreshToken }) {
  const userId = _mockRefreshTokens.get(refreshToken)
  if (!userId) throw mockAuthErr(401, 'unauthorized', 'Refresh token expired or invalid.')
  const { access_token } = createMockTokens(userId)
  return { access_token }
}

export function mockMe(storedUser) {
  if (storedUser) return { user: storedUser }
  throw mockAuthErr(401, 'unauthorized', 'Not authenticated.')
}

let _orderSeq = 10000

// ---------------------------------------------------------------------------
// Mock order store
// ---------------------------------------------------------------------------

const _mockOrderStore = new Map()   // order_number -> full order object
const _mockOrderEmails = new Map()  // order_number -> email (for guest lookup)

function mockOrderNotFound() {
  const err = new Error('No matching order found.')
  err.status = 404
  err.code = 'not_found'
  return err
}

export function mockGetOrders() {
  return [..._mockOrderStore.values()].reverse()
}

export function mockGetOrder(orderNumber) {
  const order = _mockOrderStore.get(orderNumber)
  if (!order) throw mockOrderNotFound()
  return order
}

export function mockLookup({ orderNumber, email }) {
  const order = _mockOrderStore.get(orderNumber)
  // Always the same neutral 404 — never confirm whether the order_number exists (INV-8)
  if (!order || order.email.toLowerCase() !== email.toLowerCase()) {
    throw mockOrderNotFound()
  }
  return order
}

export function mockCheckout({ email, shippingAddress }) {
  const items = [..._cart.items.values()]
  if (items.length === 0) {
    throw mockCartError(400, 'empty_cart', 'Your cart is empty.')
  }
  const subtotal_cents = items.reduce((sum, i) => sum + i.line_total_cents, 0)
  const order_number = `TC-${++_orderSeq}`
  _cart.items.clear()
  const order = {
    order_number,
    status: 'Paid',
    email,
    items,
    subtotal_cents,
    total_cents: subtotal_cents,
    shipping_address: shippingAddress,
    payment_method: 'mock',
    is_mock_payment: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  _mockOrderStore.set(order_number, order)
  _mockOrderEmails.set(order_number, email)
  return order
}
