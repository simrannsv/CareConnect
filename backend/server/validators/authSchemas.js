import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name is too short'),
  email: z.string().trim().toLowerCase().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  // admins are created via the seed script, never through public signup
  role: z.enum(['customer', 'provider']).default('customer'),
  phone: z.string().trim().optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});