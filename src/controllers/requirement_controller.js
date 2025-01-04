const db = require('../config/database');

// Obtener becas con requisitos filtrado por el ID del usuario postulante
exports.getScholarshipsWithRequirements = async (req, res) => {
    try {
        const { scholarshipId, userId } = req.params; // Obtener los parámetros de la ruta

        if (!userId || !scholarshipId) return res.status(400).json({
            status: false,
            message: 'El ID del usuario y el ID de la beca son requeridos.',
        });
        
        // Consulta para obtener las becas con sus requisitos
        const [requirements] = await db.execute(`
            SELECT 
                s.id AS scholarship_id,
                r.id AS requirement_id,
                r.name AS requirement_name,
                r.description AS requirement_description,
                COALESCE(r.icon, r.logo) AS requirement_image
            FROM scholarship_requirement sr
            JOIN scholarship s ON sr.scholarship_id = s.id
            JOIN requirement r ON sr.requirement_id = r.id
            WHERE s.id = ? -- Filtrar por el ID de la beca
        `, [scholarshipId]);

        // Consulta para obtener la ubicación del usuario postulante
        const [userLocation] = await db.execute(`
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
        `, [userId]);

        const userLocationData = userLocation.length > 0 ? userLocation[0] : null;

        // Generar el listado de los requisitos
        const requirementsList = requirements.map((requirement) => {
            const formattedRequirement = {
                id: requirement.requirement_id,
                image: requirement.requirement_image,
                name: requirement.requirement_name,
                description: requirement.requirement_description,
            };

            // Si el requisito es de tipo 'location', asociar la ubicación del usuario
            if (requirement.requirement_name === 'location') {
                if (!userLocationData) {
                    formattedRequirement.userLocation = null;
                    return formattedRequirement;
                };

                formattedRequirement.userLocation = {
                    user_id: userLocationData.user_id,
                    email: userLocationData.email,
                    address: userLocationData.address,
                    city: userLocationData.city,
                    country: userLocationData.country,
                    latitude: userLocationData.latitude,
                    longitude: userLocationData.longitude,
                };
            }

            return formattedRequirement;
        });

        res.status(200).json({ status: true, scholarship_id: scholarshipId, requirements: requirementsList });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Error al obtener becas con requisitos.' });
    }
};
