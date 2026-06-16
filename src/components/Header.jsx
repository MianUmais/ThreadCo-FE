import { NavLink, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import styles from './Header.module.css'

export default function Header() {
  const { cartCount } = useCart()
  const { isAuthenticated, logout } = useAuth()

  return (
    <header className={styles.header} data-testid="site-header">
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          ThreadCo
        </Link>

        <nav className={styles.nav} aria-label="Main navigation">
          <NavLink
            to="/products"
            className={({ isActive }) =>
              [styles.navLink, isActive ? styles.navLinkActive : ''].join(' ')
            }
          >
            Shop
          </NavLink>

          {isAuthenticated ? (
            <NavLink
              to="/account"
              className={({ isActive }) =>
                [styles.navLink, isActive ? styles.navLinkActive : ''].join(' ')
              }
            >
              Account
            </NavLink>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                [styles.navLink, isActive ? styles.navLinkActive : ''].join(' ')
              }
            >
              Sign In
            </NavLink>
          )}
        </nav>

        <div className={styles.actions}>
          {isAuthenticated && (
            <button
              className={styles.actionButton}
              onClick={logout}
              aria-label="Sign out"
            >
              Sign Out
            </button>
          )}
          <Link
            to="/cart"
            className={styles.actionLink}
            aria-label={cartCount > 0 ? `Cart (${cartCount} items)` : 'Cart'}
          >
            Cart{cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  )
}
