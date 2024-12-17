const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

// Archivos de rutas
const authRoutes = require('./routes/auth');
const panelRoutes = require('./routes/panel');

// Crear servidor
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas de la api
app.use('/api/auth', authRoutes);
app.use('/api', panelRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
