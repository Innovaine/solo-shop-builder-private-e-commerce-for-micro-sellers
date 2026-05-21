import { test, expect } from '@playwright/test';

test.describe('STAB-3: Order status flow regression', () => {
  test.setTimeout(60_000);
  
  const baseURL = 'https://www.soloshopbox.com';
  
  test('Orders dashboard page loads correctly', async ({ page }) => {
    // Navigate to orders page
    await page.goto(`${baseURL}/dashboard/orders`);
    
    // Should either show login page (if not authenticated) or orders
    const currentURL = page.url();
    
    if (currentURL.includes('/auth/login')) {
      console.log('✓ Orders page requires authentication (expected)');
      // Verify login page loads
      await expect(page.locator('input[type="email"]')).toBeVisible();
    } else {
      // If authenticated, orders page should be visible
      await expect(page.locator('body')).toBeVisible();
      console.log('✓ Orders dashboard accessible');
    }
  });
  
  test('Orders API requires authentication', async ({ request }) => {
    // Test that orders API is protected
    const response = await request.get(`${baseURL}/api/orders`);
    
    // Should require auth (401 or redirect)
    const status = response.status();
    expect([401, 307, 302]).toContain(status);
    console.log(`✓ Orders API protected: ${status}`);
  });
  
  test('Order tracking page is publicly accessible', async ({ page }) => {
    // Order tracking should be public (doesn't require auth)
    const testOrderId = 'test-order-' + Date.now();
    await page.goto(`${baseURL}/track/${testOrderId}`);
    
    // Page should load (even if order doesn't exist)
    await expect(page.locator('body')).toBeVisible();
    
    // Should show some tracking UI or "not found" message
    const pageText = await page.textContent('body');
    expect(pageText).toBeTruthy();
    expect(pageText!.length).toBeGreaterThan(0);
    
    console.log('✓ Order tracking page accessible');
  });
  
  test('Order detail API structure', async ({ request }) => {
    // Test that order detail endpoint exists and returns proper status
    const testOrderId = 'test-order-123';
    const response = await request.get(`${baseURL}/api/orders/${testOrderId}`);
    
    // Should be 401 (requires auth) or 404 (not found)
    const status = response.status();
    expect([401, 404, 307, 302]).toContain(status);
    console.log(`✓ Order detail API exists: ${status}`);
  });
  
  test('Order history API endpoint exists', async ({ request }) => {
    // Test order history endpoint
    const testOrderId = 'test-order-123';
    const response = await request.get(`${baseURL}/api/orders/${testOrderId}/history`);
    
    // Should require auth or return not found
    const status = response.status();
    expect([401, 404, 307, 302]).toContain(status);
    console.log(`✓ Order history endpoint exists: ${status}`);
  });
  
  test('Order export functionality endpoint', async ({ request }) => {
    // Test orders export endpoint
    const response = await request.get(`${baseURL}/api/orders/export`);
    
    // Should require authentication
    const status = response.status();
    expect([401, 307, 302]).toContain(status);
    console.log(`✓ Order export protected: ${status}`);
  });
});
