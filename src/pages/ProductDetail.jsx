import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProduct, NotFoundError } from '../api/catalog'
import { formatPrice } from '../utils/format'
import VariantSelector from '../components/VariantSelector'
import styles from './ProductDetail.module.css'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [selectedVariantId, setSelectedVariantId] = useState(null)

  useEffect(() => {
    setProduct(null)
    setNotFound(false)
    setSelectedVariantId(null)
    getProduct(id)
      .then(setProduct)
      .catch((err) => {
        if (err instanceof NotFoundError || err?.status === 404) {
          setNotFound(true)
        }
      })
  }, [id])

  if (notFound) {
    return (
      <div className="container page">
        <p className={styles.notFound}>Product not found.</p>
        <Link to="/products" className="btn btn-outline" style={{ marginTop: '1.5rem' }}>
          Back to Shop
        </Link>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container page">
        <p className={styles.loading}>Loading&hellip;</p>
      </div>
    )
  }

  const primaryImage = product.images?.find((img) => img.position === 0) ?? product.images?.[0]
  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId) ?? null
  const canAddToCart = selectedVariant?.available === true

  const allSoldOut = product.variants.every((v) => !v.available)

  return (
    <div className="container page">
      <div className={styles.layout}>
        <div className={styles.imageCol}>
          {product.images?.length > 0 && primaryImage?.url ? (
            <img
              src={primaryImage.url}
              alt={product.name}
              className={styles.primaryImage}
            />
          ) : (
            <div className={styles.imagePlaceholder} aria-hidden="true" />
          )}
        </div>

        <div className={styles.infoCol}>
          <p className={styles.category}>{product.category?.name}</p>
          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.price}>{formatPrice(product.price_cents)}</p>

          {product.description && (
            <p className={styles.description}>{product.description}</p>
          )}

          {allSoldOut ? (
            <p className={styles.allSoldOut}>Currently sold out — check back soon.</p>
          ) : (
            <VariantSelector
              variants={product.variants}
              selectedVariantId={selectedVariantId}
              onSelect={setSelectedVariantId}
            />
          )}

          <button
            className={['btn btn-primary', styles.addToCartBtn].join(' ')}
            disabled={!canAddToCart}
            aria-disabled={!canAddToCart}
          >
            {allSoldOut
              ? 'Sold Out'
              : canAddToCart
              ? 'Add to Cart'
              : 'Select a size'}
          </button>

          <Link to="/products" className={styles.back}>
            &larr; Back to Shop
          </Link>
        </div>
      </div>
    </div>
  )
}
