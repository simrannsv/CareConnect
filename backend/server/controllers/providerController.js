import Provider from '../models/Provider.js';
import Category from '../models/Category.js';
import asyncHandler from '../utils/asyncHandler.js';

const populateProvider = (query) =>
  query.populate('user', 'name').populate('categories', 'name');

// public: verified providers only. filters: ?category=<id>&area=<text>&skill=<text>
export const listProviders = asyncHandler(async (req, res) => {
  const { category, area, skill } = req.query;
  const filter = { isVerified: true };
  if (category) filter.categories = category;
  if (area) filter.serviceAreas = String(area).toLowerCase();
  if (skill) filter.skills = String(skill).toLowerCase();

  const providers = await populateProvider(Provider.find(filter).sort('-ratingAvg'));
  res.json({ success: true, data: providers, message: 'Providers fetched' });
});

// public: one verified provider
export const getProvider = asyncHandler(async (req, res) => {
  const provider = await populateProvider(
    Provider.findOne({ _id: req.params.id, isVerified: true })
  );
  if (!provider) {
    res.status(404);
    throw new Error('Provider not found');
  }
  res.json({ success: true, data: provider, message: 'Provider fetched' });
});

// provider: own profile
export const getMyProfile = asyncHandler(async (req, res) => {
  const provider = await populateProvider(Provider.findOne({ user: req.user._id }));
  if (!provider) {
    res.status(404);
    throw new Error('Provider profile not found');
  }
  res.json({ success: true, data: provider, message: 'Profile fetched' });
});

// provider: update own profile
export const updateMyProfile = asyncHandler(async (req, res) => {
  if (req.body.categories) {
    const ids = [...new Set(req.body.categories)];
    const found = await Category.countDocuments({ _id: { $in: ids }, isActive: true });
    if (found !== ids.length) {
      res.status(400);
      throw new Error('One or more categories do not exist');
    }
    req.body.categories = ids;
  }

  const provider = await populateProvider(
    Provider.findOneAndUpdate({ user: req.user._id }, req.body, {
      new: true,
      runValidators: true,
    })
  );
  if (!provider) {
    res.status(404);
    throw new Error('Provider profile not found');
  }
  res.json({ success: true, data: provider, message: 'Profile updated' });
});

// provider: replace all availability slots
export const updateMyAvailability = asyncHandler(async (req, res) => {
  const provider = await Provider.findOneAndUpdate(
    { user: req.user._id },
    { availability: req.body.slots },
    { new: true, runValidators: true }
  );
  if (!provider) {
    res.status(404);
    throw new Error('Provider profile not found');
  }
  res.json({ success: true, data: provider.availability, message: 'Availability updated' });
});

// admin: providers waiting for verification
export const getPendingProviders = asyncHandler(async (req, res) => {
  const providers = await Provider.find({ isVerified: false })
    .populate('user', 'name email')
    .populate('categories', 'name');
  res.json({ success: true, data: providers, message: 'Pending providers fetched' });
});

// admin: verify or unverify
export const verifyProvider = asyncHandler(async (req, res) => {
  const provider = await Provider.findByIdAndUpdate(
    req.params.id,
    { isVerified: req.body.isVerified },
    { new: true }
  );
  if (!provider) {
    res.status(404);
    throw new Error('Provider not found');
  }
  res.json({
    success: true,
    data: provider,
    message: provider.isVerified ? 'Provider verified' : 'Provider unverified',
  });
});