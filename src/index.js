const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const passportUserJWT = require('./middlewares/passport_user_jwt.middleware');
require('dotenv').config();


// Archivos de rutas
const authRoutes = require('./routes/auth');
const panelRoutes = require('./routes/panel');

// Crear servidor
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport
app.use(passport.initialize());
passport.use('jwt', passportUserJWT);

// Rutas de la api
app.use('/api/auth', authRoutes);
app.use('/api', panelRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
