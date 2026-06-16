import { useState, useEffect } from 'react'
import { getProducts, getCategories } from '../api/catalog'
import ProductCard from '../components/ProductCard'
import CategoryFilter from '../components/CategoryFilter'
import styles from './Products.module.css'

export default function Products() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  useEffect(() => {
    setLoading(true)
    getProducts({ category: activeCategory ?? undefined })
      .then(({ items }) => setProducts(items))
      .finally(() => setLoading(false))
  }, [activeCategory])

  return (
    <div className="container page">
      <h1 className="page-title">Shop</h1>

      <CategoryFilter
        categories={categories}
        activeSlug={activeCategory}
        onChange={setActiveCategory}
      />

      {loading ? (
        <p className={styles.status}>Loading&hellip;</p>
      ) : products.length === 0 ? (
        <p className={styles.status}>No products in this category.</p>
      ) : (
        <div className="grid-products">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
