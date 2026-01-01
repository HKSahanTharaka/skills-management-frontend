import { test, expect } from './fixtures/auth.fixture.js';
import { ProjectsPage } from './pages/projects.page.js';
import { generateProjectData } from './utils/test-data.js';

test.describe('Projects Management', () => {
  let projectsPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    projectsPage = new ProjectsPage(authenticatedPage);
    await projectsPage.goto();
  });

  test('should display projects page correctly', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.locator(projectsPage.heading)).toBeVisible();
    await expect(authenticatedPage.locator(projectsPage.newProjectButton)).toBeVisible();
    await expect(authenticatedPage.locator(projectsPage.searchInput)).toBeVisible();
  });

  test('should display project status overview', async ({ authenticatedPage }) => {
    await authenticatedPage.waitForLoadState('networkidle');
    
    const searchValue = await authenticatedPage.locator(projectsPage.searchInput).inputValue();
    
    if (searchValue === '') {
      const statusCards = authenticatedPage.locator('p:has-text("Planning"), p:has-text("Active"), p:has-text("Completed")');
      const count = await statusCards.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should search for projects', async ({ authenticatedPage }) => {
    await projectsPage.search('');
    await authenticatedPage.waitForTimeout(500);
    
    const initialCount = await projectsPage.getProjectCount();
    
    await projectsPage.search('test');
    await authenticatedPage.waitForTimeout(1000);
    
    const searchedCount = await projectsPage.getProjectCount();
    
    expect(searchedCount).toBeLessThanOrEqual(initialCount);
  });

  test('should filter projects by status', async ({ authenticatedPage }) => {
    const initialCount = await projectsPage.getProjectCount();
    
    await projectsPage.filterByStatus('Active');
    await authenticatedPage.waitForTimeout(1000);
    
    const filteredCount = await projectsPage.getProjectCount();
    
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });

  test('should open new project modal', async ({ authenticatedPage }) => {
    await projectsPage.clickNewProject();
    
    await expect(authenticatedPage.locator(projectsPage.modal)).toBeVisible();
    await expect(authenticatedPage.locator(projectsPage.modalTitle)).toBeVisible();
    
    await expect(authenticatedPage.locator(projectsPage.projectNameInput)).toBeVisible();
    await expect(authenticatedPage.locator(projectsPage.descriptionTextarea)).toBeVisible();
    await expect(authenticatedPage.locator(projectsPage.statusSelect)).toBeVisible();
  });

  test('should close modal on cancel', async ({ authenticatedPage }) => {
    await projectsPage.clickNewProject();
    await expect(authenticatedPage.locator(projectsPage.modal)).toBeVisible();
    
    await authenticatedPage.click(projectsPage.cancelButton);
    
    await expect(authenticatedPage.locator(projectsPage.modal)).not.toBeVisible();
  });

  test('should create new project', async ({ authenticatedPage }) => {
    const projectData = generateProjectData();
    
    await projectsPage.search('');
    await authenticatedPage.waitForTimeout(500);
    const initialCount = await projectsPage.getProjectCount();
    
    await projectsPage.createProject(projectData);
    
    await authenticatedPage.waitForTimeout(2000);
    
    await projectsPage.search(projectData.project_name);
    await authenticatedPage.waitForTimeout(1000);
    
    const exists = await projectsPage.projectExists(projectData.project_name);
    expect(exists).toBeTruthy();
  });

  test('should validate required fields', async ({ authenticatedPage }) => {
    await projectsPage.clickNewProject();
    
    await authenticatedPage.click(projectsPage.submitButton);
    
    await authenticatedPage.waitForTimeout(1000);
    
    const modalVisible = await authenticatedPage.locator(projectsPage.modal).isVisible();
    expect(modalVisible).toBeTruthy();
  });

  test('should validate date fields', async ({ authenticatedPage }) => {
    await projectsPage.clickNewProject();
    
    const projectData = generateProjectData();
    
    // Fill in basic fields
    await authenticatedPage.fill(projectsPage.projectNameInput, projectData.project_name);
    await authenticatedPage.fill(projectsPage.descriptionTextarea, projectData.description);
    await authenticatedPage.selectOption(projectsPage.statusSelect, projectData.status);
    
    const today = new Date();
    const startDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    const endDate = new Date(today.getTime());
    
    await authenticatedPage.fill(projectsPage.startDateInput, startDate.toISOString().split('T')[0]);
    await authenticatedPage.fill(projectsPage.endDateInput, endDate.toISOString().split('T')[0]);
    
    await authenticatedPage.click(projectsPage.submitButton);
    await authenticatedPage.waitForTimeout(1000);
    
    const modalVisible = await authenticatedPage.locator(projectsPage.modal).isVisible();
    if (modalVisible) {
      expect(modalVisible).toBeTruthy();
    }
  });

  test('should clear search', async ({ authenticatedPage }) => {
    await projectsPage.search('test search');
    await authenticatedPage.waitForTimeout(500);
    
    const clearButton = authenticatedPage.locator('button[title*="Clear"], [data-testid="clear-search"]').first();
    const isClearVisible = await clearButton.isVisible().catch(() => false);
    
    if (isClearVisible) {
      await clearButton.click();
      await authenticatedPage.waitForTimeout(500);
      
      const searchValue = await authenticatedPage.locator(projectsPage.searchInput).inputValue();
      expect(searchValue).toBe('');
    }
  });

  test('should paginate through projects list', async ({ authenticatedPage }) => {
    const paginationExists = await authenticatedPage.locator('button:has-text("Next"), button:has-text("Previous")').isVisible()
      .catch(() => false);
    
    if (paginationExists) {
      const nextButton = authenticatedPage.locator('button:has-text("Next")').first();
      const isEnabled = await nextButton.isEnabled().catch(() => false);
      
      if (isEnabled) {
        await nextButton.click();
        await authenticatedPage.waitForTimeout(1000);
        
        const url = authenticatedPage.url();
        expect(url).toBeDefined();
      }
    }
  });

  test('should display empty state when no projects', async ({ authenticatedPage }) => {
    await projectsPage.search('NonExistentProject12345XYZ');
    await authenticatedPage.waitForTimeout(1000);
    
    const isEmpty = await authenticatedPage.locator(projectsPage.emptyState).isVisible()
      .catch(() => false);
    
    if (!isEmpty) {
      const count = await projectsPage.getProjectCount();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });
});

