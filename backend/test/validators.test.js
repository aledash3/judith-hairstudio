const test = require('node:test');
const assert = require('node:assert/strict');

const { validarCliente, validarVisita } = require('../validators/clienteValidator');

test('acepta un telefono ecuatoriano de exactamente 10 digitos', () => {
    assert.deepEqual(validarCliente({ body: { nombre: 'Maria Lopez', whatsapp: '0995436787' } }), []);
});

test('rechaza telefonos con longitud o caracteres invalidos', () => {
    assert.ok(validarCliente({ body: { nombre: 'Maria Lopez', whatsapp: '099543678' } }).length > 0);
    assert.ok(validarCliente({ body: { nombre: 'Maria Lopez', whatsapp: '09ABC56787' } }).length > 0);
});

test('rechaza montos negativos y acepta cero', () => {
    assert.ok(validarVisita({ body: { servicio: 'Corte - Capas', monto: -1 } }).includes('No se puede ingresar un monto negativo'));
    assert.deepEqual(validarVisita({ body: { servicio: 'Corte - Capas', monto: 0 } }), []);
});
