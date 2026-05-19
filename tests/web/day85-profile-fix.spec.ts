import { test, expect } from '@playwright/test'

// Day 85: Test GET method fix on /api/shops/profile endpoint (#246)

test.describe('Day 85 - Profile endpoint GET method fix', () => {
  test('GET /api/shops/profile returns 401 when not authenticated', async ({ request }) => {
    const response = await request.get('https://www.soloshopbox.com/api/shops/profile')
    
    expect(response.status()).toBe(401)
    const body = await response.json()
    expect(body).toHaveProperty('error')
  })

  test('OPTIONS /api/shops/profile includes GET in allowed methods', async ({ request }) => {
    const response = await request.fetch('https://www.soloshopbox.com/api/shops/profile', {
      method: 'OPTIONS'
    })
    
    const allowHeader = response.headers()['allow'] || ''
    expect(allowHeader.toLowerCase()).toContain('get')
  })
})

test.describe('Day 85 - Core functionality smoke test', () => {
  test('Homepage loads successfully', async ({ page }) => {
    await page.goto('https://www.soloshopbox.com/')
    await expect(page.locator('h1')).toBeVisible()
  })

  test('Login page is accessible', async ({ page }) => {
    await page.goto('https://www.soloshopbox.com/auth/login')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('API health check passes', async ({ request }) => {
    const response = await request.get('https://www.soloshopbox.com/api/health')
    
    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.status).toBe('ok')
    expect(body.checks.database.status).toBe('ok')
  })

  test('Orders API requires authentication', async ({ request }) => {
    const response = await request.get('https://www.soloshopbox.com/api/orders')
    expect(response.status()).toBe(401)
  })
})
