import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['admin', 'manager']).default('manager'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const personnelSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role_title: z.string().min(1, 'Role title is required'),
  experience_level: z.enum(['Junior', 'Mid-Level', 'Senior']),
  bio: z.string().optional(),
  profile_image_url: z.union([z.string().url(), z.literal('')]).optional(),
});

export const skillSchema = z.object({
  skill_name: z.string().min(1, 'Skill name is required'),
  category: z.enum(['Programming Language', 'Framework', 'Tool', 'Soft Skill', 'Other']),
  description: z.string().optional(),
});

export const personnelSkillSchema = z.object({
  skill_id: z.number().int().positive('Please select a skill'),
  proficiency_level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
  years_of_experience: z.number().min(0, 'Years of experience must be positive').max(50, 'Years of experience seems too high'),
});

export const projectSchema = z.object({
  project_name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  status: z.enum(['Planning', 'Active', 'Completed', 'On Hold']).default('Planning'),
}).refine((data) => {
  if (data.start_date && data.end_date) {
    return new Date(data.end_date) > new Date(data.start_date);
  }
  return true;
}, {
  message: 'End date must be after start date',
  path: ['end_date'],
});

export const projectRequiredSkillSchema = z.object({
  skill_id: z.number().int().positive('Please select a skill'),
  minimum_proficiency: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
});

export const availabilitySchema = z.object({
  personnel_id: z.number().int().positive(),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  availability_percentage: z.number().int().min(0, 'Must be at least 0').max(100, 'Must be at most 100'),
  notes: z.string().optional(),
}).refine((data) => {
  if (data.start_date && data.end_date) {
    return new Date(data.end_date) > new Date(data.start_date);
  }
  return true;
}, {
  message: 'End date must be after start date',
  path: ['end_date'],
});

export const allocationSchema = z.object({
  project_id: z.number().int().positive('Please select a project'),
  personnel_id: z.number().int().positive('Please select personnel'),
  allocation_percentage: z.number().int().min(0, 'Must be at least 0').max(100, 'Must be at most 100'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  role_in_project: z.string().optional(),
}).refine((data) => {
  if (data.start_date && data.end_date) {
    return new Date(data.end_date) > new Date(data.start_date);
  }
  return true;
}, {
  message: 'End date must be after start date',
  path: ['end_date'],
});

