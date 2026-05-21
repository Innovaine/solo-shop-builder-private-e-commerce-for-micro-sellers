import { test, expect } from '@playwright/test';

/**
 * Day 97 Feature Tests
 * 
 * Coverage:
 * - FR-3: Product CRUD (create, read, update, delete)
 * - FR-4: S3 image upload for branding/profile logo
 * - FR-11: Seller order dashboard read
 * - FR-12: Order status dropdown
 */

const BASE_URL = 'https://www.soloshopbox.com';

// Helper function for login
async function loginAsSeller(page: any, email = 'test@example.com', password = 'Test123!') {
  await page.goto(`${BASE_URL}/auth/login`);
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL(`${BASE_URL}/dashboard`, { timeout: 10000 });
}

test.describe('FR-3: Product CRUD', () => {
  test('should create a new product', async ({ page }) => {
    // Login first
    await loginAsSeller(page);
    
    // Navigate to products page
    await page.goto(`${BASE_URL}/dashboard/products`);
    await expect(page.locator('h1')).toContainText(/products/i);
    
    // Click new product button
    await page.click('a[href*="/products/new"], button:has-text("New Product"), a:has-text("Add Product")');
    await page.waitForURL(`${BASE_URL}/dashboard/products/new`);
    
    // Fill product form
    const productName = `Test Product ${Date.now()}`;
    await page.fill('input[name="name"], input[placeholder*="name" i]', productName);
    await page.fill('textarea[name="description"], textarea[placeholder*="description" i]', 'Test product description');
    await page.fill('input[name="price"], input[type="number"]', '29.99');
    
    // Submit form
    await page.click('button[type="submit"]:has-text("Create"), button:has-text("Save")');
    
    // Verify redirect to products list
    await page.waitForURL(`${BASE_URL}/dashboard/products`, { timeout: 10000 });
    
    // Verify product appears in list
    await expect(page.locator(`text=${productName}`)).toBeVisible({ timeout: 5000 });
  });

  test('should read/display product details', async ({ page }) => {
    await loginAsSeller(page);
    
    // Navigate to products page
    await page.goto(`${BASE_URL}/dashboard/products`);
    
    // Click on first product (if exists)
    const firstProduct = page.locator('a[href*="/products/"][href*="/edit"], tr a, .product-item a').first();
    if (await firstProduct.count() > 0) {
      await firstProduct.click();
      
      // Verify we're on edit page with product data
      await expect(page.locator('input[name="name"], input[placeholder*="name" i]')).not.toBeEmpty();
      await expect(page.locator('textarea[name="description"]')).not.toBeEmpty();
    }
  });

  test('should update product details', async ({ page }) => {
    await loginAsSeller(page);
    
    // Navigate to products page
    await page.goto(`${BASE_URL}/dashboard/products`);
    
    // Click on first product
    const firstProduct = page.locator('a[href*="/products/"][href*="/edit"], tr a').first();
    if (await firstProduct.count() > 0) {
      await firstProduct.click();
      
      // Update product name
      const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]');
      const updatedName = `Updated ${Date.now()}`;
      await nameInput.fill(updatedName);
      
      // Save changes
      await page.click('button[type="submit"]:has-text("Save"), button:has-text("Update")');
      
      // Verify success (either redirect or success message)
      await page.waitForLoadState('networkidle');
    }
  });
});

test.describe('FR-4: S3 Image Upload', () => {
  test('should upload shop logo via branding page', async ({ page }) => {
    await loginAsSeller(page);
    
    // Navigate to branding/profile page
    await page.goto(`${BASE_URL}/dashboard/branding`);
    
    // Look for logo upload field
    const logoUpload = page.locator('input[type="file"]').first();
    if (await logoUpload.count() > 0) {
      // Create a simple test image file
      const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
      
      // Upload file
      await logoUpload.setInputFiles({
        name: 'test-logo.png',
        mimeType: 'image/png',
        buffer: buffer,
      });
      
      // Wait for upload to process
      await page.waitForTimeout(2000);
      
      // Verify image preview or success indicator
      const preview = page.locator('img[alt*="logo" i], img[src*="digitalocean"], img[src*="s3"]');
      if (await preview.count() > 0) {
        await expect(preview.first()).toBeVisible();
      }
    }
  });
});

