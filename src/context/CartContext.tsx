'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { CartItem } from '@/types'
import toast from 'react-hot-toast'

interface CartState {
  items: CartItem[]
  total: number
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

interface CartContextType {
  items: CartItem[]
  total: number
  itemCount: number
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id)
      if (existing) {
        const items = state.items.map(i =>
          i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
        )
        return { items, total: items.reduce((sum, i) => sum + i.price * i.quantity, 0) }
      }
      const items = [...state.items, { ...action.payload, quantity: 1 }]
      return { items, total: items.reduce((sum, i) => sum + i.price * i.quantity, 0) }
    }
    case 'REMOVE_ITEM': {
      const items = state.items.filter(i => i.id !== action.payload)
      return { items, total: items.reduce((sum, i) => sum + i.price * i.quantity, 0) }
    }
    case 'UPDATE_QUANTITY': {
      const items = state.items.map(i =>
        i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
      )
      return { items, total: items.reduce((sum, i) => sum + i.price * i.quantity, 0) }
    }
    case 'CLEAR_CART':
      return { items: [], total: 0 }
    case 'LOAD_CART': {
      return { items: action.payload, total: action.payload.reduce((sum, i) => sum + i.price * i.quantity, 0) }
    }
    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 })

  useEffect(() => {
    const saved = localStorage.getItem('cart')
    if (saved) {
      try { dispatch({ type: 'LOAD_CART', payload: JSON.parse(saved) }) } catch {}
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items))
  }, [state.items])

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
    toast.success(`${item.name} added to cart`)
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
    toast.success('Item removed from cart')
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        total: state.total,
        itemCount: state.items.reduce((sum, i) => sum + i.quantity, 0),
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
