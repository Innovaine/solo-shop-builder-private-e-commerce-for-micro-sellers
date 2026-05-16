import { test, expect } from '@playwright/test';

/**
 * Day 16 — Smoke Tests
 * Verify basic functionality still works after adding UI component library
 */

test.describe('Day 16 — Smoke Tests', () => {
  
  test('Homepage loads successfully', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/');
    expect(response?.status()).toBe(200);
    
    // Check for the main heading
    await expect(page.locator('h1')).toContainText('Solo Shop Builder');
    
    await page.screenshot({ path: 'test-results/day-16/homepage-smoke.png', fullPage: true });
  });

  test('Login page loads successfully', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/auth/login');
    expect(response?.status()).toBe(200);
    
    // Verify form elements exist
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    
    await page.screenshot({ path: 'test-results/day-16/login-smoke.png', fullPage: true });
  });

  test('Health endpoint responds correctly', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/api/health');
    expect(response?.status()).toBe(200);
    
    const body = await page.textContent('body');
    expect(body).toContain('status');
    expect(body).toContain('ok');
  });

  test('Can create account and see dashboard', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login');
    
    // Find and click signup link (may be styled as button)
    const signupLink = page.locator('a').filter({ hasText: /sign.*up/i }).first();
    if (await signupLink.count() > 0) {
      await signupLink.click();
    } else {
      // Already on signup page or different structure
      console.log('No signup link found, assuming on signup page');
    }
    
    // Fill signup form
    const testEmail = `smoke-test-${Date.now()}@example.com`;
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', 'TestPass123!');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard (may take a moment)
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    
    // Verify we're on dashboard
    const url = page.url();
    expect(url).toContain('/dashboard');
    
    await page.screenshot({ path: 'test-results/day-16/dashboard-smoke.png', fullPage: true });
  });

  test('Can create a shop', async ({ page }) => {
    // Sign up
    await page.goto('http://localhost:3000/auth/login');
    const signupLink = page.locator('a').filter({ hasText: /sign.*up/i }).first();
    if (await signupLink.count() > 0) {
      await signupLink.click();
    }
    
    const testEmail = `shop-creator-${Date.now()}@example.com`;
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', 'TestPass123!');
    await page.click('button[type="submit"]');
    
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    
    // Navigate to create shop
    await page.goto('http://localhost:3000/dashboard/create-shop');
    
    // Fill shop form
    const shopSlug = `test-shop-${Date.now()}`;
    await page.fill('input[name="slug"]', shopSlug);
    await page.fill('input[name="name"]', 'Test Shop');
    await page.fill('textarea[name="description"]', 'A test shop for Day 16');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Should redirect back to dashboard
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    
    await page.screenshot({ path: 'test-results/day-16/after-shop-creation.png', fullPage: true });
    
    // Verify shop exists by visiting it
    const shopResponse = await page.goto(`http://localhost:3000/shop/${shopSlug}`);
    expect(shopResponse?.status()).toBe(200);
    
    await page.screenshot({ path: 'test-results/day-16/storefront-smoke.png', fullPage: true });
  });
});
