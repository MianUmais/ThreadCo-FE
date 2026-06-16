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

export const mockCart = { items: [], subtotal_cents: 0 }
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
