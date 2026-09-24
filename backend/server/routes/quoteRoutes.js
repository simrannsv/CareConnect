import { Router } from 'express';
import { createQuote, getMyQuotes, acceptQuote } from '../controllers/quoteController.js';
import { protect, authorize } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createQuoteSchema } from '../validators/quoteSchemas.js';

const router = Router();

router.post('/', protect, authorize('provider'), validate(createQuoteSchema), createQuote);

// fixed path before '/:id'
router.get('/mine', protect, authorize('provider'), getMyQuotes);

router.put('/:id/accept', protect, authorize('customer'), acceptQuote);

export default router;