const { response } = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/database');
const { generateJWT }  = require('../helpers/jsonwebtoken');

exports.login = async (req, res = response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({status: false,  message: 'Por favor, completa todos los campos.' });
  }

  try {
    // Buscar al usuario por el correo electrónico
    const [user] = await db.execute('SELECT * FROM user WHERE email = ?', [email]);

    // Verificar si el usuario existe
    if (user.length === 0) {
      return res.status(404).json({status: false, message: 'Usuario no encontrado.' });
    }

    // Validar la contraseña
    const validPassword = bcrypt.compareSync(password, user[0].password);
    if (!validPassword) {
      return res.status(401).json({status: false, message: 'Contraseña incorrecta.' });
    }

    // Generar JsonWebToken
    const token = await generateJWT(user[0].id, user[0].email);
    
    // Eliminar la contraseña del objeto usuario
    const { password: _, ...updateUser } = user[0];

    // Formatear los datos del usuario
    const formatterUser = {
      ...updateUser,
      has_completed_the_table: (updateUser.has_completed_the_table !== null) ? !!updateUser.has_completed_the_table : null,
    }

    // Inicio de sesión exitoso
    res.status(200).json({ status: true, user: formatterUser, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Error del servidor.' });
  }
};

exports.renewToken = async (req, res = response) => {
  try {
    // Obtener el ID y el correo electrónico del usuario
    const { userId, email } = req.user;

    // Generar JsonWebToken
    const token = await generateJWT(userId, email);

    // Obtener el usuario desde la base de datos
    const [rows] = await db.execute('SELECT * FROM user WHERE id = ?', [userId]);

    // Verificar si el usuario existe    
    if (rows.length === 0) return res.status(404).json({ status: false, message: 'Usuario no encontrado.' });

    // Eliminar la contraseña del objeto usuario
    const { password: _, ...updateUser } = rows[0];

    // Formatear los datos del usuario
    const formatterUser = {
      ...updateUser,
      has_completed_the_table: (updateUser.has_completed_the_table !== null) ? !!updateUser.has_completed_the_table : null,
    }

    // Respuesta exitosa
    res.status(200).json({ status: true, user: formatterUser, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Error del servidor.' });
  }
};


// Actualizar el campo "has_completed_the_table" de un usuario
exports.updateUserCompletionStatus = async (req, res) => {
  try {
      const { userId } = req.params; // ID del usuario desde la URL
      const { has_completed_the_table } = req.body; // Nuevo estado

      // Validar datos de entrada
      if (!userId || has_completed_the_table === undefined) {
        return res.status(400).json({
            status: false,
            message: 'El ID del usuario y el nuevo estado son obligatorios.',
        });
      }

      if (typeof has_completed_the_table !== 'boolean' && has_completed_the_table !== null) {
        return res.status(400).json({
          status: false,
          message: 'El nuevo estado debe ser un valor booleano (true o false) o bien nulo.',
        });
      }

      // Actualizar el campo en la base de datos
      const [result] = await db.execute(
        `UPDATE user SET has_completed_the_table = ? WHERE id = ?`,
        [has_completed_the_table, userId]
      );

      // Verificar si el usuario fue encontrado y actualizado
      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: false,
          message: 'No se encontró el usuario especificado.',
        });
      }

      res.status(200).json({ status: true, message: 'El estado se actualizó correctamente.' });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Error al actualizar has_completed_the_table.' });
  }
};