import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { checkout } from '../api/orders'
import { formatPrice } from '../utils/format'
import styles from './Checkout.module.css'

const INITIAL_ADDRESS = {
  name: '',
  line1: '',
  line2: '',
  city: '',
  region: '',
  postal_code: '',
  country: 'US',
}

export default function Checkout() {
  const navigate = useNavigate()
  const { cart, cartCount, refreshCart } = useCart()

  const [email, setEmail] = useState('')
  const [address, setAddress] = useState(INITIAL_ADDRESS)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null) // { code, message }
  const [fieldErrors, setFieldErrors] = useState({})

  function setAddr(field, value) {
    setAddress((a) => ({ ...a, [field]: value }))
  }

  function validate() {
    const errors = {}
    if (!email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Enter a valid email'
    }
    if (!address.name.trim()) errors.name = 'Name is required'
    if (!address.line1.trim()) errors.line1 = 'Address is required'
    if (!address.city.trim()) errors.city = 'City is required'
    if (!address.region.trim()) errors.region = 'State / region is required'
    if (!address.postal_code.trim()) errors.postal_code = 'Postal code is required'
    if (!address.country.trim()) errors.country = 'Country is required'
    return errors
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setFieldErrors({})

    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    if (cartCount === 0) {
      setError({ code: 'empty_cart', message: 'Your cart is empty. Add items before checking out.' })
      return
    }

    setSubmitting(true)
    try {
      const order = await checkout({
        cartToken: cart.cart_token,
        email: email.trim(),
        shippingAddress: {
          name: address.name.trim(),
          line1: address.line1.trim(),
          line2: address.line2.trim() || undefined,
          city: address.city.trim(),
          region: address.region.trim(),
          postal_code: address.postal_code.trim(),
          country: address.country.trim(),
        },
      })
      await refreshCart()
      navigate('/order-confirmation', { state: { order } })
    } catch (err) {
      setError({ code: err.code ?? 'error', message: err.message ?? 'Something went wrong. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (cartCount === 0) {
    return (
      <div className="container page">
        <h1 className="page-title">Checkout</h1>
        <p className={styles.emptyMsg}>Your cart is empty.</p>
        <Link to="/products" className="btn btn-outline" style={{ marginTop: '1.5rem' }}>
          Back to Shop
        </Link>
      </div>
    )
  }

  return (
    <div className="container page">
      <h1 className="page-title">Checkout</h1>

      <div className={styles.layout}>
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {/* Contact */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Contact</h2>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email *
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
              {fieldErrors.email && <p className={styles.fieldError}>{fieldErrors.email}</p>}
            </div>
          </section>

          {/* Shipping address */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Shipping Address</h2>

            <div className="form-group">
              <label className="form-label" htmlFor="sh-name">Full Name *</label>
              <input id="sh-name" type="text" className="form-input" value={address.name}
                onChange={(e) => setAddr('name', e.target.value)} autoComplete="name" required />
              {fieldErrors.name && <p className={styles.fieldError}>{fieldErrors.name}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="sh-line1">Address Line 1 *</label>
              <input id="sh-line1" type="text" className="form-input" value={address.line1}
                onChange={(e) => setAddr('line1', e.target.value)} autoComplete="address-line1" required />
              {fieldErrors.line1 && <p className={styles.fieldError}>{fieldErrors.line1}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="sh-line2">Address Line 2</label>
              <input id="sh-line2" type="text" className="form-input" value={address.line2}
                onChange={(e) => setAddr('line2', e.target.value)} autoComplete="address-line2" />
            </div>

            <div className={styles.row}>
              <div className="form-group" style={{ flex: 2 }}>
                <label className="form-label" htmlFor="sh-city">City *</label>
                <input id="sh-city" type="text" className="form-input" value={address.city}
                  onChange={(e) => setAddr('city', e.target.value)} autoComplete="address-level2" required />
                {fieldErrors.city && <p className={styles.fieldError}>{fieldErrors.city}</p>}
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label" htmlFor="sh-region">State *</label>
                <input id="sh-region" type="text" className="form-input" value={address.region}
                  onChange={(e) => setAddr('region', e.target.value)} autoComplete="address-level1" required />
                {fieldErrors.region && <p className={styles.fieldError}>{fieldErrors.region}</p>}
              </div>
            </div>

            <div className={styles.row}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label" htmlFor="sh-postal">Postal Code *</label>
                <input id="sh-postal" type="text" className="form-input" value={address.postal_code}
                  onChange={(e) => setAddr('postal_code', e.target.value)} autoComplete="postal-code" required />
                {fieldErrors.postal_code && <p className={styles.fieldError}>{fieldErrors.postal_code}</p>}
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label" htmlFor="sh-country">Country *</label>
                <input id="sh-country" type="text" className="form-input" value={address.country}
                  onChange={(e) => setAddr('country', e.target.value)} autoComplete="country" required />
                {fieldErrors.country && <p className={styles.fieldError}>{fieldErrors.country}</p>}
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Payment</h2>
            <div className={styles.mockPayment} role="note" aria-label="Mock payment notice">
              <span className={styles.mockBadge}>Demo</span>
              <p className={styles.mockText}>
                <strong>No real charge.</strong> This store uses a simulated payment — your order
                will be placed instantly at no cost and marked as paid.
              </p>
            </div>
          </section>

          {/* Global error */}
          {error && (
            <div className={styles.errorBanner} role="alert">
              {error.code === 'out_of_stock' && (
                <p>
                  <strong>Some items sold out.</strong> Please review your cart.
                </p>
              )}
              <p>{error.message}</p>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={submitting}
          >
            {submitting ? 'Placing Order…' : 'Place Order'}
          </button>
        </form>

        {/* Order summary sidebar */}
        <aside className={styles.summary} aria-label="Order summary">
          <h2 className={styles.summaryTitle}>Order Summary</h2>

          <ul className={styles.summaryItems}>
            {cart.items.map((item) => (
              <li key={item.variant_id} className={styles.summaryItem}>
                <span className={styles.summaryItemName}>
                  {item.product_name}{' '}
                  <span className={styles.summaryItemMeta}>
                    {item.size}/{item.color} × {item.quantity}
                  </span>
                </span>
                <span>{formatPrice(item.line_total_cents)}</span>
              </li>
            ))}
          </ul>

          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>{formatPrice(cart.subtotal_cents)}</span>
          </div>
        </aside>
      </div>
    </div>
  )
}
