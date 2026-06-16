import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getOrders } from '../api/orders'
import { formatPrice, formatDate } from '../utils/format'
import styles from './OrderHistory.module.css'

const STATUS_CLASS = {
  Paid: styles.statusPaid,
  Packed: styles.statusPacked,
  Shipped: styles.statusShipped,
}

export default function OrderHistory() {
  const [orders, setOrders] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    getOrders()
      .then((data) => { if (!cancelled) setOrders(data) })
      .catch((err) => { if (!cancelled) setError(err.message || 'Failed to load orders.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <div className="container page">
        <h1 className="page-title">My Orders</h1>
        <p className={styles.loading}>Loading…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container page">
        <h1 className="page-title">My Orders</h1>
        <p className={styles.fetchError} role="alert">{error}</p>
      </div>
    )
  }

  return (
    <div className="container page">
      <h1 className="page-title">My Orders</h1>
      <p className={styles.backLink}>
        <Link to="/account">← Account</Link>
      </p>

      {orders.length === 0 ? (
        <div className={styles.empty}>
          <p>You haven't placed any orders yet.</p>
          <Link to="/products" className="btn btn-outline" style={{ marginTop: '1rem' }}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <ul className={styles.list} aria-label="Order list">
          {orders.map((order) => (
            <li key={order.order_number} className={styles.row}>
              <div className={styles.rowLeft}>
                <Link
                  to={`/account/orders/${order.order_number}`}
                  className={styles.orderNumber}
                >
                  {order.order_number}
                </Link>
                <span className={`${styles.statusBadge} ${STATUS_CLASS[order.status] ?? ''}`}>
                  {order.status}
                </span>
              </div>
              <div className={styles.rowRight}>
                <span className={styles.total}>{formatPrice(order.total_cents)}</span>
                <span className={styles.date}>{formatDate(order.created_at)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
