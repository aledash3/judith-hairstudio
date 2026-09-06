const Cliente = require('../models/Cliente');
const Portafolio = require('../models/Portafolio');

const obtenerFechaInicio = (filtro = 'mes') => {
    const fechaInicio = new Date();

    if (filtro === 'dia') {
        fechaInicio.setHours(0, 0, 0, 0);
        return fechaInicio;
    }

    if (filtro === 'semana') {
        fechaInicio.setDate(fechaInicio.getDate() - 7);
        return fechaInicio;
    }

    fechaInicio.setDate(fechaInicio.getDate() - 30);
    return fechaInicio;
};

const obtenerMetricas = async (filtro) => {
    const fechaInicio = obtenerFechaInicio(filtro);

    const [totalClientes, totalPortafolios, agregacionVisitas, serviciosTop] = await Promise.all([
        Cliente.countDocuments(),
        Portafolio.countDocuments(),
        Cliente.aggregate([
            { $unwind: '$historialVisitas' },
            { $match: { 'historialVisitas.fecha': { $gte: fechaInicio } } },
            {
                $group: {
                    _id: null,
                    ingresosTotales: { $sum: '$historialVisitas.monto' },
                    totalServiciosPrestados: { $sum: 1 }
                }
            }
        ]),
        Cliente.aggregate([
            { $unwind: '$historialVisitas' },
            { $match: { 'historialVisitas.fecha': { $gte: fechaInicio } } },
            {
                $group: {
                    _id: {
                        $arrayElemAt: [
                            { $split: ['$historialVisitas.servicio', ' - '] },
                            0
                        ]
                    },
                    cantidad: { $sum: 1 }
                }
            },
            { $sort: { cantidad: -1 } },
            { $limit: 3 }
        ])
    ]);

    return {
        kpis: {
            totalClientes,
            totalPortafolios,
            ingresosTotales: agregacionVisitas[0]?.ingresosTotales || 0,
            totalServicios: agregacionVisitas[0]?.totalServiciosPrestados || 0
        },
        serviciosTop
    };
};

module.exports = {
    obtenerMetricas
};
