/**
 * Test data generators and constants
 */

export const TEST_CREDENTIALS = {
  validUser: {
    email: process.env.TEST_USER_EMAIL || 'test@example.com',
    password: process.env.TEST_USER_PASSWORD || 'Test@123',
  },
  adminUser: {
    email: process.env.TEST_ADMIN_EMAIL || 'admin@example.com',
    password: process.env.TEST_ADMIN_PASSWORD || 'Admin@123',
  },
  invalidUser: {
    email: 'invalid@example.com',
    password: 'WrongPassword123',
  },
};

export const EXPERIENCE_LEVELS = [
  'Junior',
  'Mid-Level',
  'Senior',
  'Lead',
  'Principal',
];

export const PROJECT_STATUSES = [
  'Planning',
  'Active',
  'On Hold',
  'Completed',
  'Cancelled',
];

/**
 * Generate test personnel data
 */
export function generatePersonnelData() {
  const timestamp = Date.now();
  return {
    name: `Test Personnel ${timestamp}`,
    email: `test-personnel-${timestamp}@example.com`,
    role_title: 'Software Engineer',
    experience_level: 'Mid-Level',
    bio: 'Test bio for automated testing',
  };
}

/**
 * Generate test project data
 */
export function generateProjectData() {
  const timestamp = Date.now();
  return {
    project_name: `Test Project ${timestamp}`,
    description: 'Test project description for automated testing',
    status: 'Planning',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  };
}

/**
 * Generate test skill data
 */
export function generateSkillData() {
  const timestamp = Date.now();
  return {
    skill_name: `Test Skill ${timestamp}`,
    category: 'Programming',
    description: 'Test skill description for automated testing',
  };
}

/**
 * Generate registration data
 */
export function generateRegistrationData() {
  const timestamp = Date.now();
  return {
    name: `Test User ${timestamp}`,
    email: `test-user-${timestamp}@example.com`,
    password: 'Test@123456',
    role_title: 'QA Engineer',
    experience_level: 'Junior',
  };
}

