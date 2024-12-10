const jwt = require('jsonwebtoken');

// Generar JsonWebToken
exports.generateJWT = (id, email) => {
    return new Promise((resolve, reject) => {
        const payload = { id, email };

        // Configurar el JWT
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h',
        }, (error, token) => {
            if (error) {
                reject('No se pudo generar el JWT');
            } else {
                resolve(token);
            }
        });
    });
};

// Verificar JsonWebToken
exports.verifyJWT = (token = '') => {
    try {
        // Verificar si el token es válido
        const { id } = jwt.verify(token, process.env.JWT_KEY);
        return [true, id];
    } catch (error) {
        return [false, null];
    }
};
