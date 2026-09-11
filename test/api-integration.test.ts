import test, { mock } from 'node:test';
import assert from 'node:assert/strict';

import { clienteService } from '../src/lib/services/clienteService';
import { dashboardService } from '../src/lib/services/dashboardService';
import { portafolioService } from '../src/lib/services/portafolioService';

import { GET as getClientes, POST as postCliente } from '../src/app/api/clientes/route';
import { GET as getClienteById, PUT as putCliente, DELETE as deleteCliente } from '../src/app/api/clientes/[id]/route';
import { POST as postVisita } from '../src/app/api/clientes/[id]/visitas/route';
import { GET as getDashboardMetricas } from '../src/app/api/dashboard/metricas/route';
import { GET as getPortafolios } from '../src/app/api/portafolio/route';
import { PUT as putPortafolio, DELETE as deletePortafolio } from '../src/app/api/portafolio/[id]/route';

test('API Route Handlers - Integracion de Endpoints', async (t) => {
  const fakeClienteId = '65f1a2b3c4d5e6f7a8b9c0d1';
  const fakePortafolioId = '65f1a2b3c4d5e6f7a8b9c0d2';

  // 1. POST /api/clientes (Validacion de telefono invalido)
  await t.test('POST /api/clientes rechaza telefono no ecuatoriano con 400', async () => {
    const req = new Request('http://localhost:3000/api/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: 'Camila Morales', whatsapp: '12345' })
    });

    const res = await postCliente(req);
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.ok(data.errores.length > 0);
  });

  // 2. POST /api/clientes (Exito)
  await t.test('POST /api/clientes crea cliente y retorna 201', async () => {
    // @ts-ignore
    mock.method(clienteService, 'registrarCliente', async (datos) => ({
      _id: fakeClienteId,
      nombre: datos.nombre,
      whatsapp: datos.whatsapp,
      historialVisitas: [],
      totalVisitas: 0,
      fechaRegistro: new Date()
    }));

    const req = new Request('http://localhost:3000/api/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: 'Camila Morales', whatsapp: '0998765432' })
    });

    const res = await postCliente(req);
    assert.equal(res.status, 201);
    const data = await res.json();
    assert.equal(data.nombre, 'Camila Morales');
    assert.equal(data.whatsapp, '0998765432');
  });

  // 3. GET /api/clientes
  await t.test('GET /api/clientes retorna listado con 200', async () => {
    // @ts-ignore
    mock.method(clienteService, 'obtenerClientes', async () => [
      { _id: fakeClienteId, nombre: 'Camila Morales', whatsapp: '0998765432', totalVisitas: 0 }
    ]);

    const res = await getClientes();
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(Array.isArray(data), true);
    assert.equal(data.length, 1);
    assert.equal(data[0].nombre, 'Camila Morales');
  });

  // 4. GET /api/clientes/[id] con params como Promise (Next.js 15)
  await t.test('GET /api/clientes/[id] resuelve params asincronos y retorna 200', async () => {
    // @ts-ignore
    mock.method(clienteService, 'obtenerClientePorId', async (id) => ({
      _id: id,
      nombre: 'Camila Morales',
      whatsapp: '0998765432'
    }));

    const req = new Request(`http://localhost:3000/api/clientes/${fakeClienteId}`);
    const res = await getClienteById(req, {
      params: Promise.resolve({ id: fakeClienteId })
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data._id, fakeClienteId);
    assert.equal(data.nombre, 'Camila Morales');
  });

  // 5. POST /api/clientes/[id]/visitas rechaza monto negativo
  await t.test('POST /api/clientes/[id]/visitas rechaza monto negativo con 400', async () => {
    const req = new Request(`http://localhost:3000/api/clientes/${fakeClienteId}/visitas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ servicio: 'Balayage', monto: -50 })
    });

    const res = await postVisita(req, {
      params: Promise.resolve({ id: fakeClienteId })
    });

    assert.equal(res.status, 400);
    const data = await res.json();
    assert.ok(data.errores.some((e: string) => e.includes('negativo')));
  });

  // 6. POST /api/clientes/[id]/visitas exito
  await t.test('POST /api/clientes/[id]/visitas agrega visita y retorna 200', async () => {
    // @ts-ignore
    mock.method(clienteService, 'agregarVisita', async (id, datos) => ({
      _id: id,
      nombre: 'Camila Morales',
      whatsapp: '0998765432',
      totalVisitas: 1,
      historialVisitas: [{ servicio: datos.servicio, monto: datos.monto, fecha: new Date() }]
    }));

    const req = new Request(`http://localhost:3000/api/clientes/${fakeClienteId}/visitas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ servicio: 'Balayage', monto: 75.00 })
    });

    const res = await postVisita(req, {
      params: Promise.resolve({ id: fakeClienteId })
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.totalVisitas, 1);
    assert.equal(data.historialVisitas[0].monto, 75);
  });

  // 7. PUT /api/clientes/[id]
  await t.test('PUT /api/clientes/[id] actualiza y retorna 200', async () => {
    // @ts-ignore
    mock.method(clienteService, 'actualizarCliente', async (id, datos) => ({
      _id: id,
      nombre: datos.nombre,
      whatsapp: datos.whatsapp
    }));

    const req = new Request(`http://localhost:3000/api/clientes/${fakeClienteId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: 'Camila M. Actualizada', whatsapp: '0991122334' })
    });

    const res = await putCliente(req, {
      params: Promise.resolve({ id: fakeClienteId })
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.nombre, 'Camila M. Actualizada');
  });

  // 8. DELETE /api/clientes/[id]
  await t.test('DELETE /api/clientes/[id] elimina y retorna 200', async () => {
    // @ts-ignore
    mock.method(clienteService, 'eliminarCliente', async () => true);

    const req = new Request(`http://localhost:3000/api/clientes/${fakeClienteId}`, {
      method: 'DELETE'
    });

    const res = await deleteCliente(req, {
      params: Promise.resolve({ id: fakeClienteId })
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.mensaje, 'Cliente eliminado correctamente');
  });

  // 9. GET /api/dashboard/metricas
  await t.test('GET /api/dashboard/metricas retorna KPIs calculados y cache headers', async () => {
    // @ts-ignore
    mock.method(dashboardService, 'obtenerMetricas', async (filtro) => ({
      kpis: {
        totalClientes: 42,
        totalPortafolios: 15,
        ingresosTotales: 1850.50,
        totalServicios: 68
      },
      serviciosTop: [
        { _id: 'Corte', cantidad: 30 },
        { _id: 'Tinte', cantidad: 22 }
      ]
    }));

    const req = new Request('http://localhost:3000/api/dashboard/metricas?filtro=mes');
    const res = await getDashboardMetricas(req);

    assert.equal(res.status, 200);
    assert.equal(res.headers.get('Cache-Control'), 'no-store, no-cache, must-revalidate, private');
    const data = await res.json();
    assert.equal(data.kpis.totalClientes, 42);
    assert.equal(data.kpis.ingresosTotales, 1850.50);
    assert.equal(data.serviciosTop.length, 2);
  });

  // 10. GET /api/portafolio
  await t.test('GET /api/portafolio retorna lista de transformaciones con 200', async () => {
    // @ts-ignore
    mock.method(portafolioService, 'obtenerPortafolios', async () => [
      {
        _id: fakePortafolioId,
        tipoServicio: 'Corte',
        descripcion: 'Corte estilo mariposa',
        fotoAntesUrl: '/uploads/antes-1.webp',
        fotoDespuesUrl: '/uploads/despues-1.webp',
        fechaCreacion: new Date()
      }
    ]);

    const res = await getPortafolios();
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(Array.isArray(data), true);
    assert.equal(data[0].tipoServicio, 'Corte');
  });

  // 11. PUT /api/portafolio/[id] valida tipoServicio invalido
  await t.test('PUT /api/portafolio/[id] rechaza tipoServicio invalido con 400', async () => {
    const req = new Request(`http://localhost:3000/api/portafolio/${fakePortafolioId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipoServicio: 'InvalidoTipo', descripcion: 'Test' })
    });

    const res = await putPortafolio(req, {
      params: Promise.resolve({ id: fakePortafolioId })
    });

    assert.equal(res.status, 400);
    const data = await res.json();
    assert.ok(data.errores.some((e: string) => e.includes('tipo de servicio')));
  });

  // 12. PUT /api/portafolio/[id] actualiza exitosamente con 200
  await t.test('PUT /api/portafolio/[id] actualiza metadatos y retorna 200', async () => {
    // @ts-ignore
    mock.method(portafolioService, 'actualizarPortafolio', async (id, datos) => ({
      _id: id,
      tipoServicio: datos.tipoServicio,
      descripcion: datos.descripcion
    }));

    const req = new Request(`http://localhost:3000/api/portafolio/${fakePortafolioId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipoServicio: 'Balayage', descripcion: 'Balayage rubio cenizo' })
    });

    // Balayage maps to 'Otros' or let's test with 'Keratina'
    const reqValid = new Request(`http://localhost:3000/api/portafolio/${fakePortafolioId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipoServicio: 'Keratina', descripcion: 'Tratamiento alisador' })
    });

    const res = await putPortafolio(reqValid, {
      params: Promise.resolve({ id: fakePortafolioId })
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.tipoServicio, 'Keratina');
  });

  // 13. DELETE /api/portafolio/[id]
  await t.test('DELETE /api/portafolio/[id] elimina elemento y retorna 200', async () => {
    // @ts-ignore
    mock.method(portafolioService, 'eliminarPortafolio', async () => true);

    const req = new Request(`http://localhost:3000/api/portafolio/${fakePortafolioId}`, {
      method: 'DELETE'
    });

    const res = await deletePortafolio(req, {
      params: Promise.resolve({ id: fakePortafolioId })
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.mensaje, 'Elemento eliminado correctamente');
  });
});
