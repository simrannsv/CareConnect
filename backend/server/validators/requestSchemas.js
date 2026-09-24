import { z } from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

export const createRequestSchema = z.object({
  description: z
    .string()
    .trim()
    .min(10, 'Describe the problem in a few words (at least 10 characters)')
    .max(1000, 'Description is too long'),
  location: z.string().trim().min(2, 'Location is required'),
  preferredTime: z.coerce
    .date()
    .refine((d) => d > new Date(), 'Preferred time must be in the future')
    .optional(),
  // optional manual category; the AI classifier fills it when this is left out
  category: objectId.optional(),
});