import { Link } from 'react-router-dom'
import { mockProducts } from '../api/mock'
import styles from './Storefront.module.css'

export default function Storefront() {
  const featured = mockProducts.filter((p) => p.inStock).slice(0, 3)

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>New Collection</p>
          <h1 className={styles.heroTitle}>Minimal. Essential. Enduring.</h1>
          <Link to="/products" className="btn btn-primary">
            Shop Now
          </Link>
        </div>
      </section>

      <section className={styles.featured}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Featured</h2>
          <div className="grid-products">
            {featured.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="product-card"
                style={{ textDecoration: 'none' }}
              >
                <div className="product-card__image">
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <div className={styles.imagePlaceholder} />
                  )}
                </div>
                <p className="product-card__name">{product.name}</p>
                <p className="product-card__price">${product.price.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
