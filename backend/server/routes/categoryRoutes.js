import { Router } from 'express';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createCategorySchema, updateCategorySchema } from '../validators/categorySchemas.js';

const router = Router();

router
  .route('/')
  .get(getCategories)
  .post(protect, authorize('admin'), validate(createCategorySchema), createCategory);

router
  .route('/:id')
  .get(getCategory)
  .put(protect, authorize('admin'), validate(updateCategorySchema), updateCategory)
  .delete(protect, authorize('admin'), deleteCategory);

export default router;