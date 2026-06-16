import { Link } from 'react-router-dom'
import styles from './Account.module.css'

export default function Account() {
  const user = null

  if (!user) {
    return (
      <div className="container page">
        <div className={styles.unauthenticated}>
          <h1 className={styles.title}>My Account</h1>
          <p className={styles.message}>Sign in to view your account and order history.</p>
          <Link to="/login" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container page">
      <h1 className="page-title">My Account</h1>
      <div className={styles.sections}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Profile</h2>
          <p>{user.email}</p>
        </section>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Orders</h2>
          <p className={styles.empty}>No orders yet.</p>
        </section>
      </div>
    </div>
  )
}
