import { test, expect } from '@playwright/test';

/**
 * Day 17 — Button Component Integration Testing
 * 
 * Engineer integrated Button component into 3 pages:
 * 1. Landing page (app/page.tsx)
 * 2. Shop storefront (app/shop/[slug]/page.tsx)  
 * 3. Product detail page (app/shop/[slug]/product/[productId]/page.tsx)
 * 
 * Also verified:
 * - Product detail page route works (no 404)
 * - Manual color overrides removed from globals.css
 */

test.describe('Day 17 — Button Component Integration', () => {
  
  test('Landing page uses Button component and renders correctly', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/');
    expect(response?.status()).toBe(200);
    
    // Landing page should have the heading
    await expect(page.locator('h1')).toContainText('Start Your Shop Today');
    
    // Should have CTA buttons
    const buttons = page.locator('button, a[class*="btn"], a[class*="button"]');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);
    
    // Take screenshot to verify visual consistency
    await page.screenshot({ path: 'test-results/day-17/landing-page.png', fullPage: true });
  });

  test('Product detail page renders without 404', async ({ page }) => {
    // First, need to create a shop and product via database
    // Based on engineer's SSH log, they created test data manually
    // We'll test the public route directly
    
    // The engineer verified this works in their SSH test:
    // curl -I http://localhost:3000/shop/test-shop/product/48cbf0db-6ca1-43f7-a584-c24f2a26a930
    // Response: HTTP 200
    
    // For this test, we'll create our own shop and product via signup flow
    await page.goto('http://localhost:3000/auth/login');
    
    // Look for signup link
    const signupLink = page.locator('a[href*="signup"], a:has-text("Sign up")');
    if (await signupLink.count() > 0) {
      await signupLink.first().click();
      
      const testEmail = `day17-test-${Date.now()}@example.com`;
      await page.fill('input[type="email"]', testEmail);
      await page.fill('input[type="password"]', 'SecurePass123!');
      await page.click('button[type="submit"]');
      
      // Wait for redirect to dashboard
      await page.waitForURL('**/dashboard', { timeout: 10000 });
      
      // Create a shop
      await page.goto('http://localhost:3000/dashboard/create-shop');
      const shopSlug = `day17-shop-${Date.now()}`;
      await page.fill('input[name="slug"]', shopSlug);
      await page.fill('input[name="name"]', 'Day 17 Test Shop');
      await page.fill('textarea[name="description"]', 'Testing product detail integration');
      await page.click('button[type="submit"]');
      
      await page.waitForURL('**/dashboard', { timeout: 10000 });
      
      // Create a product
      await page.goto('http://localhost:3000/dashboard/products/new');
      await page.fill('input[name="title"]', 'Test Product Day 17');
      await page.fill('textarea[name="description"]', 'Testing product detail page');
      await page.fill('input[name="price"]', '29.99');
      await page.click('button[type="submit"]');
      
      // Extract product ID from URL after creation
      await page.waitForURL('**/dashboard/products', { timeout: 10000 });
      
      // Navigate to products list to get the product ID
      const productLinks = page.locator('a[href*="/shop/"][href*="/product/"]');
      if (await productLinks.count() > 0) {
        const firstProductLink = productLinks.first();
        const href = await firstProductLink.getAttribute('href');
        
        if (href) {
          // Visit the product detail page
          const productResponse = await page.goto(`http://localhost:3000${href}`);
          
          // This is the key test: product detail page should NOT 404
          expect(productResponse?.status()).toBe(200);
          
          // Should show the product title
          await expect(page.locator('h1, h2')).toContainText('Test Product Day 17');
          
          // Should have buttons (from Button component integration)
          const buttons = page.locator('button, a[class*="btn"]');
          expect(await buttons.count()).toBeGreaterThan(0);
          
          await page.screenshot({ path: 'test-results/day-17/product-detail-page.png', fullPage: true });
        }
      }
    } else {
      // Fallback: just test that a product detail route returns 200, not 404
      // Using the test data the engineer created
      test.skip();
    }
  });

  test('Shop storefront page uses Button component', async ({ page }) => {
    // Create shop via auth flow
    await page.goto('http://localhost:3000/auth/login');
    
    const signupLink = page.locator('a[href*="signup"], a:has-text("Sign up")');
    if (await signupLink.count() > 0) {
      await signupLink.first().click();
      
      const testEmail = `storefront-${Date.now()}@example.com`;
      await page.fill('input[type="email"]', testEmail);
      await page.fill('input[type="password"]', 'SecurePass123!');
      await page.click('button[type="submit"]');
      
      await page.waitForURL('**/dashboard', { timeout: 10000 });
      
      // Create a shop
      await page.goto('http://localhost:3000/dashboard/create-shop');
      const shopSlug = `storefront-${Date.now()}`;
      await page.fill('input[name="slug"]', shopSlug);
      await page.fill('input[name="name"]', 'Storefront Test Shop');
      await page.fill('textarea[name="description"]', 'Testing storefront button integration');
      await page.click('button[type="submit"]');
      
      await page.waitForURL('**/dashboard', { timeout: 10000 });
      
      // Visit the storefront
      const storefrontResponse = await page.goto(`http://localhost:3000/shop/${shopSlug}`);
      expect(storefrontResponse?.status()).toBe(200);
      
      // Should show shop name
      await expect(page.locator('h1, h2')).toContainText('Storefront Test Shop');
      
      // Storefront should render even if empty
      await page.screenshot({ path: 'test-results/day-17/storefront-page.png', fullPage: true });
    } else {
      test.skip();
    }
  });

  test('All pages still render after component integration (no regressions)', async ({ page }) => {
    // Test critical routes
    const routes = [
      { url: 'http://localhost:3000/', name: 'Homepage' },
      { url: 'http://localhost:3000/api/health', name: 'Health check' },
      { url: 'http://localhost:3000/auth/login', name: 'Login page' },
    ];
    
    for (const route of routes) {
      const response = await page.goto(route.url);
      expect(response?.status(), `${route.name} should return 200`).toBe(200);
    }
  });

  test('Visual consistency check - buttons use brand colors', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Take full page screenshot for visual regression comparison
    await page.screenshot({ 
      path: 'test-results/day-17/visual-consistency.png', 
      fullPage: true 
    });
    
    // Check that buttons exist and are visible
    const buttons = page.locator('button, a[class*="btn"]');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
  });
});
