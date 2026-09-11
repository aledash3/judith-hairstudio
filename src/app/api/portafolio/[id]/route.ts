export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { portafolioService } from '@/lib/services/portafolioService';
import { validarPortafolio } from '@/lib/validators/portafolioValidator';
import { HttpError } from '@/lib/utils/httpError';
import { TipoServicio } from '@/lib/models/Portafolio';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { tipoServicio, descripcion } = body;

    const errores = validarPortafolio(tipoServicio, descripcion);
    if (errores.length > 0) {
      return NextResponse.json({ errores }, { status: 400 });
    }

    const portafolio = await portafolioService.actualizarPortafolio(id, {
      tipoServicio: tipoServicio as TipoServicio,
      descripcion
    });

    return NextResponse.json(portafolio, { status: 200 });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json({ mensaje: error.message }, { status: error.statusCode });
    }
    const err = error as Error;
    return NextResponse.json({ mensaje: err.message || 'Error al actualizar elemento' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await portafolioService.eliminarPortafolio(id);
    return NextResponse.json({ mensaje: 'Elemento eliminado correctamente' }, { status: 200 });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json({ mensaje: error.message }, { status: error.statusCode });
    }
    const err = error as Error;
    return NextResponse.json({ mensaje: err.message || 'Error al eliminar elemento' }, { status: 500 });
  }
}
