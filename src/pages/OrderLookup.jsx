import { useState } from 'react'
import { ordersLookup } from '../api/orders'
import { formatPrice, formatDate } from '../utils/format'
import styles from './OrderLookup.module.css'

export default function OrderLookup() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)    // found order
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setResult(null)
    setNotFound(false)
    setError(null)
    setSubmitting(true)
    try {
      const order = await ordersLookup({ orderNumber: orderNumber.trim(), email: email.trim() })
      setResult(order)
    } catch (err) {
      if (err.status === 404) {
        setNotFound(true)
      } else {
        setError(err.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container page">
      <h1 className="page-title">Track Your Order</h1>
      <p className={styles.subtitle}>
        Enter your order number and the email address you used at checkout.
      </p>

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="order-number">
            Order Number *
          </label>
          <input
            id="order-number"
            type="text"
            className="form-input"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="TC-10001"
            required
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="lookup-email">
            Email Address *
          </label>
          <input
            id="lookup-email"
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        {/* Neutral 404 — does not confirm whether the order number exists (INV-8) */}
        {notFound && (
          <p className={styles.notFound} role="alert">
            We couldn't find an order matching those details.
          </p>
        )}

        {error && (
          <p className={styles.errorMsg} role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting || !orderNumber.trim() || !email.trim()}
        >
          {submitting ? 'Looking Up…' : 'Look Up Order'}
        </button>
      </form>

      {result && <OrderResult order={result} />}
    </div>
  )
}

function OrderResult({ order }) {
  const STATUS_LABEL = {
    Paid: 'Order received',
    Packed: 'Packed — preparing to ship',
    Shipped: 'Shipped',
  }

  return (
    <section className={styles.result} aria-label="Order details">
      <div className={styles.resultHeader}>
        <h2 className={styles.resultOrderNumber}>{order.order_number}</h2>
        <span className={styles.statusText}>
          {STATUS_LABEL[order.status] ?? order.status}
        </span>
      </div>

      <p className={styles.resultDate}>Placed {formatDate(order.created_at)}</p>

      {order.is_mock_payment && (
        <p className={styles.mockNotice}>Demo order — no real charge was made.</p>
      )}

      <ul className={styles.itemList}>
        {order.items.map((item, i) => (
          <li key={item.variant_id ?? i} className={styles.item}>
            <div>
              <span className={styles.itemName}>{item.product_name}</span>
              <span className={styles.itemMeta}>
                {' '}{item.size} / {item.color} × {item.quantity}
              </span>
            </div>
            <span>{formatPrice(item.line_total_cents)}</span>
          </li>
        ))}
      </ul>

      <div className={styles.total}>
        <span>Total</span>
        <span>{formatPrice(order.total_cents)}</span>
      </div>

      {order.shipping_address && (
        <div className={styles.address}>
          <p className={styles.addressLabel}>Shipping to</p>
          <p>{order.shipping_address.name}</p>
          <p>{order.shipping_address.line1}</p>
          {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
          <p>
            {order.shipping_address.city}, {order.shipping_address.region}{' '}
            {order.shipping_address.postal_code}
          </p>
        </div>
      )}
    </section>
  )
}
