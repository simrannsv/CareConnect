import Category from '../models/Category.js';
import asyncHandler from '../utils/asyncHandler.js';

// public: only active categories
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort('name');
  res.json({ success: true, data: categories, message: 'Categories fetched' });
});

export const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  res.json({ success: true, data: category, message: 'Category fetched' });
});

// admin only
export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, data: category, message: 'Category created' });
});

// admin only
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  res.json({ success: true, data: category, message: 'Category updated' });
});

// admin only: soft delete, so providers and requests that reference it keep working
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  res.json({ success: true, data: category, message: 'Category deactivated' });
});