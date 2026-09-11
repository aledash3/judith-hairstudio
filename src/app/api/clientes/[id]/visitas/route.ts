import { NextResponse } from 'next/server';
import { clienteService } from '@/lib/services/clienteService';
import { validarVisita } from '@/lib/validators/clienteValidator';
import { HttpError } from '@/lib/utils/httpError';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const errores = validarVisita(body);
    if (errores.length > 0) {
      return NextResponse.json({ errores }, { status: 400 });
    }

    const cliente = await clienteService.agregarVisita(id, body);
    return NextResponse.json(cliente, { status: 200 });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json({ mensaje: error.message }, { status: error.statusCode });
    }
    const err = error as Error;
    return NextResponse.json({ mensaje: err.message || 'Error al registrar visita' }, { status: 500 });
  }
}
