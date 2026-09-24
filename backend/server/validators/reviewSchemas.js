import { z } from 'zod';

export const createReviewSchema = z.object({
  bookingId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid booking id'),
  rating: z
    .number()
    .int('Rating must be a whole number')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot be more than 5'),
  comment: z.string().trim().max(500, 'Comment is too long').optional(),
});