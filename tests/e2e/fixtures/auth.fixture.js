import { test as base } from '@playwright/test';

/**
 * Custom fixture for authenticated user
 * This extends the base test with authentication capabilities
 */
export const test = base.extend({
  /**
   * Authenticated page fixture
   * Automatically logs in before each test that uses this fixture
   */
  authenticatedPage: async ({ page }, use) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Get credentials from environment or use defaults
    const email = process.env.TEST_USER_EMAIL || 'test@example.com';
    const password = process.env.TEST_USER_PASSWORD || 'Test@123';
    
    // Fill in login form
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    
    // Click sign in button
    await page.click('button[type="submit"]');
    
    // Wait for navigation to dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    // Verify we're logged in by checking for dashboard content
    await page.waitForSelector('h1:has-text("Dashboard")', { timeout: 5000 });
    
    // Use the authenticated page
    await use(page);
  },

  /**
   * Admin user fixture
   * Logs in as an admin user with elevated permissions
   */
  adminPage: async ({ page }, use) => {
    await page.goto('/login');
    
    const email = process.env.TEST_ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.TEST_ADMIN_PASSWORD || 'Admin@123';
    
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await page.waitForSelector('h1:has-text("Dashboard")', { timeout: 5000 });
    
    await use(page);
  },
});

export { expect } from '@playwright/test';

