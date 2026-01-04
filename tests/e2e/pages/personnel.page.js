/**
 * Page Object Model for Personnel Page
 */
export class PersonnelPage {
  constructor(page) {
    this.page = page;
    
    // Selectors
    this.heading = 'h1:has-text("Personnel Management")';
    this.addPersonnelButton = 'button:has-text("Add Personnel")';
    this.searchInput = 'input[placeholder*="Search"]';
    this.experienceFilter = 'select, [role="combobox"]';
    this.personnelTable = 'table';
    this.personnelCard = '[class*="card"]';
    this.emptyState = 'text=No personnel found';
    
    // Modal selectors
    this.modal = '[role="dialog"]';
    this.modalTitle = 'text=/Add New Personnel|Edit Personnel/i';
    this.nameInput = 'input[name="name"]';
    this.emailInput = 'input[name="email"]';
    this.roleTitleInput = 'input[name="role_title"]';
    this.experienceSelect = 'select[name="experience_level"]';
    this.bioTextarea = 'textarea[name="bio"]';
    this.submitButton = 'button[type="submit"]:has-text(/Create|Update|Save/i)';
    this.cancelButton = 'button:has-text("Cancel")';
  }

  /**
   * Navigate to personnel page
   */
  async goto() {
    await this.page.goto('/personnel');
    await this.page.waitForSelector(this.heading);
  }

  /**
   * Check if on personnel page
   */
  async isOnPersonnelPage() {
    return await this.page.isVisible(this.heading);
  }

  /**
   * Click add personnel button
   */
  async clickAddPersonnel() {
    await this.page.click(this.addPersonnelButton);
    await this.page.waitForSelector(this.modal);
  }

  /**
   * Fill personnel form
   */
  async fillPersonnelForm(data) {
    await this.page.fill(this.nameInput, data.name);
    await this.page.fill(this.emailInput, data.email);
    await this.page.fill(this.roleTitleInput, data.role_title);
    
    // Select experience level
    await this.page.selectOption(this.experienceSelect, data.experience_level);
    
    if (data.bio) {
      await this.page.fill(this.bioTextarea, data.bio);
    }
  }

  /**
   * Submit personnel form
   */
  async submitForm() {
    await this.page.click(this.submitButton);
    
    // Wait for modal to close
    await this.page.waitForSelector(this.modal, { state: 'hidden', timeout: 5000 });
  }

  /**
   * Create new personnel
   */
  async createPersonnel(data) {
    await this.clickAddPersonnel();
    await this.fillPersonnelForm(data);
    await this.submitForm();
  }

  /**
   * Search for personnel
   */
  async search(query) {
    await this.page.fill(this.searchInput, query);
    
    // Wait for search results
    await this.page.waitForTimeout(500);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Filter by experience level
   */
  async filterByExperience(level) {
    const filters = await this.page.locator('select').all();
    if (filters.length > 0) {
      await filters[0].selectOption(level);
      await this.page.waitForLoadState('networkidle');
    }
  }

  /**
   * Get personnel count from table
   */
  async getPersonnelCount() {
    // Check if empty state is shown
    const isEmpty = await this.page.isVisible(this.emptyState).catch(() => false);
    if (isEmpty) return 0;
    
    // Count table rows
    const rows = await this.page.locator('table tbody tr').all();
    return rows.length;
  }

  /**
   * Click edit button for personnel
   */
  async editPersonnel(personnelName) {
    const row = this.page.locator(`tr:has-text("${personnelName}")`);
    await row.locator('button[title*="Edit"]').click();
    await this.page.waitForSelector(this.modal);
  }

  /**
   * Click delete button for personnel
   */
  async deletePersonnel(personnelName) {
    const row = this.page.locator(`tr:has-text("${personnelName}")`);
    await row.locator('button[title*="Delete"]').click();
    
    // Confirm deletion
    await this.page.waitForSelector('text=Confirm Delete');
    await this.page.click('button:has-text("Delete")');
    
    // Wait for deletion to complete
    await this.page.waitForTimeout(1000);
  }

  /**
   * Click view details button
   */
  async viewPersonnelDetails(personnelName) {
    const row = this.page.locator(`tr:has-text("${personnelName}")`);
    await row.locator('button[title*="View"]').click();
    await this.page.waitForURL('**/personnel/**');
  }

  /**
   * Check if personnel exists in list
   */
  async personnelExists(personnelName) {
    const element = this.page.locator(`text="${personnelName}"`);
    return await element.isVisible().catch(() => false);
  }

  /**
   * Wait for toast message
   */
  async waitForToast(message) {
    await this.page.waitForSelector(`text="${message}"`, { timeout: 5000 });
  }

  /**
   * Get total count from page info
   */
  async getTotalCount() {
    const countText = await this.page.locator('text=/\\d+ personnel found/').textContent();
    const match = countText.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }
}

