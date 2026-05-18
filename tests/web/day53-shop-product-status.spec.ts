// Day 53 Tests: FR-152 (shop status toggle) & FR-153 (product status toggle)
// Tests shop ACTIVE/PAUSED toggle and product PUBLISHED/DRAFT toggle

import { test, expect } from '@playwright/test'

const BASE_URL = 'https://www.soloshopbox.com'

test.describe('FR-152: Shop Status Toggle', () => {
  test('can toggle shop status between ACTIVE and PAUSED via API', async ({ request }) => {
    // First create a seller and shop
    const signupRes = await request.post(`${BASE_URL}/api/auth/signup`, {
      data: { email: `shop-status-${Date.now()}@test.com` }
    })
    expect(signupRes.ok()).toBeTruthy()
    const { verifyToken } = await signupRes.json()

    const verifyRes = await request.post(`${BASE_URL}/api/auth/verify`, {
      data: { token: verifyToken }
    })
    expect(verifyRes.ok()).toBeTruthy()
    const cookies = verifyRes.headers()['set-cookie'] || ''

    const shopRes = await request.post(`${BASE_URL}/api/shops`, {
      headers: { cookie: cookies },
      data: {
        slug: `shop-status-${Date.now()}`,
        displayName: 'Test Shop',
        description: 'Testing shop status'
      }
    })
    expect(shopRes.ok()).toBeTruthy()

    // Toggle shop to PAUSED
    const pauseRes = await request.put(`${BASE_URL}/api/shops/status`, {
      headers: { cookie: cookies },
      data: { status: 'PAUSED' }
    })
    expect(pauseRes.ok()).toBeTruthy()
    const pauseData = await pauseRes.json()
    expect(pauseData.shop.status).toBe('PAUSED')
    expect(pauseData.message).toContain('PAUSED')

    // Toggle back to ACTIVE
    const activeRes = await request.put(`${BASE_URL}/api/shops/status`, {
      headers: { cookie: cookies },
      data: { status: 'ACTIVE' }
    })
    expect(activeRes.ok()).toBeTruthy()
    const activeData = await activeRes.json()
    expect(activeData.shop.status).toBe('ACTIVE')
    expect(activeData.message).toContain('ACTIVE')
  })

  test('rejects invalid status values', async ({ request }) => {
    const signupRes = await request.post(`${BASE_URL}/api/auth/signup`, {
      data: { email: `invalid-status-${Date.now()}@test.com` }
    })
    const { verifyToken } = await signupRes.json()
    const verifyRes = await request.post(`${BASE_URL}/api/auth/verify`, {
      data: { token: verifyToken }
    })
    const cookies = verifyRes.headers()['set-cookie'] || ''

    await request.post(`${BASE_URL}/api/shops`, {
      headers: { cookie: cookies },
      data: {
        slug: `invalid-shop-${Date.now()}`,
        displayName: 'Test',
        description: 'Test'
      }
    })

    const badRes = await request.put(`${BASE_URL}/api/shops/status`, {
      headers: { cookie: cookies },
      data: { status: 'INVALID' }
    })
    expect(badRes.status()).toBe(400)
    const errorData = await badRes.json()
    expect(errorData.error).toContain('Must be ACTIVE or PAUSED')
  })
})

