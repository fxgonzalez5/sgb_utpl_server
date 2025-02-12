const fs = require('fs');
const path = require('path');

// Obtener becas desde un archivo JSON
exports.getScholarshipsFromJson = async (req, res) => {
    try {
        // Construir la ruta del archivo JSON
        const filePath = path.join(__dirname, '../data/scholarships.json');

        // Verificar si el archivo existe
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                status: false,
                message: 'El archivo de becas no existe.',
            });
        }

        // Leer y procesar el archivo JSON
        const jsonData = fs.readFileSync(filePath, 'utf-8');
        const scholarships = JSON.parse(jsonData);

        res.status(200).json({ status: true, scholarships });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Error al leer las becas desde JSON.' });
    }
};

// Sobrescribir el archivo JSON con nuevas becas
exports.overwriteScholarshipsJson = async (req, res) => {
    try {
        const { scholarships } = req.body;

        // Validar que el listado de becas sea un array no vacío
        if (!Array.isArray(scholarships) || scholarships.length === 0) {
            return res.status(400).json({
                status: false,
                message: 'Debe enviarse un listado de becas válido en formato de array.',
            });
        }

        // Construir la ruta del archivo JSON
        const filePath = path.join(__dirname, '../data/scholarships.json');

        // Convertir el listado a formato JSON
        const jsonData = JSON.stringify(scholarships, null, 2); // Espaciado de 2 para mejor legibilidad

        // Escribir el archivo JSON (sobrescribir)
        fs.writeFileSync(filePath, jsonData, 'utf-8');

        res.status(200).json({ status: true, message: 'Archivo JSON sobrescrito correctamente.' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Error al sobrescribir el archivo JSON.' });
    }
};
