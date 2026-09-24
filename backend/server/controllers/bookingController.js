import Booking from '../models/Booking.js';
import Quote from '../models/Quote.js';
import Provider from '../models/Provider.js';
import ServiceRequest from '../models/Servicerequest.js';
import Review from '../models/Review.js';
import asyncHandler from '../utils/asyncHandler.js';
import { isWithinSlots, hasBookingConflict } from '../services/availabilityService.js';

// who may move a booking from which status to which
const TRANSITIONS = {
  provider: { scheduled: ['in_progress', 'cancelled'], in_progress: ['completed'] },
  customer: { scheduled: ['cancelled'] },
};

const idOf = (v) => (v && v._id ? v._id : v);

export const populateBooking = (query) =>
  query
    .populate({
      path: 'request',
      select: 'description location urgency status aiCategory',
      populate: { path: 'aiCategory', select: 'name' },
    })
    .populate('quote', 'price message')
    .populate('customer', 'name phone')
    .populate({
      path: 'provider',
      select: 'user basePrice ratingAvg ratingCount',
      populate: { path: 'user', select: 'name phone' },
    });

// adds `reviewed: true/false` to a booking (or a list of bookings)
const addReviewFlag = async (bookings) => {
  const list = Array.isArray(bookings) ? bookings : [bookings];
  const reviews = await Review.find({ booking: { $in: list.map((b) => b._id) } }).select('booking');
  const reviewed = new Set(reviews.map((r) => String(r.booking)));
  const out = list.map((b) => ({ ...b.toObject(), reviewed: reviewed.has(String(b._id)) }));
  return Array.isArray(bookings) ? out : out[0];
};

// is this user the customer, the provider, or an admin on this booking?
const isParty = async (booking, user) => {
  if (user.role === 'admin') return true;
  if (user.role === 'customer') return idOf(booking.customer).equals(user._id);
  const profile = await Provider.findOne({ user: user._id });
  return Boolean(profile) && idOf(booking.provider).equals(profile._id);
};

// customer: book an accepted quote at a chosen time
export const createBooking = asyncHandler(async (req, res) => {
  const { quoteId, start, end, notes } = req.body;

  const quote = await Quote.findById(quoteId).populate('request');
  if (!quote) {
    res.status(404);
    throw new Error('Quote not found');
  }

  const request = quote.request;
  if (!request.customer.equals(req.user._id)) {
    res.status(403);
    throw new Error('You can only book quotes on your own requests');
  }
  if (quote.status !== 'accepted') {
    res.status(400);
    throw new Error('Accept the quote before booking');
  }
  if (request.status !== 'quoted') {
    res.status(400);
    throw new Error('This request cannot be booked');
  }

  const provider = await Provider.findById(quote.provider);
  if (!provider || !provider.isVerified) {
    res.status(400);
    throw new Error('This provider is not available for booking');
  }
  if (!isWithinSlots(provider.availability, start, end)) {
    res.status(400);
    throw new Error('The provider has no open slot covering that time');
  }
  if (await hasBookingConflict(provider._id, start, end)) {
    res.status(409);
    throw new Error('The provider already has a booking at that time');
  }

  const booking = await Booking.create({
    request: request._id,
    quote: quote._id,
    customer: req.user._id,
    provider: provider._id,
    start,
    end,
    notes,
  });

  request.status = 'booked';
  await request.save();

  res.status(201).json({ success: true, data: booking, message: 'Booking created' });
});

// customer or provider: own bookings, optional ?status=
export const getMyBookings = asyncHandler(async (req, res) => {
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
  if (req.query.status) filter.status = req.query.status;

  const bookings = await populateBooking(Booking.find(filter).sort('-start'));
  res.json({ success: true, data: await addReviewFlag(bookings), message: 'Bookings fetched' });
});

// admin: all bookings, optional ?status=
export const listBookings = asyncHandler(async (req, res) => {
  const filter = req.query.status ? { status: req.query.status } : {};
  const bookings = await populateBooking(Booking.find(filter).sort('-start'));
  res.json({ success: true, data: await addReviewFlag(bookings), message: 'Bookings fetched' });
});

// customer, provider on the booking, or admin
export const getBooking = asyncHandler(async (req, res) => {
  const booking = await populateBooking(Booking.findById(req.params.id));
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  if (!(await isParty(booking, req.user))) {
    res.status(403);
    throw new Error('You do not have access to this booking');
  }
  res.json({ success: true, data: await addReviewFlag(booking), message: 'Booking fetched' });
});

// provider: start and complete a job, customer or provider: cancel a scheduled one
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  if (!(await isParty(booking, req.user))) {
    res.status(403);
    throw new Error('You do not have access to this booking');
  }

  const allowed = TRANSITIONS[req.user.role]?.[booking.status] || [];
  if (!allowed.includes(status)) {
    res.status(400);
    throw new Error(`Cannot change status from ${booking.status} to ${status}`);
  }

  booking.status = status;
  await booking.save();

  // a finished or cancelled job closes the request
  if (status === 'completed' || status === 'cancelled') {
    await ServiceRequest.findByIdAndUpdate(booking.request, { status: 'closed' });
  }

  res.json({ success: true, data: booking, message: `Booking ${status.replace('_', ' ')}` });
});

// customer: confirm the job was done
export const confirmBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  if (!booking.customer.equals(req.user._id)) {
    res.status(403);
    throw new Error('You can only confirm your own bookings');
  }
  if (booking.status !== 'completed') {
    res.status(400);
    throw new Error('Only completed bookings can be confirmed');
  }
  if (booking.customerConfirmed) {
    res.status(400);
    throw new Error('Booking is already confirmed');
  }

  booking.customerConfirmed = true;
  await booking.save();
  res.json({ success: true, data: booking, message: 'Booking confirmed' });
});

// customer: open a dispute once the job has started or finished
export const openDispute = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  if (!booking.customer.equals(req.user._id)) {
    res.status(403);
    throw new Error('You can only dispute your own bookings');
  }
  if (!['in_progress', 'completed'].includes(booking.status)) {
    res.status(400);
    throw new Error('Disputes can only be opened once the job has started');
  }
  if (booking.disputeStatus !== 'none') {
    res.status(400);
    throw new Error('A dispute already exists for this booking');
  }

  booking.disputeStatus = 'open';
  booking.disputeReason = req.body.reason;
  await booking.save();

  res.json({ success: true, data: booking, message: 'Dispute opened' });
});
