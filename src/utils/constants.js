export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const EXPERIENCE_LEVELS = ['Junior', 'Mid-Level', 'Senior'];

export const PROFICIENCY_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export const SKILL_CATEGORIES = [
  'Programming Language',
  'Framework',
  'Tool',
  'Soft Skill',
  'Other',
];

export const PROJECT_STATUSES = ['Planning', 'Active', 'Completed', 'On Hold'];

export const USER_ROLES = ['admin', 'manager'];

export const AUTH_TOKEN_KEY = 'authToken';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PERSONNEL: '/personnel',
  PERSONNEL_DETAIL: '/personnel/:id',
  SKILLS: '/skills',
  PROJECTS: '/projects',
  PROJECT_DETAIL: '/projects/:id',
  MATCHING: '/matching',
  AVAILABILITY: '/availability',
};

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
};

export const QUERY_KEYS = {
  PERSONNEL: 'personnel',
  PERSONNEL_DETAIL: 'personnel-detail',
  SKILLS: 'skills',
  SKILL_DETAIL: 'skill-detail',
  PROJECTS: 'projects',
  PROJECT_DETAIL: 'project-detail',
  MATCHING: 'matching',
  AVAILABILITY: 'availability',
  ALLOCATIONS: 'allocations',
  AUTH_USER: 'auth-user',
};

