import { test, expect } from './fixtures/auth.fixture.js';
import { DashboardPage } from './pages/dashboard.page.js';
import { NavigationPage } from './pages/navigation.page.js';

test.describe('Dashboard', () => {
  let dashboardPage;
  let navigationPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    dashboardPage = new DashboardPage(authenticatedPage);
    navigationPage = new NavigationPage(authenticatedPage);
  });

  test('should display dashboard correctly', async ({ authenticatedPage }) => {
    await dashboardPage.goto();

    await expect(authenticatedPage.locator(dashboardPage.heading)).toBeVisible();
    
    await expect(authenticatedPage.locator(dashboardPage.totalPersonnelCard)).toBeVisible();
    await expect(authenticatedPage.locator(dashboardPage.activeProjectsCard)).toBeVisible();
    await expect(authenticatedPage.locator(dashboardPage.totalSkillsCard)).toBeVisible();
    await expect(authenticatedPage.locator(dashboardPage.totalProjectsCard)).toBeVisible();
    
    await expect(authenticatedPage.locator(dashboardPage.quickActionsSection)).toBeVisible();
  });

  test('should display statistics correctly', async ({ authenticatedPage }) => {
    await dashboardPage.goto();
    await dashboardPage.waitForLoad();

    const stats = await dashboardPage.getAllStats();
    
    for (const [key, value] of Object.entries(stats)) {
      expect(typeof value).toBe('number');
      expect(value).toBeGreaterThanOrEqual(0);
    }
  });

  test('should navigate to personnel via quick action', async ({ authenticatedPage }) => {
    await dashboardPage.goto();
    await dashboardPage.navigateToPersonnel();

    await expect(authenticatedPage).toHaveURL(/.*personnel/);
    await expect(authenticatedPage.locator('h1:has-text("Personnel Management")')).toBeVisible();
  });

  test('should navigate to projects via quick action', async ({ authenticatedPage }) => {
    await dashboardPage.goto();
    await dashboardPage.navigateToProjects();

    await expect(authenticatedPage).toHaveURL(/.*projects/);
    await expect(authenticatedPage.locator('h1:has-text("Projects Management")')).toBeVisible();
  });

  test('should navigate to skills via quick action', async ({ authenticatedPage }) => {
    await dashboardPage.goto();
    await dashboardPage.navigateToSkills();

    await expect(authenticatedPage).toHaveURL(/.*skills/);
    await expect(authenticatedPage.locator('h1:has-text(/Skill/i)')).toBeVisible();
  });
});

test.describe('Navigation', () => {
  let navigationPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    navigationPage = new NavigationPage(authenticatedPage);
    await authenticatedPage.goto('/dashboard');
  });

  test('should navigate to all main pages', async ({ authenticatedPage }) => {
    await navigationPage.goToDashboard();
    await expect(authenticatedPage).toHaveURL(/.*dashboard/);
    await expect(authenticatedPage.locator('h1:has-text("Dashboard")')).toBeVisible();

    await navigationPage.goToPersonnel();
    await expect(authenticatedPage).toHaveURL(/.*personnel/);
    await expect(authenticatedPage.locator('h1:has-text("Personnel Management")')).toBeVisible();

    await navigationPage.goToProjects();
    await expect(authenticatedPage).toHaveURL(/.*projects/);
    await expect(authenticatedPage.locator('h1:has-text("Projects Management")')).toBeVisible();

    await navigationPage.goToSkills();
    await expect(authenticatedPage).toHaveURL(/.*skills/);
    await expect(authenticatedPage.locator('h1:has-text(/Skill/i)')).toBeVisible();
  });

  test('should have all navigation links visible', async ({ authenticatedPage }) => {
    const dashboardVisible = await navigationPage.isNavItemVisible(navigationPage.dashboardLink);
    const personnelVisible = await navigationPage.isNavItemVisible(navigationPage.personnelLink);
    const projectsVisible = await navigationPage.isNavItemVisible(navigationPage.projectsLink);
    const skillsVisible = await navigationPage.isNavItemVisible(navigationPage.skillsLink);

    expect(dashboardVisible).toBeTruthy();
    expect(personnelVisible).toBeTruthy();
    expect(projectsVisible).toBeTruthy();
    expect(skillsVisible).toBeTruthy();
  });

  test('should navigate using browser back/forward', async ({ authenticatedPage }) => {
    await navigationPage.goToDashboard();
    await navigationPage.goToPersonnel();
    await navigationPage.goToProjects();

    await authenticatedPage.goBack();
    await expect(authenticatedPage).toHaveURL(/.*personnel/);

    await authenticatedPage.goBack();
    await expect(authenticatedPage).toHaveURL(/.*dashboard/);

    await authenticatedPage.goForward();
    await expect(authenticatedPage).toHaveURL(/.*personnel/);
  });

  test('should maintain navigation state after page reload', async ({ authenticatedPage }) => {
    await navigationPage.goToPersonnel();
    await expect(authenticatedPage).toHaveURL(/.*personnel/);

    await authenticatedPage.reload();
    await authenticatedPage.waitForLoadState('networkidle');

    await expect(authenticatedPage).toHaveURL(/.*personnel/);
    await expect(authenticatedPage.locator('h1:has-text("Personnel Management")')).toBeVisible();
  });
});

  test.describe('Responsive Design', () => {
  test('should display correctly on mobile viewport', async ({ authenticatedPage }) => {
    await authenticatedPage.setViewportSize({ width: 375, height: 667 });
    
    const dashboardPage = new DashboardPage(authenticatedPage);
    await dashboardPage.goto();

    await expect(authenticatedPage.locator(dashboardPage.heading)).toBeVisible();
    await expect(authenticatedPage.locator(dashboardPage.totalPersonnelCard)).toBeVisible();
  });

  test('should display correctly on tablet viewport', async ({ authenticatedPage }) => {
    await authenticatedPage.setViewportSize({ width: 768, height: 1024 });
    
    const dashboardPage = new DashboardPage(authenticatedPage);
    await dashboardPage.goto();

    await expect(authenticatedPage.locator(dashboardPage.heading)).toBeVisible();
    await expect(authenticatedPage.locator(dashboardPage.quickActionsSection)).toBeVisible();
  });
});

test.describe('Theme Toggle', () => {
  test('should toggle between light and dark theme', async ({ authenticatedPage }) => {
    const navigationPage = new NavigationPage(authenticatedPage);
    await authenticatedPage.goto('/dashboard');

    const initialHtml = await authenticatedPage.locator('html').getAttribute('class');
    
    await navigationPage.toggleTheme();
    await authenticatedPage.waitForTimeout(500);

    const updatedHtml = await authenticatedPage.locator('html').getAttribute('class');
    expect(updatedHtml).not.toBe(initialHtml);

    await navigationPage.toggleTheme();
    await authenticatedPage.waitForTimeout(500);

    const finalHtml = await authenticatedPage.locator('html').getAttribute('class');
    expect(finalHtml).toBeDefined();
  });
});

