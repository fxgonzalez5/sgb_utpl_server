const axios = require('axios');

// Obtener la dirección desde Mapbox filtrando solo feature_type = "street"
exports.getStreetAddress = async (req, res) => {
    try {
        const { longitude, latitude } = req.params;

        if (!longitude || !latitude) {
            return res.status(400).json({
                status: false,
                message: 'La longitud y la latitud son obligatorias.',
            });
        }

        // Construir la URL del endpoint de Mapbox
        const mapboxApiKey = process.env.MAPBOX_KEY; // Se recomienda almacenar la clave en variables de entorno
        const url = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${longitude}&latitude=${latitude}&access_token=${mapboxApiKey}`;

        // Hacer la solicitud a Mapbox
        const response = await axios.get(url);

       // Intentar obtener primero el feature_type = "address"
        let locationFeature = response.data.features.find(
            (feature) => feature.properties.feature_type === "address"
        );

        // Si no se encuentra "address", buscar "street"
        if (!locationFeature) {
            locationFeature = response.data.features.find(
                (feature) => feature.properties.feature_type === "street"
            );
        }

        // Si no hay ni "address" ni "street", devolver error
        if (!locationFeature) {
            return res.status(404).json({
                status: false,
                message: 'No se encontró una dirección con tipo "address" ni "street".',
            });
        }

        // Construir la respuesta con el nuevo formato
        const locationData = {
            full_address: locationFeature.properties.full_address,
            coordinates: {
                longitude: locationFeature.geometry.coordinates[0],
                latitude: locationFeature.geometry.coordinates[1],
            },
            address: locationFeature.properties.context.street.name,
            country: locationFeature.properties.context.country.name,
            region: locationFeature.properties.context.region.name,
            city: locationFeature.properties.context.place.name,
        };

        res.status(200).json({ status: true, data: locationData });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Error al obtener la dirección desde Mapbox.' });
    }
};
