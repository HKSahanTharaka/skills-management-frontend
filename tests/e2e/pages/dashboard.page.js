/**
 * Page Object Model for Dashboard Page
 */
export class DashboardPage {
  constructor(page) {
    this.page = page;
    
    // Selectors
    this.heading = 'h1:has-text("Dashboard")';
    this.totalPersonnelCard = 'text=Total Personnel';
    this.activeProjectsCard = 'text=Active Projects';
    this.totalSkillsCard = 'text=Total Skills';
    this.totalProjectsCard = 'text=Total Projects';
    this.quickActionsSection = 'text=Quick Actions';
  }

  /**
   * Navigate to dashboard
   */
  async goto() {
    await this.page.goto('/dashboard');
    await this.page.waitForSelector(this.heading);
  }

  /**
   * Check if on dashboard page
   */
  async isOnDashboard() {
    return await this.page.isVisible(this.heading);
  }

  /**
   * Get stat value by label
   */
  async getStatValue(label) {
    const statCard = this.page.locator(`text=${label}`).locator('..').locator('xpath=..//p[@class*="font-bold"]');
    return await statCard.textContent();
  }

  /**
   * Click quick action button
   */
  async clickQuickAction(actionName) {
    await this.page.click(`button:has-text("${actionName}")`);
  }

  /**
   * Navigate using quick action
   */
  async navigateToPersonnel() {
    await this.clickQuickAction('Add Personnel');
    await this.page.waitForURL('**/personnel');
  }

  async navigateToProjects() {
    await this.clickQuickAction('Create Project');
    await this.page.waitForURL('**/projects');
  }

  async navigateToSkills() {
    await this.clickQuickAction('Add Skill');
    await this.page.waitForURL('**/skills');
  }

  /**
   * Wait for dashboard to load completely
   */
  async waitForLoad() {
    await this.page.waitForSelector(this.heading);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get all stats
   */
  async getAllStats() {
    const stats = {};
    
    // Wait for stats to be loaded
    await this.page.waitForSelector(this.totalPersonnelCard);
    
    // Extract values
    const cards = await this.page.locator('[class*="font-bold text-3xl"]').all();
    const labels = await this.page.locator('p:has-text("Total"), p:has-text("Active")').all();
    
    for (let i = 0; i < Math.min(cards.length, labels.length); i++) {
      const label = await labels[i].textContent();
      const value = await cards[i].textContent();
      stats[label.trim()] = parseInt(value) || 0;
    }
    
    return stats;
  }
}

