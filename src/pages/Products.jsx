import { useState } from 'react'
import { Link } from 'react-router-dom'
import { mockProducts } from '../api/mock'
import styles from './Products.module.css'

const CATEGORIES = ['all', 'tops', 'bottoms', 'outerwear', 'dresses']

export default function Products() {
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered =
    activeCategory === 'all'
      ? mockProducts
      : mockProducts.filter((p) => p.category === activeCategory)

  return (
    <div className="container page">
      <h1 className="page-title">Shop</h1>

      <div className={styles.filters}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={[styles.filterBtn, activeCategory === cat ? styles.filterBtnActive : ''].join(' ')}
            onClick={() => setActiveCategory(cat)}
          >
            {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid-products">
        {filtered.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="product-card"
            style={{ textDecoration: 'none' }}
          >
            <div className="product-card__image">
              <div className={styles.imagePlaceholder} />
            </div>
            <p className="product-card__name">{product.name}</p>
            <p className="product-card__price">
              {product.inStock ? `$${product.price.toFixed(2)}` : 'Out of stock'}
            </p>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className={styles.empty}>No products in this category.</p>
      )}
    </div>
  )
}
