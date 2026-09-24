import { Router } from 'express';
import {
  listProviders,
  getProvider,
  getMyProfile,
  updateMyProfile,
  updateMyAvailability,
  getPendingProviders,
  verifyProvider,
} from '../controllers/providerController.js';
import { protect, authorize } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import {
  updateProfileSchema,
  availabilitySchema,
  verifySchema,
} from '../validators/providerSchemas.js';

const router = Router();

router.get('/', listProviders);

// fixed paths must come before '/:id'
router.get('/pending', protect, authorize('admin'), getPendingProviders);

router
  .route('/me')
  .get(protect, authorize('provider'), getMyProfile)
  .put(protect, authorize('provider'), validate(updateProfileSchema), updateMyProfile);

router.put(
  '/me/availability',
  protect,
  authorize('provider'),
  validate(availabilitySchema),
  updateMyAvailability
);

router.get('/:id', getProvider);
router.put('/:id/verify', protect, authorize('admin'), validate(verifySchema), verifyProvider);

export default router;