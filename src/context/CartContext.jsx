import { createContext, useContext, useEffect, useReducer, useCallback } from 'react'
import { getCart, addToCart, updateCartItem, removeCartItem } from '../api/cart'

const CART_TOKEN_KEY = 'threadco_cart_token'

const emptyCart = { cart_token: null, items: [], subtotal_cents: 0 }

function reducer(state, action) {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, cart: action.cart, loading: false, error: null }
    case 'SET_LOADING':
      return { ...state, loading: action.loading }
    case 'SET_ERROR':
      return { ...state, error: action.error, loading: false }
    default:
      return state
  }
}

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    cart: emptyCart,
    loading: false,
    error: null,
  })

  const persistToken = useCallback((token) => {
    if (token) localStorage.setItem(CART_TOKEN_KEY, token)
  }, [])

  const applyCart = useCallback(
    (updated) => {
      if (updated.cart_token) persistToken(updated.cart_token)
      dispatch({ type: 'SET_CART', cart: updated })
    },
    [persistToken]
  )

  // Load cart on mount using stored cart_token
  useEffect(() => {
    const token = localStorage.getItem(CART_TOKEN_KEY)
    dispatch({ type: 'SET_LOADING', loading: true })
    getCart(token)
      .then(applyCart)
      .catch(() => dispatch({ type: 'SET_CART', cart: emptyCart }))
  }, [applyCart])

  async function addItem(variantId, quantity = 1) {
    try {
      const updated = await addToCart({
        variantId,
        quantity,
        cartToken: state.cart.cart_token,
      })
      applyCart(updated)
      return { ok: true }
    } catch (err) {
      return { ok: false, message: err.message, code: err.code, status: err.status }
    }
  }

  async function updateItem(variantId, quantity) {
    try {
      const updated = await updateCartItem({
        variantId,
        quantity,
        cartToken: state.cart.cart_token,
      })
      applyCart(updated)
      return { ok: true }
    } catch (err) {
      return { ok: false, message: err.message, code: err.code, status: err.status }
    }
  }

  async function removeItem(variantId) {
    try {
      const updated = await removeCartItem({
        variantId,
        cartToken: state.cart.cart_token,
      })
      applyCart(updated)
      return { ok: true }
    } catch (err) {
      return { ok: false, message: err.message }
    }
  }

  async function refreshCart() {
    const token = state.cart.cart_token ?? localStorage.getItem(CART_TOKEN_KEY)
    try {
      const updated = await getCart(token)
      applyCart(updated)
    } catch {
      dispatch({ type: 'SET_CART', cart: emptyCart })
    }
  }

  const cartCount = state.cart.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cart: state.cart,
        cartCount,
        loading: state.loading,
        error: state.error,
        addItem,
        updateItem,
        removeItem,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
