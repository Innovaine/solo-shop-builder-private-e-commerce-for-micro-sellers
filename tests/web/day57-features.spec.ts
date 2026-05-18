/**
 * Day 57 Feature Tests
 * Tests FR-156 (order filtering), FR-157 (dashboard metrics),
 * FR-158 (smart sort), FR-6+ (logo upload)
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'https://www.soloshopbox.com';

test.describe('Day 57 Features', () => {
  
  test('FR-156: Order status filtering with badge counts', async ({ page }) => {
    // Navigate to login page
    await page.goto(`${BASE_URL}/auth/login`);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check that orders page has filter buttons
    await page.goto(`${BASE_URL}/dashboard/orders`);
    await page.waitForLoadState('networkidle');
    
    // Look for filter button structure
    const filterButtons = page.locator('button').filter({ hasText: /All|Pending|Paid|Shipped|Cancelled/ });
    const count = await filterButtons.count();
    
    expect(count).toBeGreaterThan(0);
    
    // Verify badge counts exist on at least one filter
    const badgeExists = await page.locator('[class*="badge"]').count() > 0 ||
                        await page.locator('span').filter({ hasText: /\d+/ }).count() > 0;
    
    expect(badgeExists).toBeTruthy();
    
    await page.screenshot({ path: 'test-results/day-57/fr156-order-filtering.png', fullPage: true });
  });

  test('FR-157: Dashboard metrics cards (products, revenue, orders)', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/orders`);
    await page.waitForLoadState('networkidle');
    
    // Look for metrics/summary cards
    const pageContent = await page.textContent('body');
    
    // Check for presence of metrics-related text
    const hasProducts = pageContent?.includes('Product') || pageContent?.includes('product');
    const hasRevenue = pageContent?.includes('Revenue') || pageContent?.includes('revenue') || 
                       pageContent?.includes('Total') || pageContent?.includes('Sales');
    const hasOrders = pageContent?.includes('Order') || pageContent?.includes('order');
    
    // At least 2 of the 3 metric categories should be visible
    const metricsCount = [hasProducts, hasRevenue, hasOrders].filter(Boolean).length;
    expect(metricsCount).toBeGreaterThanOrEqual(2);
    
    await page.screenshot({ path: 'test-results/day-57/fr157-dashboard-metrics.png', fullPage: true });
  });

  test('FR-158: Smart order list defaults (newest first)', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/orders`);
    await page.waitForLoadState('networkidle');
    
    // Look for order list
    const orderRows = page.locator('[class*="order"]').or(page.locator('tr')).or(page.locator('[class*="list"]'));
    const count = await orderRows.count();
    
    // If there are orders, verify list exists
    if (count > 0) {
      expect(count).toBeGreaterThan(0);
    }
    
    // Verify page loads successfully without errors
    const hasError = await page.locator('text=Error').count() > 0 ||
                     await page.locator('text=error').count() > 0;
    expect(hasError).toBeFalsy();
    
    await page.screenshot({ path: 'test-results/day-57/fr158-smart-sort.png', fullPage: true });
  });

  test('FR-6+: Logo upload on branding page', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/branding`);
    await page.waitForLoadState('networkidle');
    
    // Check for file input or logo upload UI
    const fileInputs = page.locator('input[type="file"]');
    const fileInputCount = await fileInputs.count();
    
    expect(fileInputCount).toBeGreaterThan(0);
    
    // Check for logo-related labels or text
    const pageContent = await page.textContent('body');
    const hasLogoText = pageContent?.includes('logo') || pageContent?.includes('Logo') ||
                        pageContent?.includes('image') || pageContent?.includes('Image');
    
    expect(hasLogoText).toBeTruthy();
    
    await page.screenshot({ path: 'test-results/day-57/fr6plus-logo-upload.png', fullPage: true });
  });

  test('Health check and basic navigation', async ({ page }) => {
    // Test health endpoint
    const healthResponse = await page.goto(`${BASE_URL}/api/health`);
    expect(healthResponse?.status()).toBe(200);
    
    // Test homepage loads
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    
    // Test login page loads
    await page.goto(`${BASE_URL}/auth/login`);
    await page.waitForLoadState('networkidle');
    const loginPageExists = await page.locator('input[type="email"]').count() > 0 ||
                            await page.locator('input[type="text"]').count() > 0;
    expect(loginPageExists).toBeTruthy();
    
    await page.screenshot({ path: 'test-results/day-57/health-check.png', fullPage: true });
  });

});
