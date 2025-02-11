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
        const { userId, year, period, modality } = req.params;

        // Validar datos de entrada
        if (!userId || !year || !period || !modality) {
            return res.status(400).json({
                status: false,
                message: 'El ID del usuario, el año, el periodo y la modalidad son obligatorios.',
            });
        }

        // Consulta para verificar la postulación
        const [rows] = await db.execute(
            `
            SELECT id, scholarship_id
            FROM applications
            WHERE user_id = ? AND year = ? AND period = ? AND modality = ?
            LIMIT 1
            `,
            [userId, year, period, modality]
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

exports.getUserApplications = async (req, res) => {
    try {
        const { userId } = req.params; // Obtener el ID del usuario

        if (!userId) {
            return res.status(400).json({
                status: false,
                message: 'El ID del usuario es obligatorio.',
            });
        }

        // Consulta para obtener las postulaciones del usuario con la información de la beca
        const [applications] = await db.execute(
            `
            SELECT 
                a.id AS application_id,
                a.scholarship_id,
                s.type AS scholarship_type,
                a.year,
                a.period,
                a.modality,
                a.application_date,
                a.status,
                a.observations
            FROM applications a
            JOIN scholarship s ON a.scholarship_id = s.id
            WHERE a.user_id = ?
            `,
            [userId]
        );

        // Verificar si el usuario tiene postulaciones
        if (applications.length === 0) {
            return res.status(404).json({
                status: false,
                message: 'No se encontraron postulaciones para este usuario.',
            });
        }

        // Formatear la respuesta con las postulaciones
        const applicationList = applications.map((record) => ({
            application_id: record.application_id,
            scholarship_id: record.scholarship_id,
            scholarship_type: record.scholarship_type,
            year: record.year,
            period: record.period,
            modality: record.modality,
            application_date: record.application_date,
            status: record.status,
            observations: record.observations,
        }));

        res.status(200).json({ status: true, applications: applicationList });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Error al obtener las postulaciones del usuario.' });
    }
};

exports.deleteApplication = async (req, res) => {
    try {
        const { applicationId } = req.params; // Obtener el ID de la postulación desde la URL

        if (!applicationId) {
            return res.status(400).json({
                status: false,
                message: 'El ID de la postulación es obligatorio.',
            });
        }

        // Verificar si la postulación existe antes de eliminarla
        const [existingApplication] = await db.execute(
            `SELECT id FROM applications WHERE id = ?`,
            [applicationId]
        );

        if (existingApplication.length === 0) {
            return res.status(404).json({
                status: false,
                message: 'No se encontró la postulación especificada.',
            });
        }

        // Eliminar la postulación
        const [deleteResult] = await db.execute(
            `DELETE FROM applications WHERE id = ?`,
            [applicationId]
        );

        // Verificar si se eliminó correctamente
        if (deleteResult.affectedRows === 0) {
            return res.status(500).json({
                status: false,
                message: 'No se pudo eliminar la postulación.',
            });
        }

        res.status(200).json({ status: true, message: 'Postulación eliminada correctamente.' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Error al eliminar la postulación.' });
    }
};