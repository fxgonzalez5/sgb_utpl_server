const db = require('../config/database');

exports.getAllScholarships = async (req, res) => {
    try {
        const [scholarships] = await db.execute('SELECT * FROM scholarship');
        res.status(200).json({ status: true, scholarships });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Error al obtener las becas' });
    }
};
