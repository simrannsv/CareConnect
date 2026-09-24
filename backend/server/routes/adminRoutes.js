import { Router } from 'express';
import {
  getStats,
  listUsers,
  listDisputes,
  resolveDispute,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { resolveDisputeSchema } from '../validators/adminSchemas.js';

const router = Router();

// everything here is admin only
router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', listUsers);
router.get('/disputes', listDisputes);
router.put('/disputes/:id/resolve', validate(resolveDisputeSchema), resolveDispute);

export default router;