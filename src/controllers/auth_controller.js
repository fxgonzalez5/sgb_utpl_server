const { response } = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/database');
const { generateJWT }  = require('../helpers/jsonwebtoken');

exports.login = async (req, res = response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Por favor, completa todos los campos.' });
  }

  try {
    // Buscar al usuario por el correo electrónico
    const [user] = await db.execute('SELECT * FROM user WHERE email = ?', [email]);

    // Verificar si el usuario existe
    if (user.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Validar la contraseña
    const validPassword = bcrypt.compareSync(password, user[0].password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Contraseña incorrecta.' });
    }

    // Generar JsonWebToken
    const token = await generateJWT(user[0].iduser, user[0].email);

    // Inicio de sesión exitoso
    res.status(200).json({ status: true, user: user[0], token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Error del servidor.' });
  }
};
