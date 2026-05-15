import { test, expect } from '@playwright/test';

/**
 * Day 13 Scaling Features Test Suite
 * 
 * Tests the following Day 13 improvements:
 * 1. ErrorBoundary component for graceful React error handling
 * 2. Enhanced middleware with request ID tracking + CORS configuration
 * 3. Comprehensive health check endpoint validating DB and SMTP connectivity
 * 4. Structured error handling library with error codes
 * 5. Timeout utilities for API routes (30s default)
 * 6. Deployment documentation (manual verification - not tested here)
 */

const BASE_URL = 'http://localhost:3000';

test.describe('Day 13 Scaling Features', () => {
  
  test('Health check endpoint validates all services', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/health`);
    expect(response.ok()).toBeTruthy();
    
    const body = await response.json();
    
    // Verify top-level fields
    expect(body.status).toBe('ok');
    expect(body.timestamp).toBeDefined();
    expect(body.responseTime).toBeDefined();
    expect(body.checks).toBeDefined();
    
    // Verify database check
    expect(body.checks.database).toBeDefined();
    expect(body.checks.database.status).toBe('ok');
    expect(body.checks.database.responseTime).toBeDefined();
    
    // Verify email service check
    expect(body.checks.email).toBeDefined();
    expect(body.checks.email.status).toBe('ok');
    expect(body.checks.email.responseTime).toBeDefined();
    
    // Verify response time is reasonable (< 1s)
    const responseTimeMs = parseInt(body.responseTime.replace('ms', ''));
    expect(responseTimeMs).toBeLessThan(1000);
  });

  test('Request ID middleware adds X-Request-Id to API responses', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/health`);
    
    const headers = response.headers();
    expect(headers['x-request-id']).toBeDefined();
    
    // Request ID should be a base64url string (12 chars)
    const requestId = headers['x-request-id'];
    expect(requestId).toMatch(/^[A-Za-z0-9_-]{12}$/);
  });

  test('CORS headers configured correctly on API routes', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/health`);
    
    const headers = response.headers();
    expect(headers['access-control-allow-origin']).toBe('*');
    expect(headers['access-control-allow-methods']).toContain('GET');
    expect(headers['access-control-allow-methods']).toContain('POST');
    expect(headers['access-control-allow-headers']).toContain('Content-Type');
    expect(headers['access-control-allow-headers']).toContain('Authorization');
  });

  test('Request ID persists across multiple requests (unique per request)', async ({ request }) => {
    const response1 = await request.get(`${BASE_URL}/api/health`);
    const response2 = await request.get(`${BASE_URL}/api/health`);
    
    const requestId1 = response1.headers()['x-request-id'];
    const requestId2 = response2.headers()['x-request-id'];
    
    expect(requestId1).toBeDefined();
    expect(requestId2).toBeDefined();
    expect(requestId1).not.toBe(requestId2); // Each request gets unique ID
  });

  test('Health check performance meets NFR (<500ms p95)', async ({ request }) => {
    const measurements = [];
    
    // Run 10 health checks to get p95 metric
    for (let i = 0; i < 10; i++) {
      const start = Date.now();
      const response = await request.get(`${BASE_URL}/api/health`);
      const duration = Date.now() - start;
      
      expect(response.ok()).toBeTruthy();
      measurements.push(duration);
    }
    
    // Calculate p95 (95th percentile)
    measurements.sort((a, b) => a - b);
    const p95Index = Math.ceil(measurements.length * 0.95) - 1;
    const p95 = measurements[p95Index];
    
    // Log for debugging
    console.log(`Health check p95: ${p95}ms (measurements: ${measurements.join(', ')})`);
    
    // NFR-2: API response time < 500ms p95
    expect(p95).toBeLessThan(500);
  });

  test('Error responses include request ID for debugging', async ({ request }) => {
    // Try to create a shop without authentication (should fail)
    const response = await request.post(`${BASE_URL}/api/shops`, {
      data: {
        name: 'Test Shop',
        slug: 'test-shop'
      }
    });
    
    // Should fail (no auth)
    expect(response.status()).toBe(401);
    
    // But should still have request ID for debugging
    const headers = response.headers();
    expect(headers['x-request-id']).toBeDefined();
    expect(headers['x-request-id']).toMatch(/^[A-Za-z0-9_-]{12}$/);
  });

  test('Protected routes redirect with proper headers', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/dashboard`);
    
    // Should redirect to login
    expect(response.status()).toBe(307);
    expect(response.headers()['location']).toBe('/auth/login');
  });

  test('Login page loads successfully', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/login`);
    
    // Check page loaded
    await expect(page).toHaveTitle(/Solo Shop Builder/);
    
    // Check form elements exist
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // No console errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(1000);
    expect(errors).toHaveLength(0);
  });

  test('Homepage loads without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto(`${BASE_URL}/`);
    
    // Check page loaded
    await expect(page).toHaveTitle(/Solo Shop Builder/);
    
    // Check no React errors
    await page.waitForTimeout(1000);
    expect(errors).toHaveLength(0);
  });

  test('Rate limiting still functional after Day 13 changes', async ({ request }) => {
    // Day 12 feature - verify it still works after Day 13 middleware changes
    const responses = [];
    
    // Make 6 rapid signup attempts
    for (let i = 0; i < 6; i++) {
      const response = await request.post(`${BASE_URL}/api/auth/signup`, {
        data: { email: `test${i}@example.com` }
      });
      responses.push({
        status: response.status(),
        requestId: response.headers()['x-request-id']
      });
    }
    
    // At least one should be rate limited (429)
    const rateLimited = responses.filter(r => r.status === 429);
    expect(rateLimited.length).toBeGreaterThan(0);
    
    // All responses should have request IDs (including rate limited ones)
    responses.forEach(r => {
      expect(r.requestId).toBeDefined();
    });
  });
});
