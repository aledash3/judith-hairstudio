const Cliente = require('../models/Cliente');
const Portafolio = require('../models/Portafolio');

exports.obtenerMetricas = async (req, res) => {

    const { filtro = 'mes' } = req.query;

    let fechaInicio = new Date();

    switch (filtro) {

        case 'dia':
            fechaInicio.setHours(0, 0, 0, 0);
            break;

        case 'semana':
            fechaInicio.setDate(fechaInicio.getDate() - 7);
            break;

        case 'mes':
            fechaInicio.setDate(fechaInicio.getDate() - 30);
            break;

        default:
            fechaInicio.setDate(fechaInicio.getDate() - 30);

    }

    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');

    try {

        // ==========================================
        // KPIs GENERALES
        // ==========================================

        const totalClientes = await Cliente.countDocuments();

        const totalPortafolios = await Portafolio.countDocuments();

        // ==========================================
        // INGRESOS Y SERVICIOS SEGÚN EL FILTRO
        // ==========================================

        const agregacionVisitas = await Cliente.aggregate([

            { $unwind: "$historialVisitas" },

            {
                $match: {
                    "historialVisitas.fecha": {
                        $gte: fechaInicio
                    }
                }
            },

            {
                $group: {
                    _id: null,

                    ingresosTotales: {
                        $sum: "$historialVisitas.monto"
                    },

                    totalServiciosPrestados: {
                        $sum: 1
                    }
                }
            }

        ]);

        const ingresosTotales =
            agregacionVisitas[0]?.ingresosTotales || 0;

        const totalServicios =
            agregacionVisitas[0]?.totalServiciosPrestados || 0;

        // ==========================================
        // SERVICIOS MÁS SOLICITADOS
        // ==========================================

        const serviciosTop = await Cliente.aggregate([

            { $unwind: "$historialVisitas" },

            {
                $match: {
                    "historialVisitas.fecha": {
                        $gte: fechaInicio
                    }
                }
            },

            {
                $group: {

                    _id: {

                        $arrayElemAt: [

                            {
                                $split: [
                                    "$historialVisitas.servicio",
                                    " - "
                                ]
                            },

                            0

                        ]

                    },

                    cantidad: {
                        $sum: 1
                    }

                }
            },

            {
                $sort: {
                    cantidad: -1
                }
            },

            {
                $limit: 3
            }

        ]);

        // ==========================================
        // RESPUESTA
        // ==========================================

        res.status(200).json({

            kpis: {

                totalClientes,
                totalPortafolios,
                ingresosTotales,
                totalServicios

            },

            serviciosTop

        });

    } catch (error) {

        res.status(500).json({

            mensaje: "Error al calcular métricas",

            error: error.message

        });

    }

};