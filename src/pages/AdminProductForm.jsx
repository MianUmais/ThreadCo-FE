import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import { createProduct, updateProduct, updateVariantStock } from '../api/admin'
import { getCategories } from '../api/catalog'
import { formatPrice } from '../utils/format'
import styles from './Admin.module.css'

const emptyVariant = () => ({ size: '', color: '', stock_qty: 0 })

function initStockForms(variants) {
  return Object.fromEntries(
    variants.map(v => [v.id, { absValue: '', deltaValue: '', error: null, loading: false, stock_qty: v.stock_qty }])
  )
}

export default function AdminProductForm() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const isEdit = !!id
  const existingProduct = location.state?.product ?? null

  const [categories, setCategories] = useState([])
  const [name, setName] = useState(existingProduct?.name ?? '')
  const [description, setDescription] = useState(existingProduct?.description ?? '')
  const [categoryId, setCategoryId] = useState(existingProduct?.category?.id ?? '')
  const [price, setPrice] = useState(existingProduct ? String(existingProduct.price_cents / 100) : '')
  const [active, setActive] = useState(existingProduct?.active ?? true)
  const [variants, setVariants] = useState(isEdit ? [] : [emptyVariant()])
  const [stockForms, setStockForms] = useState(() =>
    isEdit && existingProduct ? initStockForms(existingProduct.variants) : {}
  )

  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    let cancelled = false
    getCategories()
      .then(cats => {
        if (cancelled) return
        setCategories(cats)
        if (!isEdit && cats.length > 0 && !categoryId) {
          setCategoryId(cats[0].id)
        }
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function addVariant() {
    setVariants(v => [...v, emptyVariant()])
  }
  function removeVariant(i) {
    setVariants(v => v.filter((_, idx) => idx !== i))
  }
  function updateVariantField(i, field, value) {
    setVariants(v => v.map((vr, idx) => idx === i ? { ...vr, [field]: value } : vr))
  }

  function validateForm() {
    const errs = {}
    if (!name.trim()) errs.name = 'Product name is required.'
    const priceNum = parseFloat(price)
    if (!price || isNaN(priceNum) || priceNum <= 0) errs.price = 'Price must be greater than $0.00.'
    if (!isEdit) {
      if (variants.length === 0) {
        errs.variants = 'At least one variant is required.'
      } else {
        const seen = new Set()
        for (const v of variants) {
          if (!v.size.trim() || !v.color.trim()) {
            errs.variants = 'Each variant must have a size and color.'
            break
          }
          const key = `${v.size.trim().toLowerCase()}|${v.color.trim().toLowerCase()}`
          if (seen.has(key)) {
            errs.variants = 'Duplicate size + color combination.'
            break
          }
          seen.add(key)
        }
      }
    }
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setFieldErrors({})
    const errs = validateForm()
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs)
      return
    }
    const price_cents = Math.round(parseFloat(price) * 100)
    setSubmitting(true)
    try {
      if (isEdit) {
        await updateProduct(Number(id), {
          name: name.trim(),
          description,
          price_cents,
          category_id: Number(categoryId),
          active,
        })
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        await createProduct({
          name: name.trim(),
          description,
          price_cents,
          category_id: Number(categoryId),
          variants: variants.map(v => ({
            size: v.size.trim(),
            color: v.color.trim(),
            stock_qty: Number(v.stock_qty),
          })),
        })
        navigate('/admin/products')
      }
    } catch (err) {
      if (err.code === 'conflict') {
        setFieldErrors({ variants: 'Duplicate size + color combination (rejected by server).' })
      } else if (err.code === 'not_found') {
        setError('Category not found. Please select a valid category.')
      } else {
        setError(err.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  async function handleStockSet(variantId) {
    const form = stockForms[variantId]
    const qty = parseInt(form.absValue, 10)
    if (isNaN(qty) || qty < 0) {
      setStockForms(sf => ({ ...sf, [variantId]: { ...sf[variantId], error: 'Enter a non-negative integer.' } }))
      return
    }
    setStockForms(sf => ({ ...sf, [variantId]: { ...sf[variantId], loading: true, error: null } }))
    try {
      const result = await updateVariantStock(variantId, { stock_qty: qty })
      setStockForms(sf => ({ ...sf, [variantId]: { ...sf[variantId], loading: false, absValue: '', stock_qty: result.stock_qty } }))
    } catch (err) {
      setStockForms(sf => ({ ...sf, [variantId]: { ...sf[variantId], loading: false, error: err.message || 'Failed to update stock.' } }))
    }
  }

  async function handleStockDelta(variantId) {
    const form = stockForms[variantId]
    const delta = parseInt(form.deltaValue, 10)
    if (isNaN(delta)) {
      setStockForms(sf => ({ ...sf, [variantId]: { ...sf[variantId], error: 'Enter an integer delta.' } }))
      return
    }
    setStockForms(sf => ({ ...sf, [variantId]: { ...sf[variantId], loading: true, error: null } }))
    try {
      const result = await updateVariantStock(variantId, { delta })
      setStockForms(sf => ({ ...sf, [variantId]: { ...sf[variantId], loading: false, deltaValue: '', stock_qty: result.stock_qty } }))
    } catch (err) {
      setStockForms(sf => ({ ...sf, [variantId]: { ...sf[variantId], loading: false, error: err.message || 'Stock adjustment failed.' } }))
    }
  }

  if (isEdit && !existingProduct) {
    return (
      <div className={styles.content}>
        <p>
          Product data not found.{' '}
          <Link to="/admin/products">Return to product list</Link>.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className={styles.topbar}>
        <h1 className={styles.pageTitle}>{isEdit ? 'Edit Product' : 'Add Product'}</h1>
      </div>
      <div className={styles.content}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              {isEdit ? existingProduct.name : 'New Product'}
            </h2>
            <Link to="/admin/products" className={styles.editBtn}>
              ← Back to Products
            </Link>
          </div>

          {error && <p role="alert" style={{ color: '#c0392b', marginBottom: '1rem' }}>{error}</p>}
          {success && <p role="status" style={{ color: '#27ae60', marginBottom: '1rem' }}>Changes saved.</p>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                className="form-input"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              {fieldErrors.name && (
                <p role="alert" style={{ color: '#c0392b', fontSize: '0.875rem' }}>{fieldErrors.name}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">Description</label>
              <textarea
                id="description"
                className="form-input"
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="category">Category</label>
              <select
                id="category"
                className="form-input"
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="price">Price (USD)</label>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0.01"
                className="form-input"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="0.00"
                style={{ maxWidth: '160px' }}
              />
              {fieldErrors.price && (
                <p role="alert" style={{ color: '#c0392b', fontSize: '0.875rem' }}>{fieldErrors.price}</p>
              )}
            </div>

            {isEdit && (
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={e => setActive(e.target.checked)}
                  />
                  Active (visible on storefront)
                </label>
              </div>
            )}

            {!isEdit && (
              <fieldset style={{ border: '1px solid var(--color-gray-200)', padding: '1rem', marginBottom: '1.5rem' }}>
                <legend style={{ padding: '0 0.5rem', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Variants
                </legend>
                {fieldErrors.variants && (
                  <p role="alert" style={{ color: '#c0392b', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                    {fieldErrors.variants}
                  </p>
                )}
                {variants.map((v, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.75rem' }} htmlFor={`size-${i}`}>Size</label>
                      <input
                        id={`size-${i}`}
                        type="text"
                        className="form-input"
                        value={v.size}
                        onChange={e => updateVariantField(i, 'size', e.target.value)}
                        style={{ width: '80px' }}
                      />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.75rem' }} htmlFor={`color-${i}`}>Color</label>
                      <input
                        id={`color-${i}`}
                        type="text"
                        className="form-input"
                        value={v.color}
                        onChange={e => updateVariantField(i, 'color', e.target.value)}
                        style={{ width: '100px' }}
                      />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.75rem' }} htmlFor={`stock-${i}`}>Stock</label>
                      <input
                        id={`stock-${i}`}
                        type="number"
                        min="0"
                        className="form-input"
                        value={v.stock_qty}
                        onChange={e => updateVariantField(i, 'stock_qty', e.target.value)}
                        style={{ width: '70px' }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVariant(i)}
                      style={{ color: '#c0392b', padding: '0.5rem 0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" className={styles.editBtn} onClick={addVariant}>
                  + Add Variant
                </button>
              </fieldset>
            )}

            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
            </button>
          </form>

          {isEdit && existingProduct.variants.length > 0 && (
            <div style={{ marginTop: '2.5rem' }}>
              <h3 style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem', color: 'var(--color-gray-400)' }}>
                Variant Stock
              </h3>
              {existingProduct.variants.map(v => {
                const sf = stockForms[v.id] || {}
                return (
                  <div key={v.id} style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-gray-100)' }}>
                    <p style={{ fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                      <strong>{v.size} / {v.color}</strong>
                      {' — '}
                      Stock: <strong>{sf.stock_qty ?? v.stock_qty}</strong>
                    </p>
                    {sf.error && (
                      <p role="alert" style={{ color: '#c0392b', fontSize: '0.8125rem', marginBottom: '0.5rem' }}>
                        {sf.error}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <label style={{ fontSize: '0.8125rem', whiteSpace: 'nowrap' }} htmlFor={`abs-${v.id}`}>
                          Set to:
                        </label>
                        <input
                          id={`abs-${v.id}`}
                          type="number"
                          min="0"
                          className="form-input"
                          value={sf.absValue || ''}
                          style={{ width: '70px' }}
                          onChange={e => setStockForms(prev => ({
                            ...prev,
                            [v.id]: { ...prev[v.id], absValue: e.target.value, error: null },
                          }))}
                        />
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ padding: '0.4rem 0.75rem', fontSize: '0.8125rem' }}
                          onClick={() => handleStockSet(v.id)}
                          disabled={sf.loading}
                        >
                          Set
                        </button>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <label style={{ fontSize: '0.8125rem', whiteSpace: 'nowrap' }} htmlFor={`delta-${v.id}`}>
                          Adjust by:
                        </label>
                        <input
                          id={`delta-${v.id}`}
                          type="number"
                          className="form-input"
                          value={sf.deltaValue || ''}
                          style={{ width: '70px' }}
                          onChange={e => setStockForms(prev => ({
                            ...prev,
                            [v.id]: { ...prev[v.id], deltaValue: e.target.value, error: null },
                          }))}
                        />
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ padding: '0.4rem 0.75rem', fontSize: '0.8125rem' }}
                          onClick={() => handleStockDelta(v.id)}
                          disabled={sf.loading}
                        >
                          Adjust
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
