import { z } from 'zod';

export const resolveDisputeSchema = z.object({
  resolution: z
    .string()
    .trim()
    .min(5, 'Please describe the resolution')
    .max(1000, 'Resolution is too long'),
});