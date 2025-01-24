const db = require('../config/database');

// Obtener becas con sus respectivos requisitos
exports.getScholarshipsWithRequirements = async (req, res) => {
    try {
        const { scholarshipId } = req.params; // Obtener el parámetro de la ruta

        if (!scholarshipId) {
            return res.status(400).json({
                status: false,
                message: 'El ID de la beca es requerido.',
            });
        }

        // Consulta para obtener los requisitos de la beca
        const [requirements] = await db.execute(`
            SELECT 
                s.id AS scholarship_id,
                r.id AS requirement_id,
                r.name AS requirement_name,
                r.description AS requirement_description,
                r.route AS requirement_route,
                r.required as requirement_required,
                COALESCE(r.icon, r.logo) AS requirement_image
            FROM scholarship_requirement sr
            JOIN scholarship s ON sr.scholarship_id = s.id
            JOIN requirement r ON sr.requirement_id = r.id
            WHERE s.id = ?
        `, [scholarshipId]);

        // Generar el listado de los requisitos
        const requirementsList = requirements.map((requirement) => ({
            id: requirement.requirement_id,
            image: requirement.requirement_image,
            name: requirement.requirement_name,
            description: requirement.requirement_description,
            route: requirement.requirement_route,
            required: !!requirement.requirement_required,
        }));

        res.status(200).json({ status: true, scholarship_id: Number(scholarshipId), requirements: requirementsList });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Error al obtener los requisitos de la beca.' });
    }
};
