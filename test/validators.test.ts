import test from 'node:test';
import assert from 'node:assert/strict';
import { validarCliente, validarVisita } from '../src/lib/validators/clienteValidator';

test('acepta un telefono ecuatoriano de exactamente 10 digitos comenzando con 09', () => {
  assert.deepEqual(validarCliente({ nombre: 'Maria Lopez', whatsapp: '0995436787' }), []);
});

test('rechaza telefonos con longitud o caracteres invalidos', () => {
  assert.ok(validarCliente({ nombre: 'Maria Lopez', whatsapp: '099543678' }).length > 0);
  assert.ok(validarCliente({ nombre: 'Maria Lopez', whatsapp: '09ABC56787' }).length > 0);
  assert.ok(validarCliente({ nombre: 'Maria Lopez', whatsapp: '0895436787' }).length > 0);
});

test('rechaza nombres demasiado cortos o vacios', () => {
  assert.ok(validarCliente({ nombre: 'Ma', whatsapp: '0995436787' }).length > 0);
  assert.ok(validarCliente({ nombre: '', whatsapp: '0995436787' }).length > 0);
  assert.ok(validarCliente({ nombre: '   ', whatsapp: '0995436787' }).length > 0);
});

test('rechaza montos negativos y acepta cero', () => {
  assert.ok(validarVisita({ servicio: 'Corte - Capas', monto: -1 }).includes('No se puede ingresar un monto negativo'));
  assert.deepEqual(validarVisita({ servicio: 'Corte - Capas', monto: 0 }), []);
  assert.deepEqual(validarVisita({ servicio: 'Corte - Capas', monto: 25.50 }), []);
});

test('rechaza servicios con longitud invalida', () => {
  assert.ok(validarVisita({ servicio: 'Co', monto: 15 }).length > 0);
  assert.ok(validarVisita({ servicio: '', monto: 15 }).length > 0);
});
