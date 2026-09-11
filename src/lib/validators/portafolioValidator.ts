export function validarPortafolio(tipoServicio?: string, descripcion?: string): string[] {
  const errores: string[] = [];
  const tiposValidos = ['Corte', 'Tinte', 'Keratina', 'Peinado', 'Otros'];

  if (!tipoServicio || !tiposValidos.includes(tipoServicio)) {
    errores.push(`El tipo de servicio debe ser uno de: ${tiposValidos.join(', ')}`);
  }

  if (descripcion && descripcion.length > 500) {
    errores.push('La descripcion no puede superar los 500 caracteres');
  }

  return errores;
}
