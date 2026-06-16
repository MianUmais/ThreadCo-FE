import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { mockGetProduct } from '../api/mock'
import styles from './ProductDetail.module.css'

export default function ProductDetail() {
  const { id } = useParams()
  const product = mockGetProduct(id)
  const [selectedSize, setSelectedSize] = useState(null)

  if (!product) {
    return (
      <div className="container page">
        <p>Product not found.</p>
        <Link to="/products" className="btn btn-outline" style={{ marginTop: '1.5rem' }}>
          Back to Shop
        </Link>
      </div>
    )
  }

  return (
    <div className="container page">
      <div className={styles.layout}>
        <div className={styles.imageCol}>
          <div className={styles.imagePlaceholder} />
        </div>

        <div className={styles.infoCol}>
          <p className={styles.category}>{product.category}</p>
          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.price}>${product.price.toFixed(2)}</p>

          <p className={styles.description}>{product.description}</p>

          <div className={styles.sizeSection}>
            <p className={styles.sizeLabel}>Select Size</p>
            <div className={styles.sizes}>
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={[
                    styles.sizeBtn,
                    selectedSize === size ? styles.sizeBtnActive : '',
                  ].join(' ')}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={!product.inStock || !selectedSize}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>

          <Link to="/products" className={styles.back}>
            &larr; Back to Shop
          </Link>
        </div>
      </div>
    </div>
  )
}
