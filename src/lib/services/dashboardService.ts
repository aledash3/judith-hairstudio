import { Cliente } from '../models/Cliente';
import { Portafolio } from '../models/Portafolio';
import { connectDB } from '../db';

export const obtenerFechaInicio = (filtro: string = 'mes'): Date => {
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

export interface DashboardMetricas {
  kpis: {
    totalClientes: number;
    totalPortafolios: number;
    ingresosTotales: number;
    totalServicios: number;
  };
  serviciosTop: Array<{ _id: string; cantidad: number }>;
}

export const obtenerMetricas = async (filtro?: string): Promise<DashboardMetricas> => {
  await connectDB();
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

export const dashboardService = {
  obtenerMetricas
};

export default dashboardService;
