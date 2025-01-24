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

// Verificar si un usuario ha postulado a una beca en un período específico
exports.hasUserApplied = async (req, res) => {
    try {
        const { userId, year, period } = req.params;

        // Validar datos de entrada
        if (!userId || !year || !period) {
            return res.status(400).json({
                status: false,
                message: 'El ID del usuario y el período son obligatorios.',
            });
        }

        // Consulta para verificar la postulación
        const [rows] = await db.execute(
            `
            SELECT id, scholarship_id
            FROM applications
            WHERE user_id = ? AND year = ? AND period = ?
            LIMIT 1
            `,
            [userId, year, period]
        );

        // Verificar si se encontró una postulación
        if (rows.length === 0) {
            return res.status(404).json({
                status: true,
                scholarshipId: 0,
                message: 'El usuario no ha postulado en este período.',
            });
        }

        res.status(200).json({ status: true, applicationId: rows[0].id, scholarshipId: rows[0].scholarship_id, message: 'El usuario ha postulado en este período.' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Error al verificar la postulación del usuario' });
    }
};

exports.createApplication = async (req, res) => {
    try {
        const {
            user_id,
            scholarship_id,
            year,
            period,
            modality,
        } = req.body;

        // Validar los campos requeridos
        if (!user_id || !scholarship_id || !year || !period || !modality) {
            return res.status(400).json({
                status: false,
                message: 'Todos los campos requeridos deben estar completos.',
            });
        }

        // Insertar una nueva postulación
        await db.execute(
            `
            INSERT INTO applications (
                user_id,
                scholarship_id,
                year,
                period,
                modality
            ) VALUES (?, ?, ?, ?, ?)
            `,
            [user_id, scholarship_id, year, period, modality]
        );

        res.status(201).json({ status: true, message: 'La postulación se ha creado exitosamente.' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Error al crear la postulación.'});
    }
};
