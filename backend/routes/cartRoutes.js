const express = require('express');
const router = express.Router();
const { validateCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.post('/validate', protect, validateCart);

module.exports = router;