export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { portafolioService } from '@/lib/services/portafolioService';
import { validarPortafolio } from '@/lib/validators/portafolioValidator';
import { HttpError } from '@/lib/utils/httpError';
import { TipoServicio } from '@/lib/models/Portafolio';

export async function GET() {
  try {
    const portafolios = await portafolioService.obtenerPortafolios();
    return NextResponse.json(portafolios, { status: 200 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ mensaje: err.message || 'Error al obtener portafolio' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const tipoServicio = formData.get('tipoServicio') as TipoServicio;
    const descripcion = (formData.get('descripcion') as string) || '';

    const errores = validarPortafolio(tipoServicio, descripcion);
    if (errores.length > 0) {
      return NextResponse.json({ errores }, { status: 400 });
    }

    const fileAntes = formData.get('fotoAntes') as File | null;
    const fileDespues = formData.get('fotoDespues') as File | null;

    if (!fileAntes || !fileDespues) {
      return NextResponse.json(
        { errores: ['Se requieren ambas fotografias (fotoAntes y fotoDespues)'] },
        { status: 400 }
      );
    }

    const bufferAntes = Buffer.from(await fileAntes.arrayBuffer());
    const bufferDespues = Buffer.from(await fileDespues.arrayBuffer());

    const nuevoPortafolio = await portafolioService.crearPortafolio(
      { tipoServicio, descripcion },
      { fotoAntes: bufferAntes, fotoDespues: bufferDespues }
    );

    return NextResponse.json(nuevoPortafolio, { status: 201 });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json({ mensaje: error.message }, { status: error.statusCode });
    }
    const err = error as Error;
    return NextResponse.json({ mensaje: err.message || 'Error al crear elemento de portafolio' }, { status: 500 });
  }
}
