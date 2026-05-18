import { test, expect } from '@playwright/test';

/**
 * FR-157: Dashboard summary metrics (products + revenue)
 * FR-158: Smart order list defaults + summary metrics
 * 
 * Tests:
 * 1. Dashboard displays total product count
 * 2. Dashboard displays total revenue
 * 3. Dashboard displays order count by status
 * 4. API endpoint returns correct analytics data
 * 5. Orders page shows summary metrics at top
 * 6. Orders default sort is newest first
 */

test.describe('FR-157 & FR-158: Dashboard Metrics', () => {
  const baseURL = 'https://www.soloshopbox.com';
  
  test.beforeEach(async ({ page }) => {
    // Login as seller
    await page.goto(`${baseURL}/auth/login`);
    await page.fill('input[name="email"]', 'test@example.com');
    await page.click('button[type="submit"]');
  });
  
  test('should display total product count on dashboard', async ({ page }) => {
    await page.goto(`${baseURL}/dashboard`);
    
    // Look for product count metric card
    const productCard = page.locator('[data-testid="metric-products"]');
    await expect(productCard).toBeVisible();
    
    // Should show a number
    const productCount = await productCard.locator('[data-testid="metric-value"]').textContent();
    expect(productCount).toMatch(/\d+/);
  });
  
  test('should display total revenue on dashboard', async ({ page }) => {
    await page.goto(`${baseURL}/dashboard`);
    
    // Look for revenue metric card
    const revenueCard = page.locator('[data-testid="metric-revenue"]');
    await expect(revenueCard).toBeVisible();
    
    // Should show currency formatted value
    const revenue = await revenueCard.locator('[data-testid="metric-value"]').textContent();
    expect(revenue).toMatch(/\$[\d,]+(\.\d{2})?/);
  });
  
  test('should display order counts by status on dashboard', async ({ page }) => {
    await page.goto(`${baseURL}/dashboard`);
    
    // Check for order status breakdown
    const pendingOrders = page.locator('[data-testid="metric-orders-pending"]');
    const paidOrders = page.locator('[data-testid="metric-orders-paid"]');
    const shippedOrders = page.locator('[data-testid="metric-orders-shipped"]');
    
    await expect(pendingOrders).toBeVisible();
    await expect(paidOrders).toBeVisible();
    await expect(shippedOrders).toBeVisible();
  });
  
  test('API should return analytics data with product count and revenue', async ({ request }) => {
    // Assume seller is authenticated (session cookie)
    const response = await request.get(`${baseURL}/api/analytics`);
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    
    expect(data).toHaveProperty('productCount');
    expect(data).toHaveProperty('totalRevenue');
    expect(data).toHaveProperty('ordersByStatus');
    
    expect(typeof data.productCount).toBe('number');
    expect(typeof data.totalRevenue).toBe('number');
    expect(data.ordersByStatus).toHaveProperty('pending');
    expect(data.ordersByStatus).toHaveProperty('paid');
    expect(data.ordersByStatus).toHaveProperty('shipped');
  });
  
  test('orders page should show summary metrics at top', async ({ page }) => {
    await page.goto(`${baseURL}/dashboard/orders`);
    
    // Summary section at top of page
    const summarySection = page.locator('[data-testid="orders-summary"]');
    await expect(summarySection).toBeVisible();
    
    // Should show total orders count
    const totalOrders = summarySection.locator('text=/Total Orders.*\d+/i');
    await expect(totalOrders).toBeVisible();
    
    // Should show total value
    const totalValue = summarySection.locator('text=/Total Value.*\$/i');
    await expect(totalValue).toBeVisible();
  });
  
  test('orders list should default to newest first', async ({ page }) => {
    await page.goto(`${baseURL}/dashboard/orders`);
    
    // Get all order dates
    const orderDates = await page.locator('[data-testid="order-date"]').allTextContents();
    
    // Convert to timestamps and verify descending order
    const timestamps = orderDates.map(d => new Date(d).getTime());
    
    for (let i = 0; i < timestamps.length - 1; i++) {
      expect(timestamps[i]).toBeGreaterThanOrEqual(timestamps[i + 1]);
    }
  });
  
  test('dashboard should link to detailed analytics page', async ({ page }) => {
    await page.goto(`${baseURL}/dashboard`);
    
    // Click "View Analytics" or similar link
    const analyticsLink = page.locator('a[href*="/dashboard/analytics"]');
    await expect(analyticsLink).toBeVisible();
    
    await analyticsLink.click();
    await expect(page).toHaveURL(/\/dashboard\/analytics/);
  });
  
  test('product count should update when product is added', async ({ page }) => {
    // Get initial product count
    await page.goto(`${baseURL}/dashboard`);
    const initialCountText = await page.locator('[data-testid="metric-products"] [data-testid="metric-value"]').textContent();
    const initialCount = parseInt(initialCountText || '0');
    
    // Create new product
    await page.goto(`${baseURL}/dashboard/products/new`);
    await page.fill('input[name="title"]', 'New Metric Test Product');
    await page.fill('input[name="price"]', '15.00');
    await page.click('button[type="submit"]');
    
    // Go back to dashboard
    await page.goto(`${baseURL}/dashboard`);
    
    // Check updated count
    const newCountText = await page.locator('[data-testid="metric-products"] [data-testid="metric-value"]').textContent();
    const newCount = parseInt(newCountText || '0');
    
    expect(newCount).toBe(initialCount + 1);
  });
  
  test('revenue should update when order is marked paid', async ({ page }) => {
    // Get initial revenue
    await page.goto(`${baseURL}/dashboard`);
    const initialRevenueText = await page.locator('[data-testid="metric-revenue"] [data-testid="metric-value"]').textContent();
    const initialRevenue = parseFloat(initialRevenueText?.replace(/[$,]/g, '') || '0');
    
    // Go to orders and mark one as paid (assume there's a pending order)
    await page.goto(`${baseURL}/dashboard/orders`);
    await page.click('button:has-text("Pending")');
    
    // Get order total
    const orderTotal = await page.locator('[data-testid="order-row"]:first-child [data-testid="order-total"]').textContent();
    const orderValue = parseFloat(orderTotal?.replace(/[$,]/g, '') || '0');
    
    // Mark as paid
    await page.click('[data-testid="order-row"]:first-child');
    await page.click('button:has-text("Mark as Paid")');
    
    // Go back to dashboard
    await page.goto(`${baseURL}/dashboard`);
    
    // Check updated revenue
    const newRevenueText = await page.locator('[data-testid="metric-revenue"] [data-testid="metric-value"]').textContent();
    const newRevenue = parseFloat(newRevenueText?.replace(/[$,]/g, '') || '0');
    
    expect(newRevenue).toBeCloseTo(initialRevenue + orderValue, 2);
  });
});
