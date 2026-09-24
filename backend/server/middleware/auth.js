import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// verifies the JWT and attaches the user to req.user
export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      res.status(401);
      throw new Error('Not authorized, no token');
    }

    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401);
      throw new Error('User no longer exists');
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      res.status(401);
    }
    next(err);
  }
};

// usage: router.get('/x', protect, authorize('admin'), handler)
export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    res.status(403);
    return next(new Error('Forbidden: you do not have access to this resource'));
  }
  next();
};