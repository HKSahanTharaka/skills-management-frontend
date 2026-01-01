/**
 * Page Object Model for Login Page
 */
export class LoginPage {
  constructor(page) {
    this.page = page;
    
    // Selectors
    this.emailInput = 'input[type="email"]';
    this.passwordInput = 'input[type="password"]';
    this.signInButton = 'button[type="submit"]';
    this.signUpLink = 'a:has-text("Sign up")';
    this.heading = 'h2:has-text("Welcome Back")';
  }

  /**
   * Navigate to login page
   */
  async goto() {
    await this.page.goto('/login');
    await this.page.waitForSelector(this.heading);
  }

  /**
   * Login with credentials
   */
  async login(email, password) {
    await this.page.fill(this.emailInput, email);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.signInButton);
  }

  /**
   * Check if on login page
   */
  async isOnLoginPage() {
    return await this.page.isVisible(this.heading);
  }

  /**
   * Get error message
   */
  async getErrorMessage() {
    const errorElement = await this.page.locator('text=/error|invalid|failed/i').first();
    return await errorElement.textContent().catch(() => null);
  }

  /**
   * Click sign up link
   */
  async goToSignUp() {
    await this.page.click(this.signUpLink);
    await this.page.waitForURL('**/register');
  }
}

