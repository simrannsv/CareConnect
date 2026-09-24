import { z } from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');
const tag = z.string().trim().toLowerCase().min(1, 'Cannot be empty');

export const updateProfileSchema = z.object({
  categories: z.array(objectId).optional(),
  skills: z.array(tag).optional(),
  serviceAreas: z.array(tag).optional(),
  basePrice: z.number().min(0, 'Price cannot be negative').optional(),
  experienceYears: z.number().min(0, 'Experience cannot be negative').optional(),
  bio: z.string().trim().max(500, 'Bio is too long').optional(),
});

const slot = z
  .object({ start: z.coerce.date(), end: z.coerce.date() })
  .refine((s) => s.end > s.start, { message: 'end must be after start', path: ['end'] });

export const availabilitySchema = z.object({
  slots: z.array(slot).refine(
    (slots) => {
      const sorted = [...slots].sort((a, b) => a.start - b.start);
      return sorted.every((s, i) => i === 0 || s.start >= sorted[i - 1].end);
    },
    { message: 'Slots must not overlap' }
  ),
});

export const verifySchema = z.object({ isVerified: z.boolean() });