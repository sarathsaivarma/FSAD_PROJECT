const express = require('express');
const router = express.Router();
const {
  getCategories, getRecommendations, getRecommendationById,
  createRecommendation, updateRecommendation, deleteRecommendation
} = require('../controllers/recommendationsController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Public
router.get('/categories', getCategories);
router.get('/', getRecommendations);
router.get('/:id', getRecommendationById);

// Admin only
router.post('/', authMiddleware, adminMiddleware, createRecommendation);
router.put('/:id', authMiddleware, adminMiddleware, updateRecommendation);
router.delete('/:id', authMiddleware, adminMiddleware, deleteRecommendation);

module.exports = router;
