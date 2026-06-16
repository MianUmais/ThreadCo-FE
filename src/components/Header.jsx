import { NavLink, Link } from 'react-router-dom'
import styles from './Header.module.css'

const NAV_LINKS = [
  { to: '/products', label: 'Shop' },
  { to: '/account', label: 'Account' },
]

export default function Header() {
  return (
    <header className={styles.header} data-testid="site-header">
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          ThreadCo
        </Link>

        <nav className={styles.nav} aria-label="Main navigation">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [styles.navLink, isActive ? styles.navLinkActive : ''].join(' ')
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link to="/cart" className={styles.actionLink} aria-label="Cart">
            Cart
          </Link>
        </div>
      </div>
    </header>
  )
}
