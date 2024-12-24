const { Router } = require('express');
const { login, renewToken } = require('../controllers/auth_controller');
const authMiddleware = require('../middlewares/auth_middleware');

const router = Router();

router.post('/login', login);
router.get('/check-token', authMiddleware, renewToken);

module.exports = router;
