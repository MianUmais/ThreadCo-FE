import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getAdminOrder, transitionOrder } from '../api/admin'
import { formatPrice, formatDate } from '../utils/format'
import styles from './Admin.module.css'

const NEXT_STATUS = { Paid: 'Packed', Packed: 'Shipped' }

export default function AdminOrderDetail() {
  const { orderNumber } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [transitioning, setTransitioning] = useState(false)
  const [transitionError, setTransitionError] = useState(null)

  const loadOrder = useCallback(() => {
    setLoading(true)
    setError(null)
    getAdminOrder(orderNumber)
      .then(data => { setOrder(data); setLoading(false) })
      .catch(err => { setError(err.message || 'Failed to load order'); setLoading(false) })
  }, [orderNumber])

  useEffect(() => { loadOrder() }, [loadOrder])

  async function handleTransition() {
    if (!order) return
    const toStatus = NEXT_STATUS[order.status]
    if (!toStatus) return
    setTransitioning(true)
    setTransitionError(null)
    try {
      await transitionOrder(orderNumber, toStatus)
      // Refetch to get updated status + full history
      await loadOrder()
    } catch (err) {
      if (err.status === 409 || err.code === 'invalid_transition') {
        setTransitionError(err.message || `Cannot transition to ${toStatus}.`)
      } else {
        setTransitionError(err.message || 'Transition failed.')
      }
    } finally {
      setTransitioning(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.content}>
        <p>Loading…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.content}>
        <p role="alert" style={{ color: '#c0392b' }}>{error}</p>
        <Link to="/admin/orders" className={styles.editBtn}>← Back to Orders</Link>
      </div>
    )
  }

  if (!order) return null

  const nextStatus = NEXT_STATUS[order.status] ?? null

  return (
    <>
      <div className={styles.topbar}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 className={styles.pageTitle}>{order.order_number}</h1>
          <span className={[styles.badge, order.status === 'Paid' ? styles.badgeGreen : styles.badgeGray].join(' ')}>
            {order.status}
          </span>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Order Details</h2>
            <Link to="/admin/orders" className={styles.editBtn}>← Back to Orders</Link>
          </div>

          {/* Fulfillment control */}
          {nextStatus && (
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--color-gray-50)', border: '1px solid var(--color-gray-200)' }}>
              <p style={{ fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                Current status: <strong>{order.status}</strong>
              </p>
              {transitionError && (
                <p role="alert" style={{ color: '#c0392b', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  {transitionError}
                </p>
              )}
              <button
                className="btn btn-primary"
                onClick={handleTransition}
                disabled={transitioning}
              >
                {transitioning ? 'Updating…' : `Mark as ${nextStatus}`}
              </button>
            </div>
          )}

          {order.status === 'Shipped' && (
            <div style={{ marginBottom: '1.5rem', padding: '0.75rem 1rem', background: '#f0f7f0', border: '1px solid #c3e6cb', fontSize: '0.875rem', color: '#2d6a2d' }}>
              Order fulfilled — no further transitions available.
            </div>
          )}

          {/* Line items */}
          <h3 className={styles.sectionTitle} style={{ marginBottom: '0.75rem' }}>Items</h3>
          <table className={styles.table} style={{ marginBottom: '1.5rem' }}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Size</th>
                <th>Color</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Line Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i}>
                  <td>{item.product_name}</td>
                  <td>{item.size}</td>
                  <td>{item.color}</td>
                  <td>{item.quantity}</td>
                  <td>{formatPrice(item.unit_price_cents)}</td>
                  <td>{formatPrice(item.line_total_cents)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem', marginBottom: '2rem' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>
              Subtotal: <strong>{formatPrice(order.subtotal_cents)}</strong>
            </p>
            <p style={{ fontSize: '0.875rem' }}>
              Grand Total: <strong>{formatPrice(order.total_cents)}</strong>
            </p>
          </div>

          {/* Shipping address */}
          <h3 className={styles.sectionTitle} style={{ marginBottom: '0.75rem' }}>Shipping Address</h3>
          <address style={{ fontStyle: 'normal', fontSize: '0.875rem', color: 'var(--color-gray-600)', marginBottom: '2rem' }}>
            <p>{order.shipping_address.name}</p>
            <p>{order.shipping_address.line1}</p>
            {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
            <p>{order.shipping_address.city}, {order.shipping_address.region} {order.shipping_address.postal_code}</p>
            <p>{order.shipping_address.country}</p>
          </address>

          {/* Payment */}
          <h3 className={styles.sectionTitle} style={{ marginBottom: '0.75rem' }}>Payment</h3>
          <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginBottom: '2rem' }}>
            <p>
              Method: {order.payment_method || 'Card'}
              {order.is_mock_payment && (
                <span style={{ marginLeft: '0.5rem', background: '#fff3cd', color: '#856404', padding: '0.1rem 0.5rem', fontSize: '0.75rem', letterSpacing: '0.06em' }}>
                  MOCK PAYMENT
                </span>
              )}
            </p>
          </div>

          {/* Status history */}
          {order.status_history && order.status_history.length > 0 && (
            <>
              <h3 className={styles.sectionTitle} style={{ marginBottom: '0.75rem' }}>Status History</h3>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>From</th>
                    <th>To</th>
                    <th>At</th>
                    <th>By Admin</th>
                  </tr>
                </thead>
                <tbody>
                  {order.status_history.map((h, i) => (
                    <tr key={i}>
                      <td>{h.from_status}</td>
                      <td>{h.to_status}</td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--color-gray-600)' }}>{formatDate(h.at)}</td>
                      <td style={{ color: 'var(--color-gray-600)' }}>#{h.by_admin_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </>
  )
}
