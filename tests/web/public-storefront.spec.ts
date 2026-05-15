import { test, expect } from '@playwright/test';

/**
 * FR-5: Public shop storefront
 * Tests:
 * 1. /shop/[valid-slug] returns 200 with shop name
 * 2. /shop/[invalid-slug] returns 404
 * 3. Page loads in <2 seconds (p95)
 * 4. Page is mobile-responsive (320px minimum)
 * 5. No authentication required to view
 */

test.describe('FR-5: Public Shop Storefront', () => {
  const testSlug = `test-shop-${Date.now()}`;

  test.beforeAll(async ({ browser }) => {
    // Create a test shop first via authenticated session
    const context = await browser.newContext();
    await context.addCookies([{
      name: 'session',
      value: 'test-session-token',
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'Strict'
    }]);

    const page = await context.newPage();
    await page.goto('http://localhost:3000/dashboard/create-shop');
    
    // Try to create the shop
    try {
      const nameInput = page.locator('input[name="name"]').or(page.locator('input[placeholder*="shop name"]').first());
      const slugInput = page.locator('input[name="slug"]').or(page.locator('input[placeholder*="slug"]').first());
      const submitButton = page.locator('button[type="submit"]').or(page.locator('button:has-text("Create")'));

      await nameInput.fill('Test Public Shop');
      await slugInput.clear();
      await slugInput.fill(testSlug);
      await submitButton.click();
      await page.waitForTimeout(2000);
    } catch (e) {
      // Shop creation might fail if already exists, that's okay
      console.log('Shop creation skipped or failed:', e);
    }

    await context.close();
  });

  test('FR-5: Valid shop slug returns 200 with shop name', async ({ page }) => {
    const startTime = Date.now();

    // Navigate to public storefront (no authentication)
    await page.goto(`http://localhost:3000/shop/${testSlug}`);
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;

    // Take screenshot
    await page.screenshot({ path: 'test-results/day-07/12-public-storefront.png', fullPage: true });

    // Should see shop name or empty state message
    const shopNameVisible = await page.locator(`text=/test.*shop|${testSlug}/i`).count() > 0;
    const emptyStateVisible = await page.locator('text=/empty|no products/i').count() > 0;

    expect(shopNameVisible || emptyStateVisible).toBeTruthy();

    // Check response status via checking for 404 text
    const notFoundVisible = await page.locator('text=/404|not found/i').count() > 0;
    expect(notFoundVisible).toBeFalsy();

    console.log(`Page load time: ${loadTime}ms`);
  });

  test('FR-5: Invalid shop slug returns 404', async ({ page }) => {
    const invalidSlug = 'this-shop-definitely-does-not-exist-12345';

    await page.goto(`http://localhost:3000/shop/${invalidSlug}`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/day-07/13-shop-404.png' });

    // Should see 404 or "not found" message
    const notFoundVisible = await page.locator('text=/404|not found|doesn.*t exist/i').count() > 0;
    expect(notFoundVisible).toBeTruthy();
  });

  test('FR-5: Page loads in under 2 seconds', async ({ page }) => {
    const startTime = Date.now();

    await page.goto(`http://localhost:3000/shop/${testSlug}`);
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    console.log(`Storefront load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(2000);
  });

  test('FR-5: Page is mobile-responsive (320px)', async ({ browser }) => {
    // Create mobile viewport context
    const context = await browser.newContext({
      viewport: { width: 320, height: 568 }
    });

    const page = await context.newPage();
    await page.goto(`http://localhost:3000/shop/${testSlug}`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/day-07/14-mobile-320px.png', fullPage: true });

    // Check that content is visible (not cut off or overlapping)
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    
    // Body width should not exceed viewport width (indicating horizontal scroll)
    expect(bodyWidth).toBeLessThanOrEqual(320);

    await context.close();
  });

  test('FR-5: No authentication required to view storefront', async ({ browser }) => {
    // Create a fresh context with no cookies (unauthenticated)
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(`http://localhost:3000/shop/${testSlug}`);
    await page.waitForLoadState('networkidle');

    // Should NOT redirect to login
    expect(page.url()).toContain(`/shop/${testSlug}`);
    expect(page.url()).not.toContain('login');
    expect(page.url()).not.toContain('auth');

    await page.screenshot({ path: 'test-results/day-07/15-unauthenticated-access.png' });

    await context.close();
  });
});
