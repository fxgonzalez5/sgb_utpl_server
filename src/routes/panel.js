const express = require('express');
const authMiddleware = require('../middlewares/auth_middleware');
const { getAllScholarships, hasUserApplied, createApplication } = require('../controllers/scholarship_controller');
const { getScholarshipsWithRequirements, getRequirementsByApplication,  updateRequirementStatus } = require('../controllers/requirement_controller');

const router = express.Router();

router.get('/scholarship/all', authMiddleware, getAllScholarships);
router.get('/scholarship/:scholarshipId/requirements', authMiddleware, getScholarshipsWithRequirements);
router.get('/application/:applicationId/requirements/:userId', authMiddleware, getRequirementsByApplication);
router.get('/application/:userId/:year/:period', authMiddleware, hasUserApplied);
router.post('/application', authMiddleware, createApplication);
router.put('/application/:applicationId/requirements/:requirementId', authMiddleware, updateRequirementStatus);

module.exports = router;
