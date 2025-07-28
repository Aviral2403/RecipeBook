const mongoose = require('mongoose');

const savedRecipeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  recipeId: {
    type: Number,
    required: true,
  },
  recipeData: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent duplicate saved recipes
savedRecipeSchema.index({ user: 1, recipeId: 1 }, { unique: true });

module.exports = mongoose.model('SavedRecipe', savedRecipeSchema);