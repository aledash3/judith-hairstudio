'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Visita {
  _id?: string;
  fecha: string;
  servicio: string;
  monto: number;
}

interface Cliente {
  _id: string;
  nombre: string;
  whatsapp: string;
  totalVisitas: number;
  historialVisitas?: Visita[];
  fechaRegistro: string;
}

export default function ClientesPage() {
  const telefonoEcuadorRegex = /^09\d{8}$/;
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [editandoClienteId, setEditandoClienteId] = useState<string | null>(null);

  // Estados para añadir visita rápida
  const [selectedCliente, setSelectedCliente] = useState('');
  const [tipoServicio, setTipoServicio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');

  const cargarClientes = async () => {
    try {
      const res = await fetch('/api/clientes');
      if (res.ok) {
        const data = await res.json();
        setClientes(data);
      }
    } catch (err) {
      console.error('Error cargando clientes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const handleGuardarCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    const nombreNormalizado = nombre.trim().replace(/\s+/g, ' ');
    const whatsappNormalizado = whatsapp.trim();

    if (!telefonoEcuadorRegex.test(whatsappNormalizado)) {
      alert('Corrige el número: debe iniciar con 09 y tener exactamente 10 dígitos. Ejemplo: 0995436787.');
      return;
    }

    const clienteDuplicado = clientes.some((c) => {
      const mismoNombre = c.nombre.trim().toLowerCase() === nombreNormalizado.toLowerCase();
      const mismoTelefono = c.whatsapp.trim() === whatsappNormalizado;
      const esOtro = c._id !== editandoClienteId;
      return mismoNombre && mismoTelefono && esOtro;
    });

    if (clienteDuplicado) {
      alert('Este usuario ya se encuentra registrado.');
      return;
    }

    try {
      if (editandoClienteId) {
        const res = await fetch(`/api/clientes/${editandoClienteId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre: nombreNormalizado, whatsapp: whatsappNormalizado }),
        });
        if (!res.ok) throw new Error('Error al actualizar cliente');
        alert('Cliente actualizado con éxito.');
      } else {
        const res = await fetch('/api/clientes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre: nombreNormalizado, whatsapp: whatsappNormalizado }),
        });
        if (!res.ok) throw new Error('Error al registrar cliente');
        alert('Cliente registrado con éxito.');
      }
      resetFormularioCliente();
      cargarClientes();
    } catch (err) {
      alert((err as Error).message || 'Error al procesar la solicitud.');
    }
  };

  const handleIniciarEdicionCliente = (c: Cliente) => {
    setEditandoClienteId(c._id);
    setNombre(c.nombre);
    setWhatsapp(c.whatsapp);
  };

  const handleEliminarCliente = async (id: string, nombreCliente: string) => {
    if (window.confirm(`¿Seguro que deseas eliminar a "${nombreCliente}"?`)) {
      try {
        const res = await fetch(`/api/clientes/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Error al eliminar');
        alert('Cliente eliminado.');
        if (editandoClienteId === id) resetFormularioCliente();
        cargarClientes();
      } catch {
        alert('Error al eliminar cliente.');
      }
    }
  };

  const resetFormularioCliente = () => {
    setEditandoClienteId(null);
    setNombre('');
    setWhatsapp('');
  };

  const handleAgregarVisita = async (e: React.FormEvent) => {
    e.preventDefault();
    const servicioCompleto = `${tipoServicio} - ${descripcion}`;
    const montoNumerico = Number(monto);

    if (!Number.isFinite(montoNumerico)) {
      alert('Ingresa un monto válido.');
      return;
    }

    if (montoNumerico < 0) {
      alert('No se puede ingresar valores negativos en el ingreso del efectivo.');
      return;
    }

    try {
      const res = await fetch(`/api/clientes/${selectedCliente}/visitas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ servicio: servicioCompleto, monto: montoNumerico }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.errores?.join('\n') || data.mensaje || 'Error al registrar visita');
      }
      alert('Visita agregada correctamente.');
      setTipoServicio('');
      setDescripcion('');
      setMonto('');
      setSelectedCliente('');
      cargarClientes();
    } catch (err) {
      alert((err as Error).message || 'Error al registrar visita.');
    }
  };

  return (
    <div className="clientes-view">
      <h1 className="page-title">Directorio de Clientes</h1>

      <div className="grid-forms">
        {/* Formulario Cliente */}
        <div className="card form-card">
          <h2>{editandoClienteId ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}</h2>
          <form onSubmit={handleGuardarCliente}>
            <div className="form-group">
              <label>Nombre Completo</label>
              <input
                type="text"
                placeholder="Ej. Ana Belén Moreno"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>WhatsApp (Ecuador 09...)</label>
              <input
                type="text"
                placeholder="0995436787"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-primary">
                {editandoClienteId ? 'Guardar Cambios' : 'Registrar'}
              </button>
              {editandoClienteId && (
                <button type="button" className="btn btn-secondary" onClick={resetFormularioCliente}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Formulario Visita */}
        <div className="card form-card">
          <h2>Registrar Visita & Servicio</h2>
          <form onSubmit={handleAgregarVisita}>
            <div className="form-group">
              <label>Seleccionar Cliente</label>
              <select
                value={selectedCliente}
                onChange={(e) => setSelectedCliente(e.target.value)}
                required
              >
                <option value="">-- Seleccionar --</option>
                {clientes.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.nombre} ({c.whatsapp})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Tipo de Servicio</label>
              <select
                value={tipoServicio}
                onChange={(e) => setTipoServicio(e.target.value)}
                required
              >
                <option value="">-- Seleccionar --</option>
                <option value="Corte">Corte</option>
                <option value="Tinte">Tinte / Coloración</option>
                <option value="Keratina">Keratina / Alisado</option>
                <option value="Peinado">Peinado / Cepillado</option>
                <option value="Otros">Otros</option>
              </select>
            </div>
            <div className="form-group">
              <label>Detalle / Técnica</label>
              <input
                type="text"
                placeholder="Ej. Balayage cenizo con matizado"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Monto Cobrado ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="25.00"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-accent">
              Registrar Visita
            </button>
          </form>
        </div>
      </div>

      {/* Listado de Clientes */}
      <div className="card table-card" style={{ marginTop: '2rem' }}>
        <h2>Clientes Frecuentes ({clientes.length})</h2>
        {loading ? (
          <p className="loading-state">Cargando directorio...</p>
        ) : clientes.length === 0 ? (
          <p className="no-data">No existen clientes registrados aún.</p>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>WhatsApp</th>
                  <th>Visitas</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <Link
                        href={`/clientes/${c._id}`}
                        style={{ fontWeight: 600, color: 'var(--primary)', textDecoration: 'none' }}
                      >
                        {c.nombre}
                      </Link>
                    </td>
                    <td>{c.whatsapp}</td>
                    <td>
                      <span className="badge badge-visitas">{c.totalVisitas}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <Link
                          href={`/clientes/${c._id}`}
                          className="btn-action btn-view"
                        >
                          👁️ Ficha
                        </Link>
                        <button
                          className="btn-action btn-edit"
                          onClick={() => handleIniciarEdicionCliente(c)}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-action btn-delete"
                          onClick={() => handleEliminarCliente(c._id, c.nombre)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
