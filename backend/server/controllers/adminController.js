import User from '../models/User.js';
import Provider from '../models/Provider.js';
import ServiceRequest from '../models/Servicerequest.js';
import Quote from '../models/Quote.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import Category from '../models/Category.js';
import asyncHandler from '../utils/asyncHandler.js';
import { populateBooking } from './bookingController.js';

// { key: count } for every value of a field, with 0 for values that never appear
const countBy = async (Model, field, keys) => {
    const rows = await Model.aggregate([{ $group: { _id: `$${field}`, count: { $sum: 1 } } }]);
    const out = Object.fromEntries(keys.map((k) => [k, 0]));
    rows.forEach((r) => {
        out[r._id] = r.count;
    });
    return out;
};
const total = (obj) => Object.values(obj).reduce((a, b) => a + b, 0);

// one call with every number the admin dashboard needs
export const getStats = asyncHandler(async (req, res) => {
    const [users, requests, quotes, bookings, disputes, verified, pending, ratingRows, topCategories] =
        await Promise.all([
            countBy(User, 'role', ['customer', 'provider', 'admin']),
            countBy(ServiceRequest, 'status', ['open', 'quoted', 'booked', 'closed']),
            countBy(Quote, 'status', ['pending', 'accepted', 'rejected']),
            countBy(Booking, 'status', ['scheduled', 'in_progress', 'completed', 'cancelled']),
            countBy(Booking, 'disputeStatus', ['none', 'open', 'resolved']),
            Provider.countDocuments({ isVerified: true }),
            Provider.countDocuments({ isVerified: false }),
            Review.aggregate([{ $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }]),
            ServiceRequest.aggregate([
                { $match: { aiCategory: { $ne: null } } },
                { $group: { _id: '$aiCategory', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 5 },
                {
                    $lookup: {
                        from: Category.collection.name,
                        localField: '_id',
                        foreignField: '_id',
                        as: 'category',
                    },
                },
                { $unwind: '$category' },
                { $project: { _id: 0, category: '$category.name', count: 1 } },
            ]),
        ]);

    const [ratings] = ratingRows;

    res.json({
        success: true,
        data: {
            users: { total: total(users), byRole: users },
            providers: { verified, pending },
            requests: { total: total(requests), byStatus: requests },
            quotes: { total: total(quotes), byStatus: quotes },
            bookings: { total: total(bookings), byStatus: bookings },
            disputes: { open: disputes.open, resolved: disputes.resolved },
            reviews: {
                total: ratings ? ratings.count : 0,
                averageRating: ratings ? Math.round(ratings.avg * 10) / 10 : 0,
            },
            topCategories,
        },
        message: 'Stats fetched',
    });
});

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ?role=customer|provider|admin &q=<name or email> &page=1 &limit=20
export const listUsers = asyncHandler(async (req, res) => {
    const { role, q } = req.query;
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 50);

    const filter = {};
    if (role) {
        if (!['customer', 'provider', 'admin'].includes(role)) {
            res.status(400);
            throw new Error('Invalid role');
        }
        filter.role = role;
    }
    if (q) {
        const rx = new RegExp(escapeRegex(String(q).trim()), 'i');
        filter.$or = [{ name: rx }, { email: rx }];
    }

    const [users, count] = await Promise.all([
        User.find(filter)
            .sort('-createdAt')
            .skip((page - 1) * limit)
            .limit(limit),
        User.countDocuments(filter),
    ]);

    res.json({
        success: true,
        data: { users, total: count, page, pages: Math.ceil(count / limit) },
        message: 'Users fetched',
    });
});

// ?status=open (default) | resolved
export const listDisputes = asyncHandler(async (req, res) => {
    const status = req.query.status || 'open';
    if (!['open', 'resolved'].includes(status)) {
        res.status(400);
        throw new Error('Status must be open or resolved');
    }
    const bookings = await populateBooking(Booking.find({ disputeStatus: status }).sort('-updatedAt'));
    res.json({ success: true, data: bookings, message: 'Disputes fetched' });
});

// :id is the booking id
export const resolveDispute = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }
    if (booking.disputeStatus !== 'open') {
        res.status(400);
        throw new Error('This booking has no open dispute');
    }

    booking.disputeStatus = 'resolved';
    booking.disputeResolution = req.body.resolution;
    await booking.save();

    res.json({ success: true, data: booking, message: 'Dispute resolved' });
});
