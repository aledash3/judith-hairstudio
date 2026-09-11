import { NextResponse } from 'next/server';
import { clienteService } from '@/lib/services/clienteService';
import { validarCliente } from '@/lib/validators/clienteValidator';
import { HttpError } from '@/lib/utils/httpError';

export async function GET() {
  try {
    const clientes = await clienteService.obtenerClientes();
    return NextResponse.json(clientes, { status: 200 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ mensaje: err.message || 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const errores = validarCliente(body);
    if (errores.length > 0) {
      return NextResponse.json({ errores }, { status: 400 });
    }

    const cliente = await clienteService.registrarCliente(body);
    return NextResponse.json(cliente, { status: 201 });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json({ mensaje: error.message }, { status: error.statusCode });
    }
    const err = error as Error;
    return NextResponse.json({ mensaje: err.message || 'Error interno del servidor' }, { status: 500 });
  }
}
