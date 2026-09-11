import sharp from 'sharp';
import { Portafolio, IPortafolio, TipoServicio } from '../models/Portafolio';
import { httpError } from '../utils/httpError';
import { getStorageProvider } from '../storage';
import { connectDB } from '../db';

export const optimizarBufferWebp = async (buffer: Buffer): Promise<Buffer> => {
  return sharp(buffer)
    .resize(800)
    .webp({ quality: 80 })
    .toBuffer();
};

export const crearPortafolio = async (
  datos: { tipoServicio: TipoServicio; descripcion?: string },
  archivos: { fotoAntes: Buffer; fotoDespues: Buffer }
): Promise<IPortafolio> => {
  await connectDB();
  const storage = getStorageProvider();
  const timestamp = Date.now();

  const [bufferAntes, bufferDespues] = await Promise.all([
    optimizarBufferWebp(archivos.fotoAntes),
    optimizarBufferWebp(archivos.fotoDespues)
  ]);

  const [fotoAntesUrl, fotoDespuesUrl] = await Promise.all([
    storage.save(bufferAntes, `antes-${timestamp}.webp`),
    storage.save(bufferDespues, `despues-${timestamp}.webp`)
  ]);

  return Portafolio.create({
    tipoServicio: datos.tipoServicio,
    descripcion: datos.descripcion ? datos.descripcion.trim() : '',
    fotoAntesUrl,
    fotoDespuesUrl
  });
};

export const obtenerPortafolios = async (): Promise<IPortafolio[]> => {
  await connectDB();
  return Portafolio.find().sort({ fechaCreacion: -1 });
};

export const actualizarPortafolio = async (
  id: string,
  datos: { tipoServicio?: TipoServicio; descripcion?: string }
): Promise<IPortafolio> => {
  await connectDB();
  const updateData: Record<string, unknown> = {};

  if (datos.tipoServicio) updateData.tipoServicio = datos.tipoServicio;
  if (datos.descripcion !== undefined) updateData.descripcion = datos.descripcion.trim();

  const portafolio = await Portafolio.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  });

  if (!portafolio) {
    throw httpError(404, 'El elemento no existe');
  }

  return portafolio;
};

export const eliminarPortafolio = async (id: string): Promise<IPortafolio> => {
  await connectDB();
  const portafolio = await Portafolio.findByIdAndDelete(id);

  if (!portafolio) {
    throw httpError(404, 'El elemento no existe');
  }

  const storage = getStorageProvider();
  await Promise.all([
    storage.delete(portafolio.fotoAntesUrl),
    storage.delete(portafolio.fotoDespuesUrl)
  ]);

  return portafolio;
};

export const portafolioService = {
  crearPortafolio,
  obtenerPortafolios,
  actualizarPortafolio,
  eliminarPortafolio,
  optimizarBufferWebp
};

export default portafolioService;
