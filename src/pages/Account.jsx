import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authMe } from '../api/auth'
import styles from './Account.module.css'

export default function Account() {
  const { user: storedUser, logout } = useAuth()
  const [user, setUser] = useState(storedUser)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)

  useEffect(() => {
    let cancelled = false
    authMe(storedUser)
      .then((data) => { if (!cancelled) setUser(data.user) })
      .catch((err) => { if (!cancelled) setFetchError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="container page">
        <p>Loading…</p>
      </div>
    )
  }

  return (
    <div className="container page">
      <h1 className="page-title">My Account</h1>

      {fetchError && (
        <p className={styles.fetchError} role="alert">
          {fetchError}
        </p>
      )}

      <div className={styles.sections}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Profile</h2>
          {user?.name && <p className={styles.userName}>{user.name}</p>}
          <p>{user?.email ?? storedUser?.email}</p>
          <button
            className="btn btn-outline"
            style={{ marginTop: '1rem' }}
            onClick={logout}
          >
            Sign Out
          </button>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Orders</h2>
          <Link to="/account/orders" className={styles.ordersLink}>
            View My Orders
          </Link>
        </section>
      </div>
    </div>
  )
}
