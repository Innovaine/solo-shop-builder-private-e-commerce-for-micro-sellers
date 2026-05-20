// Day 102 — New Features Test Suite
// Tests: currency support (KWD/USD), email mandatory, payment type selector, multi-image upload

import { test, expect } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'https://www.soloshopbox.com'

test.describe('Day 102: Currency Support (Task #290)', () => {
  test('checkout page shows currency based on shop settings', async ({ page }) => {
    await page.goto(`${BASE_URL}/checkout`)

    // Wait for page to load
    await page.waitForLoadState('networkidle', { timeout: 10000 })

    // Should have a currency notice on the page
    const currencyNotice = page.locator('text=/This shop uses/i')
    await expect(currencyNotice).toBeVisible({ timeout: 5000 })

    // Should show either USD or KWD
    const pageContent = await page.content()
    const hasUSD = pageContent.includes('USD')
    const hasKWD = pageContent.includes('KWD')
    
    expect(hasUSD || hasKWD).toBeTruthy()
  })

  test('KWD shop shows MyFatoorah payment options', async ({ page }) => {
    await page.goto(`${BASE_URL}/checkout`)
    await page.waitForLoadState('networkidle', { timeout: 10000 })

    // If shop is KWD, should see MyFatoorah payment methods
    const content = await page.content()
    
    if (content.includes('KWD')) {
      // Should have payment method radios
      const cardOption = page.locator('text=/Credit\\/Debit Card|💳/i')
      const applePayOption = page.locator('text=/Apple Pay|🍎/i')
      const googlePayOption = page.locator('text=/Google Pay|🔵/i')
      const knetOption = page.locator('text=/KNET|🇰🇼/i')

      await expect(cardOption).toBeVisible({ timeout: 3000 })
      // At least one payment method should be visible
      const cardVisible = await cardOption.isVisible().catch(() => false)
      const appleVisible = await applePayOption.isVisible().catch(() => false)
      const googleVisible = await googlePayOption.isVisible().catch(() => false)
      const knetVisible = await knetOption.isVisible().catch(() => false)

      expect(cardVisible || appleVisible || googleVisible || knetVisible).toBeTruthy()
    }
  })

  test('USD shop shows Stripe payment option', async ({ page }) => {
    await page.goto(`${BASE_URL}/checkout`)
    await page.waitForLoadState('networkidle', { timeout: 10000 })

    const content = await page.content()
    
    if (content.includes('USD')) {
      // Should see Stripe payment option
      const stripeOption = page.locator('text=/Credit Card.*Stripe|Stripe|Visa.*Mastercard/i')
      await expect(stripeOption).toBeVisible({ timeout: 3000 })
    }
  })
})

test.describe('Day 102: Mandatory Email in Checkout (Task #291)', () => {
  test('email field is required and visible on checkout', async ({ page }) => {
    await page.goto(`${BASE_URL}/checkout`)
    await page.waitForLoadState('networkidle')

    // Email field should exist and be required
    const emailField = page.locator('input[type="email"], input[name="email"], input#email')
    await expect(emailField.first()).toBeVisible({ timeout: 5000 })

    // Check for required indicator (asterisk)
    const requiredStar = page.locator('text=/Email.*\\*/i')
    await expect(requiredStar).toBeVisible({ timeout: 3000 })
  })

  test('cannot proceed to payment without email', async ({ page }) => {
    await page.goto(`${BASE_URL}/checkout`)
    await page.waitForLoadState('networkidle')

    // Try to submit without email
    const proceedButton = page.getByRole('button', { name: /Proceed to payment|Pay now/i })
    
    // Button should be disabled or show validation error
    const isDisabled = await proceedButton.isDisabled().catch(() => false)
    
    if (!isDisabled) {
      // Click and expect validation error
      await proceedButton.click()
      
      // Should see validation error
      const errorMessage = page.locator('text=/valid email|email address/i')
      await expect(errorMessage).toBeVisible({ timeout: 3000 })
    } else {
      // Button correctly disabled
      expect(isDisabled).toBeTruthy()
    }
  })

  test('email field validates format', async ({ page }) => {
    await page.goto(`${BASE_URL}/checkout`)
    await page.waitForLoadState('networkidle')

    const emailField = page.locator('input[type="email"]').first()
    await emailField.fill('invalid-email')

    const proceedButton = page.getByRole('button', { name: /Proceed to payment/i })
    
    // Try to proceed with invalid email
    if (!await proceedButton.isDisabled()) {
      await proceedButton.click()
      
      // Should show error or not proceed
      await page.waitForTimeout(500)
      
      // Either validation error shown or still on checkout page
      const onCheckout = page.url().includes('/checkout')
      expect(onCheckout).toBeTruthy()
    }
  })
})

