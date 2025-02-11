const express = require('express');
const authMiddleware = require('../middlewares/auth_middleware');
const { getAllScholarships, hasUserApplied, createApplication, getUserApplications, deleteApplication } = require('../controllers/scholarship_controller');
const { getScholarshipsWithRequirements, getRequirementsByApplication,  updateRequirementStatus } = require('../controllers/requirement_controller');
const { uploadDocument } = require('../controllers/document_controller');
const { getStreetAddress, insertOrUpdateUserLocation } = require('../controllers/location_controller');

const router = express.Router();

router.get('/scholarship/all', authMiddleware, getAllScholarships);
router.get('/scholarship/:scholarshipId/requirements', authMiddleware, getScholarshipsWithRequirements);
router.get('/application/:applicationId/requirements/:userId', authMiddleware, getRequirementsByApplication);
router.get('/application/:userId/:year/:period/:modality', authMiddleware, hasUserApplied);
router.post('/application', authMiddleware, createApplication);
router.get('/application/user/:userId', authMiddleware, getUserApplications);
router.delete('/application/remove/:applicationId', authMiddleware, deleteApplication);
router.put('/application/:applicationId/requirements/:requirementId', authMiddleware, updateRequirementStatus);
router.post('/upload/:service/:userId', uploadDocument);
router.get('/mapbox/geocode/reverse/:longitude/:latitude', getStreetAddress);
router.post('/requirements/user/location', authMiddleware, insertOrUpdateUserLocation);

module.exports = router;
