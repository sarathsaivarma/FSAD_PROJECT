const express = require('express');
const router = express.Router();
const {
  createProperty, getUserProperties, getPropertyWithRecs,
  getAllProperties, updatePropertyStatus
} = require('../controllers/propertiesController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// User routes
router.post('/', authMiddleware, createProperty);
router.get('/my', authMiddleware, getUserProperties);
router.get('/:id', authMiddleware, getPropertyWithRecs);

// Admin routes
router.get('/', authMiddleware, adminMiddleware, getAllProperties);
router.patch('/:id/status', authMiddleware, adminMiddleware, updatePropertyStatus);

module.exports = router;
