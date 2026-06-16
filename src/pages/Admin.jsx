import { Link, Outlet } from 'react-router-dom'
import styles from './Admin.module.css'

export default function Admin() {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <Link to="/" className={styles.brand}>
          ThreadCo Admin
        </Link>
        <nav className={styles.nav}>
          <Link to="/admin/products" className={styles.navLink}>
            Products
          </Link>
          <Link to="/admin/orders" className={styles.navLink}>
            Orders
          </Link>
        </nav>
        <Link to="/" className={styles.storefront}>
          &larr; Storefront
        </Link>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
