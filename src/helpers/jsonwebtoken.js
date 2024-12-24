const jwt = require('jsonwebtoken');

// Generar JsonWebToken
exports.generateJWT = (id, email) => {
    return new Promise((resolve, reject) => {
        const payload = { id, email };

        // Configurar el JWT
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '12h',
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
        const { id, email } = jwt.verify(token, process.env.JWT_SECRET);
        return [true, id, email];
    } catch (error) {
        console.log(error);
        return [false, null];
    }
};
