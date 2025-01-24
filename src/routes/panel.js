const express = require('express');
const authMiddleware = require('../middlewares/auth_middleware');
const { getAllScholarships, hasUserApplied } = require('../controllers/scholarship_controller');
const { getScholarshipsWithRequirements } = require('../controllers/requirement_controller');

const router = express.Router();

router.get('/scholarship/all', authMiddleware, getAllScholarships);
router.get('/scholarship/:scholarshipId/requirements', authMiddleware, getScholarshipsWithRequirements);
router.get('/application/:userId/:year/:period', authMiddleware, hasUserApplied);

module.exports = router;
