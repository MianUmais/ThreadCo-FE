import { Link, useLocation } from 'react-router-dom'
import { formatPrice } from '../utils/format'
import styles from './OrderConfirmation.module.css'

export default function OrderConfirmation() {
  const { state } = useLocation()
  const order = state?.order ?? null

  if (!order) {
    return (
      <div className="container page">
        <h1 className="page-title">Order Confirmation</h1>
        <p className={styles.fallback}>
          No order details found. If you just placed an order, save your order number from the
          confirmation email.
        </p>
        <Link to="/" className="btn btn-outline" style={{ marginTop: '1.5rem' }}>
          Return to Store
        </Link>
      </div>
    )
  }

  return (
    <div className="container page">
      <div className={styles.card}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Order Confirmed</p>
          <h1 className={styles.orderNumber}>{order.order_number}</h1>
          <p className={styles.status}>
            Status:{' '}
            <span className={styles.statusPaid}>{order.status}</span>
          </p>
        </div>

        {order.is_mock_payment && (
          <div className={styles.mockNotice} role="note">
            <strong>Demo order.</strong> No real charge was made. This is a simulated payment for
            demonstration purposes.
          </div>
        )}

        <div className={styles.saveNotice} role="note">
          Save your order number: <strong>{order.order_number}</strong>. You can use it to look up
          this order.
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Items</h2>
          <ul className={styles.items}>
            {order.items.map((item, i) => (
              <li key={item.variant_id ?? i} className={styles.item}>
                <div className={styles.itemInfo}>
                  <p className={styles.itemName}>{item.product_name}</p>
                  <p className={styles.itemMeta}>
                    {item.size} / {item.color} × {item.quantity}
                  </p>
                </div>
                <p className={styles.itemTotal}>{formatPrice(item.line_total_cents)}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <div className={styles.totals}>
            <div className={styles.totalRow}>
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal_cents)}</span>
            </div>
            <div className={[styles.totalRow, styles.totalRowBold].join(' ')}>
              <span>Total</span>
              <span>{formatPrice(order.total_cents)}</span>
            </div>
          </div>
        </section>

        {order.shipping_address && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Shipping to</h2>
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

        <div className={styles.actions}>
          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
