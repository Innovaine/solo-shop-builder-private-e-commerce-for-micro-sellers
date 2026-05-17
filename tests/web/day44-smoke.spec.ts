import { test, expect } from '@playwright/test';

test.describe('Day 44 Smoke Tests', () => {
  test('Homepage loads', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page).toHaveTitle(/Solo Shop Builder|Start Your Shop|Home/i);
    
    // Check for key elements
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
  });

  test('Health endpoint returns OK', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/api/health');
    expect(response?.status()).toBe(200);
    
    const json = await response?.json();
    expect(json.status).toBe('ok');
    expect(json.checks.database.status).toBe('ok');
  });

  test('Login page loads', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login');
    
    // Should see email input
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
  });

  test('404 page renders custom not-found page', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/nonexistent-page-xyz');
    expect(response?.status()).toBe(404);
    
    // Check for custom 404 content (from day 43 feature)
    const content = await page.textContent('body');
    expect(content).toMatch(/not found|404/i);
  });

  test('Dashboard redirects to login when not authenticated', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/dashboard');
    
    // Should redirect to login
    await page.waitForURL(/auth\/login/);
    expect(page.url()).toMatch(/auth\/login/);
  });

  test('Public shop page returns 404 for non-existent shop', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/shop/nonexistent-shop-xyz');
    expect(response?.status()).toBe(404);
  });

  test('Signup page loads', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/signup');
    
    // Should see email input or form
    const emailInput = page.locator('input[type="email"]').first();
    await expect(emailInput).toBeVisible({ timeout: 5000 });
  });

  test('Settings page requires authentication', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/settings');
    
    // Should redirect to login
    await page.waitForURL(/auth\/login/, { timeout: 5000 });
  });

  test('Error handling - malformed API request', async ({ page }) => {
    const response = await page.request.post('http://localhost:3000/api/shops', {
      data: { invalid: 'data' },
      headers: { 'Content-Type': 'application/json' }
    });
    
    // Should return 4xx error
    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(response.status()).toBeLessThan(500);
  });

  test('Static assets load', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Check that the page doesn't have major CSS/JS errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.waitForLoadState('networkidle');
    
    // Allow some errors but not critical ones
    const criticalErrors = consoleErrors.filter(err => 
      err.includes('Failed to fetch') || 
      err.includes('500') ||
      err.includes('TypeError')
    );
    
    expect(criticalErrors.length).toBe(0);
  });
});
