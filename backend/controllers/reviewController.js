const Review = require('../models/Review');
const asyncHandler = require('../middlewares/asyncHandler');

// @desc    Add a review
// @route   POST /api/reviews
// @access  Public
exports.addReview = asyncHandler(async (req, res, next) => {
  const { recipeId, rating, comment, userName } = req.body;
  
  const reviewData = {
    recipeId,
    rating,
    comment,
    userName: req.user ? req.user.name : userName || 'Anonymous'
  };

  if (req.user) {
    reviewData.userId = req.user.id;
  }

  const review = await Review.create(reviewData);

  res.status(201).json({
    success: true,
    data: review
  });
});

// @desc    Get reviews for a recipe
// @route   GET /api/reviews/:recipeId
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  const { recipeId } = req.params;
  const { limit = 5, offset = 0 } = req.query;

  // First get authenticated user reviews
  const authenticatedReviews = await Review.find({ 
    recipeId, 
    userId: { $exists: true } 
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .skip(offset);

  // If we don't have enough authenticated reviews, get some anonymous ones
  if (authenticatedReviews.length < limit) {
    const remaining = limit - authenticatedReviews.length;
    const anonymousReviews = await Review.find({ 
      recipeId, 
      userId: { $exists: false } 
    })
    .sort({ createdAt: -1 })
    .limit(remaining)
    .skip(offset);

    return res.status(200).json({
      success: true,
      data: [...authenticatedReviews, ...anonymousReviews]
    });
  }

  res.status(200).json({
    success: true,
    data: authenticatedReviews
  });
});