import { Cliente, ICliente } from '../models/Cliente';
import { httpError } from '../utils/httpError';
import { connectDB } from '../db';

export const normalizarNombre = (nombre: string): string => nombre.trim().replace(/\s+/g, ' ');
export const normalizarWhatsapp = (whatsapp: string): string => whatsapp.trim();
export const escaparRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const buscarClienteDuplicado = async (nombre: string, whatsapp: string, excludeId?: string): Promise<ICliente | null> => {
  await connectDB();
  const query: Record<string, unknown> = {
    nombre: new RegExp(`^${escaparRegex(nombre)}$`, 'i'),
    whatsapp
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  return Cliente.findOne(query);
};

export const registrarCliente = async (datos: { nombre: string; whatsapp: string }): Promise<ICliente> => {
  await connectDB();
  const nombreNormalizado = normalizarNombre(datos.nombre);
  const whatsappNormalizado = normalizarWhatsapp(datos.whatsapp);
  const duplicado = await buscarClienteDuplicado(nombreNormalizado, whatsappNormalizado);

  if (duplicado) {
    throw httpError(409, 'Este usuario ya se encuentra registrado');
  }

  return Cliente.create({
    nombre: nombreNormalizado,
    whatsapp: whatsappNormalizado
  });
};

export const obtenerClientes = async (): Promise<ICliente[]> => {
  await connectDB();
  return Cliente.find().sort({ fechaRegistro: -1 });
};

export const obtenerClientePorId = async (id: string): Promise<ICliente> => {
  await connectDB();
  const cliente = await Cliente.findById(id);
  if (!cliente) {
    throw httpError(404, 'Cliente no encontrado');
  }
  return cliente;
};

export const agregarVisita = async (clienteId: string, datos: { servicio: string; monto: number }): Promise<ICliente> => {
  await connectDB();
  const cliente = await obtenerClientePorId(clienteId);
  const montoNumerico = Number(datos.monto);

  if (!Number.isFinite(montoNumerico) || montoNumerico < 0) {
    throw httpError(400, 'El monto debe ser un numero valido y no negativo');
  }

  cliente.historialVisitas.push({
    servicio: datos.servicio.trim(),
    monto: montoNumerico,
    fecha: new Date()
  });
  cliente.totalVisitas = cliente.historialVisitas.length;

  await cliente.save();
  return cliente;
};

export const actualizarCliente = async (id: string, datos: { nombre: string; whatsapp: string }): Promise<ICliente> => {
  await connectDB();
  const nombreNormalizado = normalizarNombre(datos.nombre);
  const whatsappNormalizado = normalizarWhatsapp(datos.whatsapp);
  const duplicado = await buscarClienteDuplicado(nombreNormalizado, whatsappNormalizado, id);

  if (duplicado) {
    throw httpError(409, 'Este usuario ya se encuentra registrado');
  }

  const cliente = await Cliente.findByIdAndUpdate(
    id,
    {
      nombre: nombreNormalizado,
      whatsapp: whatsappNormalizado
    },
    { new: true, runValidators: true }
  );

  if (!cliente) {
    throw httpError(404, 'Cliente no encontrado');
  }

  return cliente;
};

export const eliminarCliente = async (id: string): Promise<ICliente> => {
  await connectDB();
  const cliente = await Cliente.findByIdAndDelete(id);
  if (!cliente) {
    throw httpError(404, 'Cliente no encontrado');
  }
  return cliente;
};

export const clienteService = {
  registrarCliente,
  obtenerClientes,
  obtenerClientePorId,
  agregarVisita,
  actualizarCliente,
  eliminarCliente
};

export default clienteService;
