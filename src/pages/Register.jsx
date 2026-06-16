import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Register.module.css'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)       // general / conflict message
  const [fieldErrors, setFieldErrors] = useState({})  // per-field from API 400
  const [submitting, setSubmitting] = useState(false)

  function clientValidate() {
    if (password.length > 0 && password.length < 8) {
      return { password: 'Must be at least 8 characters.' }
    }
    return {}
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setFieldErrors({})

    const clientErrs = clientValidate()
    if (Object.keys(clientErrs).length > 0) {
      setFieldErrors(clientErrs)
      return
    }

    setSubmitting(true)
    try {
      await register({ email, password, name })
      navigate('/account', { replace: true })
    } catch (err) {
      if (err.status === 409) {
        setError(err.message || 'An account with that email already exists.')
      } else if (err.status === 400 && err.fields) {
        setFieldErrors(err.fields)
      } else if (err.status === 400 && err.body?.fields) {
        setFieldErrors(err.body.fields)
      } else {
        setError(err.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container page">
      <div className={styles.card}>
        <h1 className={styles.title}>Create Account</h1>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Name <span className={styles.optional}>(optional)</span>
            </label>
            <input
              id="name"
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
            {fieldErrors.name && <p className={styles.fieldError}>{fieldErrors.name}</p>}
          </div>

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
              required
              autoComplete="email"
            />
            {fieldErrors.email && <p className={styles.fieldError}>{fieldErrors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password * <span className={styles.hint}>(min. 8 characters)</span>
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            {fieldErrors.password && <p className={styles.fieldError}>{fieldErrors.password}</p>}
          </div>

          {error && (
            <p className={styles.errorMsg} role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={submitting}
          >
            {submitting ? 'Creating Account…' : 'Create Account'}
          </button>
        </form>

        <p className={styles.login}>
          Already have an account?{' '}
          <Link to="/login" className={styles.loginLink}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
