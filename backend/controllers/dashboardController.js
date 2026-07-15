const Cliente = require('../models/Cliente');
const Portafolio = require('../models/Portafolio');

exports.obtenerMetricas = async (req, res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    try {
        // 1. Total de clientes registrados
        const totalClientes = await Cliente.countDocuments();

        // 2. Total de trabajos expuestos en portafolio
        const totalPortafolios = await Portafolio.countDocuments();

        // 3. Agregaciones sobre el historial de visitas de clientes
        const agregacionVisitas = await Cliente.aggregate([
            { $unwind: "$historialVisitas" },
            {
                $group: {
                    _id: null,
                    ingresosTotales: { $sum: "$historialVisitas.monto" },
                    totalServiciosPrestados: { $sum: 1 }
                }
            }
        ]);

        const ingresosTotales = agregacionVisitas[0]?.ingresosTotales || 0;
        const totalServicios = agregacionVisitas[0]?.totalServiciosPrestados || 0;

        // 4. Servicios más solicitados (Ranking - Agrupado por categoría principal)
        const serviciosTop = await Cliente.aggregate([
            { $unwind: "$historialVisitas" },
            { 
                $group: { 
                    // Tomamos el servicio, lo partimos por " - " y tomamos el primer elemento (índice 0)
                    _id: { $arrayElemAt: [{ $split: ["$historialVisitas.servicio", " - "] }, 0] }, 
                    cantidad: { $sum: 1 } 
                } 
            },
            { $sort: { cantidad: -1 } },
            { $limit: 3 }
        ]);

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
        res.status(500).json({ mensaje: 'Error al calcular métricas', error: error.message });
    }
};
