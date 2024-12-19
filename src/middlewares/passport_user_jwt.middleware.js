const { ExtractJwt, Strategy } = require("passport-jwt");
const config = require('../config/settings');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.SECRET,
};

module.exports = new Strategy(opts, async (jwtPayload, done) => {
    try {
        const [user] = await db.execute('SELECT * FROM user WHERE iduser = ?', [jwtPayload.id]);

        // Verificar si el usuario existe
        if (user.length === 0) {
            return done(null, false);
        }

        return done(null, user[0]);

    } catch (error) {
        return done(error, false);
    }
});
