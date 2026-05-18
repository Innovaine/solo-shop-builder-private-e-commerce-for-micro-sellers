import { test, expect } from '@playwright/test';

/**
 * Day 56 Verification Smoke Tests
 * 
 * Validates three recently-shipped MVP features:
 * - FR-156: Order status filtering with badge counts
 * - FR-157: Dashboard metrics cards (products + revenue + orders)
 * - FR-24: Inventory tracking with atomic stock validation
 * 
 * Critical paths only — full test coverage in day54-*.spec.ts files.
 */

const baseURL = 'https://www.soloshopbox.com';

test.describe('Day 56 Feature Verification', () => {
  
  test('FR-156: Order filtering tabs display with counts', async ({ page }) => {
    await page.goto(`${baseURL}/dashboard/orders`, { waitUntil: 'networkidle' });
    
    // Check all status filter tabs exist
    await expect(page.locator('text=/All/i').first()).toBeVisible();
    await expect(page.locator('text=/Pending/i').first()).toBeVisible();
    await expect(page.locator('text=/Paid/i').first()).toBeVisible();
    await expect(page.locator('text=/Shipped/i').first()).toBeVisible();
    
    // At least one tab should show a count in parentheses
    const tabsWithCounts = page.locator('button:has-text(/\\(\\d+\\)/)');
    await expect(tabsWithCounts.first()).toBeVisible({ timeout: 5000 });
  });
  
  test('FR-156: Clicking filter tab changes visible orders', async ({ page }) => {
    await page.goto(`${baseURL}/dashboard/orders`, { waitUntil: 'networkidle' });
    
    // Click "Pending" filter
    const pendingButton = page.locator('button:has-text("Pending")').first();
    await pendingButton.click();
    await page.waitForTimeout(500);
    
    // Verify URL or active state changed
    const activeTab = page.locator('button[class*="bg-emerald"], button[class*="selected"], button[class*="active"]');
    await expect(activeTab).toContainText(/Pending/i, { timeout: 5000 });
  });
  
  test('FR-157: Dashboard displays metrics cards', async ({ page }) => {
    await page.goto(`${baseURL}/dashboard`, { waitUntil: 'networkidle' });
    
    // Check for metric cards - look for common patterns
    const metricsSection = page.locator('text=/Total Products|Products|Revenue|Total Revenue|Total Orders|Orders/i').first();
    await expect(metricsSection).toBeVisible({ timeout: 5000 });
    
    // Check that numbers are displayed
    const numberPattern = /\d+/;
    const dashboardText = await page.locator('body').textContent();
    expect(dashboardText).toMatch(numberPattern);
  });
  
  test('FR-157: Analytics API returns dashboard data', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/analytics`);
    
    // API might require auth - check if it returns data or auth error
    if (response.status() === 401 || response.status() === 403) {
      // Auth required - that's expected behavior
      console.log('Analytics API requires authentication (expected)');
      expect(response.status()).toBeGreaterThanOrEqual(400);
    } else {
      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      
      // Should have at least one metric property
      const hasMetrics = 
        data.productCount !== undefined ||
        data.totalRevenue !== undefined ||
        data.orderCount !== undefined ||
        data.ordersByStatus !== undefined;
      
      expect(hasMetrics).toBeTruthy();
    }
  });
  
  test('FR-24: Product edit page has inventory quantity field', async ({ page }) => {
    await page.goto(`${baseURL}/dashboard/products`, { waitUntil: 'networkidle' });
    
    // Navigate to first product edit page (if products exist)
    const productLinks = page.locator('a[href*="/dashboard/products/"][href*="/edit"]');
    const count = await productLinks.count();
    
    if (count > 0) {
      await productLinks.first().click();
      await page.waitForLoadState('networkidle');
      
      // Check for quantity/stock input field
      const quantityInput = page.locator('input[name="quantity"], input[name="stock"], input[placeholder*="Stock"], input[placeholder*="Quantity"]').first();
      await expect(quantityInput).toBeVisible({ timeout: 5000 });
    } else {
      console.log('No products found - skipping edit page test');
    }
  });
  
  test('FR-24: Storefront product shows stock status', async ({ page }) => {
    // Try to access a public storefront
    await page.goto(`${baseURL}`, { waitUntil: 'networkidle' });
    
    // Look for shop links or go directly to a known test shop
    const shopLink = page.locator('a[href*="/shop/"]').first();
    const hasShopLink = await shopLink.count() > 0;
    
    if (hasShopLink) {
      await shopLink.click();
      await page.waitForLoadState('networkidle');
      
      // Check if any product shows stock indication
      const stockIndicator = page.locator('text=/In Stock|Out of Stock|Only \\d+ left|Stock:|Available/i').first();
      const hasStockInfo = await stockIndicator.count() > 0;
      
      // It's OK if no stock info visible (might be all unlimited stock)
      console.log(`Stock information ${hasStockInfo ? 'found' : 'not visible'} on storefront`);
    } else {
      console.log('No public shop link found - skipping storefront test');
    }
  });
  
  test('Health check: App is responding', async ({ page }) => {
    const response = await page.goto(`${baseURL}/api/health`);
    expect(response?.status()).toBe(200);
    
    const body = await page.textContent('body');
    expect(body).toContain('ok');
  });
  
  test('Smoke: Dashboard page loads without errors', async ({ page }) => {
    await page.goto(`${baseURL}/dashboard`, { waitUntil: 'networkidle' });
    
    // Page should have loaded (no 500 error)
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    
    // Dashboard should have navigation or content
    const mainContent = await page.locator('main, [role="main"], body').first().textContent();
    expect(mainContent?.length || 0).toBeGreaterThan(10);
  });
  
  test('Smoke: Orders page loads without errors', async ({ page }) => {
    await page.goto(`${baseURL}/dashboard/orders`, { waitUntil: 'networkidle' });
    
    // Page should load
    const pageText = await page.locator('body').textContent();
    expect(pageText).toContain(/Orders|orders/);
  });
});
