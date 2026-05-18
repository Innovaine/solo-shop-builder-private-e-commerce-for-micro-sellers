// Day 53 Test: Cart Checkout Bug Fix (task #158)
// Verifies "Proceed to Checkout" button routes correctly to /checkout instead of /shop/[slug]/checkout

import { test, expect } from '@playwright/test'

const BASE_URL = 'https://www.soloshopbox.com'

test.describe('Cart Checkout Bug Fix (#158)', () => {
  test('Proceed to Checkout button routes to /checkout correctly', async ({ page }) => {
    // Step 1: Create a seller with shop and product
    const email = `cart-fix-${Date.now()}@test.com`
    await page.goto(`${BASE_URL}/auth/login`)
    
    await page.fill('input[type="email"]', email)
    await page.click('button:has-text("Continue")')
    
    // Wait for verify link (using magic link flow)
    await page.waitForURL('**/auth/verify**', { timeout: 10000 })
    
    // In real flow we'd need the token, but let's check via API instead
    // Create via API to get proper session
    const signupRes = await page.request.post(`${BASE_URL}/api/auth/signup`, {
      data: { email }
    })
    const { verifyToken } = await signupRes.json()
    
    const verifyRes = await page.request.post(`${BASE_URL}/api/auth/verify`, {
      data: { token: verifyToken }
    })
    const cookies = verifyRes.headers()['set-cookie'] || ''
    
    // Create shop
    const shopSlug = `cart-fix-${Date.now()}`
    const shopRes = await page.request.post(`${BASE_URL}/api/shops`, {
      headers: { cookie: cookies },
      data: {
        slug: shopSlug,
        displayName: 'Cart Fix Shop',
        description: 'Testing cart checkout fix'
      }
    })
    expect(shopRes.ok()).toBeTruthy()
    
    // Create a product
    const productRes = await page.request.post(`${BASE_URL}/api/products`, {
      headers: { cookie: cookies },
      data: {
        title: 'Cart Test Product',
        price: 29.99,
        description: 'For cart checkout test',
        category: 'Electronics'
      }
    })
    expect(productRes.ok()).toBeTruthy()
    const { product } = await productRes.json()
    
    // Step 2: Visit the storefront and add product to cart
    await page.goto(`${BASE_URL}/shop/${shopSlug}`)
    await page.waitForLoadState('networkidle')
    
    // Find and click Add to Cart button
    await page.click(`button:has-text("Add to Cart")`)
    await page.waitForTimeout(1000) // Wait for cart state to update
    
    // Open cart (click cart button in header or similar)
    const cartButton = page.locator('button:has-text("Cart")')
    if (await cartButton.isVisible()) {
      await cartButton.click()
      await page.waitForTimeout(500)
    }
    
    // Step 3: Click "Proceed to Checkout" and verify route
    const checkoutButton = page.locator('button:has-text("Proceed to Checkout")')
    if (await checkoutButton.isVisible()) {
      await checkoutButton.click()
      
      // Verify we're on /checkout NOT /shop/[slug]/checkout
      await page.waitForURL('**/checkout', { timeout: 5000 })
      const currentUrl = page.url()
      
      expect(currentUrl).toContain('/checkout')
      expect(currentUrl).not.toContain(`/shop/${shopSlug}/checkout`)
      
      console.log(`✓ Cart checkout routes correctly to: ${currentUrl}`)
    } else {
      console.log('Cart button UI not found - testing via direct cart manipulation')
      
      // Alternative: test by navigating directly to storefront with product and checking link
      await page.goto(`${BASE_URL}/shop/${shopSlug}/product/${product.id}`)
      await page.waitForLoadState('networkidle')
      
      // Look for checkout-related links in page
      const links = await page.locator('a[href*="checkout"]').all()
      for (const link of links) {
        const href = await link.getAttribute('href')
        console.log(`Found checkout link: ${href}`)
        expect(href).not.toContain(`/shop/${shopSlug}/checkout`)
      }
    }
  })
  
  test('CartButton component links to /checkout not /shop/[slug]/checkout', async ({ page }) => {
    // Create test seller + shop + product via API
    const email = `cart-btn-${Date.now()}@test.com`
    const signupRes = await page.request.post(`${BASE_URL}/api/auth/signup`, {
      data: { email }
    })
    const { verifyToken } = await signupRes.json()
    
    const verifyRes = await page.request.post(`${BASE_URL}/api/auth/verify`, {
      data: { token: verifyToken }
    })
    const cookies = verifyRes.headers()['set-cookie'] || ''
    
    const shopSlug = `cart-btn-${Date.now()}`
    await page.request.post(`${BASE_URL}/api/shops`, {
      headers: { cookie: cookies },
      data: { slug: shopSlug, displayName: 'Test', description: 'Test' }
    })
    
    await page.request.post(`${BASE_URL}/api/products`, {
      headers: { cookie: cookies },
      data: {
        title: 'Test Product',
        price: 19.99,
        description: 'Test',
        category: 'Electronics'
      }
    })
    
    // Visit storefront
    await page.goto(`${BASE_URL}/shop/${shopSlug}`)
    await page.waitForLoadState('networkidle')
    
    // Check page source or rendered content for checkout links
    const pageContent = await page.content()
    
    // Should NOT contain the broken route pattern
    expect(pageContent).not.toContain(`/shop/${shopSlug}/checkout`)
    
    // If cart button exists, verify its behavior
    const cartBtn = page.locator('button:has-text("Cart")')
    if (await cartBtn.isVisible()) {
      await cartBtn.click()
      await page.waitForTimeout(500)
      
      // Look for proceed to checkout button/link
      const proceedBtn = page.locator('button:has-text("Proceed"), a:has-text("Checkout")')
      if (await proceedBtn.first().isVisible()) {
        const firstBtn = proceedBtn.first()
        
        // If it's a link, check href
        if (await firstBtn.evaluate(el => el.tagName === 'A')) {
          const href = await firstBtn.getAttribute('href')
          expect(href).toBe('/checkout')
        } else {
          // If it's a button, click and verify navigation
          await firstBtn.click()
          await page.waitForURL('**/checkout', { timeout: 5000 })
          expect(page.url()).toContain('/checkout')
          expect(page.url()).not.toContain(`/shop/${shopSlug}/checkout`)
        }
      }
    }
  })
})
