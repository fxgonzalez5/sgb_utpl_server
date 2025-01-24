const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Configuración de multer para manejar la carga de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { service, userId } = req.params; // Servicio e ID del usuario

        if (!service || !userId) {
            return cb(new Error('El servicio y el ID del usuario son obligatorios.'));
        }

        // Ruta base para almacenar documentos
        const baseDir = path.join(__dirname, '..', 'documents', service);

        // Crear directorios si no existen
        fs.mkdir(baseDir, { recursive: true }, (err) => {
            if (err) {
                console.error('Error al crear el directorio:', err);
                return cb(err);
            }
            cb(null, baseDir);
        });
    },

    filename: (req, file, cb) => {
        const { userId } = req.params;

        // Renombrar el archivo con el ID del usuario y la extensión PDF
        const newFileName = `${userId}.pdf`;
        cb(null, newFileName);
    },
});

// Validación para asegurarse de que solo se suban archivos PDF
const fileFilter = (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
        return cb(new Error('Solo se permiten archivos en formato PDF.'));
    }
    cb(null, true);
};

// Middleware de multer
const upload = multer({ storage, fileFilter });

// Controlador para manejar la carga de archivos
exports.uploadDocument = [
    upload.single('document'), // Esperar un archivo con el campo 'document'
    (req, res) => {
        try {
            const { service, userId } = req.params;

            if (!req.file) {
                return res.status(400).json({
                    status: false,
                    message: 'No se proporcionó ningún archivo.',
                });
            }

            res.status(200).json({
                status: true,
                message: 'Archivo subido exitosamente.',
                service,
                userId,
                filePath: req.file.path, // Ruta completa del archivo guardado
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: 'Error al subir el archivo.',
            });
        }
    },
];
