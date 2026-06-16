import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer} data-testid="site-footer">
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo}>ThreadCo</span>
          <p className={styles.tagline}>Minimal by design.</p>
        </div>

        <nav className={styles.links} aria-label="Footer navigation">
          <Link to="/products">Shop</Link>
          <Link to="/account">Account</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/admin">Admin</Link>
        </nav>

        <p className={styles.copy}>&copy; {new Date().getFullYear()} ThreadCo</p>
      </div>
    </footer>
  )
}
