import { Router } from 'express';
import {
  createRequest,
  getMyRequests,
  listRequests,
  getRequest,
  cancelRequest,
  getMatches,
} from '../controllers/requestController.js';
import { getRequestQuotes } from '../controllers/quoteController.js';
import { protect, authorize } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createRequestSchema } from '../validators/requestSchemas.js';

const router = Router();

router
  .route('/')
  .post(protect, authorize('customer'), validate(createRequestSchema), createRequest)
  .get(protect, authorize('provider', 'admin'), listRequests);

// fixed path before '/:id'
router.get('/mine', protect, authorize('customer'), getMyRequests);

router.get('/:id', protect, getRequest);
router.get('/:id/matches', protect, authorize('customer', 'admin'), getMatches);
router.get('/:id/quotes', protect, authorize('customer', 'admin'), getRequestQuotes);
router.put('/:id/cancel', protect, authorize('customer'), cancelRequest);

export default router;