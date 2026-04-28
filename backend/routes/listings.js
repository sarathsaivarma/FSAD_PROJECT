const express = require('express');
const router = express.Router();
const {
  getListings, getListingById, createListing,
  updateListing, deleteListing, getDashboardStats
} = require('../controllers/listingsController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Public
router.get('/', getListings);
router.get('/stats', authMiddleware, adminMiddleware, getDashboardStats);
router.get('/:id', getListingById);

// Admin only
router.post('/', authMiddleware, adminMiddleware, createListing);
router.put('/:id', authMiddleware, adminMiddleware, updateListing);
router.delete('/:id', authMiddleware, adminMiddleware, deleteListing);

module.exports = router;
