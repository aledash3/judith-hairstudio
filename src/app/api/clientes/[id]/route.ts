import { NextResponse } from 'next/server';
import { clienteService } from '@/lib/services/clienteService';
import { validarCliente } from '@/lib/validators/clienteValidator';
import { HttpError } from '@/lib/utils/httpError';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cliente = await clienteService.obtenerClientePorId(id);
    return NextResponse.json(cliente, { status: 200 });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json({ mensaje: error.message }, { status: error.statusCode });
    }
    const err = error as Error;
    return NextResponse.json({ mensaje: err.message || 'Error al obtener cliente' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const errores = validarCliente(body);
    if (errores.length > 0) {
      return NextResponse.json({ errores }, { status: 400 });
    }

    const cliente = await clienteService.actualizarCliente(id, body);
    return NextResponse.json(cliente, { status: 200 });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json({ mensaje: error.message }, { status: error.statusCode });
    }
    const err = error as Error;
    return NextResponse.json({ mensaje: err.message || 'Error al actualizar cliente' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await clienteService.eliminarCliente(id);
    return NextResponse.json({ mensaje: 'Cliente eliminado correctamente' }, { status: 200 });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json({ mensaje: error.message }, { status: error.statusCode });
    }
    const err = error as Error;
    return NextResponse.json({ mensaje: err.message || 'Error al eliminar cliente' }, { status: 500 });
  }
}
