import ServiceRequest from '../models/ServiceRequest.js';
import Category from '../models/Category.js';
import Provider from '../models/Provider.js';
import Quote from '../models/Quote.js';
import asyncHandler from '../utils/asyncHandler.js';
import { classifyRequest } from '../services/aiClassifier.js';
import { rankProviders } from '../services/rankingService.js';

const populateRequest = (query) =>
  query.populate('customer', 'name').populate('aiCategory', 'name');

// customer: create a request
export const createRequest = asyncHandler(async (req, res) => {
  const { description, location, preferredTime, category } = req.body;

  if (category && !(await Category.exists({ _id: category, isActive: true }))) {
    res.status(400);
    throw new Error('Category does not exist');
  }

  // AI fills category, skills and urgency; if it fails the request is still saved
  let ai = null;
  try {
    ai = await classifyRequest(description);
  } catch (err) {
    console.error('AI classification failed:', err.message);
  }

  const request = await ServiceRequest.create({
    customer: req.user._id,
    description,
    location,
    preferredTime,
    aiCategory: category || ai?.category || undefined, // a manual category wins
    aiSkills: ai?.skills,
    urgency: ai?.urgency,
  });

  res.status(201).json({
    success: true,
    data: await populateRequest(ServiceRequest.findById(request._id)),
    message: 'Request created',
  });
});

// customer: own requests, optional ?status=
export const getMyRequests = asyncHandler(async (req, res) => {
  const filter = { customer: req.user._id };
  if (req.query.status) filter.status = req.query.status;

  const requests = await populateRequest(ServiceRequest.find(filter).sort('-createdAt'));
  res.json({ success: true, data: requests, message: 'Requests fetched' });
});

// provider: open requests in their categories | admin: everything
export const listRequests = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.user.role === 'provider') {
    const profile = await Provider.findOne({ user: req.user._id });
    if (!profile || !profile.isVerified) {
      res.status(403);
      throw new Error('Only verified providers can view requests');
    }
    filter.aiCategory = { $in: profile.categories };
    filter.status = req.query.status || { $in: ['open', 'quoted'] };
  } else if (req.query.status) {
    filter.status = req.query.status;
  }

  const requests = await populateRequest(ServiceRequest.find(filter).sort('-createdAt'));
  res.json({ success: true, data: requests, message: 'Requests fetched' });
});

// owner customer, any provider, or admin
export const getRequest = asyncHandler(async (req, res) => {
  const request = await populateRequest(ServiceRequest.findById(req.params.id));
  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }

  const isOwner = request.customer._id.equals(req.user._id);
  if (req.user.role === 'customer' && !isOwner) {
    res.status(403);
    throw new Error('You can only view your own requests');
  }

  res.json({ success: true, data: request, message: 'Request fetched' });
});

// customer: cancel own request
export const cancelRequest = asyncHandler(async (req, res) => {
  const request = await ServiceRequest.findOne({ _id: req.params.id, customer: req.user._id });
  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }
  if (!['open', 'quoted'].includes(request.status)) {
    res.status(400);
    throw new Error('Only open or quoted requests can be cancelled');
  }

  request.status = 'closed';
  await request.save();
  await Quote.updateMany(
    { request: request._id, status: { $in: ['pending', 'accepted'] } },
    { status: 'rejected' }
  );
  res.json({ success: true, data: request, message: 'Request cancelled' });
});

// owner customer or admin: verified providers ranked for this request
export const getMatches = asyncHandler(async (req, res) => {
  const request = await ServiceRequest.findById(req.params.id);
  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }
  if (req.user.role === 'customer' && !request.customer.equals(req.user._id)) {
    res.status(403);
    throw new Error('You can only view matches for your own requests');
  }
  if (!['open', 'quoted'].includes(request.status)) {
    res.status(400);
    throw new Error('This request is no longer open');
  }

  const limit = Math.min(Number(req.query.limit) || 10, 20);
  const matches = await rankProviders(request, limit);

  res.json({
    success: true,
    data: {
      request: {
        _id: request._id,
        aiCategory: request.aiCategory,
        aiSkills: request.aiSkills,
        urgency: request.urgency,
        location: request.location,
        preferredTime: request.preferredTime,
      },
      matches,
    },
    message: matches.length ? 'Ranked providers' : 'No matching providers yet',
  });
});