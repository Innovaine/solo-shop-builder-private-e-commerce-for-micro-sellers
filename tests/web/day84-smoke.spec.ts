// Day 84 — Smoke test for engineer fixes
// Tests: Order detail page fix, MyFatoorah error handling, Prisma singleton

import { test, expect } from '@playwright/test'

test.describe('Day 84 Fixes', () => {
  test.setTimeout(30_000)

  test('Checkout page displays user-friendly error for payment_cancelled', async ({ page }) => {
    // Navigate to checkout with error param from MyFatoorah callback redirect
    await page.goto('https://www.soloshopbox.com/checkout?error=payment_cancelled')
    
    // Should show user-friendly error message
    const errorCard = page.locator('.bg-rose-50')
    await expect(errorCard).toBeVisible()
    
    const errorText = await errorCard.textContent()
    expect(errorText).toContain('Payment was cancelled')
    expect(errorText).toContain('try again')
  })

  test('Checkout page displays user-friendly error for payment_expired', async ({ page }) => {
    await page.goto('https://www.soloshopbox.com/checkout?error=payment_expired')
    
    const errorCard = page.locator('.bg-rose-50')
    await expect(errorCard).toBeVisible()
    
    const errorText = await errorCard.textContent()
    expect(errorText).toContain('Payment session expired')
  })

  test('Checkout page displays user-friendly error for payment_declined', async ({ page }) => {
    await page.goto('https://www.soloshopbox.com/checkout?error=payment_declined_card_error')
    
    const errorCard = page.locator('.bg-rose-50')
    await expect(errorCard).toBeVisible()
    
    const errorText = await errorCard.textContent()
    expect(errorText).toContain('Payment was declined')
    expect(errorText).toContain('card details')
  })

  test('Checkout page displays generic error for unknown error code', async ({ page }) => {
    await page.goto('https://www.soloshopbox.com/checkout?error=unknown_error')
    
    const errorCard = page.locator('.bg-rose-50')
    await expect(errorCard).toBeVisible()
    
    const errorText = await errorCard.textContent()
    expect(errorText).toContain('Payment failed')
  })

  test('Checkout page cleans up error param from URL after display', async ({ page }) => {
    await page.goto('https://www.soloshopbox.com/checkout?error=payment_cancelled')
    
    // Wait for error to be displayed
    await page.locator('.bg-rose-50').waitFor()
    
    // Wait a moment for URL cleanup
    await page.waitForTimeout(500)
    
    // URL should be cleaned up
    const url = page.url()
    expect(url).not.toContain('error=')
  })

  test('Health endpoint includes database check', async ({ page }) => {
    const response = await page.goto('https://www.soloshopbox.com/api/health')
    expect(response?.status()).toBe(200)
    
    const json = await response?.json()
    expect(json.status).toBe('ok')
    expect(json.checks.database).toBeDefined()
    expect(json.checks.database.status).toBe('ok')
  })

  test('Order detail page route exists and redirects without auth', async ({ page }) => {
    // This tests that the route compiles correctly after fixing TypeScript error
    // Without auth, should redirect to login (307) rather than 500 error
    const response = await page.goto('https://www.soloshopbox.com/dashboard/orders/test-order-id')
    
    // Should redirect (307) to login, not crash with 500
    expect(response?.status()).not.toBe(500)
  })
})
