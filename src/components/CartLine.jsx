import { formatPrice } from '../utils/format'
import styles from './CartLine.module.css'

export default function CartLine({ item, onUpdate, onRemove, error, updating }) {
  const { variant_id, product_name, size, color, unit_price_cents, quantity, line_total_cents } =
    item

  function handleQtyChange(e) {
    const val = parseInt(e.target.value, 10)
    if (!isNaN(val) && val >= 1) {
      onUpdate(variant_id, val)
    }
  }

  function handleDecrement() {
    if (quantity > 1) onUpdate(variant_id, quantity - 1)
  }

  function handleIncrement() {
    onUpdate(variant_id, quantity + 1)
  }

  return (
    <div className={styles.line} aria-label={`${product_name} ${size}/${color}`}>
      <div className={styles.imageWrap}>
        <div className={styles.imagePlaceholder} aria-hidden="true" />
      </div>

      <div className={styles.info}>
        <p className={styles.name}>{product_name}</p>
        <p className={styles.meta}>
          {size} / {color}
        </p>
        <p className={styles.unitPrice}>{formatPrice(unit_price_cents)}</p>

        {error && <p className={styles.error}>{error}</p>}
      </div>

      <div className={styles.controls}>
        <div className={styles.qty} aria-label="Quantity">
          <button
            className={styles.qtyBtn}
            onClick={handleDecrement}
            disabled={quantity <= 1 || updating}
            aria-label="Decrease quantity"
          >
            &minus;
          </button>
          <input
            className={styles.qtyInput}
            type="number"
            min={1}
            value={quantity}
            onChange={handleQtyChange}
            disabled={updating}
            aria-label="Item quantity"
          />
          <button
            className={styles.qtyBtn}
            onClick={handleIncrement}
            disabled={updating}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <p className={styles.lineTotal}>{formatPrice(line_total_cents)}</p>

        <button
          className={styles.removeBtn}
          onClick={() => onRemove(variant_id)}
          disabled={updating}
          aria-label={`Remove ${product_name} from cart`}
        >
          Remove
        </button>
      </div>
    </div>
  )
}
