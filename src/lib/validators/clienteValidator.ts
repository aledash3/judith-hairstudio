export function validarCliente(body: { nombre?: unknown; whatsapp?: unknown }): string[] {
  const errores: string[] = [];
  const { nombre, whatsapp } = body || {};

  if (typeof nombre !== 'string' || nombre.trim().length < 3 || nombre.trim().length > 120) {
    errores.push('El nombre es requerido y debe tener entre 3 y 120 caracteres');
  }

  if (typeof whatsapp !== 'string' || !/^09\d{8}$/.test(whatsapp.trim())) {
    errores.push('El numero de telefono debe ser ecuatoriano y contener exactamente 10 digitos comenzando con 09');
  }

  return errores;
}

export function validarVisita(body: { servicio?: unknown; monto?: unknown }): string[] {
  const errores: string[] = [];
  const { servicio, monto } = body || {};

  if (typeof servicio !== 'string' || servicio.trim().length < 3 || servicio.trim().length > 120) {
    errores.push('El servicio es requerido y debe tener entre 3 y 120 caracteres');
  }

  const montoNumerico = Number(monto);
  if (monto === undefined || monto === null || !Number.isFinite(montoNumerico) || montoNumerico < 0 || montoNumerico > 100000) {
    errores.push('No se puede ingresar un monto negativo');
  }

  return errores;
}
