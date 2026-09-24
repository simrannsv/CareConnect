import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().trim().min(2, 'Name is too short'),
  description: z.string().trim().optional(),
});

export const updateCategorySchema = createCategorySchema
  .partial()
  .extend({ isActive: z.boolean().optional() });