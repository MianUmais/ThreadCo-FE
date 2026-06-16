import { Link } from 'react-router-dom'
import { mockProducts } from '../api/mock'
import styles from './Admin.module.css'

export default function Admin() {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <Link to="/" className={styles.brand}>
          ThreadCo Admin
        </Link>
        <nav className={styles.nav}>
          <a href="#products" className={styles.navLink}>
            Products
          </a>
          <a href="#orders" className={styles.navLink}>
            Orders
          </a>
          <a href="#customers" className={styles.navLink}>
            Customers
          </a>
        </nav>
        <Link to="/" className={styles.storefront}>
          &larr; Storefront
        </Link>
      </aside>

      <main className={styles.main}>
        <div className={styles.topbar}>
          <h1 className={styles.pageTitle}>Dashboard</h1>
        </div>

        <div className={styles.content}>
          <section id="products" className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Products</h2>
              <button className="btn btn-primary">Add Product</button>
            </div>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {mockProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>
                      <span
                        className={[
                          styles.badge,
                          product.inStock ? styles.badgeGreen : styles.badgeGray,
                        ].join(' ')}
                      >
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td>
                      <button className={styles.editBtn}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </main>
    </div>
  )
}