test.describe('FR-153: Product Status Toggle', () => {
  test('can toggle product status between PUBLISHED and DRAFT via API', async ({ request }) => {
    // Setup: create seller, shop, and product
    const signupRes = await request.post(`${BASE_URL}/api/auth/signup`, {
      data: { email: `product-status-${Date.now()}@test.com` }
    })
    const { verifyToken } = await signupRes.json()
    const verifyRes = await request.post(`${BASE_URL}/api/auth/verify`, {
      data: { token: verifyToken }
    })
    const cookies = verifyRes.headers()['set-cookie'] || ''

    await request.post(`${BASE_URL}/api/shops`, {
      headers: { cookie: cookies },
      data: {
        slug: `prod-status-${Date.now()}`,
        displayName: 'Product Test Shop',
        description: 'Testing product status'
      }
    })

    const productRes = await request.post(`${BASE_URL}/api/products`, {
      headers: { cookie: cookies },
      data: {
        title: 'Test Product',
        price: 29.99,
        description: 'Testing status toggle',
        category: 'Electronics'
      }
    })
    expect(productRes.ok()).toBeTruthy()
    const { product } = await productRes.json()

    // Toggle to DRAFT
    const draftRes = await request.put(`${BASE_URL}/api/products/${product.id}/status`, {
      headers: { cookie: cookies },
      data: { status: 'DRAFT' }
    })
    expect(draftRes.ok()).toBeTruthy()
    const draftData = await draftRes.json()
    expect(draftData.product.status).toBe('DRAFT')
    expect(draftData.message).toContain('DRAFT')

    // Toggle to PUBLISHED
    const publishRes = await request.put(`${BASE_URL}/api/products/${product.id}/status`, {
      headers: { cookie: cookies },
      data: { status: 'PUBLISHED' }
    })
    expect(publishRes.ok()).toBeTruthy()
    const publishData = await publishRes.json()
    expect(publishData.product.status).toBe('PUBLISHED')
    expect(publishData.message).toContain('PUBLISHED')
  })

  test('rejects invalid product status values', async ({ request }) => {
    const signupRes = await request.post(`${BASE_URL}/api/auth/signup`, {
      data: { email: `prod-invalid-${Date.now()}@test.com` }
    })
    const { verifyToken } = await signupRes.json()
    const verifyRes = await request.post(`${BASE_URL}/api/auth/verify`, {
      data: { token: verifyToken }
    })
    const cookies = verifyRes.headers()['set-cookie'] || ''

    await request.post(`${BASE_URL}/api/shops`, {
      headers: { cookie: cookies },
      data: { slug: `prod-inv-${Date.now()}`, displayName: 'Test', description: 'Test' }
    })

    const productRes = await request.post(`${BASE_URL}/api/products`, {
      headers: { cookie: cookies },
      data: { title: 'Product', price: 10, description: 'Test', category: 'Electronics' }
    })
    const { product } = await productRes.json()

    const badRes = await request.put(`${BASE_URL}/api/products/${product.id}/status`, {
      headers: { cookie: cookies },
      data: { status: 'ARCHIVED' }
    })
    expect(badRes.status()).toBe(400)
    const errorData = await badRes.json()
    expect(errorData.error).toContain('Must be PUBLISHED or DRAFT')
  })

  test('rejects status change for non-owned product', async ({ request }) => {
    // Create seller A with product
    const sellerA = await request.post(`${BASE_URL}/api/auth/signup`, {
      data: { email: `seller-a-${Date.now()}@test.com` }
    })
    const { verifyToken: tokenA } = await sellerA.json()
    const verifyA = await request.post(`${BASE_URL}/api/auth/verify`, { data: { token: tokenA } })
    const cookiesA = verifyA.headers()['set-cookie'] || ''

    await request.post(`${BASE_URL}/api/shops`, {
      headers: { cookie: cookiesA },
      data: { slug: `seller-a-${Date.now()}`, displayName: 'A', description: 'A' }
    })

    const productRes = await request.post(`${BASE_URL}/api/products`, {
      headers: { cookie: cookiesA },
      data: { title: 'Product A', price: 10, description: 'Test', category: 'Electronics' }
    })
    const { product } = await productRes.json()

    // Create seller B
    const sellerB = await request.post(`${BASE_URL}/api/auth/signup`, {
      data: { email: `seller-b-${Date.now()}@test.com` }
    })
    const { verifyToken: tokenB } = await sellerB.json()
    const verifyB = await request.post(`${BASE_URL}/api/auth/verify`, { data: { token: tokenB } })
    const cookiesB = verifyB.headers()['set-cookie'] || ''

    await request.post(`${BASE_URL}/api/shops`, {
      headers: { cookie: cookiesB },
      data: { slug: `seller-b-${Date.now()}`, displayName: 'B', description: 'B' }
    })

    // Seller B tries to modify seller A's product
    const attackRes = await request.put(`${BASE_URL}/api/products/${product.id}/status`, {
      headers: { cookie: cookiesB },
      data: { status: 'DRAFT' }
    })
    expect(attackRes.status()).toBe(404)
    const errorData = await attackRes.json()
    expect(errorData.error).toContain('not found or access denied')
  })
})
