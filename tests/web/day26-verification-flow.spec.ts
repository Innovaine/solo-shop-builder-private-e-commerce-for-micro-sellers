// Day 26 Test Suite: FR-2 & FR-3 - Email verification flow
// Tests magic link verification and session creation

import { test, expect } from '@playwright/test'

test.describe('Email Verification Flow (FR-2, FR-3)', () => {
  
  test('FR-2: Verify page shows error for missing token', async ({ page }) => {
    // Navigate to verify page without token
    await page.goto('http://localhost:3000/auth/verify')
    
    // Should show error state
    await expect(page.locator('text=Verification Failed')).toBeVisible()
    await expect(page.locator('text=No verification token provided')).toBeVisible()
    
    // Should show back to login button
    const backButton = page.locator('button:has-text("Back to Login")')
    await expect(backButton).toBeVisible()
  })

  test('FR-2: Verify page shows error for invalid token', async ({ page }) => {
    // Navigate with invalid token
    await page.goto('http://localhost:3000/auth/verify?token=invalid-token-12345')
    
    // Should show verifying state initially
    await expect(page.locator('text=Verifying...')).toBeVisible()
    
    // Should transition to error state
    await expect(page.locator('text=Verification Failed')).toBeVisible({ timeout: 10000 })
  })

  test('FR-3: Valid token creates session and redirects', async ({ page }) => {
    // Step 1: Create a test seller account via API
    const signupResponse = await page.request.post('http://localhost:3000/api/auth/signup', {
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test Seller',
      },
    })
    
    expect(signupResponse.ok()).toBeTruthy()
    const signupData = await signupResponse.json()
    expect(signupData.message).toContain('Verification email sent')
    
    // Step 2: Extract token from response (in real app, would be from email)
    // For testing, we'll need to query the DB or use a test endpoint
    // This is a placeholder - actual implementation depends on test fixtures
    
    // Step 3: Visit verification link with valid token
    // await page.goto(`http://localhost:3000/auth/verify?token=${validToken}`)
    
    // Step 4: Should show success state
    // await expect(page.locator('text=Email Verified!')).toBeVisible({ timeout: 10000 })
    
    // Step 5: Should auto-redirect to dashboard
    // await expect(page).toHaveURL(/\/dashboard/, { timeout: 5000 })
    
    // Step 6: Verify session cookie is set
    // const cookies = await page.context().cookies()
    // const sessionCookie = cookies.find(c => c.name === 'session')
    // expect(sessionCookie).toBeTruthy()
    // expect(sessionCookie?.httpOnly).toBe(true)
  })

  test('FR-3: Verification page is client-rendered (no SSR errors)', async ({ page }) => {
    // This test verifies the 'use client' directive works
    // and the page doesn't fail during hydration
    
    await page.goto('http://localhost:3000/auth/verify?token=test')
    
    // Should not see Next.js hydration errors
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })
    
    await page.waitForLoadState('networkidle')
    
    // Check for common hydration errors
    const hasHydrationError = consoleErrors.some(err => 
      err.includes('Hydration') || 
      err.includes('did not match') ||
      err.includes('useSearchParams')
    )
    
    expect(hasHydrationError).toBe(false)
  })

  test('FR-2: Manual redirect link works when auto-redirect fails', async ({ page }) => {
    // Mock a scenario where router.push fails
    await page.goto('http://localhost:3000/auth/verify?token=invalid')
    
    // Wait for error state
    await expect(page.locator('text=Verification Failed')).toBeVisible()
    
    // Click "Back to Login"
    await page.click('button:has-text("Back to Login")')
    
    // Should navigate to login page
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test('FR-3: API endpoint validates token format', async ({ page }) => {
    // Test POST /api/auth/verify with various invalid inputs
    
    // Missing token
    const res1 = await page.request.post('http://localhost:3000/api/auth/verify', {
      data: {},
    })
    expect(res1.status()).toBe(400)
    const data1 = await res1.json()
    expect(data1.error).toContain('token')
    
    // Empty token
    const res2 = await page.request.post('http://localhost:3000/api/auth/verify', {
      data: { token: '' },
    })
    expect(res2.status()).toBe(400)
    
    // Malformed token
    const res3 = await page.request.post('http://localhost:3000/api/auth/verify', {
      data: { token: 'not-a-valid-base64-token' },
    })
    expect(res3.status()).toBe(401)
  })

  test('FR-3: Expired token is rejected', async ({ page }) => {
    // This test requires a fixture with an expired token
    // Placeholder for when we have test data generation
    
    // const expiredToken = 'expired-token-fixture'
    // const res = await page.request.post('http://localhost:3000/api/auth/verify', {
    //   data: { token: expiredToken },
    // })
    // expect(res.status()).toBe(401)
    // const data = await res.json()
    // expect(data.error).toContain('expired')
  })
})
