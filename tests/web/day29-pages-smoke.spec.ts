// Day 29 smoke tests - verify new pages exist and are accessible
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Day 29 — New Pages Smoke Test', () => {
  test('Profile page endpoint exists', async ({ page }) => {
    // Try to access the profile page - will redirect to login if not authenticated
    await page.goto(`${BASE_URL}/dashboard/profile`);
    
    // Should either show login page OR profile page (if session exists)
    await page.waitForLoadState('networkidle');
    const currentUrl = page.url();
    
    // Check we got SOME response (not 404/500)
    const pageContent = await page.content();
    expect(pageContent).not.toContain('404');
    expect(pageContent).not.toContain('500');
    
    // Either shows login (redirect) or profile page
    const hasLoginOrProfile = currentUrl.includes('/auth/login') || 
                             currentUrl.includes('/dashboard/profile') ||
                             await page.locator('h1').textContent().then(t => t?.includes('Profile') || t?.includes('Log in'));
    expect(hasLoginOrProfile).toBeTruthy();
  });

  test('Branding page endpoint exists', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/branding`);
    await page.waitForLoadState('networkidle');
    
    const pageContent = await page.content();
    expect(pageContent).not.toContain('404');
    expect(pageContent).not.toContain('500');
  });

  test('Email template page endpoint exists', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/email-template`);
    await page.waitForLoadState('networkidle');
    
    const pageContent = await page.content();
    expect(pageContent).not.toContain('404');
    expect(pageContent).not.toContain('500');
  });

  test('Billing page endpoint exists', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/billing`);
    await page.waitForLoadState('networkidle');
    
    const pageContent = await page.content();
    expect(pageContent).not.toContain('404');
    expect(pageContent).not.toContain('500');
  });

  test('Enhanced analytics page endpoint exists', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/analytics`);
    await page.waitForLoadState('networkidle');
    
    const pageContent = await page.content();
    expect(pageContent).not.toContain('404');
    expect(pageContent).not.toContain('500');
  });

  test('API endpoints respond without 500 errors', async ({ page }) => {
    // Test the new API endpoints return proper responses (even if 401/403 for unauth)
    
    // Profile API
    const profileResponse = await page.request.get(`${BASE_URL}/api/shops/profile`);
    expect(profileResponse.status()).not.toBe(500);
    expect(profileResponse.status()).not.toBe(404);
    
    // Branding API
    const brandingResponse = await page.request.get(`${BASE_URL}/api/shops/branding`);
    expect(brandingResponse.status()).not.toBe(500);
    expect(brandingResponse.status()).not.toBe(404);
    
    // Email template API
    const emailResponse = await page.request.get(`${BASE_URL}/api/shops/email-template`);
    expect(emailResponse.status()).not.toBe(500);
    expect(emailResponse.status()).not.toBe(404);
    
    // Billing API
    const billingResponse = await page.request.get(`${BASE_URL}/api/billing`);
    expect(billingResponse.status()).not.toBe(500);
    expect(billingResponse.status()).not.toBe(404);
    
    // Analytics API
    const analyticsResponse = await page.request.get(`${BASE_URL}/api/analytics`);
    expect(analyticsResponse.status()).not.toBe(500);
    expect(analyticsResponse.status()).not.toBe(404);
  });

  test('Health check still passes with new features', async ({ page }) => {
    const response = await page.request.get(`${BASE_URL}/api/health`);
    expect(response.ok()).toBeTruthy();
    
    const body = await response.json();
    expect(body.status).toBe('ok');
    expect(body.checks.database.status).toBe('ok');
  });
});
