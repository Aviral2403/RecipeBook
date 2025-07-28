const express = require('express');
const { addReview, getReviews } = require('../controllers/reviewController');
const router = express.Router();

router.route('/')
  .post(addReview); // Removed protect middleware

router.route('/:recipeId')
  .get(getReviews);

module.exports = router;