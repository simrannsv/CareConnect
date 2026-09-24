import Quote from '../models/Quote.js';
import ServiceRequest from '../models/Servicerequest.js';
import Provider from '../models/Provider.js';
import asyncHandler from '../utils/asyncHandler.js';

// provider: send a quote for an open request
export const createQuote = asyncHandler(async (req, res) => {
  const { requestId, price, message } = req.body;

  const profile = await Provider.findOne({ user: req.user._id });
  if (!profile || !profile.isVerified) {
    res.status(403);
    throw new Error('Only verified providers can send quotes');
  }

  const request = await ServiceRequest.findById(requestId);
  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }
  if (!['open', 'quoted'].includes(request.status)) {
    res.status(400);
    throw new Error('This request is no longer accepting quotes');
  }
  if (request.aiCategory && !profile.categories.some((c) => c.equals(request.aiCategory))) {
    res.status(403);
    throw new Error('This request is outside your categories');
  }
  if (await Quote.exists({ request: request._id, provider: profile._id })) {
    res.status(409);
    throw new Error('You already sent a quote for this request');
  }

  const quote = await Quote.create({ request: request._id, provider: profile._id, price, message });

  if (request.status === 'open') {
    request.status = 'quoted';
    await request.save();
  }

  res.status(201).json({ success: true, data: quote, message: 'Quote sent' });
});

// provider: own quotes, optional ?status=
export const getMyQuotes = asyncHandler(async (req, res) => {
  const profile = await Provider.findOne({ user: req.user._id });
  if (!profile) {
    res.status(404);
    throw new Error('Provider profile not found');
  }

  const filter = { provider: profile._id };
  if (req.query.status) filter.status = req.query.status;

  const quotes = await Quote.find(filter)
    .sort('-createdAt')
    .populate({
      path: 'request',
      select: 'description location preferredTime urgency status aiCategory',
      populate: { path: 'aiCategory', select: 'name' },
    });

  res.json({ success: true, data: quotes, message: 'Quotes fetched' });
});

// owner customer or admin: all quotes on a request, cheapest first
export const getRequestQuotes = asyncHandler(async (req, res) => {
  const request = await ServiceRequest.findById(req.params.id);
  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }
  if (req.user.role === 'customer' && !request.customer.equals(req.user._id)) {
    res.status(403);
    throw new Error('You can only view quotes for your own requests');
  }

  const quotes = await Quote.find({ request: request._id })
    .sort('price')
    .populate({
      path: 'provider',
      select: 'user skills basePrice experienceYears ratingAvg ratingCount',
      populate: { path: 'user', select: 'name' },
    });

  res.json({ success: true, data: quotes, message: 'Quotes fetched' });
});

// customer: accept one quote, the other pending quotes are rejected
export const acceptQuote = asyncHandler(async (req, res) => {
  const quote = await Quote.findById(req.params.id).populate('request');
  if (!quote) {
    res.status(404);
    throw new Error('Quote not found');
  }

  const request = quote.request;
  if (!request.customer.equals(req.user._id)) {
    res.status(403);
    throw new Error('You can only accept quotes on your own requests');
  }
  if (!['open', 'quoted'].includes(request.status)) {
    res.status(400);
    throw new Error('This request is no longer open');
  }
  if (quote.status !== 'pending') {
    res.status(400);
    throw new Error('Only pending quotes can be accepted');
  }
  if (await Quote.exists({ request: request._id, status: 'accepted' })) {
    res.status(400);
    throw new Error('A quote was already accepted for this request');
  }

  quote.status = 'accepted';
  await quote.save();
  await Quote.updateMany(
    { request: request._id, _id: { $ne: quote._id }, status: 'pending' },
    { status: 'rejected' }
  );

  res.json({ success: true, data: quote, message: 'Quote accepted' });
});
