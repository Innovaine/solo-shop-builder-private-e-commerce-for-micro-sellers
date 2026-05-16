// Shopping cart with localStorage persistence
// FR-11: Browser session storage for cart

export interface CartItem {
  productId: string
  productTitle: string
  price: number // in cents
  quantity: number
  shopSlug: string
  imageUrl?: string
}

export interface Cart {
  items: CartItem[]
  shopSlug?: string // Single-shop constraint: all items must be from same shop
}

const CART_STORAGE_KEY = 'solo-shop-cart'

/**
 * Get current cart from localStorage
 * Returns empty cart if none exists or if localStorage unavailable
 */
export function getCart(): Cart {
  if (typeof window === 'undefined') {
    return { items: [] }
  }

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (!stored) {
      return { items: [] }
    }

    const cart = JSON.parse(stored) as Cart
    return cart
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error)
    return { items: [] }
  }
}

/**
 * Save cart to localStorage
 */
export function saveCart(cart: Cart): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error)
  }
}

/**
 * Add item to cart
 * If item already exists, increment quantity
 * Enforces single-shop constraint: all items must be from same shop
 */
export function addToCart(item: Omit<CartItem, 'quantity'> & { quantity?: number }): Cart {
  const cart = getCart()

  // Single-shop constraint: if cart has items from a different shop, reject
  if (cart.items.length > 0 && cart.shopSlug && cart.shopSlug !== item.shopSlug) {
    throw new Error(
      `Cart contains items from ${cart.shopSlug}. Please checkout or clear your cart before adding items from ${item.shopSlug}.`
    )
  }

  // Check if item already exists
  const existingItemIndex = cart.items.findIndex((i) => i.productId === item.productId)

  if (existingItemIndex >= 0) {
    // Increment quantity
    cart.items[existingItemIndex].quantity += item.quantity || 1
  } else {
    // Add new item
    cart.items.push({
      ...item,
      quantity: item.quantity || 1,
    })
    cart.shopSlug = item.shopSlug
  }

  saveCart(cart)
  return cart
}

/**
 * Update item quantity in cart
 */
export function updateCartItemQuantity(productId: string, quantity: number): Cart {
  const cart = getCart()

  const itemIndex = cart.items.findIndex((i) => i.productId === productId)
  if (itemIndex >= 0) {
    if (quantity <= 0) {
      // Remove item if quantity is 0
      cart.items.splice(itemIndex, 1)
      
      // Clear shopSlug if cart is now empty
      if (cart.items.length === 0) {
        cart.shopSlug = undefined
      }
    } else {
      cart.items[itemIndex].quantity = quantity
    }
  }

  saveCart(cart)
  return cart
}

/**
 * Remove item from cart
 */
export function removeFromCart(productId: string): Cart {
  const cart = getCart()
  cart.items = cart.items.filter((i) => i.productId !== productId)

  // Clear shopSlug if cart is now empty
  if (cart.items.length === 0) {
    cart.shopSlug = undefined
  }

  saveCart(cart)
  return cart
}

/**
 * Clear entire cart
 */
export function clearCart(): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.removeItem(CART_STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear cart:', error)
  }
}

/**
 * Get total number of items in cart
 */
export function getCartItemCount(): number {
  const cart = getCart()
  return cart.items.reduce((sum, item) => sum + item.quantity, 0)
}

/**
 * Get cart total in cents
 */
export function getCartTotal(): number {
  const cart = getCart()
  return cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}
