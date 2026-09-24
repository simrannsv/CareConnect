import { Router } from 'express';
import { createReview, getMyReviews, listProviderReviews } from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createReviewSchema } from '../validators/reviewSchemas.js';

const router = Router();

router.post('/', protect, authorize('customer'), validate(createReviewSchema), createReview);
router.get('/mine', protect, authorize('customer', 'provider'), getMyReviews);
router.get('/provider/:providerId', listProviderReviews);

export default router;