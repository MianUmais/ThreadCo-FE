import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getProduct, NotFoundError } from '../api/catalog'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/format'
import VariantSelector from '../components/VariantSelector'
import styles from './ProductDetail.module.css'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()

  const [product, setProduct] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [selectedVariantId, setSelectedVariantId] = useState(null)
  const [addingToCart, setAddingToCart] = useState(false)
  const [cartFeedback, setCartFeedback] = useState(null) // { ok, message }

  useEffect(() => {
    setProduct(null)
    setNotFound(false)
    setSelectedVariantId(null)
    setCartFeedback(null)
    getProduct(id)
      .then(setProduct)
      .catch((err) => {
        if (err instanceof NotFoundError || err?.status === 404) setNotFound(true)
      })
  }, [id])

  async function handleAddToCart() {
    if (!selectedVariantId) return
    setAddingToCart(true)
    setCartFeedback(null)
    const result = await addItem(selectedVariantId, 1)
    if (result.ok) {
      setCartFeedback({ ok: true, message: 'Added to cart' })
    } else {
      setCartFeedback({ ok: false, message: result.message })
    }
    setAddingToCart(false)
  }

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
            <img src={primaryImage.url} alt={product.name} className={styles.primaryImage} />
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
              onSelect={(id) => { setSelectedVariantId(id); setCartFeedback(null) }}
            />
          )}

          {cartFeedback && (
            <p className={cartFeedback.ok ? styles.feedbackOk : styles.feedbackError}>
              {cartFeedback.message}
              {cartFeedback.ok && (
                <>
                  {' — '}
                  <button
                    className={styles.viewCartLink}
                    onClick={() => navigate('/cart')}
                  >
                    View Cart
                  </button>
                </>
              )}
            </p>
          )}

          <button
            className={['btn btn-primary', styles.addToCartBtn].join(' ')}
            onClick={handleAddToCart}
            disabled={!canAddToCart || addingToCart}
            aria-disabled={!canAddToCart || addingToCart}
          >
            {allSoldOut
              ? 'Sold Out'
              : addingToCart
              ? 'Adding…'
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
