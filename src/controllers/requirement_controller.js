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

// Obtener los requisitos de una postulación
exports.getRequirementsByApplication = async (req, res) => {
    try {
        const { applicationId, userId } = req.params; // Obtener applicationId y userId desde los parámetros

        // Validar que el applicationId esté presente
        if (!applicationId || !userId) {
            return res.status(400).json({
                status: false,
                message: 'El ID de la postulación y el del usuario es obligatorio.',
            });
        }

        // Obtener la ubicación del usuario
        const [userLocationRows] = await db.execute(
            `
            SELECT 
                u.id AS user_id,
                l.address,
                l.city,
                l.country,
                l.latitude,
                l.longitude
            FROM user u
            JOIN location l ON u.location_id = l.id
            WHERE u.id = ?
            `,
            [userId]
        );

        const userLocation = userLocationRows.length > 0 ? userLocationRows[0] : null;

        // Obtener los requisitos de la postulación con sus estados
        const [requirements] = await db.execute(
            `
            SELECT 
                ar.requirement_id,
                r.name AS requirement_name,
                r.description AS requirement_description,
                r.route AS requirement_route,
                r.required AS requirement_required,
                COALESCE(r.icon, r.logo) AS requirement_image,
                ar.status AS requirement_status,
                ar.load_documentation AS documentation_status
            FROM application_requirement ar
            JOIN requirement r ON ar.requirement_id = r.id
            WHERE ar.application_id = ?     
            `,
            [applicationId]
        );

        // Verificar si se encontraron requisitos
        if (requirements.length === 0) {
            return res.status(404).json({
                status: false,
                message: 'No se encontraron requisitos para esta postulación.',
            });
        }

        // Formatear los datos de los requisitos
        const requirementsList = requirements.map((req) => {
            const formattedRequirement = {
                id: req.requirement_id,
                image: req.requirement_image,
                name: req.requirement_name,
                description: req.requirement_description,
                route: req.requirement_route,
                required: !!req.requirement_required,
                status: (req.requirement_status !== null) ? !!req.requirement_status : req.requirement_status,
            };

            // Si el requisito es de tipo "location", incluir la ubicación del usuario
            if (req.requirement_name.toLowerCase() === 'location') {
                formattedRequirement.userLocation = userLocation;
            }

            return formattedRequirement;
        });

        res.status(200).json({ status: true, application_id: Number(applicationId), requirements: requirementsList });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Error al obtener los requisitos de la postulación.' });
    }
};