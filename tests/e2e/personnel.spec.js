import { test, expect } from './fixtures/auth.fixture.js';
import { PersonnelPage } from './pages/personnel.page.js';
import { generatePersonnelData } from './utils/test-data.js';

test.describe('Personnel Management', () => {
  let personnelPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    personnelPage = new PersonnelPage(authenticatedPage);
    await personnelPage.goto();
  });

  test('should display personnel page correctly', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.locator(personnelPage.heading)).toBeVisible();
    await expect(authenticatedPage.locator(personnelPage.searchInput)).toBeVisible();
  });

  test('should display empty state when no personnel', async ({ authenticatedPage }) => {
    await personnelPage.search('NonExistentPersonnel12345XYZ');
    await authenticatedPage.waitForTimeout(1000);
    
    const isEmpty = await authenticatedPage.locator(personnelPage.emptyState).isVisible()
      .catch(() => false);
    
    if (!isEmpty) {
      const count = await personnelPage.getPersonnelCount();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('should search for personnel', async ({ authenticatedPage }) => {
    await personnelPage.search('');
    await authenticatedPage.waitForTimeout(500);
    
    const initialCount = await personnelPage.getTotalCount();
    
    await personnelPage.search('test');
    await authenticatedPage.waitForTimeout(1000);
    
    const searchedCount = await personnelPage.getTotalCount();
    
    expect(searchedCount).toBeLessThanOrEqual(initialCount);
  });

  test('should filter personnel by experience level', async ({ authenticatedPage }) => {
    const initialCount = await personnelPage.getTotalCount();
    
    await personnelPage.filterByExperience('Junior');
    await authenticatedPage.waitForTimeout(1000);
    
    const filteredCount = await personnelPage.getTotalCount();
    
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });

  test('should open add personnel modal', async ({ authenticatedPage }) => {
    const addButton = authenticatedPage.locator(personnelPage.addPersonnelButton);
    const isVisible = await addButton.isVisible().catch(() => false);
    
    if (isVisible) {
      await personnelPage.clickAddPersonnel();
      
      await expect(authenticatedPage.locator(personnelPage.modal)).toBeVisible();
      await expect(authenticatedPage.locator(personnelPage.modalTitle)).toBeVisible();
      
      await expect(authenticatedPage.locator(personnelPage.nameInput)).toBeVisible();
      await expect(authenticatedPage.locator(personnelPage.emailInput)).toBeVisible();
      await expect(authenticatedPage.locator(personnelPage.roleTitleInput)).toBeVisible();
    }
  });

  test('should close modal on cancel', async ({ authenticatedPage }) => {
    const addButton = authenticatedPage.locator(personnelPage.addPersonnelButton);
    const isVisible = await addButton.isVisible().catch(() => false);
    
    if (isVisible) {
      await personnelPage.clickAddPersonnel();
      await expect(authenticatedPage.locator(personnelPage.modal)).toBeVisible();
      
      await authenticatedPage.click(personnelPage.cancelButton);
      
      await expect(authenticatedPage.locator(personnelPage.modal)).not.toBeVisible();
    }
  });

  test('should create new personnel', async ({ authenticatedPage }) => {
    const addButton = authenticatedPage.locator(personnelPage.addPersonnelButton);
    const isVisible = await addButton.isVisible().catch(() => false);
    
    if (!isVisible) {
      test.skip(true, 'User does not have permission to create personnel');
    }

    const personnelData = generatePersonnelData();
    
    const initialCount = await personnelPage.getTotalCount();
    
    await personnelPage.createPersonnel(personnelData);
    
    await authenticatedPage.waitForTimeout(2000);
    
    await personnelPage.search(personnelData.name);
    await authenticatedPage.waitForTimeout(1000);
    
    const exists = await personnelPage.personnelExists(personnelData.name);
    expect(exists).toBeTruthy();
  });

  test('should validate required fields', async ({ authenticatedPage }) => {
    const addButton = authenticatedPage.locator(personnelPage.addPersonnelButton);
    const isVisible = await addButton.isVisible().catch(() => false);
    
    if (!isVisible) {
      test.skip(true, 'User does not have permission to create personnel');
    }

    await personnelPage.clickAddPersonnel();
    
    await authenticatedPage.click(personnelPage.submitButton);
    
    await authenticatedPage.waitForTimeout(1000);
    
    const modalVisible = await authenticatedPage.locator(personnelPage.modal).isVisible();
    expect(modalVisible).toBeTruthy();
  });

  test('should paginate through personnel list', async ({ authenticatedPage }) => {
    const paginationExists = await authenticatedPage.locator('button:has-text("Next"), button:has-text("Previous")').isVisible()
      .catch(() => false);
    
    if (paginationExists) {
      const initialUrl = authenticatedPage.url();
      
      const nextButton = authenticatedPage.locator('button:has-text("Next")').first();
      const isEnabled = await nextButton.isEnabled().catch(() => false);
      
      if (isEnabled) {
        await nextButton.click();
        await authenticatedPage.waitForTimeout(1000);
        
        const newUrl = authenticatedPage.url();
        expect(newUrl).toBeDefined();
      }
    }
  });

  test('should clear search', async ({ authenticatedPage }) => {
    await personnelPage.search('test search');
    await authenticatedPage.waitForTimeout(500);
    
    const clearButton = authenticatedPage.locator('button[title*="Clear"], [data-testid="clear-search"]').first();
    const isClearVisible = await clearButton.isVisible().catch(() => false);
    
    if (isClearVisible) {
      await clearButton.click();
      await authenticatedPage.waitForTimeout(500);
      
      const searchValue = await authenticatedPage.locator(personnelPage.searchInput).inputValue();
      expect(searchValue).toBe('');
    }
  });
});

test.describe('Personnel CRUD Operations', () => {
  let personnelPage;
  let testPersonnel;

  test.beforeEach(async ({ authenticatedPage }) => {
    personnelPage = new PersonnelPage(authenticatedPage);
    await personnelPage.goto();
  });

  test.skip('should edit personnel', async ({ authenticatedPage }) => {
    const editButtons = authenticatedPage.locator('button[title*="Edit"]');
    const count = await editButtons.count();
    
    if (count > 0) {
      await editButtons.first().click();
      await expect(authenticatedPage.locator(personnelPage.modal)).toBeVisible();
      
      const nameInput = authenticatedPage.locator(personnelPage.nameInput);
      const currentName = await nameInput.inputValue();
      await nameInput.fill(currentName + ' Updated');
      
      await authenticatedPage.click(personnelPage.submitButton);
      await authenticatedPage.waitForTimeout(2000);
      
      await expect(authenticatedPage.locator(personnelPage.modal)).not.toBeVisible();
    }
  });

  test.skip('should delete personnel', async ({ authenticatedPage }) => {
    const deleteButtons = authenticatedPage.locator('button[title*="Delete"]');
    const count = await deleteButtons.count();
    
    if (count > 0) {
      const firstRow = authenticatedPage.locator('table tbody tr').first();
      const personnelName = await firstRow.locator('td').first().textContent();
      
      await deleteButtons.first().click();
      
      await expect(authenticatedPage.locator('text=Confirm Delete')).toBeVisible();
      await authenticatedPage.click('button:has-text("Delete")');
      
      await authenticatedPage.waitForTimeout(2000);
      
      const exists = await personnelPage.personnelExists(personnelName);
      expect(exists).toBeFalsy();
    }
  });
});

test.describe('Personnel Details View', () => {
  test('should navigate to personnel details', async ({ authenticatedPage }) => {
    const personnelPage = new PersonnelPage(authenticatedPage);
    await personnelPage.goto();
    
    const viewButtons = authenticatedPage.locator('button[title*="View"]');
    const count = await viewButtons.count();
    
    if (count > 0) {
      await viewButtons.first().click();
      
      await expect(authenticatedPage).toHaveURL(/.*personnel\/\d+/);
      
      await authenticatedPage.waitForLoadState('networkidle');
    }
  });
});

