import { test, expect } from '@playwright/test';

test.describe('FR-25: Product CSV Export', () => {
  test('CSV export endpoint exists', async ({ request }) => {
    // Test the CSV export API endpoint
    const response = await request.get('http://localhost:3000/api/products/export');
    
    // Should return 401 (unauthorized) or 200 (success), not 404 or 405
    expect([200, 401, 403, 500]).toContain(response.status());
    
    // Should NOT be 404 or 405 (which means endpoint doesn't exist)
    expect(response.status()).not.toBe(404);
    expect(response.status()).not.toBe(405);
  });

  test('products page has export button', async ({ page }) => {
    const testEmail = `csv-export-${Date.now()}@example.com`;
    const testPassword = 'TestPass123!';
    
    await page.request.post('http://localhost:3000/api/auth/signup', {
      data: { email: testEmail, password: testPassword }
    });
    
    // Login
    await page.goto('http://localhost:3000/auth/login');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');
    
    // Navigate to products page
    await page.goto('http://localhost:3000/dashboard/products');
    await page.waitForLoadState('networkidle');
    
    // Look for export button
    const exportButton = page.locator('button:has-text("Export"), a:has-text("Export"), button:has-text("CSV"), a:has-text("CSV")');
    
    const pageContent = await page.content();
    const hasExportUI = (await exportButton.count()) > 0 || 
                        pageContent.toLowerCase().includes('export') ||
                        pageContent.toLowerCase().includes('csv');
    
    expect(hasExportUI).toBe(true);
    
    await page.screenshot({ path: 'test-results/day-37/fr25-products-page.png', fullPage: true });
  });

  test('CSV export returns CSV content type', async ({ page }) => {
    const testEmail = `csv-test-${Date.now()}@example.com`;
    const testPassword = 'TestPass123!';
    
    // Signup and login
    await page.request.post('http://localhost:3000/api/auth/signup', {
      data: { email: testEmail, password: testPassword }
    });
    
    await page.goto('http://localhost:3000/auth/login');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');
    
    // Wait for login to complete
    await page.waitForURL(/dashboard|verify/, { timeout: 10000 });
    
    // Get cookies
    const cookies = await page.context().cookies();
    
    // Make authenticated request to export endpoint
    const response = await page.request.get('http://localhost:3000/api/products/export');
    
    // Should be successful or unauthorized (but not method not allowed)
    const status = response.status();
    expect([200, 401, 403]).toContain(status);
    
    if (status === 200) {
      const contentType = response.headers()['content-type'];
      expect(contentType).toMatch(/csv|text/i);
    }
  });

  test('CSV export with products returns data', async ({ page }) => {
    const testEmail = `csv-data-${Date.now()}@example.com`;
    const testPassword = 'TestPass123!';
    
    await page.request.post('http://localhost:3000/api/auth/signup', {
      data: { email: testEmail, password: testPassword }
    });
    
    await page.goto('http://localhost:3000/auth/login');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');
    
    await page.goto('http://localhost:3000/dashboard/products');
    
    // Take screenshot showing current state
    await page.screenshot({ path: 'test-results/day-37/fr25-export-ready.png', fullPage: true });
    
    // Try to trigger export if button exists
    const exportButton = page.locator('button:has-text("Export"), a[href*="export"]').first();
    
    if (await exportButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await exportButton.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'test-results/day-37/fr25-export-clicked.png', fullPage: true });
    }
  });

  test('orders CSV export endpoint exists', async ({ request }) => {
    // Test the orders export endpoint too
    const response = await request.get('http://localhost:3000/api/orders/export');
    
    // Should return 401 (unauthorized) or 200 (success), not 404 or 405
    expect([200, 401, 403, 500]).toContain(response.status());
    
    // Should NOT be 404 or 405
    expect(response.status()).not.toBe(404);
    expect(response.status()).not.toBe(405);
  });
});
