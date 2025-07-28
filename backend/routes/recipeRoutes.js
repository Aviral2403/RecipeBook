const express = require('express');
const {
  saveRecipe,
  removeSavedRecipe,
  getSavedRecipes,
} = require('../controllers/recipeController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.route('/save').post(protect, saveRecipe);
router.route('/saved').get(protect, getSavedRecipes);
router.route('/save/:recipeId').delete(protect, removeSavedRecipe);

module.exports = router;