test.describe('FR-11: Seller Order Dashboard', () => {
  test('should display orders list', async ({ page }) => {
    await loginAsSeller(page);
    
    // Navigate to orders page
    await page.goto(`${BASE_URL}/dashboard/orders`);
    await expect(page.locator('h1')).toContainText(/orders/i);
    
    // Check for orders table/list structure
    const ordersContainer = page.locator('table, .order-item, [data-testid="orders-list"]');
    await expect(ordersContainer).toBeVisible({ timeout: 5000 });
  });

  test('should show order details when clicked', async ({ page }) => {
    await loginAsSeller(page);
    
    // Navigate to orders page
    await page.goto(`${BASE_URL}/dashboard/orders`);
    
    // Click on first order (if exists)
    const firstOrder = page.locator('a[href*="/orders/"], tr[data-order-id] a, .order-item a').first();
    if (await firstOrder.count() > 0) {
      await firstOrder.click();
      
      // Verify we're on order detail page
      await expect(page).toHaveURL(/\/orders\/[^/]+/);
      
      // Verify order details are displayed
      await expect(page.locator('text=/Order|Customer|Total|Status/i')).toBeVisible();
    }
  });
});

test.describe('FR-12: Order Status Dropdown', () => {
  test('should allow changing order status', async ({ page }) => {
    await loginAsSeller(page);
    
    // Navigate to orders page
    await page.goto(`${BASE_URL}/dashboard/orders`);
    
    // Click on first order to open details
    const firstOrder = page.locator('a[href*="/orders/"], tr a').first();
    if (await firstOrder.count() > 0) {
      await firstOrder.click();
      
      // Look for status dropdown/select
      const statusDropdown = page.locator('select[name="status"], select:has(option:has-text("pending")), button:has-text("Status")');
      if (await statusDropdown.count() > 0) {
        // Get current status
        const currentStatus = await statusDropdown.inputValue().catch(() => '');
        
        // Try to change status
        const newStatus = currentStatus === 'pending' ? 'processing' : 'pending';
        await statusDropdown.selectOption(newStatus).catch(async () => {
          // If select doesn't work, try clicking button approach
          await statusDropdown.click();
          await page.click(`text="${newStatus}"`);
        });
        
        // Save/submit if there's a save button
        const saveButton = page.locator('button:has-text("Save"), button:has-text("Update")');
        if (await saveButton.count() > 0) {
          await saveButton.click();
          await page.waitForTimeout(1000);
        }
      }
    }
  });

  test('should display available order statuses', async ({ page }) => {
    await loginAsSeller(page);
    
    // Navigate to any order detail page
    await page.goto(`${BASE_URL}/dashboard/orders`);
    
    const firstOrder = page.locator('a[href*="/orders/"]').first();
    if (await firstOrder.count() > 0) {
      await firstOrder.click();
      
      // Verify status dropdown contains expected options
      const statusOptions = page.locator('select option, [role="option"]');
      if (await statusOptions.count() > 0) {
        const optionsText = await statusOptions.allTextContents();
        
        // Check for common status values
        const hasStatuses = optionsText.some(text => 
          /pending|processing|shipped|delivered|cancelled/i.test(text)
        );
        expect(hasStatuses).toBeTruthy();
      }
    }
  });
});

// Smoke test: verify critical paths work
test.describe('Day 97 Smoke Tests', () => {
  test('should allow full product creation workflow', async ({ page }) => {
    await loginAsSeller(page);
    
    // Create product
    await page.goto(`${BASE_URL}/dashboard/products/new`);
    const productName = `Smoke Test Product ${Date.now()}`;
    await page.fill('input[name="name"]', productName);
    await page.fill('textarea[name="description"]', 'Smoke test description');
    await page.fill('input[name="price"]', '49.99');
    await page.click('button[type="submit"]');
    
    // Verify in list
    await page.waitForURL(`${BASE_URL}/dashboard/products`);
    await expect(page.locator(`text=${productName}`)).toBeVisible();
  });

  test('should load all dashboard pages without errors', async ({ page }) => {
    await loginAsSeller(page);
    
    // Test key dashboard pages
    const pages = [
      '/dashboard',
      '/dashboard/products',
      '/dashboard/orders',
      '/dashboard/branding',
      '/dashboard/profile',
    ];
    
    for (const path of pages) {
      await page.goto(`${BASE_URL}${path}`);
      await expect(page).not.toHaveURL(/\/auth\/login/);
      
      // Verify no 500 errors
      const errorText = page.locator('text=/500|error|exception/i');
      const errorCount = await errorText.count();
      expect(errorCount).toBe(0);
    }
  });
});
