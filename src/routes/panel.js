const express = require('express');
const authMiddleware = require('../middlewares/auth_middleware');
const { getAllScholarships } = require('../controllers/scholarship_controller');
const { getScholarshipsWithRequirements } = require('../controllers/requirement_controller');

const router = express.Router();

router.get('/scholarship/all', authMiddleware, getAllScholarships);
router.get('/scholarship/:scholarshipId/requirements/:userId', authMiddleware, getScholarshipsWithRequirements);

module.exports = router;
