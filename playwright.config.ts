import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Solo Shop Builder
 * Day 18 — Added to resolve test-results permission issues in Docker
 */

export default defineConfig({
  testDir: './tests/web',
  
  // Don't clean output directory (causes permission issues in Docker)
  preserveOutput: 'always',
  
  // Timeout for each test
  timeout: 30 * 1000,
  
  // Expect timeout
  expect: {
    timeout: 5000,
  },
  
  // Run tests in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter
  reporter: process.env.CI ? 'github' : 'list',
  
  // Shared settings
  use: {
    // Base URL for tests
    baseURL: 'http://localhost:3000',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Output directory for test artifacts (screenshots, traces, etc.)
  outputDir: '/tmp/playwright-test-results',
});
