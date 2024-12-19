const passport = require('passport');
const express = require('express');
const { getAllScholarships } = require('../controllers/scholarship_controller');

const router = express.Router();

router.get('/scholarship/all', passport.authenticate('jwt', { session: false }), getAllScholarships);

module.exports = router;
