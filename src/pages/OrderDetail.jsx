import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getOrder } from '../api/orders'
import { formatPrice, formatDate } from '../utils/format'
import styles from './OrderDetail.module.css'

const STATUS_CLASS = {
  Paid: styles.statusPaid,
  Packed: styles.statusPacked,
  Shipped: styles.statusShipped,
}

export default function OrderDetail() {
  const { orderNumber } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    getOrder(orderNumber)
      .then((data) => { if (!cancelled) setOrder(data) })
      .catch((err) => {
        if (!cancelled) {
          if (err.status === 404) setNotFound(true)
          else setError(err.message || 'Failed to load order.')
        }
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [orderNumber])

  if (loading) {
    return (
      <div className="container page">
        <p>Loading…</p>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="container page">
        <p className={styles.notFound} role="alert">Order not found.</p>
        <Link to="/account/orders" className="btn btn-outline" style={{ marginTop: '1rem' }}>
          Back to My Orders
        </Link>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container page">
        <p className={styles.fetchError} role="alert">{error}</p>
      </div>
    )
  }

  return (
    <div className="container page">
      <p className={styles.backLink}>
        <Link to="/account/orders">← My Orders</Link>
      </p>

      <div className={styles.header}>
        <h1 className={styles.orderNumber}>{order.order_number}</h1>
        <span className={`${styles.statusBadge} ${STATUS_CLASS[order.status] ?? ''}`}>
          {order.status}
        </span>
      </div>

      <p className={styles.date}>Placed {formatDate(order.created_at)}</p>

      {order.is_mock_payment && (
        <p className={styles.mockNotice}>Demo order — no real charge was made.</p>
      )}

      {/* Items */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Items</h2>
        <ul className={styles.itemList}>
          {order.items.map((item, i) => (
            <li key={item.variant_id ?? i} className={styles.item}>
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>{item.product_name}</span>
                <span className={styles.itemMeta}>
                  {item.size} / {item.color} × {item.quantity}
                </span>
              </div>
              <span className={styles.itemTotal}>{formatPrice(item.line_total_cents)}</span>
            </li>
          ))}
        </ul>

        <div className={styles.totals}>
          <div className={styles.totalRow}>
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal_cents)}</span>
          </div>
          <div className={`${styles.totalRow} ${styles.grandTotal}`}>
            <span>Total</span>
            <span>{formatPrice(order.total_cents)}</span>
          </div>
        </div>
      </section>

      {/* Shipping */}
      {order.shipping_address && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Shipping Address</h2>
          <address className={styles.address}>
            <p>{order.shipping_address.name}</p>
            <p>{order.shipping_address.line1}</p>
            {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
            <p>
              {order.shipping_address.city}, {order.shipping_address.region}{' '}
              {order.shipping_address.postal_code}
            </p>
            <p>{order.shipping_address.country}</p>
          </address>
        </section>
      )}
    </div>
  )
}
