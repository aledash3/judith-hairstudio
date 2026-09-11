import { NextResponse } from 'next/server';
import { dashboardService } from '@/lib/services/dashboardService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filtro = searchParams.get('filtro') || undefined;
    const metricas = await dashboardService.obtenerMetricas(filtro);

    return NextResponse.json(metricas, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, private'
      }
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ mensaje: err.message || 'Error al obtener metricas' }, { status: 500 });
  }
}
