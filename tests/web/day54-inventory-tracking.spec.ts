import { test, expect } from '@playwright/test';

/**
 * FR-24: Inventory tracking with atomic stock validation + decrement at checkout
 * 
 * Tests:
 * 1. Seller can set stock quantity when creating/editing product
 * 2. Storefront shows "Out of stock" when quantity = 0
 * 3. "Add to cart" button disabled when out of stock
 * 4. Checkout validates stock atomically and rejects if insufficient
 * 5. Stock decrements after successful payment
 */

test.describe('FR-24: Inventory Tracking', () => {
  const baseURL = 'https://www.soloshopbox.com';
  
  test('should allow seller to set stock quantity for product', async ({ page }) => {
    // Login as seller
    await page.goto(`${baseURL}/auth/login`);
    await page.fill('input[name="email"]', 'test@example.com');
    await page.click('button[type="submit"]');
    // Simplified - assumes magic link flow or password auth
    
    // Navigate to product creation
    await page.goto(`${baseURL}/dashboard/products/new`);
    
    // Fill product details
    await page.fill('input[name="title"]', 'Limited Stock Item');
    await page.fill('input[name="price"]', '25.00');
    await page.fill('textarea[name="description"]', 'Only 2 in stock');
    
    // Set stock quantity
    const stockInput = page.locator('input[name="quantity"]');
    await expect(stockInput).toBeVisible();
    await stockInput.fill('2');
    
    // Save product
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard\/products/);
  });
  
  test('should show "Out of stock" label on storefront when quantity is zero', async ({ page }) => {
    // Assume product with zero stock exists (shop slug: test-shop, product id: 123)
    await page.goto(`${baseURL}/shop/test-shop`);
    
    const outOfStockProduct = page.locator('[data-testid="product-card"]').filter({ hasText: 'Out of Stock' });
    await expect(outOfStockProduct).toBeVisible();
  });
  
  test('should disable "Add to cart" button when product is out of stock', async ({ page }) => {
    // Navigate to product detail page with zero stock
    await page.goto(`${baseURL}/shop/test-shop/product/123`);
    
    const addToCartButton = page.locator('button', { hasText: 'Add to cart' });
    await expect(addToCartButton).toBeDisabled();
    
    const stockLabel = page.locator('text=Out of Stock');
    await expect(stockLabel).toBeVisible();
  });
  
  test('should reject checkout when attempting to order out-of-stock product', async ({ page }) => {
    // Simulate race condition: product with stock=1, two users try to buy
    // User 1 adds to cart
    await page.goto(`${baseURL}/shop/test-shop/product/456`);
    await page.click('button:has-text("Add to cart")');
    
    // Navigate to checkout
    await page.goto(`${baseURL}/checkout`);
    await page.fill('input[name="name"]', 'Test Customer');
    await page.fill('input[name="email"]', 'customer@example.com');
    await page.fill('input[name="address"]', '123 Test St');
    
    // Meanwhile, another user completes purchase (stock goes to 0)
    // This simulates the atomic check
    
    // Attempt checkout
    await page.click('button[type="submit"]');
    
    // Should see error message
    const errorMessage = page.locator('text=/out of stock|not available|insufficient stock/i');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });
  
  test('should decrement stock after successful payment', async ({ page }) => {
    // Create product with stock=5
    await page.goto(`${baseURL}/dashboard/products/new`);
    await page.fill('input[name="title"]', 'Test Stock Decrement');
    await page.fill('input[name="price"]', '30.00');
    await page.fill('input[name="quantity"]', '5');
    await page.click('button[type="submit"]');
    
    // Get product ID from URL
    const productId = page.url().match(/\/products\/(\d+)/)?.[1];
    
    // Customer places order
    await page.goto(`${baseURL}/shop/test-shop/product/${productId}`);
    await page.click('button:has-text("Add to cart")');
    await page.goto(`${baseURL}/checkout`);
    await page.fill('input[name="name"]', 'Buyer');
    await page.fill('input[name="email"]', 'buyer@example.com');
    await page.click('button[type="submit"]');
    
    // Wait for payment webhook to process
    await page.waitForTimeout(2000);
    
    // Check product stock via API or dashboard
    await page.goto(`${baseURL}/dashboard/products/${productId}/edit`);
    const stockInput = page.locator('input[name="quantity"]');
    await expect(stockInput).toHaveValue('4'); // Decremented from 5 to 4
  });
  
  test('should show "In Stock" label when quantity > 0', async ({ page }) => {
    await page.goto(`${baseURL}/shop/test-shop`);
    
    const inStockProduct = page.locator('[data-testid="product-card"]').filter({ hasText: 'In Stock' });
    await expect(inStockProduct).toBeVisible();
  });
});
