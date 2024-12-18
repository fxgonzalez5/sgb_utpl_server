const { verifyJWT } = require('../helpers/jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No hay token en la petición.' });
    }

    const [isValid, userId] = verifyJWT(token);

    if (!isValid) {
        return res.status(401).json({ message: 'Token no válido.' });
    }

    req.userId = userId;
    next();
};

module.exports = authMiddleware;