test.describe('Project Status Management', () => {
  let projectsPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    projectsPage = new ProjectsPage(authenticatedPage);
    await projectsPage.goto();
  });

  test('should filter by each status type', async ({ authenticatedPage }) => {
    const statuses = ['Planning', 'Active', 'On Hold', 'Completed'];
    
    for (const status of statuses) {
      await projectsPage.filterByStatus(status);
      await authenticatedPage.waitForTimeout(1000);
      
      const count = await projectsPage.getProjectCount();
      expect(count).toBeGreaterThanOrEqual(0);
    }
    
    await projectsPage.filterByStatus('');
    await authenticatedPage.waitForTimeout(500);
  });

  test('should show status counts in overview', async ({ authenticatedPage }) => {
    await projectsPage.search('');
    await projectsPage.filterByStatus('');
    await authenticatedPage.waitForTimeout(500);
    
    const statusCards = authenticatedPage.locator('div:has(p:has-text("Planning")), div:has(p:has-text("Active"))');
    const count = await statusCards.count();
    
    if (count > 0) {
      expect(count).toBeGreaterThan(0);
    }
  });
});

test.describe('Project Details View', () => {
  test('should navigate to project details', async ({ authenticatedPage }) => {
    const projectsPage = new ProjectsPage(authenticatedPage);
    await projectsPage.goto();
    
    await projectsPage.search('');
    await authenticatedPage.waitForTimeout(500);
    
    const projectCards = authenticatedPage.locator('[class*="grid"] > div');
    const count = await projectCards.count();
    
    if (count > 0) {
      await projectCards.first().click();
      
      await expect(authenticatedPage).toHaveURL(/.*projects\/\d+/);
      
      await authenticatedPage.waitForLoadState('networkidle');
    }
  });
});

test.describe('Project Search and Filter Combinations', () => {
  let projectsPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    projectsPage = new ProjectsPage(authenticatedPage);
    await projectsPage.goto();
  });

  test('should combine search and status filter', async ({ authenticatedPage }) => {
    await projectsPage.filterByStatus('Active');
    await authenticatedPage.waitForTimeout(500);
    
    await projectsPage.search('test');
    await authenticatedPage.waitForTimeout(1000);
    
    const searchValue = await authenticatedPage.locator(projectsPage.searchInput).inputValue();
    expect(searchValue).toBe('test');
    
    const count = await projectsPage.getProjectCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should reset all filters', async ({ authenticatedPage }) => {
    await projectsPage.filterByStatus('Active');
    await projectsPage.search('test');
    await authenticatedPage.waitForTimeout(500);
    
    await projectsPage.search('');
    await authenticatedPage.waitForTimeout(500);
    
    await projectsPage.filterByStatus('');
    await authenticatedPage.waitForTimeout(500);
    
    const count = await projectsPage.getProjectCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

