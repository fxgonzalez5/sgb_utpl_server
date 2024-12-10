const readlineSync = require('readline-sync');
const bcrypt = require('bcrypt');

const saltRounds = 10;

// Leer la contraseña del usuario de forma segura
console.log('Introduce tu contraseña:');
//! Nota: No se permite eliminar caracteres en la consola, por tanto escribir con cuidado sino iniciar de nuevo.
const password = readlineSync.question(null, {
  hideEchoBack: true, // Oculta la entrada
  mask: '*' // Muestra un caracter
});

// Generar el hash de la contraseña
bcrypt.hash(password, saltRounds, function(err, hash) {
  if (err) throw err;
  console.log('Contraseña encriptado:', hash);
});