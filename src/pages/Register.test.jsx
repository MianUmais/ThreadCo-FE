import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Register from './Register'

const mockRegister = vi.fn()
const mockNavigate = vi.fn()

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ register: mockRegister, isAuthenticated: false }),
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderRegister() {
  return render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  )
}

describe('Register', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders name, email, and password fields', () => {
    renderRegister()
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('renders a link to sign in', () => {
    renderRegister()
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument()
  })

  it('shows password too short error without calling the API', async () => {
    renderRegister()
    await userEvent.type(screen.getByLabelText(/email/i), 'jane@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'short')
    await userEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument()
    })
    expect(mockRegister).not.toHaveBeenCalled()
  })

  it('shows conflict message inline on 409', async () => {
    const err = Object.assign(new Error('An account with that email already exists.'), {
      status: 409,
      code: 'conflict',
    })
    mockRegister.mockRejectedValueOnce(err)

    renderRegister()
    await userEvent.type(screen.getByLabelText(/email/i), 'existing@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'validpassword1')
    await userEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/already exists/i)
    })
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('shows per-field errors from API 400 response', async () => {
    const err = Object.assign(new Error('Validation failed.'), {
      status: 400,
      code: 'invalid_input',
      fields: { email: 'Invalid email address.' },
    })
    mockRegister.mockRejectedValueOnce(err)

    renderRegister()
    await userEvent.type(screen.getByLabelText(/email/i), 'notanemail')
    await userEvent.type(screen.getByLabelText(/password/i), 'validpassword1')
    await userEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByText('Invalid email address.')).toBeInTheDocument()
    })
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('navigates to /account on successful registration', async () => {
    mockRegister.mockResolvedValueOnce({
      user: { id: 1, email: 'new@example.com', name: 'Jane' },
    })

    renderRegister()
    await userEvent.type(screen.getByLabelText(/email/i), 'new@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'securepassword')
    await userEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/account', { replace: true })
    })
  })
})
