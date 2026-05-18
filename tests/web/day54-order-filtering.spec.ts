import { test, expect } from '@playwright/test';

/**
 * FR-156: Order status filtering with counts on dashboard
 * 
 * Tests:
 * 1. Dashboard shows filter tabs: All, Pending, Paid, Shipped, Cancelled
 * 2. Each tab displays count of orders in that status
 * 3. Clicking a tab filters the order list
 * 4. Default view shows all orders
 * 5. Filter persists when navigating back from order detail
 */

test.describe('FR-156: Order Status Filtering', () => {
  const baseURL = 'https://www.soloshopbox.com';
  
  test.beforeEach(async ({ page }) => {
    // Login as seller
    await page.goto(`${baseURL}/auth/login`);
    await page.fill('input[name="email"]', 'test@example.com');
    await page.click('button[type="submit"]');
    // Assume auth completes
  });
  
  test('should display order status filter tabs with counts', async ({ page }) => {
    await page.goto(`${baseURL}/dashboard/orders`);
    
    // Check all filter tabs exist
    const allTab = page.locator('button:has-text("All")');
    const pendingTab = page.locator('button:has-text("Pending")');
    const paidTab = page.locator('button:has-text("Paid")');
    const shippedTab = page.locator('button:has-text("Shipped")');
    const cancelledTab = page.locator('button:has-text("Cancelled")');
    
    await expect(allTab).toBeVisible();
    await expect(pendingTab).toBeVisible();
    await expect(paidTab).toBeVisible();
    await expect(shippedTab).toBeVisible();
    await expect(cancelledTab).toBeVisible();
    
    // Each tab should show a count (e.g. "Pending (3)")
    await expect(page.locator('button', { hasText: /All.*\(\d+\)/ })).toBeVisible();
    await expect(page.locator('button', { hasText: /Pending.*\(\d+\)/ })).toBeVisible();
  });
  
  test('should filter orders when clicking status tabs', async ({ page }) => {
    await page.goto(`${baseURL}/dashboard/orders`);
    
    // Click "Paid" tab
    await page.click('button:has-text("Paid")');
    
    // All visible orders should have "Paid" status
    const orderRows = page.locator('[data-testid="order-row"]');
    const count = await orderRows.count();
    
    for (let i = 0; i < count; i++) {
      const statusBadge = orderRows.nth(i).locator('[data-testid="order-status"]');
      await expect(statusBadge).toHaveText('Paid');
    }
  });
  
  test('should show all orders by default', async ({ page }) => {
    await page.goto(`${baseURL}/dashboard/orders`);
    
    // "All" tab should be active
    const allTab = page.locator('button:has-text("All")');
    await expect(allTab).toHaveClass(/active|selected|bg-emerald/);
    
    // Order list should contain multiple statuses
    const orderStatuses = await page.locator('[data-testid="order-status"]').allTextContents();
    const uniqueStatuses = new Set(orderStatuses);
    expect(uniqueStatuses.size).toBeGreaterThan(1); // More than one status visible
  });
  
  test('should preserve filter when navigating back from order detail', async ({ page }) => {
    await page.goto(`${baseURL}/dashboard/orders`);
    
    // Click "Shipped" tab
    await page.click('button:has-text("Shipped")');
    await page.waitForTimeout(500);
    
    // Click on first order
    await page.click('[data-testid="order-row"]:first-child');
    
    // Navigate back
    await page.goBack();
    
    // "Shipped" filter should still be active
    const shippedTab = page.locator('button:has-text("Shipped")');
    await expect(shippedTab).toHaveClass(/active|selected|bg-emerald/);
  });
  
  test('should update counts when order status changes', async ({ page }) => {
    await page.goto(`${baseURL}/dashboard/orders`);
    
    // Get initial "Pending" count
    const pendingTabBefore = await page.locator('button:has-text("Pending")').textContent();
    const pendingCountBefore = parseInt(pendingTabBefore?.match(/\((\d+)\)/)?.[1] || '0');
    
    // Click on a pending order and mark as paid
    await page.click('button:has-text("Pending")');
    await page.click('[data-testid="order-row"]:first-child');
    await page.click('button:has-text("Mark as Paid")');
    
    // Navigate back to orders page
    await page.goto(`${baseURL}/dashboard/orders`);
    
    // Check updated counts
    const pendingTabAfter = await page.locator('button:has-text("Pending")').textContent();
    const pendingCountAfter = parseInt(pendingTabAfter?.match(/\((\d+)\)/)?.[1] || '0');
    
    expect(pendingCountAfter).toBe(pendingCountBefore - 1);
  });
  
  test('should show empty state when filtered status has no orders', async ({ page }) => {
    await page.goto(`${baseURL}/dashboard/orders`);
    
    // Click "Cancelled" tab (assuming no cancelled orders exist)
    await page.click('button:has-text("Cancelled (0)")');
    
    // Should show empty state message
    const emptyMessage = page.locator('text=/no.*cancelled orders|no orders found/i');
    await expect(emptyMessage).toBeVisible();
  });
});
