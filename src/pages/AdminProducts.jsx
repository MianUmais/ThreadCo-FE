import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAdminProducts, deleteProduct } from '../api/admin'
import { formatPrice } from '../utils/format'
import styles from './Admin.module.css'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false
    getAdminProducts()
      .then(data => { if (!cancelled) { setProducts(data.items); setLoading(false) } })
      .catch(err => { if (!cancelled) { setError(err.message || 'Failed to load products'); setLoading(false) } })
    return () => { cancelled = true }
  }, [])

  async function handleDelete(product) {
    if (!window.confirm(`Soft-delete "${product.name}"? It will be hidden from the storefront.`)) return
    setDeleting(product.id)
    try {
      await deleteProduct(product.id)
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, active: false } : p))
    } catch (err) {
      setError(err.message || 'Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className={styles.content}>
        <p>Loading…</p>
      </div>
    )
  }

  return (
    <>
      <div className={styles.topbar}>
        <h1 className={styles.pageTitle}>Products</h1>
      </div>
      <div className={styles.content}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>All Products</h2>
            <Link to="/admin/products/new" className="btn btn-primary">+ Add Product</Link>
          </div>

          {error && (
            <p role="alert" style={{ color: '#c0392b', marginBottom: '1rem' }}>{error}</p>
          )}

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Variants</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan={6}>No products found.</td></tr>
              ) : products.map(p => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.category.name}</td>
                  <td>{formatPrice(p.price_cents)}</td>
                  <td>
                    <span className={[styles.badge, p.active ? styles.badgeGreen : styles.badgeGray].join(' ')}>
                      {p.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{p.variants.length}</td>
                  <td style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      className={styles.editBtn}
                      onClick={() => navigate(`/admin/products/${p.id}/edit`, { state: { product: p } })}
                    >
                      Edit
                    </button>
                    {p.active && (
                      <button
                        className={styles.editBtn}
                        onClick={() => handleDelete(p)}
                        disabled={deleting === p.id}
                        style={{ color: '#c0392b' }}
                      >
                        {deleting === p.id ? 'Deleting…' : 'Delete'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
