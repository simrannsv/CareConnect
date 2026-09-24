import Booking from '../models/Booking.js';

export const ONE_HOUR = 60 * 60 * 1000;

// true when [start, end] fits fully inside one of the provider's open slots
export const isWithinSlots = (availability = [], start, end) =>
  availability.some((s) => s.start <= start && s.end >= end);

// true when the provider already has an active booking overlapping [start, end]
// overlap rule: existing.start < end && existing.end > start
export const hasBookingConflict = async (providerId, start, end, excludeBookingId) => {
  const filter = {
    provider: providerId,
    status: { $in: ['scheduled', 'in_progress'] },
    start: { $lt: end },
    end: { $gt: start },
  };
  if (excludeBookingId) filter._id = { $ne: excludeBookingId };
  return Boolean(await Booking.exists(filter));
};