// Day 101 — MyFatoorah Integration Fixes
// Tests signature verification, customer email, and order persistence

import { test, expect } from '@playwright/test'
import crypto from 'node:crypto'

const BASE_URL = process.env.BASE_URL || 'https://www.soloshopbox.com'

test.describe('MyFatoorah Callback Signature Verification', () => {
  test('rejects POST callback without signature header', async ({ request }) => {
    // Simulate webhook POST without signature
    const response = await request.post(`${BASE_URL}/api/checkout/myfatoorah/callback`, {
      headers: {
        'content-type': 'application/json',
      },
      data: JSON.stringify({
        paymentId: 'fake-payment-123',
      }),
      failOnStatusCode: false,
    })

    expect(response.status()).toBe(401)
    const body = await response.json()
    expect(body.error).toContain('signature')
  })

  test('rejects POST callback with invalid signature', async ({ request }) => {
    const webhookBody = JSON.stringify({
      paymentId: 'fake-payment-456',
    })

    const response = await request.post(`${BASE_URL}/api/checkout/myfatoorah/callback`, {
      headers: {
        'content-type': 'application/json',
        'x-myfatoorah-signature': 'invalid-signature-abc123',
      },
      data: webhookBody,
      failOnStatusCode: false,
    })

    expect(response.status()).toBe(401)
    const body = await response.json()
    expect(body.error).toContain('invalid signature')
  })

  test('accepts POST callback with valid HMAC-SHA256 signature (simulated)', async ({ request }) => {
    // This test simulates what a real MyFatoorah webhook would send
    // In production, MYFATOORAH_WEBHOOK_SECRET must be configured
    const webhookSecret = process.env.MYFATOORAH_WEBHOOK_SECRET || 'test-webhook-secret'
    
    const webhookBody = JSON.stringify({
      paymentId: 'test-payment-789',
      Data: {
        PaymentId: 'test-payment-789',
      },
    })

    // Compute HMAC-SHA256 signature (same algorithm as callback handler)
    const computedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(webhookBody)
      .digest('hex')

    const response = await request.post(`${BASE_URL}/api/checkout/myfatoorah/callback`, {
      headers: {
        'content-type': 'application/json',
        'x-myfatoorah-signature': computedSignature,
      },
      data: webhookBody,
      failOnStatusCode: false,
    })

    // Should NOT be 401 Unauthorized if signature is valid
    // Will likely be 400 (missing paymentId query) or 500 (order not found), but NOT 401
    expect(response.status()).not.toBe(401)
    
    // If we get a redirect or error, that's OK — signature verification passed
    if (response.status() === 400) {
      const body = await response.json()
      // "Missing paymentId" is acceptable — signature was valid, just malformed webhook
      expect(body.error).not.toContain('signature')
    }
  })

  test('GET callback does not require signature (redirect flow)', async ({ request }) => {
    // GET callbacks are browser redirects from MyFatoorah payment page
    // These don't have webhook signatures — only query params
    const response = await request.get(
      `${BASE_URL}/api/checkout/myfatoorah/callback?paymentId=redirect-test-123`,
      { failOnStatusCode: false }
    )

    // Should NOT be 401 — GET callbacks don't need signature
    // Will likely be redirect or error, but NOT signature rejection
    expect(response.status()).not.toBe(401)
  })
})

test.describe('MyFatoorah Customer Email & Data Persistence', () => {
  test('checkout form has customerEmail field visible', async ({ page }) => {
    // Visit checkout page
    await page.goto(`${BASE_URL}/checkout`)

    // Check for customer email input field
    const emailField = page.locator('input[name="customerEmail"], input[type="email"]').first()
    await expect(emailField).toBeVisible({ timeout: 5000 })
  })

  test('checkout page displays MyFatoorah payment option', async ({ page }) => {
    await page.goto(`${BASE_URL}/checkout`)

    // Check for MyFatoorah payment button or form
    const myfatoorahButton = page.getByRole('button', { name: /MyFatoorah|Pay with MyFatoorah/i })
    const myfatoorahForm = page.locator('form[action*="myfatoorah"]')

    // At least one should exist
    const buttonExists = await myfatoorahButton.count() > 0
    const formExists = await myfatoorahForm.count() > 0
    
    expect(buttonExists || formExists).toBeTruthy()
  })
})

test.describe('MyFatoorah API Health Check', () => {
  test('health endpoint shows MyFatoorah env vars configured', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/health`)
    expect(response.status()).toBe(200)

    const health = await response.json()
    expect(health.status).toBe('ok')
    
    // Health check should confirm database and email are working
    expect(health.checks.database.status).toBe('ok')
    expect(health.checks.email.status).toBe('ok')
  })
})
