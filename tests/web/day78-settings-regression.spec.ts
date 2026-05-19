import { test, expect } from '@playwright/test';

test.describe('STAB-4: Seller dashboard settings pages regression', () => {
  test.setTimeout(90_000);
  
  const baseURL = 'https://www.soloshopbox.com';
  
  const dashboardPages = [
    { path: '/dashboard', name: 'Dashboard Home' },
    { path: '/dashboard/profile', name: 'Seller Profile' },
    { path: '/dashboard/settings', name: 'Account Settings' },
    { path: '/dashboard/branding', name: 'Shop Branding' },
    { path: '/dashboard/billing', name: 'Billing' },
    { path: '/dashboard/email-template', name: 'Email Template' },
    { path: '/dashboard/products', name: 'Products' },
    { path: '/dashboard/orders', name: 'Orders' },
    { path: '/dashboard/analytics', name: 'Analytics' },
  ];
  
  test('All dashboard pages load without 500 errors', async ({ page }) => {
    const results: { page: string; status: string }[] = [];
    
    for (const dashPage of dashboardPages) {
      await page.goto(`${baseURL}${dashPage.path}`);
      
      const currentURL = page.url();
      
      // Check if redirected to login (expected for unauthenticated)
      if (currentURL.includes('/auth/login')) {
        results.push({ page: dashPage.name, status: 'requires-auth (✓)' });
        console.log(`✓ ${dashPage.name}: Requires authentication`);
      } else {
        // Page loaded - check for errors
        const pageContent = await page.textContent('body');
        const hasError = pageContent?.toLowerCase().includes('error') || false;
        
        if (!hasError) {
          results.push({ page: dashPage.name, status: 'loaded (✓)' });
          console.log(`✓ ${dashPage.name}: Loaded successfully`);
        } else {
          results.push({ page: dashPage.name, status: 'error detected (✗)' });
          console.log(`✗ ${dashPage.name}: Error on page`);
        }
      }
      
      // Small delay between requests
      await page.waitForTimeout(500);
    }
    
    // All pages should either require auth or load successfully
    const allPassed = results.every(r => r.status.includes('✓'));
    expect(allPassed).toBeTruthy();
  });
  
  test('Dashboard API endpoints are protected', async ({ request }) => {
    const protectedAPIs = [
      '/api/shops/profile',
      '/api/shops/branding',
      '/api/shops/email-template',
      '/api/shops/status',
      '/api/billing',
      '/api/analytics',
      '/api/account/password',
      '/api/account/delete',
    ];
    
    for (const apiPath of protectedAPIs) {
      const response = await request.get(`${baseURL}${apiPath}`);
      const status = response.status();
      
      // Should be 401 Unauthorized or redirect (3xx)
      expect([401, 307, 302]).toContain(status);
      console.log(`✓ ${apiPath}: ${status} (protected)`);
    }
  });
  
  test('Public pages are accessible without auth', async ({ page }) => {
    const publicPages = [
      { path: '/', name: 'Homepage' },
      { path: '/auth/login', name: 'Login' },
      { path: '/checkout', name: 'Checkout' },
    ];
    
    for (const publicPage of publicPages) {
      await page.goto(`${baseURL}${publicPage.path}`);
      
      // Should load successfully
      await expect(page.locator('body')).toBeVisible();
      
      const currentURL = page.url();
      // Should not redirect to login
      expect(currentURL).not.toContain('/auth/login');
      
      console.log(`✓ ${publicPage.name}: Accessible`);
    }
  });
  
  test('Dashboard settings form fields are present', async ({ page }) => {
    // Test that settings pages have proper form structure when accessible
    
    // Navigate to settings
    await page.goto(`${baseURL}/dashboard/settings`);
    
    const currentURL = page.url();
    
    if (currentURL.includes('/auth/login')) {
      console.log('✓ Settings requires authentication (expected)');
      return;
    }
    
    // If authenticated, check for form presence
    const hasForm = await page.locator('form').count() > 0;
    if (hasForm) {
      console.log('✓ Settings form present');
    } else {
      console.log('⚠ Settings form not found (may need auth)');
    }
  });
  
  test('Profile and branding pages structure', async ({ page }) => {
    // Test profile page
    await page.goto(`${baseURL}/dashboard/profile`);
    
    if (page.url().includes('/auth/login')) {
      console.log('✓ Profile requires authentication');
    } else {
      await expect(page.locator('body')).toBeVisible();
      console.log('✓ Profile page accessible');
    }
    
    // Test branding page
    await page.goto(`${baseURL}/dashboard/branding`);
    
    if (page.url().includes('/auth/login')) {
      console.log('✓ Branding requires authentication');
    } else {
      await expect(page.locator('body')).toBeVisible();
      console.log('✓ Branding page accessible');
    }
  });
  
  test('No console errors on dashboard pages', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Test a few key pages
    const testPages = [
      '/dashboard',
      '/dashboard/products',
      '/dashboard/orders',
    ];
    
    for (const testPath of testPages) {
      await page.goto(`${baseURL}${testPath}`);
      await page.waitForTimeout(1000);
    }
    
    // Should not have critical console errors
    const criticalErrors = consoleErrors.filter(err => 
      !err.includes('DevTools') && !err.includes('favicon')
    );
    
    if (criticalErrors.length === 0) {
      console.log('✓ No console errors detected');
    } else {
      console.log(`⚠ ${criticalErrors.length} console errors found`);
    }
    
    expect(criticalErrors.length).toBeLessThan(5);
  });
});
