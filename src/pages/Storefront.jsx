import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../api/catalog'
import ProductCard from '../components/ProductCard'
import styles from './Storefront.module.css'

export default function Storefront() {
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    getProducts({ page_size: 3 }).then(({ items }) =>
      setFeatured(items.filter((p) => p.in_stock).slice(0, 3))
    )
  }, [])

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>New Collection</p>
          <h1 className={styles.heroTitle}>Minimal.&ensp;Essential.&ensp;Enduring.</h1>
          <Link to="/products" className="btn btn-primary">
            Shop Now
          </Link>
        </div>
      </section>

      {featured.length > 0 && (
        <section className={styles.featured}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Featured</h2>
            <div className="grid-products">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
