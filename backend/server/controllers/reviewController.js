import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import Provider from '../models/Provider.js';
import asyncHandler from '../utils/asyncHandler.js';

// customer: review a completed job (the Review model updates the provider's rating)
export const createReview = asyncHandler(async (req, res) => {
  const { bookingId, rating, comment } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  if (!booking.customer.equals(req.user._id)) {
    res.status(403);
    throw new Error('You can only review your own bookings');
  }
  if (booking.status !== 'completed') {
    res.status(400);
    throw new Error('You can only review completed jobs');
  }
  if (await Review.exists({ booking: booking._id })) {
    res.status(409);
    throw new Error('You already reviewed this booking');
  }

  const review = await Review.create({
    booking: booking._id,
    customer: req.user._id,
    provider: booking.provider,
    rating,
    comment,
  });

  res.status(201).json({ success: true, data: review, message: 'Review submitted' });
});

// customer: reviews written | provider: reviews received
export const getMyReviews = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role === 'customer') {
    filter.customer = req.user._id;
  } else {
    const profile = await Provider.findOne({ user: req.user._id });
    if (!profile) {
      res.status(404);
      throw new Error('Provider profile not found');
    }
    filter.provider = profile._id;
  }

  const reviews = await Review.find(filter)
    .sort('-createdAt')
    .populate('customer', 'name')
    .populate({ path: 'provider', select: 'user', populate: { path: 'user', select: 'name' } });

  res.json({ success: true, data: reviews, message: 'Reviews fetched' });
});

// public: a verified provider's rating summary and latest reviews
export const listProviderReviews = asyncHandler(async (req, res) => {
  const provider = await Provider.findOne({ _id: req.params.providerId, isVerified: true }).select(
    'ratingAvg ratingCount'
  );
  if (!provider) {
    res.status(404);
    throw new Error('Provider not found');
  }

  const limit = Math.min(Number(req.query.limit) || 20, 50);
  const reviews = await Review.find({ provider: provider._id })
    .sort('-createdAt')
    .limit(limit)
    .populate('customer', 'name');

  res.json({
    success: true,
    data: { ratingAvg: provider.ratingAvg, ratingCount: provider.ratingCount, reviews },
    message: 'Reviews fetched',
  });
});