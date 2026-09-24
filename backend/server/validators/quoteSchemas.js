import { z } from 'zod';

export const createQuoteSchema = z.object({
  requestId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid request id'),
  price: z.number().positive('Price must be greater than 0'),
  message: z.string().trim().max(500, 'Message is too long').optional(),
});