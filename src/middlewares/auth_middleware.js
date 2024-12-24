const { response } = require('express');
const { verifyJWT } = require('../helpers/jsonwebtoken');

const authMiddleware = (req, res = response, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No hay token en la petición.' });
    }

    const [isValid, userId, email] = verifyJWT(token);

    if (!isValid) {
        return res.status(401).json({ message: 'Token no válido.' });
    }

    req.user = {userId, email};
    next();
};

module.exports = authMiddleware;
