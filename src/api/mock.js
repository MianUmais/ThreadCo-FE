export const mockProducts = [
  {
    id: '1',
    name: 'Oversized Linen Shirt',
    price: 89.99,
    category: 'tops',
    image: null,
    description: 'Relaxed fit linen shirt with a dropped shoulder silhouette.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
  },
  {
    id: '2',
    name: 'Wide-Leg Trousers',
    price: 115.0,
    category: 'bottoms',
    image: null,
    description: 'Fluid wide-leg trousers in a soft crepe fabric.',
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
  },
  {
    id: '3',
    name: 'Structured Blazer',
    price: 199.0,
    category: 'outerwear',
    image: null,
    description: 'Tailored blazer with a clean, minimal finish.',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
  },
  {
    id: '4',
    name: 'Ribbed Knit Top',
    price: 59.99,
    category: 'tops',
    image: null,
    description: 'Fine ribbed knit top with a square neckline.',
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: false,
  },
  {
    id: '5',
    name: 'Straight-Cut Jeans',
    price: 95.0,
    category: 'bottoms',
    image: null,
    description: 'Classic straight-cut jeans in a mid-rise silhouette.',
    sizes: ['24', '25', '26', '27', '28', '30'],
    inStock: true,
  },
  {
    id: '6',
    name: 'Draped Midi Dress',
    price: 145.0,
    category: 'dresses',
    image: null,
    description: 'Draped midi dress with an asymmetric hemline.',
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
  },
]

export const mockCart = {
  items: [],
  total: 0,
}

export const mockUser = null

export function mockGetProduct(id) {
  return mockProducts.find((p) => p.id === id) || null
}
