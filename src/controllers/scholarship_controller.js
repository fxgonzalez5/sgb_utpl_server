const db = require('../config/database');

exports.getAllScholarships = async (req, res) => {
    try {
        const [scholarships] = await db.execute('SELECT * FROM scholarship');
        res.status(200).json({ message: 'Lista de becas obtenida con éxito', scholarships });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las becas' });
    }
};
