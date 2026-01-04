/**
 * Page Object Model for Projects Page
 */
export class ProjectsPage {
  constructor(page) {
    this.page = page;
    
    // Selectors
    this.heading = 'h1:has-text("Projects Management")';
    this.newProjectButton = 'button:has-text("New Project")';
    this.searchInput = 'input[placeholder*="Search projects"]';
    this.statusFilter = 'select';
    this.projectCards = '[class*="card"]';
    this.emptyState = 'text=No projects found';
    
    // Modal selectors
    this.modal = '[role="dialog"]';
    this.modalTitle = 'text=/Create New Project|Edit Project/i';
    this.projectNameInput = 'input[name="project_name"]';
    this.descriptionTextarea = 'textarea[name="description"]';
    this.statusSelect = 'select[name="status"]';
    this.startDateInput = 'input[name="start_date"]';
    this.endDateInput = 'input[name="end_date"]';
    this.submitButton = 'button[type="submit"]:has-text(/Create|Update|Save/i)';
    this.cancelButton = 'button:has-text("Cancel")';
  }

  /**
   * Navigate to projects page
   */
  async goto() {
    await this.page.goto('/projects');
    await this.page.waitForSelector(this.heading);
  }

  /**
   * Check if on projects page
   */
  async isOnProjectsPage() {
    return await this.page.isVisible(this.heading);
  }

  /**
   * Click new project button
   */
  async clickNewProject() {
    await this.page.click(this.newProjectButton);
    await this.page.waitForSelector(this.modal);
  }

  /**
   * Fill project form
   */
  async fillProjectForm(data) {
    await this.page.fill(this.projectNameInput, data.project_name);
    await this.page.fill(this.descriptionTextarea, data.description);
    await this.page.selectOption(this.statusSelect, data.status);
    
    if (data.start_date) {
      await this.page.fill(this.startDateInput, data.start_date);
    }
    
    if (data.end_date) {
      await this.page.fill(this.endDateInput, data.end_date);
    }
  }

  /**
   * Submit project form
   */
  async submitForm() {
    await this.page.click(this.submitButton);
    
    // Wait for modal to close
    await this.page.waitForSelector(this.modal, { state: 'hidden', timeout: 5000 });
  }

  /**
   * Create new project
   */
  async createProject(data) {
    await this.clickNewProject();
    await this.fillProjectForm(data);
    await this.submitForm();
  }

  /**
   * Search for projects
   */
  async search(query) {
    await this.page.fill(this.searchInput, query);
    
    // Wait for search results
    await this.page.waitForTimeout(500);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Filter by status
   */
  async filterByStatus(status) {
    await this.page.selectOption(this.statusFilter, status);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get project cards count
   */
  async getProjectCount() {
    // Check if empty state is shown
    const isEmpty = await this.page.isVisible(this.emptyState).catch(() => false);
    if (isEmpty) return 0;
    
    // Count visible project cards
    const cards = await this.page.locator('[class*="grid"] > div').all();
    return cards.length;
  }

  /**
   * Click on a project card
   */
  async clickProject(projectName) {
    await this.page.click(`text="${projectName}"`);
    await this.page.waitForURL('**/projects/**');
  }

  /**
   * Check if project exists
   */
  async projectExists(projectName) {
    const element = this.page.locator(`text="${projectName}"`);
    return await element.isVisible().catch(() => false);
  }

  /**
   * Get status count
   */
  async getStatusCount(status) {
    const statusCard = this.page.locator(`p:has-text("${status}")`).locator('..').locator('p[class*="font-bold"]');
    const text = await statusCard.textContent().catch(() => '0');
    return parseInt(text) || 0;
  }

  /**
   * Wait for toast message
   */
  async waitForToast(message) {
    await this.page.waitForSelector(`text="${message}"`, { timeout: 5000 });
  }
}

