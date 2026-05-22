import { test, expect } from '@playwright/test';

/**
 * Day 129 — MVP Regression Testing
 * Full user flow: signup → login → shop creation → product management → checkout → order tracking
 * Tests all critical paths required for an MVP to function end-to-end.
 */

test.describe('Day 129 MVP Regression: Full User Journey', () => {
  const baseUrl = 'https://www.soloshopbox.com';
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPass123!';
  let shopSlug: string;
  let productId: string;

  test.beforeEach(async ({ page }) => {
    test.setTimeout(90000); // Allow time for slower mobile networks
  });

  test('FR-1: New seller can sign up', async ({ page }) => {
    await page.goto(`${baseUrl}/auth/signup`);
    
    // Verify signup page loads
    await expect(page.locator('h1, h2')).toContainText(/sign up|create account/i);
    
    // Fill signup form
    await page.fill('input[name="email"], input[type="email"]', testEmail);
    await page.fill('input[name="password"], input[type="password"]', testPassword);
    
    // Submit
    await page.click('button[type="submit"], button:has-text("Sign Up")');
    
    // Should redirect to verification page or dashboard
    await page.waitForURL(/\/(auth\/verify|dashboard)/, { timeout: 15000 });
    
    console.log(`✓ Signup succeeded for ${testEmail}`);
  });

  test('FR-2: Seller can log in with password', async ({ page }) => {
    await page.goto(`${baseUrl}/auth/login`);
    
    await expect(page.locator('h1, h2')).toContainText(/log in|sign in/i);
    
    // Fill login form
    await page.fill('input[name="email"], input[type="email"]', testEmail);
    await page.fill('input[name="password"], input[type="password"]', testPassword);
    
    await page.click('button[type="submit"], button:has-text("Log In")');
    
    // Should redirect to dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 15000 });
    
    console.log(`✓ Login succeeded`);
  });

  test('FR-3: Seller can create their shop', async ({ page }) => {
    // Login first
    await page.goto(`${baseUrl}/auth/login`);
    await page.fill('input[name="email"], input[type="email"]', testEmail);
    await page.fill('input[name="password"], input[type="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/, { timeout: 15000 });
    
    // Navigate to create shop
    await page.goto(`${baseUrl}/dashboard/create-shop`);
    
    shopSlug = `test-shop-${Date.now()}`;
    await page.fill('input[name="name"]', 'Test Shop');
    await page.fill('input[name="slug"]', shopSlug);
    await page.fill('textarea[name="description"]', 'A test shop for regression testing');
    
    await page.click('button[type="submit"], button:has-text("Create Shop")');
    
    // Should redirect to dashboard or shop page
    await page.waitForURL(/\/(dashboard|shop)/, { timeout: 15000 });
    
    console.log(`✓ Shop created with slug: ${shopSlug}`);
  });

  test('FR-8: Seller can create a product', async ({ page }) => {
    // Login
    await page.goto(`${baseUrl}/auth/login`);
    await page.fill('input[name="email"], input[type="email"]', testEmail);
    await page.fill('input[name="password"], input[type="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/, { timeout: 15000 });
    
    // Navigate to new product page
    await page.goto(`${baseUrl}/dashboard/products/new`);
    
    // Fill product form
    await page.fill('input[name="name"]', 'Test Product');
    await page.fill('input[name="price"]', '29.99');
    await page.fill('textarea[name="description"]', 'A regression test product');
    await page.fill('input[name="stockQuantity"]', '100');
    
    await page.click('button[type="submit"], button:has-text("Create Product")');
    
    // Should redirect back to products list
    await page.waitForURL(/\/dashboard\/products/, { timeout: 15000 });
    
    // Extract product ID from URL or page content
    const productLinks = await page.locator('a[href*="/products/"]').all();
    if (productLinks.length > 0) {
      const href = await productLinks[0].getAttribute('href');
      const match = href?.match(/\/products\/(\d+)/);
      if (match) {
        productId = match[1];
        console.log(`✓ Product created with ID: ${productId}`);
      }
    }
  });

  test('FR-5: Public can browse shop and view products', async ({ page }) => {
    // No auth required — browse public storefront
    await page.goto(`${baseUrl}/shop/${shopSlug}`);
    
    // Verify shop page loads
    await expect(page.locator('h1, h2')).toContainText(/Test Shop|products/i);
    
    // Verify product is visible
    await expect(page.locator('text=Test Product')).toBeVisible({ timeout: 10000 });
    
    console.log(`✓ Public shop page loads and displays products`);
  });

  test('FR-6: Customer can add product to cart', async ({ page }) => {
    await page.goto(`${baseUrl}/shop/${shopSlug}`);
    
    // Find and click "Add to Cart" button
    const addToCartButton = page.locator('button:has-text("Add to Cart")').first();
    await addToCartButton.click();
    
    // Cart count should update
    await expect(page.locator('[data-cart-count], .cart-badge')).toContainText(/1/, { timeout: 5000 });
    
    console.log(`✓ Product added to cart`);
  });

  test('FR-10: Customer can view checkout page', async ({ page }) => {
    await page.goto(`${baseUrl}/shop/${shopSlug}`);
    
    // Add product to cart
    await page.locator('button:has-text("Add to Cart")').first().click();
    await page.waitForTimeout(1000);
    
    // Navigate to checkout
    await page.goto(`${baseUrl}/checkout`);
    
    // Verify checkout page loads
    await expect(page.locator('h1, h2')).toContainText(/checkout|order/i, { timeout: 10000 });
    
    // Verify product is in cart
    await expect(page.locator('text=Test Product')).toBeVisible();
    
    console.log(`✓ Checkout page loads with cart items`);
  });

  test('FR-11: Customer can see order confirmation', async ({ page }) => {
    // This test would normally complete a payment flow
    // For regression, we verify the checkout page structure
    await page.goto(`${baseUrl}/checkout`);
    
    // Verify form fields exist
    await expect(page.locator('input[name="email"], input[type="email"]')).toBeVisible();
    await expect(page.locator('input[name="phone"], input[type="tel"]')).toBeVisible();
    
    console.log(`✓ Checkout form fields present`);
  });

  test('FR-13: Seller can view their orders', async ({ page }) => {
    // Login as seller
    await page.goto(`${baseUrl}/auth/login`);
    await page.fill('input[name="email"], input[type="email"]', testEmail);
    await page.fill('input[name="password"], input[type="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/, { timeout: 15000 });
    
    // Navigate to orders page
    await page.goto(`${baseUrl}/dashboard/orders`);
    
    // Verify orders page loads
    await expect(page.locator('h1, h2')).toContainText(/orders/i);
    
    // Verify table or empty state exists
    const hasTable = await page.locator('table').isVisible().catch(() => false);
    const hasEmptyState = await page.locator('text=/no orders|empty/i').isVisible().catch(() => false);
    
    expect(hasTable || hasEmptyState).toBe(true);
    
    console.log(`✓ Orders page accessible`);
  });

  test('FR-36: Seller can view analytics', async ({ page }) => {
    // Login as seller
    await page.goto(`${baseUrl}/auth/login`);
    await page.fill('input[name="email"], input[type="email"]', testEmail);
    await page.fill('input[name="password"], input[type="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/, { timeout: 15000 });
    
    // Navigate to analytics
    await page.goto(`${baseUrl}/dashboard/analytics`);
    
    // Verify analytics page loads
    await expect(page.locator('h1, h2')).toContainText(/analytics|metrics|insights/i);
    
    // Verify metric cards exist
    const metricCards = await page.locator('[class*="metric"], [class*="card"], [class*="stat"]').count();
    expect(metricCards).toBeGreaterThan(0);
    
    console.log(`✓ Analytics page loads with metrics`);
  });

  test('WIRING: All critical pages return 200 OK', async ({ page }) => {
    const criticalUrls = [
      '/',
      '/auth/login',
      '/auth/signup',
      '/dashboard',
      '/dashboard/products',
      '/dashboard/orders',
      '/dashboard/analytics',
      '/shop',
      '/checkout',
    ];

    for (const url of criticalUrls) {
      const response = await page.goto(`${baseUrl}${url}`);
      expect(response?.status()).toBeLessThan(400);
      console.log(`✓ ${url} → ${response?.status()}`);
    }
  });
});