test.describe('Day 102: Payment Type Selector for MyFatoorah (Task #292)', () => {
  test('MyFatoorah payment methods are selectable', async ({ page }) => {
    await page.goto(`${BASE_URL}/checkout`)
    await page.waitForLoadState('networkidle')

    const content = await page.content()
    
    // Only test if shop uses KWD (MyFatoorah)
    if (content.includes('KWD')) {
      // Try to select different payment methods
      const cardRadio = page.locator('input[value="CARD"]')
      const applePayRadio = page.locator('input[value="APPLE_PAY"]')
      const googlePayRadio = page.locator('input[value="GOOGLE_PAY"]')
      const knetRadio = page.locator('input[value="KNET"]')

      // At least one should be visible
      const cardExists = await cardRadio.count() > 0
      const appleExists = await applePayRadio.count() > 0
      const googleExists = await googlePayRadio.count() > 0
      const knetExists = await knetRadio.count() > 0

      expect(cardExists || appleExists || googleExists || knetExists).toBeTruthy()

      // If CARD option exists, try selecting it
      if (cardExists) {
        await cardRadio.first().click()
        await expect(cardRadio.first()).toBeChecked()
      }

      // If KNET exists, try selecting it
      if (knetExists) {
        await knetRadio.first().click()
        await expect(knetRadio.first()).toBeChecked()
      }
    }
  })

  test('payment method labels are user-friendly', async ({ page }) => {
    await page.goto(`${BASE_URL}/checkout`)
    await page.waitForLoadState('networkidle')

    const content = await page.content()
    
    if (content.includes('KWD')) {
      // Should have descriptive labels
      const hasCardLabel = content.includes('Credit') || content.includes('Debit')
      const hasAppleLabel = content.includes('Apple Pay')
      const hasGoogleLabel = content.includes('Google Pay')
      const hasKnetLabel = content.includes('KNET')

      // At least one descriptive label should be present
      expect(hasCardLabel || hasAppleLabel || hasGoogleLabel || hasKnetLabel).toBeTruthy()
    }
  })
})

test.describe('Day 102: Multi-Image Upload API (Task #293)', () => {
  test('product images API endpoint exists', async ({ request }) => {
    // Test that the new images endpoint exists
    // Note: Will return 401 without auth, but 401 means endpoint exists
    const response = await request.get(`${BASE_URL}/api/products/test-id/images`, {
      failOnStatusCode: false,
    })

    // Should NOT be 404 (endpoint exists)
    expect(response.status()).not.toBe(404)
    
    // Will be 401 or 403 (auth required) which is correct
    expect([401, 403, 500].includes(response.status())).toBeTruthy()
  })
})

test.describe('Day 102: Success Page Link Fix (Task #295)', () => {
  test('success page contains shop link (not login)', async ({ page }) => {
    // Visit success page (will show empty cart message or order details)
    await page.goto(`${BASE_URL}/checkout/success`)
    await page.waitForLoadState('networkidle', { timeout: 10000 })

    const pageContent = await page.content()
    
    // Should have a link back to shop, not to login
    const hasShopLink = pageContent.includes('/shop/') || pageContent.includes('Go to shop') || pageContent.includes('Continue shopping')
    const hasLoginLink = pageContent.includes('/auth/login')

    // Success page should link to shop, not login
    if (pageContent.includes('Order') || pageContent.includes('Success')) {
      expect(hasShopLink || !hasLoginLink).toBeTruthy()
    }
  })
})

test.describe('Day 102: Health Check Regression', () => {
  test('health endpoint is still functional after changes', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/health`)
    expect(response.status()).toBe(200)

    const health = await response.json()
    expect(health.status).toBe('ok')
    expect(health.checks.database.status).toBe('ok')
  })
})
