// Currency formatting utilities
// Supports USD and KWD currencies

export type Currency = 'USD' | 'KWD'

interface CurrencyConfig {
  symbol: string
  name: string
  decimals: number
}

const CURRENCY_CONFIG: Record<Currency, CurrencyConfig> = {
  USD: {
    symbol: '$',
    name: 'US Dollar',
    decimals: 2,
  },
  KWD: {
    symbol: 'KD',
    name: 'Kuwaiti Dinar',
    decimals: 3,
  },
}

/**
 * Format a price (in cents) to a display string with the correct currency symbol
 * @param priceInCents Price in cents (e.g., 4500 for $45.00 or 4500 for KD 4.500)
 * @param currency Currency code (USD or KWD)
 * @returns Formatted price string (e.g., "$45.00" or "KD 4.500")
 */
export function formatPrice(priceInCents: number, currency: Currency = 'USD'): string {
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.USD
  const amount = priceInCents / 100
  const formatted = amount.toFixed(config.decimals)
  
  // For USD, symbol goes before the amount ($45.00)
  // For KWD, symbol goes before the amount (KD 4.500)
  return `${config.symbol}${formatted}`
}

/**
 * Get currency symbol only
 * @param currency Currency code (USD or KWD)
 * @returns Currency symbol (e.g., "$" or "KD")
 */
export function getCurrencySymbol(currency: Currency = 'USD'): string {
  return CURRENCY_CONFIG[currency]?.symbol || CURRENCY_CONFIG.USD.symbol
}

/**
 * Get currency name
 * @param currency Currency code (USD or KWD)
 * @returns Currency name (e.g., "US Dollar" or "Kuwaiti Dinar")
 */
export function getCurrencyName(currency: Currency = 'USD'): string {
  return CURRENCY_CONFIG[currency]?.name || CURRENCY_CONFIG.USD.name
}

/**
 * Get number of decimal places for a currency
 * @param currency Currency code (USD or KWD)
 * @returns Number of decimal places (2 for USD, 3 for KWD)
 */
export function getCurrencyDecimals(currency: Currency = 'USD'): number {
  return CURRENCY_CONFIG[currency]?.decimals || CURRENCY_CONFIG.USD.decimals
}
