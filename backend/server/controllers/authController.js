import User from '../models/User.js';
import Provider from '../models/Provider.js';
import asyncHandler from '../utils/asyncHandler.js';
import generateToken from '../utils/generateToken.js';

const userPayload = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  if (await User.findOne({ email })) {
    res.status(409);
    throw new Error('Email already registered');
  }

  const user = await User.create({ name, email, password, role, phone });

  // every provider account gets an empty profile to fill in later
  if (role === 'provider') {
    await Provider.create({ user: user._id });
  }

  res.status(201).json({
    success: true,
    data: { user: userPayload(user), token: generateToken(user._id, user.role) },
    message: 'Registered successfully',
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    success: true,
    data: { user: userPayload(user), token: generateToken(user._id, user.role) },
    message: 'Logged in successfully',
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: userPayload(req.user), message: 'Current user' });
});