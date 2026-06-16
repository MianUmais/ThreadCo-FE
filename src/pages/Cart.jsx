import { Link } from 'react-router-dom'
import styles from './Cart.module.css'

export default function Cart() {
  const items = []

  return (
    <div className="container page">
      <h1 className="page-title">Cart</h1>

      {items.length === 0 ? (
        <div className={styles.empty}>
          <p>Your cart is empty.</p>
          <Link to="/products" className="btn btn-outline" style={{ marginTop: '1.5rem' }}>
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className={styles.layout}>
          <div className={styles.items}>
            {items.map((item) => (
              <div key={item.id} className={styles.item}>
                <div className={styles.itemImage} />
                <div className={styles.itemInfo}>
                  <p className={styles.itemName}>{item.name}</p>
                  <p className={styles.itemMeta}>Size: {item.size}</p>
                  <p className={styles.itemPrice}>${item.price.toFixed(2)}</p>
                </div>
                <button className={styles.removeBtn}>Remove</button>
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>Summary</h2>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>$0.00</span>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
