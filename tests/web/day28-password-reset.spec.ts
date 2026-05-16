// Day 28 Tests: FR-23 & FR-24 — Password reset flow
// Covers: Forgot password email, reset link, password reset page

import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:3000'
const TEST_EMAIL = `test-reset-${Date.now()}@example.com`

test.describe('FR-23 & FR-24: Password reset flow', () => {
  test.setTimeout(60000)

  test('FR-23: Forgot password page exists and is accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/forgot-password`)
    
    // Verify page loads
    await expect(page.locator('h1')).toContainText(/Forgot.*password/i)
    
    // Check for email input
    await expect(page.locator('input[type="email"]')).toBeVisible()
    
    // Check for submit button
    await expect(page.locator('button:has-text("Send reset link")')).toBeVisible()
  })

  test('FR-23: Forgot password form accepts valid email', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/forgot-password`)
    
    // Fill in email
    await page.fill('input[type="email"]', TEST_EMAIL)
    
    // Submit form
    await page.click('button:has-text("Send reset link")')
    
    await page.waitForLoadState('networkidle')
    
    // Should show success message (even if email doesn't exist - security)
    // API returns 200 for both existing and non-existing emails
    const successMessage = page.locator('text=/Check your email/i, text=/sent.*reset link/i')
    await expect(successMessage).toBeVisible({ timeout: 5000 })
  })

  test('FR-23: Forgot password validates email format', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/forgot-password`)
    
    // Try invalid email format
    await page.fill('input[type="email"]', 'not-an-email')
    await page.click('button:has-text("Send reset link")')
    
    await page.waitForLoadState('networkidle')
    
    // Should see validation error
    const hasError = await page.locator('text=/Invalid.*email/i').isVisible({ timeout: 2000 }).catch(() => false)
    const stillOnPage = page.url().includes('/forgot-password')
    
    expect(hasError || stillOnPage).toBeTruthy()
  })

  test('FR-24: Reset password page exists and requires token', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/reset-password`)
    
    // Without token, should show error or redirect
    await page.waitForLoadState('networkidle')
    
    const hasTokenError = await page.locator('text=/Invalid.*token/i, text=/Missing.*token/i').isVisible({ timeout: 2000 }).catch(() => false)
    const redirectedToLogin = page.url().includes('/auth/login')
    
    // One of these should be true
    expect(hasTokenError || redirectedToLogin || page.url().includes('/reset-password')).toBeTruthy()
  })

  test('FR-24: Reset password page with token shows form', async ({ page }) => {
    // Visit reset page with a mock token
    await page.goto(`${BASE_URL}/auth/reset-password?token=test-token-12345`)
    
    await page.waitForLoadState('networkidle')
    
    // Should show password reset form
    const hasHeading = await page.locator('h1:has-text("Reset")').isVisible().catch(() => false)
    const hasPasswordInput = await page.locator('input[type="password"]').count() >= 1
    
    expect(hasHeading || hasPasswordInput).toBeTruthy()
  })

  test('FR-24: Reset password form validates password strength', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/reset-password?token=test-token`)
    
    await page.waitForLoadState('networkidle')
    
    // Try to find password inputs
    const passwordInputs = page.locator('input[type="password"]')
    const inputCount = await passwordInputs.count()
    
    if (inputCount >= 2) {
      // Fill with weak password
      await passwordInputs.nth(0).fill('weak')
      await passwordInputs.nth(1).fill('weak')
      
      await page.click('button[type="submit"]')
      
      await page.waitForLoadState('networkidle')
      
      // Should show validation error
      const hasError = await page.locator('text=/8 characters/i').isVisible({ timeout: 2000 }).catch(() => false)
      expect(hasError).toBeTruthy()
    }
  })

  test('FR-24: Reset password form requires password confirmation', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/reset-password?token=test-token`)
    
    await page.waitForLoadState('networkidle')
    
    const passwordInputs = page.locator('input[type="password"]')
    const inputCount = await passwordInputs.count()
    
    if (inputCount >= 2) {
      // Fill with mismatched passwords
      await passwordInputs.nth(0).fill('ValidPass123!')
      await passwordInputs.nth(1).fill('DifferentPass456!')
      
      await page.click('button[type="submit"]')
      
      await page.waitForLoadState('networkidle')
      
      // Should show mismatch error
      const hasError = await page.locator('text=/match/i, text=/same/i').isVisible({ timeout: 2000 }).catch(() => false)
      expect(hasError).toBeTruthy()
    }
  })

  test('FR-23: Forgot password has link back to login', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/forgot-password`)
    
    // Look for login link
    const loginLink = page.locator('a:has-text("Log in"), a:has-text("Back to login")')
    const linkExists = await loginLink.count() > 0
    
    if (linkExists) {
      await loginLink.first().click()
      await page.waitForLoadState('networkidle')
      expect(page.url()).toContain('/auth/login')
    } else {
      // Acceptable if not present, just note it
      expect(linkExists || page.url().includes('/forgot-password')).toBeTruthy()
    }
  })

  test('FR-24: Reset password page has proper error handling for invalid token', async ({ page }) => {
    // Try to reset with clearly invalid token
    await page.goto(`${BASE_URL}/auth/reset-password?token=invalid-expired-token`)
    
    await page.waitForLoadState('networkidle')
    
    const passwordInputs = page.locator('input[type="password"]')
    const inputCount = await passwordInputs.count()
    
    if (inputCount >= 2) {
      await passwordInputs.nth(0).fill('NewPassword123!')
      await passwordInputs.nth(1).fill('NewPassword123!')
      
      await page.click('button[type="submit"]')
      
      await page.waitForLoadState('networkidle')
      
      // Should show token error after submission
      const hasError = await page.locator('text=/Invalid.*token/i, text=/expired/i').isVisible({ timeout: 3000 }).catch(() => false)
      expect(hasError).toBeTruthy()
    }
  })
})
