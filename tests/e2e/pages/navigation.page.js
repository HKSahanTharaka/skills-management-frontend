/**
 * Page Object Model for Navigation/Sidebar
 */
export class NavigationPage {
  constructor(page) {
    this.page = page;
    
    // Navigation links
    this.dashboardLink = 'a[href="/dashboard"]';
    this.personnelLink = 'a[href="/personnel"]';
    this.projectsLink = 'a[href="/projects"]';
    this.skillsLink = 'a[href="/skills"]';
    this.matchingLink = 'a[href="/matching"]';
    this.availabilityLink = 'a[href="/availability"]';
    this.profileLink = 'a[href="/profile"]';
    this.managersLink = 'a[href="/managers"]';
    
    // User menu
    this.userMenuButton = 'button:has-text("Profile"), [data-testid="user-menu"]';
    this.logoutButton = 'button:has-text("Logout"), button:has-text("Sign out")';
    
    // Theme toggle
    this.themeToggle = '[data-testid="theme-toggle"], button:has([class*="moon"]), button:has([class*="sun"])';
  }

  /**
   * Navigate to dashboard
   */
  async goToDashboard() {
    await this.page.click(this.dashboardLink);
    await this.page.waitForURL('**/dashboard');
  }

  /**
   * Navigate to personnel
   */
  async goToPersonnel() {
    await this.page.click(this.personnelLink);
    await this.page.waitForURL('**/personnel');
  }

  /**
   * Navigate to projects
   */
  async goToProjects() {
    await this.page.click(this.projectsLink);
    await this.page.waitForURL('**/projects');
  }

  /**
   * Navigate to skills
   */
  async goToSkills() {
    await this.page.click(this.skillsLink);
    await this.page.waitForURL('**/skills');
  }

  /**
   * Navigate to matching
   */
  async goToMatching() {
    await this.page.click(this.matchingLink);
    await this.page.waitForURL('**/matching');
  }

  /**
   * Navigate to availability
   */
  async goToAvailability() {
    await this.page.click(this.availabilityLink);
    await this.page.waitForURL('**/availability');
  }

  /**
   * Navigate to profile
   */
  async goToProfile() {
    await this.page.click(this.profileLink);
    await this.page.waitForURL('**/profile');
  }

  /**
   * Navigate to managers (admin only)
   */
  async goToManagers() {
    await this.page.click(this.managersLink);
    await this.page.waitForURL('**/managers');
  }

  /**
   * Logout user
   */
  async logout() {
    // Try to find and click user menu first
    const userMenu = this.page.locator(this.userMenuButton).first();
    const isVisible = await userMenu.isVisible().catch(() => false);
    
    if (isVisible) {
      await userMenu.click();
      await this.page.waitForTimeout(300);
    }
    
    // Click logout button
    await this.page.click(this.logoutButton);
    await this.page.waitForURL('**/login', { timeout: 5000 });
  }

  /**
   * Toggle theme
   */
  async toggleTheme() {
    await this.page.click(this.themeToggle);
    await this.page.waitForTimeout(300);
  }

  /**
   * Check if nav item is visible
   */
  async isNavItemVisible(navItem) {
    return await this.page.isVisible(navItem).catch(() => false);
  }
}

