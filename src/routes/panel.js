const express = require('express');
const authMiddleware = require('../middlewares/auth_middleware');
const { getAllScholarships } = require('../controllers/scholarship_controller');

const router = express.Router();

router.get('/scholarship/all', authMiddleware, getAllScholarships);

module.exports = router;
