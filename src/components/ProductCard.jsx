import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/format'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }) {
  const { id, slug, name, price_cents, primary_image_url, in_stock } = product

  return (
    <Link
      to={`/product/${slug ?? id}`}
      className={styles.card}
      aria-label={name}
    >
      <div className={styles.imageWrap}>
        {primary_image_url ? (
          <img src={primary_image_url} alt={name} className={styles.image} />
        ) : (
          <div className={styles.imagePlaceholder} aria-hidden="true" />
        )}
        {!in_stock && (
          <span className={styles.soldOutBadge} aria-label="Sold out">
            Sold Out
          </span>
        )}
      </div>
      <p className={styles.name}>{name}</p>
      <p className={styles.price}>{formatPrice(price_cents)}</p>
    </Link>
  )
}
