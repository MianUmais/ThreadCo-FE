import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getAdminOrders } from '../api/admin'
import { formatPrice, formatDate } from '../utils/format'
import styles from './Admin.module.css'

const STATUS_FILTERS = ['All', 'Paid', 'Packed', 'Shipped']

export default function AdminOrders() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeFilter = searchParams.get('status') || 'All'

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    const params = activeFilter !== 'All' ? { status: activeFilter } : {}
    getAdminOrders(params)
      .then(data => { if (!cancelled) { setOrders(data.items); setLoading(false) } })
      .catch(err => { if (!cancelled) { setError(err.message || 'Failed to load orders'); setLoading(false) } })
    return () => { cancelled = true }
  }, [activeFilter])

  function setFilter(f) {
    if (f === 'All') {
      setSearchParams({})
    } else {
      setSearchParams({ status: f })
    }
  }

  return (
    <>
      <div className={styles.topbar}>
        <h1 className={styles.pageTitle}>Orders</h1>
      </div>
      <div className={styles.content}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Order Queue</h2>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {STATUS_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                aria-pressed={activeFilter === f}
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.75rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  background: activeFilter === f ? 'var(--color-black)' : 'transparent',
                  color: activeFilter === f ? 'var(--color-white)' : 'var(--color-gray-400)',
                  border: '1px solid var(--color-gray-200)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {error && (
            <p role="alert" style={{ color: '#c0392b', marginBottom: '1rem' }}>{error}</p>
          )}

          {loading ? (
            <p>Loading…</p>
          ) : orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Placed</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.order_number}>
                    <td>
                      <Link
                        to={`/admin/orders/${o.order_number}`}
                        style={{ fontWeight: 500 }}
                      >
                        {o.order_number}
                      </Link>
                      {o.is_mock_payment && (
                        <span style={{ marginLeft: '0.5rem', fontSize: '0.625rem', letterSpacing: '0.08em', background: '#fff3cd', color: '#856404', padding: '0.1rem 0.35rem' }}>
                          MOCK
                        </span>
                      )}
                    </td>
                    <td style={{ color: 'var(--color-gray-600)' }}>{o.email}</td>
                    <td>{o.item_count}</td>
                    <td>{formatPrice(o.total_cents)}</td>
                    <td>
                      <span className={[
                        styles.badge,
                        o.status === 'Paid' ? styles.badgeGreen : styles.badgeGray,
                      ].join(' ')}>
                        {o.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--color-gray-600)', fontSize: '0.8125rem' }}>
                      {formatDate(o.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}
