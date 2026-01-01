import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login.page.js';
import { DashboardPage } from './pages/dashboard.page.js';
import { TEST_CREDENTIALS, generateRegistrationData } from './utils/test-data.js';

test.describe('Authentication Flow', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
  });

  test.describe('Login', () => {
    test('should display login page correctly', async ({ page }) => {
      await loginPage.goto();
      
      await expect(page).toHaveTitle(/Skills Management/i);
      await expect(page.locator(loginPage.heading)).toBeVisible();
      await expect(page.locator(loginPage.emailInput)).toBeVisible();
      await expect(page.locator(loginPage.passwordInput)).toBeVisible();
      await expect(page.locator(loginPage.signInButton)).toBeVisible();
      await expect(page.locator(loginPage.signUpLink)).toBeVisible();
    });

    test('should login successfully with valid credentials', async ({ page }) => {
      await loginPage.goto();
      await loginPage.login(
        TEST_CREDENTIALS.validUser.email,
        TEST_CREDENTIALS.validUser.password
      );

      await page.waitForURL('**/dashboard', { timeout: 10000 });
      await expect(page.locator(dashboardPage.heading)).toBeVisible();
    });

    test('should show error with invalid credentials', async ({ page }) => {
      await loginPage.goto();
      await loginPage.login(
        TEST_CREDENTIALS.invalidUser.email,
        TEST_CREDENTIALS.invalidUser.password
      );

      await page.waitForTimeout(2000);
      const currentUrl = page.url();
      expect(currentUrl).toContain('/login');
      
      const errorVisible = await page.locator('text=/Login failed|Invalid credentials|error/i').isVisible()
        .catch(() => false);
      expect(errorVisible).toBeTruthy();
    });

    test('should show validation errors for empty fields', async ({ page }) => {
      await loginPage.goto();
      
      await page.click(loginPage.signInButton);
      
      await page.waitForTimeout(500);
      
      const isOnLogin = await loginPage.isOnLoginPage();
      expect(isOnLogin).toBeTruthy();
    });

    test('should navigate to registration page', async ({ page }) => {
      await loginPage.goto();
      await loginPage.goToSignUp();
      
      await expect(page).toHaveURL(/.*register/);
      await expect(page.locator('h2:has-text(/Sign Up|Register/i)')).toBeVisible();
    });
  });

  test.describe('Logout', () => {
    test('should logout successfully', async ({ page }) => {
      await loginPage.goto();
      await loginPage.login(
        TEST_CREDENTIALS.validUser.email,
        TEST_CREDENTIALS.validUser.password
      );
      await page.waitForURL('**/dashboard');

      const logoutButton = page.locator('button:has-text(/Logout|Sign out/i)').first();
      const isVisible = await logoutButton.isVisible().catch(() => false);
      
      if (isVisible) {
        await logoutButton.click();
      } else {
        const userMenu = page.locator('[data-testid="user-menu"], button:has-text("Profile")').first();
        const menuVisible = await userMenu.isVisible().catch(() => false);
        if (menuVisible) {
          await userMenu.click();
          await page.waitForTimeout(300);
          await page.locator('button:has-text(/Logout|Sign out/i)').first().click();
        }
      }

      await page.waitForURL('**/login', { timeout: 5000 });
      await expect(page.locator(loginPage.heading)).toBeVisible();
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect to login when accessing protected route without auth', async ({ page }) => {
      await page.goto('/dashboard');
      
      await page.waitForURL('**/login', { timeout: 5000 });
      await expect(page.locator(loginPage.heading)).toBeVisible();
    });

    test('should redirect to login when accessing personnel page without auth', async ({ page }) => {
      await page.goto('/personnel');
      await page.waitForURL('**/login', { timeout: 5000 });
      await expect(page.locator(loginPage.heading)).toBeVisible();
    });

    test('should redirect to login when accessing projects page without auth', async ({ page }) => {
      await page.goto('/projects');
      await page.waitForURL('**/login', { timeout: 5000 });
      await expect(page.locator(loginPage.heading)).toBeVisible();
    });
  });

  test.describe('Session Persistence', () => {
    test('should maintain session after page reload', async ({ page }) => {
      await loginPage.goto();
      await loginPage.login(
        TEST_CREDENTIALS.validUser.email,
        TEST_CREDENTIALS.validUser.password
      );
      await page.waitForURL('**/dashboard');

      await page.reload();
      await page.waitForLoadState('networkidle');

      const currentUrl = page.url();
      expect(currentUrl).toContain('/dashboard');
      await expect(page.locator(dashboardPage.heading)).toBeVisible();
    });
  });
});

