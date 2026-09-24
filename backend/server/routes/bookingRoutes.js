import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  listBookings,
  getBooking,
  updateBookingStatus,
  confirmBooking,
  openDispute,
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import {
  createBookingSchema,
  updateStatusSchema,
  disputeSchema,
} from '../validators/bookingSchemas.js';

const router = Router();

router
  .route('/')
  .post(protect, authorize('customer'), validate(createBookingSchema), createBooking)
  .get(protect, authorize('admin'), listBookings);

// fixed path before '/:id'
router.get('/mine', protect, authorize('customer', 'provider'), getMyBookings);

router.get('/:id', protect, getBooking);
router.put(
  '/:id/status',
  protect,
  authorize('customer', 'provider'),
  validate(updateStatusSchema),
  updateBookingStatus
);
router.put('/:id/confirm', protect, authorize('customer'), confirmBooking);
router.post('/:id/dispute', protect, authorize('customer'), validate(disputeSchema), openDispute);

export default router;