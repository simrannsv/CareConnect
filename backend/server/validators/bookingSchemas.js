import { z } from 'zod';

export const createBookingSchema = z
  .object({
    quoteId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid quote id'),
    start: z.coerce.date(),
    end: z.coerce.date(),
    notes: z.string().trim().max(500, 'Notes are too long').optional(),
  })
  .refine((b) => b.end > b.start, { message: 'end must be after start', path: ['end'] })
  .refine((b) => b.start > new Date(), { message: 'start must be in the future', path: ['start'] });

export const updateStatusSchema = z.object({
  status: z.enum(['in_progress', 'completed', 'cancelled']),
});

export const disputeSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(10, 'Please explain the problem in at least 10 characters')
    .max(1000, 'Reason is too long'),
});