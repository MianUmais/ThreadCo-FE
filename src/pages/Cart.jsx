import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import CartLine from '../components/CartLine'
import { formatPrice } from '../utils/format'
import styles from './Cart.module.css'

export default function Cart() {
  const { cart, cartCount, updateItem, removeItem, loading } = useCart()
  const navigate = useNavigate()
  // Per-line updating state and errors: keyed by variant_id
  const [lineUpdating, setLineUpdating] = useState({})
  const [lineErrors, setLineErrors] = useState({})

  async function handleUpdate(variantId, quantity) {
    setLineUpdating((s) => ({ ...s, [variantId]: true }))
    setLineErrors((s) => ({ ...s, [variantId]: null }))
    const result = await updateItem(variantId, quantity)
    if (!result.ok) {
      setLineErrors((s) => ({ ...s, [variantId]: result.message }))
    }
    setLineUpdating((s) => ({ ...s, [variantId]: false }))
  }

  async function handleRemove(variantId) {
    setLineUpdating((s) => ({ ...s, [variantId]: true }))
    await removeItem(variantId)
    setLineUpdating((s) => ({ ...s, [variantId]: false }))
  }

  if (loading) {
    return (
      <div className="container page">
        <p className={styles.status}>Loading cart&hellip;</p>
      </div>
    )
  }

  if (cartCount === 0) {
    return (
      <div className="container page">
        <h1 className="page-title">Cart</h1>
        <div className={styles.empty}>
          <p>Your cart is empty.</p>
          <Link to="/products" className="btn btn-outline" style={{ marginTop: '1.5rem' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container page">
      <h1 className="page-title">Cart</h1>

      <div className={styles.layout}>
        <section className={styles.items} aria-label="Cart items">
          {cart.items.map((item) => (
            <CartLine
              key={item.variant_id}
              item={item}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
              updating={!!lineUpdating[item.variant_id]}
              error={lineErrors[item.variant_id] ?? null}
            />
          ))}
        </section>

        <aside className={styles.summary}>
          <h2 className={styles.summaryTitle}>Summary</h2>

          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>{formatPrice(cart.subtotal_cents)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>

          <button
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1.5rem' }}
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>

          <Link to="/products" className={styles.continueShopping}>
            &larr; Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  )
}
