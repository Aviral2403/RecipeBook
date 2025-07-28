const SavedRecipe = require('../models/SavedRecipe');
const asyncHandler = require('../middlewares/asyncHandler');

// @desc    Save a recipe
// @route   POST /api/recipes/save
// @access  Private
exports.saveRecipe = asyncHandler(async (req, res, next) => {
  const { recipeId, recipeData } = req.body;

  // Check if recipe already saved
  const existingRecipe = await SavedRecipe.findOne({
    user: req.user.id,
    recipeId,
  });

  if (existingRecipe) {
    return res.status(400).json({
      success: false,
      error: 'Recipe already saved',
    });
  }

  const savedRecipe = await SavedRecipe.create({
    user: req.user.id,
    recipeId,
    recipeData,
  });

  res.status(201).json({
    success: true,
    data: savedRecipe,
  });
});

// @desc    Remove a saved recipe
// @route   DELETE /api/recipes/save/:recipeId
// @access  Private
exports.removeSavedRecipe = asyncHandler(async (req, res, next) => {
  const savedRecipe = await SavedRecipe.findOneAndDelete({
    user: req.user.id,
    recipeId: req.params.recipeId,
  });

  if (!savedRecipe) {
    return res.status(404).json({
      success: false,
      error: 'Recipe not found',
    });
  }

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get all saved recipes for a user
// @route   GET /api/recipes/saved
// @access  Private
exports.getSavedRecipes = asyncHandler(async (req, res, next) => {
  const savedRecipes = await SavedRecipe.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    count: savedRecipes.length,
    data: savedRecipes,
  });
});